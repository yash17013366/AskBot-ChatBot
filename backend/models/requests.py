from pydantic import BaseModel, Field
from typing import List, Literal


class ConnectRequest(BaseModel):
    api_key: str = Field(..., min_length=1, description="Google Gemini API key provided by the user")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    api_key: str = Field(..., min_length=1)
    persona: str = Field(default="student")
    message: str = Field(..., min_length=1)
    history: List[ChatMessage] = Field(default_factory=list)


class ExpandRequest(BaseModel):
    api_key: str = Field(..., min_length=1)
    persona: str = Field(default="student")
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
