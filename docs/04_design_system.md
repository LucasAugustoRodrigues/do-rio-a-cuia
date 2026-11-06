# Design system (tirado do Figma)

As cores abaixo foram medidas direto nas telas exportadas do Figma. Algumas diferem um pouco da paleta do documento de identidade visual de 09/10; para o código vale o Figma, porque é o que a equipe vai comparar lado a lado.

## Cores

| Token | Hex | Uso no protótipo | Paleta do doc de 09/10 |
| --- | --- | --- | --- |
| `roxo-900` | #2B0F38 | Cabeçalhos escuros (Manual, Checklist, Perfil, Admin), títulos | Roxo Fruto #2B0F38 |
| `roxo-850` | #2A1238 | Card da média na cotação | |
| `roxo-700` | #3F1A52 | Botão primário, fundo da tela de entrada, pílula ativa da barra inferior, cards de tipo de conta selecionados | Roxo Açaí #4B1E5E (o Figma usa #3F1A52) |
| `roxo-500` | #583868 | Blocos Mínimo/Máximo dentro do card da cotação | |
| `roxo-texto-2` | #6A5876 | Texto secundário, motivos dos itens do checklist | |
| `creme` | #F6EFE3 | Fundo padrão das telas | Creme Tapioca #F6EFE3 |
| `creme-claro` | #FDF5E7 | Fundo das telas do checklist | |
| `creme-card` | #FBF8F3 | Item do checklist não marcado | |
| `branco` | #FFFFFF | Cards, campos, barra inferior | |
| `bege-borda` | #EADFCC | Borda de campos, chips e fundo do controle segmentado | |
| `amarelo` | #F2B84B | Botão de destaque ("Registrar preço pago", "Cadastrar meu ponto"), etapa atual do stepper, barra de progresso do manual, selo "vs. ontem", avatar, etiqueta "Administrador" | (não estava na paleta) |
| `verde` | #2B6B3F | Selo válido, caixas marcadas, títulos de etapa, barra de progresso da etapa | Verde Floresta #2E6B3F |
| `verde-claro` | #E4F0E6 | Fundo de item marcado, fundo do ícone "Vou tomar açaí" | |
| `vermelho` | #B3392E | Selo vencido, "Sair da conta", marcador vencido | Vermelho Alerta #B03A2E |
| `vinho` | #740002 | Círculo de etapa incompleta no Manual | |
| `rosa-alerta` | #FBE9E6 | Caixa de alerta "Este ponto não tem selo válido hoje" | |
| `azul` | #1F7A9E | Ícone de barras, links ("Esqueci a senha", "Ver todos"), círculo do "Preço enviado!" | Azul Rio #2A7FA3 |
| `azul-claro` | #E3F1F7 | Caixas informativas ("1 rasa = 2 latas", aviso do branqueamento), fundo de ícone | |
| `agua-mapa` | #A9C3C7 | Rio do mapa ilustrado | |

Contraste: texto branco sobre `roxo-700`, `roxo-900`, `verde` e `vermelho` passa no WCAG AA. `azul` só em ícone, link sublinhado ou texto grande; sobre o creme ele fica perto do limite. A situação do selo sempre usa cor, ícone e texto juntos.

## Tipografia

O Figma usa Poppins em todas as telas (o documento de 09/10 previa Nunito no corpo; seguir o Figma). Carregar pelo `next/font/google` com pesos 400, 500, 600, 700 e 800.

| Elemento | Tamanho (em tela de 390 px) | Peso |
| --- | --- | --- |
| Título da tela ("Cotação do dia", "Entrar") | 28 px | 800 |
| Título da entrada ("O açaí certo...") | 40 px | 800 |
| Valor em destaque ("R$ 00,00", "R$ 128,00") | 48 px | 800 |
| Título de card / etapa | 20 px | 700 |
| Texto de botão | 18 px | 700 |
| Texto de item / corpo | 16 px | 500 |
| Texto secundário, motivos, legendas | 13 a 14 px | 400 |

Nenhum texto abaixo de 13 px.

## Medidas

