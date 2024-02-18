import { ActionGenerator, Flags, Room } from "../room.ts";
import { show } from "../display.ts";
import { Directions } from "../constants.ts";

type flags = Flags<never>;

const actions: ActionGenerator<flags> = (_) => ({
  look: [
    {
      trigger: ["sign"],
      action: () =>
        show(
          "The sign is caked in rust and dirt. A challenge for a Mudokon, perhaps, but it's nothing your experienced eyes couldn't read.",
        ),
    },
    {
      trigger: ["landing strip", "landing", "strip"],
      action: () => show("You see a door at the end of the corridor. A few crates are placed around it."),
    },
  ],
  read: [
    {
      trigger: ["sign"],
      action: () => show("The sign reads:\n^  LANDING STRIP\n<- MAINTENANCE\n-> GATE CONTROL"),
    },
  ],
});

const description = (flags: flags) =>
  "You find yourself on a dull utility corridor. The whole facility is dead silent, except for the slight whirring coming from the door to the execution *chamber* behind you. You see a *sign* on the wall in front of you. Three other paths lead away in each cardinal direction.";

export const corra = new Room({}, actions, description, {
  maintenance: Directions.Left,
  landing: Directions.Forward,
  strip: Directions.Forward,
  "landing strip": Directions.Forward,
  control: Directions.Right,
  gate: Directions.Right,
  "gate control": Directions.Right,
});
