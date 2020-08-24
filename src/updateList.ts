import { cacheClear } from "./util";

/**
 * This function doesn't update lists on its own, but updates the timestamp which triggers an update for each loot drop on that sheet.
 * As far as I can tell this is the only way to trigger an update on demand. Google sheets is dumb.
 * @customfunction
 */
export default function updateList() {
    cacheClear();
    const titleCell = SpreadsheetApp.getActiveSheet().getRange(2, 6);
    const title: string = "Last updated: " + new Date().toISOString().split(".")[0];
    titleCell.setValue(title.replace("T", " at ") + " GMT");
}
