/**
 * The loot list for a single character.
 */
declare interface LootList {
    /**
     * The character name this list is for.
     */
    name: string;
    /**
     * The items on this list.
     */
    items: Item[];
}

/**
 * An item assigned to someone's loot sheet.
 */
declare interface Item {
    /**
     * The name of the item.
     */
    name: string;
    /**
     * The value the item was assigned at.
     */
    value: number;
    /**
     * A special modifier for the item, if one was assigned.
     */
    special?: "OS" | "TT" | "TM";
}

/**
 * An object that maps a main character to all of it's alts.
 */
declare type AltMap = {
    [name: string]: string[]
};
