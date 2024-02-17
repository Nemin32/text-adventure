import { Directions } from "../constants.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { show } from "../display.ts";
import { gctrl } from "./gctrl.ts";

type flags = Flags<never>;

const GAS = ["gas reservoirs", "gas", "reservoirs"];

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: GAS,
      action: () =>
        show(
          "An awfully thick mechanical security door. You'd have more luck punching through the wall its mounted on, than somehow breaking in through the door by force.",
        ),
    },
    {
      trigger: ["maint", "maintenance"],
      action: () => show("A simple wooden door. A bit dirty from soot, but at the very least it's not locked."),
    },
  ],
  open: [
    {
      trigger: GAS,
      action: () =>
        gctrl.getFlag("gasRoomOpen")
          ? show("The door is already open.")
          : show("You almost sprain your shoulder trying to pull the door open, but it just won't budge."),
    },
  ],
  talk: [
    {
      trigger: GAS,
      action: () =>
        gctrl.getFlag("gasRoomOpen")
          ? show("You don't see much point in talking to an open door.")
          : show(
              "You attempt to identify yourself to the door. Yet the prideful contraption won't open itself even for the private escort of Molluck the Glukkon himself.",
            ),
    },
  ],
});

const description = (flags: flags) =>
  "You've finally reached the end of the corridor. Nestled inside a wild tangle of pipes, you find two door leading deeper into the facility. The one in front of you is labeled *gas reservoirs* and the one behind you *maintenance*.";

const canMove = (flags: flags) => ({
  [Directions.Forward]: () => {
    if (gctrl.getFlag("gasRoomOpen")) {
      return true;
    }

    show("You yank the handle, but the door doesn't yield. You can't see any keyholes or visible locks.");
    return false;
  },
});

export const corrc = new Room(
  {},
  actions,
  description,
  {
    "gas reservoirs": Directions.Forward,
    gas: Directions.Forward,
    maintenance: Directions.Backward,
  },
  canMove,
);
