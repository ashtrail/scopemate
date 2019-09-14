# ScopeMate

Quick scope estimation tool.

## Usage

This tiny library requires Node.js to work.

Here's an example that shows everything that can be done with ScopeMate (for the moment at least). This example is just meant as an inspiration and doesn't represent a realistic project.

Copy paste the following code in a `main.js` file and put `scopemate.js` in the same folder.

```
const { Task, Requirement, getProjectStats } = require('./scopemate')

const portrait = new Task('Portrait', 'Art', 60)
const sprite = new Task('Sprite', 'Art', 60)
const gameBackground = new Task('Game Background', 'Art', 10)

const endGameScreen = new Task('End Game Screen', 'Code', 15)

const bgmTrack = new Task('BGM Track', 'Music', 120)

const endScreen = new Requirement()
endScreen.add(gameBackground, 1)
endScreen.add(endGameScreen, 1)

const character = new Requirement()
character.add(portrait, 2) // win, lose
character.add(sprite, 1)

const game = new Requirement()
game.add(character, 2) // player, boss
game.add(bgmTrack, 3) // game, lose, win
game.add(endScreen, 2) // lose, win

console.log(JSON.stringify(getProjectStats(game), null, 2))
```

```
❯ node main.js
{
  "totalTime": "12h50m",
  "taskStats": [
    {
      "name": "Game Background",
      "type": "Art",
      "time": 10,
      "nb": 2,
      "totalTime": "20m",
      "percent": 3
    },
    {
      "name": "End Game Screen",
      "type": "Code",
      "time": 15,
      "nb": 2,
      "totalTime": "30m",
      "percent": 4
    },
    {
      "name": "Sprite",
      "type": "Art",
      "time": 60,
      "nb": 2,
      "totalTime": "2h00m",
      "percent": 16
    },
    {
      "name": "Portrait",
      "type": "Art",
      "time": 60,
      "nb": 4,
      "totalTime": "4h00m",
      "percent": 31
    },
    {
      "name": "BGM Track",
      "type": "Music",
      "time": 120,
      "nb": 3,
      "totalTime": "6h00m",
      "percent": 47
    }
  ],
  "typeStats": [
    {
      "type": "Code",
      "time": "30m",
      "percent": 4
    },
    {
      "type": "Music",
      "time": "6h00m",
      "percent": 47
    },
    {
      "type": "Art",
      "time": "6h20m",
      "percent": 49
    }
  ]
}
```
