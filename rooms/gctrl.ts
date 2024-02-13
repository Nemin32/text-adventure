import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ROOM_NAME } from "../roomnames.ts";
import { GM, show } from "../util.ts";

type flags = Flags<"powerRestored" | "gateOpen" | "gasRoomOpen" | "noticedKeycard" | "noticedSomething">

const actions: ActionGenerator<flags> = (flags) => ({
  read: [
    {
      trigger: ["terminal", "screen", "code"],
      action: () => show("[[RFOS v2.0]]\n\nWARNING: Urgent message for Caretakers - Extreme heat detected. Check animals. Profit is at risk.\nWARNING: Urgent message for Security - Employee count mismatch. Potential breakout attempt in progress. Apply force.\nWARNING: Urgent message for Maintenance - Extreme power surge detected. Main power supply compromised.\nWARNING: Urgent message for ALL DEPARTMENTS - Multiple structural failures detected. Capital is at risk. FIX IT!!!\n\nCOMMANDS:\n1. Unlock elevator to the landing strip\n2. Unlock gas storage\n3. Directory\n4. Employee tally")
    },
  ],
  look: [
    {
      trigger: ["terminal", "computer", "screen"],
      action: () => show("A standard-use VYKKERTEK terminal, operated with a keyboard with just slightly too big gaps between keys for comfort.\nUsable 80% of 50% of the time.\nOccasionally explodes under heavy load.\n\n\nYou're kind of happy you've been promoted to valet instead of computer duty.")
    },
    {
      trigger: ["slig", "body", "corpse"],
      action: () => {
        show("Poor guy probably died before the whole shitstorm began. These terminals are notoriously fickle things.")
        if (!GM.hasItem("keycard")) {
          show("Huh, he seems to have *something* clutched in his hand.")
          flags.noticedSomething = true
        }
      }
    },
    {
      trigger: ["something"],
      action: () => {
        if (!flags.noticedSomething) {
          show("You're not sure where to look.")
          return
        }

        if (GM.hasItem("keycard")) {
          show("You've already put away the keycard.")
        } else {
          show("Your dead compatriot is holding a security *keycard*. Jackpot.")
          flags.noticedKeycard = true
        }
      }
    }
  ],
  take: [
    {
      trigger: ["keycard"],
      action: () => {
        if (!flags.noticedKeycard) {
          show("You don't see any keycards around.")
          return
        }

        if (!GM.hasItem("keycard") ) {
          GM.addItem("keycard")
          show("You pocket the keycard into your mechanical pants.")
        } else {
          show("You've already got the keycard.")
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["one", "1"],
      action: () => {
        if (!flags.powerRestored) {
          show("The terminal beeps angrily. The words 'INSUFFICIENT POWER.' appear on the screen.\nCrap, better do something about it.")
        } else {
          if (!flags.gateOpen) {
            flags.gateOpen = true;
            show("That did the trick.\nYou should get the boss and get outta here before this burning heap collapses on your neck.")
          } else {
            show("The gate is already open, what are you waiting for?\nDO EET!")
          }
        }
      }
    },
    {
      trigger: ["two", "2"],
      action: () => {
        if (!flags.gasRoomOpen) {
          flags.gasRoomOpen = true;
          show("The terminal beeps affirmatively. You take another look at the screen. It says 'GAS STORAGE UNLOCKED.'")
        } else {
          show("The terminal beeps confused. The storage is already open.")
        }
      }
    },
    {
      trigger: ["three", "3"],
      action: () => {
        show(`The terminal hangs for a few seconds, then the following chart is printed:

                        STRIP
                          |
        STORG - GASPI   ELEVA
                  |       |
             <- CORRB - CORRA - GCTRL ->
                  |       |
SECUR - MAINT - BOILA   PRISN

BOILA: Boiler room
CORRA: Corridor A
CORRB: Corridor B
ELEVA: Elevator to landing strip
GASPI: Gas storage room
GCTRL: Gate control
MAINT: Maintenance room
SECUR: Security booth
PRISN: Execution chamber
STORG: General storage
STRIP: Landing strip`)
      }
    },
    {
      trigger: ["four", "4"],
      action: () => show("The terminal beeps before printing 'EMPLOYEES: 00, ESCAPEES: 99, CASUALTIES: 00'. To think that single schmuck could achieve this...\nYou really wish you had a loaded gun and a blue Mudokon in firing distance.")
    },

    {
      trigger: ["left"],
      action: () => move(ROOM_NAME.CORRA)
    },
    {
      trigger: ["right"],
      action: () => move(ROOM_NAME.CORRB)
    }
  ]

})

const description = (_: flags) => `You find yourself in a computer nest, right next to the elevator. Chairs lie haphazardly scattered around the room. A few terminals are embedded in the wall, wires running wildly all over the floor. You try some of them, but they're completely busted. A *slig* sits slumped in a chair nearby, his chest is full of sharp glass fragments. The terminal in front of him is belching smoke and you're pretty sure you can hear fire quietly popping from the inside.
Miraculously the master *terminal* at the end of the room somehow still has enough power to work and it is waiting for instructions at the moment. You're not exactly qualified, but at this point nobody could stop you from [enter]-ing some commands, if you wanted.
Otherwise, there is nothing else to note in the room. Both to your *left* and your *right*, you see two corridors stretch as far as the eye could see.`

export const gctrl = new Room({powerRestored: false, gateOpen: false, gasRoomOpen: false, noticedKeycard: false, noticedSomething: false}, actions, description)