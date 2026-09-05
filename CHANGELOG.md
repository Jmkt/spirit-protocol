# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-16

### Added
- Formal JSON Schema draft for `.spirit.md` format in `SCHEMA.md`
- Node.js validator (`src/validate.js`) with checks for:
  - Required frontmatter fields (`name`, `tag`, `invoke`, `version`)
  - Semver format validation
  - Presence of `## Boundaries` and `## LOG` sections
  - Base64 blobs and zero-width character detection
- CLI `bin/spirit` with commands:
  - `spirit list` — list available spirits
  - `spirit invoke <name>` — print spirit for copy-paste
  - `spirit log <name> <message>` — append to spirit LOG
  - `spirit validate [path]` — run schema validation
- GitHub Actions CI (`validate.yml`) running on push/PR to `spirits/`
- `package.json` for npm distribution (`spirit-md`)
- `CHANGELOG.md`

### Changed
- `SCHEMA.md` expanded with formal schema section and stricter security rules
- `.gitignore` updated for Node.js artifacts

### Security
- Explicit prohibition of base64, zero-width chars, and shell instructions in spirits

## [2.0.0] - 2026-09-04

### Added
- **Declarative depth levels (L0-L4):** Identity → Metacognition → Mnemonic → Archive → Action
- **Cognitive Fingerprint (§2):** heuristics, biases, anti-patterns, decision tree
- **Mnemonic Schema (§3):** core analogies, lexicon, mental models, rhetorical habits
- **Archive Shadows (§4):** distilled canon refs, bibliography, mythic sources
- **Self-Actions (§5):** on_load, on_query, on_gap, on_contradiction, self_review_trigger
- **GAPS_LOG (§6):** append-only knowledge gaps maintained by the spirit itself
- **User-Side Toggles (§7):** [FAST], [FULL], [EXTEND], [REVIEW], [CHAIN X]
- **@-mention protocol:** `alias` frontmatter field enables `@<spirit>` invocation
- **Token economy:** depth-aware loading keeps L0 at ~50 tokens
- **Backward compatibility:** v0.1 spirits remain valid; §1-§7 are optional

### Changed
- `SCHEMA.md` rewritten as v2.0 spec with seven declarative sections
- `spirits/atenea.spirit.md` upgraded to v2.0
- `spirits/sherlock.spirit.md` upgraded to v2.0
- `src/validate.js` updated to support v2.0 format detection and new optional fields
- `ARCHETYPES.md` expanded with v2.0 extraction method and migration guide
- `README.md` rewritten for v2.0 with depth levels, @-mentions, and composability examples

### Security
- GAPS_LOG explicitly declared as spirit-internal; never expose without user consent
- Self-actions cannot execute code or access external systems
