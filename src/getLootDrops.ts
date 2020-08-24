export default function getLootDrops() {
    const activeSpread = SpreadsheetApp.getActiveSpreadsheet();
    const dropSheet = activeSpread.getSheetByName("Loot Drops");
    const allValues = dropSheet.getDataRange().getValues();
    const drops: { [date: string]: string[] } = {};

    for (let i = 0; i < allValues[0].length; i++) {
        const header = allValues[0][i];
        if (!header) {
            break;
        }
        const raidDrops = [];
        for (let j = 0; j < allValues.length; j++) {
            const item = allValues[j][i];
            if (!item) {
                break;
            }
            raidDrops.push(item);
        }
        drops[header] = raidDrops;
    }
    return drops;
}
