import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { GM } from "./util.ts"

const adjacency: Map<string, boolean> = new Map()

const makeAdjacent = (name1: ROOM_NAME, name2: ROOM_NAME) => {
  adjacency.set(`${ROOM_NAME[name1]}${ROOM_NAME[name2]}`, true)
  adjacency.set(`${ROOM_NAME[name2]}${ROOM_NAME[name1]}`, true)
}

const isAdjacent = (other: ROOM_NAME) => adjacency.get(`${ROOM_NAME[GM.currentName]}${ROOM_NAME[other]}`) ?? false

export const move = (name: ROOM_NAME) => {
  if (isAdjacent(name)) {
    GM.currentName = name;

    const newRoom = rooms.get(name)
    if (!newRoom) {
      throw new Error("No such room as " + name)
    }

    GM.currentRoom = newRoom
  }
}

makeAdjacent(ROOM_NAME.SPAWN, ROOM_NAME.CORRA)
makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.CORRB)