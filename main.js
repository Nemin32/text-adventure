var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// roomnames.ts
var ROOM_NAME = /* @__PURE__ */ ((ROOM_NAME3) => {
  ROOM_NAME3["BOILA"] = "BOILA ";
  ROOM_NAME3["CORRA"] = "CORRA ";
  ROOM_NAME3["CORRB"] = "CORRB ";
  ROOM_NAME3["ELEVA"] = "ELEVA ";
  ROOM_NAME3["GASRE"] = "GASRE ";
  ROOM_NAME3["GCTRL"] = "GCTRL ";
  ROOM_NAME3["LOUNG"] = "LOUNG ";
  ROOM_NAME3["SECUR"] = "SECUR ";
  ROOM_NAME3["SPAWN"] = "SPAWN ";
  ROOM_NAME3["STRIP"] = "STRIP ";
  ROOM_NAME3["STORG"] = "STORG ";
  ROOM_NAME3["DEATH"] = "DEATH";
  ROOM_NAME3["FINIS"] = "FINIS";
  return ROOM_NAME3;
})(ROOM_NAME || {});
var DEATH = /* @__PURE__ */ ((DEATH3) => {
  DEATH3[DEATH3["BREW"] = 0] = "BREW";
  DEATH3[DEATH3["GUN"] = 1] = "GUN";
  DEATH3[DEATH3["BOILER"] = 2] = "BOILER";
  DEATH3[DEATH3["ABYSS"] = 3] = "ABYSS";
  DEATH3[DEATH3["MEATSAW"] = 4] = "MEATSAW";
  DEATH3[DEATH3["FUZZLE"] = 5] = "FUZZLE";
  DEATH3[DEATH3["GAS"] = 6] = "GAS";
  DEATH3[DEATH3["__LENGTH"] = 7] = "__LENGTH";
  return DEATH3;
})(DEATH || {});

// util.ts
var msgs = [];
window.addEventListener("load", () => {
  const output = document.getElementById("output");
  if (output === null) {
    alert("For some reason the game isn't able to communicate with the page. Please tell Nemin.");
    return;
  }
  setInterval(() => {
    if (msgs.length > 0) {
      if (msgs[0].type === "divider") {
        output.appendChild(document.createElement("hr"));
      } else {
        const p = document.createElement("pre");
        if (msgs[0].type === "command") {
          p.classList.add("command");
        }
        p.innerHTML = msgs[0].msg.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/\*(.*?)\*/g, "<span class='spec'>$1</span>");
        output.appendChild(p);
      }
      output.scrollTop = output.scrollHeight;
      msgs = msgs.slice(1);
    }
  }, 200);
});
function show(str, command = false) {
  msgs = [...msgs, ...str.split("\n").map((s) => ({ type: command ? "command" : "msg", msg: s })), { type: "divider" }];
}

// gm.ts
var GameManager = class {
  constructor() {
    __publicField(this, "deaths", /* @__PURE__ */ new Set());
    __publicField(this, "prevRoom", []);
    __publicField(this, "currentName", "SPAWN " /* SPAWN */);
    __publicField(this, "currentRoom", null);
    __publicField(this, "items", /* @__PURE__ */ new Set());
    __publicField(this, "brewUsed", false);
    __publicField(this, "stepCounter", 0);
  }
  hasItem(item) {
    return this.items.has(item);
  }
  addItem(item) {
    this.items.add(item);
  }
};
var GM = new GameManager();

// adjacencies.ts
var adjacency = /* @__PURE__ */ new Set();
var makeAdjacent = (name1, name2) => {
  adjacency.add(`${ROOM_NAME[name1]}${ROOM_NAME[name2]}`);
  adjacency.add(`${ROOM_NAME[name2]}${ROOM_NAME[name1]}`);
};
var isAdjacent = (other) => adjacency.has(`${ROOM_NAME[GM.currentName]}${ROOM_NAME[other]}`);
var getRoom = (name) => {
  const room2 = rooms.get(name);
  if (room2) {
    return [name, room2];
  }
  return ["SPAWN " /* SPAWN */, rooms.get("SPAWN " /* SPAWN */)];
};
var move = (name) => {
  if (!isAdjacent(name)) {
    show(`There is no path from ${ROOM_NAME[GM.currentName]} to ${ROOM_NAME[name]}.`);
    return;
  }
  const [newName, room2] = getRoom(name);
  GM.prevRoom.push(GM.currentName);
  GM.currentName = newName;
  GM.currentRoom = room2;
  GM.currentRoom.printDescription();
};
var goBack = () => {
  if (GM.prevRoom.length === 0) {
    show("No previous room to go back to.");
    return;
  }
  const lastRoom = GM.prevRoom[GM.prevRoom.length - 1];
  if (lastRoom === "FINIS" /* FINIS */) {
    show("Buddy, the factory is gone. Where'd you even go back to?");
    return;
  }
  GM.prevRoom = GM.prevRoom.slice(0, -1);
  const [name, room2] = getRoom(lastRoom);
  GM.currentName = name;
  GM.currentRoom = room2;
  GM.currentRoom.printDescription();
};
var die = () => {
  GM.prevRoom.push(GM.currentName);
  const [name, room2] = getRoom("DEATH" /* DEATH */);
  GM.currentName = name;
  GM.currentRoom = room2;
  GM.currentRoom.printDescription();
};
makeAdjacent("SPAWN " /* SPAWN */, "CORRA " /* CORRA */);
makeAdjacent("CORRA " /* CORRA */, "CORRB " /* CORRB */);
makeAdjacent("CORRA " /* CORRA */, "GCTRL " /* GCTRL */);
makeAdjacent("CORRA " /* CORRA */, "ELEVA " /* ELEVA */);
makeAdjacent("ELEVA " /* ELEVA */, "STRIP " /* STRIP */);
makeAdjacent("CORRB " /* CORRB */, "GCTRL " /* GCTRL */);
makeAdjacent("CORRB " /* CORRB */, "GASRE " /* GASRE */);
makeAdjacent("CORRB " /* CORRB */, "BOILA " /* BOILA */);
makeAdjacent("GASRE " /* GASRE */, "STORG " /* STORG */);
makeAdjacent("BOILA " /* BOILA */, "LOUNG " /* LOUNG */);
makeAdjacent("LOUNG " /* LOUNG */, "SECUR " /* SECUR */);
makeAdjacent("STRIP " /* STRIP */, "FINIS" /* FINIS */);

