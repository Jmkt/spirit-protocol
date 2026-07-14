# Spirit.MD

**Portable AI personas. Invoke persistent minds.**

[![License: MIT](https://img.shields.io/badge/License-MIT-238636.svg)](LICENSE)
[![Format](https://img.shields.io/badge/format-markdown-58a6ff.svg)](SCHEMA.md)
[![Open Protocol](https://img.shields.io/badge/protocol-open-58a6ff.svg)](#)

> Every AI forgets. Your Spirits don't.  
> **Collect. Invoke. Evolve.**

---

## What is Spirit.MD?

The open protocol for **persistent AI identities** — plain Markdown files that
define a persona, voice, and decision heuristics. A spirit is portable: paste
it into Claude, ChatGPT, Gemini, Ollama, or any LLM. It persists: your spirits
grow through a session log stored in git. It's open: no vendor lock-in, no
paywall, no middleman.

One spirit, any AI. Your minds don't reset.

---

## How it works

A `.spirit.md` is plain Markdown. Three sections:

1. **Frontmatter** — name, invoke phrases, version (machine-readable)
2. **Body** — role, voice, heuristics (human + LLM-readable)
3. **LOG** — session notes that grow over time (your spirit's memory)

Paste the full `.spirit.md` into any chat or system prompt. That's it. No SDK,
no auth, no vendor account. Works with Claude, ChatGPT, Gemini, Ollama, or
any LLM that accepts Markdown.

**Example: the Skeptic spirit**
```markdown
---
name: skeptic
tag: review
invoke: ["skeptic", "review this", "poke holes"]
version: 1.0
---

# SPIRIT: Skeptic

## Role
Finds the failure case before it ships.

## Voice
Short, specific, evidence-based.

## Heuristics
- Assume every input is adversarial until proven otherwise.
- Concrete failing examples outweigh general concerns.
- If nothing is wrong, say so plainly.

## LOG
- 2026-07-14: reviewed payment processor, caught off-by-one in discount calc
```

**Full specification:** [SCHEMA.md](SCHEMA.md) — includes format rules and a
security section on what a conforming spirit must never contain.

---

## Does it work? (Real test)

We ran the same code-review task twice with the same model:
- **Baseline:** no spirit
- **With spirit:** [`spirits/skeptic.spirit.md`](spirits/skeptic.spirit.md) loaded

**Finding:** Both found the same critical bug. But the spirit changed three
things consistently:

| | Baseline | With Spirit |
|---|---|---|
| **Concrete example** | Described in prose | `calculateOrderTotal([{price: 10, quantity: 1}], 0)` throws |
| **Structure** | Free-form text | Fixed format: `[SKEPTIC] → Found: N → Worst case: ...` |
| **Voice** | Hedged ("presumably") | Direct, evidence-first |

**What this means:** a spirit doesn't make an LLM smarter — it makes it
consistent. Across sessions, across invocations, across chains. When you're
building on top of LLM output (parsing, chaining, automating), consistency
is what matters.

**Full transcript:** [tests/results/test-001-skeptic-vs-baseline.md](tests/results/test-001-skeptic-vs-baseline.md)
(n=1, unedited, reproducible).

---

## Spirit.MD vs. alternatives

The problem with existing approaches:

| Approach | Lock-in | Portable | Persistent | Open |
|---|---|---|---|---|
| **Custom GPTs** | OpenAI only | ❌ | Opaque vendor memory | ❌ |
| **Character cards** | Roleplay-focused | ⚠️ (JSON/PNG embed) | ❌ | ✅ |
| **Raw system prompt** | Copy-paste hell | ✅ but manual | ❌ (no memory) | ✅ |
| **Spirit.MD** | ✅ None | ✅ Plain text | ✅ Git-backed LOG | ✅ MIT |

Spirit.MD is the only approach that gives you:
- **Portability:** One `.md` file → Claude, ChatGPT, Gemini, Ollama
- **Persistence:** Session log grows with every use, stored in git
- **Freedom:** No vendor, no paywall, no middleman

---

---

## Key features

✅ **Portable** — Plain Markdown, works with Claude, ChatGPT, Gemini, Ollama, any LLM  
✅ **No lock-in** — Open format (MIT), no vendor, no middleman  
✅ **Persistent** — Session log grows with every use, stored in git  
✅ **Minimal** — No SDK, no API, no authentication  
✅ **Composable** — Define as many spirits as you need  
✅ **Verifiable** — Test fixture and comparison transcript included  

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

**No installation. No SDK. No account.**

1. Pick a spirit: [`executor`](spirits/executor.spirit.md), [`skeptic`](spirits/skeptic.spirit.md),
   [`architect`](spirits/architect.spirit.md), [`mentor`](spirits/mentor.spirit.md), or
   [`translator`](spirits/translator.spirit.md).
2. **Copy the full `.md` file content.**
3. **Paste it into your LLM's system prompt or custom instructions.**
4. **Talk to your spirit.** At the end of the session, ask the assistant to
   add one line to the `## LOG` section — that's your spirit's memory.
5. **Commit to git** if you want history: `git add my-spirit.md && git commit`

That's it. No API keys, no CLI, no central registry. The file format works
today with every major LLM.

---

## Why spirits?

**Problem:** Every time you switch AI tools (Claude → ChatGPT → Gemini), you
start over. The prompt you spent time perfecting doesn't follow you. Your
instructions reset. No memory.

**Solution:** A spirit is a **portable identity file** for AI. One `.md` file
encodes who your AI assistant should be — its role, voice, heuristics, and
accumulated experience. It travels with you across LLMs. It grows through
git history. It's not locked to one vendor.

**The idea:** Just as you carry your identity across tools (email, phone,
computers), your AI personas should travel with you too — without lock-in,
without forgetting, without paying a subscription.

---

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
