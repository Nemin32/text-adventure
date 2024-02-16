import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ROOM_NAME } from "../roomnames.ts";
import { show } from "../util.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (_) => ({
  enter: [
    {
      trigger: ["right", "corridor"],
      action: () => move(ROOM_NAME.CORRA)
    },
    {
      trigger: ["left", "control", "gate control"],
      action: () => move(ROOM_NAME.GCTRL)
    },
    {
      trigger: ["gas reservoirs", "gas", "reservoirs"],
      action: () => {
        if (gctrl.getFlag("gasRoomOpen")) {
          move(ROOM_NAME.GASRE)
        } else {
          show("You yank the handle, but the door doesn't yield. You can't see any keyholes or visible locks.")
        }
      }
    },
    {
      trigger: ["maintenance", "boiler", "maint"],
      action: () => move(ROOM_NAME.BOILA)
    }
  ],
  look: [
    {
      trigger: ["plaque", "poster", "posters"],
      action: () => show("Your stomach rumbles as you look at the posters. You'd give your legs for a Meech Munchie right now, hell, even a crappy Scrab Cake would do. Who would've guessed being electrocuted does wonders for one's appetite? You're sure in any other situation, the boss would be delighted at the possible utilizations of this knowledge.")
    },
    {
      trigger: ["boardroom", "door", "inside"],
      action: () => show("You peer inside the door. The situation is even more grim inside than you expected. The main elevator had collapsed into the pit below. As you crane your neck, you can still faintly see the fire of the wreckage light up the hole. The main projector glitches on and off, occasionally illuminating the walls which glisten from the half-dried gore of your former superiors.")
    }
  ]
})

const description = (_: flags) => "You find yourself in yet another dim corridor. The darkness inside is only illuminated by the occasional product *poster* mounted on the wall, some of which still faintly glow, the having long had lost their power. The *door* to the Boardroom hangs open next to you, light occasionally flickering on and off from the inside.\nTo your *right* is the way back to the execution chamber, to your *left* the path loops around to the gate control. There is also a door labeled *gas reservoirs* and another labeled *maintenance*."

export const corrb = new Room({}, actions, description)