// room.ts
var Room = class {
  constructor(flags, actionGenerator, description13) {
    this.flags = flags;
    this.description = description13;
    __publicField(this, "actions");
    __publicField(this, "fallbacks", {
      look: ({ what }) => show(`I can't see any ${what} here.`),
      enter: ({ what }) => show(`No. I can't enter the ${what}.`),
      jump: ({ what }) => show(`Not gonna jump into the ${what}.`),
      press: ({ what }) => show(`How would I even press the ${what}?`),
      take: ({ what }) => show(`I couldn't possibly take the ${what}.`),
      talk: ({ what }) => show(`Talk to ${what}? Are you stupid?`),
      read: ({ what }) => show(`I might be illiterate, but I can't read the ${what}.`),
      open: ({ what }) => show(`I can't exactly open the ${what}.`),
      use: ({ what, tool }) => GM.hasItem(tool) ? show(`How would I even use ${tool} on ${what}?`) : show(`I don't have that tool.`)
    });
    this.actions = actionGenerator(this.flags);
  }
  printDescription() {
    show(this.description(this.flags));
  }
  setFlag(flag, value) {
    this.flags[flag] = value;
  }
  getFlag(flag) {
    return this.flags[flag];
  }
  findAction(act2, name) {
    if (this.actions[act2] === void 0) {
      return this.fallbacks[act2];
    }
    const fn = this.actions[act2]?.find(({ trigger, action }) => trigger.includes(name))?.action;
    if (fn === void 0) {
      return this.fallbacks[act2];
    }
    return fn;
  }
  doAction(input) {
    const cases = [
      [/(?:(look( at)?)|inspect)(?: the)? (?<what>.*)/, "look"],
      [/use(?: the)? (?<tool>.*) on(?: the)? (?<what>.*)/, "use"],
      [/(?:press|push)(?: the)? (?<what>.*)/, "press"],
      [/(?:take|pick up)(?: the)? (?<what>.*)/, "take"],
      [/talk (?:with |to )?(?: the)?(?<what>.*)/, "talk"],
      [/(?:enter(?: the)?|(?:move(?: to)?)|go) (?<what>.*)/, "enter"],
      [/(?:read)(?: the)? (?<what>.*)/, "read"],
      [/(?:jump|dive|pounce)(?: into(?: the)?)? (?<what>.*)/, "jump"],
      [/open (?<what>.*)/, "open"]
    ];
    const YOURSELF = ["me", "yourself", "self", "player", "character"];
    if (input === "help") {
      const helpMsg = `*Escape from RuptureFarms* is a text-based adventure game, similar in spirit to *Zork*.
You interact with the world using the following text commands:
- *look around*
- *look at* <object>
- *use* <tool> *on* <subject> (<subject> may be "me" or "self" to use an item on yourself)
- *press* / *push* <object>
- *talk to* <someone>
- *go* / *enter* / *move to* <location> (use "go back" to enter the previous room)
- *read* <something>
- *jump* / *dive into* <somewhere>
- *open* <something>
- *inventory*
Some puzzles might be concealed or require special interaction before you can solve them, but no puzzle requires anything not mentioned here. Experiment!
If any problems come up, please complain to Nemin.`;
      show(helpMsg);
      return;
    }
    if (input === "inventory") {
      if (GM.items.size === 0) {
        show("You don't have any items on you.");
        return;
      }
      const invMap = /* @__PURE__ */ new Map([
        ["boss" /* BOSS */, "Your knocked out boss. It's best not to disturb him any more than being carried on your boney back already does."],
        ["brew" /* BREW */, "A refreshing bottle of SoulStorm Brew. Extremely flammable, even more tasty."],
        ["gun" /* GUN */, "A gun with one bullet. A Slig's best friend... after a Slog, perhaps."],
        ["pilot cap" /* HAT */, "A pilot's trustiest companion. Just having it on your head fills you with confidence."],
        ["key" /* KEY */, "A small key with a tag on it that simply says 'FOR EMERGENCIES'."],
        ["keycard" /* KEYCARD */, "A small gray keycard with the word 'SECURITY' stamped on it."],
        ["wrench" /* WRENCH */, "A long, heavy-duty wrench, with a hexagonal slot."]
      ]);
      const items = [...GM.items.values()].map((i) => `- ${i}: ${invMap.get(i)}`).join("\n");
      show(`Your current possessions:
${items}`);
      return;
    }
    for (const [rx, action] of cases) {
      const res = input.match(rx);
      if (res === null || res.groups === void 0) {
        continue;
      }
      const canShoot = action === "use" && YOURSELF.includes(res.groups.what) && res.groups.tool === "gun" /* GUN */ && GM.hasItem("gun" /* GUN */);
      const canDrink = action === "use" && YOURSELF.includes(res.groups.what) && res.groups.tool === "brew" /* BREW */ && GM.hasItem("brew" /* BREW */) && !GM.brewUsed;
      const looksAround = action === "look" && ["around", "the room", "room"].includes(res.groups.what);
      const goesBack = action === "enter" && res.groups.what === "back";
      switch (true) {
        case looksAround:
          this.printDescription();
          break;
        case goesBack:
          goBack();
          break;
        case canShoot:
          if (!GM.deaths.has(1 /* GUN */)) {
            GM.deaths.add(1 /* GUN */);
            show("You turn the gun towards your face and stare down the barrel. Neither dying under the rubble nor burning to death sound like very dignified deaths. Why not go out your own way? You slowly pull the trigger. Your ears barely register the bang as your body collapses on the ground and everything cuts to black.");
            die();
          } else {
            show("No, that would not solve anything. You have to press on and see this to the end.");
          }
          break;
        case canDrink:
          if (!GM.deaths.has(0 /* BREW */)) {
            GM.deaths.add(0 /* BREW */);
            show("You drink the Brew and pass out. Not even the approaching flames can disturb your slumber. You never wake up again.");
            die();
          } else {
            show("Even though you're parched, drinking the Brew suddenly doesn't seem like that good of an idea.");
          }
          break;
        default:
          this.findAction(action, res.groups.what)(res.groups);
      }
      return;
    }
    show("No idea what you just meant.");
  }
};

// rooms/corra.ts
var actions = (_) => ({
  enter: [
    {
      trigger: ["chamber", "behind"],
      action: () => move("SPAWN " /* SPAWN */)
    },
    {
      trigger: ["left", "maintenance"],
      action: () => move("CORRB " /* CORRB */)
    },
    {
      trigger: ["forward", "landing", "landing strip"],
      action: () => move("ELEVA " /* ELEVA */)
    },
    {
      trigger: ["right", "gate control", "control", "gate"],
      action: () => move("GCTRL " /* GCTRL */)
    }
  ],
  look: [
    {
      trigger: ["sign"],
      action: () => show("The sign is caked in rust and dirt. A challenge for a Mudokon, perhaps, but it's nothing your experienced eyes couldn't read.")
    }
  ],
  read: [
    {
      trigger: ["sign"],
      action: () => show("The sign reads:\n^  LANDING STRIP\n<- MAINTENANCE\n-> GATE CONTROL")
    }
  ]
});
var description = (flags) => "You find yourself on a dull utility corridor. The whole facility is dead silent, except for the slight whirring coming from the door to the execution *chamber* behind you. You see a *sign* on the wall in front of you. Three other paths lead away in each cardinal direction.";
var corra = new Room({}, actions, description);

