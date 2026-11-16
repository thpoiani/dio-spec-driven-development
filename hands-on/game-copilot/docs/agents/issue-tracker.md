# Issue tracker: GitHub

Issues and specs for this project live as **GitHub Issues** on `thpoiani/dio-spec-driven-development` (repo público — os alunos enxergam specs, tickets e PRs). Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc or `--body-file` for multi-line bodies.
- **Read an issue**: `gh issue view <number> --json number,title,body,labels,comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Spec = issue-pai; tickets = sub-issues**: cada estágio tem um issue-pai com a spec (label do status) e os tickets como **sub-issues** (`gh issue create --parent <parent> ...`).
- **Blocking**: GitHub's **native issue dependencies**. Add an edge with `gh issue create --blocked-by <n>,<n> ...` or `gh issue edit <child> --add-blocked-by <blocker>`. A ticket is unblocked when every blocker is closed.
- **Count open blockers**: `gh issue view <n> --json blockedBy --jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`.
- **Comment on an issue**: `gh issue comment <number> --body "..."`.
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`.
- **Close**: post the explanation with `gh issue comment <number> --body "..."`, then `gh issue close <number>`.

## Pull Requests por estágio

**PRs as a triage/request surface: no.** — mas os **PRs das etapas ficam abertos de propósito**: cada estágio abre um PR **empilhado** (base = branch do estágio anterior) para os alunos analisarem o diff da etapa; o merge só acontece no cenário final, pelo Thiago, na ordem. Issues e PRs compartilham o espaço de números (`#42` pode ser issue ou PR — resolver com `gh pr view 42` e fallback `gh issue view 42`).

## When a skill says "publish to the issue tracker"

Create a GitHub issue (spec = issue-pai do estágio; tickets = sub-issues).

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.
