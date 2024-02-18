import { gameMap } from "./roomlist.ts";
import { DEATH_POS, Directions } from "./constants.ts";
import { player } from "./player.ts";
import { show } from "./display.ts";

export const setRoom = (pos: [number, number], keepHistory = true) => {
  if (pos[0] < 0 || pos[1] < 0) {
    show("There is no path in that direction.");
    return;
  }

  const room = gameMap.at(pos[0])?.at(pos[1]);

  if (!room) {
    show("There is no path in that direction.");
    return;
  }

  if (keepHistory) {
    player.prevPos.push([...player.position]);
  }

  player.position = pos;
  player.currentRoom = room;
  room.printDescription();
};

export function getDir(input: string) {
  const inputToDir = [
    { inputs: ["forwards", "forward", "f", "north", "n"], dir: Directions.Forward },
    { inputs: ["left", "l", "west", "w"], dir: Directions.Left },
    { inputs: ["backwards", "backward", "b", "south", "s"], dir: Directions.Backward },
    { inputs: ["right", "r", "east", "e"], dir: Directions.Right },
  ];

  return inputToDir.find(({ inputs }) => inputs.includes(input))?.dir;
}

export function moveDir(dir: Directions) {
  const dirMap = new Map<Directions, [number, number]>([
    [Directions.Forward, [-1, 0]],
    [Directions.Backward, [1, 0]],
    [Directions.Left, [0, -1]],
    [Directions.Right, [0, 1]],
  ]);

  // biome-ignore lint/style/noNonNullAssertion: All directions are initialized.
  const delta = dirMap.get(dir)!;
  const newPosition: [number, number] = [player.position[0] + delta[0], player.position[1] + delta[1]];

  setRoom(newPosition);
}

export function die() {
  setRoom(DEATH_POS);
}

export function goBack() {
  const lastPos = player.prevPos.pop();

  if (lastPos) {
    setRoom(lastPos, false);
  } else {
    show("No previous room to go back to.");
  }
}
