# Deploying AI Fusion Chat to Render

Follow these steps to deploy your application to Render. This setup serves the frontend from the backend, creating a single service.

## 1. Push Code to GitHub

Ensure all your latest changes, including the new `package.json` in the root folder, are pushed to your GitHub repository.

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## 2. Create Web Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository (`AI-Fusion-Chat`).
4.  Configure the service with the following details:

    - **Name**: `ai-fusion-chat` (or any unique name)
    - **Region**: Closest to you (e.g., Singapore, Ohio)
    - **Branch**: `main`
    - **Root Directory**: Leave empty (defaults to root `.`)
    - **Runtime**: `Node`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
    - **Instance Type**: Free (or Starter if you want it always on)

## 3. Environment Variables

Scroll down to the **Environment Variables** section and add the following keys. You can find these values in your local `.env` files.

| Key                     | Value                                                     |
| ----------------------- | --------------------------------------------------------- |
| `NODE_ENV`              | `production`                                              |
| `MONGODB_URI`           | `mongodb+srv://...` (Your full MongoDB connection string) |
| `JWT_SECRET`            | `your_jwt_secret`                                         |
| `CLOUDINARY_CLOUD_NAME` | `...`                                                     |
| `CLOUDINARY_API_KEY`    | `...`                                                     |
| `CLOUDINARY_API_SECRET` | `...`                                                     |
| `GEMINI_API_URL`        | `...`                                                     |
| `GEMINI_API_KEY`        | `...`                                                     |
| `GOOGLE_CLIENT_ID`      | `...` (From your backend .env)                            |

**Note for Frontend Variables:**
Since we are building the frontend during the deployment, we must also provide the frontend environment variables here.

| Key                     | Value                            |
| ----------------------- | -------------------------------- |
| `VITE_GOOGLE_CLIENT_ID` | `...` (Same as GOOGLE_CLIENT_ID) |

## 4. Deploy

Click **Create Web Service**. Render will start building your app. It will:

1.  Install frontend dependencies.
2.  Build the frontend.
3.  Install backend dependencies.
4.  Start the backend server.

## 5. Keep "Always On" (Free Tier)

If you are using the **Free Tier**, Render puts your app to sleep after 15 minutes of inactivity. When someone visits, it takes ~30 seconds to wake up.

To keep it running 24/7 for free:

1.  Sign up for a free account at [UptimeRobot](https://uptimerobot.com/).
2.  Click **Add New Monitor**.
3.  **Monitor Type**: HTTP(s).
4.  **Friendly Name**: Fusion Chat.
5.  **URL**: `https://your-app-name.onrender.com/ping` (This calls the lightweight health check route we added).
6.  **Monitoring Interval**: 5 minutes.
7.  Click **Create Monitor**.

This will ping your server every 5 minutes, preventing it from sleeping.
