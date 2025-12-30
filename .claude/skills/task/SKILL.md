---
name: task
description: Execute complex tasks with planning, parallel subagents, atomic commits, and documentation updates. Use when the user asks to implement a feature, refactor code, or complete multi-step work.
---

# Task Execution Skill

Execute complex tasks using a structured workflow: plan → review → execute → commit → document.

## Workflow

### Phase 1: Planning

1. **Analyze the request** - Understand what the user is asking for
2. **Explore the codebase** - Use the Explore agent to understand:
   - Relevant files and their structure
   - Existing patterns and conventions
   - Dependencies and integrations
3. **Break into atomic steps** - Create a plan where each step:
   - Can be completed independently
   - Results in working code (no broken intermediate states)
   - Is small enough for a single commit
4. **Identify parallelization** - Mark which steps can run in parallel vs sequentially

### Phase 2: Plan Review

1. **Present the plan** to the user with:
   - Overview of the approach
   - Numbered list of steps
   - Which steps will run in parallel
   - Any assumptions or decisions made
2. **Wait for approval** - Use AskUserQuestion if needed to clarify:
   - Ambiguous requirements
   - Implementation choices
   - Scope boundaries
3. **Revise if needed** based on user feedback

### Phase 3: Execution

1. **Use TodoWrite** to track all steps
2. **Spawn subagents** using the Task tool:
   - Run independent steps in parallel (multiple Task calls in one message)
   - Run dependent steps sequentially
   - Each subagent should complete one atomic unit of work
3. **Subagent instructions** should include:
   - Clear scope of what to implement
   - Files to modify
   - Patterns to follow (reference existing code)
   - Instruction to NOT commit (parent will handle commits)

### Phase 4: Atomic Commits

After each logical unit of work is complete:

1. **Stage only related changes** - Don't mix unrelated changes
2. **Write descriptive commit messages**:
   - First line: imperative mood, max 50 chars (e.g., "Add blur placeholders for images")
   - Body: explain WHY, not just WHAT
   - Reference the step from the plan
3. **Commit format**:
   ```
   <type>: <short description>

   <optional body explaining why>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```
4. **Types**: feat, fix, refactor, docs, style, test, chore

### Phase 5: Documentation Check

After all work is complete:

1. **Review what changed** - List the major changes made
2. **Check if documentation needs updates**:
   - README.md - New features, changed setup, updated commands
   - Code comments - Complex logic that needs explanation
   - Type definitions - New interfaces or types
3. **Ask the user** if documentation updates are desired
4. **If yes**, create a separate commit for docs

## Guidelines

- **Never leave code in a broken state** - Each commit should pass build/lint
- **Prefer editing over creating** - Modify existing files when possible
- **Follow existing patterns** - Match the codebase style
- **Keep changes minimal** - Only change what's necessary for the task
- **Test as you go** - Run build/tests after significant changes

## Example Subagent Prompt

```
Implement the blur placeholder generation script.

Context:
- This is step 2 of 5 in adding image blur placeholders
- The project uses Next.js with TypeScript
- Sharp is already installed for image processing

Task:
- Create scripts/generate-blur-placeholders.ts
- Read all images from public/images/themes/
- Generate 10x10 blurred base64 data URLs
- Output to src/config/blur-placeholders.ts

Follow the patterns in scripts/generate-images.ts.
Do NOT commit - just implement and verify it works.
```