// rooms/gasre.ts
var actions2 = (flags) => ({
  enter: [
    {
      trigger: ["passageway", "corridor"],
      action: () => move("CORRB " /* CORRB */)
    },
    {
      trigger: ["door", "storage"],
      action: () => move("STORG " /* STORG */)
    }
  ],
  jump: [
    {
      trigger: ["abyss"],
      action: () => {
        if (!GM.deaths.has(3 /* ABYSS */)) {
          GM.deaths.add(3 /* ABYSS */);
          show("You always wondered what's on the bottom of this chamber. Instead of bothering to find an elevator or stairs, you decide to take the easy way down. Your screams echo for seconds before a quiet splat is finally heard. You were never seen again.");
          die();
        } else {
          show("As alluring as the abyss is, you don't feel like meeting it up close.");
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
      action: ({ tool }) => {
        if (tool === "wrench" /* WRENCH */) {
          if (GM.hasItem("wrench" /* WRENCH */)) {
            if (!flags.gasRedirected) {
              flags.gasRedirected = true;
              show("You switch over the valve.");
            } else {
              show("The valve is already switched over.");
            }
          } else {
            show("You don't have a wrench.");
          }
        } else {
          show("I don't think that'd work.");
        }
      }
    }
  ]
});
var description2 = (_) => `You step onto a rickety catwalk, hanging above a dark *abyss*. On both sides you see gigantic oval *tanks*, whose bases disappear into the blackness below. With each careful step of your mechanical harness, the catwalk whines and sways precariously. You're almost certain if you were only a little bit heavier, the screws holding you would loosen and you'd plummet to your death. Thankfully the room seems unharmed otherwise. You're not really sure how the fires haven't reached here yet and shudder to think what would have happened if they did.
There is also a massive pipe above the catwalk, which runs parallel with it, before suddenly splitting in two and disappearing among the tanks. There seems to be some sort of *valve* at the junction.
Behind you is the open passageway to the *corridor*, while in front of you, at the far end of the catwalk, is another *door* with a *sign* next to it.`;
var gasre = new Room({ gasRedirected: false }, actions2, description2);

// rooms/boila.ts
var actions3 = (flags) => ({
  enter: [
    {
      trigger: ["door"],
      action: () => move("CORRB " /* CORRB */)
    },
    {
      trigger: ["path"],
      action: () => {
        if (flags.boilerFixed) {
          move("LOUNG " /* LOUNG */);
        } else {
          if (!GM.deaths.has(2 /* BOILER */)) {
            GM.deaths.add(2 /* BOILER */);
            show("You try your best to run past the furnace between two blasts of flame, but at the worst possible moment your leg gets caught in a pipe and you fall face first into the furnace. It takes mere seconds for you to burn to a crisp.");
            die();
          } else {
            show("You kinda don't feel like burning to death today.");
          }
        }
      }
    }
  ],
  use: [
    {
      trigger: ["furnace", "boiler"],
      action: ({ tool }) => {
        if (flags.boilerFixed) {
          show("The boiler is already 'fixed'.");
          return;
        }
        if (tool === "brew" /* BREW */) {
          if (GM.hasItem("brew" /* BREW */)) {
            flags.boilerFixed = true;
            GM.brewUsed = true;
            show("You chuck the bottle of Brew into the furnace, which promptly explodes from the sudden heat. The furnace collapses into itself in a spectacular display of flame and destruction, coating the floor in hot coals and soot. You smile, it's nothing your legs can't handle.");
          } else {
            show("The sight makes you thirsty for sure, but you don't have any Brew on you.");
          }
        } else {
          show("No, I don't think that would work.");
        }
      }
    },
    {
      trigger: ["generator"],
      action: ({ tool }) => {
        if (flags.generatorFixed) {
          show("The generator is happily running. There is nothing else you need to do.");
          return;
        }
        if (tool === "key" /* KEY */) {
          if (GM.hasItem("key" /* KEY */)) {
            if (!gasre.getFlag("gasRedirected")) {
              show("You turn the key... and nothing happens. Hm. The generator seems to be out of gas.");
              return;
            }
            flags.generatorFixed = true;
            show("With a grating sputter and a wild jerk the generator springs into life, delivering vital electricity to the grid.");
          } else {
            show("Hmm, you seem to need a key to start this baby.");
          }
        }
      }
    }
  ]
});
var description3 = (flags) => `The boiler room has seen better days. As you navigate the wild web of pipes, you take a peek at the gauges. As expected, they're all in the red. In one corner of the room a dirty *generator* ${flags.generatorFixed ? "belches disgusting smoke, as it converts the gas into electricity." : "sits unused."}
A *door* leads back into the corridor. Another *path* leads deeper inside, towards the employee lounge. ${flags.boilerFixed ? "Next to it, you see the still-smoking wreckage of what was once a *furnace*." : "However, passage is currently blocked by the flames of an overheated *furnace* next to it."}`;
var boila = new Room({ boilerFixed: false, generatorFixed: false }, actions3, description3);

// rooms/secur.ts
var TERMINAL = ["terminal", "pc", "computer", "screen"];
var actions4 = (flags) => ({
  enter: [
    {
      trigger: ["1997"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe pops open with a satisfying click.");
          flags.safeOpened = true;
        } else {
          show("The safe is already open.");
        }
      }
    },
    {
      trigger: ["1"],
      action: () => {
        if (flags.lockdownLifted) {
          show("The terminal remains unresponsive.");
          return;
        }
        show("The terminal hangs for a second, then beeps. The siren and emergency lights around you suddenly shut off.");
        flags.lockdownLifted = true;
      }
    },
    {
      trigger: ["2"],
      action: () => {
        if (flags.lockdownLifted) {
          show("The terminal remains unresponsive.");
          return;
        }
        if (!GM.deaths.has(6 /* GAS */)) {
          show("You hear distant hissing in the pipes as nerve-gas fills the lower levels, killing all those who might have survived the initial catastrophe. A few seconds later you hear a deafening thud and the very floor bulges, then opens below your metal legs. An incredible volume of gas, ignited by the fires ravaging the facility, erupts into the room and melts you in less than a moment.");
          GM.deaths.add(6 /* GAS */);
          die();
        } else {
          show("Nah. Who would you even gas at this point?");
        }
      }
    },
    {
      trigger: ["door"],
      action: () => move("LOUNG " /* LOUNG */)
    }
  ],
  take: [
    {
      trigger: ["cap", "hat", "pilot cap"],
      action: () => {
        if (!flags.safeOpened) {
          show("I can't see any caps around.");
          return;
        }
        if (!GM.hasItem("pilot cap" /* HAT */)) {
          GM.addItem("pilot cap" /* HAT */);
          show("You place the cap on your head. It makes you feel like a part of you that you never knew was missing returned.");
        } else {
          show("The cap is already sitting on your head, stupid.");
        }
      }
    }
  ],
  look: [
    {
      trigger: ["safe"],
      action: () => {
        if (!flags.safeOpened) {
          show("The safe is securely locked. The number-pad on it is expecting a four digit input. You could *enter* the password here, if you knew it. There is also a small *note* plastered onto the safe.");
        } else {
          if (!GM.hasItem("pilot cap" /* HAT */)) {
            show("A snazzy pilot *cap* is staring back at you from inside the safe.");
          } else {
            show("The safe is completely empty.");
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
    }
  ],
  use: [
    {
      trigger: TERMINAL,
      action: ({ tool }) => {
        if (flags.terminalUnlocked) {
          show("I don't think that's necessary anymore.");
          return;
        }
        if (tool === "keycard" /* KEYCARD */) {
          if (GM.hasItem("keycard" /* KEYCARD */)) {
            flags.terminalUnlocked = true;
            show("The terminal lets out a small chime as it logs you in.");
          } else {
            show("I need to find a keycard first.");
          }
        } else {
          show("No, I don't think that'd work.");
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
          show("[TERMINAL LOCKED]\nShow identification to proceed.");
          return;
        }
        if (flags.lockdownLifted) {
          show("[[RFOS v2.0]]\nAll operations nominal. Have a very safe and productive day!");
        } else {
          show("[[RFOS v2.0]]\nATTENTION - Site-wide employee tally mismatch. Potential breakout in progress. Lockdown engaged, all commerce halted. Apply force, cull dissent, restore productivity.\n\nOPTIONS:\n1. Manually lift lockdown\n2. Flush lower levels with gas");
        }
      }
    }
  ]
});
var description4 = (flags) => `The security office is a mess. Everywhere you look you see the signs of a hurried leave. The desks are full of half-eaten food and coffee-stained *papers*, some of which have been blown off and now lie trampled on the floor. Among the papers you see a still-operational *terminal*.
Many of the chairs in the room have toppled over as their occupants rushed out to respond to the emergency, but even those that managed to stand upright ended up clumped in the middle of the room.
${flags.lockdownLifted ? "The emergency light and the siren have mercifully turned off. In their stead, a cold fluorescent bulb illuminates the room, granting it an unnervingly still atmosphere." : "A rotating emergency light paints the room in hellish red hues, accompanied by the moderately quiet, but still grating blaring of a siren."}
A massive ${flags.safeOpened ? "open" : "closed"} *safe* sits in the corner of the room, occupying a sizeable chunk of it. The now blasted-open *door* leads back into the lounge.`;
var secur = new Room({ lockdownLifted: false, safeOpened: false, terminalUnlocked: false }, actions4, description4);

// rooms/gctrl.ts
var actions5 = (flags) => ({
  read: [
    {
      trigger: ["terminal", "screen", "code"],
      action: () => {
        const warnings = [
          [!boila.getFlag("boilerFixed"), "WARNING: Urgent message for Maintenance - Extreme heat detected in BOILA. Check machinery. Profit is at risk."],
          [!secur.getFlag("lockdownLifted"), "WARNING: Urgent message for Security - Employee count mismatch. Potential breakout attempt in progress. Lockdown engaged."],
          [!boila.getFlag("generatorFixed"), "WARNING: Urgent message for Maintenance - Extreme power surge detected. Main power supply compromised."],
          [true, "WARNING: Urgent message for ALL DEPARTMENTS - Multiple structural failures detected. Capital is at risk. FIX IT!!!"]
        ];
        const warnMsg = warnings.filter(([cond, _]) => cond).map(([_, msg2]) => msg2).join("\n");
        const msg = `[[RFOS v2.0]]
        
${warnMsg}

COMMANDS:
1. Unlock elevator to the landing strip
2. Unlock gas reservoirs
3. Directory
4. Employee tally`;
        show(msg);
      }
    }
  ],
  look: [
    {
      trigger: ["terminal", "computer", "screen"],
      action: () => show("A standard-use VYKKER-TEK terminal, operated with a keyboard with just slightly too big gaps between keys for comfort.\nUsable 80% of 50% of the time.\nOccasionally explodes under heavy load.\n\nAll things considered you'd rather tolerate the boss any day than be on computer duty.")
    },
    {
      trigger: ["slig", "body", "corpse"],
      action: () => {
        show("You take a closer look at your former compatriot. If not for the many sharp glass fragments sticking out of him and the copious amount of dried blood, he'd look like he's sound asleep. Poor guy probably died before the whole shitstorm began. These terminals are notoriously fickle things.");
        if (!GM.hasItem("keycard" /* KEYCARD */)) {
          show("Huh, he seems to have *something* clutched in his hand.");
          flags.noticedSomething = true;
        }
      }
    },
    {
      trigger: ["something"],
      action: () => {
        if (!flags.noticedSomething) {
          show("You're not sure where to look.");
          return;
        }
        if (GM.hasItem("keycard" /* KEYCARD */)) {
          show("You've already put away the keycard.");
        } else {
          show("Your dead compatriot is holding a security *keycard*. Jackpot.");
          flags.noticedKeycard = true;
        }
      }
    }
  ],
  take: [
    {
      trigger: ["keycard"],
      action: () => {
        if (!flags.noticedKeycard) {
          show("You don't see any keycards around.");
          return;
        }
        if (!GM.hasItem("keycard" /* KEYCARD */)) {
          GM.addItem("keycard" /* KEYCARD */);
          show("You pocket the keycard into your mechanical pants.");
        } else {
          show("You've already got the keycard.");
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["one", "1"],
      action: () => {
        if (!boila.getFlag("generatorFixed")) {
          show("The terminal beeps angrily. The words 'INSUFFICIENT POWER.' appear on the screen.\nCrap, better do something about it.");
          return;
        }
        if (!secur.getFlag("lockdownLifted")) {
          show("The terminal prints 'DENIED. LOCKDOWN IN PROGRESS.' onto the screen. No getting out from here until the system thinks things are fine.");
          return;
        }
        if (!flags.gateOpen) {
          flags.gateOpen = true;
          show("That did the trick.\nYou should get the boss and get outta here before this burning heap collapses on your neck.");
        } else {
          show("The gate is already open, what are you waiting for?\n Move already!");
        }
      }
    },
    {
      trigger: ["two", "2"],
      action: () => {
        if (!flags.gasRoomOpen) {
          flags.gasRoomOpen = true;
          show("The terminal beeps affirmatively. You take another look at the screen. It says 'GASRE REMOTE LOCK OPEN.'");
        } else {
          show("The terminal beeps confused. The storage is already open.");
        }
      }
    },
    {
      trigger: ["three", "3"],
      action: () => {
        show(`The terminal hangs for a few seconds, then the following chart is printed:

                        STRIP
                          |
        STORG - GASRE   ELEVA
                  |       |
             <- CORRB - CORRA - GCTRL ->
                  |       |
SECUR - LOUNG - BOILA   PRISN

BOILA: Boiler room
CORRA: Corridor A
CORRB: Corridor B
ELEVA: Elevator to landing strip
GASRE: Gas reservoirs
GCTRL: Gate control
LOUNG: Lounge
SECUR: Security booth
PRISN: Execution chamber
STORG: General storage
STRIP: Landing strip`);
      }
    },
    {
      trigger: ["four", "4"],
      action: () => show("The terminal beeps before printing 'EMPLOYEES: 00, ESCAPEES: 99, CASUALTIES: 00'. To think that single schmuck could achieve this...\nYou really wish you had a loaded gun and a blue Mudokon in firing distance.")
    },
    {
      trigger: ["left"],
      action: () => move("CORRA " /* CORRA */)
    },
    {
      trigger: ["right"],
      action: () => move("CORRB " /* CORRB */)
    }
  ],
  talk: [
    {
      trigger: ["slig", "body", "corpse"],
      action: () => show("Yeah... You just tried talking to a corpse. Obviously there is no answer. You're so taking a vacation after this crap is over.")
    },
    {
      trigger: ["terminal", "screen", "computer"],
      action: () => show("The terminal stares back at you with silent incomprehension. Must be so easy for the boss to just bark orders at screens and have things happen.")
    }
  ]
});
var description5 = (_) => `You find yourself in a computer nest, right next to the elevator. Chairs lie haphazardly scattered around the room. A few terminals are embedded in the wall, wires running wildly all over the floor. You try some of them, but they're completely busted. A *slig* sits slumped in a chair nearby, his chest is full of sharp glass fragments. The terminal in front of him is belching smoke and you're pretty sure you can hear fire quietly popping from the inside.
Miraculously the master *terminal* at the end of the room somehow still has enough power to work and it is waiting for instructions at the moment. You're not exactly qualified, but at this point nobody could stop you from *enter*-ing some commands, if you wanted.
Otherwise, there is nothing else to note in the room. Both to your *left* and your *right*, you see two corridors stretch as far as the eye could see.`;
var gctrl = new Room({ gateOpen: false, gasRoomOpen: false, noticedKeycard: false, noticedSomething: false }, actions5, description5);

// rooms/spawn.ts
var MOLLUCK = ["the boss", "boss", "molluck", "body"];
var actions6 = (flags) => ({
  take: [
    {
      trigger: MOLLUCK,
      action: () => {
        if (!gctrl.getFlag("gateOpen")) {
          show("It doesn't seem like a good idea to try to move him until you've found a way to leave. If he came to any further harm, there's no way you'd get out of here alive.");
        } else {
          if (!GM.hasItem("boss" /* BOSS */)) {
            show("As carefully as you can, you pick him up and place him on your shoulders. Your pants complain from the extra weight, but they'll have to manage. The trip isn't that long anyway and, thankfully, the boss is less heavy than he looks. His bones seem brittle as glass and his skin is like the toilet paper they had at the guardhouse.\nNo wonder he likes to hide in those huge suits, if he looks this much like a freak.");
            GM.addItem("boss" /* BOSS */);
          } else {
            show("Thank Odd there is only one of him. And he's already on your shoulders, so what are you waiting for?");
          }
        }
      }
    }
  ],
  look: [
    {
      trigger: MOLLUCK,
      action: () => show("The boss is out cold. A black wound darts across his face, seeping blood. He smells of burnt flesh and clothing, yet to your greatest surprise, he's somehow still breathing.")
    },
    {
      trigger: ["button", "the button"],
      action: () => flags.doorOpen ? show("Yep, the button is still there.") : show("The button on the wall still seems to be functional. Maybe you should try [press]-ing it.")
    },
    {
      trigger: ["door"],
      action: () => show("The sliding door has the the company's Laughing Glukkon logo painted on it. I'm not sure there is much to laugh about now though. Not after what that bastard did to us.")
    },
    {
      trigger: ["meatsaw", "saw"],
      action: () => show("Despite the calamity, the saw spins on unbothered. For some reason the boss insisted on giving it its own power supply. 'For prisoner processing efficiency,' you recall him saying. So much for that.")
    }
  ],
  press: [
    {
      trigger: ["button"],
      action: () => {
        if (!flags.doorOpen) {
          flags.doorOpen = true;
          show("The button lets out a quiet click as you press it.\nThe door next to the button hisses open.");
        } else {
          show("Nothing happens.");
        }
      }
    }
  ],
  talk: [
    {
      trigger: MOLLUCK,
      action: () => {
        if (!GM.hasItem("boss" /* BOSS */)) {
          show("You try asking him what to do, but he's out cold. For better or worse, you're on your own.");
        } else {
          show("He grumbles something, most likely a complaint, but you can't understand his words.");
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["door"],
      action: () => {
        if (flags.doorOpen) {
          move("CORRA " /* CORRA */);
        } else {
          show("You walk face first into the the door. These things aren't motion controlled, y'know?");
        }
      }
    }
  ],
  jump: [
    {
      trigger: ["saw", "meatsaw"],
      action: () => {
        if (!GM.deaths.has(4 /* MEATSAW */)) {
          GM.deaths.add(4 /* MEATSAW */);
          show("Against all sense and better judgement, you jump into the meatsaw. The blades effortlessly mince your meat, you hardly even have time to scream.");
          die();
        } else {
          show("You feel a queer sense of d\xE9ja vu and decide against the stupid idea.");
        }
      }
    }
  ]
});
var desc = (flags) => {
  return `The chamber looks surprisingly fine despite having been ravaged by lightning. But then most of the place was made from metal. That's probably the only reason you're alive now.
The *meatsaw* in the center of the room is still active, though the prisoner meant to be dropped into it is nowhere to be seen. ${GM.hasItem("boss" /* BOSS */) ? "" : " You see a slightly charred *body* on the floor."} On the wall opposite to you, there is a *button* and ${flags.doorOpen ? "an open" : "a closed"} *door*.`;
};
var room = new Room({ doorOpen: false }, actions6, desc);

// rooms/corrb.ts
var actions7 = (_) => ({
  enter: [
    {
      trigger: ["right", "corridor"],
      action: () => move("CORRA " /* CORRA */)
    },
    {
      trigger: ["left", "control", "gate control"],
      action: () => move("GCTRL " /* GCTRL */)
    },
    {
      trigger: ["gas reservoirs", "gas", "reservoirs"],
      action: () => {
        if (gctrl.getFlag("gasRoomOpen")) {
          move("GASRE " /* GASRE */);
        } else {
          show("You yank the handle, but the door doesn't yield. You can't see any keyholes or visible locks.");
        }
      }
    },
    {
      trigger: ["maintenance", "boiler", "maint"],
      action: () => move("BOILA " /* BOILA */)
    }
  ],
  look: [
    {
      trigger: ["plaque", "poster", "posters"],
      action: () => show("Your stomach rumbles as you look at the posters. You'd give your legs for a Meech Munchie right now, hell, even a crappy Scrab Cake would do. Who would've guessed being electrocuted does wonders for one's appetite? You're sure in any other situation, the boss would be delighted at the possible utilizations of this knowledge.")
    },
    {
      trigger: ["boardroom", "door", "inside"],
      action: () => show("You peer inside the door. The situation is even more grim than you expected. The main elevator you stood on just the day before had collapsed into the pit below and, as you crane your neck, you can still faintly see the fire of the wreckage light up the hole below. The main projector glitches on and off, occasionally illuminating the walls which glisten from the half-dried gore of your former superiors.")
    }
  ]
});
var description6 = (_) => "You find yourself in yet another dim corridor. The darkness inside is only illuminated by the occasional product *poster* mounted on the wall, some of which still faintly glow, the having long had lost their power. The *door* to the Boardroom hangs open next to you, light occasionally flickering on and off from the inside.\nTo your *right* is the way back to the execution chamber, to your *left* the path loops around to the gate control. There are also two other doors, one labeled *gas reservoirs* and another *maintenance*.";
var corrb = new Room({}, actions7, description6);

// rooms/eleva.ts
var actions8 = (flags) => ({
  look: [
    {
      trigger: ["junk", "trash"],
      action: () => {
        if (!GM.hasItem("brew" /* BREW */)) {
          show("Huh. As you take a better look at the trash, you notice a perfectly preserved, unopened bottle of *SoulStorm Brew*. Who in their right mind would leave that sorta stuff just lying around?");
          flags.noticedBrew = true;
        } else {
          show("Even with the bottle now gone, there is still a lot of junk. Nothing you'd consider useful though.");
        }
      }
    },
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          show("Despite all odds, the gate is open and finally nothing keeps you from leaving. Never in your entire life have you been happier to see a dingy cargo elevator before.");
        } else {
          show("You catch glimpses of the cargo elevator through the metal bars of the gate. If only you were a Big Bro, maybe you could force the gate open long enough to crawl through, but with your wimpy arms the gate is as good as impenetrable. If you don't manage to open it somehow soon, you'll surely burn alive without anyone ever finding out.");
        }
      }
    },
    {
      trigger: ["schedules", "schedule"],
      action: () => show("EXPORT:\nFeeCo Depot - Finished products (contact Sales about project New 'n' Tasty)\nBoneWerkz - Animal and otherwise byproducts\nSoulStorm Brewery - Disciplined personnel\n\nIMPORT:\nMeechtopia - Live Meeches (CANCELED)\nParamonia - Live Paramites (DELAYED)\nScrabania - Live Scrabs (DELAYED)")
    },
    {
      trigger: ["telephone", "phone"],
      action: () => show(flags.madeCall ? "The ruins of a rotary phone." : "A simple rotary phone. As you inspect it from closer, the line appears unharmed. Perhaps there is still a chance to call for help?")
    }
  ],
  take: [
    {
      trigger: ["brew", "soulstorm", "SoulStorm Brew", "Soulstorm Brew", "Soulstorm brew"],
      action: () => {
        if (!flags.noticedBrew) {
          show("Yeah, you could use a brew right now, but you don't see any.");
          return;
        }
        if (!GM.hasItem("brew" /* BREW */)) {
          show("You carefully pocket the bottle.");
          GM.addItem("brew" /* BREW */);
        } else {
          show("As nice as it'd be to find two bottles of brew, you're not that lucky.");
        }
      }
    }
  ],
  talk: [
    {
      trigger: ["phone", "telephone"],
      action: () => {
        if (!flags.madeCall) {
          flags.madeCall = true;
          show("You pick up the receiver and contact emergency services. They tell you they'll be available three to four weeks from now and thank you for your patience. Before you could say another word, the other end hangs up. Enraged, you pick up the machine and smash it against the floor. So much for the government.");
        } else {
          show("No one will be making another call with this phone.");
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["door"],
      action: () => move("CORRA " /* CORRA */)
    },
    {
      trigger: ["gate"],
      action: () => {
        if (gctrl.getFlag("gateOpen")) {
          move("STRIP " /* STRIP */);
        } else {
          show("The gate remains locked and sadly you cannot phase though metal.");
        }
      }
    }
  ]
});
var description7 = (flags) => `One step from freedom. ${gctrl.getFlag("gateOpen") ? "The *gate* is wide open, you should hurry and get out already." : "Except for the ten-ton *gate* in front of you blocking the path."} Just a few hours ago this was an endlessly busy hub of wares coming and going from the Farms, using the freight elevator that connects the main corridor of the facility with the landing strip on the roof.
*Schedules* are haphazardly stapled on the walls. There is a small, abandoned guard booth next to the gate, with a *telephone* inside. While the path between the two ends of the room is mostly clean, those stupid Mudokons never had too much finesse handling goods, so there is a lot of *junk* strewn around left and right.
The floor itself is covered in scratches from all the boxes being dragged around, with a visible path of rubbed-out metal connecting the elevator to the *door* into the factory.`;
var eleva = new Room({ noticedBrew: false, madeCall: false }, actions8, description7);

// rooms/death.ts
var actions9 = (flags) => ({});
var description8 = (flags) => {
  const gotAllDeaths = GM.deaths.size >= 7 /* __LENGTH */;
  const allDeathsMsg = "You've died in all possible ways.\nThe powers that be are very irritated by your bumbling, but also a little impressed as well by how naturally you seem to get yourself killed. How did you manage to survive until now? Regardless, you still have a place in their plans, so *go back* and change your fate.";
  const normalDeathsMsg = `You've achieved ${GM.deaths.size} of ${7 /* __LENGTH */} possible deaths.
However, the powers that be have other plans for you. They call for you to *go back* and change your fate.`;
  return `[GAME OVER]
${gotAllDeaths ? allDeathsMsg : normalDeathsMsg}`;
};
var death = new Room({}, actions9, description8);

// rooms/storg.ts
var actions10 = (flags) => ({
  enter: [
    {
      trigger: ["back", "door"],
      action: () => move("GASRE " /* GASRE */)
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
    {
      trigger: ["box", "boxes"],
      action: () => show("There must be hundreds, if not thousands of boxes here. Some of the logos stamped onto them are so ancient, you don't even recognize them. You sorta understand now why the Farms was in financial ruins with so much inventory left unused.")
    }
  ],
  open: [
    {
      trigger: ["crate"],
      action: () => show("The crate is too strong for your bare hands. If you had something long and strong, you could use it as a lever to pry it open.")
    },
    {
      trigger: ["locker"],
      action: () => {
        if (!GM.hasItem("gun" /* GUN */)) {
          show("You're overjoyed to find a fresh gun inside... only to realize in dismay that it only has a single bullet in it. Still, gripping the weapon gives you a certain calmness you haven't felt for a long time.");
          GM.addItem("gun" /* GUN */);
        } else {
          show("The locker is empty.");
        }
      }
    },
    {
      trigger: ["toolbox"],
      action: () => {
        if (!GM.hasItem("wrench" /* WRENCH */)) {
          show("You found a wrench inside the toolbox.");
          GM.addItem("wrench" /* WRENCH */);
        } else {
          show("None of the other tools seem helpful in your situation.");
        }
      }
    }
  ],
  use: [
    {
      trigger: ["crate"],
      action: ({ tool }) => {
        if (tool === "wrench" /* WRENCH */) {
          if (!GM.deaths.has(5 /* FUZZLE */)) {
            show("You pry open the crate using the wrench. A moment later furry balls blast out from the darkness inside, latching onto your body, tearing skin and muscle. You scream in agony and try to swat them off, but it's no use. You are slowly overwhelmed, until little more than bones and a pair of legs remain.");
            GM.deaths.add(5 /* FUZZLE */);
            die();
          } else {
            show("Upon second thoughts, it's best not to disturb whatever's inside there.");
          }
        } else {
          show("No, I don't think that'd work.");
        }
      }
    }
  ]
});
var description9 = (flags) => `As far as you can see *boxes* are stacked haphazardly on each other. The little that still sticks out from the ones at the bottom seem positively ancient and you're not entirely certain how the whole place hadn't collapsed into itself already. The darkness of the room is somewhat illuminated by fires at the opposite end. It's probably for the best if you get what you need and get out, before it reaches here.
Amidst the mess three boxes in particularly get your attention: A wooden *crate*, a metal *locker* and a *toolbox*. Everything else seems too securely locked or hard to get to, so you'd rather not bother with them.
As the path forward is blocked by flames, the only way is through the *door* back to the gas reservoirs.`;
var storg = new Room({}, actions10, description9);

// rooms/loung.ts
var actions11 = (flags) => ({
  look: [
    {
      trigger: ["darts", "darts board"],
      action: () => show("A few darts are sticking out from the board, mostly around the edges. None of the guys were very good shots. It's easier when you don't have to care about things like 'ballistics' and 'having a good aim'.`")
    },
    {
      trigger: ["poker table", "table", "poker", "desk"],
      action: () => {
        flags.keyNoticed = true;
        show(`You see four hands on the table, one of them being a five of aces... Yeah, there is reason why you eventually stopped playing for Moolah. Upper management was incredibly unhappy with the amount of break-time fatalities.${!GM.hasItem("key" /* KEY */) ? " Huh there also seems to be a small *key* on the desk." : ""}`);
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
      action: () => flags.securityOpen ? show("The door leads into the security booth. With the padlock shot off, nothing stops you from just waltzing inside. Odd bless firearms.") : show("The door leads into the security booth. It's been haphazardly locked with a padlock, but as you inspect the mechanism, it seems very shoddy and weak. You're certain it wouldn't take much to blast it right off.")
    }
  ],
  use: [
    {
      trigger: ["door", "booth", "security booth"],
      action: ({ tool }) => {
        if (flags.securityOpen) {
          show("There is nothing else you need to do with the door.");
          return;
        }
        if (tool === "gun" /* GUN */) {
          if (GM.hasItem("gun" /* GUN */)) {
            show("It feels a bit wrong to waste your one bullet on something inanimate, but then this is an emergency. You take aim and blast the padlock into smithereens, unlocking the door in style.");
            flags.securityOpen = true;
          } else {
            show("Yeah, good idea, if only I had a gun to actually try it.");
          }
        } else {
          show("No, I don't think that'd work.");
        }
      }
    }
  ],
  take: [
    {
      trigger: ["key", "small key"],
      action: () => {
        if (!flags.keyNoticed) {
          show("Huh, what key?");
          return;
        }
        if (!GM.hasItem("key" /* KEY */)) {
          GM.addItem("key" /* KEY */);
          show("You pocket the small key.");
        } else {
          show("You've already put the key away.");
        }
      }
    }
  ],
  enter: [
    {
      trigger: ["path", "boiler room"],
      action: () => move("BOILA " /* BOILA */)
    },
    {
      trigger: ["door", "security", "security booth"],
      action: () => {
        if (flags.securityOpen) {
          move("SECUR " /* SECUR */);
        } else {
          show("You try to enter the booth, but it is locked.");
        }
      }
    }
  ]
});
var description10 = (flags) => `You step into the employee lounge area. You've never quite understood why they placed the lounge past the boilers, but then you've suspected for years that RuptureFarms wasn't exactly built up to code... If there even was a code to begin with.
Still, even with all the chaos and destruction outside, you feel a bit of fuzziness in your cold, dead heart as you gaze over the place that gave you so many good memories. A poker *table* dominates the middle of the room, situated between a handful of three-legged chairs. The floor is covered by a cheap, faded carpet, its pattern long unrecognizable under all the stains and years of abuse. A *darts board* hangs on the far end of the wall, next to it a faded *poster*. Below them, on a small cubby, you hear an old *TV* babbling to itself. As you make your way through the room, your legs keep kicking away empty bottles of SoulStorm Brew. You smile. It's a mess for sure, but it is your mess.
A *door* to the left leads into a nearby security booth, while the *path* back into the boiler room is behind you.`;
var loung = new Room({ securityOpen: false, keyNoticed: false }, actions11, description10);

// rooms/strip.ts
var actions12 = (flags) => ({
  enter: [
    {
      trigger: ["ship", "blimp", "plane"],
      action: () => {
        if (GM.hasItem("boss" /* BOSS */)) {
          move("FINIS" /* FINIS */);
        } else {
          show("You cannot leave the boss behind. As much of a moldy old swindler he is, he is still your boss. And more importantly, who else would pay for your legs and ammo?");
        }
      }
    },
    {
      trigger: ["elevator", "lift"],
      action: () => move("ELEVA " /* ELEVA */)
    }
  ],
  look: [
    {
      trigger: ["blimp", "ship"],
      action: () => show("The boss's own ride, always kept prepared to depart in case of emergency. Surprising foresight from the guy who would chop up his own workforce, but then who are you to question it? The ship's reflectors glare back at you in anticipation. It calls out to you to command it.")
    },
    {
      trigger: ["storm", "clouds"],
      action: () => show("The Farms had seen some strong weather before, but nothing like this. If you were superstitious, you'd think this isn't a normal storm, rather the work of magic, but not even that Abe guy could have conjured all this up alone. Did he not work alone?")
    }
  ]
});
var description11 = (flags) => `You've finally reached the landing strip. Plumes of smoke gather into dark clouds above you, yet this time not from the smokestacks, rather from the many gaping wounds of the building. Beyond the quiet crackling of distant fires, it is eerily quiet. The silence is only broken by the occasional flash of lightning, followed by roaring thunderclaps. It's been hours since that Abe guy messed everything up and yet the *storm* rages on. Only without any rain to extinguish the flames.
A solitary *blimp* sits on the runway.
You feel a strange sense of finality being here. If you leave now, there will never be another opportunity to deal with any unfinished business here. There still seems to be enough power in the *elevator* leading back into the crumbling facility, if you wanted to go back.`;
var strip = new Room({}, actions12, description11);

// rooms/finis.ts
var actions13 = (flags) => ({});
var description12 = (flags) => {
  const gotHat = GM.hasItem("pilot cap" /* HAT */);
  const allDeaths = GM.deaths.size >= 7 /* __LENGTH */;
  const deathOptions = [
    [3 /* ABYSS */, "You answered the call of the abyss."],
    [2 /* BOILER */, "You could not outrun fire."],
    [0 /* BREW */, "Abstinence would have been a virtue."],
    [5 /* FUZZLE */, "Do not heckle dangerous animals."],
    [6 /* GAS */, "What gas around comes around."],
    [1 /* GUN */, "You went out with a bang."],
    [4 /* MEATSAW */, "RuptureFarms's newest product: Slig Chops."]
  ];
  const deaths = deathOptions.map(([type, msg]) => `- ${DEATH[type]}: ${GM.deaths.has(type) ? msg : "???"}`).join("\n");
  const SHORTEST_PATH_WITH_CAP = 42;
  const SHORTEST_PATH = SHORTEST_PATH_WITH_CAP - 2;
  const SHORTEST = gotHat ? SHORTEST_PATH_WITH_CAP : SHORTEST_PATH;
  const pathMsg = GM.stepCounter < SHORTEST ? "Impressive. You've managed to beat the developer's shortest path. Please tell me how you did it." : GM.stepCounter === SHORTEST ? "Well done. You didn't bother looking at stuff or immersing yourself in the environment. You just blitzed through the entire game with fearsome efficiency, matching the developer's own final score." : `If you're up to the challenge, try finishing the game in ${SHORTEST} actions or less.`;
  return `You don't waste any time dropping the boss onto a nearby couch and then jumping into the pilot seat yourself. It takes the blimp's engine a few attempts to finally kick in, but after a while you slowly feel the machine lift away from the roof and ascend into the sky. As you glance back, you realize you couldn't have taken off at a better moment. The second your craft cleared the runway, the roof began to collapse into itself, the sinkhole promptly swallowing a metric ton of concrete, before vomiting back a mixture of dust and black smoke.
You gulp a little and decide to look away instead. To steel your resolve, you think about all the ways you and the boss will 'pay' back all the misery that Abe guy had caused you. You chuckle a little. Next time it won't be anything as simple as a meatsaw. Yet, as much as you're trying to distract yourself with morbidity, you can still hardly believe you've managed to survive.
${gotHat ? "You glance up at the cap sitting proudly on your head and take a deep breath, allowing much of the stress to evaporate from your body. For the first time in a long time, you feel a bit optimistic all of the sudden. You're not even sure why, but you feel like things are gonna get better." : "You can't entirely calm yourself. You frown a little. Something seems to be missing. You'll be fine, but you feel a bit of hollowness. Perhaps you've left something back you weren't supposed to?"}
With your course set, you lean back and close your eyes. It's been an awful day. As the ruins of your former home slowly disappear behind the horizon, you hear the boss groan and sputter. His single remaining eye pierces your soul as he demands to know what happened. You stand up and ask him to stay sitting. That way it'll be easier to take the news. You've survived RuptureFarms... surely you'll survive him too.

*Total steps taken: ${GM.stepCounter}.*
${pathMsg}

*DEATHS: ${GM.deaths.size} / ${7 /* __LENGTH */}*
${allDeaths ? "Congrats, you're a master at not staying alive!" : "Hmm, seems like you missed some opportunities to get an early severance package."}
${deaths}

*You finished the game. Thank you for playing!*`;
};
var finis = new Room({}, actions13, description12);

// roomlist.ts
var rooms = /* @__PURE__ */ new Map([
  ["BOILA " /* BOILA */, boila],
  ["CORRA " /* CORRA */, corra],
  ["CORRB " /* CORRB */, corrb],
  ["ELEVA " /* ELEVA */, eleva],
  ["GASRE " /* GASRE */, gasre],
  ["GCTRL " /* GCTRL */, gctrl],
  ["LOUNG " /* LOUNG */, loung],
  ["SECUR " /* SECUR */, secur],
  ["SPAWN " /* SPAWN */, room],
  ["STRIP " /* STRIP */, strip],
  ["STORG " /* STORG */, storg],
  ["FINIS" /* FINIS */, finis],
  ["DEATH" /* DEATH */, death]
]);

// main.ts
GM.currentRoom = rooms.get("SPAWN " /* SPAWN */);
function act(str) {
  show(str, true);
  GM.currentRoom?.doAction(str);
  GM.stepCounter++;
}
var title = String.raw`
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
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const form = document.getElementById("act");
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
  show("You take a ragged breath as you suddenly come to. Even before having a second to open your eyes, stimuli already began bombarding your mind. You feel your body press against something deathly cold. Your head is screaming at you with an ache worse than during your wildest hangovers. Something next to you screeches incessantly, like a thousand nails scraping on metal. And, last but not least, your entire being is in pain, like you were just beaten to an inch of your life.\nYou groan and blindly grope around, trying to find something to grab in an attempt to stabilize your spinning head. Slowly the nausea retracts just enough for you to attempt standing up, but despite several valiant attempts, you keep tumbling back like a helpless, overturned bug. The diagnosis is clear: Your legs have seized. Unfortunate and embarrassing, but it happens sometimes.\nYou reach down half-blind and fumble with the harness until you find the small reset button.\nThe machine spends a few seconds just whirring helplessly while belching poisonous fumes. You hack and wheeze as you wait, the noxious gas not helping your head in the slightest. You're just about to whack the machine in frustration when, without warning, it suddenly jerks back to life, allowing you to carefully stand back up.\nHaving finally escaped from the floor, you feel yourself well enough to figure out what's going on. You have some vague memories about what happened, but still, it'd probably be the best to first *look around*. Unless, of course, you'd rather just call out to your momma for *help*.");
});
