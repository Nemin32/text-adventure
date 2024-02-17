import { Directions, ITEM } from "../constants.ts";
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
  use: [
    {
      trigger: GAS,
      action: ({ tool }) => {
        if (gctrl.getFlag("gasRoomOpen")) {
          show("The door is already unlocked. Go ahead and go in.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.WRENCH:
            show("You smash your wrench against the door. Beyond hurting your hand, this accomplished nothing.");
            break;

          case ITEM.KEYCARD:
            show("The door has no card reader attached. It's probably unlocked from somewhere else.");
            break;

          case ITEM.KEY:
            show("The door has no visible lock.");
            break;

          case ITEM.BREW:
            show("The Brew's explosion wouldn't be powerful enough to open this door.");
            break;

          case ITEM.GUN:
            show("Your one bullet wouldn't even dent the door.");
            break;

          case ITEM.HAT:
          case ITEM.BOSS:
            show("No, I don't think that'd work.");
            break;
        }
      },
    },
  ],
  talk: [
    {
      trigger: GAS,
      action: () =>
        gctrl.getFlag("gasRoomOpen")
          ? show("You don't see much point in talking to an open door.")
          : show(
              "You attempt to verbally identify yourself to the door. Yet the prideful contraption remains locked even for the private escort of Molluck the Glukkon himself.",
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
