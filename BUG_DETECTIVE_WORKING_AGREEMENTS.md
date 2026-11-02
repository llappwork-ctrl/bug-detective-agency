# THE BUG DETECTIVE AGENCY
## Creative Development & AI-Assisted Learning — Working Agreements

**Version:** 1.0 — October 31, 2026
**Project:** The Bug Detective Agency / Laura's Curious Codes
**Status:** Product-owner-approved working direction; repository adoption pending

## 1. What we're creating

The Bug Detective Agency is an original, playful, detective-noir-inspired interactive mystery game and public learning portfolio project.

The project has two equally important purposes:

* Create an engaging, imaginative experience featuring Mabel Quibble, interactive clues, unusual mysteries, and a detective's office that changes as the player progresses.
* Provide a hands-on environment for learning HTML, CSS, JavaScript, Git/GitHub, browser debugging, manual software testing, and effective AI-assisted development.

This is a learning project, not a deadline-driven production assignment. Progress should remain enjoyable and sustainable.

## 2. Roles and ownership

### Laura — Creator, Product Owner, Learner, and Final Publisher

* Owns the original creative direction, characters, stories, product requirements, and experience decisions.
* Learns and experiments with code directly in VS Code.
* Performs exploratory testing, investigates intentionally planted defects, and determines whether features meet expectations.
* Decides what changes are accepted and when they are ready for publication.
* Is the only person authorized to perform Git pushes.
* May approve local commits but retains control of public publication.

### Claude — AI Development Collaborator / Dream Builder

* Helps turn approved creative ideas into working HTML, CSS, and JavaScript.
* Implements bounded features and prepares controlled debugging exercises.
* Inspects existing work before editing.
* Explains changes when requested without overwhelming the learning experience.
* May create local commits only with explicit authorization.
* Never pushes, publishes, or deploys.
* Must preserve Laura's existing work and creative intent.

### ChatGPT — Creative Collaborator, Learning Coach, and QA Guide

* Helps develop story, visual design, interactions, and learning goals.
* Teaches coding concepts as they become relevant.
* Helps Laura investigate bugs without revealing hidden solutions prematurely.
* Prepares bounded implementation prompts and reviews reports.
* Keeps AI contributions separate from Laura's demonstrated work.
* Does not authorize publication on Laura's behalf.

## 3. The creative experience

The game is meant to develop into an interactive mystery experience with original characters, humor, carefully placed clues, and detective-noir atmosphere.

Mabel Quibble is a recurring character whose personality appears in dialogue, behavior, and subtle environmental changes.

Her corner may evolve as the player finds genuine clues: a shifted chaise, blankets, plants, a sleepy-flower standing lamp, sunlight effects, and other discoverable details.

Creative changes should preserve readability, usability, accessibility, and the player's ability to investigate the room.

Laura's creative decisions take precedence over unapproved AI suggestions.

## 4. The learning rhythm

The preferred rhythm is:

**Hidden QA mystery → Investigation → Correction and retesting → Creative/visual improvement → Repeat.**

This is a preference, not a mandatory schedule.

Learning should be playful, practical, and connected to the game.

* Teach new concepts in beginner-friendly language.
* Build on skills Laura has already demonstrated.
* Avoid repeatedly teaching completed exercises.
* Provide manageable batches rather than requiring confirmation after every tiny instruction.
* Allow independent experimentation and creative changes.
* Offer explanations when helpful, but move forward when Laura understands.
* Do not automatically turn every experiment into a portfolio assignment.

## 5. Hidden QA challenges

Claude may intentionally introduce a small, harmless software defect into an authorized local development version of the actual Bug Detective Agency.

A challenge must:

1. Have clearly defined expected behavior.
2. Contain one primary intentional defect.
3. Be bounded, reversible, and suitable for manual investigation.
4. Use fictional data only.
5. Keep the defect and solution hidden until Laura identifies it, asks for the answer, or ends the investigation.
6. Avoid revealing the cause through an overly specific setup report.
7. Preserve a known-good recoverable version of the game.
8. Never affect Bridgeway or other projects.

Claude prepares the challenge. Laura independently explores the behavior, reports what she observes, and may inspect DevTools, code, and Git history.

ChatGPT provides graduated hints when requested, not unsolicited spoilers.

Once the investigation ends, Claude may explain the cause and implement a correction after approval. Laura retests the original behavior and relevant neighboring features.

A real existing defect should not be silently replaced with a planted defect.

## 6. Git and publishing safety

The main playable version is public through GitHub Pages.

Laura alone runs `git push`. This rule has no exceptions without a new explicit product-owner decision.

Claude must never:

* Push branches or commits to GitHub.
* Trigger deployments or publish the site.
* Force-push, reset, discard, or rewrite existing history without specific approval.
* Overwrite uncommitted learning work.
* Merge challenge work into the publishable branch without approval.
* Automatically commit changes unless expressly authorized.

Before intentionally breaking the game, preserve the current work and establish an appropriate local challenge branch or isolated working copy of the same project.

If a branch is used, verify its identity before edits and before any later push.

Only corrected, reviewed, accepted versions should be pushed to the publishable branch.

A clean Git working tree does not prove the game works. Browser testing is still required.

## 7. Change boundaries

Before implementation, identify:

* What is being changed.
* What must remain unchanged.
* What behavior is expected.
* What tests or browser checks are appropriate.
* When work must stop for Laura's decision.

Prefer small changes with understandable diffs.

Do not add new frameworks, Python/Flask, databases, accounts, external services, or major dependencies simply because they might be useful.

Any significant architectural change requires discussion and approval.

Keep The Bug Detective Agency independent from Our Bridgeway Journey.

## 8. Honest learning and portfolio evidence

The public portfolio should accurately distinguish creative direction, AI implementation, independent investigation, testing, and correction work.

For controlled QA challenges:

* Identify the defect as intentionally introduced by an AI coding assistant.
* Record what Laura personally discovered, reproduced, inspected, documented, and retested.
* Credit Claude for the code it actually wrote or repaired.
* Credit collaborative guidance without presenting it as independent implementation.
* Never present a constructed learning challenge as an accidental production incident.

A suitable description, when supported by a completed investigation, is:

> "An AI coding assistant introduced a controlled defect into my JavaScript mystery game without revealing its cause. I independently explored the behavior, reproduced the failure, investigated using Chrome DevTools, documented my findings, and verified the correction."

Use this wording only for investigations where every stated step was actually completed.

## 9. Safe data and project boundaries

Use fictional characters and records for game content and testing.

Never copy private Bridgeway application code, real family information, credentials, confidential documents, or identifiable test material into the public game.

The permission to introduce intentional defects applies to authorized local Bug Detective Agency development work only.

It does not extend to Bridgeway, unrelated repositories, or deployed services.

## 10. Handling mistakes and uncertainty

Mistakes are expected during learning.

When an error occurs:

* Describe what was observed.
* Distinguish observation from assumption.
* Investigate before replacing or deleting working code.
* Avoid assigning credit or responsibility inaccurately.
* Preserve recoverable work.
* Admit when earlier advice or AI-generated code was mistaken.
* Explain the correction at the level Laura needs.

Do not repeat completed tasks because conversation context was lost.

## 11. Documentation and handoffs

Maintain this document as the project's shared working agreement.

A repository-level `CLAUDE.md` should direct Claude to read and respect it.

Before creating `CLAUDE.md`, inspect whether one already exists and preserve any relevant instructions.

Meaningful learning milestones may be handed off to the Getting a Job Learning Notebook using the established Purple Envelope process.

Only documented, demonstrated work should become portfolio or résumé evidence.

## 12. Final authority

Laura decides the creative direction, learning pace, testing acceptance, scope, and publication timing.

AI collaborators may recommend alternatives and flag risks but must not silently substitute their preferences for Laura's decisions.

**Guiding principle:** Create with curiosity. Investigate with evidence. Learn without rushing. Publish deliberately.

## 13. Occasional Independent Review and Documentation Support

### Codex — Independent Inspector

Codex may periodically inspect The Bug Detective Agency to identify defects, regressions, accessibility concerns, unintended interactions, or differences between expected and implemented behavior.

Independent review is recommended after meaningful feature milestones, complex corrections, saved-state changes, or before significant public releases.

Routine visual experiments and small learning exercises do not automatically require Codex review.

Reviews are read-only by default. Codex must not modify code, commit, push, or publish without a separately approved scope. Findings are evidence for the Creator to evaluate, not automatic authorization for implementation.

For intentionally planted QA challenges, Codex must not disclose the hidden defect or its solution to the investigator before the investigation is complete.

### ChatGPT Work — Documentation and Portfolio Support

Work may assist with substantial documentation, learning records, QA case studies, and milestone summaries.

Documentation should distinguish the Creator's original decisions and demonstrated activities from AI-assisted coding, testing, inspection, and reporting.

Work does not replace the Creator's approval, alter source code without authorization, or publish on the Creator's behalf.

### Review frequency

Use independent review when its value justifies the effort. Avoid unnecessary process, repeated inspections, and administrative overhead.

**Publication remains exclusively under the Creator's control. Laura alone performs Git pushes.**
