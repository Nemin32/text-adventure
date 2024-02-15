import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { GM } from "./util.ts"

GM.currentRoom = rooms.get(ROOM_NAME.SPAWN)!

function act(str: string) {
  GM.currentRoom?.doAction(str)
}

window.addEventListener("load", () => {
  const input = document.getElementById("input")! as HTMLInputElement
  const form = document.getElementById("act")! as HTMLFormElement

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(input.value)

    act(input.value.trim())
    input.value = ""
  })
})