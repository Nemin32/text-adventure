import { Room } from "./room.ts";
import { DEATH, ITEM, ROOM_NAME } from "./roomnames.ts";

class GameManager {
  deaths: Set<DEATH> = new Set();
  prevRoom: ROOM_NAME[] = [];
  currentName: ROOM_NAME = ROOM_NAME.SPAWN;
  currentRoom: Room<string> | null = null;
  items: Set<ITEM> = new Set();

  brewUsed = false;

  stepCounter = 0;

  hasItem(item: ITEM): boolean {
    return this.items.has(item);
  }

  addItem(item: ITEM) {
    this.items.add(item);
  }
}

const GM = new GameManager()

export {GM}
export type {GameManager}