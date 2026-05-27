# UI Coding Standards

## Rule: shadcn/ui Only

**All UI components in this project must come from shadcn/ui. No custom components.**

This is a hard rule with no exceptions. Every button, input, dialog, card, badge, table, dropdown, form element, tooltip, or any other UI primitive must be a shadcn/ui component — installed via `npx shadcn@latest add <component>` and sourced from `src/components/ui/`.

## What This Means in Practice

- **Do not** create custom React components that render HTML elements for UI purposes (`<button>`, `<input>`, `<div>` styled as a card, etc.).
- **Do not** use any third-party component library other than shadcn/ui (no MUI, no Chakra, no Radix directly, no Headless UI, etc.).
- **Do not** write inline Tailwind utility classes to build a UI primitive that shadcn/ui already provides — install the shadcn/ui component instead.
- **Do** compose pages and features entirely from components in `src/components/ui/`.
- **Do** install new shadcn/ui components as needed: `npx shadcn@latest add <component>`.

## Installing Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
# etc.
```

Installed components live in `src/components/ui/` and are owned by this project — you may read them but do not modify their internals. If a component needs a variant or behavior that does not exist, open a shadcn/ui issue or use its exposed `className` / `variant` props.

## Allowed Use of Tailwind

Tailwind utility classes are allowed **only** for layout and spacing between shadcn/ui components (e.g., `flex`, `gap-4`, `mt-8`, `grid`). They must not be used to build or style a UI primitive that shadcn/ui covers.

## File Structure

```
src/
  components/
    ui/          ← shadcn/ui components only (do not hand-write files here)
  app/           ← pages/routes that compose ui/ components
```

Do not create a `components/custom/` directory or any file that exports a hand-rolled UI primitive.

## Rationale

A single, consistent component library keeps the visual language coherent, reduces decision fatigue, and makes accessibility and theming predictable across every screen in the app.
