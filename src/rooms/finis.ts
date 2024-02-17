import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATHS, ITEM } from "../constants.ts";
import { player } from "../player.ts";

type flags = Flags<never>;

const actions: ActionGenerator<flags> = (flags) => ({});

const description = (flags: flags) => {
  const gotHat = player.hasItem(ITEM.HAT);
  const allDeaths = player.deaths.size >= DEATHS.__LENGTH;

  const deathOptions: Array<[DEATHS, string]> = [
    [DEATHS.ABYSS, "You answered the call of the abyss."],
    [DEATHS.BOILER, "You could not outrun fire."],
    [DEATHS.BREW, "Abstinence would have been a virtue."],
    [DEATHS.FUZZLE, "Do not heckle dangerous animals."],
    [DEATHS.GAS, "What gas around comes around."],
    [DEATHS.GUN, "You went out with a bang."],
    [DEATHS.MEATSAW, "RuptureFarms's newest product: Slig Chops."],
  ];

  const deaths = deathOptions
    .map(([type, msg]) => `- ${DEATHS[type]}: ${player.deaths.has(type) ? msg : "???"}`)
    .join("\n");

  const SHORTEST_PATH_WITH_CAP = 45; // Took me at least 45 moves to get the "good ending" with the cap.
  const SHORTEST_PATH = SHORTEST_PATH_WITH_CAP - 2; // It takes two moves to unlock the safe and take out the cap.
  const SHORTEST = gotHat ? SHORTEST_PATH_WITH_CAP : SHORTEST_PATH;

  const pathMsg =
    player.stepCounter < SHORTEST
      ? "Impressive. You've managed to beat the developer's shortest path. Please tell me how you did it."
      : player.stepCounter === SHORTEST
        ? "Well done. You didn't bother looking at stuff or immersing yourself in the environment. You just blitzed through the entire game with fearsome efficiency, matching the developer's own final score."
        : `If you're up to the challenge, try finishing the game in ${SHORTEST} actions or less.`;

  return `You don't waste any time dropping the boss onto a nearby couch and then jumping into the pilot seat yourself. It takes the blimp's engine a few attempts to finally kick in, but after a while you slowly feel the machine lift away from the roof and ascend into the sky. As you glance back, you realize you couldn't have taken off at a better moment. The second your craft cleared the runway, the roof began to collapse into itself, the sinkhole promptly swallowing a metric ton of concrete, before vomiting back a mixture of dust and black smoke.
You gulp a little and decide to look away instead. To steel your resolve, you think about all the ways you and the boss will 'pay' back all the misery that Abe guy had caused you. You chuckle a little. Next time it won't be anything as simple as a meatsaw. Yet, as much as you're trying to distract yourself with morbidity, you can still hardly believe you've managed to survive.
${
  gotHat
    ? "You glance up at the cap sitting proudly on your head and take a deep breath, allowing much of the stress to evaporate from your body. For the first time in a long time, you feel a bit optimistic all of the sudden. You're not even sure why, but you feel like things are gonna get better."
    : "You can't entirely calm yourself. You frown a little. Something seems to be missing. You'll be fine, but you feel a bit of hollowness. Perhaps you've left something back you weren't supposed to?"
}
With your course set, you lean back and close your eyes. It's been an awful day. As the ruins of your former home slowly disappear behind the horizon, you hear the boss groan and sputter. His single remaining eye pierces your soul as he demands to know what happened. You stand up and ask him to stay sitting. That way it'll be easier to take the news. You've survived RuptureFarms... surely you'll survive him too.

*Total steps taken: ${player.stepCounter}.*
${pathMsg}

*DEATHS: ${player.deaths.size} / ${DEATHS.__LENGTH}*
${
  allDeaths
    ? "Congrats, you're a master at not staying alive!"
    : "Hmm, seems like you missed some opportunities to get an early severance package."
}
${deaths}

*You finished the game. Thank you for playing!*`;
};

export const finis = new Room({}, actions, description);
