# Alva Odontologia · Protótipo 05.01

Website demonstrativo de clínica odontológica (marca fictícia) do catálogo de protótipos comerciais Or7.dev. Conceito: **Sculpted Smile**.

**Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Motion, Lucide React, Three.js + React Three Fiber (só na seção 3D, carregada sob demanda). Site estático: sem backend, sem armazenamento de dados.

## Scripts

```bash
npm install
npm run dev          # desenvolvimento
npm run build        # checagem de tipos + build em dist/
npm run preview      # serve o build
npm run lint         # oxlint
npm run images       # baixa de novo as fotografias e gera os WebP (precisa de internet)
npm run test:e2e     # testes ponta a ponta com o Chrome/Edge instalado (rode o preview antes)
```

Para os testes: `npm run build`, `npm run preview -- --port 4173` em outro terminal, depois `npm run test:e2e` (`BASE_URL` muda o endereço; `SHOTS=1` salva capturas em `test-results/`).

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, descritor, endereço, horários, redes, navegação, créditos | `src/config/site.ts` |
| WhatsApp e telefone | `.env.local` (veja `.env.example`) |
| Tratamentos e categorias | `src/data/treatments.ts` |
| Hero, manifesto, escultura, visita, especialistas, jornada, depoimentos, FAQ | `src/data/content.ts` |
| Paleta (claro/escuro), fontes, escala tipográfica | `src/index.css` |
| Logo | `src/components/ui/Wordmark.tsx` e `public/favicon.svg` |
| Fotografias | `scripts/images.json` + `npm run images`, ou arquivos `nome-sm.webp` (800 px) e `nome-lg.webp` (1800 px) em `public/images/` |
| SEO | `index.html` |

## Estados demonstrativos

- **Agendamento:** sem `VITE_CLINIC_WHATSAPP`, o formulário valida os campos e mostra a mensagem que seria enviada, sem abrir nada nem enviar dados. Com número configurado, abre o WhatsApp com a mensagem pronta. Nada é armazenado.
- **Localização:** sem endereço, o mapa é um SVG ilustrativo e o botão de rotas fica desativado com aviso.
- **Depoimentos:** são espaços reservados identificados como exemplos. Substitua por relatos reais autorizados por escrito.
- **Especialistas:** perfis fictícios, sem números de registro. Retratos de banco de imagem, identificados como ilustrativos.

## Smile Sculpture (3D)

O molar é procedural: uma função de distância com sinal (coroa, quatro cúspides, sulcos, colo e três raízes) é poligonizada com Marching Cubes em um Web Worker (`src/components/sculpture/`). O chunk do three.js só carrega perto da seção e o render pausa fora da tela. Sem WebGL, ou em caso de erro, aparece uma ilustração SVG. Com `prefers-reduced-motion`, a seção perde a rolagem longa e mostra os três momentos em lista, com o modelo estático.

## Créditos e licenças

- Fotografias: [Unsplash](https://unsplash.com) sob a Unsplash License (IDs em `scripts/images.json`). Não retratam uma clínica real. Antes de publicar para um cliente, troque por fotos próprias.
- Fontes: Boska e Satoshi (Indian Type Foundry / Fontshare), ITF Free Font License, em `src/assets/fonts/FFL.txt`.

## GitHub Pages

Repo: `clinica-odontologica-demo`. Em Settings > Pages selecione GitHub Actions. O workflow publica automaticamente o branch `main`.

URL: https://lorenzo-or7.github.io/clinica-odontologica-demo/
