# Contributing to Nimbora

Thank you for your interest in contributing to Nimbora! We appreciate your effort and are excited to work with you.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. By participating, you agree to abide by its terms.

## How to Contribute

### Types of Contributions

- **Bug Reports** - Help us identify and fix issues
- **Feature Requests** - Suggest new features or improvements
- **Code Contributions** - Submit fixes or new features
- **Documentation** - Improve or expand our documentation
- **Testing** - Help test and verify changes

## Development Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Git

### Installation Steps

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nimbora.git
cd nimbora

# Add upstream remote
git remote add upstream https://github.com/siloneedsleep/nimbora.git

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name
```

## Making Changes

### Branch Naming Convention

Use descriptive branch names:
- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation
- `refactor/description` - For code refactoring
- `test/description` - For test improvements

### Commit Message Format

Follow the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, semicolons, etc.)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Code change that improves performance
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to build process, dependencies, or tools

**Scope:** Component or module affected

**Subject:**
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

**Body:**
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with a blank line

**Footer:**
- Reference issues: `Closes #123`
- Break changes: `BREAKING CHANGE: description`

### Example Commit

```
feat(editor): add AI suggestion panel

Implement a floating panel for AI-powered code suggestions.
The panel appears on demand and can be dismissed with Escape.

Closes #456
```

## Submitting Changes

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   npm run test
   npm run lint
   ```

3. **Check documentation**
   - Update README.md if needed
   - Add JSDoc comments to new functions
   - Update CHANGELOG.md

### Pull Request Process

1. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub
3. Fill out the PR template completely
4. Link related issues
5. Wait for code review

### PR Guidelines

- One feature per PR
- Keep PRs focused and manageable
- Include tests for new features
- Update documentation
- Request review from maintainers
- Respond to feedback promptly
- Keep commits organized and clean

### PR Title Format

```
[type] Brief description of changes

Examples:
[feat] Add AI suggestion panel
[fix] Resolve memory leak in editor
[docs] Update installation guide
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Breaking change

## Related Issues
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
Add screenshots or videos for UI changes.

## Checklist
- [ ] My code follows the coding standards
- [ ] I have tested the changes
- [ ] I have updated the documentation
- [ ] I have added tests (if applicable)
- [ ] No new warnings are generated
```

## Coding Standards

### TypeScript

- Use strict mode
- Define types for all variables and function parameters
- Avoid `any` type - use `unknown` and type guards instead
- Use meaningful names for variables and functions

```typescript
// Good
function getUserById(userId: string): Promise<User | null> {
  // Implementation
}

// Avoid
function get(id: any): any {
  // Implementation
}
```

### Naming Conventions

- **Variables & Functions:** camelCase
  ```typescript
  const userName = "John";
  function calculateTotal() {}
  ```

- **Classes & Types:** PascalCase
  ```typescript
  class UserManager {}
  interface UserProfile {}
  type UserRole = "admin" | "user";
  ```

- **Constants:** UPPER_SNAKE_CASE
  ```typescript
  const MAX_USERS = 100;
  const API_TIMEOUT = 5000;
  ```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- No trailing commas (unless in multi-line)
- Use arrow functions for callbacks

```typescript
// Good
const items = [1, 2, 3];
const doubled = items.map((x) => x * 2);

// Avoid
var items = [1, 2, 3,];
var doubled = items.map(function(x) { return x * 2; });
```

### Documentation

- Add JSDoc comments to all public functions and classes
- Explain complex logic with inline comments
- Keep comments up to date

```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
function add(a: number, b: number): number {
  return a + b;
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

- Test file naming: `*.test.ts` or `*.spec.ts`
- Test folder structure matches source structure
- Aim for at least 80% code coverage
- Test both happy path and edge cases
- Use descriptive test names

```typescript
describe('UserService', () => {
  it('should create a user with valid input', () => {
    // Arrange
    const userData = { name: 'John', email: 'john@example.com' };
    
    // Act
    const user = UserService.create(userData);
    
    // Assert
    expect(user.name).toBe('John');
  });

  it('should throw error when email is invalid', () => {
    // Arrange, Act, Assert
    expect(() => {
      UserService.create({ name: 'John', email: 'invalid' });
    }).toThrow();
  });
});
```

## Documentation

### Updating Documentation

- Keep README.md synchronized with major changes
- Update API documentation when endpoints change
- Add examples for new features
- Fix typos and improve clarity

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add diagrams for complex concepts
- Keep formatting consistent

## Reporting Bugs

### Before Reporting

- Check if the bug already exists in [Issues](https://github.com/siloneedsleep/nimbora/issues)
- Try to reproduce with the latest version
- Gather relevant information

### Bug Report Template

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., macOS 12.0]
- Node.js: [e.g., 16.13.0]
- npm: [e.g., 8.0.0]
- Browser: [if applicable]

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other relevant information.
```

## Suggesting Features

### Before Suggesting

- Check [Issues](https://github.com/siloneedsleep/nimbora/issues) for similar requests
- Consider if it aligns with project goals

### Feature Request Template

```markdown
## Description
Clear description of the requested feature.

## Motivation
Why would this feature be useful?

## Proposed Solution
How should it work?

## Alternatives
Any alternative approaches considered.

## Additional Context
Any relevant information or examples.
```

## Getting Help

- **Questions:** Use [GitHub Discussions](https://github.com/siloneedsleep/nimbora/discussions)
- **Issues:** Check existing [Issues](https://github.com/siloneedsleep/nimbora/issues)
- **Contact:** Reach out to maintainers

## Recognition

We appreciate all contributions! Contributors will be:
- Mentioned in CHANGELOG.md
- Added to the contributors list
- Credited in relevant documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Nimbora better! 🙏
