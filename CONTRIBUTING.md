# Contributing to Death Note

Thank you for considering contributing to Death Note! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Documentation](#documentation)
- [Testing](#testing)
- [Security Guidelines](#security-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code.

- Respect fellow contributors
- Use inclusive language
- Be patient with new contributors
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 18.0+
- npm or yarn
- Git

### Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/deathnote.git
   cd deathnote
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/8bittts/deathnote.git
   ```
4. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
5. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make sure you're working from the latest code:
   ```bash
   git pull upstream main
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (see commit guidelines below)
6. Push to your fork
7. Submit a pull request

## Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Ensure all tests pass
3. Ensure your code follows the established coding standards
4. The PR should work on the latest version of the codebase
5. Include a clear description of the changes
6. Link any related issues

## Coding Standards

### TypeScript
- Use TypeScript for all files
- Define proper interfaces for props and state
- Use proper typing, avoid using `any`

### React and Next.js
- Use functional components with hooks
- Prefer server components where possible
- Use client components only when necessary for interactivity
- Follow React best practices

### File Structure
- Place components in appropriate directories based on their usage
- Follow the existing project structure
- Name files according to the established conventions

### Styling
- Use Tailwind CSS for styling
- Follow the design system
- Ensure responsiveness for all screen sizes

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add two-factor authentication

- Implements SMS verification
- Adds backup codes feature

Closes #123
```

## Documentation

- Document all public-facing APIs, components, and functions
- Use JSDoc comments for functions and methods
- Keep the README and other documentation up-to-date
- Document new features thoroughly

Example of a well-documented component:

```tsx
/**
 * A component that displays user verification history
 * 
 * @param userId - The ID of the user whose history to display
 * @param limit - Maximum number of records to show (default: 10)
 * @param onRecordSelect - Callback when a record is selected
 */
export function VerificationHistory({
  userId,
  limit = 10,
  onRecordSelect
}: VerificationHistoryProps) {
  // Component implementation
}
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test across different browsers and devices
- Consider edge cases and accessibility

## Security Guidelines

- Never commit sensitive information (API keys, credentials)
- Use environment variables for secrets
- Validate all user inputs
- Follow security best practices
- Report security vulnerabilities privately to the maintainers

---

Thank you for contributing to Death Note! Your efforts help make this project better for everyone. 