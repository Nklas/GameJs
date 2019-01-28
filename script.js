const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.scale(20, 20);

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {
    x: 0,
    y: 0
  });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// merge arena with map
function mergeWithMap(arena, map) {
  map.forEach((row, y) => {
    row.forEach((value, x) => {
			arena[y][x] = value;
    });
  });
}

let dropCounter = 0;
let dropInterval = 20;

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
  if (dropCounter > dropInterval) {
    drop();
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update);
}

function playerReset() {
  // start postiton of player
  player.pos.y = 9;
  player.pos.x = 9;
  
  checkTerrain(player.pos.y, player.pos.x);
}

// if returns true you can make your move
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
  } else {
    //check if rock upside do not allow move down///  maybe turn off
    if (player.pos.y > 0 && y === 1 && arena[player.pos.y - 1][player.pos.x] === 3) {
      //console.log('rock up!');
      return false;
    } else {
      return true;
    }
  }
}

function playerMove(x, y) {
  //console.log('playerMove', x, y);
  if (collide(arena, player, x, y) && player.isAlive) {
		player.pos.x += x;
    player.pos.y += y;
    
    checkTerrain(player.pos.y, player.pos.x);
    arena[player.pos.y][player.pos.x] =	5;	
    arena[player.pos.y - y][player.pos.x - x] =	0;	
  } 
  
}

function checkTerrain(y, x){
  //console.log('rock up!000',  player.pos.y);
  if (arena[y][x] === 1) {
    //console.log('dig ground');
    arena[y][x] = 0;
  } else if (arena[y][x] === 2) {
    //console.log('eat apple');
    arena[y][x] = 0;
    player.score = player.score + 1;
    updateScore();
  }
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

//basic key events
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
  }
});

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

const player = {
  pos: {
    x: 0,
    y: 0
  },
  isAlive: true,
  matrix: [[5]],
  score: 0,
};



// params
const map = [
  [1, 2, 3, 3, 3, 3, 3, 2, 2, 3],
  [1, 3, 3, 1, 1, 1, 3, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 3, 3, 3, 3],
  [1, 1, 1, 1, 3, 1, 3, 1, 1, 1],
  [1, 1, 1, 1, 3, 1, 3, 1, 1, 1],
  [2, 3, 3, 3, 3, 1, 3, 1, 1, 1],
  [3, 0, 1, 0, 1, 1, 3, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1]
];

const colors = [
  null,
  '#380000',
  '#FF0D72',
  '#565656',
  '#3877FF',
  '#FF8E0D',
  '#b20000',
  '#3877FF',
];

const height = 10;
const width = 10;

const arena = createMatrix(height, width);
mergeWithMap(arena, map);
playerReset();
updateScore();
update();