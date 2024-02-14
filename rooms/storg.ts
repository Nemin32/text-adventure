import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATH, ITEM, ROOM_NAME } from "../roomnames.ts";
import { GM, show } from "../util.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["back", "door"],
      action: () => move(ROOM_NAME.GASRE)
    }
  ],
  look: [
    {
      trigger: ["crate"],
      action: () => show("The crate shakes violently as you approach it. You hear growling, gnashing of teeth, and high pitched whining from inside.")
    },
    {
      trigger: ["locker"],
      action: () => show("A standard-issue gun locker. No sight is more beautiful, except perhaps a fresh pair of legs.")
    },
    {
      trigger: ["toolbox"],
      action: () => show("Someone forgot their toolkit here. Ordinarily this would result in disciplinary action, but... well, there isn't really anyone left to discipline.")
    },
  ],
  open: [
    {
      trigger: ["crate"],
      action: () => show("The crate is too strong for your hands. If you had something long and strong, you could use it as a lever to pry it open.")
    },
    {
      trigger: ["locker"],
      action: () => {
        if (!GM.hasItem(ITEM.GUN)) {
          show("To your dismay the gun only has a single bullet in it. Still, gripping the weapon gives you a certain calmness you haven't felt for a long time.")
          GM.addItem(ITEM.GUN)
        } else {
          show("The locker is empty.")
        }
      }
    },
    {
      trigger: ["toolbox"],
      action: () => {
        if (!GM.hasItem(ITEM.WRENCH)) {
          show("You found a wrench inside the toolbox.")
          GM.addItem(ITEM.WRENCH)
        } else {
          show("None of the other tools seem helpful in your situation.")
        }
      }
    },
  ],

  use: [
    {
      trigger: ["crate"],
      action: ({ tool }) => {
        if (tool === ITEM.WRENCH) {
          if (!GM.deaths.has(DEATH.FUZZLE)) {
            show("You pry open the crate using the wrench. A moment later furry balls blast out from the darkness inside, latching onto your body, tearing skin and muscle. You scream in agony and try to swat them off, but it's no use. You are slowly overwhelmed, until little more than bones and a pair of legs remain.")
            GM.deaths.add(DEATH.FUZZLE)
            move(ROOM_NAME.DEATH)
          } else {
            show("Upon second thoughts, it's best not to disturb whatever's inside there.")
          }
        } else {
          show("No, I don't think that'd work.")
        }
      }
    }
  ]
})

const description = (flags: flags) => `As far as you can see *boxes* are stacked haphazardly on each other. The little that still sticks out from the crates at the bottom seem positively ancient and you're not entirely certain how the whole place hadn't collapsed into itself already. The darkness of the room is somewhat illuminated by fires at the opposite end. It's probably for the best if you get what you need and get out, before it reaches here.\nAmidst the mess three boxes in particularly get your attention: A wooden *crate*, a metal *locker* and a *toolbox*. Everything else seems too securely locked or hard to get to, so you'd rather not bother with them. As the path forward is blocked by flames, the only way is through the *door* back to the gas reservoirs.`

export const storg = new Room({}, actions, description)