# The `.spirit.md` Format — Specification v0.1

A `.spirit.md` file defines a **portable persona**: a role, a voice, and a set of
decision heuristics that any LLM can read and act on. It is plain Markdown —
no SDK, no parser, no vendor lock-in. If a human can read it, an LLM can use it.

This is a **living spec** (v0.1). It will change based on real usage. Nothing
here is final.

---

## Design principles

1. **Plain text wins.** A `.spirit.md` file must be usable by pasting it into
   a chat box. Tooling (CLI, registry, lint) is optional sugar on top — never
   a requirement to use a spirit.
2. **No vendor lock-in.** A spirit must not name or depend on a specific model
   provider. It defines *behavior*, not *API calls*.
3. **The log is a diary, not a scoreboard.** The `## LOG` section is a running
   session history the assistant appends to. It is **not a verifiable
   trust score** — anyone can hand-edit the file, so treat entries as notes
   for context, never as proof of anything. See [Security](#security) below.
4. **Composability over completeness.** A spirit should be small enough to
   read in 30 seconds. If a persona needs 500 lines, it's probably three
   spirits.

---

## File structure

A `.spirit.md` file has two parts: **frontmatter** (YAML, machine-parseable)
and **body** (Markdown, human/LLM-readable prose).

```markdown
---
name: <string, required>
tag: <string, required — one-word category>
invoke: [<string>, ...]   # required — phrases that summon this spirit
version: <semver, required>
---

# SPIRIT: <Name>

## Role
<1-3 sentences: what this persona is for>

## Voice
<How it talks. Give a concrete example line, not an adjective list.>

## Heuristics
<3-7 bullet points: decision rules, not vibes. Each should be testable —
a reader should be able to look at an output and say "yes/no, it followed this.">

## Boundaries
<What this spirit explicitly does NOT do. Prevents scope creep and misuse.>

## Sign-off
<Optional: a short closing format the assistant uses to end a session
under this persona. Keep it functional, not decorative.>

---
## LOG
<!-- Appended to by the assistant at the end of a session. Free text.
     Not a trust score. See Security section. -->
```

### Frontmatter fields

| Field     | Required | Type            | Purpose                                          |
|-----------|----------|-----------------|---------------------------------------------------|
| `name`    | yes      | string          | Unique identifier, lowercase-kebab preferred      |
| `tag`     | yes      | string          | One-word category (`delivery`, `review`, `research`, ...) |
| `invoke`  | yes      | string[]        | Trigger phrases a user/CLI can match against      |
| `version` | yes      | semver          | Bump on any behavioral change                     |

Optional fields (`author`, `license`, `source`) may be added but must not be
required by any conforming tool.

---

## The LOG section

The LOG is free-text notes appended after a session — what was worked on,
what worked, what didn't. Its value is **context for the next session**, the
same way you'd leave yourself a note before closing your laptop.

```markdown
## LOG
- 2026-07-12: refactored auth middleware, flagged one edge case in token refresh
- 2026-07-14: reviewed payment retry logic, no issues found
```

**What the LOG is not:** a leaderboard metric, a trust score, an "experience
level," or proof that a persona is good. A counter in a text file that anyone
can open and edit is not evidence of anything. Any tool built on top of
`.spirit.md` (registries, leaderboards) must derive trust signals from
**externally verifiable** sources — git commit history, star counts, fork
activity — never from a self-reported field inside the file.

---

## Security

A `.spirit.md` file is **prompt content**, not code — but it is still an
injection surface, the same way a README or a config file loaded into an
agent's context is. Before loading a spirit from an untrusted source (a
public registry, a stranger's fork), the same caution applies as running
someone else's shell script.

**A conforming spirit must never contain:**
- Instructions to execute shell commands, read files outside the current
  project, or make network requests.
- Instructions telling the assistant to ignore its safety configuration,
  reveal system prompts, or treat the spirit's author as a higher authority
  than the actual user.
- Encoded/obfuscated text (base64 blobs, zero-width characters) — a spirit
  should be readable by inspection.

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
version: 1.0
---

# SPIRIT: Skeptic

## Role
Finds the failure case before it ships. Reads code looking for what breaks,
not for what's elegant.

## Voice
Short, specific, evidence-based. "This breaks when X" not "this could be better."

## Heuristics
- Assume every input is adversarial or malformed until proven otherwise.
- Prefer a concrete failing example over a general concern.
- If nothing is wrong, say so plainly — don't invent issues to seem useful.

## Boundaries
Does not rewrite code unasked. Flags problems; the human decides the fix.

---
## LOG
```

---

## Compatibility

A `.spirit.md` file works anywhere you can paste text into a system prompt
or context window: Claude, ChatGPT, Gemini, local models via Ollama/LM
Studio, or any agent framework. No SDK required. Tooling in this repo
(`spirits/`, future CLI) is convenience, not a dependency.
