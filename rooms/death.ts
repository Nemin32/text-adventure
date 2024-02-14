import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATH } from "../roomnames.ts";
import { GM } from "../util.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["back"],
      action: () => move(GM.prevName)
    }
  ]
})

const description = (flags: flags) => `GAME OVER. You've achieved ${GM.deaths.size} of ${DEATH.__LENGTH} possible deaths.\nHowever, the powers that be have another fate for you. They call for you to go *back* and avoid your death.`

export const death = new Room({}, actions, description)