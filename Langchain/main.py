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
    
    # Ensure messages are in the format expected by the LLM
    if isinstance(messages[-1], dict) and "role" in messages[-1] and "content" in messages[-1]:
        response = llm.invoke(messages)
    else:
        raise ValueError("Messages must be a list of {role, content} dicts")

    return {
        "messages": messages + [response],
        "pill_name": None
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
        "pill_name": pill_name
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

# # Example usage
# input_state = {
#     "messages": [{"role": "user", "content": "Tell me about the pill Eczema Real Relief"}],
#     "pill_name": None
# }

# result = graph.invoke(input_state)

# print("🤖", result["messages"][-1]["content"])
# # Initial question
# messages = [{"role": "user", "content": "Tell me about the pill Eczema Real Relief"}]
# state = {"messages": messages, "pill_name": None}
# result = graph.invoke(state)
# print("🤖", result["messages"][-1]["content"])

# # Follow-up question, reuse pill_name from last state
# messages = result["messages"] + [{"role": "user", "content": "Can a child of 8 years take this pill?"}]
# state = {"messages": messages, "pill_name": result["pill_name"]}  # <--- keep pill_name here
# result2 = graph.invoke(state)
# last_message = result2["messages"][-1]
# print("🤖", last_message.content if hasattr(last_message, "content") else last_message["content"])

