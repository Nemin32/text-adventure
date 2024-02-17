import { move, setRoom } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ELEVA_POS, FINIS_POS, ITEM, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";

type flags = Flags<never>;

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["ship", "blimp", "plane"],
      action: () => {
        if (player.hasItem(ITEM.BOSS)) {
          setRoom(FINIS_POS);
        } else {
          show(
            "You cannot leave the boss behind. As much of a moldy old swindler he is, he is still your boss. And more importantly, who else would pay for your legs and ammo?",
          );
        }
      },
    },
    {
      trigger: ["elevator", "lift"],
      action: () => setRoom(ELEVA_POS),
    },
  ],
  look: [
    {
      trigger: ["blimp", "ship"],
      action: () =>
        show(
          "The boss's own ride, always kept prepared to depart in case of emergency. Surprising foresight from the guy who would chop up his own workforce, but then who are you to question it? The ship's reflectors glare back at you in anticipation. It calls out to you to command it.",
        ),
    },
    {
      trigger: ["storm", "clouds"],
      action: () =>
        show(
          "The Farms had seen some strong weather before, but nothing like this. If you were superstitious, you'd think this isn't a normal storm, rather the work of magic, but not even that Abe guy could have conjured all this up alone. Did he not work alone?",
        ),
    },
    {
      trigger: ["lift", "elevator"],
      action: () => show("Going back might mean certain death, but still, the option is there."),
    },
  ],
});

const description = (flags: flags) =>
  `You've finally reached the landing strip. Plumes of smoke gather into dark clouds above you, yet this time not from the smokestacks, rather from the many gaping wounds of the building. Beyond the quiet crackling of distant fires, it is eerily quiet. The silence is only broken by the occasional flash of lightning, followed by roaring thunderclaps. It's been hours since that Abe guy messed everything up and yet the *storm* rages on. Only without any rain to extinguish the flames.\nA solitary *blimp* sits on the runway.\nYou feel a strange sense of finality being here. If you leave now, there will never be another opportunity to deal with any unfinished business here. There still seems to be enough power in the *elevator* leading back into the crumbling facility, if you wanted to go back.`;

export const strip = new Room({}, actions, description);
