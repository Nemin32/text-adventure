import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { GM, show } from "./util.ts"

const adjacency: Map<string, boolean> = new Map()

const makeAdjacent = (name1: ROOM_NAME, name2: ROOM_NAME) => {
  adjacency.set(`${ROOM_NAME[name1]}${ROOM_NAME[name2]}`, true)
  adjacency.set(`${ROOM_NAME[name2]}${ROOM_NAME[name1]}`, true)
}

const isAdjacent = (other: ROOM_NAME) => adjacency.get(`${ROOM_NAME[GM.currentName]}${ROOM_NAME[other]}`) ?? false

export const move = (name: ROOM_NAME) => {
  if (name === ROOM_NAME.DEATH || GM.currentName === ROOM_NAME.DEATH || isAdjacent(name)) {
    const newName = rooms.has(name) ? name : ROOM_NAME.SPAWN;
    const newRoom = rooms.get(newName)!

    if (name !== newName) {
      show(`This is embarrassing. You tried to go to ${ROOM_NAME[name]}, but there is no such room. By the mysterious ways of Odd, you're placed back into the starting room. This was most likely caused by a bug. Please complain to Nemin about this.`)
    }

    GM.prevName = GM.currentName
    GM.currentName = name;
    GM.currentRoom = newRoom

    GM.currentRoom.printDescription()
  }
}

makeAdjacent(ROOM_NAME.SPAWN, ROOM_NAME.CORRA)

makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.CORRB)
makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.GCTRL)
makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.ELEVA)

makeAdjacent(ROOM_NAME.CORRB, ROOM_NAME.GCTRL)
makeAdjacent(ROOM_NAME.CORRB, ROOM_NAME.GASRE)

makeAdjacent(ROOM_NAME.GASRE, ROOM_NAME.STORG)