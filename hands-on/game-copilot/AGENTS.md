# AGENTS.md · game-copilot

Assistente de gameplay da aula 2 (DIO — SDD hands-on). Escopo, decisões vinculantes e non-goals: [../SCOPE.md](../SCOPE.md). Arquitetura e contratos: [../ARCHITECTURE.md](../ARCHITECTURE.md). Roteiro da aula: [../PRESENTATION.md](../PRESENTATION.md). Guia de etapas: [../AGENTS.md](../AGENTS.md).

## Agent skills

### Issue tracker

Issues and specs live as **GitHub Issues** on `thpoiani/dio-spec-driven-development` (público; `gh` CLI). Spec = issue-pai do estágio; tickets = sub-issues com dependências nativas. PRs das etapas ficam abertos para os alunos (não são surface de triagem). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role triage vocabulary, label strings equal to their names. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the project root. See `docs/agents/domain.md`.

### Naming

The `Avoid:` lists in `GLOSSARY.md` bind identifiers too — reviewers treat them as the naming standard. Vocabulário do domínio é o do jogo (Super Mario World): *Avoid* "quest" e "batalha" — see `GLOSSARY.md` (criado pelo `/domain-modeling`) e `../SCOPE.md` §4.
