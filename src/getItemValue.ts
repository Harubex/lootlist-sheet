import { log } from "./util";

/**
 * Calculates the value of an item based on the provided input values.
 * @param {number} playerValue The value a player has given to this item.
 * @param {number} raidClears The number of full clears a player has attended of the raid the item drops in.
 * @param {number} attendancePct The percentage of a player's raid attendance.
 * @param {number} bonus Any bonus amount to add to the final value.
 * @param {number} previousDrops The number of this item a player has seen without obtaining it.
 * @param {boolean} offspec Whether or not this item is considered for offspec.
 * @return The calculated value, rounded down to the nearest tens place.
 * @customfunction
 */
export default function getItemValue(playerValue: number, raidClears: number, attendancePct: number, bonus: number = 0, previousDrops: number = 0, offspec: boolean = false) {
    if (typeof offspec !== "boolean") {
        log(`${offspec} is not a boolean value.`);
        throw new Error("Invalid input: offspec must be true or false if provided.");
    }
    if (typeof previousDrops !== "number" || Math.round(previousDrops) !== previousDrops) {
        log(`${previousDrops} is not an integer value.`);
        throw new Error("Invalid input: previousDrops must be an integer if provided.");
    }
    let calculatedValue = (playerValue + (raidClears * 0.4) + (attendancePct * 10)) / (1 + Number(offspec));
    return Math.round((bonus + previousDrops + calculatedValue) * 10) / 10;
}
