# Releasing Token Count

Checklist for [Obsidian community plugins](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin).

## Before each release

1. Update `version` in `manifest.json` (semver `x.y.z`).
2. Add the new version to `versions.json` (maps plugin version → minimum Obsidian version).
3. Run `npm run build` and confirm `main.js` is generated.
4. Commit and push to `main` on GitHub.

## Create a GitHub release

1. Open https://github.com/lemondepat/token-count/releases/new
2. **Choose a tag**: `1.0.0` (must match `manifest.json` `version`, no `v` prefix).
3. **Release title**: `1.0.0` (any title is fine; Obsidian uses the tag).
4. Paste release notes (see below).
5. **Attach binaries** (required for installation):
   - `main.js`
   - `manifest.json`
6. Publish the release.

## First-time community submission

After the `1.0.0` release exists:

1. Sign in at https://community.obsidian.md
2. Link your GitHub account (must own `lemondepat/token-count`).
3. **Plugins → New plugin** → `https://github.com/lemondepat/token-count`
4. Agree to developer policies and submit.
5. Fix any automated review feedback, then publish.

## Release notes template

### 1.0.0

Initial release.

- Token count in the status bar for the active Markdown note
- Models: GPT-5, GPT-4o, GPT-4, Claude, Gemini
- Placed after built-in word and character count
- Desktop only
