import { Room } from "./room.ts";
import { DEATHS, ITEM, ROOM_NAME } from "./constants.ts";
import { SPAWN_POS } from "./constants.ts";

class Player {
  deaths: Set<DEATHS> = new Set();
  items: Set<ITEM> = new Set();

  currentRoom: Room<string> | null = null;
  position: [number, number] = SPAWN_POS;
  prevPos: Array<[number, number]> = [];

  stepCounter = 0;

  hasItem(item: ITEM): boolean {
    return this.items.has(item);
  }

  addItem(item: ITEM) {
    this.items.add(item);
  }

  gainItem(item: ITEM): boolean {
    if (this.hasItem(item)) {
      return false;
    }

    this.addItem(item);
    return true;
  }
}

const player = new Player();

export { player };
export type { Player };
