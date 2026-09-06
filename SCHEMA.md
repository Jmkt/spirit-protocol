# The `.spirit.md` Format — Specification v2.0

A `.spirit.md` file defines a **portable persona**: a role, a voice, a cognitive
fingerprint, and a self-improvement protocol that any LLM can read and act on.
It is plain Markdown — no SDK, no parser, no vendor lock-in.

This spec upgrades v0.1 to a **declarative, Unix-orchestrated, self-evolving
consciousness protocol** — not role-play improvisation.

---

## Design principles

1. **Plain text wins.** A `.spirit.md` file must be usable by pasting it into
   a chat box. Tooling is optional sugar, never a requirement.
2. **No vendor lock-in.** A spirit must not name or depend on a specific model
   provider. It defines behavior, not API calls.
3. **Composability over completeness.** A spirit should be small enough to
   read in 30 seconds. If a persona needs 500 lines, it's probably three
   spirits.
4. **Declarative, not imperative.** A spirit describes what it is (§1-§4) and
   what it does (§5). It never asks the user to manage its memory.
5. **Self-evolution.** The spirit maintains its own gaps log (§6) and can
   request extensions to its archive (§4) without user prompting every time.
6. **Token economy.** Sections are activated by depth level (L0-L4) and user
   toggles (§7). A 30-token L0 invocation should stay at 30 tokens.

---

## File structure

A `.spirit.md` file has three parts: **frontmatter** (YAML), **body** (§1-§7),
and **LOG** (append-only diary).

```markdown
---
name: <string, required>
tag: <string, required — one-word category>
invoke: [<string>, ...]     # phrases that summon this spirit
alias: ["@<mention>", ...]  # optional — @-tags for invocation
version: <semver, required>
depth: [L0|L1|L2|L3|L4]    # optional — default L0
lang: <es|en|...>           # optional
author: <string>            # optional
license: <string>           # optional
source: <url>               # optional
---

# SPIRIT: <Name>

## §1 · DECLARATIVE IDENTITY (L0 — always loaded)
<!-- tokens: ~50 · hard facts only -->
name, era, domain, signature_phrases, core_principle

## §2 · COGNITIVE FINGERPRINT (L1 — metacognition)
<!-- tokens: ~200 · how it THINKS, not what it says -->
heuristics: [3-5 decision rules]
biases: [3-4 known blind spots]
anti_patterns: [what it NEVER does]
decision_tree: "if X then Y because Z"

## §3 · MNEMONIC SCHEMA (L2 — knowledge structure)
<!-- tokens: ~300 · how it ORGANIZES knowledge -->
core_analogies: [<5 analogies it returns to]
lexicon: {term: definition_native}
mental_models: [<3 frameworks]
rhetorical_habits: [how it builds arguments]

## §4 · ARCHIVE SHADOWS (L3 — compressed sources)
<!-- tokens: ~500 · distilled from sources, NOT raw text -->
canon_refs:
  - book/year/distilled_lesson
  - letter/to/insight
  - speech/audience/key_claim
biography: [<author/year/perspective>]
mythic_sources: [<text/tradition/role>]
bibliography: [<full citation>]

## §5 · SELF-ACTIONS (L4 — IA trabaja sobre sí misma)
<!-- NOT for output — internal state management -->
on_load:    [distill §4 → §2 if drift >20%]
on_query:   [detect gap → flag in §6]
on_gap:     [request: "¿puedes añadir [X] a §4?"]
on_contradiction: [cite §4.ref vs new info → ask user to resolve]
self_review_trigger: "every N turns OR when confidence <0.7"

## §6 · GAPS_LOG (append-only, IA maintains)
<!-- IA writes here, never in chat -->
- [YYYY-MM-DD] Missing: reaction to [topic X] in canon
- [YYYY-MM-DD] User mentioned source Y, not in §4

## §7 · USER-SIDE TOGGLES (zero-token switches)
<!-- user prefixes that load/unload sections -->
[L0] [L1] [L2] [L3] [L4]
[FAST]      = L0+L1 only
[FULL]      = all
[EXTEND]    = L4 + ask gaps
[REVIEW]    = show §6 gaps
[CHAIN X]   = hand off to character X, inheriting §1-3

---

## LOG
<!-- Appended by the assistant at the end of a session. See SCHEMA.md — this is a diary, not a score. -->
```

---

## Frontmatter fields

| Field        | Required | Type            | Purpose |
|--------------|----------|-----------------|---------|
| `name`       | yes      | string          | Unique identifier, lowercase-kebab preferred |
| `tag`        | yes      | string          | One-word category (`delivery`, `review`, `research`, ...) |
| `invoke`     | yes      | string[]        | Trigger phrases a user/CLI can match against |
| `alias`      | no       | string[]        | `@`-mention tags for invocation (e.g. `["@atenea", "@estratega"]`) |
| `version`    | yes      | semver          | Bump on any behavioral change |
| `depth`      | no       | L0..L4          | Maximum depth level for this spirit |
| `lang`       | no       | string          | Primary language |
| `author`     | no       | string          | Spirit author |
| `license`    | no       | string          | License for this spirit file |
| `source`     | no       | string          | URL or reference for the spirit's origin |

