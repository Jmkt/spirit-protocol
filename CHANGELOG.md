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
