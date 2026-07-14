# spirit-protocol

**Portable AI personas in plain Markdown — define a persona once, use it in
Claude, ChatGPT, Gemini, or any local LLM.**

[![License: MIT](https://img.shields.io/badge/License-MIT-238636.svg)](LICENSE)
[![Format](https://img.shields.io/badge/format-markdown-58a6ff.svg)](SCHEMA.md)
[![No dependencies](https://img.shields.io/badge/dependencies-none-lightgrey.svg)](SCHEMA.md)

---

## The problem

Every AI tool you use forgets who you told it to be. Switch from Claude to
Gemini and you retype the same system prompt. Custom GPTs lock a persona to
one vendor. A system prompt you wrote three weeks ago has no memory of what
worked and what didn't.

## The idea

Put the persona in a file, not in a vendor's UI.

A `.spirit.md` is plain Markdown: a role, a voice, a handful of decision
heuristics, and a running session log. Paste it into any chat, load it via
a CLI, or hand it to a local model — it works anywhere text works, because
that's all it is.

```markdown
---
name: skeptic
tag: review
invoke: ["skeptic", "review this"]
version: 1.0
---

# SPIRIT: Skeptic

## Role
Finds the failure case before it ships.

## Voice
Short, specific, evidence-based.

## Heuristics
- Assume every input is adversarial until proven otherwise.
- A concrete failing example outweighs a general concern.
- If nothing is wrong, say so plainly.
```

Full format spec, including a security section on what a conforming spirit
must never contain: **[SCHEMA.md](SCHEMA.md)**.

---

## Does it actually do anything? (real test, not a claim)

We ran an actual comparison instead of asserting one: the same code-review
task, given to two fresh instances of the same model — one plain, one with
[`spirits/skeptic.spirit.md`](spirits/skeptic.spirit.md) loaded. Full raw
transcripts, unedited: **[tests/results/test-001-skeptic-vs-baseline.md](tests/results/test-001-skeptic-vs-baseline.md)**.

Honest finding: the spirit didn't make the model find more bugs — both
runs caught the same critical issue. What changed consistently was **how**
the answer came out:

| | Baseline | With `skeptic.spirit.md` |
|---|---|---|
| Critical bug found | ✅ | ✅ |
| Concrete repro example | Described in prose | `calculateOrderTotal([{price: 10, quantity: 1}], 0)` throws instead of returning `10` |
| Output structure | Free-form paragraph | Fixed `[SKEPTIC] → Found: N → Worst case: ...` format every time |
| Voice | Hedged ("presumably unintended") | Direct, evidence-first |

This is n=1 — a single qualitative run, not a benchmark, and the README
says so on purpose. The reproducible claim is narrower than "makes the
model smarter": **a spirit makes output structure and voice consistent
across sessions**, which is what matters when you're chaining sessions
together or parsing output automatically. Run the test yourself with a
different fixture; instructions are in that file.

---

## How this compares

| | spirit.md | Custom GPTs | Character cards (SillyTavern) | Raw system prompt |
|---|---|---|---|---|
| Works across vendors | ✅ | ❌ (OpenAI only) | ⚠️ (roleplay-focused) | ✅ but not portable |
| Plain text, no lock-in | ✅ | ❌ | ⚠️ (often JSON/PNG-embedded) | ✅ |
| Session log / memory | ✅ (git-backed) | ⚠️ (vendor memory, opaque) | ❌ | ❌ |
| Aimed at real work vs. roleplay | ✅ | ✅ | ❌ | ✅ |
| Versioned / diffable | ✅ (it's a file) | ❌ | ❌ | ❌ |

---

## Repo structure

```
spirit-protocol/
├── SCHEMA.md              # the format spec — read this first
├── spirits/                # example personas, ready to use
│   ├── architect.spirit.md
│   ├── executor.spirit.md
│   ├── skeptic.spirit.md
│   ├── mentor.spirit.md
│   └── translator.spirit.md
├── tests/
│   ├── fixtures/            # code used in the comparison test
│   └── results/              # raw, unedited test transcripts
├── docs/
│   └── IMAGE_PROMPTS.md    # prompts for this repo's own visuals
└── LICENSE                 # MIT
```

## Quickstart

No installation. No SDK. No account.

1. Open any spirit in `spirits/`, e.g. [`executor.spirit.md`](spirits/executor.spirit.md).
2. Paste its full content into your LLM's system prompt / custom instructions field.
3. Talk to it. At the end of a session, ask the assistant to append a line
   to the `## LOG` section summarizing what happened — that's the whole
   persistence mechanism, and it's just editing a text file.
4. Commit the updated file to git if you want history.

That's it. A CLI (`spirit invoke <name>`) and a public registry are planned
— see Roadmap — but the file format works today with zero tooling.

## Writing your own spirit

Read [SCHEMA.md](SCHEMA.md) — it's short. The five files in `spirits/` are
meant to be copied and modified, not treated as a fixed catalog. Keep a
spirit small enough to read in 30 seconds; if it needs more than that, it's
probably two spirits.

## Security note

A spirit is prompt content, not code — but loading one from an untrusted
source (a stranger's fork, a public registry) deserves the same caution as
running someone else's script. See the [Security section of SCHEMA.md](SCHEMA.md#security)
for what a conforming spirit must never contain, and what to check before
trusting one you didn't write.

---

## Contributing

Open an issue with a spirit you'd find useful, or a PR adding one to
`spirits/`. If you run the comparison test with a different fixture or
spirit and get a different result than [test-001](tests/results/test-001-skeptic-vs-baseline.md),
that disagreement is more valuable than a confirming result — open an issue
with what you found.

## License

MIT — see [LICENSE](LICENSE).
