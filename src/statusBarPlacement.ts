/** Class on our status bar item so we never treat it as the word-count anchor. */
export const TOKEN_COUNT_STATUS_BAR_CLASS = "token-count-status-bar-item";

/**
 * Obsidian core word-count uses a `.status-bar-item` with two plain
 * `.status-bar-item-segment` children (words + characters).
 */
export function findWordCountStatusBarItem(): HTMLElement | null {
	const items = document.querySelectorAll<HTMLElement>(
		".status-bar .status-bar-item",
	);

	for (const item of Array.from(items)) {
		if (item.classList.contains(TOKEN_COUNT_STATUS_BAR_CLASS)) continue;

		const segments = Array.from(
			item.querySelectorAll(":scope > .status-bar-item-segment"),
		);
		if (segments.length < 2) continue;

		const plainSegments = segments.filter(
			(s) =>
				s.classList.length === 1 &&
				s.classList.contains("status-bar-item-segment"),
		);
		if (plainSegments.length < 2) continue;

		return item;
	}

	return null;
}

export function isPlacedAfterWordCount(item: HTMLElement): boolean {
	const anchor = findWordCountStatusBarItem();
	return anchor !== null && anchor.nextElementSibling === item;
}

/**
 * Move `item` to sit immediately after the core word/character count block.
 * No-op if already in the correct position (avoids mutation feedback loops).
 */
export function placeStatusBarAfterWordCount(item: HTMLElement): boolean {
	const anchor = findWordCountStatusBarItem();
	if (!anchor || anchor === item) return false;

	item.addClass(TOKEN_COUNT_STATUS_BAR_CLASS);

	if (anchor.nextElementSibling === item) {
		return true;
	}

	anchor.insertAdjacentElement("afterend", item);
	return true;
}

/**
 * Word count may render after plugins load. Retry a few times only —
 * do not use a MutationObserver (moving the item triggers childList mutations
 * and can freeze Obsidian).
 */
export function scheduleStatusBarPlacement(item: HTMLElement): () => void {
	const tryPlace = () => placeStatusBarAfterWordCount(item);

	tryPlace();

	const timeoutIds = [50, 200, 500, 1500, 3000].map((ms) =>
		window.setTimeout(tryPlace, ms),
	);

	return () => {
		for (const id of timeoutIds) window.clearTimeout(id);
	};
}
