import { findSheet, cacheKeys, cached, log } from "./util";

export default function getLootDrops(): LootDrops {
    return cached(cacheKeys.lootDrops, () => {
        // Get the sheet that records all the past raids' drops.
        const dropSheet = findSheet("Loot Drops");
        const allValues = dropSheet.getDataRange().getValues();
        const drops: LootDrops = {};

        for (let i = 0; i < allValues[0].length; i++) {
            const header = allValues[0][i];
            if (!header) {
                break;
            }
            const raidDrops = [];
            for (let j = 1; j < allValues.length; j++) {
                const item = allValues[j][i];
                if (!item) {
                    break;
                }
                raidDrops.push(item);
            }
            drops[new Date(header).getTime()] = raidDrops;
        }
        return drops;
    });
}
