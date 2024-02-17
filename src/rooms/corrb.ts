import { move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { Directions, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<never>;

const POSTER = ["plaque", "poster", "posters"];

const actions: ActionGenerator<flags> = (_) => ({
  look: [
    {
      trigger: POSTER,
      action: () =>
        show(
          "Your stomach rumbles as you look at the posters. You'd give your legs for a Meech Munchie right now, hell, even a crappy Scrab Cake would do. Who would've guessed being electrocuted does wonders for one's appetite? You're sure in any other situation, the boss would be delighted at the possible utilizations of this knowledge.",
        ),
    },
    {
      trigger: ["boardroom", "door", "inside"],
      action: () =>
        show(
          "You peer inside the door. The situation is even more grim than you expected. The main elevator you stood on just the day before had collapsed into the pit below and, as you crane your neck, you can still faintly see the fire of the wreckage light up the hole below. The main projector glitches on and off, occasionally illuminating the walls which glisten from the half-dried gore of your former superiors.",
        ),
    },
  ],
  read: [
    {
      trigger: POSTER,
      action: () =>
        show(
          "Your eyes glaze over as you attempt to read the smaller novel's worth of small print at the bottom of the posters. You also wonder what the word 'ultra-carcinogenic' means.",
        ),
    },
  ],

  enter: [
    {
      trigger: ["boardroom", "door"],
      action: () =>
        show("Seeing the carnage inside, that doesn't seem like a wise idea. The smell is nauseating even from here."),
    },
  ],
});

const description = (_: flags) =>
  "You find yourself in yet another dim corridor. The darkness inside is only illuminated by the occasional product *poster* mounted on the wall, some of which still faintly glow, the having long had lost their power. The *door* to the Boardroom hangs open next to you, light occasionally flickering on and off from the inside.\nTo The corridor continues to your left, while to your right is the way back to the execution chamber.";

export const corrb = new Room({}, actions, description, {
  corridor: Directions.Left,
  chamber: Directions.Right,
  "execution chamber": Directions.Right,
});
