export default function updateList() {
    const titleCell = SpreadsheetApp.getActiveSheet().getRange(2, 6);
    const title: string = "Last updated: " + new Date().toISOString().split(".")[0];
    titleCell.setValue(title.replace("T", " at ") + " GMT");
}
