# Work Squared

Work Squared is an AI-enabled work environment.

## Running locally

```bash
export VITE_LIVESTORE_SYNC_URL='http://localhost:8787'
pnpm
pnpm dev
```

## Development Commands

```bash
# Run development server (Vite + Wrangler)
pnpm dev

# Run Storybook (port 6010)
pnpm storybook

# Run tests
pnpm test
pnpm test:e2e

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm wrangler:deploy
```

## Ports

- **Vite dev server**: 5173
- **Wrangler dev server**: 8787
- **Storybook**: 6010 (configured to avoid conflicts with other Storybook instances)

## Testing

The project includes a comprehensive testing setup:

### Unit & Component Tests (Jest + React Testing Library)
```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Generate coverage report
```

### End-to-End Tests (Playwright)
```bash
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Open Playwright UI mode
```

### Component Development (Storybook)
```bash
pnpm storybook         # Start Storybook dev server (port 6010)
pnpm build-storybook   # Build static Storybook
pnpm test:storybook    # Run Storybook tests
```

### CI/CD
- All tests run automatically on every PR via GitHub Actions
- Test results and coverage reports are uploaded as artifacts
