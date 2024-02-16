import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { show } from "./util.ts"
import { GM } from "./gm.ts"
import { Room } from "./room.ts"

const adjacency: Set<string> = new Set()

const makeAdjacent = (name1: ROOM_NAME, name2: ROOM_NAME) => {
  adjacency.add(`${ROOM_NAME[name1]}${ROOM_NAME[name2]}`)
  adjacency.add(`${ROOM_NAME[name2]}${ROOM_NAME[name1]}`)
}

const isAdjacent = (other: ROOM_NAME) => adjacency.has(`${ROOM_NAME[GM.currentName]}${ROOM_NAME[other]}`)
const getRoom = (name: ROOM_NAME): [ROOM_NAME, Room<string>] => {
  const room = rooms.get(name);

  if (room) {
    return [name, room];
  }

  // biome-ignore lint/style/noNonNullAssertion: The spawn always exists.
return  [ROOM_NAME.SPAWN, rooms.get(ROOM_NAME.SPAWN)!]
}

export const move = (name: ROOM_NAME) => {
  if (!isAdjacent(name)) {
    show(`There is no path from ${ROOM_NAME[GM.currentName]} to ${ROOM_NAME[name]}.`)
    return;
  }

  const [newName, room] = getRoom(name)

  GM.prevRoom.push(GM.currentName)
  GM.currentName = newName;
  GM.currentRoom = room

  GM.currentRoom.printDescription()
}

export const goBack = () => {
  if (GM.prevRoom.length === 0) {
    show("No previous room to go back to.")
    return;
  }

  const lastRoom = GM.prevRoom[GM.prevRoom.length-1]

  if (lastRoom === ROOM_NAME.FINIS) {
    show("Buddy, the factory is gone. Where'd you even go back to?")
    return;
  }

  GM.prevRoom = GM.prevRoom.slice(0, -1)

  const [name, room] = getRoom(lastRoom)
  GM.currentName = name
  GM.currentRoom = room

  GM.currentRoom.printDescription()
}

export const die = () => {
  GM.prevRoom.push(GM.currentName);

  const [name, room] = getRoom(ROOM_NAME.DEATH)
  GM.currentName = name
  GM.currentRoom = room

  GM.currentRoom.printDescription()
}

makeAdjacent(ROOM_NAME.SPAWN, ROOM_NAME.CORRA)

makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.CORRB)
makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.GCTRL)
makeAdjacent(ROOM_NAME.CORRA, ROOM_NAME.ELEVA)

makeAdjacent(ROOM_NAME.ELEVA, ROOM_NAME.STRIP)

makeAdjacent(ROOM_NAME.CORRB, ROOM_NAME.GCTRL)
makeAdjacent(ROOM_NAME.CORRB, ROOM_NAME.GASRE)
makeAdjacent(ROOM_NAME.CORRB, ROOM_NAME.BOILA)

makeAdjacent(ROOM_NAME.GASRE, ROOM_NAME.STORG)

makeAdjacent(ROOM_NAME.BOILA, ROOM_NAME.LOUNG)
makeAdjacent(ROOM_NAME.LOUNG, ROOM_NAME.SECUR)

makeAdjacent(ROOM_NAME.STRIP, ROOM_NAME.FINIS)