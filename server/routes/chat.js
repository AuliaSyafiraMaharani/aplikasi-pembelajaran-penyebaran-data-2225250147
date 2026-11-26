import { Router } from "express";
import { callLLM, LLMError } from "../services/llm.js";
import { getSystemPrompt } from "../pedagogy/systemPrompt.js";

const router = Router();

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

// Validasi input dari frontend agar kuota API tidak disalahgunakan.
function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "messages harus berupa array yang tidak kosong.";
  if (messages.length > MAX_MESSAGES) return `Maksimal ${MAX_MESSAGES} pesan per permintaan.`;
  for (const m of messages) {
    if (!m || !["user", "assistant"].includes(m.role)) return "role harus 'user' atau 'assistant'.";
    if (typeof m.content !== "string" || m.content.trim() === "") return "content harus berupa teks yang tidak kosong.";
    if (m.content.length > MAX_CONTENT_LENGTH) return `Satu pesan maksimal ${MAX_CONTENT_LENGTH} karakter.`;
  }
  if (messages[messages.length - 1].role !== "user") return "Pesan terakhir harus dari 'user'.";
  return null;
}

// POST /api/chat   body: { messages: [{ role: "user"|"assistant", content: "..." }] }
router.post("/", async (req, res) => {
  const problem = validateMessages(req.body?.messages);
  if (problem) return res.status(400).json({ error: problem });

  const messages = [
    { role: "system", content: getSystemPrompt() },
    ...req.body.messages.map(({ role, content }) => ({ role, content })),
  ];

  try {
    const reply = await callLLM(messages);
    res.json({ reply });
  } catch (err) {
    if (err instanceof LLMError) {
      console.error(`[chat] ${err.detail}`); // detail teknis hanya di log server
      return res.status(err.status).json({ error: err.message });
    }
    console.error("[chat] error tak terduga:", err);
    res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
});

export default router;
