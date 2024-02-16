import { die, move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATH, ITEM, ROOM_NAME } from "../roomnames.ts";
import { show } from "../util.ts";
import { GM } from "../gm.ts";

type flags = Flags<"gasRedirected">

const actions: ActionGenerator<flags> = (flags) => ({
  enter: [
    {
      trigger: ["passageway", "corridor"],
      action: () => move(ROOM_NAME.CORRB)
    },
    {
      trigger: ["door", "storage"],
      action: () => move(ROOM_NAME.STORG)
    }
  ],
  jump: [
    {
      trigger: ["abyss"],
      action: () => {
        if (!GM.deaths.has(DEATH.ABYSS)) {
          GM.deaths.add(DEATH.ABYSS)
          show("You always wondered what's on the bottom of this chamber. Instead of bothering to find an elevator or stairs, you decide to take the easy way down. Your screams echo for seconds before a quiet splat is finally heard. You were never seen again.")
          die()
        } else {
          show("As alluring as the abyss is, you don't feel like meeting it up close.")
        }
      }
    },
    {
      trigger: ["tank", "tanks"],
      action: () => show("The tanks are sealed. Why'd you wanna jump into them anyways? Weirdo.")
    }
  ],
  talk: [
    {
      trigger: ["abyss"],
      action: () => show("The abyss talks back. Sadly, you don't speak each others tongues.")
    }
  ],
  look: [
    {
      trigger: ["abyss"],
      action: () => show("Nobody is quite sure how deep this hole goes. You've heard of legends about hairless, round creatures who hunt in packs and eat the unwary few who are forced to venture into the depths, but you've always considered this a stupid urban legend. Fleeches are far more terrifying anyways.")
    },
    {
      trigger: ["tank", "tanks"],
      action: () => show("Each of these tanks contains an unfathomable amount of gas. Something has to feed the furnaces, but still, one reevaluates their size in the universe next to not just one, but dozens of such monsters. You take a look at the closest one. The painted logo on it had mostly chipped away, but you can still make out most of the slogan. 'GutCo. Your Fart Is Our Art.' You give a quiet thanks for your still functioning mask.")
    },
    {
      trigger: ["sign"],
      action: () => show("The sign is mounted on the wall using two screws. Instead of bothering with paint, the text was simply stamped into the sheet of metal, making it a lot harder to read, but also more durable, you suppose. Above the text you spot a small Mudokon skull and crossbones. Sweet.")
    },
    {
      trigger: ["valve"],
      action: () => show(`The valve is operated by turning a hexagonal bolt. There is a small *plaque* above the bolt with some text on it. The valve is currently set to ${flags.gasRedirected ? "right" : "left"}.`)
    }
  ],
  read: [
    {
      trigger: ["sign"],
      action: () => show("The sign reads:\n'STORAGE\nNo Mudokons Beyond This Point!'")
    },
    {
      trigger: ["valve", "plaque"],
      action: () => show("The plaque reads:\n<- PERFUME MANUFACTURING\n-> EMERGENCY GENERATOR")
    }
  ],
  use: [
    {
      trigger: ["valve"],
      action: ({tool}) => {
        if (tool === ITEM.WRENCH) {
          if (GM.hasItem(ITEM.WRENCH)) {
            if (!flags.gasRedirected) {
              flags.gasRedirected = true;
              show("You switch over the valve.")
            } else {
              show("The valve is already switched over.")
            }
          } else {
            show("You don't have a wrench.")
          }
        } else {
          show("I don't think that'd work.")
        }
      }
    }
  ]
})

const description = (_: flags) => `You step onto a rickety catwalk, hanging above a dark *abyss*. On both sides you see gigantic oval *tanks*, whose bases disappear into the blackness below. With each careful step of your mechanical harness, the catwalk whines and sways precariously. You're almost certain if you were only a little bit heavier, the screws holding you would loosen and you'd plummet to your death. Thankfully the room seems unharmed otherwise. You're not really sure how the fires haven't reached here yet and shudder to think what would have happened if they did.\nThere is also a massive pipe above the catwalk, which runs parallel with it, before suddenly splitting in two and disappearing among the tanks. There seems to be some sort of *valve* at the junction.\nBehind you is the open passageway to the *corridor*, while in front of you, at the far end of the catwalk, is another *door* with a *sign* next to it.`

export const gasre = new Room({gasRedirected: false}, actions, description)