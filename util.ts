import { Room } from "./room.ts"
import { ROOM_NAME } from "./roomnames.ts"

export function show(str: string) {
  console.log(str)
}

class GameManager {
  currentName: ROOM_NAME = ROOM_NAME.SPAWN
  currentRoom: Room<string> | null = null
  items: string[] = []
}

const GM = new GameManager()

export {GM}
export type {GameManager}