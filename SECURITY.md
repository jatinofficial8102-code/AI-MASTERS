# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The APAAR ID Portal team takes data privacy and academic record integrity very seriously.

If you discover a security vulnerability:

1. **Do not** disclose the vulnerability publicly in an issue or forum.
2. Send a detailed report describing the vulnerability, affected components, and steps to reproduce to the repository maintainer.
3. Include relevant proof-of-concept payloads or screen recordings if applicable.

### What to Expect:
- You will receive an acknowledgment within **48 hours**.
- A patch will be developed, tested, and released as quickly as possible.
- You will be credited in the release notes if you wish.

## Sensitive Data Guidelines

- Never commit real private keys, service role keys, database passwords, or personal student identity credentials to this repository.
- Use environment variables via `.env.local` for local development.
- In production, configure environment variables in your deployment hosting provider (e.g. Vercel, Netlify, Render).
