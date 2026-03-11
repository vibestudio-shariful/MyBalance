import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(cookieParser());

  const getOAuth2Client = () => {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL?.replace(/\/$/, '')}/auth/google/callback`
    );
  };

  // --- API Routes ---

  // Get Google Auth URL
  app.get("/api/auth/google/url", (req, res) => {
    const client = getOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: "Google Client ID or Secret is not configured in environment variables." });
    }

    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
    res.json({ url });
  });

  // OAuth Callback
  app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      console.error("Authorization code is missing from callback.");
      return res.status(400).send("Authorization code is missing.");
    }

    try {
      const client = getOAuth2Client();
      console.log("Exchanging code for tokens...");
      const { tokens } = await client.getToken(code as string);
      console.log("Tokens received successfully.");
      client.setCredentials(tokens);
      
      console.log("Fetching user info...");
      const oauth2 = google.oauth2({ version: 'v2', auth: client });
      const userInfo = await oauth2.userinfo.get();
      const email = userInfo.data.email || "Unknown Email";
      console.log("User info received:", email);
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_AUTH_SUCCESS', 
                  tokens: ${JSON.stringify(tokens)},
                  email: "${email}"
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. Closing window...</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Error in Google OAuth callback:", error);
      const errorMessage = error.response?.data?.error_description || error.message || "Unknown error";
      res.status(500).send(`Authentication failed: ${errorMessage}`);
    }
  });

  // List backups from Google Drive
  app.post("/api/backup/list", async (req, res) => {
    const { tokens } = req.body;
    if (!tokens) return res.status(400).json({ error: "Missing tokens" });

    try {
      const client = getOAuth2Client();
      client.setCredentials(tokens);
      const drive = google.drive({ version: 'v3', auth: client });
      
      const response = await drive.files.list({
        q: "name contains 'hishab_kitab_backup_' and mimeType = 'application/json'",
        fields: 'files(id, name, createdTime)',
        orderBy: 'createdTime desc'
      });

      res.json({ success: true, files: response.data.files });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Download backup from Google Drive
  app.post("/api/backup/download", async (req, res) => {
    const { tokens, fileId } = req.body;
    if (!tokens || !fileId) return res.status(400).json({ error: "Missing tokens or fileId" });

    try {
      const client = getOAuth2Client();
      client.setCredentials(tokens);
      const drive = google.drive({ version: 'v3', auth: client });
      
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      res.json({ success: true, data: response.data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete backup from Google Drive
  app.post("/api/backup/delete", async (req, res) => {
    const { tokens, fileId } = req.body;
    if (!tokens || !fileId) return res.status(400).json({ error: "Missing tokens or fileId" });

    try {
      const client = getOAuth2Client();
      client.setCredentials(tokens);
      const drive = google.drive({ version: 'v3', auth: client });
      
      await drive.files.delete({
        fileId: fileId
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload to Google Drive
  app.post("/api/backup/google-drive", async (req, res) => {
    const { tokens, data, filename } = req.body;
    if (!tokens || !data) {
      return res.status(400).json({ error: "Missing tokens or data" });
    }

    try {
      const client = getOAuth2Client();
      client.setCredentials(tokens);
      const drive = google.drive({ version: 'v3', auth: client });

      const fileMetadata = {
        name: filename || `hishab_kitab_backup_${new Date().toISOString().split('T')[0]}.json`,
        mimeType: 'application/json',
      };
      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(data),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      res.json({ success: true, fileId: response.data.id });
    } catch (error: any) {
      console.error("Error uploading to Google Drive:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
