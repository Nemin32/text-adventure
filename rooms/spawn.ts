import { Flags, Room, ActionGenerator } from "../room.ts";
import { move } from "../adjacencies.ts";
import { show } from "../util.ts";
import { ROOM_NAME } from "../roomnames.ts";

const MOLLUCK = ["the boss", "boss", "molluck", "body"]

type flags = Flags<"doorOpen">

const actions: ActionGenerator<flags> = (flags) => ({
  take: [],

  look: [
    {
      trigger: MOLLUCK,
      action: () => show("The boss is out cold. A black wound darts across his face, seeping blood. He smells of burnt flesh and clothing, yet to your greatest surprise, he's somehow still breathing.")
    },
    {
      trigger: ["button", "the button"],
      action: () => flags.doorOpen ? show("Yep, the button is still there.") : show("The button on the wall still seems to be functional. Maybe you should try [press]-ing it.")
    },
  ],

  press: [
    {
      trigger: ["button", "the button"],
      action: () => {
        show("The button lets out a quiet click as you press it.")

        if (!flags.doorOpen) {
          flags.doorOpen = true;
          show("The door next to the button hisses open.")
        } else {
          show("Nothing happens.")
        }
      }
    },
  ],

  talk: [
    {
      trigger: MOLLUCK,
      action: () => { show("You try asking him what to do, but he's barely conscious. For better or worse, you're on your own.") }
    }
  ],

  enter: [
    {
      trigger: ["door"],
      action: () => {
        if (flags.doorOpen) {
          show("You step through the door.")
          move(ROOM_NAME.CORRA)
        } else {
          show("The door is locked.")
        }
      }
    }
  ],

  use: [
    {
      trigger: ["self", "me"],
      action: ({ recv }) => {
        if (MOLLUCK.includes(recv)) {
          show("Ew, gross!")
        } else {
          show("Huh?")
        }
      }
    }
  ]
})

const desc = (flags: flags): string => {
  return `The chamber looks surprisingly fine despite just being ravaged by lightning. You see a slightly charred *body* on the floor. Behind him you see a *button* and ${flags.doorOpen ? "an open" : "a closed"} *door*.`
}

const room = new Room({doorOpen: false}, actions, desc)
export {room as spawn}