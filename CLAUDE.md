# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Dev server (http://localhost:4200)
pnpm build          # Production build + transloco AOT optimization
pnpm test           # Run tests (Vitest via Angular's unit-test builder)
pnpm lint           # ESLint on src/**/*.ts and src/**/*.html
pnpm i18n:extract   # Extract translation keys from source
pnpm i18n:find      # Find missing/unused translation keys
```

To run a single test file, use the Angular CLI directly:
```bash
pnpm ng test --include="src/app/path/to/spec.ts"
```

## Architecture

### Feature structure

Features live in `src/app/features/<name>/` and are lazy-loaded via `routes.ts` in each folder. Each feature owns its own routes, components, services, pipes, and models. The two layouts are `MainLayout` (authenticated sidebar shell) and `EmptyLayout` (used for auth and error pages).

### UI Components — spartan-ng (HLM)

All UI primitives are vendored locally in `src/app/spartan/<component>/src/`. They are imported via path aliases like `@spartan-ng/helm/button`, `@spartan-ng/helm/card`, etc. (see `tsconfig.json` for the full alias list). The underlying headless logic comes from `@spartan-ng/brain`. **Do not install `@spartan-ng/helm` from npm — use the local copies.**

### Path aliases

| Alias | Resolves to |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@spartan-ng/helm/<name>` | `src/app/spartan/<name>/src/index.ts` |

### Mock API

There is no backend. All HTTP calls to `/api/users` are intercepted by `mockApiInterceptor` (`src/app/core/interceptor/mock-api-interceptor.ts`), which maintains an in-memory database seeded from `src/app/core/mock/users.data.ts`. Other features (calendar, tasks, dashboard) use static data directly from `src/app/core/mock/`.

### State management

- Signal-based services act as stores (e.g., `CalendarStore`).
- `AuthService` holds the current user signal and `isAuthenticated` computed.
- `ThemeService` manages light/dark/system theme, applied via a `dark` class on `<html>`.
- `LanguageService` handles locale registration, RTL direction, and calendar i18n for `en`, `fr`, and `ar`.

### Shared DataTable

`src/app/shared/datatable/table/data-table.ts` wraps TanStack Angular Table. It supports two modes:
- **`client`** (default): pass all data, table handles pagination/sorting internally.
- **`server`**: pass current page + `totalElements`, bind `paginationState`/`sortingState`, and handle `(stateChange)` to fetch from the API.

### i18n

Translation files are in `public/i18n/{en,fr,ar}.json`. Use `TranslocoDirective` or the `transloco` pipe in templates. Page titles are translated via `TranslateTitleStrategy`. When adding new strings, run `pnpm i18n:extract` to keep translation files in sync.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- Component selector prefix is `adm` (e.g., `adm-data-table`)

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
