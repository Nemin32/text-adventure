import { Flags, Room, ActionGenerator } from "../room.ts";
import { die, moveDir } from "../movement.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { DEATHS, Directions, ITEM } from "../constants.ts";
import { gctrl } from "./gctrl.ts";

const MOLLUCK = ["boss", "molluck", "body"];

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

  enter: [
    {
      trigger: MOLLUCK,
      action: () => show("Not in a million years, pal."),
    },
    {
      trigger: ["meatsaw", "saw"],
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
    {
      trigger: ["body"],
      action: () =>
        show("You briefly contemplate poking him, but you quickly decide against it. You're not that suicidal."),
    },
    {
      trigger: ["door"],
      action: () => {
        if (flags.doorOpen) {
          show("You try pressing against the open door and fall through into the next room.");
          moveDir(Directions.Forward);
        } else {
          show("You press against the door with all your might, but this fight is won by the door.");
        }
      },
    },
  ],

  use: [
    {
      trigger: MOLLUCK,
      action: ({ tool }) => {
        if (player.hasItem(ITEM.BOSS)) {
          show("He's on your shoulders, you can't really do anything with him like that.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.GUN:
          case ITEM.WRENCH:
            show("It would be so satisfying, but no, you hold your hand. You need him alive. At least for now.");
            break;

          case ITEM.KEYCARD:
            show("It's a plastic card. How would that help wake your boss up?");
            break;

          case ITEM.KEY:
            show("You're pretty sure Glukkons lack keyholes.");
            break;

          case ITEM.BREW:
            show("The boss never drank the stuff. You wonder why though, it's delicious.");
            break;

          case ITEM.HAT:
            show("No, the hat is yours. Not even he can take it.");
            break;

          case ITEM.BOSS:
            show("No, I don't think that'd work.");
        }
      },
    },

    {
      trigger: ["meatsaw", "saw"],
      action: ({ tool }) => {
        switch (tool as ITEM) {
          case ITEM.KEY:
          case ITEM.KEYCARD:
          case ITEM.WRENCH:
            show(
              "You still might need it. Plus, you're sure the boss would deduct any material harm from your next salary.",
            );
            break;

          case ITEM.BREW:
            show("Sure, let's throw what's basically a bomb into a blender. That cannot go wrong!");
            break;

          case ITEM.BOSS:
            show("Morbid and cruel, twisted and violent... You love the idea, but no. You need him alive.");
            break;

          case ITEM.GUN:
            show("Sacrilege! You'd never hurt a poor innocent firearm like that.");
            break;

          case ITEM.HAT:
            show(
              "You feel nauseous for even entertaining the thought. You promise the hat never to even think something like this again.",
            );
            break;
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
    {
      trigger: ["door"],
      action: () =>
        show(
          "You try to talk some good sense into the door. But sadly it's moved by a different mechanism than words.",
        ),
    },
    {
      trigger: ["meatsaw"],
      action: () => show("You ask what sorts of meat it saw over all these years. There is no answer."),
    },
    {
      trigger: ["button"],
      action: () => show("The pressure of your sound-waves isn't quite enough to trigger the button."),
    },
  ],

  open: [
    {
      trigger: ["door"],
      action: () =>
        flags.doorOpen
          ? show("You wave your arms in front of the open door. Thank Odd, there's nobody else around.")
          : show("You try to pry open the door, but it doesn't budge the slightest."),
    },
    {
      trigger: ["meatsaw", "saw"],
      action: () => show("Don't you remember that's how you got into this situation in the first place?"),
    },
    {
      trigger: MOLLUCK,
      action: () => show("Ew, no."),
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
  } On the wall in front of you, there is a *button* and next to it ${flags.doorOpen ? "an open" : "a closed"} *door*.`;
};

const canMove = (flags: flags) => ({
  [Directions.Forward]: () => {
    if (flags.doorOpen) return true;

    show("You walk face first into the the door. These things aren't motion controlled, y'know?");
    return false;
  },
});

export const spawn = new Room({ doorOpen: false }, actions, desc, { door: Directions.Forward }, canMove);
