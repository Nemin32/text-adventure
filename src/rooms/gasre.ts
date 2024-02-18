import { die, move } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS, Directions, ITEM, ROOM_NAME, isItem } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";

type flags = Flags<"gasRedirected">;

const actions: ActionGenerator<flags> = (flags) => ({
  jump: [
    {
      trigger: ["abyss"],
      action: () => {
        if (!player.deaths.has(DEATHS.ABYSS)) {
          player.deaths.add(DEATHS.ABYSS);
          show(
            "You always wondered what's on the bottom of this chamber. Instead of bothering to find an elevator or stairs, you decide to take the easy way down. Your screams echo for seconds before a quiet splat is finally heard. You were never seen again.",
          );
          die();
        } else {
          show("As alluring as the abyss is, you don't feel like meeting it up close.");
        }
      },
    },
    {
      trigger: ["tank", "tanks"],
      action: () => show("The tanks are sealed. Why'd you wanna jump into them anyways? Weirdo."),
    },
  ],
  talk: [
    {
      trigger: ["abyss"],
      action: () => show("The abyss talks back. Sadly, you don't speak each others tongues."),
    },
  ],
  look: [
    {
      trigger: ["abyss"],
      action: () =>
        show(
          "Nobody is quite sure how deep this hole goes. You've heard of legends about hairless, round creatures who hunt in packs and eat the unwary few who are forced to venture into the depths, but you've always considered this a stupid urban legend. Fleeches are far more terrifying anyways.",
        ),
    },
    {
      trigger: ["tank", "tanks"],
      action: () =>
        show(
          "Each of these tanks contains an unfathomable amount of gas. Something has to feed the furnaces, but still, one reevaluates their size in the universe next to not just one, but dozens of such monsters. You take a look at the closest one. The painted logo on it had mostly chipped away, but you can still make out most of the slogan. 'GutCo. Your Fart Is Our Art.' You give a quiet thanks for your still functioning mask.",
        ),
    },
    {
      trigger: ["sign"],
      action: () =>
        show(
          "The sign is mounted on the wall using two screws. Instead of bothering with paint, the text was simply stamped into the sheet of metal, making it a lot harder to read, but also more durable, you suppose. Above the text you spot a small Mudokon skull and crossbones. Sweet.",
        ),
    },
    {
      trigger: ["valve"],
      action: () =>
        show(
          `The valve is operated by turning a hexagonal bolt. There is a small *plaque* above the bolt with some text on it. The valve is currently set to ${
            flags.gasRedirected ? "right" : "left"
          }.`,
        ),
    },
    {
      trigger: ["corridor"],
      action: () => show("As far as you know a corridor is a type of path."),
    },
    {
      trigger: ["door"],
      action: () => show("It's, y'know, a door. Connects two separate rooms."),
    },
  ],
  read: [
    {
      trigger: ["sign"],
      action: () => show("The sign reads:\n'STORAGE\nNo Mudokons Beyond This Point!'"),
    },
    {
      trigger: ["valve", "plaque"],
      action: () => show("The plaque reads:\n<- PERFUME MANUFACTURING\n-> EMERGENCY GENERATOR"),
    },
    {
      trigger: ["tank", "tanks"],
      action: () =>
        show(
          "The label on the tanks read 'Rated for 1.2 PSI maximum. Storing gas at higher pressure is the end user's own liability.'",
        ),
    },
  ],
  use: [
    {
      trigger: ["valve"],
      action: ({ tool }) => {
        if (flags.gasRedirected) {
          show("The valve is already switched over.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.WRENCH:
            flags.gasRedirected = true;
            show("You switch over the valve.");
            break;

          case ITEM.KEYCARD:
            show("You hold the keycard against the valve. Nothing happens.");
            break;

          case ITEM.KEY:
            show("It's a bolt, not a lock.");
            break;

          case ITEM.BREW:
            show("While the hole of the bottle fits over the bolt, obviously it can't grip it.");
            break;

          case ITEM.BOSS:
            show("You'd rather not even try.");
            break;

          case ITEM.GUN:
            show("You try placing the finger-guard over the bolt, but it's too big.");
            break;

          case ITEM.HAT:
            show("The hat is too soft an valuable to use here.");
        }
      },
    },
  ],
});

const description = (_: flags) =>
  `You step onto a rickety catwalk, hanging above a dark *abyss*. On both sides you see gigantic oval *tanks*, whose bases disappear into the blackness below. With each careful step of your mechanical harness, the catwalk whines and sways precariously. You're almost certain if you were only a little bit heavier, the screws holding you would loosen and you'd plummet to your death. Thankfully the room seems unharmed otherwise. You're not really sure how the fires haven't reached here yet and shudder to think what would have happened if they did.\nThere is also a massive pipe above the catwalk, which runs parallel with it, before suddenly splitting in two and disappearing among the tanks. There seems to be some sort of *valve* at the junction.\nBehind you is the open passageway to the *corridor*, while the catwalk takes a sharp turn to the left, ending in a *door* with a *sign* next to it.`;

export const gasre = new Room({ gasRedirected: false }, actions, description, {
  corridor: Directions.Backward,
  passageway: Directions.Backward,
  door: Directions.Left,
  storage: Directions.Left,
});
