import SpriteSheet from './SpriteSheet.js';
import { loadImage, loadLevel } from './loaders.js';
let SPRITES = null;
let LEVEL = null;
// function drawBackground(background, context, sprites) {
//   background.ranges.forEach(([x1, x2, y1, y2]) => {
//     for (let x = x1; x < x2; ++x) {
//       for (let y = y1; y < y2; ++y) {
//         sprites.drawTile(background.tile, context, x, y);
//       }
//     }
//   });
// }

// const arena = [
//   [0, 0, 1, 0],
//   [1, 1, 1, 0],
//   [0, 0, 1, 0],
//   [0, 0, 1, 0]
// ]
window.addEventListener('load', () => {
  const arena = [
    [1, 2, 3, 3, 3, 3, 3, 2, 2, 3],
    [1, 3, 3, 1, 1, 1, 3, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 3, 3, 3, 3],
    [1, 1, 1, 1, 3, 1, 3, 1, 1, 1],
    [1, 1, 1, 1, 3, 1, 3, 1, 1, 1],
    [2, 3, 3, 3, 3, 1, 3, 1, 1, 1],
    [3, 0, 1, 0, 1, 1, 3, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0]
  ];

  let dropCounter = 0;
  let dropInterval = 1000;

  let lastTime = 0;

  function drop() {
    const arr = [];
    const arrHit = [];
  
    // create object for every 3* that is must fall
    arena.forEach((row, y) => {
      row.forEach((value, x) => {
        if (height > y + 1) {
          //get all rocks without ground
          if ((arena[y][x] === 3) && ( arena[y + 1][x] === 0)) {
            const obj = {x: x, y: y};
            arr.push(obj);
          }
        }
        //get all rocks in move
        if (arena[y][x] === 4) {
          const obj = {x: x, y: y};
          arrHit.push(obj);
        }
      })
    })
  
    //console.log('arr: ', arr.length);
    //console.log('arrHit: ', arrHit.length);
    // check if there any falling* rocks
    //console.log('arr: ', arr.length);
    if (arr.length > 0) {
      arena.forEach((row, y) => {
        row.forEach((value, x) => {
          arr.forEach((item, index) => {
            if ((item.y === y) && (item.x === x)) {
              //checking start  
              if (arena[y + 1][x] === 0) {
                // drop
                arena[y][x] = 0;
                arena[y + 1][x] = 4;
              }
            }
          })
        })
      })
    }
  
    //console.log('arrHit: ', arrHit.length);
    if (arrHit.length > 0) {
      arena.forEach((row, y) => {
        row.forEach((value, x) => {
          arrHit.forEach((item, index) => {
            if ((item.y === y) && (item.x === x)) {
              //checking if it ground
              // if there place to fall down
              if ((height > y + 1) && (arena[y + 1][x] === 0)) {
                // drop
                arena[y][x] = 0;
                arena[y + 1][x] = 4;
              } 
              // if hit something
              else if ((height > y + 1) && (arena[y + 1][x] !== 0)) {
                //console.log('hit');
                // if hit no rock
                if (arena[y + 1][x] !== 3) {
                  //console.log('hit noRock');
                  arena[y][x] = 3;
                 }
                // check if there no space around:
                if (
                  ((arena[y + 1][x - 1] !== 0) && (arena[y + 1][x + 1] !== 0)) 
                  || ((arena[y][x - 1] !== 0) && (arena[y][x + 1] !== 0)) 
                  || ((arena[y][x - 1] !== 0) && (arena[y + 1][x + 1] !== 0)) 
                  || ((arena[y + 1][x - 1] !== 0) && (arena[y][x + 1] !== 0))
                ) {
                  //console.log('END of fall'); 
                  arena[y][x] = 3;
                }
                // if it rock or not?
                if ((arena[y + 1][x] === 3))  {
                  //console.log('hit rock');
                  // check space around:
                  if ((arena[y][x - 1] === 0) && (arena[y + 1][x - 1] === 0) && (arena[y][x + 1] === 0) && (arena[y + 1][x + 1] === 0)) {
                    //console.log('both'); 
                    let chance = Math.floor(Math.random() * 2);
                    if (chance === 1) {
                      arena[y][x] = 0;
                      arena[y + 1][x + 1] = 4;
                    } else {
                      arena[y][x] = 0;
                      arena[y + 1][x - 1] = 4;
                    } 
                  } else if ((arena[y][x - 1] === 0) && (arena[y + 1][x - 1] === 0)) {
                    //console.log('left'); 
                    arena[y][x] = 0;
                    arena[y + 1][x - 1] = 4;
                  } else if ((arena[y][x + 1] === 0) && (arena[y + 1][x + 1] === 0)) {
                    //console.log('right'); 
                    arena[y][x] = 0;
                    arena[y + 1][x + 1] = 4;
                  } else if (arena[y + 1][x] === 4) {
                    arena[x][y] = 2;
                   }
                }
  
              }  
  
              // // if rock hit player
              if ((player.pos.y > 0) && (arena[player.pos.y - 1][player.pos.x] === 4)) {
                console.log('DEATH');
                player.matrix = [[6]];
                player.isAlive = false;
              }
  
              // if on the ground
              if (height === y + 1) {
                //console.log(y);
                arena[y][x] = 3;
              }
            }
          })
        })
      })
    }
  
    dropCounter = 0;
  }

  function update(time = 0) {
    const deltaTime = time - lastTime;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval && !editMode) {
      console.log('UPDATE');
      drop();
    }
  
    lastTime = time;
    reload(SPRITES, LEVEL);
    //getSprites();
    requestAnimationFrame(update);
  }
  
  function drawBackground(background, context, sprites) {
    arena.forEach((row, x) => {
      row.forEach((item, y) => {
        if (arena[y][x] === 0) {
          sprites.drawTile('sky', context, x, y);
        } else if (arena[y][x] === 1) {
          sprites.drawTile('ground', context, x, y);
        } else if (arena[y][x] === 2) {
          sprites.drawTile('apples', context, x, y);
        } else if (arena[y][x] === 3) {
          sprites.drawTile('stones', context, x, y);
        } else if (arena[y][x] === 5) {
          sprites.drawTile('player', context, x, y);
        }
      })
    })
  }
  
  function loadBackgroundSprites() {
    return loadImage('./image/tile.png')
    .then(image => {
      console.log('load image...');
      const sprites = new SpriteSheet(image, 16, 16);
      //define sprite here
      sprites.define('ground', 0, 0)
      sprites.define('sky', 3, 23)
      sprites.define('apples', 13, 12)
      sprites.define('stones', 0, 4)
      sprites.define('player', 0, 6)
      return sprites;
    });  
  }
  
  const canvas = document.getElementById('screen');
  const context = canvas.getContext('2d');
  context.scale(2, 2);
  
  // Promise.all([
  //   loadBackgroundSprites(),
  //   loadLevel('1')
  // ])
  // .then(([sprites, level]) => {
  //   level.backgrounds.forEach(background => {
  //     drawBackground(background, context, sprites);
  //   });
  // });
  
  ////hardcode

  
  function reload(sprites, level) {
    //console.log('reload');
    level.backgrounds.forEach(background => {
      drawBackground(background, context, sprites);
    });
  }
  function getSprites() {
    Promise.all([
      loadBackgroundSprites(),
      loadLevel('1')
    ])
    .then(([sprites, level]) => {
      //console.log(sprites);
      //console.log(level);
      SPRITES = sprites;
      LEVEL = level;
      reload(SPRITES, LEVEL);
    });
  
  }
  
  
  function pullRock(y, x) {
    // if horizontal move
    if (x !== 0) {
      if (x === 1) {
        if (arena[player.pos.y][player.pos.x + 2] === 0) {
          //console.log('pull rigth');
          arena[player.pos.y][player.pos.x + 2] = 3;
          arena[player.pos.y][player.pos.x + 1] = 5;
          arena[player.pos.y][player.pos.x] = 0;
          player.pos.x += 1;
        }  
      } else {
        if (arena[player.pos.y][player.pos.x - 2] === 0) {
          //console.log('pull left');
          arena[player.pos.y][player.pos.x - 2] = 3;
          arena[player.pos.y][player.pos.x - 1] = 5;
          arena[player.pos.y][player.pos.x] = 0;
          player.pos.x -= 1;
        } 
      }
    }
  }
  
  function collide(arena, player, x, y) {
    const playerDesiredPosY = player.pos.y + y;
    const playerDesiredPosX = player.pos.x + x;
  
    // check limits of arena
    if ((playerDesiredPosY < 0 || playerDesiredPosY > height - 1) || (playerDesiredPosX < 0 || playerDesiredPosX > width - 1)) {
      //console.log('limits of arena');
      return false;
    } else if (arena[playerDesiredPosY][playerDesiredPosX] === 3) {
      //console.log('rock collide');
      pullRock(y, x);
      return false;
    } else if (
      arena[playerDesiredPosY][playerDesiredPosX] === 4 ||
      arena[playerDesiredPosY][playerDesiredPosX] === 5 ||
      arena[playerDesiredPosY][playerDesiredPosX] === 7 
      // arena[playerDesiredPosY][playerDesiredPosX] === 4 ||
    ) {
      return false;
    } else {
      //check if rock upside do not allow move down///  maybe turn off
      // if (player.pos.y > 0 && y === 1 && arena[player.pos.y - 1][player.pos.x] === 3) {
      //   //console.log('rock up!');
      //   return false;
      // } 
      // else {
        return true;
      //}
    }
  }
  
  function playerMove(x, y) {
    //console.log('playerMove', x, y);
    //console.log('player 159: ', player);
    if (editMode) {
      player.pos.x += x;
      player.pos.y += y;
    } else if (collide(arena, player, x, y) && player.isAlive) {
      //console.log('player in edit mode before: ', player);
      player.pos.x += x;
      player.pos.y += y;
      //console.log('player: ', player);
      checkTerrain(player.pos.y, player.pos.x, y, x);
    } 
    //console.log('sprites: ', SPRITES);
    //console.log('level: ', LEVEL);
    reload(SPRITES, LEVEL);
  }
  
  function playerReset() {
    // start postiton of player
    player.pos.y = 9;
    player.pos.x = 9;
  
    function countApple() { 
      arena.forEach((row, y) => {
        row.forEach((value, x) => {
            if (arena[y][x] === 2) {
              appleCount += 1;
            }
        })
      })
      console.log(appleCount);
    }
    countApple();
    
    checkTerrain(player.pos.y, player.pos.x);
  }
  
  function checkTerrain(posY, posX, y, x){
    //console.log('checkTerrain',posY, posX, y, x);
  
    if (y === undefined || x === undefined) {
      y = 0;
      x = 0;
    }
  
    if (arena[posY][posX] === 1) {
      //console.log('dig ground');
      arena[posY][posX] = 5;
      arena[posY - y][posX - x] = 0;
    } else if (arena[posY][posX] === 2) {
      //console.log('eat apple');
      arena[posY][posX] = 5;
      arena[posY - y][posX - x] = 0;
      player.score = player.score + 1;
      updateScore();	
    } else if (initMode) {
      arena[posY][posX] = 5;
      initMode = false;
    } else {
      //console.log('something happens');
      arena[posY][posX] = 5;
      arena[posY - y][posX - x] = 0;
    }
  }
  
  function merge(arena, player) {
    //console.log('merge',arena, player);
    //console.log('player.matrix: ', player.matrix);
    player.matrix.forEach((row, y) => {
      // console.log('1', row, y);
      row.forEach((value, x) => {
        //console.log('value',value);
        arena[player.pos.y][player.pos.x] = value;  
        // if (value !== 0) {
        //   arena[y + player.pos.y][x + player.pos.x] = value;
        // }
      });
    });
  }
  
  document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
      //left
      playerMove(-1, 0);
    } else if (event.keyCode === 39) {
      // rigth
      playerMove(1, 0);
    } else if (event.keyCode === 40) {
      // down
      playerMove(0, 1);
    } else if (event.keyCode === 38) {
      // up
      playerMove(0, -1);
    } else if (event.keyCode === 32) {
      //create fingerprint*	
      console.log('f');
      merge(arena, player);
      //arenaSweep();
    } else if (event.keyCode === 73) {
      //show arena	
      console.log(arena);
    }
  });
  
  function updateScore() {
    if (appleCount === player.score) {
      console.log("You are win!!!!!")
    }
  
    //document.getElementById('score').innerText = player.score;
  }
  
  let appleCount = 0;
  
  const editMode = false;
  let initMode = true;
  const height = 10;
  const width = 10;
  
  const player = {
    pos: {
      x: 0,
      y: 0
    },
    isAlive: true,
    matrix: [[5]],
    score: 0,
  };
  getSprites();
  playerReset();
  update();

 // playerMove(1, 0);
});
