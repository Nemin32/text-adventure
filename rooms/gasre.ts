import { move } from "../adjacencies.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { ITEM, ROOM_NAME } from "../roomnames.ts";
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
  look: [
    {
      trigger: ["tank", "tanks"],
      action: () => show("You take a look at the closest tank. The painted logo on it had mostly chipped away, but you can still make out most of the slogan. 'GutCo. Your Fart Is Our Art.' You give a quiet thanks for your still functioning mask.")
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

const description = (_: flags) => `You step onto a rickety catwalk, hanging above a dark *abyss*. On both sides you see gigantic oval *tanks*, whose bases disappear into the blackness below. With each careful step of your mechanical harness, the catwalk whines and sways precariously. You can only hope it won't decide to let go of its screws with you on it. Thankfully the room seems unharmed otherwise. You're not really sure how the fires haven't reached here yet and shudder to think what would have happened if they did.\nThere is also a massive pipe above the catwalk, which runs parallel with it, before suddenly splitting in two and disappearing among the tanks. There seems to be some sort of *valve* at the junction.\nBehind you is the open passageway to the *corridor*, while in front of you, at the far end of the catwalk, is another *door* with a *sign* next to it.`

export const gasre = new Room({gasRedirected: false}, actions, description)