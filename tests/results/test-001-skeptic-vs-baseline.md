# Test 001 — Skeptic spirit vs. baseline (no spirit)

**Date:** 2026-07-14
**Method:** Two independent fresh agents (same model tier, `general-purpose`,
no shared context), given the identical code review task. Agent A got a
plain instruction. Agent B got the full `skeptic.spirit.md` content pasted
as persona instructions before the same task. Full raw output from both is
below, unedited.

**This is n=1.** It is a single qualitative comparison, not a statistical
benchmark. Do not read "7 issues vs. 9 issues" as "the spirit found fewer
bugs" — re-running this would likely shuffle the exact count either way.
Treat this as an illustration of *how* the output differs, not a performance
claim.

**Task given to both:** review `tests/fixtures/order-total.js` (a small JS
file with a real off-by-one bug and several missing-validation bugs) and
report findings, one-shot, no fixes.

---

## What actually differed

Both agents found the critical bug (off-by-one loop bound causing a crash on
every non-empty call) and most of the same secondary issues — coverage was
similar, which is expected since both ran on the same underlying model tier.
The differences that showed up consistently:

1. **Concrete repro vs. described repro.** The Skeptic-primed agent produced
   an actual runnable example for the critical bug:
   `calculateOrderTotal([{price: 10, quantity: 1}], 0)` throws instead of
   returning `10`. The baseline agent described the same bug correctly but
   in prose, without a copy-pasteable repro line. This matches the spirit's
   explicit heuristic: *"a concrete failing example outweighs a general
   concern."*
2. **Structured, parseable close.** The Skeptic agent ended with the exact
   `[SKEPTIC] → Found: N → Worst case: ...` format defined in its `Sign-off`
   section. The baseline agent ended with a free-form "Summary of severity"
   paragraph. For a human this is a wash; for a tool trying to parse output
   automatically (a CI check, a dashboard), the structured close is the
   difference between "trivial to parse" and "needs another LLM call to
   extract."
