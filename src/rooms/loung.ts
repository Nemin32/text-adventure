import { move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";

type flags = Flags<"securityOpen" | "keyNoticed">

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: ["darts", "darts board"],
      action: () => show("A few darts are sticking out from the board, mostly around the edges. None of the guys were very good shots. It's easier when you don't have to care about things like 'ballistics' and 'having a good aim'.`")
    },
    {
      trigger: ["poker table", "table", "poker", "desk"],
      action: () => {
        flags.keyNoticed = true;
        show(`You see four hands on the table, one of them being a five of aces... Yeah, there is reason why you eventually stopped playing for Moolah. Upper management was incredibly unhappy with the amount of break-time fatalities.${!player.hasItem(ITEM.KEY) ? " Huh there also seems to be a small *key* on the desk." : ""}`)
      }
    },
    {
      trigger: ["poster"],
      action: () => show("The poster depicts a Slig proudly wearing the TreadMaster X500 Ultralight Kevlar-Composite Mechanical Harness, or - as you and the boys always called it - the good stuff. You always dreamt of one day being able to afford this model, but with the recent events the prospect seems more distant than ever.\nPreviously one of your weirdo colleagues hung a pinup of an Elum in a very questionable pose in its place, but that was before you promptly and collectively decided to rip it off and ridicule the guy to preserve a bit of your team's dignity.")
    },
    {
      trigger: ["TV", "tv", "television"],
      action: () => show("The TV is repeating a pre-recorded message from The Magog on the March. 'Everything will be fine, just go back to work, let smarter people deal with it, invest into Sligcoin and AyEye, yadda, yadda.'\nPoor sod, I wonder if he believes even a single word of the drivel they make him say.")
    },

    {
      trigger: ["door"],
      action: () => flags.securityOpen 
        ? show("The door leads into the security booth. With the padlock shot off, nothing stops you from just waltzing inside. Odd bless firearms.") 
        : show("The door leads into the security booth. It's been haphazardly locked with a padlock, but as you inspect the mechanism, it seems very shoddy and weak. You're certain it wouldn't take much to blast it right off.")
    }
  ],
  use: [
    {
      trigger: ["door", "booth", "security booth"],
      action: ({tool}) => {
        if (flags.securityOpen) {
          show("There is nothing else you need to do with the door.")
          return;
        }

        if (tool === ITEM.GUN) {
          if (player.hasItem(ITEM.GUN)) {
            show("It feels a bit wrong to waste your one bullet on something inanimate, but then this is an emergency. You take aim and blast the padlock into smithereens, unlocking the door in style.")
            flags.securityOpen = true;
          } else {
            show("Yeah, good idea, if only I had a gun to actually try it.")
          }
        } else {
          show("No, I don't think that'd work.")
        }
      }
    }
  ],
  take: [
    {
      trigger: ["key", "small key"],
      action: () => {
        if (!flags.keyNoticed) {
          show("Huh, what key?")
          return;
        }

        if (!player.hasItem(ITEM.KEY)) {
          player.addItem(ITEM.KEY)
          show("You pocket the small key.")
        } else {
          show("You've already put the key away.")
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["path", "boiler room"],
      action: () => move(ROOM_NAME.BOILA)
    },
    {
      trigger: ["door", "security", "security booth"],
      action: () => {
        if (flags.securityOpen) {
          move(ROOM_NAME.SECUR)
        } else {
          show("You try to enter the booth, but it is locked.")
        }
      }
    },
  ]
})

const description = (flags: flags) => `You step into the employee lounge area. You've never quite understood why they placed the lounge past the boilers, but then you've suspected for years that RuptureFarms wasn't exactly built up to code... If there even was a code to begin with.\nStill, even with all the chaos and destruction outside, you feel a bit of fuzziness in your cold, dead heart as you gaze over the place that gave you so many good memories. A poker *table* dominates the middle of the room, situated between a handful of three-legged chairs. The floor is covered by a cheap, faded carpet, its pattern long unrecognizable under all the stains and years of abuse. A *darts board* hangs on the far end of the wall, next to it a faded *poster*. Below them, on a small cubby, you hear an old *TV* babbling to itself. As you make your way through the room, your legs keep kicking away empty bottles of SoulStorm Brew. You smile. It's a mess for sure, but it is your mess.\nA *door* to the left leads into a nearby security booth, while the *path* back into the boiler room is behind you.`

export const loung = new Room({securityOpen: false, keyNoticed: false}, actions, description)