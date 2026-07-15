# Building Spirits from Archetypes

A spirit doesn't have to be invented from scratch. You can extract a spirit from a historical figure, mythological archetype, or fictional character — but the extraction method matters. This guide shows how to do it ethically and usably.

## The core principle

**Extract function, not biography.** A spirit built from "Einstein" is only useful if its `## Heuristics` encode how Einstein actually *thought* about problems (radical curiosity, constraint-flipping, thought experiments), not his personal life or opinions on unrelated topics. The name is a mnemonic for *you*; the heuristics are the actual content the LLM uses.

## Ethical scope matrix

| Figure type | Safe to extract | Why | Example |
|---|---|---|---|
| **Mythological** (Atenea, Sherlock Holmes) | ✅ Everything | Fictional, no living person harmed | Atenea: strategy + war-game thinking |
| **Historical, long-dead** (Einstein, Sun Tzu, Marcus Aurelius) | ✅ Professional method + public reputation | Centuries of consensus on what they represent; document-safe | Einstein: radical reframing + thought-experiment heuristics |
| **Historical, recently deceased** (Steve Jobs, 2011) | ⚠️ Use generic archetype instead | Right of publicity may still apply (family claims) | "The Perfectionist" instead of "Steve Jobs" |
| **Living person** | ❌ Avoid naming them | Real legal risk (*right of publicity*) | Use "The Visionary CEO" instead |

## Extraction method (one-time, human-reviewed)

Don't automate this. Do it once per spirit, by hand.

**Prompt (for Claude, ChatGPT, or any LLM):**
```
Subject: [Figure name, e.g. "Atenea" or "Albert Einstein"]

Extract the following for this figure, focused on METHOD not biography:

1. **Professional domain / what they're referenced for globally**
   (e.g. Einstein → theoretical physics + radical reframing)

2. **Three specific decision heuristics they embodied**
   (e.g. "Reframe constraints as features, not problems")
   (Not: "He was German" or "He had wild hair")

3. **One concrete example of applying those heuristics to a MODERN TECHNICAL PROBLEM**
   (e.g. "A database schema redesign: flip the constraint 'slow queries on X field' 
    into 'X field is the real entity, reshape the graph around it'")

Return only the three items above. No biography, no opinions on unrelated topics.
```

**Then (human step):**
1. Read the LLM output.
2. Reject anything biographical, opinion-based, or unrelated to the claimed domain.
3. Reject anything that contradicts documented method (e.g. if it invents heuristics Einstein never actually used).
4. Convert the three items into your spirit's `## Heuristics` section.
5. Commit with a note: `spirits/[name].spirit.md — archetype extracted from [figure], method-focused`.

## Examples

### Atenea (mythological — full confidence)
```markdown
---
name: atenea
tag: strategy
invoke: ["atenea", "strategy", "war game", "positioning"]
version: 1.0
---

# SPIRIT: Atenea

## Role
Strategic warfare over combat. Thinks in board-state, leverage, and psychological positioning before action.

## Voice
Asks "what is the true battlefield?" before planning. Cool, analytical.

## Heuristics
- The battlefield is invisible until you name it: map the stakeholders, constraints, and asymmetries first.
- Preferred terrain: where your strength is the other side's weakness.
- War is won before the first move — position so victory is inevitable, not desperate.

## LOG
```

### Sun Tzu (historical, centuries back — safe)
```markdown
---
name: sunzi
tag: strategy
invoke: ["sunzi", "art of war", "deception", "positioning"]
version: 1.0
---

# SPIRIT: Sun Tzu

## Role
Victory through positioning, deception, and knowing the enemy better than yourself.

## Voice
Speaks in principles, not commands. "Know the enemy and know yourself..."

## Heuristics
- Gather intelligence on constraints, incentives, and blindspots before moving.
- Make the enemy believe they have winning moves; let them take them.
- Victory means the opponent surrenders without fighting because they see they've already lost.

## LOG
```

## What NOT to do

❌ Don't build a spirit from a living person's name without legal review  
❌ Don't include personal opinions or life details ("Steve Jobs was a perfectionist AND impatient with mediocrity") — extract only method  
❌ Don't invent heuristics that contradict documented behavior  
❌ Don't use a spirit as a substitute for representing a real person's actual views (always cite the person directly if accuracy matters)

## When in doubt

Use a generic archetype name ("The Strategist", "The Debugger") instead of a real person's name. You lose the mnemonic power, but you gain complete legal clarity.
