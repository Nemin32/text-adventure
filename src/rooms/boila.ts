import { die } from "../movement.ts";
import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS, Directions, ITEM } from "../constants.ts";
import { show } from "../display.ts";
import { player } from "../player.ts";
import { gasre } from "./gasre.ts";

type flags = Flags<"boilerFixed" | "generatorFixed">;

const actions: ActionGenerator<flags> = (flags) => ({
  look: [
    {
      trigger: ["furnace", "boiler"],
      action: () =>
        show(
          flags.boilerFixed
            ? "It was a wild gambit, but thankfully it paid off. The wreckage of the furnace is still unbearably hot, but at least it won't melt your face off."
            : "The furnace's mouth belches fire and flame without pause. Seeing how the nearby pipes have turned red from the heat, you'd rather not step any closer.",
        ),
    },
    {
      trigger: ["keyhole"],
      action: () => show("A hole for a small key."),
    },
    {
      trigger: ["generator"],
      action: () =>
        show(
          "An old gas-powered generator. A dirty and loose hose connects it to a nearby pipe headed towards the reservoirs. You notice a small *keyhole* on it.",
        ),
    },
    {
      trigger: ["door"],
      action: () => show("The door is completely covered in soot, giving it a dull black finish."),
    },
    {
      trigger: ["path"],
      action: () =>
        show(
          "The path is covered in snaking pipes, dust bunnies, and the occasional piece of coal. You're not certain it was ever cleaned.",
        ),
    },
  ],
  use: [
    {
      trigger: ["furnace", "boiler"],
      action: ({ tool }) => {
        if (flags.boilerFixed) {
          show("The boiler is already 'fixed'.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.WRENCH:
            show(
              "You attempt to muck around, but the wrench gets too hot in your hands. Beyond slightly burning yourself, you've accomplished nothing.",
            );
            break;

          case ITEM.KEYCARD:
            show("No way, the card is made out of plastic. It'd melt in less than a second.");
            break;

          case ITEM.BREW:
            flags.boilerFixed = true;
            player.items.delete(ITEM.BREW);
            show(
              "You chuck the bottle of Brew into the furnace, which promptly explodes from the sudden heat. The furnace collapses into itself in a spectacular display of flame and destruction, coating the floor in hot coals and soot. You smile, it's nothing your legs can't handle.",
            );
            break;

          case ITEM.GUN:
            show("The furnace is solid metal. Your bullet wouldn't do anything.");
            break;

          default:
            show("No, I don't think that could work.");
        }
      },
    },
    {
      trigger: ["generator", "keyhole"],
      action: ({ tool }) => {
        if (flags.generatorFixed) {
          show("The generator is happily running. There is nothing else you need to do.");
          return;
        }

        switch (tool as ITEM) {
          case ITEM.WRENCH:
            show("You give the generator a gentle whack. Nothing happens.");
            break;

          case ITEM.KEYCARD:
            show("There is no slot on the generator, except for a small hole for a key.");
            break;

          case ITEM.KEY:
            if (!gasre.getFlag("gasRedirected")) {
              show("You turn the key... and nothing happens. Hm. The generator seems to be out of gas.");
              return;
            }

            flags.generatorFixed = true;
            show(
              "With a grating sputter and a wild jerk the generator springs into life, delivering vital electricity to the grid.",
            );
            break;

          case ITEM.BREW:
            show(
              "The generator runs on gas. While drinking Brew does create gas eventually, you don't think it'd be a viable substitute.",
            );
            break;

          case ITEM.BOSS:
            show("No, I don't think that would work.");
            break;

          case ITEM.GUN:
            show("No, it's a miracle that the generator is functional. Shooting it would do no good.");
            break;

          case ITEM.HAT:
            show("You'd rather not dirty your cap with this generator.");
        }
      },
    },
  ],
  open: [
    {
      trigger: ["generator"],
      action: () =>
        show(
          "You open the small door on the side of the generator. An incomprehensible mess of wires, pipes, and electronics stares back at you. You blink slowly, then close the door.",
        ),
    },
    {
      trigger: ["furnace", "boiler"],
      action: () =>
        show(
          flags.boilerFixed
            ? "I don't think the furnace can get any more 'open' than that."
            : "The furnace's mouth being open is the very issue you're trying to solve.",
        ),
    },
  ],
  jump: [
    {
      trigger: ["generator"],
      action: () => show("The generator is too tall for you to jump onto."),
    },
    {
      trigger: ["furnace", "boiler"],
      action: () =>
        show(
          flags.boilerFixed
            ? "You trample the smouldering wreckage to let out some steam. That felt good."
            : "It is a common misconception that Sligs are fireproof. You're very much not. In fact you hate fire.",
        ),
    },
  ],
});

const description = (flags: flags) =>
  `The boiler room has seen better days. As you navigate the wild web of pipes, you take a peek at the gauges. As expected, they're all in the red. In one corner of the room a dirty *generator* ${
    flags.generatorFixed ? "belches disgusting smoke, as it converts the gas into electricity." : "sits unused."
  }\nA *door* in front of you leads back into the corridor. Another *path* to the left leads deeper inside, towards the employee lounge. ${
    flags.boilerFixed
      ? "Next to it, you see the still-smoking wreckage of what was once a *furnace*."
      : "However, passage is currently blocked by the flames of an overheated *furnace* next to it."
  }`;

const canMove = (flags: flags) => ({
  [Directions.Left]: () => {
    if (flags.boilerFixed) {
      return true;
    }

    if (!player.deaths.has(DEATHS.BOILER)) {
      player.deaths.add(DEATHS.BOILER);
      show(
        "You try your best to run past the furnace between two blasts of flame, but at the worst possible moment your leg gets caught in a pipe and you fall face first into the furnace. It takes mere seconds for you to burn to a crisp.",
      );
      die();
      return false;
    }

    show("You kinda don't feel like burning to death today.");
    return false;
  },
});

export const boila = new Room(
  { boilerFixed: false, generatorFixed: false },
  actions,
  description,
  {
    door: Directions.Forward,
    path: Directions.Left,
  },
  canMove,
);
