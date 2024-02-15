import { ActionGenerator, Flags, Room } from "../room.ts";
import { DEATH, ITEM } from "../roomnames.ts";
import { GM } from "../util.ts";

type flags = Flags<never>

const actions: ActionGenerator<flags> = (flags) => ({

})

const description = (flags: flags) => {
  const gotHat = GM.hasItem(ITEM.HAT)
  const allDeaths = GM.deaths.size >= DEATH.__LENGTH

  const deathOptions: Array<[DEATH, string]> = [
    [DEATH.ABYSS, ""],
    [DEATH.BOILER, ""],
    [DEATH.BREW, ""],
    [DEATH.FUZZLE, ""],
    [DEATH.GAS, ""],
    [DEATH.MEATSAW, ""],
  ];
  
  const deaths = deathOptions.map(([type, msg]) => `- ${DEATH[type]}: ${GM.deaths.has(type) ? msg : "???"}`).join("\n")

  return `You don't waste any time dropping the boss onto a nearby couch and then jumping into the pilot seat yourself. It takes the blimp's engine a few attempts to finally kick in, but after a while you slowly feel the machine lift away from the roof and ascend into the sky. As you glance back, you realize you couldn't have taken off at a better moment. The second your craft cleared the runway, the roof began to collapse into itself, the sinkhole promptly swallowing a metric ton of concrete, before vomiting back a mixture of dust and black smoke.
You gulp a little and decide to look away instead. To steel your resolve, you think about all the ways you and the boss will 'pay' back all the misery that Abe guy had caused you. You chuckle a little. Next time it won't be anything as simple as a meatsaw. Yet, as much as you're trying to distract yourself with morbidity, you can still hardly believe you've managed to survive.
${gotHat ? "You glance up at the cap sitting proudly on your head and take a deep breath, allowing much of the stress to evaporate from your body. For the first time in a long time, you feel a bit optimistic all of the sudden. You're not even sure why, but you feel like things are gonna get better." : "You can't entirely calm yourself. Something seems to be missing... You frown a little. You'll be fine, but you feel a bit of hollowness. Perhaps you've left something back you weren't supposed to?"}
With your course set, you lean back and close your eyes. It's been an awful day. As the ruins of your former home slowly disappear behind the horizon, you hear the boss groan and sputter. You stand up and tell him to stay sitting. That way it'll be easier to take the news.

DEATHS: ${GM.deaths.size} / ${DEATH.__LENGTH}
${allDeaths ? "Congrats, you're a master at not staying alive!" : "Hmm, seems like you missed some opportunities to get an early severance package."}
${deaths}

Thank you for playing!`
}

export const finis = new Room({}, actions, description)