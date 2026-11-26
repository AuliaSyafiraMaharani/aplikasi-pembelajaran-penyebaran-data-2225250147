// Satu-satunya tempat yang berbicara langsung dengan Gemini (Google AI Studio).
// Memakai endpoint "OpenAI-compatible" milik Gemini, jadi format pesannya sama.
// API key dibaca dari process.env (server/.env), tidak pernah dikirim ke frontend.

const BASE_URL = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/$/, "");
const TIMEOUT_MS = 20_000;

export class LLMError extends Error {
  constructor(status, publicMessage, detail, retryable = false) {
    super(publicMessage);
    this.status = status; // status HTTP untuk dikirim ke frontend
    this.detail = detail; // detail teknis, hanya untuk log server
    this.retryable = retryable; // true = layak dicoba lagi / pindah ke model cadangan
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Satu kali panggilan ke satu model.
async function requestOnce(apiKey, model, messages, options) {
  const body = {
    model,
    messages,
    temperature: options.temperature ?? 0.4,
    // Model Gemini 3 "berpikir" dulu, dan token berpikir ikut dihitung.
    // Batas dibuat longgar agar jawaban tidak kosong; keringkasan diatur lewat prompt.
    max_tokens: options.maxTokens ?? 1200,
  };
  // Kosongkan GEMINI_REASONING_EFFORT di .env jika model kamu menolak parameter ini.
  const effort = process.env.GEMINI_REASONING_EFFORT ?? "low";
  if (effort) body.reasoning_effort = effort;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const detail = `Gemini HTTP ${res.status} (model ${model}): ${text.slice(0, 300)}`;
      const retryable = res.status === 429 || res.status === 503;
      if (res.status === 429) {
        throw new LLMError(429, "Kuota asisten sedang penuh. Tunggu sebentar lalu coba lagi.", detail, retryable);
      }
      if (res.status === 503) {
        throw new LLMError(503, "Asisten sedang sibuk. Coba lagi beberapa saat.", detail, retryable);
      }
      throw new LLMError(502, "Asisten sedang tidak bisa dihubungi. Coba lagi sebentar.", detail, false);
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new LLMError(502, "Balasan asisten kosong. Coba lagi.", `Balasan kosong (model ${model}): ${JSON.stringify(data).slice(0, 300)}`, false);
    }
    return reply.trim();
  } catch (err) {
    if (err instanceof LLMError) throw err;
    if (err.name === "AbortError") {
      throw new LLMError(504, "Asisten terlalu lama menjawab. Coba lagi.", `Timeout ke Gemini (model ${model})`, true);
    }
    throw new LLMError(502, "Gagal terhubung ke asisten.", `${err} ${err.cause?.code ?? ""}`, false);
  } finally {
    clearTimeout(timer);
  }
}

// Urutan percobaan: model utama -> model utama lagi (setelah jeda 1 detik) -> model cadangan.
// Hanya dilanjutkan jika error-nya sifatnya sementara (sibuk / kuota / timeout).
export async function callLLM(messages, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith("isi_api_key")) {
    throw new LLMError(
      500,
      "Server belum dikonfigurasi (API key kosong).",
      "GEMINI_API_KEY belum diisi di server/.env"
    );
  }

  const primary = process.env.GEMINI_MODEL || "gemini-3.7-flash";
  const fallback = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash"; // kosongkan di .env untuk mematikan
  const plan = [primary, primary];
  if (fallback && fallback !== primary) plan.push(fallback);

  let lastError;
  for (let i = 0; i < plan.length; i++) {
    try {
      return await requestOnce(apiKey, plan[i], messages, options);
    } catch (err) {
      lastError = err;
      if (!(err instanceof LLMError) || !err.retryable || i === plan.length - 1) throw err;
      console.warn(`[llm] percobaan ${i + 1} gagal, mencoba lagi. ${err.detail}`);
      if (i === 0) await sleep(1000);
    }
  }
  throw lastError;
}