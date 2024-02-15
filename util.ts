import { Room } from "./room.ts"
import { DEATH, ITEM, ROOM_NAME } from "./roomnames.ts"

type Msg = {type: "msg", msg: string} | {type: "divider"}

let msgs: Msg[] = []

window.addEventListener("load", () => {
  const output = document.getElementById("output")!

  setInterval(() => {
    if (msgs.length > 0) {
      //console.log(msgs[0])

      if (msgs[0].type === "divider") {
        output.appendChild(document.createElement("hr"))
      } else {
        const p = document.createElement("p")
        p.innerText = msgs[0].msg
        output.appendChild(p)
      }

      msgs = msgs.slice(1)
    }
  }, 200)

})

export function show(str: string) {
  //console.log(str)
  msgs = [...msgs, ...str.split("\n").map<Msg>(s => ({type: "msg", msg: s})), {type: "divider"}]
}

class GameManager {
  deaths: Set<DEATH> = new Set()
  prevName: ROOM_NAME = ROOM_NAME.SPAWN
  currentName: ROOM_NAME = ROOM_NAME.SPAWN
  currentRoom: Room<string> | null = null
  items: Set<ITEM> = new Set()

  brewUsed = false

  hasItem(item: ITEM): boolean {
    return this.items.has(item)
  }

  addItem(item: ITEM) {
    this.items.add(item)
  }
}

const GM = new GameManager()

export {GM}
export type {GameManager}