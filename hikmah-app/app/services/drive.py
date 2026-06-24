from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2.credentials import Credentials
import io


def get_drive_service(token_data: dict):
    creds = Credentials(
        token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
    )
    return build("drive", "v3", credentials=creds)


def list_pdf_files(token_data: dict, folder_id: str = None, page_token: str = None):
    service = get_drive_service(token_data)
    query = "mimeType='application/pdf' and trashed=false"
    if folder_id:
        query += f" and '{folder_id}' in parents"

    results = service.files().list(
        q=query,
        pageSize=50,
        fields="nextPageToken, files(id, name, size, modifiedTime)",
        orderBy="modifiedTime desc",
        pageToken=page_token,
    ).execute()

    return results.get("files", []), results.get("nextPageToken")


def list_folders(token_data: dict, parent_id: str = "root"):
    service = get_drive_service(token_data)
    query = f"mimeType='application/vnd.google-apps.folder' and '{parent_id}' in parents and trashed=false"
    results = service.files().list(
        q=query,
        pageSize=50,
        fields="files(id, name)",
        orderBy="name",
    ).execute()
    return results.get("files", [])


def download_pdf(token_data: dict, file_id: str) -> bytes:
    service = get_drive_service(token_data)
    request = service.files().get_media(fileId=file_id)
    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    return buffer.getvalue()
