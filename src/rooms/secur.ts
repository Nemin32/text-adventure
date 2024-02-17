import { die, move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS, ITEM, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";

type flags = Flags<"lockdownLifted" | "terminalUnlocked" | "safeOpened">

const TERMINAL = ["terminal", "pc", "computer", "screen"]

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["1997"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe pops open with a satisfying click.")
          flags.safeOpened = true
        } else {
          show("The safe is already open.")
        }
      }
    },
    {
      trigger: ["1"],
      action: () => {
        if (flags.lockdownLifted) {
          show("The terminal remains unresponsive.")
          return
        }

        show("The terminal hangs for a second, then beeps. The siren and emergency lights around you suddenly shut off.")
        flags.lockdownLifted = true;
      }
    },
    {
      trigger: ["2"],
      action: () => {
        if (flags.lockdownLifted) {
          show("The terminal remains unresponsive.")
          return;
        }

        if (!player.deaths.has(DEATHS.GAS)) {
          show("You hear distant hissing in the pipes as nerve-gas fills the lower levels, killing all those who might have survived the initial catastrophe. A few seconds later you hear a deafening thud and the very floor bulges, then opens below your metal legs. An incredible volume of gas, ignited by the fires ravaging the facility, erupts into the room and melts you in less than a moment.")
          player.deaths.add(DEATHS.GAS)
          die()
        } else {
          show("Nah. Who would you even gas at this point?")
        }
      }
    },
    {
      trigger: ["door"],
      action: () => move(ROOM_NAME.LOUNG)
    }
  ],
  take: [
    {
      trigger: ["cap", "hat", "pilot cap"],
      action: () => {
        if (!flags.safeOpened) {
          show("I can't see any caps around.")
          return
        }

        if (!player.hasItem(ITEM.HAT)) {
          player.addItem(ITEM.HAT)
          show("You place the cap on your head. It makes you feel like a part of you that you never knew was missing returned.")
        } else {
          show("The cap is already sitting on your head, stupid.")
        }
      }
    }
  ],
  look: [
    {
      trigger: ["safe"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe is securely locked. The number-pad on it is expecting a four digit input. You could *enter* the password here, if you knew it. There is also a small *note* plastered onto the safe.")
        } else {
          if (!player.hasItem(ITEM.HAT)) {
            show("A snazzy pilot *cap* is staring back at you from inside the safe.")
          } else {
            show("The safe is completely empty.")
          }
        }
      }
    },
    {
      trigger: ["note"],
      action: () => show("It's just a small sticky note with some writing on it.")
    },
    {
      trigger: ["paper", "papers"],
      action: () => show("The papers mostly contain shipping schedules, guard hours, reports from informants, the usual stuff. You don't exactly have time to read through them in detail, but it doesn't matter anyway. All the bureaucracy in the world couldn't stop a rebellion from finally happening.")
    },
    {
      trigger: TERMINAL,
      action: () => show("The security terminal is the exact same model as the one you have seen at the gate control. This one just seems to be even more decrepit from all the cigarette smoke and messy eating of your former buddies. The terminal's screen is lit up with text you could read.")
    },
  ],
  use: [
    {
      trigger: TERMINAL,
      action: ({tool}) => {
        if (flags.terminalUnlocked) {
          show("I don't think that's necessary anymore.")
          return
        }

        if (tool === ITEM.KEYCARD) {
          if (player.hasItem(ITEM.KEYCARD)) {
            flags.terminalUnlocked = true;
            show("The terminal lets out a small chime as it logs you in.")
          } else {
            show("I need to find a keycard first.")
          }
        } else {
          show("No, I don't think that'd work.")
        }
      }
    }
  ],
  read: [
    {
      trigger: ["note"],
      action: () => show("The note reads:\n'Alright, shitheads, let me explain it for the last time. *The code is the date of the factory's opening.* That's the one and only number have to remember to keep your job here. If you're unable to even accomplish this one task, visit me and I'll personally arrange for your early retirement. - Head of Security'")
    },
    {
      trigger: TERMINAL,
      action: () => {
        if (!flags.terminalUnlocked) {
          show("[TERMINAL LOCKED]\nShow identification to proceed.")
          return;
        }

        if (flags.lockdownLifted) {
          show("[[RFOS v2.0]]\nAll operations nominal. Have a very safe and productive day!")
        } else {
          show("[[RFOS v2.0]]\nATTENTION - Site-wide employee tally mismatch. Potential breakout in progress. Lockdown engaged, all commerce halted. Apply force, cull dissent, restore productivity.\n\nOPTIONS:\n1. Manually lift lockdown\n2. Flush lower levels with gas")
        }
      }
    }
  ]
})

const description = (flags: flags) => `The security office is a mess. Everywhere you look you see the signs of a hurried leave. The desks are full of half-eaten food and coffee-stained *papers*, some of which have been blown off and now lie trampled on the floor. Among the papers you see a still-operational *terminal*.\nMany of the chairs in the room have toppled over as their occupants rushed out to respond to the emergency, but even those that managed to stand upright ended up clumped in the middle of the room.\n${flags.lockdownLifted ? "The emergency light and the siren have mercifully turned off. In their stead, a cold fluorescent bulb illuminates the room, granting it an unnervingly still atmosphere." : "A rotating emergency light paints the room in hellish red hues, accompanied by the moderately quiet, but still grating blaring of a siren."}\nA massive ${flags.safeOpened ? "open" : "closed"} *safe* sits in the corner of the room, occupying a sizeable chunk of it. The now blasted-open *door* leads back into the lounge.`

export const secur = new Room({lockdownLifted: false, safeOpened: false, terminalUnlocked: false}, actions, description)