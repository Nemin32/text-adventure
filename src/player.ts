import { Room } from "./room.ts";
import { DEATHS, ITEM, ROOM_NAME } from "./constants.ts";

class Player {
  deaths: Set<DEATHS> = new Set();
  prevRoom: ROOM_NAME[] = [];
  currentName: ROOM_NAME = ROOM_NAME.SPAWN;
  currentRoom: Room<string> | null = null;
  items: Set<ITEM> = new Set();

  position: [number, number] = [0,0]
  prevPos: Array<[number, number]> = []

  brewUsed = false;

  stepCounter = 0;

  hasItem(item: ITEM): boolean {
    return this.items.has(item);
  }

  addItem(item: ITEM) {
    this.items.add(item);
  }
}

const player = new Player()

export {player}
export type {Player}