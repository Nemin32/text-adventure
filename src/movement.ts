import { gameMap, rooms } from "./roomlist.ts";
import { DEATH_POS, Directions, ROOM_NAME } from "./constants.ts";
import { player } from "./player.ts";
import { Room } from "./room.ts";
import { show } from "./display.ts";

const setRoom = (pos: [number, number], keepHistory = true) => {
  const name = gameMap.at(pos[0])?.at(pos[1])

  if (!name) {
    show("There is no path in that direction.")
    return;
  }

  if (keepHistory) {
    player.prevPos.push([...player.position]);
  }

  let room = rooms.get(name);

  if (!room) {
    show(`You tried to reach ${ROOM_NAME[name]}, but there was no room there. This is a bug. You've been transported to the spawn. Please complain to Nemin.`)
    // biome-ignore lint/style/noNonNullAssertion: The spawn always exists.
    room = rooms.get(ROOM_NAME.SPAWN)!;
  }

  player.position = pos;
  player.currentRoom = room;
  room.printDescription()
};

export function getDir(input: string) {
  const inputToDir = [
    { inputs: ["forwards", "forward", "f", "north", "n"], dir: Directions.Forward },
    { inputs: ["left", "l", "west", "w"], dir: Directions.Left },
    { inputs: ["backwards", "backward", "l", "south", "s"], dir: Directions.Backward },
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

  setRoom(newPosition)
}

export function die() {
  setRoom(DEATH_POS, false);
}

export function goBack() {
  const lastPos = player.prevPos.pop();

  if (lastPos) {
    setRoom(lastPos, false)
  } else {
    show("No previous room to go back to.")
  }
}

export function move(name: ROOM_NAME) {
  show(`Tried to move to ${ROOM_NAME[name]}.`)
}