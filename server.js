const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function hashKey(syncKey) {
  return crypto.createHash("sha256").update(String(syncKey || "")).digest("hex");
}

function requireSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("服务器还没有配置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY");
  }
}

async function supabaseRequest(endpoint, options = {}) {
  requireSupabase();
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data && data.message ? data.message : text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

app.post("/api/sync/pull", async (req, res) => {
  try {
    const syncKey = String(req.body.syncKey || "").trim();
    if (!syncKey) return res.status(400).json({ success: false, message: "缺少同步码" });

    const sync_key_hash = hashKey(syncKey);
    const data = await supabaseRequest(`mimi_study_state?sync_key_hash=eq.${encodeURIComponent(sync_key_hash)}&select=state,updated_at&limit=1`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const row = Array.isArray(data) && data.length ? data[0] : null;
    res.json({ success: true, state: row ? row.state : null, updated_at: row ? row.updated_at : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "读取失败" });
  }
});

app.post("/api/sync/push", async (req, res) => {
  try {
    const syncKey = String(req.body.syncKey || "").trim();
    const state = req.body.state;
    if (!syncKey) return res.status(400).json({ success: false, message: "缺少同步码" });
    if (!state || typeof state !== "object") return res.status(400).json({ success: false, message: "缺少打卡数据" });

    await supabaseRequest("mimi_study_state", {
      method: "POST",
      headers: {
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        sync_key_hash: hashKey(syncKey),
        state,
        updated_at: new Date().toISOString()
      })
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "上传失败" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("mimi study cloud sync REST site running on " + PORT);
});
