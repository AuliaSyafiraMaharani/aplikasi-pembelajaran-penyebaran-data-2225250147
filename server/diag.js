import "dotenv/config";

const key = process.env.GEMINI_API_KEY;
const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
console.log("Node:", process.version, "| key terbaca:", Boolean(key));

async function tes(nama, body) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(40000),
    });
    const text = await res.text();
    console.log(`${nama}: HTTP ${res.status} dalam ${Date.now() - t0} ms`);
    console.log("  ", text.slice(0, 200).replace(/\s+/g, " "));
  } catch (e) {
    console.log(`${nama}: GAGAL setelah ${Date.now() - t0} ms ->`, e.name, e.cause?.code || e.message);
  }
}

const pesan = [{ role: "user", content: "Balas satu kata: halo" }];
await tes("A (sederhana)", { model, messages: pesan });
await tes("B (seperti server)", { model, messages: pesan, temperature: 0.4, max_tokens: 1200, reasoning_effort: "low" });