- Largura de referência 390 px; margem lateral 20 px. Em telas maiores, centralizar a coluna com largura máxima de 430 px.
- Botão: altura 56 px, cantos totalmente arredondados (pílula), largura total.
- Campo: altura 52 px, cantos 16 px, borda 1,5 px `bege-borda`, fundo branco.
- Card: cantos 24 px, fundo branco, sem sombra forte.
- Cabeçalho escuro (Manual, Checklist, Perfil, Admin): fundo `roxo-900`, cantos de baixo arredondados em 32 px.
- Barra inferior: flutuante, branca, cantos 32 px, altura 64 px, 16 px acima da borda.
- Área de toque mínima 44 x 44 px.

## Componentes

| Componente | Onde aparece | Detalhes |
| --- | --- | --- |
| `Button` primário | Entrar, Enviar preço, Salvar ponto | Fundo `roxo-700`, texto branco |
| `Button` destaque | Registrar preço pago, Cadastrar meu ponto | Fundo `amarelo`, texto `roxo-900`, ícone + |
| `Button` contornado | Continuar sem conta, Registrar outro preço, Copiar link | Borda `roxo-700`, texto `roxo-700` |
| `BackButton` | Quase todas as telas internas | Círculo 44 px com chevron; versão clara sobre creme, versão translúcida sobre roxo |
| `TextField` | Entrar, Criar conta, Cadastrar ponto | Rótulo acima, placeholder cinza |
| `Segmented` | Unidade Rasa/Lata | Fundo `bege-borda`, opção ativa em `roxo-700` |
| `Chip` | Qualidade, filtros do mapa | Contornado; filtro ativo em `roxo-700`; bolinha colorida no filtro de selo |
| `AccountTypeCard` | Criar conta | Card com ícone e rótulo, selecionado em `roxo-700` |
| `OptionCard` | Entrada | Card branco com ícone em quadrado colorido, título, subtítulo e seta |
| `InfoBox` | Registrar preço, Manual | Fundo `azul-claro`, ícone i, texto `roxo-900` |
| `PriceHero` | Cotação | Card `roxo-850` com média, selo de variação, Mínimo/Máximo, rodapé de atualização |
| `BarChart30` | Cotação | 30 barras `roxo-texto-2`, hoje em `roxo-900` com balão do valor; SVG simples, sem biblioteca |
| `SealHero` | Página do ponto | Card verde (válido) ou vermelho (vencido) com ícone em círculo, título e data |
| `InfoList` | Página do ponto, Preço enviado | Linhas com ícone em quadrado creme, rótulo pequeno e valor em negrito |
| `MapPin` | Mapa | Gota verde com check / vermelha com "!" |
| `PointCard` | Mapa | Nome, endereço, etiqueta de selo, botão "Ver página do ponto" |
| `StageRow` | Manual | Círculo de status, nome da etapa, "N itens - Concluída/Incompleta", seta |
| `Stepper` | Checklist | 5 círculos; atual em pílula amarela com nome |
| `ChecklistItem` | Checklist | Caixa de marcação, texto, motivo; marcado em `verde-claro` com borda `verde` |
| `ProgressBar` | Manual (amarela), Checklist (verde) | |
| `StatTile` | Perfil | Número grande + rótulo |
| `BottomNav` | Cotação, Registrar, Mapa, Manual, Perfil | 4 itens: Cotação (barras), Mapa (pin), Manual (lista), Perfil (pessoa) |
| `AdminBadge` | Cadastrar ponto, QR code | Etiqueta amarela "Administrador" |

Ícones: traço fino, estilo Lucide (`lucide-react`): `BarChart3`, `MapPin`, `ListChecks`, `User`, `ShieldCheck`, `Store`, `Waves`, `ChevronLeft`, `ArrowRight`, `Check`, `X`, `Info`, `Plus`.

## Logo e ícone

O ícone do app vem do quadro FUNDO do Figma: quadrado creme (#F6EFE3) de cantos arredondados com a cuia, sobre fundo roxo #3E0A58 em degradê. Os arquivos `icon-192.png` e `icon-512.png` do pacote já estão recortados dele, com margem para o formato "maskable" do Android.


Cuia roxa com três frutos, ondas azuis por cima e uma folha verde. Na entrada aparece num quadrado creme com cantos arredondados ao lado do nome. O arquivo da logo está no documento de 09/10 (DoRioaCuia.docx); exportar em SVG ou PNG 512 px para o ícone do PWA.
