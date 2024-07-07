// define the sprites in our game
const player = "p";
const box = "b";
const goal = "g";
const wall = "w";
const bg ="z"
const t1 = "1"
const t2 = "2"
const t3 = "3"
const t4 = "4"
const melody = tune`
500: B4~500 + E5/500,
500,
500: D5~500 + G4~500 + B4-500,
500,
500: B4~500 + E4~500,
500: B5-500 + E5^500,
500: C5~500,
500: F4~500,
500: C5~500,
500: C4-500,
500: G4~500 + E4~500,
500: C5~500,
500: E5/500,
500: B4~500,
500: D5^500,
500: E4~500 + A5-500,
500: A4~500,
500: C4-500,
500: D4~500,
500: A4~500 + D5^500,
500: G5~500 + E5/500,
500,
500: A4~500,
500: C4~500,
500: B5~500 + E5/500 + F4-500 + B4^500,
500: G4~500,
500,
500: B4~500,
500: A5~500 + E4~500 + C5-500,
500,
500: A4^500,
500: D5~500 + B4/500`



// assign bitmap art to each sprite
setLegend(
  [ player, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000033333300000
0000333333330000
0003330330333000
0033332332333300
0033232332323300
0033322332233300
0033333333333300
0033333333333300
0002000000002000
0002000000002000
0002000000002000
CC020000000020CC
C33330000003333C`],
  [ box, bitmap`
................
................
................
...88888888888..
...8....8....8..
...8....8....8..
...8....8....8..
...8....8....8..
...88888888888..
...8....8....8..
...8....8....8..
...8....8....8..
...8....8....8..
...88888888888..
................
................`],
  [ goal, bitmap`
................
................
................
....444444......
...44....44.....
...4......4.....
...4.......4....
...4.......4....
...4.......4....
...44......4....
....4......4....
....44....44....
.....444444.....
................
................
................`],
  [ wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [ bg, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [ t1, bitmap`
0000000000000000
0000000000000000
0000000000000000
2000000000000000
0200000000000020
0200000000000200
0220000000000200
0020000000000200
0002000000000200
0002000200002000
0002000220002000
0002200220002000
0000202020020000
0000202022200000
0000222002200000
0000022002200000`],
  [ t2, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000220000000
0000002202200000
0000022002220000
0000220000220000
0002200000020000
0002000000202000
0002000000202000
0000200002002200
0000200002000200
0000200020000220
0000022220000020`],
  [ t3, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0022222222222000
0000000002200000
0000000002000000
0000000020000000
0000000220000000
0000002200000000
0000002000000000
0000022000000000
0000020000000000
0000220000000000
0022222222222000`],
  [ t4, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000222220000000
0002200022000000
0002000002000000
0020000002000000
0020020022000000
0020002200000000
0020000000000000
0002000000000000
0002000000000000
0002200000000000
0000220000000000
0000002220022000`],
  
);

// create game levels
let level = 0; // this tracks the level we are on
const levels = [
  map`
1234
wwww`,
  map`
wzz
zpz
zzg`,
  map`
p.wg
.bw.
..w.
..w.`,
  map`
p...
...b
...b
.bbg`,
  map`
...
.p.
...`,
  map`
p.w.
.bwg
....
..bg`
];

// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([ player, box, wall ]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({
  [player]: []
});

//title screen
const playback = playTune(melody, Infinity)
addText("Press I to start", { 
  x: 2,
  y: 13,
  color: color`1`
})
onInput("i", () => {
  level = 0,
  clearText(),
  playback.end()
});




// inputs for player movement control
onInput("s", () => {
  getFirst(player).y += 1; // positive y is downwards
});
onInput("w", () => {
  getFirst(player).y -= 1;
});
onInput("d", () => {
  getFirst(player).x += 1;
});
onInput("a", () => {
  getFirst(player).x -= 1;
});
// input to reset level
onInput("j", () => {
  const currentLevel = levels[level]; // get the original map of the level

  // make sure the level exists before we load it
  if (currentLevel !== undefined) {
    clearText("");
    setMap(currentLevel);
  }
});


// these get run after every input
afterInput(() => {
  // count the number of tiles with goals
  const targetNumber = tilesWith(goal).length;
  
  // count the number of tiles with goals and boxes
  const numberCovered = tilesWith(goal, box).length;

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  if (numberCovered === targetNumber) {
    // increase the current level number
    level = level + 1;

    const currentLevel = levels[level];

    // make sure the level exists and if so set the map
    // otherwise, we have finished the last level, there is no level
    // after the last level
    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
});
