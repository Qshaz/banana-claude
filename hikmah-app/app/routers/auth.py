from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from google_auth_oauthlib.flow import Flow
from app.config import settings
import json
from itsdangerous import URLSafeSerializer

router = APIRouter(prefix="/api/auth", tags=["auth"])

_signer = URLSafeSerializer(settings.SECRET_KEY, salt="session")


def _get_flow(redirect_uri: str = None):
    return Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=settings.GOOGLE_SCOPES,
        redirect_uri=redirect_uri or f"{settings.APP_URL}/api/auth/callback",
    )


def get_session(request: Request) -> dict | None:
    token = request.cookies.get("hikmah_session")
    if not token:
        return None
    try:
        return _signer.loads(token)
    except Exception:
        return None


def set_session(response: Response, data: dict):
    token = _signer.dumps(data)
    response.set_cookie(
        "hikmah_session",
        token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
    )


@router.get("/login")
def login(request: Request):
    flow = _get_flow()
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    response = RedirectResponse(auth_url)
    response.set_cookie("oauth_state", state, httponly=True, secure=True, samesite="lax", max_age=600)
    return response


@router.get("/callback")
def callback(request: Request, code: str = None, state: str = None, error: str = None):
    if error:
        return RedirectResponse(f"/?error={error}")

    flow = _get_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials

    session_data = {
        "access_token": creds.token,
        "refresh_token": creds.refresh_token,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
    }

    response = RedirectResponse("/?auth=success")
    set_session(response, session_data)
    return response


@router.get("/logout")
def logout():
    response = RedirectResponse("/")
    response.delete_cookie("hikmah_session")
    return response


@router.get("/status")
def status(request: Request):
    session = get_session(request)
    return JSONResponse({"authenticated": session is not None})
