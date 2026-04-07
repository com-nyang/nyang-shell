# Changelog

Summarize commits since the last version bump into a clean changelog entry.

## Steps

1. Run:
   ```bash
   git log --oneline $(git log --all --grep="bump version" --format="%H" | head -1)..HEAD
   ```
   If no previous version bump exists, use all commits.
2. Group commits by type (feat, fix, chore, docs, refactor).
3. Print a formatted changelog block like:

```
## v<N> — <date>

### Added
- ...

### Fixed
- ...

### Changed
- ...
```

4. Ask the user if they want this appended to a CHANGELOG.md file.
