const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function hashKey(syncKey) {
  return crypto.createHash("sha256").update(String(syncKey || "")).digest("hex");
}

app.post("/api/sync/pull", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: "服务器还没有配置 Supabase 环境变量" });
    const syncKey = String(req.body.syncKey || "").trim();
    if (!syncKey) return res.status(400).json({ success: false, message: "缺少同步码" });

    const { data, error } = await supabase
      .from("mimi_study_state")
      .select("state, updated_at")
      .eq("sync_key_hash", hashKey(syncKey))
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, state: data ? data.state : null, updated_at: data ? data.updated_at : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "读取失败" });
  }
});

app.post("/api/sync/push", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: "服务器还没有配置 Supabase 环境变量" });
    const syncKey = String(req.body.syncKey || "").trim();
    const state = req.body.state;
    if (!syncKey) return res.status(400).json({ success: false, message: "缺少同步码" });
    if (!state || typeof state !== "object") return res.status(400).json({ success: false, message: "缺少打卡数据" });

    const { error } = await supabase.from("mimi_study_state").upsert({
      sync_key_hash: hashKey(syncKey),
      state,
      updated_at: new Date().toISOString()
    }, { onConflict: "sync_key_hash" });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "上传失败" });
  }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log("mimi study cloud sync site running on " + PORT));
