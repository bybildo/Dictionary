import { maxWordLength } from '@utils/constants.js';

export function getFontSize(textLength, minWordSize = 3, maxWordSize = 5.5, wordLength = maxWordLength) {
    return Math.max(minWordSize, maxWordSize - ((textLength - 1) / (wordLength - 1)) * (maxWordSize - minWordSize)) + 'vh';
}
