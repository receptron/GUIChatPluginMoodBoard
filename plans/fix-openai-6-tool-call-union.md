# Fix: openai 4 → 6 migration — demo `useChat.ts` tool-call union

Issue: https://github.com/receptron/GUIChatPluginMoodBoard/issues/16

## Problem

The dep-bump PR reverted `openai ^4.77.0 → ^6.45.0` because CI typecheck failed:

```
demo/vue/useChat.ts: error TS2339:
  Property 'function' does not exist on type 'ChatCompletionMessageToolCall'.
  Property 'function' does not exist on type 'ChatCompletionMessageCustomToolCall'.
```

## Root cause

`openai@6` re-typed `ChatCompletionMessageToolCall` as a discriminated union
(`function` | `custom`). The demo reads `tc.function.*` directly, which only exists
on the `function` variant.

## Fix

Filter to the function variant before mapping (TypeScript infers the type predicate
from the `.filter` callback, so no cast is needed):

```ts
const toolCalls = message.tool_calls
  .filter((tc) => tc.type === "function")
  .map((tc) => ({
    id: tc.id,
    name: tc.function.name,
    arguments: tc.function.arguments,
  }));
```

File: `demo/vue/useChat.ts`. `package.json` restores `openai: ^6.45.0`.

## Verification

- `yarn typecheck` — passes (was the CI failure)
- `yarn lint` — passes
- `yarn build` — passes
