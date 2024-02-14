import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../roomnames.ts";
import { GM, show } from "../util.ts";

type flags = Flags<"lockdownLifted" | "safeOpened">

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["1997"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe pops open with a satisfying click.")
          flags.safeOpened = true
        } else {
          show("The safe is already open.")
        }
      }
    },
    {
      trigger: ["door"],
      action: () => move(ROOM_NAME.LOUNG)
    }
  ],
  take: [
    {
      trigger: ["cap", "hat", "pilot cap"],
      action: () => {
        if (!flags.safeOpened) {
          show("I can't see any caps around.")
          return
        }

        if (!GM.hasItem(ITEM.HAT)) {
          GM.addItem(ITEM.HAT)
          show("You place the cap on your head. It makes you feel like a part of you that you never knew was missing returned.")
        } else {
          show("The cap is already sitting on your head, stupid.")
        }
      }
    }
  ],
  look: [
    {
      trigger: ["safe"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe is securely locked. The number-pad on it is expecting a four digit input. You could [enter] the password here, if you knew it.")
        } else {
          if (!GM.hasItem(ITEM.HAT)) {
            show("A snazzy pilot *cap* is staring back at you from inside the safe.")
          } else {
            show("The safe is completely empty.")
          }
        }
      }
    }
  ]
})

const description = (flags: flags) => ``

export const room = new Room({lockdownLifted: false, safeOpened: false}, actions, description)