# Publish

Guide the user through submitting the extension to extensions.gnome.org.

## Steps

1. Check that `nyang-walk@com-nyang.zip` exists. If not, create it:
   ```bash
   zip nyang-walk@com-nyang.zip metadata.json extension.js stylesheet.css
   ```
2. Verify `metadata.json`:
   - `uuid` is `nyang-walk@com-nyang`
   - `url` is the real GitHub URL (not example.com)
   - `shell-version` array is up to date
3. Print a submission checklist:
   - [ ] zip file ready: `nyang-walk@com-nyang.zip`
   - [ ] metadata.json fields valid
   - [ ] latest changes pushed to GitHub
   - [ ] GNOME account ready at extensions.gnome.org
4. Print the upload URL: https://extensions.gnome.org/upload/
