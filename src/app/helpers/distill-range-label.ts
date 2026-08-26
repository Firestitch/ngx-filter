import { upperFirst } from 'lodash-es';


/**
 * Every way of dropping one of `words` from the label, one per position any of
 * them appears at. 'Fax to pharmacy to' yields both 'Fax pharmacy to' and
 * 'Fax to pharmacy', so the caller can keep whichever the other end agrees with.
 */
function stems(label: string, words: string[]): string[] {
  const parts = label.trim().split(/\s+/);

  return parts.reduce((acc, part, index) => {
    if (words.includes(part.toLowerCase())) {
      acc.push(parts.filter((_, i) => i !== index).join(' '));
    }

    return acc;
  }, []);
}

/**
 * The name a two ended label pair is really about: 'From Create Date' and
 * 'To Create Date' both name the 'Create Date' filter, and 'Min Price' and
 * 'Max Price' both name 'Price', so the pair can be shown as one thing.
 *
 * Returns null when the two labels don't reduce to the same stem — they name
 * unrelated ends, and the only honest thing to show is both.
 */
export function distillRangeLabel(
  start: string,
  end: string,
  startWords: string[] = ['from'],
  endWords: string[] = ['to'],
): string {
  if (typeof start !== 'string' || typeof end !== 'string') {
    return null;
  }

  const endStems = stems(end, endWords);
  const stem = stems(start, startWords)
    .find((startStem) => {
      return !!startStem
        && endStems.some((endStem) => endStem.toLowerCase() === startStem.toLowerCase());
    });

  // Distilling takes the leading From/Min away, and with it the only capital the
  // label had — 'From billing month' reads as 'billing month' until it's back.
  return stem ? upperFirst(stem) : null;
}
