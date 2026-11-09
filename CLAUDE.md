Next 16: as APIs certas vêm na nota do PR. A doc em node_modules/next/dist/docs/ (ver AGENTS.md) só quando um check falhar com erro de API do Next, e só a página do erro.

# CLAUDE.md – Do Rio à Cuia

PWA da cadeia do açaí em Belém (Projeto Integrado, CESUPA). Cotação do dia da rasa, verificação do selo Açaí Bom por QR code e checklist do batedor.

## Stack
Next.js 16 (App Router, Turbopack) + TypeScript, Tailwind CSS v4 (tokens em `@theme` no `app/globals.css`), Supabase (`@supabase/ssr` + `@supabase/supabase-js`), react-leaflet + OpenStreetMap, `qrcode`, `lucide-react`. Deploy na Vercel.

## Comandos
- `npm run dev` – desenvolvimento (porta 3000)
- `npm run lint` · `npx tsc --noEmit` · `npm run build`

## Onde está cada coisa
- Telas de referência: `docs/telas/*.png` (Figma, 390 px de largura, exportadas a 780 px). Toda tela nova deve ficar igual ao PNG correspondente.
- Rotas e fluxo: `docs/03_telas_e_fluxo.md` · Tokens e componentes: `docs/04_design_system.md` e `app/globals.css`
- Banco: `supabase/schema.sql` e `supabase/seed.sql` (rodados à mão no SQL Editor do Supabase)
- Componentes base: `components/ui/`

## Regras
- Interface em pt-BR. Moeda com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- "Hoje" é sempre America/Belem. A situação do selo vem da view `v_pontos_status`; não recalcular no front.
- 1 rasa = 2 latas (o banco converte em `valor_rasa`). Preço é anônimo: nunca mostrar quem registrou.
- O app não emite selo; só mostra o selo oficial da prefeitura.
- Rotas `/registrar`, `/perfil`, `/meus-pontos` e `/admin/*` exigem login, checado no `proxy.ts` da raiz (Next 16 trocou `middleware.ts` por `proxy.ts`). `/admin/*` exige `papel = 'admin'`, checado no servidor.
- Variáveis: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nunca usar a chave secreta (`service_role`) no código nem commitar `.env.local`.
- Cores só pelos tokens do `globals.css` (nada de hex solto nos componentes). Fonte Poppins.
- Situação do selo sempre com cor + ícone + texto. Texto mínimo de 13 px, toque mínimo de 44 px, foco visível no teclado.
- Leaflet só no cliente: `dynamic(() => import('...'), { ssr: false })`.
- Progresso do checklist no localStorage, chave `checklist-AAAA-MM-DD`.
