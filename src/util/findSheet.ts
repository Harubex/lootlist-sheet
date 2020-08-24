/**
 * Find a sheet within the active spreadsheet that has the specified name, if any. Throws an error if one isn't found.
 * @param name The name of the sheet to find.
 */
export default function findSheet(name: string) {
    const activeSpread = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = activeSpread.getSheetByName(name);
    if (!sheet) {
        throw new Error(`No sheet was found with the name "${name}"`);
    }
    return sheet;
}
