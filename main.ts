import { rooms } from "./roomlist.ts"
import { ROOM_NAME } from "./roomnames.ts"
import { show } from "./util.ts"
import { GM } from "./gm.ts"

// biome-ignore lint/style/noNonNullAssertion: We know the spawn room exists.
GM.currentRoom = rooms.get(ROOM_NAME.SPAWN)!

function act(str: string) {
  show(str, true)
  GM.currentRoom?.doAction(str)
  GM.stepCounter++;
}

// Generated using: https://patorjk.com/software/taag
const title = String.raw`
,_____                            __                      ______            _                 ______                         __  _____  _____  _____ 
|  ___|                          / _|                     | ___ \          | |                |  ___|                       /  ||  _  |/ __  \|  _  |
| |__ ___  ___ __ _ _ __   ___  | |_ _ __ ___  _ __ ___   | |_/ /   _ _ __ | |_ _   _ _ __ ___| |_ __ _ _ __ _ __ ___  ___  ˙| || |/' |˙' / /'| |_| |
|  __/ __|/ __/ _˙ | '_ \ / _ \ |  _| '__/ _ \| '_ ˙ _ \  |    / | | | '_ \| __| | | | '__/ _ \  _/ _˙ | '__| '_ ˙ _ \/ __|  | ||  /| |  / /  \____ |
| |__\__ \ (_| (_| | |_) |  __/ | | | | | (_) | | | | | | | |\ \ |_| | |_) | |_| |_| | | |  __/ || (_| | |  | | | | | \__ \ _| |\ |_/ /./ /___.___/ /
\____/___/\___\__,_| .__/ \___| |_| |_|  \___/|_| |_| |_| \_| \_\__,_| .__/ \__|\__,_|_|  \___\_| \__,_|_|  |_| |_| |_|___/ \___/\___/ \_____/\____/ 
                   | |                                               | |                                                                             
                   |_|                                               |_|                                                                             
                   
A TEXT-ADVENTURE GAME, CREATED BY NEMIN (ODDWORDS.HU) @ 2024`.trim()

window.addEventListener("load", () => {
  const input = document.getElementById("input")! as HTMLInputElement
  const output = document.getElementById("output")! as HTMLDivElement
  const form = document.getElementById("act")! as HTMLFormElement

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    act(input.value.trim())
    input.value = ""
  })

  const titleElem = document.createElement("pre")
  titleElem.innerText = title;
  output.appendChild(titleElem)
  output.appendChild(document.createElement("hr"))

  show("You wake up to a splitting headache and your entire body in pain. You attempt to stand up, but your legs have seized. Half-blind you fumble with the harness until you find the small reset button.\nThe machine spends a few seconds just whirring helplessly while belching poisonous fumes, which make you hack and wheeze. You're about to whack it in frustration when, without warning, it suddenly jerks back to life, allowing you to carefully stand back up.\nYou have vague memories about what happened, but still, it'd probably be the best to first *look around*. Unless of course you'd rather just call out to your momma for *help*.")
})