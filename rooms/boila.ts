import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATH, ITEM, ROOM_NAME } from "../roomnames.ts";
import { GM, show } from "../util.ts";

type flags = Flags<"boilerFixed" | "generatorFixed">

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["door"],
      action: () => move(ROOM_NAME.CORRB)
    },
    {
      trigger: ["path"],
      action: () => {
        if (flags.boilerFixed) {
          move(ROOM_NAME.MAINT)
        } else {
          if (!GM.deaths.has(DEATH.BOILER)) {
            GM.deaths.add(DEATH.BOILER)
            show("You try your best to run past the furnace between two blasts of flame, but at the worst possible moment your leg gets caught in a pipe and you fall face first into the furnace. It takes mere seconds for you to burn to a crisp.")
            move(ROOM_NAME.DEATH)
          } else {
            show("You kinda don't feel like burning to death today.")
          }
        }
      }
    }
  ],
  use: [
    {
      trigger: ["furnace", "boiler"],
      action: ({tool}) => {
        if (flags.boilerFixed) {
          show("The boiler is already 'fixed'.")
          return
        }

        if (tool === ITEM.BREW) {
          if (GM.hasItem(ITEM.BREW)) {
            flags.boilerFixed = true;
            GM.brewUsed = true;
            show("You chuck the bottle of Brew into the furnace, which promptly explodes from the sudden heat. The furnace collapses into itself in a spectacular display of flame and destruction, coating the floor in hot coals and soot. You smile, it's nothing your legs can't handle.")
          } else {
            show("The sight makes you thirsty for sure, but you don't have any Brew on you.")
          }
        } else {
          show("No, I don't think that would work.")
        }
      }
    }
  ]
})

const description = (flags: flags) => `The boiler room has seen better days. As you navigate the wild web of pipes, you take a peek at the gauges. As expected, they're all in the red. In one corner of the room a dirty generator ${flags.generatorFixed ? "belches disgusting smoke, as it converts the gas into electricity." : "sits unused."}\nA *door* leads back into the corridor. Another *path* leads deeper inside, towards the employee lounge. ${flags.boilerFixed ? "Next to it, you see the still-smoking wreckage of what was once a *furnace*." : "However, passage is currently blocked by the flames of an overheated *furnace* next to it."}`

export const boila = new Room({boilerFixed: false, generatorFixed: false}, actions, description)