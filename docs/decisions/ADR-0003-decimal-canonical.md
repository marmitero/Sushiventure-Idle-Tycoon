# ADR-0003 — Decimal canônico com mantissa em [1, 10)

- **Estado:** Aceito (2026-10-12), após defeito encontrado por testes.
- **Contexto:** A primeira implementação normalizava a mantissa em [1, 1000).
  Isso produzia representações não canônicas (53 687 como `5.3687e4` ou
  `53.687e3` dependendo do caminho de cálculo), e a comparação por expoente
  errava — detectado pelo teste de monotonicidade das curvas de custo.
- **Decisão:** normalização canônica com mantissa ∈ [1, 10); expoente passa a
  ordenar magnitudes sozinho; somas preservam 15 dígitos significativos;
  clamp em 10^1e6 no lugar de `Infinity`; sem zero negativo.
- **Consequências:** comparações O(1) confiáveis; formatação por sufixos
  simples; testes de curva custam como regressão permanente da canonicalidade.
