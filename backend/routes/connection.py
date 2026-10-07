from fastapi import APIRouter
from fastapi.responses import JSONResponse

try:
    from backend.models.requests import ConnectRequest
    from backend.services.gemini_service import verify_api_key, sanitize_error
except ModuleNotFoundError:
    from models.requests import ConnectRequest
    from services.gemini_service import verify_api_key, sanitize_error

router = APIRouter(prefix="/api", tags=["connection"])


@router.post("/connect")
def connect_gemini(req: ConnectRequest):
    """
    Test user-provided Gemini API key with a lightweight request.
    Never stores or logs the key.
    """
    try:
        result = verify_api_key(req.api_key)
        return result
    except Exception as exc:
        clean_msg, status_code = sanitize_error(exc)
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "message": clean_msg}
        )