3. **Voice.** The baseline review reads like a general code review (numbered
   list, hedged language: "may or may not be desired," "presumably
   unintended"). The Skeptic review is flatter and more assertive, matching
   its `Voice` spec ("short, specific, evidence-based... never a vague
   concern") — e.g., it states the discount-bounds issue as a fact with a
   named risk ("nothing guards against a fat-fingered 150 becoming a
   giveaway") instead of hedging.

## What did NOT differ

- Neither agent missed the critical bug.
- Neither agent found something the other completely missed — the *set* of
  real issues surfaced was nearly identical.
- Severity judgment (off-by-one = critical) was consistent both ways.

## Honest interpretation

On a single well-specified task, a strong general-purpose review is already
strong — the spirit did not make the model "smarter." What it reliably
changed was **presentation and consistency**: concrete repro steps, a fixed
structured sign-off, and a consistent voice. That's a real, useful effect
(automatable output, predictable format across sessions, less hedging) — but
it's a narrower claim than "the spirit improves quality," and the README
should not overstate it.

A fairer summary: **a spirit doesn't add intelligence, it adds consistency
and structure to how that intelligence is expressed** — which matters most
when you're chaining sessions, parsing output automatically, or want
predictable behavior across many invocations, not on any single one-shot task.

---

## Raw output — Agent A (baseline, no spirit)

```
Review findings for the code as written:

**1. Off-by-one loop bounds (critical bug)**
`for (let i = 0; i <= items.length; i++)` uses `<=` instead of `<`. This loop runs one iteration too many, with `i` reaching `items.length` on the final pass. `items[items.length]` is `undefined`, so `items[i].price` throws a `TypeError: Cannot read properties of undefined (reading 'price')`. This will crash on every call with a non-empty array. Should be `i < items.length`.

**2. No handling of empty `items` array**
If `items` is `[]`, the off-by-one bug still fires: the loop runs once with `i = 0`, and `items[0]` is `undefined`, throwing the same TypeError. Even after fixing bound #1, an empty array is not really an error case (`total` should just stay 0), so this is worth confirming is intended behavior rather than an oversight.

**3. No input validation on `items`**
If `items` is `undefined`, `null`, or not an array, `items.length` throws or the loop body throws in a confusing way. No guard clause exists for malformed input.

**4. No validation of `price` / `quantity` values**
If an item has a missing or non-numeric `price` or `quantity` (e.g., `undefined`, a string like `"5"`, or `NaN`), the multiplication silently produces `NaN` and propagates through `total` without any error — a silent-failure mode rather than a loud one. Negative `price` or `quantity` is also accepted without complaint, which may or may not be desired.

**5. No validation of `discountPercent`**
- `discountPercent` being `undefined` produces `NaN` for `discount`, and the function returns `NaN` for the whole order total, silently.
- Values above 100 (e.g., 150) produce a negative discount amount, making the total negative — presumably a bug (no cap).
- Negative `discountPercent` would inflate the total instead of discounting it — again presumably unintended, no validation.

**6. Floating point precision**
`total * (discountPercent / 100)` and the final subtraction use plain floating-point arithmetic. For money math this can accumulate rounding errors (classic 0.1 + 0.2 style issues). `applyBulkDiscount` papers over this at display time with `.toFixed(2)`, but the underlying `total` returned by `calculateOrderTotal` itself is an unrounded float, which could matter if it's used elsewhere (e.g., summed across orders) before formatting.

**7. `applyBulkDiscount` — `total` becomes a string, losing numeric type**
`total.toFixed(2)` converts the numeric total into a string. If any downstream code expects `order.total` to be a number (e.g., to sum all order totals for a grand total), this will silently do string concatenation instead of addition, or require an explicit re-parse. This is a type-safety footgun, especially in vanilla JS with no type checking.

**8. `applyBulkDiscount` has no defensive handling for malformed `orders`**
If `orders` is not an array, or if an individual `order` is missing `items`/`discountPercent`, `.map` will throw deep inside `calculateOrderTotal` with a stack trace that doesn't clearly point back to which order was malformed. No per-order error context (e.g., order ID) is attached before the error would propagate.

**9. No currency rounding strategy for `discount` itself**
The discount is computed on the fly and subtracted in one step; there's no intermediate rounding of `discount` to cents before subtracting, which is a minor but common source of off-by-a-cent discrepancies in financial code when totals are later reconciled against a rounded discount line shown to a user.

**Summary of severity**
- Blocking/critical: #1 (off-by-one causing a guaranteed crash on any non-empty input) — the function as written cannot run successfully at all.
- High: #3, #5 (unvalidated inputs producing NaN or negative totals silently)
- Medium: #4, #7, #8
- Low/style: #6, #9
```

---

## Raw output — Agent B (Skeptic spirit loaded)

```
[SKEPTIC]

Line 3: `for (let i = 0; i <= items.length; i++)` — off-by-one. When `i === items.length`, `items[i]` is `undefined`, and `undefined.price` throws `TypeError: Cannot read properties of undefined (reading 'price')`. This isn't an edge case, it fires on every call with a non-empty array. Should be `i < items.length`.

Concrete failure: `calculateOrderTotal([{price: 10, quantity: 1}], 0)` throws instead of returning `10`.

No missing-field validation on items: if `items[i].price` or `.quantity` is `undefined`, `total` becomes `NaN` and silently propagates through `discount`, the subtraction, and into `applyBulkDiscount`'s `.toFixed(2)` → `"NaN"` written into `order.total`. No error, no signal, just corrupted data downstream.

`items` empty array (`[]`): loop still runs once due to the off-by-one (`i <= 0` is true when `items.length === 0`), so `items[0]` is accessed on an empty array → same `TypeError`. Even fixing the off-by-one doesn't change this specific case's outcome (empty array legitimately produces `total = 0`, but only after the off-by-one is fixed).

`items` not an array / `null` / `undefined`: `items.length` throws `TypeError: Cannot read properties of null/undefined (reading 'length')` before the loop even starts. No guard exists.

`discountPercent` is `undefined`, `null`, or a non-numeric string: `discountPercent / 100` → `NaN`, `discount` is `NaN`, final return is `NaN`. No validation, no default.

`discountPercent` > 100 or negative: no bounds check. A discount of `150` returns a negative total; a discount of `-50` inflates the total by 50%. Might be intentional (surcharge?) but nothing guards against a fat-fingered `150` becoming a giveaway.

`applyBulkDiscount(orders)`: if `orders` is `null`/`undefined`, `.map` throws immediately — no guard. If any `order.items` is missing entirely, `calculateOrderTotal` receives `undefined` for `items` and throws on `.length` per above.

`total.toFixed(2)` returns a string, then that string is spread back into the order object as `total`. If any downstream code does arithmetic on `order.total` (e.g., summing bulk orders), it'll be silently coerced or produce string concatenation bugs (`"10.00" + "5.00" === "10.005.00"`) rather than numeric addition. Not a bug in this file per se, but a footgun baked into the output contract.

Floating-point: `total * (discountPercent / 100)` and repeated `+=` on `price * quantity` accumulate standard binary floating-point error (e.g., `0.1 + 0.2` class issues). For money, `toFixed(2)` at the end masks most of it but can still round wrong on boundary values (e.g., `1.005` → `"1.00"` instead of `"1.01"` due to floating-point representation).

→ Found: 7 issues
→ Worst case: The off-by-one loop bound throws a `TypeError` on essentially every real call with items in the array — this isn't a rare edge case, it's the common path. In production this either crashes the request handler or, if caught upstream and swallowed, silently drops order totals. Combined with the `NaN`-on-missing-field issue, a partially malformed order (one item missing `quantity`) doesn't error at all — it corrupts the total to `"NaN"` and ships it downstream into billing/display with no signal that anything went wrong.
```

---

## Reproduce this test yourself

```bash
# Agent A prompt: paste tests/fixtures/order-total.js and ask for a review, no persona.
# Agent B prompt: paste spirits/skeptic.spirit.md in full above the same request.
# Compare structure, concreteness, and voice — not just issue count.
```

We encourage running this yourself with a different fixture and a different
spirit. If your results disagree with the interpretation above, that's more
useful signal than a repo that only shows results confirming its own pitch —
open an issue with what you found.
