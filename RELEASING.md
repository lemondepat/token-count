# Releasing Token Count

Checklist for [Obsidian community plugins](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin).

## Before each release

1. Update `version` in `manifest.json` (semver `x.y.z`).
2. Add the new version to `versions.json` (maps plugin version → minimum Obsidian version).
3. Run `npm run build` and confirm `main.js` is generated.
4. Commit and push to `main` on GitHub.

## Create a GitHub release

Pushing a git tag matching `manifest.json` `version` triggers [`.github/workflows/release.yml`](.github/workflows/release.yml), which builds the plugin and publishes `main.js` + `manifest.json` automatically.

```bash
npm run build   # optional local check
git tag -a 1.0.0 -m "1.0.0"
git push origin 1.0.0
```

To re-run after the workflow exists, delete and re-push the tag:

```bash
git tag -d 1.0.0 && git push origin :refs/tags/1.0.0
git tag -a 1.0.0 -m "1.0.0" && git push origin 1.0.0
```

Manual upload (if needed): https://github.com/lemondepat/token-count/releases/new — attach `main.js` and `manifest.json`.

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
