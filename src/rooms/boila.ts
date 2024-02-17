import { die, move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS, ITEM, ROOM_NAME } from "../roomnames.ts";
import { show } from "../util.ts";
import { GM } from "../gm.ts";
import { gasre } from "./gasre.ts";

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
          move(ROOM_NAME.LOUNG)
        } else {
          if (!GM.deaths.has(DEATHS.BOILER)) {
            GM.deaths.add(DEATHS.BOILER)
            show("You try your best to run past the furnace between two blasts of flame, but at the worst possible moment your leg gets caught in a pipe and you fall face first into the furnace. It takes mere seconds for you to burn to a crisp.")
            die()
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
    },
    {
      trigger: ["generator"],
      action: ({tool}) => {
        if (flags.generatorFixed) {
          show("The generator is happily running. There is nothing else you need to do.")
          return;
        }

        if (tool === ITEM.KEY) {
          if (GM.hasItem(ITEM.KEY)) {
            if (!gasre.getFlag("gasRedirected")) {
              show("You turn the key... and nothing happens. Hm. The generator seems to be out of gas.")
              return;
            }

            flags.generatorFixed = true;
            show("With a grating sputter and a wild jerk the generator springs into life, delivering vital electricity to the grid.")
          } else {
            show("Hmm, you seem to need a key to start this baby.")
          }
        }
      }
    }
  ]
})

const description = (flags: flags) => `The boiler room has seen better days. As you navigate the wild web of pipes, you take a peek at the gauges. As expected, they're all in the red. In one corner of the room a dirty *generator* ${flags.generatorFixed ? "belches disgusting smoke, as it converts the gas into electricity." : "sits unused."}\nA *door* leads back into the corridor. Another *path* leads deeper inside, towards the employee lounge. ${flags.boilerFixed ? "Next to it, you see the still-smoking wreckage of what was once a *furnace*." : "However, passage is currently blocked by the flames of an overheated *furnace* next to it."}`

export const boila = new Room({boilerFixed: false, generatorFixed: false}, actions, description)