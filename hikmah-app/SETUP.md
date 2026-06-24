# Hikmah — Setup Guide

Everything you need to get Hikmah running. Takes about 20-30 minutes.
You will need to be at your laptop for this.

---

## What you'll set up

1. Google Cloud project (free) — so the app can read your Google Drive
2. Gemini API key (free) — for understanding your books
3. Anthropic API key (small cost per question) — for writing answers
4. Google Cloud Run (free tier) — where the app lives

---

## Step 1: Create a Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Sign in with your Google account
3. At the top, click **"Select a project"** → **"New Project"**
4. Name it `hikmah` → click **Create**
5. Make sure the new project is selected in the top dropdown

---

## Step 2: Enable the Google Drive API

1. In the search bar at the top, type **"Google Drive API"**
2. Click it → click **"Enable"**

---

## Step 3: Create OAuth Credentials

1. In the left menu, go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. If prompted, click **"Configure Consent Screen"** first:
   - Choose **External** → Create
   - App name: `Hikmah`
   - User support email: your email
   - Developer contact: your email
   - Click Save → Continue (through all steps) → Back to Dashboard
4. Back at Credentials → **"+ Create Credentials"** → **"OAuth client ID"**
5. Application type: **Web application**
6. Name: `Hikmah`
7. Under **Authorized redirect URIs**, click **Add URI** and paste:
   ```
   https://YOUR-CLOUD-RUN-URL/api/auth/callback
   ```
   (You'll come back to fill in the real URL after deploying. For now add `http://localhost:8080/api/auth/callback`)
8. Click **Create**
9. A popup shows your **Client ID** and **Client Secret** — copy both and save them somewhere safe

---

## Step 4: Get a Gemini API Key (Free)

1. Go to **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy the key

---

## Step 5: Get an Anthropic API Key

1. Go to **https://console.anthropic.com/**
2. Sign up or log in
3. Go to **API Keys** → **Create Key**
4. Copy the key
5. Add a small amount of credit ($5 is plenty — each question costs ~$0.01)

---

## Step 6: Deploy to Google Cloud Run

### Option A: Using the Google Cloud Console (easiest)

1. Go to **https://console.cloud.google.com/run**
2. Click **"Create Service"**
3. Choose **"Continuously deploy from a repository"**
4. Connect your GitHub account and select the `qshaz/hikmah` repo
5. Set source to the `hikmah-app/` folder
6. Region: choose the closest to you (e.g. `europe-west1` for Europe)
7. Under **"Authentication"**: select **"Allow unauthenticated invocations"** (the app handles its own login)
8. Expand **"Container, Networking, Security"**:
   - Under **"Volume mounts"**, add a volume for `/data` (this is where your library is stored permanently)
9. Under **Environment Variables**, add all variables from `.env.example` with your real values
10. Click **Deploy**

### Option B: Using the terminal (if you're comfortable with it)

```bash
cd hikmah-app
gcloud run deploy hikmah \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLIENT_ID=...,GOOGLE_CLIENT_SECRET=...,GEMINI_API_KEY=...,ANTHROPIC_API_KEY=...,SECRET_KEY=...,APP_URL=https://YOUR_URL.run.app"
```

---

## Step 7: Update your OAuth redirect URL

1. Once deployed, copy your Cloud Run URL (looks like `https://hikmah-xxxxx-ew.a.run.app`)
2. Go back to **Google Cloud Console → APIs & Services → Credentials**
3. Click your OAuth client → add the real redirect URI:
   ```
   https://hikmah-xxxxx-ew.a.run.app/api/auth/callback
   ```
4. Also set `APP_URL` in your Cloud Run environment variables to this URL

---

## Step 8: Add your Google account as a test user

While in "External" mode, you need to add yourself:

1. Go to **APIs & Services → OAuth consent screen**
2. Under **Test users**, click **+ Add Users**
3. Add your Gmail address
4. Save

---

## You're done!

Open your Cloud Run URL in any browser — iPhone, Huawei tablet, laptop, anywhere.

- Sign in with your Google account
- Go to **Add Books** and browse your Drive to pick PDFs
- Hikmah will index them (takes a few minutes per book)
- Then go to **Ask** and start exploring your library

---

## Costs

| Thing | Cost |
|---|---|
| Google Cloud Run | Free (well within free tier for personal use) |
| Google Drive storage | Already yours |
| Gemini embeddings | Free |
| Claude questions | ~$0.01 per question |

A month of daily use = roughly $0.30–$1 in Claude API costs.

---

## Moving your PDFs from iPhone to Google Drive

1. Open the **Files** app on iPhone
2. Navigate to your PDFs folder
3. Tap **Select** (top right) → **Select All**
4. Tap the **Share** icon → **Save to Drive**
5. Choose your account and a folder (e.g. create `Hikmah Library`)
6. Done — they'll appear in Drive within minutes
