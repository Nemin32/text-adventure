import { ActionGenerator, Flags, Room } from "../room.ts";
import { show } from "../util.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: ["darts", "darts board"],
      action: () => show("A few darts are sticking out from the board, mostly around the edges. None of the guys were very good shots. It's easier when you don't have to care about things like 'ballistics' and 'having a good aim'.`")
    },
    {
      trigger: ["poker table", "table", "poker"],
      action: () => show("You see four hands on the table, one of them being a five of aces... Yeah, there is reason why you eventually stopped playing for Moolah. Upper management was incredibly unhappy with the amount of break-time fatalities.")
    },
    {
      trigger: ["poster"],
      action: () => show("")
    },
    {
      trigger: ["TV", "tv", "television"],
      action: () => show("")
    },

    {
      trigger: ["door"],
      action: () => show("")
    }
  ]
})

const description = (flags: flags) => `You step into the employee lounge area. You've never quite understood why they placed the lounge past the boilers, but then you've suspected for years that RuptureFarms wasn't exactly built up to code... If there even was a code to begin with.\nStill, even with all the chaos and destruction outside, you feel a bit of fuzziness in your cold, dead heart as you gaze over the place that gave you so many good memories. A poker *table* dominates the middle of the room, situated between a handful of three-legged chairs. The floor is covered by a cheap, faded carpet, its pattern long unrecognizable under all the stains and years of abuse. A *darts board* hangs on the far end of the wall, next to it a faded *poster*. Below them, on a small cubby, you see an old *TV*. As you make your way through the room, your legs keep kicking away empty bottles of SoulStorm Brew. You smile. It's a mess for sure, but it was always your mess.\nA *door* to the left leads into a nearby security booth, while the *path* back into the boiler room is behind you.`

export const loung = new Room({}, actions, description)