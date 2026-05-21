# Token Count (Obsidian)

Shows the token count for the **active note** in the status bar, using [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer) with model-specific encodings (default: `gpt-5`).

## Development setup

1. Install dependencies and build:

```bash
npm install
npm run build
```

2. Link or copy this folder into your vault’s plugins directory:

```text
<Vault>/.obsidian/plugins/token-count/
```

Required files: `main.js`, `manifest.json` (optional: `styles.css`).

3. In Obsidian, enable **Token Count** under **Settings → Community plugins**.

For development:

```bash
npm run dev
```

Symlink the project into the plugins folder; saving source files rebuilds `main.js` automatically.

## Settings

**Settings → Token Count**

| Option | Description |
|--------|-------------|
| Model | `gpt-5`, `gpt-4o`, or `gpt-4` |
| Show model in status bar | Append the model name after the token count |

## Notes

- Counts the **full editor content** (including YAML frontmatter). This usually matches what you send to an LLM; add system prompts or wrappers yourself if needed.
- The status bar item is empty when no Markdown view is active.
- The item is placed **right after** Obsidian’s built-in word and character count (requires the core **Word count** plugin).
- `main.js` bundles BPE tables for the three supported models (~3.6 MB).

## License

MIT
# token-count
