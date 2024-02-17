import { move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS } from "../constants.ts";
import { player } from "../player.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({})

const description = (flags: flags) => {
  const gotAllDeaths = player.deaths.size >= DEATHS.__LENGTH
  const allDeathsMsg = "You've died in all possible ways.\nThe powers that be are very irritated by your bumbling, but also a little impressed as well by how naturally you seem to get yourself killed. How did you manage to survive until now? Regardless, you still have a place in their plans, so *go back* and change your fate."
  const normalDeathsMsg = `You've achieved ${player.deaths.size} of ${DEATHS.__LENGTH} possible deaths.\nHowever, the powers that be have other plans for you. They call for you to *go back* and change your fate.`

  return `[GAME OVER]\n${gotAllDeaths ? allDeathsMsg : normalDeathsMsg}`
}

export const death = new Room({}, actions, description)