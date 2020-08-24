/**
 * Compiles the loot lists for each character into a useable format.
 * @return Loot lists for each character that's made one.
 * @customfunction
 */
export default function getLootLists(): LootList[] {
  // Get the loot lists sheet.
  const activeSpread = SpreadsheetApp.getActiveSpreadsheet();
  const lootListSheet = activeSpread.getSheetByName("Compiled Loot Lists");

  // Get all the data, use it to determine the number of characters with loot lists.
  const allValues = lootListSheet.getDataRange().getValues();
  const totalCharacters = allValues[0].length / 3;
  // If totalCharacters isn't an integer, the loot lists were compiled correctly.
  if (totalCharacters > Math.round(totalCharacters)) {
    // Note: this error throws if the last column has no items.
    //throw new Error("Malformed loot list sheet - aborting.");
  }

  // Compile all the items each character wants, and return them.
  const characterLists = [];
  for (let i = 0; i < allValues[0].length; i += 3) {
    const lootList = {
      name: allValues[0][i],
      items: []
    };
    for (let j = 1; j < allValues.length; j++) {
      lootList.items.push({
        name: allValues[j][i],
        value: allValues[j][i + 1],
        special: allValues[j][i + 2]
      });
    }
    characterLists.push(lootList);
  }

  return characterLists;
}
