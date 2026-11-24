---
name: Testing Standards
description: 'Felles testprinsipper for frontend med Vitest og Playwright.'
applyTo: '**/*.{test,spec}.{ts,tsx}'
---

# Testing Standards

Frontend testing principles for this Vite/React monorepo. Use the existing Vitest and Playwright setup. See [TypeScript testing](testing-typescript.instructions.md) for mocking and component examples.

## Test Coverage

### Coverage Requirements

- **Utilities in `lib/`**: 80%+ coverage required
- **Business logic**: 70%+ coverage required
- **API clients**: Test success and error responses
- **Components**: Test user interactions and loading, empty and error states
- **User workflows**: Test critical journeys and accessibility

## Test Naming

Use Norwegian names that describe observable behavior, such as `viser feilmelding når henting feiler`.
Avoid generic names such as `test1` or `testValidation`.

## Test Strategy

Choose test type based on what you're verifying:

| What to test            | Test type        | Tools                          |
| ----------------------- | ---------------- | ------------------------------ |
| Pure functions, utils   | Unit test        | Vitest                         |
| Components and hooks    | Component test   | Vitest + React Testing Library |
| API client interactions | Integration test | Vitest + existing MSW handlers |
| User workflows          | E2E test         | Playwright                     |
| Accessibility           | E2E test         | Playwright + axe-core          |

### When to use what

- **Unit**: Business logic, data transformations, formatting
- **Component**: Rendered behavior, interactions and component states
- **Integration**: Components and API clients together, with existing MSW handlers
- **E2E** (Playwright): Critical user journeys, form submission, navigation

## Playwright E2E Tests

Follow the [Playwright skill](../skills/playwright-testing/SKILL.md) and the affected app's existing fixtures.
Use role-based locators and assert the expected user-visible result after each interaction.
Never derive the expected result from the same current value being asserted.

### Accessibility in E2E

Use the existing Playwright and axe-core setup where available. Cover keyboard navigation,
focus behavior and accessible names as well as automated checks.

## Commands

Run `pnpm --filter <workspace> test:no-watch` for affected Vitest tests, with narrower selectors when available.
Use the affected app's existing Playwright script for E2E tests. Include affected consumers when shared packages change.

## Boundaries

### ✅ Always

- Write tests for new code before committing
- Test both success and error cases
- Use descriptive test names
- Clean up test data after each test
- Run full test suite before pushing

### ⚠️ Ask First

- Changing test framework or structure
- Adding complex test fixtures
- Modifying shared test utilities
- Disabling or skipping tests

### 🚫 Never

- Commit failing tests
- Skip tests without good reason
- Test implementation details
- Share mutable state between tests
- Commit without running tests
