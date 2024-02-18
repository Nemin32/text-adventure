import { move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { boila } from "./boila.ts";
import { secur } from "./secur.ts";

type flags = Flags<"gateOpen" | "gasRoomOpen" | "noticedKeycard" | "noticedSomething">;

const TERMINAL = ["terminal", "pc", "computer", "screen"];

const actions: ActionGenerator<flags> = (flags) => ({
  read: [
    {
      trigger: ["terminal", "screen", "code"],
      action: () => {
        const warnings: Array<[boolean, string]> = [
          [
            !boila.getFlag("boilerFixed"),
            "WARNING: Urgent message for Maintenance - Extreme heat detected in BOILA. Check machinery. Profit is at risk.",
          ],
          [
            !secur.getFlag("lockdownLifted"),
            "WARNING: Urgent message for Security - Employee count mismatch. Potential breakout attempt in progress. Lockdown engaged.",
          ],
          [
            !boila.getFlag("generatorFixed"),
            "WARNING: Urgent message for Maintenance - Extreme power surge detected. Main power supply compromised.",
          ],
          [
            true,
            "WARNING: Urgent message for ALL DEPARTMENTS - Multiple structural failures detected. Capital is at risk. FIX IT!!!",
          ],
        ];

        const warnMsg = warnings
          .filter(([cond, _]) => cond)
          .map(([_, msg]) => msg)
          .join("\n");

        const msg = `[[RFOS v2.0]]
${warnMsg}

COMMANDS (enter number to use):
[1] Unlock elevator to the landing strip
[2] Unlock gas reservoirs
[3] Directory
[4] Employee tally`;

        show(msg);
      },
    },
  ],
  use: [
    {
      trigger: TERMINAL,
      action: ({ tool }) => {
        switch (tool as ITEM) {
          case ITEM.GUN:
          case ITEM.WRENCH:
            show("You'd rather not risk blowing up the main terminal.");
            break;

          case ITEM.KEYCARD:
            show("The terminal isn't locked.");
            break;

          case ITEM.KEY:
            show("There is no hole on the terminal.");
            break;

          case ITEM.BREW:
            show("Spilling a flammable liquid on an explosive device. Yeah, great idea.");
            break;

          case ITEM.BOSS:
            show("Even if he wasn't unconscious, he's not a very tech-savvy person.");
            break;

          case ITEM.HAT:
            show("You check yourself out in the reflection of the screen. Dapper!");
        }
      },
    },
    {
      trigger: ["slig", "body", "corpse"],
      action: ({ tool }) => {
        switch (tool as ITEM) {
          case ITEM.WRENCH:
            show(
              "You give the body a whack to see if he'll spring to life but all you hear is a moan. That's when you realize who you've just hit. Now you HAVE to get out of here.",
            ); // Thanks Oddey!
            break;

          case ITEM.KEYCARD:
            show("You show the sucker what you just snatched from his body. He's absolutely out of words.");
            break;

          case ITEM.KEY:
            show("Uhm, Sligs don't have keyholes.");
            break;

          case ITEM.BREW:
            show(
              "Not even the Brew could bring this fella back to life.\nNot that you'd share with him even if it did.",
            );
            break;

          case ITEM.BOSS:
            show(
              "Death and unconsciousness really are quite familiar on a surface level. Sadly you need the boss alive.",
            );
            break;

          case ITEM.GUN:
            show("You're a bit late with capping the guy.");
            break;

          case ITEM.HAT:
            show("You're not gonna dirty your cap with the blood of this guy.");
        }
      },
    },
  ],
  look: [
    {
      trigger: TERMINAL,
      action: () =>
        show(
          "A standard-use VYKKER-TEK terminal, operated with a keyboard with just slightly too big gaps between keys for comfort.\nUsable 80% of 50% of the time.\nOccasionally explodes under heavy load.\n\nAll things considered you'd rather tolerate the boss any day than be on computer duty.",
        ),
    },
    {
      trigger: ["slig", "body", "corpse"],
      action: () => {
        show(
          "You take a closer look at your former compatriot. If not for the many sharp glass fragments sticking out of him and the copious amount of dried blood, he'd look like he's sound asleep. Poor guy probably died before the whole shitstorm began. These terminals are notoriously fickle things.",
        );
        if (!player.hasItem(ITEM.KEYCARD)) {
          show("Huh, he seems to have *something* clutched in his hand.");
          flags.noticedSomething = true;
        }
      },
    },
    {
      trigger: ["something"],
      action: () => {
        if (!flags.noticedSomething) {
          show("You're not sure where to look.");
          return;
        }

        if (player.hasItem(ITEM.KEYCARD)) {
          show("You've already put away the keycard.");
        } else {
          show("Your dead compatriot is holding a security *keycard*. Jackpot.");
          flags.noticedKeycard = true;
        }
      },
    },
    {
      trigger: ["corridor"],
      action: () => show("It's a dark path, but one you'll inevitably need to take."),
    },
  ],
  take: [
    {
      trigger: TERMINAL,
      action: () => show("It's bolted to the desk. Not to mention probably weighs a ton."),
    },
    {
      trigger: ["slig", "body", "corpse"],
      action: () => show("You don't feel like carrying a corpse around tonight."),
    },
    {
      trigger: ["something"],
      action: () => {
        if (!flags.noticedSomething) {
          show("You pocket a handful of air.");
          return;
        }

        if (player.gainItem(ITEM.KEYCARD)) {
          show("A security keycard. Jackpot! You quickly pocket it into your mechanical pants.");
        } else {
          show("You've already got the keycard.");
        }
      },
    },
    {
      trigger: ["keycard"],
      action: () => {
        if (!flags.noticedKeycard) {
          show("You don't see any keycards around.");
          return;
        }

        if (!player.hasItem(ITEM.KEYCARD)) {
          player.addItem(ITEM.KEYCARD);
          show("You pocket the keycard into your mechanical pants.");
        } else {
          show("You've already got the keycard.");
        }
      },
    },
  ],
  enter: [
    {
      trigger: ["command", "commands"],
      action: () =>
        show(
          "This isn't one of those fancy magic machines run by slaves. You have to be more specific about what command you want to enter.",
        ),
    },
    {
      trigger: TERMINAL,
      action: () => show("You've seen a movie about this, but no."),
    },
    {
      trigger: ["one", "1", "unlock gate", "unlock elevator"],
      action: () => {
        if (!boila.getFlag("generatorFixed")) {
          show(
            "The terminal beeps angrily. The words 'INSUFFICIENT POWER.' appear on the screen.\nCrap, better do something about it.",
          );
          return;
        }

        if (!secur.getFlag("lockdownLifted")) {
          show(
            "The terminal prints 'DENIED. LOCKDOWN IN PROGRESS.' onto the screen. No getting out from here until the system thinks things are fine.",
          );
          return;
        }

        if (!flags.gateOpen) {
          flags.gateOpen = true;
          show(
            "That did the trick.\nYou should get the boss and get outta here before this burning heap collapses on your neck.",
          );
        } else {
          show("The gate is already open, what are you waiting for?\nMove already!");
        }
      },
    },
    {
      trigger: ["two", "2", "unlock gas", "unlock gas reservoirs"],
      action: () => {
        if (!flags.gasRoomOpen) {
          flags.gasRoomOpen = true;
          show(
            "The terminal beeps affirmatively. You take another look at the screen. It says 'GASRE REMOTE LOCK OPEN.'",
          );
        } else {
          show("The terminal beeps confused. The storage is already open.");
        }
      },
    },
    {
      trigger: ["three", "3", "directory"],
      action: () => {
        show(`The terminal hangs for a few seconds, then the following chart is printed:

                                STRIP
                                  |
PKGIN - STORG - GASRE   BOARD   ELEVA
                  |       |       |
                CORRC - CORRB - CORRA - GCTRL
                  |               |
SECUR - LOUNG - BOILA           PRISN

BOARD: Boardroom
BOILA: Boiler room
CORRA: Corridor A
CORRB: Corridor B
CORRC: Corridor C
ELEVA: Elevator to landing strip
GASRE: Gas reservoirs
GCTRL: Gate control
LOUNG: Lounge
PKGIN: Packaging Area
PRISN: Execution chamber
SECUR: Security booth
STORG: General storage
STRIP: Landing strip`);
      },
    },
    {
      trigger: ["four", "4", "tally", "employee tally"],
      action: () =>
        show(
          "The terminal beeps before printing 'EMPLOYEES: 00, ESCAPEES: 99, CASUALTIES: 00'. To think that single schmuck could achieve this...\nYou really wish you had a loaded gun and a blue Mudokon in firing distance.",
        ),
    },
  ],
  press: [
    {
      trigger: ["1", "2", "3", "4", "one", "two", "three", "four"],
      action: () =>
        show(
          "You'd rather not bang anything so aggressively into a computer that might explore. Let's just *enter* it gently.",
        ),
    },
  ],
  talk: [
    {
      trigger: ["slig", "body", "corpse"],
      action: () =>
        show(
          "Yeah... You just tried talking to a corpse. Obviously there is no answer. You're so taking a vacation after this crap is over.",
        ),
    },
    {
      trigger: ["terminal", "screen", "computer"],
      action: () =>
        show(
          "The terminal stares back at you with silent incomprehension. Must be so easy for the boss to just bark orders at screens and have things happen.",
        ),
    },
  ],
});

const description = (_: flags) => `You find yourself in a computer nest, right next to the elevator. Chairs lie haphazardly scattered around the room. A few terminals are embedded in the wall, wires running wildly all over the floor. You try some of them, but they're completely busted. A *slig* sits slumped in a chair nearby, his chest is full of sharp glass fragments. The terminal in front of him is belching smoke and you're pretty sure you can hear fire quietly popping from the inside.
Miraculously the master *terminal* at the end of the room somehow still has enough power to work and it is waiting for instructions at the moment. You're not exactly qualified, but at this point nobody could stop you from *enter*-ing some commands, if you wanted. Otherwise, there is nothing else to note in the room.
To your left the *corridor* you came from yawns emptily.`;

export const gctrl = new Room(
  {
    gateOpen: false,
    gasRoomOpen: false,
    noticedKeycard: false,
    noticedSomething: false,
  },
  actions,
  description,
);
