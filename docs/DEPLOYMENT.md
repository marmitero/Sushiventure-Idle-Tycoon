# DEPLOYMENT

## Build

```bash
npm ci
npm run build     # typecheck + vite build → dist/
```

`dist/` contém `index.html`, bundle JS e `assets/` (PNGs derivados + manifesto).
Os PNGs são servidos como arquivos estáticos com cache longo (hash não se
aplica a `public/`; usar `Cache-Control: public, max-age=31536000, immutable`
e versionar por caminho quando o manifesto mudar).

## Ambientes

| Ambiente | Como | Observação |
|---|---|---|
| Dev local/preview | `npm run dev` | simulador de anúncios rotulado |
| Preview de produção | `npm run preview` | serve `dist/` |
| Produção | hospedagem estática com HTTPS (GitHub Pages, Netlify, Cloudflare Pages…) | adaptadores "não configurado" até credenciais reais |

Decisão de hospedagem: pendente do diretor (sem custo inicial necessário —
hosting estático gratuito atende a Fase 11).

## Variáveis de ambiente

- `.env.example` lista os nomes esperados; **nenhum valor real versionado**.
- O boot lê configuração somente via `import.meta.env` com defaults seguros;
  ausência de credencial ⇒ adaptador "não configurado" (nunca crash).

## PWA (Fase 11)

- Manifest, ícones derivados do kit (com crédito), service worker com cache de
  assets e fallback offline para o shell; save permanece em storage local.

## Android (futuro)

- Capacitor envolvendo o mesmo build web; diferenças documentadas em
  `docs/ARCHITECTURE.md` §8 quando surgirem; nenhuma decisão atual impede o
  empacotamento (sem APIs exclusivas de desktop; toque como input primário).

## Operação

- Monitoramento: analytics no-op até decisão de provedor.
- Rollback: hosting estático versionado por deploy.
- Backups de save: responsabilidade do cliente (slots primário + `.bak`);
  nuvem entra na Fase 8 com política de conflitos documentada.
