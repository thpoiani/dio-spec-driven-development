# Domain Docs

How the engineering skills should consume this project's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the project root, or
- **`GLOSSARY-MAP.md`** at the project root if it exists: it points at one `GLOSSARY.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context project (this one):

```
game-copilot/
├── GLOSSARY.md
├── docs/adr/
│   └── 0001-....md
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Domain vocabulary (aula 2)

O domínio é o do jogo (Super Mario World) e do evento: perfis `casual`, `completionist`, `speedrunner`; eventos `area_entered`, `level_started`, `level_completed`, `inventory_opened`, `boss_engaged`; componentes `PlayerProfiler`, `ProgressionAdvisor`, `WorldAdvisor`. **Avoid**: "quest", "batalha", "grafo tipado" — ver `../SCOPE.md` §4 e `../ARCHITECTURE.md` §4.3.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
