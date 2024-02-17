import { SPAWN_POS } from "./constants.ts";
import { show } from "./display.ts";
import { player } from "./player.ts";
import { gameMap } from "./roomlist.ts";

player.position = [...SPAWN_POS];
player.currentRoom = gameMap[SPAWN_POS[0]][SPAWN_POS[1]];

function act(str: string) {
  show(str, true);
  player.currentRoom?.doAction(str.toLowerCase());
  player.stepCounter++;
}

// Generated using: https://patorjk.com/software/taag
const title = String.raw`
,_____                            __                      ______            _                 ______                         __  _____  _____  _____ 
|  ___|                          / _|                     | ___ \          | |                |  ___|                       /  ||  _  |/ __  \|  _  |
| |__ ___  ___ __ _ _ __   ___  | |_ _ __ ___  _ __ ___   | |_/ /   _ _ __ | |_ _   _ _ __ ___| |_ __ _ _ __ _ __ ___  ___  ˙| || |/' |˙' / /'| |_| |
|  __/ __|/ __/ _˙ | '_ \ / _ \ |  _| '__/ _ \| '_ ˙ _ \  |    / | | | '_ \| __| | | | '__/ _ \  _/ _˙ | '__| '_ ˙ _ \/ __|  | ||  /| |  / /  \____ |
| |__\__ \ (_| (_| | |_) |  __/ | | | | | (_) | | | | | | | |\ \ |_| | |_) | |_| |_| | | |  __/ || (_| | |  | | | | | \__ \ _| |\ |_/ /./ /___.___/ /
\____/___/\___\__,_| .__/ \___| |_| |_|  \___/|_| |_| |_| \_| \_\__,_| .__/ \__|\__,_|_|  \___\_| \__,_|_|  |_| |_| |_|___/ \___/\___/ \_____/\____/ 
                   | |                                               | |                                                                             
                   |_|                                               |_|                                                                             
                   
A TEXT-ADVENTURE GAME, CREATED BY NEMIN (ODDWORDS.HU) @ 2024`.trim();

window.addEventListener("load", () => {
  const input = document.getElementById("input") as HTMLInputElement;
  const output = document.getElementById("output") as HTMLDivElement;
  const form = document.getElementById("act") as HTMLFormElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    act(input.value.trim());
    input.value = "";
  });

  const titleElem = document.createElement("pre");
  titleElem.innerText = title;
  titleElem.classList.add("title");
  output.appendChild(titleElem);
  output.appendChild(document.createElement("hr"));

  show(
    "You take a ragged breath as you suddenly come to. Even before having a second to open your eyes, stimuli already began bombarding your mind. You feel your body press against something deathly cold. Your head is screaming at you with an ache worse than during your wildest hangovers. Something next to you screeches incessantly, like a thousand nails scraping on metal. And, last but not least, your entire being is in pain, like you were just beaten to an inch of your life.\nYou groan and blindly grope around, trying to find something to grab in an attempt to stabilize your spinning head. Slowly the nausea retracts just enough for you to attempt standing up, but despite several valiant attempts, you keep tumbling back like a helpless, overturned bug. The diagnosis is clear: Your legs have seized. Unfortunate and embarrassing, but it happens sometimes.\nYou reach down half-blind and fumble with the harness until you find the small reset button.\nThe machine spends a few seconds just whirring helplessly while belching poisonous fumes. You hack and wheeze as you wait, the noxious gas not helping your head in the slightest. You're just about to whack the machine in frustration when, without warning, it suddenly jerks back to life, allowing you to carefully stand back up.\nHaving finally escaped from the floor, you feel yourself well enough to figure out what's going on. You have some vague memories about what happened, but still, it'd probably be the best to first *look around*. Unless, of course, you'd rather just call out to your momma for *help*.",
  );
});
