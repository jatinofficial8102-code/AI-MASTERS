# Contributing to APAAR ID Portal

Thank you for your interest in contributing to the **APAAR ID Portal**! We welcome contributions to make student credential management and institutional verification faster, safer, and more accessible.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful and considerate in all communications.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Check the [Issues tab](https://github.com/jatinofficial8102-code/AI-MASTERS/issues) first to make sure your issue hasn't already been reported.
- If not, open a new issue using our **Bug Report Template**.
- Provide a clear title, reproducible steps, environment details (Node version, OS, browser), and console logs or screenshots where applicable.

### 2. Suggesting Enhancements
- Open a feature request issue describing the rationale, use case, and potential implementation approach.
- Tag the issue with `enhancement`.

### 3. Submitting Pull Requests
- Fork the repository and create your branch from `main`:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Ensure code passes typechecks and building:
  ```bash
  npm run lint
  npm run build
  ```
- Commit your changes using conventional commit messages:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation updates
  - `refactor:` for code restructuring without behavioral changes
  - `style:` for formatting changes

---

## Coding Standards

- **TypeScript**: Strict types are required. Avoid using `any` where explicit interfaces exist in `src/types/index.ts`.
- **Styling**: Use Tailwind CSS utility classes aligned with our design system tokens in `tailwind.config.js`.
- **Component Design**: Keep components modular, accessible (with proper ARIA labels and keyboard navigation), and clean.
- **Secrets & Credentials**: Never commit `.env` or `.env.local` files containing real production keys.

---

## Pull Request Guidelines

1. Make sure your PR targets the `main` branch.
2. Fill out all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
3. Verify that your branch has no merge conflicts with `main`.
4. After review, address any feedback promptly. Once approved, your PR will be squashed and merged.
