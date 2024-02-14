import { Room } from "./room.ts"
import { ITEM, ROOM_NAME } from "./roomnames.ts"

/* For the future
let msgs: string[] = []

setInterval(() => {
  if (msgs.length > 0) {
    console.log(msgs[0])
    msgs = msgs.slice(1)
  }
}, 200)
*/

export function show(str: string) {
  console.log(str)
  //msgs = [...msgs, ...str.split("\n")]
}

class GameManager {
  currentName: ROOM_NAME = ROOM_NAME.SPAWN
  currentRoom: Room<string> | null = null
  items: ITEM[] = []

  hasItem(item: ITEM): boolean {
    return this.items.includes(item)
  }

  addItem(item: ITEM) {
    this.items.push(item)
  }
}

const GM = new GameManager()

export {GM}
export type {GameManager}