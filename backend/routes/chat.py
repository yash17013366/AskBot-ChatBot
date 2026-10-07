from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.models.requests import ChatRequest, ExpandRequest
from backend.services.gemini_service import (
    generate_chat_response,
    generate_expanded_response,
    sanitize_error
)

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
def chat_with_gemini(req: ChatRequest):
    """
    Handle a user message with the chosen persona and recent 5-exchange history.
    """
    if not req.message.strip():
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "Message cannot be empty."}
        )

    try:
        reply = generate_chat_response(
            api_key=req.api_key,
            persona=req.persona,
            message=req.message,
            history=req.history
        )
        return {"success": True, "reply": reply}
    except Exception as exc:
        clean_msg, status_code = sanitize_error(exc)
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "message": clean_msg}
        )


@router.post("/expand")
def expand_answer(req: ExpandRequest):
    """
    Expand upon a previous AI answer for the 'Tell me more' feature.
    """
    if not req.question.strip() or not req.answer.strip():
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "Original question and answer are required to expand."}
        )

    try:
        reply = generate_expanded_response(
            api_key=req.api_key,
            persona=req.persona,
            question=req.question,
            answer=req.answer
        )
        return {"success": True, "reply": reply}
    except Exception as exc:
        clean_msg, status_code = sanitize_error(exc)
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "message": clean_msg}
        )
