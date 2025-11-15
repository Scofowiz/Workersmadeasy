# Contributing to Workers Made Easy

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Workersmadeasy.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Run tests: `npm test`
6. Build: `npm run build`
7. Commit: `git commit -m 'Add amazing feature'`
8. Push: `git push origin feature/amazing-feature`
9. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Run linter
npm run lint

# Test the CLI locally
node bin/workerease.js --help
```

## Project Structure

```
workersmadeasy/
├── bin/              # CLI entry point
├── src/
│   ├── commands/     # CLI commands (init, dev, deploy, run)
│   ├── templates/    # Project templates
│   ├── utils/        # Utility functions
│   └── index.ts      # Main entry point
├── dist/             # Compiled output
└── package.json
```

## Adding a New Template

1. Edit `src/templates/index.ts`
2. Add your template to the templates object
3. Export it in `getTemplate()` function
4. Test it: `workerease init test --template yourtemplate`

## Adding a New Command

1. Create a new file in `src/commands/`
2. Export an async function for the command
3. Import and register it in `src/index.ts`
4. Test it: `workerease yourcommand`

## Code Style

- Use TypeScript
- Follow existing code style
- Run `npm run lint` before committing
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Test all commands manually
- Ensure the CLI works on different platforms
- Test with all template types
- Verify error handling

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Add examples if adding new features
- Ensure all tests pass
- Follow the code style

## Reporting Issues

- Use the GitHub issue tracker
- Provide clear descriptions
- Include steps to reproduce
- Share your environment details

## Questions?

Open an issue or start a discussion on GitHub.

Thank you for contributing! 🎉