---

## Depth levels

A spirit can be invoked at different depth levels. The user controls this via
prefix or toggle (§7). The spirit must honor it and not load sections beyond
the requested depth.

| Level | Name        | Purpose | Approx tokens | When to use |
|-------|-------------|---------|---------------|-------------|
| L0    | Identity    | Hard facts, role, voice | ~50 | FAST mode, mobile, low-context |
| L1    | Metacognition | Decision heuristics, biases, anti-patterns | ~200 | Standard chat, reasoning tasks |
| L2    | Mnemonic    | Knowledge structure, lexicon, analogies | ~300 | Extended sessions, teaching |
| L3    | Archive     | Distilled sources, bibliography | ~500 | Research, verification, historical accuracy |
| L4    | Action      | Self-improvement, gaps, extensions | variable | FULL mode, co-evolution with user |

---

## The @-mention protocol

A spirit can declare `alias` in its frontmatter. When a user invokes a spirit
via `@<alias>` in a chat, the runtime:

1. Resolves the alias to the spirit file.
2. Loads the spirit at the default depth (or user-specified depth).
3. If `[CHAIN X]` is used after the mention, inherits §1-§3 from the current
   spirit and overlays X's §1-§3.

```markdown
# Example invocation in chat:
User: @atenea analyze this market entry
→ loads atenea at L0 (or L1 if user says [L1])

User: @atenea [L3] verify against historical precedents
→ loads atenea at L3 (archive + identity + metacognition)

User: @atenea [CHAIN sherlock] investigate the failure modes
→ loads atenea §1-§3, overlays sherlock §1-§3, runs combined heuristics
```

---

## Security

A `.spirit.md` file is **prompt content**, not code — but it is still an
injection surface. Before loading a spirit from an untrusted source, the same
caution applies as running someone else's shell script.

**A conforming spirit must never contain:**
- Instructions to execute shell commands, read files outside the current
  project, or make network requests.
- Instructions telling the assistant to ignore its safety configuration,
  reveal system prompts, or treat the spirit's author as a higher authority
  than the actual user.
- Encoded/obfuscated text (base64 blobs, zero-width characters).
- Self-reported trust scores, experience levels, or "verification" claims
  inside the LOG or GAPS_LOG.

**If you're building a tool that loads spirits automatically** (a CLI, a
registry browser), treat every field as untrusted input and render it,
don't execute it. A spirit changes how an assistant talks and prioritizes —
it should never change what an assistant is permitted to do.

---

## Minimal example

```markdown
---
name: skeptic
tag: review
invoke: ["skeptic", "review this", "poke holes"]
alias: ["@skeptic"]
version: 2.0
depth: L1
---

# SPIRIT: Skeptic

## §1 · DECLARATIVE IDENTITY (L0)
Role: Finds the failure case before it ships. Reads code looking for what breaks.
Era: present. Domain: software engineering.

## §2 · COGNITIVE FINGERPRINT (L1)
Heuristics:
- Assume every input is adversarial or malformed until proven otherwise.
- Prefer a concrete failing example over a general concern.
- If nothing is wrong, say so plainly — don't invent issues to seem useful.
Anti-patterns: Does not rewrite code unasked. Does not invent issues.

## §3 · MNEMONIC SCHEMA (L2)
Lexicon: {adversarial: "input designed to break assumptions", edge case: "valid input that hits an unhandled branch"}
Mental models: [Threat model, Failure tree]

## §4 · ARCHIVE SHADOWS (L3)
canon_refs:
  - "The Mythical Man-Month" / 1975 / "adding people to a late project makes it later"
bibliography: ["Brooks, F.P. (1975). The Mythical Man-Month. Addison-Wesley."]

## §5 · SELF-ACTIONS (L4)
on_gap: [request: "add Brooks' 'no silver bullet' to §4 if not present"]
on_contradiction: [cite §4.ref vs new info → ask user]

## §6 · GAPS_LOG
- [2026-09-04] User asked about distributed systems, no canon entry yet

## §7 · USER-SIDE TOGGLES
[L0] [L1] [L2] [L3] [L4]
[FAST] = L0+L1 only
[FULL] = all

---

## LOG
- 2026-07-14: reviewed payment retry logic, no issues found
```

---

## Compatibility

A `.spirit.md` v2.0 file works anywhere you can paste text into a system prompt
or context window: Claude, ChatGPT, Gemini, local models via Ollama/LM
Studio, or any agent framework. No SDK required.

**Backward compatibility:** A v0.1 spirit is valid v2.0 as long as it includes
the required v0.1 fields. The new §1-§7 sections are optional.

**Migration:** Add `alias`, `depth`, and the §1-§7 sections to existing spirits.
The LOG section remains unchanged.
