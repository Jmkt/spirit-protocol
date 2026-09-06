# Publishing Spirit.MD

How to publish spirits, release the CLI, and deploy a web demo.

---

## 1. Publish a spirit to the repo

1. Create or edit `spirits/<name>.spirit.md` following [SCHEMA.md](SCHEMA.md).
2. Run validation:
   ```bash
   npm test
   ```
3. Commit and push:
   ```bash
   git add spirits/<name>.spirit.md
   git commit -m "feat(spirits): add <name> spirit"
   git push
   ```

---

## 2. Publish the CLI to npm

From the repo root:

```bash
npm login
npm publish --access public
```

After publishing, users can install globally:

```bash
npm install -g spirit-md
spirit list
spirit invoke atenea
```

---

## 3. Deploy a web demo (Vercel)

The fastest path to discovery is a web demo where users can paste a `.spirit.md`
and talk to the spirit in the browser.

### Option A: Static demo (no backend)

1. Create a new Vercel project linked to this repo.
2. Add an `app/` directory with a single-page HTML artifact that:
   - Has a textarea for pasting `.spirit.md` content.
   - Has a chat UI that sends messages to an LLM API with the spirit as system prompt.
   - Supports `@<alias>` invocation by parsing aliases from frontmatter.
3. Deploy:
   ```bash
   vercel --prod
   ```

### Option B: Fullstack demo (Next.js)

1. Scaffold Next.js in a `/demo` folder:
   ```bash
   npx create-next-app@latest demo --typescript --tailwind --app
   ```
2. Add API route `/api/chat` that accepts:
   - `spirit` (the full `.spirit.md` text)
   - `message` (user message)
   - `depth` (optional L0-L4)
3. Wire the API route to call your LLM provider (Claude, OpenAI, etc.) with
   the spirit as system prompt.
4. Deploy:
   ```bash
   cd demo && vercel --prod
   ```

### Required environment variables

| Variable | Purpose | Example |
|---|---|---|
| `LLM_API_KEY` | API key for the LLM provider | `sk-ant-...` |
| `LLM_MODEL` | Model to use for the demo | `claude-3-5-sonnet-20240620` |
| `LLM_PROVIDER` | Provider identifier | `anthropic` / `openai` |

Set these in Vercel dashboard or via CLI:
```bash
vercel env add LLM_API_KEY production
vercel env add LLM_MODEL production
vercel env add LLM_PROVIDER production
```

---

## 4. Distribution checklist

- [ ] `npm publish` completed
- [ ] Vercel demo deployed at `spirit-md.vercel.app`
- [ ] README badges updated with npm version and demo link
- [ ] GitHub repo description updated: "Portable AI personas — one file, any AI, persistent memory"
- [ ] Topics added to GitHub repo: `ai`, `persona`, `prompt`, `markdown`, `llm`, `open-protocol`
- [ ] Tweet / post announcing v2.0 with demo link
- [ ] Submit to: Hacker News, Reddit r/LocalLLaMA, r/ChatGPT, Product Hunt

---

## 5. Growing the spirit library

To make Spirit.MD discoverable, publish ready-to-use spirits:

1. **Tier 1 — Functional archetypes** (already in repo):
   - skeptic, architect, executor, mentor, translator, atenea, sherlock, arcangel

2. **Tier 2 — Historical/mythological figures** (add 10-15):
   - einstein, sunzi, marcus-aurelius, feynman, da-vinci, confucius, machiavelli
   - sherlock-holmes, gandalf, yoda, dumbledore

3. **Tier 3 — Domain-specific personas** (community contributions):
   - product-manager, data-scientist, devops-engineer, ux-researcher, legal-advisor

For each new spirit:
1. Follow [ARCHETYPES.md](ARCHETYPES.md) extraction method.
2. Add `alias: ["@<name>"]` for invocation.
3. Validate with `npm test`.
4. Submit PR with the spirit file and a one-line description in the PR body.

---

## 6. Registry (future)

A spirit registry would enable:

```bash
spirit search strategy
spirit install atenea
spirit publish my-custom-spirit
```

Implementation options:
- **Simple:** A `registry.json` file in the repo listing all spirits with name, tag, description, and alias.
- **Hosted:** A GitHub Pages site with search/filter UI backed by the same JSON.
- **npm:** Publish spirits as separate npm packages under the `@spirit-md` scope.

Recommended path: start with `registry.json` in the repo, then evolve to hosted if traffic grows.
