# Release

Bump the version in `metadata.json`, repackage the zip, commit, and push.

## Steps

1. Read `metadata.json` and get the current `"version"` number.
2. Increment it by 1.
3. Write the updated `metadata.json`.
4. Delete any existing `nyang-walk@com-nyang.zip` and repackage:
   ```bash
   zip nyang-walk@com-nyang.zip metadata.json extension.js stylesheet.css
   ```
5. Stage `metadata.json` only (never commit the zip), commit with message:
   `chore: bump version to <N>`
6. Push to origin.
7. Report the new version number to the user.
