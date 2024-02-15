import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { GM, show } from "./util.ts"

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

  show("You wake up with a splitting headache and your entire body in pain. You attempt to stand up, but your legs have seized. Half-blind you fumble with the harness until you find the small reset button.\nThe machine spends a few seconds just whirring helplessly while belching poisonous fumes. You're about to whack it in frustration when, without warning, it suddenly jerks back to life, allowing you to carefully stand back up.\nYou have vague memories about what happened, but still, it'd probably be the best to first *look around*. Unless of course you'd rather just call out to your momma for *help*.")
})