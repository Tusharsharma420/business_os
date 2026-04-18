# Contributing to business_os

Thanks for wanting to contribute! This document explains how to get the project running locally, the expected workflow for changes, and how to make a high-quality pull request.

## Table of contents
- Getting started
- Development workflow
- Branching & commit guidelines
- Pull request checklist
- Code style & linting
- Reporting bugs & requesting features
- Good first issues
- Security

## Getting started (local)
1. Fork the repo and clone your fork:
   git clone https://github.com/<your-username>/business_os.git
2. Install dependencies:
   npm install
3. Start the app (Expo):
   npx expo start
4. Useful scripts:
   - npm run start — start Metro/Expo
   - npm run android / ios / web — open in platform
   - npm run lint — run linter

This project uses the `app` directory for source code (Expo file-based routing). TypeScript is the primary language.

## Development workflow
1. Create a topic branch from `master`:
   - git checkout -b <type>/<short-description>
   - Example: `feat/signup-form` or `fix/login-null`
2. Make small, focused commits with clear messages.
3. Push your branch to your fork and open a Pull Request against `master`.

## Branch naming
- feat/<short-description> — new feature
- fix/<short-description> — bug fix
- docs/<short-description> — documentation
- chore/<short-description> — minor tasks, tooling, deps

## Commit messages
- Use imperative, present-tense style: "Add X", "Fix Y"
- Keep messages concise but descriptive.
- Include issue number when relevant: "Fix #12: handle null user"

## Pull request checklist
- [ ] I have run the app locally and verified the change
- [ ] Code compiles and type checks (TypeScript)
- [ ] Linting passes: `npm run lint`
- [ ] Added or updated tests where applicable
- [ ] PR description explains the change and motivation
- [ ] Link to any related issue(s)

## Code style & linting
- The repo uses TypeScript and ESLint (see eslint.config.js). Run `npm run lint` and fix issues before opening a PR.
- Keep changes small and targeted; prefer readability.

## Reporting bugs & requesting features
- For bugs: open an issue with steps to reproduce, expected vs actual behavior, and environment (Expo, Android/iOS/web).
- For features: describe the user problem, proposed solution, and any UI/UX sketches if applicable.

## Good first issues
- Look for issues labeled `good first issue`. If you’d like to work on one, comment on the issue and assign or claim it.

## Security
- Do not publish sensitive keys or secrets in the repo. For security disclosures, open a private communication channel with the maintainers (or email if provided in the repo).

## Maintainers / Contacts
- If you want, we can add a MAINTAINERS or CODEOWNERS file to document who reviews and merges PRs.

Thank you for contributing!