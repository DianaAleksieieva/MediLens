from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from llm_wrapper import graph

app = FastAPI()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatState(BaseModel):
    messages: List[ChatMessage]
    pill_name: str | None

""" 
Expects the body of the request to contain a JSON object with two properties:
- messages: a list of chat messages in the form of role & content representing the history of the chat
- pill_name: optional, the name of the pill in question
"""
@app.post('/ask')
def ask_llm(state: ChatState):
    result = graph.invoke(state)
    return {"response": result["messages"][-1]["content"]}
