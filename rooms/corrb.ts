import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ROOM_NAME } from "../roomnames.ts";
import { show } from "../util.ts";

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
    }
  ],
  look: [
    {
      trigger: ["plaque", "poster", "posters"],
      action: () => show("Your stomach rumbles as you look at the posters. You'd give your legs for a Meech Munchie right now, hell, even a crappy Scrab Cake would do. Who would've guessed being electrocuted does wonders for one's appetite? You're sure in any other situation, the boss would be delighted at the possible utilizations of this knowledge.")
    },
    {
      trigger: ["boardroom", "door", "inside"],
      action: () => show("You peer inside the door. As expected the situation is no better than outside. The main elevator had collapsed into the pit below. As you crane your neck, you can still faintly see the fire of the wreckage illuminate the hole. The main projector glitches on and off, occasionally illuminating the walls which glisten from the half-dried gore of your former superiors.")
    }
  ]
})

const description = (_: flags) => `You find yourself in yet another dim corridor. The darkness inside is only illuminated by the occasional product *poster* hanging from the walls, some of which still faintly glow, while most had long lost its power. The *door* to the Boardroom hangs open next to you, light occasionally flickering on and off from the inside. To your *right* is the way back to the execution chamber, to your *left* the path loops around to the gate control.`

export const corrb = new Room({}, actions, description)