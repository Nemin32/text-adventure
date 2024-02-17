import { Flags, Room, ActionGenerator } from "../room.ts";
import { die, move } from "../movement.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { DEATHS, ITEM, ROOM_NAME } from "../constants.ts";
import { gctrl } from "./gctrl.ts";

const MOLLUCK = ["the boss", "boss", "molluck", "body"];

type flags = Flags<"doorOpen">;

const actions: ActionGenerator<flags> = (flags) => ({
  take: [
    {
      trigger: MOLLUCK,
      action: () => {
        if (!gctrl.getFlag("gateOpen")) {
          show(
            "It doesn't seem like a good idea to try to move him until you've found a way to leave. If he came to any further harm, there's no way you'd get out of here alive.",
          );
        } else {
          if (!player.hasItem(ITEM.BOSS)) {
            show(
              "As carefully as you can, you pick him up and place him on your shoulders. Your pants complain from the extra weight, but they'll have to manage. The trip isn't that long anyway and, thankfully, the boss is less heavy than he looks. His bones seem brittle as glass and his skin is like the toilet paper they had at the guardhouse.\nNo wonder he likes to hide in those huge suits, if he looks this much like a freak.",
            );
            player.addItem(ITEM.BOSS);
          } else {
            show(
              "Thank Odd there is only one of him. And he's already on your shoulders, so what are you waiting for?",
            );
          }
        }
      },
    },
  ],

  look: [
    {
      trigger: MOLLUCK,
      action: () =>
        show(
          "The boss is out cold. A black wound darts across his face, seeping blood. He smells of burnt flesh and clothing, yet to your greatest surprise, he's somehow still breathing.",
        ),
    },
    {
      trigger: ["button", "the button"],
      action: () =>
        flags.doorOpen
          ? show("Yep, the button is still there.")
          : show("The button on the wall still seems to be functional. Maybe you should try [press]-ing it."),
    },
    {
      trigger: ["door"],
      action: () =>
        show(
          "The sliding door has the the company's Laughing Glukkon logo painted on it. I'm not sure there is much to laugh about now though. Not after what that bastard did to us.",
        ),
    },
    {
      trigger: ["meatsaw", "saw"],
      action: () =>
        show(
          "Despite the calamity, the saw spins on unbothered. For some reason the boss insisted on giving it its own power supply. 'For prisoner processing efficiency,' you recall him saying. So much for that.",
        ),
    },
  ],

  press: [
    {
      trigger: ["button"],
      action: () => {
        if (!flags.doorOpen) {
          flags.doorOpen = true;
          show("The button lets out a quiet click as you press it.\nThe door next to the button hisses open.");
        } else {
          show("Nothing happens.");
        }
      },
    },
  ],

  talk: [
    {
      trigger: MOLLUCK,
      action: () => {
        if (!player.hasItem(ITEM.BOSS)) {
          show("You try asking him what to do, but he's out cold. For better or worse, you're on your own.");
        } else {
          show("He grumbles something, most likely a complaint, but you can't understand his words.");
        }
      },
    },
  ],

  enter: [
    {
      trigger: ["door"],
      action: () => {
        if (flags.doorOpen) {
          move(ROOM_NAME.CORRA);
        } else {
          show("You walk face first into the the door. These things aren't motion controlled, y'know?");
        }
      },
    },
  ],

  jump: [
    {
      trigger: ["saw", "meatsaw"],
      action: () => {
        if (!player.deaths.has(DEATHS.MEATSAW)) {
          player.deaths.add(DEATHS.MEATSAW);
          show(
            "Against all sense and better judgement, you jump into the meatsaw. The blades effortlessly mince your meat, you hardly even have time to scream.",
          );
          die();
        } else {
          show("You feel a queer sense of déja vu and decide against the stupid idea.");
        }
      },
    },
  ],
});

const desc = (flags: flags): string => {
  return `The chamber looks surprisingly fine despite having been ravaged by lightning. But then most of the place was made from metal. That's probably the only reason you're alive now.\nThe *meatsaw* in the center of the room is still active, though the prisoner meant to be dropped into it is nowhere to be seen. ${
    player.hasItem(ITEM.BOSS) ? "" : " You see a slightly charred *body* on the floor."
  } On the wall opposite to you, there is a *button* and ${flags.doorOpen ? "an open" : "a closed"} *door*.`;
};

const room = new Room({ doorOpen: false }, actions, desc);
export { room as spawn };
