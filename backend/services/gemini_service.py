"""Gemini Service handling all interactions with Google Gen AI SDK."""

import os
import logging
from typing import List, Dict, Any, Tuple
from google import genai
from google.genai import types, errors
from backend.models.requests import ChatMessage
from backend.services.prompts import get_system_instruction, get_expand_prompt

logger = logging.getLogger(__name__)

# Fast, currently supported Flash-class Gemini model
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def create_gemini_client(api_key: str) -> genai.Client:
    """Instantiate a Gemini client using the user-provided API key."""
    if not api_key or not api_key.strip():
        raise ValueError("Gemini API key is required.")
    return genai.Client(api_key=api_key.strip())


def sanitize_error(exc: Exception) -> Tuple[str, int]:
    """
    Map internal Gemini/network exceptions to clean, user-friendly error messages
    without leaking API keys, file paths, or raw stack traces.
    """
    err_str = str(exc).lower()

    if isinstance(exc, errors.APIError):
        code = getattr(exc, "code", 400)
        message = getattr(exc, "message", str(exc))
        msg_lower = message.lower()

        if "api_key_invalid" in msg_lower or "api key not valid" in msg_lower or code == 400 and "key" in msg_lower:
            return "Invalid Gemini API key. Please check your key and try again.", 401
        if "quota" in msg_lower or "resource_exhausted" in msg_lower or code == 429:
            return "Gemini API quota or rate limit exceeded. Please try again in a few moments.", 429
        if "permission_denied" in msg_lower or code == 403:
            return "Access denied for this Gemini API key. Please verify your permissions in Google AI Studio.", 403
        if "not_found" in msg_lower or code == 404:
            return f"Model '{GEMINI_MODEL}' not found or unavailable in your region.", 404

        return f"Gemini API error: {message}", 502

    if "api key" in err_str or "unauthorized" in err_str or "401" in err_str:
        return "Invalid Gemini API key. Please check your key and try again.", 401

    if "quota" in err_str or "rate limit" in err_str or "429" in err_str:
        return "Gemini API quota exceeded. Please try again shortly.", 429

    return "Unable to connect to Google Gemini. Please check your network connection and try again.", 502


def verify_api_key(api_key: str) -> Dict[str, Any]:
    """
    Verifies the supplied API key by making a lightweight test request.
    Returns {"success": True, "message": "LLM Connected"} on success.
    """
    client = create_gemini_client(api_key)
    # Lightweight request: simple test prompt with max 5 output tokens
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents="Hi",
        config=types.GenerateContentConfig(
            max_output_tokens=5,
            temperature=0.1
        )
    )
    if response and response.text is not None:
        return {"success": True, "message": "LLM Connected"}
    return {"success": False, "message": "Verification received an empty response from Gemini."}


def generate_chat_response(
    api_key: str,
    persona: str,
    message: str,
    history: List[ChatMessage]
) -> str:
    """
    Generates a response using Gemini, injecting base + persona instructions
    and formatting the recent conversation history.
    """
    client = create_gemini_client(api_key)
    system_instruction = get_system_instruction(persona)

    # Format previous history into Gemini contents
    gemini_contents: List[types.Content] = []
    for item in history:
        # Gemini expects 'user' or 'model' roles
        role = "user" if item.role == "user" else "model"
        gemini_contents.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=item.content)]
            )
        )

    # Add the current user message
    gemini_contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=message)]
        )
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=gemini_contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )

    if not response or not response.text:
        return "I could not generate a response. Please try rephrasing your message."

    return response.text.strip()


def generate_expanded_response(
    api_key: str,
    persona: str,
    question: str,
    answer: str
) -> str:
    """
    Generates an expanded explanation for a previous AI answer.
    """
    client = create_gemini_client(api_key)
    expand_prompt = get_expand_prompt(persona, question, answer)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=expand_prompt,
        config=types.GenerateContentConfig(
            temperature=0.6,
        )
    )

    if not response or not response.text:
        return "I could not expand on this topic at the moment. Please try again."

    return response.text.strip()
