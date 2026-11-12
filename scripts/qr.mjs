// Do Rio à Cuia | Gera o PNG do QR code de cada ponto (D-024, no lugar do admin).
// Uso: node scripts/qr.mjs [endereço base] [slug ...]
// Sem argumentos: produção e os 3 pontos de demonstração. Saída em qr-codes/ (fora do git).
import { mkdir } from "node:fs/promises";
import QRCode from "qrcode";

const [base = "https://do-rio-a-cuia.vercel.app", ...slugs] = process.argv.slice(2);
const lista = slugs.length ? slugs : ["demo-valido", "demo-vencido", "demo-origem"];

await mkdir("qr-codes", { recursive: true });
for (const slug of lista) {
  const url = `${base.replace(/\/$/, "")}/p/${slug}`;
  await QRCode.toFile(`qr-codes/${slug}.png`, url, {
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#2B0F38", light: "#FFFFFF" },
  });
  console.log(`ok ${slug} -> ${url}`);
}
