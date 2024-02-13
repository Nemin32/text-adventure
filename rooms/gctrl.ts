import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ROOM_NAME } from "../roomnames.ts";
import { show } from "../util.ts";

type flags = Flags<"powerRestored" | "gateOpen" | "gasRoomOpen">

const actions: ActionGenerator<flags> = (flags) => ({
  read: [
    {
      trigger: ["terminal", "screen", "code"],
      action: () => show("[[RPTRFRMS CENTRAL SYSTEM]]\n\nWARNING: Extreme power surges detected. Capital is at risk.\nWARNING: Extreme heat detected. Check animals. Profit is at risk.\nWARNING: Main power supply compromised. Continuing operations using backup batteries.\n\nCOMMANDS:\n1. Unlock elevator to the landing strip\n2. Unlock gas storage\n3. Directory\n4. Employee tally")
    },
  ],
  enter: [
    {
      trigger: ["one", "1"],
      action: () => {
        if (!flags.powerRestored) {
          show("The terminal beeps angrily. The words 'INSUFFICIENT POWER.' appear on the screen.")
        } else {
          if (!flags.gateOpen) {
            flags.gateOpen = true;
            show("That did the trick. You should get the boss and get outta here before this burning heap collapses on your neck.")
          } else {
            show("The gate is already open, what are you waiting for? DO EET!")
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
      action: () => show("The terminal beeps before printing 'EMPLOYEES: 00, ESCAPEES: 99, CASUALTIES: 00'. To think that single schmuck could achieve this... You really wish you had a loaded gun and a blue Mudokon in firing distance.")
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

const description = (_: flags) => `You find yourself in front of a *terminal*. Miraculously it somehow still has enough power to work and it is waiting for instructions at the moment. You're not exactly qualified, but at this point nobody could stop you from [enter]-ing some commands, if you wanted. Both to your *left* and your *right*, you see two corridors stretch as far as the eye could see.`

export const gctrl = new Room({powerRestored: false, gateOpen: false, gasRoomOpen: false}, actions, description)