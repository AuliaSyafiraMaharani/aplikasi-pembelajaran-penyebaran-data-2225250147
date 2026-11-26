import "dotenv/config"; // harus paling atas: memuat server/.env ke process.env
import express from "express";
import rateLimit from "express-rate-limit";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "50kb" }));

// Batasi 30 permintaan/menit per alamat IP.
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi." },
  })
);

// Cek cepat apakah server hidup dan API key sudah terbaca (tanpa menampilkan key).
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("PERINGATAN: GEMINI_API_KEY belum diisi. Salin server/.env.example menjadi server/.env.");
  }
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
