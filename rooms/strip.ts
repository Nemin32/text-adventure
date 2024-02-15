import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../roomnames.ts";
import { GM, show } from "../util.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["ship", "blimp", "plane"],
      action: () => {
        if (GM.hasItem(ITEM.BOSS)) {
          show("Yay, you win.")
        } else {
          show("Oh no, you don't have Molluck")
        }
      }
    },
    {
      trigger: ["elevator", "lift"],
      action: () => move(ROOM_NAME.ELEVA)
    }
  ]
})

const description = (flags: flags) => `You've finally reached the landing strip. Plumes of smoke gather into dark clouds above you, yet this time not from the smokestacks, rather from the many gaping wounds of the building. Beyond the quiet crackling of distant fires, it is eerily quiet. The silence is only broken by the occasional flash of lightning, followed by roaring thunderclaps. It's been hours since that Abe guy messed everything up and yet the *storm* rages on. Only without any rain to extinguish the flames.\nA solitary *blimp* sits on the runway, the boss's own ride, always kept prepared to depart in case of emergency. Surprising foresight from the guy who would chop up his own workforce, but then who are you to question it?\nYou feel a strange sense of finality being here. If you leave now, there will never be another opportunity to deal with any unfinished business here. There still seems to be enough power in the *elevator* leading back into the crumbling facility, if you wanted to go back.`

export const strip = new Room({}, actions, description)