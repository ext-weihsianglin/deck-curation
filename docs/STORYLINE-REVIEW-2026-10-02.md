# Storyline review, 2026-10-02

## Baseline prompt added to the narrative

Workshop version 4 uses page 10 to show the informed starting prompt alongside the P1-derived reflection guidance, retaining the 20-page budget. Exact excerpts come from `backend/app/prompts/rewrite-page-v7.txt` and `backend/app/gepa/adapter.py` in the read-only `deck-gepa-prototype` worktree. A reference copy of the full rewriter prompt lives in `sources/prompts/rewrite-page-v7.txt`.

The scorer-to-guidance connection is documented in `docs/gepa-p1-steering.md` in that source worktree. Its earlier coefficient table describes v7, so the slide uses qualitative editing hypotheses rather than presenting those historical coefficients as current v7.1 values. The detailed feature steering belongs to reflection instructions; the baseline rewrite contract itself specifies whole-document P1 feedback and grounded multi-query editing.

Page 15 now explicitly labels the final run baseline as a previously promoted procedure over the fixed v7 contract. The reported improvement is incremental from that informed starting point. It is not a comparison against a generic or unoptimized prompt.

## Second response and reward diagnosis

The second response is preserved in `sources/reviews/storyline-workshop-responses-v2.json`. Workshop version 3 incorporates its expanded future initiatives and Shawn's observation that the surviving GPT-5-mini procedure rarely makes large edits.

Page 15 now separates the observation from the hypothesis that fidelity penalties are too strong. The recommended candidate gained 0.022737 reward, comprising approximately 0.022 lower mean deductions and 0.000737 higher mean P1. Roughly 97% of the reward improvement therefore came from reduced deductions. This decomposition does not establish whether penalty strength, judge behavior, weak score sensitivity, or edit constraints caused the conservative behavior.

Pages 5 and 9 clarify that unchanged additive terms cancel in logistic-regression log odds using the actual transformed features. Site identity exclusion does not remove page-type or template correlations. Fidelity deductions are separate from feature contributions.

Page 19 proposes a fixed-page text/structure ablation, a penalty sweep and judge audit, usefulness judgments, stronger scoring and feature feedback, competitor traces, and later distillation and reinforcement fine-tuning. These are proposed experiments. No source system or experiment was modified. Replacing absolute P1 with a delta against the same original pages preserves rankings by mean reward on a fixed evaluation set.

This note records how the first workshop response changed the 20-page storyline. The response file remains at `~/Downloads/storyline-workshop-responses.json`.

## Decisions incorporated

- Product name: **Multi-Query Content Optimizer**.
- Presenter line: **Shawn Lin, October 2, 2026**. No role on the cover.
- Audience: potential peer ICs, engineering managers, and product managers.
- Product emphasis: explanation helps users understand weak performance; optimization gives them an action to take.
- Scope: learn patterns from a host's strongest observed pages, then apply the learning through a recurrent content-optimization loop.
- Commercial premise: improving a host's weakest pages should create value, but this remains a strong and loosely held assumption.
- Technical emphasis: explain the preprocessing contract, logistic-regression scorer, per-query feature effects, exploitation failures, guardrails, and GEPA procedure search.
- Demo: use a held-out example with as many as ten queries and show the complete working path.

## Technical clarifications

- The five-stronger and five-weaker records are balanced by sampling. P1 therefore predicts stronger sampled-group membership, not the probability of receiving a citation.
- Hostname identity is absent from the logistic-regression feature vector. During rewriting, the host, ordered query set, frozen scorer, and source inventory remain fixed. This makes before-and-after score movement useful as a controlled surrogate, not causal citation uplift.
- Linked PDF text does not enter the offline HTML parser automatically. A production system needs a separate PDF ingestion path using native extraction with visual or OCR fallback when necessary.
- The implemented GEPA reward is `raw proposed-page mean P1 - sum(per-block fidelity penalties)`. Defaults are 0.05 for an unsupported edited block and 0.02 for an uncertain edited block.
- GEPA changes the bounded `query-procedure-v1` editorial procedure. The fixed security, evidence, output, and model contracts remain locked.

## Final GEPA run

Source: `~/Downloads/gepa-evidence-first-penalty-search-20261002-160122-ff558978.json`, parsed with `jq --stream` rather than loaded into memory.

- Run status: completed at the proposal limit.
- Configuration: GPT-5-mini rewriter and reflection model, GPT-5 fidelity judge, 60 reflection pages, 30 selection pages, 50 proposal rounds, 1,000 rewrite-attempt ceiling, concurrency 30, and a 6,000-character procedure limit.
- Execution: 703 completed attempts and 13 technical failures.
- Baseline: raw mean P1 0.408184, mean penalty 0.059333, reward 0.348851, fidelity-violation rate 73.3%, and execution-failure rate 0%.
- Recommended candidate: raw mean P1 0.408921, mean penalty 0.037333, reward 0.371588, fidelity-violation rate 60.0%, and execution-failure rate 0%.
- The highest numerical reward was 0.375372, but that frontier candidate had a 3.3% execution-failure rate. The coordinator recommended the candidate that improved reward without worsening failures.
- The recommended procedure classifies query support against same-chunk evidence, favors minimal literal edits, forbids unsupported cross-chunk synthesis, and reports uncovered queries rather than inventing answers.

## Remaining decisions

- Final subtitle and whether the work-trial context appears on the cover.
- Canonical host, page, and query for the screenshots and live demo.
- Final P1 version and held-out metric to feature.
- Whether to update the extraction report before citing Markdownify as the measured final choice.
- Demo timing and whether to make a live model call.
- The single closing question for the interview panel.
