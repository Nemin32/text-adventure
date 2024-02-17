import { rooms } from "./roomlist.ts"
import { Directions, ROOM_NAME, gameMap } from "./roomnames.ts"
import { GM } from "./gm.ts"
import { Room } from "./room.ts"

const getRoom = (name: ROOM_NAME): [ROOM_NAME, Room<string>] => {
  const room = rooms.get(name);

  if (room) {
    return [name, room];
  }

  // biome-ignore lint/style/noNonNullAssertion: The spawn always exists.
  return  [ROOM_NAME.SPAWN, rooms.get(ROOM_NAME.SPAWN)!]
}

function getDir(input: string) {
  const inputToDir = [
    {inputs: ["forwards", "forward", "f", "north", "n"], dir: Directions.Forward},
    {inputs: ["left", "l", "west", "w"], dir: Directions.Left},
    {inputs: ["backwards", "backward", "l", "south", "s"], dir: Directions.Backward},
    {inputs: ["right", "r", "east", "e"], dir: Directions.Right},
  ]

  return inputToDir.find(({inputs}) => inputs.includes(input))?.dir
}

function moveDir(dir: Directions) {
  const dirMap = new Map<Directions, [number, number]>([
    [Directions.Forward, [0, -1]],
    [Directions.Backward, [0, 1]],
    [Directions.Left, [-1, 0]],
    [Directions.Right, [1, 0]],
  ])

  // biome-ignore lint/style/noNonNullAssertion: All directions are initialized.
  const  delta = dirMap.get(dir)!
  const newPosition: [number, number] = [
    GM.position[0] + delta[0], 
    GM.position[1] + delta[1]
  ]

  const newRoom = gameMap.at(newPosition[0])?.at(newPosition[1])

  if (newRoom) {
    GM.prevPos.push([...GM.position])
    GM.position = newPosition

    const [name, room] = getRoom(newRoom)
    GM.currentRoom = room
    GM.currentName = name

    return true;
  }

  return false;
}