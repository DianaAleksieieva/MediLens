from dotenv import load_dotenv
load_dotenv()

import os
from langchain.chat_models import init_chat_model
from langgraph.graph import END, StateGraph
from functions.get_pill_info import get_pill_info
from typing import TypedDict

# Initialize the Gemini model
llm = init_chat_model("google_genai:gemini-2.0-flash")

class GraphState(TypedDict):
    messages: list
    pill_name: str | None

def call_llm(state: GraphState) -> GraphState:
    messages = state["messages"]
    pill_data = state.get("pill_data", "")

    system_prompt = {
    "role": "system",
    "content": (
        "You are a helpful medicine information assistant.\n\n"
        "Here is the official FDA data about the medicine:\n"
        f"{pill_data}\n\n"
        "If the user asks about side effects or other details missing from the official data, "
        "provide a clear and friendly explanation of common side effects or relevant information based on general medical knowledge. "
        "Use bullet points or lists where appropriate.\n"
        "Always include this disclaimer:\n"
        "⚠️ This information is based on general knowledge and may not reflect official FDA data. "
        "Please consult a healthcare provider for personalized advice.\n"
        "Keep answers easy to understand and informative."
    )
}


    full_messages = [system_prompt] + messages

    response = llm.invoke(full_messages)

    return {
        "messages": messages + [response],
        "pill_name": state.get("pill_name"),
        "pill_data": pill_data
    }




def router(state: GraphState) -> str:
    user_msg = state["messages"][-1]["content"].lower()
    pill_name = state.get("pill_name")
    
    # Only call pill tool if pill_name is None and message contains keywords
    if pill_name is None and ("pill" in user_msg or "medicine" in user_msg):
        return "pill_tool"
    # Otherwise, use LLM for follow-up or unrelated questions
    return "llm"

def call_pill_tool(state: GraphState) -> GraphState:
    user_msg = state["messages"][-1]["content"]
    pill_name = user_msg.replace("pill", "").replace("medicine", "").strip()
    tool_result = get_pill_info(pill_name)
    return {
        "messages": state["messages"] + [{"role": "assistant", "content": tool_result}],
        "pill_name": pill_name,
        "pill_data": tool_result  # ✅ Save extracted data to use later
    }


# Build the graph
builder = StateGraph(GraphState)

builder.add_node("llm", call_llm)
builder.add_node("pill_tool", call_pill_tool)
builder.add_node("router", lambda x: x)
builder.add_conditional_edges("router", router, {
    "llm": "llm",
    "pill_tool": "pill_tool"
})

builder.set_entry_point("router")
builder.add_edge("llm", END)
builder.add_edge("pill_tool", END)

graph = builder.compile()

# Example usage
# input_state = {
#     "messages": [{"role": "user", "content": "Tell me about the pill Sertraline"}],
#     "pill_name": None
# }

# result = graph.invoke(input_state)

# print("🤖", result["messages"][-1]["content"])
# # Initial question
# messages = [{"role": "user", "content": "Tell me about the pill Lisinopril"}]
# state = {"messages": messages, "pill_name": None}
# result = graph.invoke(state)
# print("🤖", result["messages"][-1]["content"])

# # # Follow-up question, reuse pill_name from last state
# messages = result["messages"] + [{"role": "user", "content": "What are the side effects?"}]
# state = {
#     "messages": messages,
#     "pill_name": result["pill_name"],
#    "pill_data": result["messages"][-1]["content"]
# }
# result2 = graph.invoke(state)
# print("🤖", result2["messages"][-1].content)


# # # Follow-up question, reuse pill_name from last state
# messages = result["messages"] + [{"role": "user", "content": "Can it cause dizziness?"}]
# state = {
#     "messages": messages,
#     "pill_name": result["pill_name"],
#     "pill_data": result["messages"][-1]["content"]
# }
# result2 = graph.invoke(state)
# print("🤖", result2["messages"][-1].content)

