import getAlts from "./getAlts";
import getItemValue from "./getItemValue";
import getLootLists from "./getLootLists";
import getAttendance from "./getAttendance";
import getLootDrops from "./getLootDrops";
import { log } from "./util";

/**
 * The point value modifier for the various bonuses.
 */
const bonuses = {
    TT: 5,
    TM: 10
};

const totalRaidItems = 517;

/**
 * Uses the provided item name to generate the list of prios for this item and displays them.
 * @param {string} itemName The item to display prios for.
 * @param {number} _ Placeholder param used to help with auto-updating.
 * @customfunction
 */
export default function displayItemPrios(itemName: string, _: number = 0) {
    const attendance = getAttendance();
    const lootLists = getLootLists();
    const altList = getAlts();
    const lootDrops = getLootDrops();

    const prios = [];
    for (let i = 0; i < lootLists.length; i++) {
        const item = lootLists[i].items.find((item) => item.name === itemName);
        if (item) {
            const playerName = lootLists[i].name;
            let playerAttendance = attendance.find((att) => att.name === playerName);

            let isAlt = false;
            if (!playerAttendance) {
                for (const main in altList) {
                    if (altList[main].indexOf(playerName) >= 0) {
                        isAlt = true;
                        log(playerName + " is an alt of " + main);
                        playerAttendance = attendance.find((att) => att.name === main);
                        log("Found new attendance of " + playerAttendance.raidPct);
                        break;
                    }
                }
            }

            // No sense adding a player that doesnt show up.
            if (playerAttendance) {
                let previousDrops = 0;
                for (let i = 0; i < playerAttendance.dates.length; i++) {
                    const raidLoot = lootDrops[playerAttendance.dates[i]];
                    if (raidLoot) {
                        raidLoot.forEach((item) => {
                            if (itemName === item) {
                                previousDrops++;
                            }
                        });
                    }
                }
                let totalValue = getItemValue(item.value, 0, playerAttendance.raidPct, bonuses[item.special] || 0, previousDrops, item.special === "OS");
                if (isAlt) {
                    totalValue = Math.round((totalValue / 2) * 10) / 10;
                }
                prios.push({
                    name: playerName,
                    value: totalValue
                });
            }
        }
    }

    //#region Debugging
    // No one has this item marked, is the spelling correct?
    /* Commented out for performance - uncomment to do validation.
    let badItem = true;
    if (prios.length === 0) {
      const activeSpread = SpreadsheetApp.getActiveSpreadsheet();
      const itemSheet = activeSpread.getSheetByName("Raid Items"); 
      const itemNames = itemSheet.getRange(3, 1, totalRaidItems).getValues();
      for (let r = 0; r < itemNames.length; r++) {
        if (itemName === itemNames[r][0]) {
          badItem = false;
          break;
        }
      }
      // We didn't break - so the name isn't on our lists. Return an error.
      if (badItem) {
        return [["ERROR: " + itemName + " doesn't exist"]];
      }
    }
    */
    //#endregion

    prios.sort((a, b) => b.value - a.value);
    return [[itemName, ""].concat(prios.map((prio) => `${prio.name}: ${prio.value}`)).concat([""])];
}
