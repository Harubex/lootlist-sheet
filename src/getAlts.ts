import { findSheet, cacheKeys, cached } from "./util";

/**
 * Generates a map of mains to their alts.
 */
export default function getAlts(): AltMap {
    return cached<AltMap>(cacheKeys.alts, () => {
        // Get the alts sheet.
        const altSheet = findSheet("Alt/Main Associations");
        // Pull all the data out of it.
        const allValues = altSheet.getDataRange().getValues();
        return allValues.reduce((characterList, chars) => {
            // Shifts the 1st name off the array to serve as the key for the rest.
            if (chars.length > 1) {
                characterList[chars.shift()] = chars;
            }
            return characterList;
        }, {});
    });
}
