# Token Count (Obsidian)

Shows the token count for the **active note** in the status bar.

- **OpenAI models** (`gpt-5`, `gpt-4o`, `gpt-4`): [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer)
- **Claude**: Anthropic `claude.json` ranks + [`js-tiktoken`](https://github.com/dqbd/tiktoken) ([reference implementation](https://gist.github.com/Mearman/85080f34fe75194c664b3d185f462f0e))

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
| Model | `gpt-5`, `gpt-4o`, `gpt-4`, or `claude` |
| Show model in status bar | Append the model name after the token count |

## Notes

- Counts the **full editor content** (including YAML frontmatter). This usually matches what you send to an LLM; add system prompts or wrappers yourself if needed.
- Claude counts apply **NFKC normalization** and allow special tokens (`encode(..., "all")`), matching [`@anthropic-ai/tokenizer`](https://www.npmjs.com/package/@anthropic-ai/tokenizer).
- The status bar item is empty when no Markdown view is active.
- The item is placed **right after** Obsidian’s built-in word and character count (requires the core **Word count** plugin).
- `main.js` bundles all encodings (~4+ MB with Claude ranks included).

## License

MIT
