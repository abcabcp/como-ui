<div align="center">

# como-ui

**Beautifully designed, accessible React components. Copy. Paste. Ship.**

A shadcn-style component library focused on **mobile-first interactions** — starting with the best snap scroll pickers on the web.

[![npm](https://img.shields.io/npm/v/@como-ui/cli?style=flat-square)](https://www.npmjs.com/package/@como-ui/cli)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)

</div>

---

## Philosophy

`como-ui` is **not** a traditional npm component library. Following the [shadcn/ui](https://ui.shadcn.com) philosophy:

- **You own the code.** Components are copied into your project, not installed as a dependency.
- **Fully customizable.** Tweak, extend, or rip apart the source — it's yours.
- **Typed, accessible, production-ready.** Built on Radix primitives + Tailwind CSS + TypeScript.

## Quick start

```bash
# 1. Initialize in your Next.js / Vite / Remix project
npx @como-ui/cli@latest init

# 2. Add a component
npx @como-ui/cli@latest add snap-picker
npx @como-ui/cli@latest add time-picker
npx @como-ui/cli@latest add number-picker
```

## Components

| Component         | Status    | Description                                              |
| ----------------- | --------- | -------------------------------------------------------- |
| `snap-picker`     | 🚧 WIP    | Generic vertical snap scroll picker (typed, headless)    |
| `time-picker`     | 🚧 WIP    | 12h / 24h, timezone-aware, minute-step                   |
| `number-picker`   | 🚧 WIP    | min/max/step numeric picker with padding                 |
| _more soon_       |           |                                                          |

## Repository

This is a monorepo containing:

- `packages/cli` — `@como-ui/cli`, the command-line tool
- `packages/registry` — registry schema & types
- `registry/` — the actual component source files distributed to users
- `apps/www` — documentation site at [como-ui.dev](#) (coming soon)

## License

MIT © cocomomo
