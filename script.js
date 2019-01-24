const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.scale(20, 20);

function arenaSweep() {
  //console.log('arenaSweep');
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

// run on every change position
function collide(arena, player) {
  //console.log('collide:');
  const m = player.matrix;
  //console.log('collide:',m);
  const o = player.pos;
  //console.log('collide:',o);

  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      //console.log('m[y][x]: ',m[y][x]);
      // what if make 1 transparent?
      //console.log('sum: ',arena[y + o.y] && arena[y + o.y][x + o.x]);
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {

        if (arena[y + o.y] && arena[y + o.y][x + o.x] === 1) {
          const type = 1;
          eatEarth(arena, player, type);
          return false;
        } else if (arena[y + o.y] && arena[y + o.y][x + o.x] === 2) {
          const type = 2;
          eatEarth(arena, player, type);
          return false;
        } else if (arena[y + o.y] && arena[y + o.y][x + o.x] === 3) {
          // const type = 3;
					// eatEarth(arena, player, type);
					//console.log('3*', player.pos.y, player.pos.x);
					// if (arena[y + 1][x] = 3) {
          //   arena[y + 1][x] === 5;
          // }
          return pullRock();
        } else {
          //console.log('collide!');	
          return true;
        }
      }

      // if (
      // 	// basic logic
      // 	(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) 
      // 	) {
      // 		return true;
      // }
    }
  }
  return false;
}

function eatEarth(arena, player, type) {
  //console.log('eat EARTH!');
  //console.log('ZRAT!:)',type );

  const x = player.pos.x;
  const y = player.pos.y;

  if (type === 1) {
    // change to 0 
		arena[y][x] = 0;
		//console.log(player.pos.x, player.pos.y)

		//arena[player.pos.y][player.pos.x] = 5;
  }

  if (type === 2) {
    // change to 0 
    arena[y][x] = 0;
    // 
    console.log('YA SOJRAL YABLOKO!');
    player.score = player.score + 1;
    updateScore();
  }
  //console.log(arena[x][y]);
}

function pullRock() {
	//console.log('pullRock(); ');

	const y = player.pos.y;
	const x = player.pos.x;
	//console.log('3*', player.pos.y, player.pos.x);

	// if (previousPos.x === x) {
	// 	console.log('x');
	// }

	if (previousPos.y === y) {
		//console.log('horizontal');
		if ((arena[y][x + 1] === 5)) {
			//console.log('from rigth');
			if (arena[y][x - 1] === 0) {
				//console.log(arena[y][x + 2]);
				//console.log('can move');
				arena[y][x - 1] = 3;
				arena[y][x] = 0;
				player.pos.y = y;
				player.pos.x = x - 1;
			}
		} else {
			//console.log('from left');
			if (arena[y][x + 1] === 0) {
				//console.log(arena[y][x + 2]);
				//console.log('can move');
				arena[y][x + 1] = 3;
				arena[y][x] = 0;
				player.pos.y = y;
				player.pos.x = x + 1;
			}
		}
	}
	return true;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  //console.log('createPiece type: ', type);

  return [
    [5],
  ];
}
// function createPiece(type)
// {
//     if (type === 'I') {
//         return [
//             [0, 1, 0, 0],
//             [0, 1, 0, 0],
//             [0, 1, 0, 0],
//             [0, 1, 0, 0],
//         ];
//     } else if (type === 'L') {
//         return [
//             [0, 2, 0],
//             [0, 2, 0],
//             [0, 2, 2],
//         ];
//     } else if (type === 'J') {
//         return [
//             [0, 3, 0],
//             [0, 3, 0],
//             [3, 3, 0],
//         ];
//     } else if (type === 'O') {
//         return [
//             [4, 4],
//             [4, 4],
//         ];
//     } else if (type === 'Z') {
//         return [
//             [5, 5, 0],
//             [0, 5, 5],
//             [0, 0, 0],
//         ];
//     } else if (type === 'S') {
//         return [
//             [0, 6, 6],
//             [6, 6, 0],
//             [0, 0, 0],
//         ];
//     } else if (type === 'T') {
//         return [
//             [0, 7, 0],
//             [7, 7, 7],
//             [0, 0, 0],
//         ];
//     }
// }

function drawMatrix(matrix, offset) {
  //console.log('drawMatrix');
  matrix.forEach((row, y) => {

    //console.log(row);

    row.forEach((value, x) => {
      if (value !== 0) {

        context.fillStyle = colors[value];
        //console.log(' colors[value]',value);

        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
//
function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {
    x: 0,
    y: 0
  });
  drawMatrix(player.matrix, player.pos);
}

// some create map
const obstacle = [
  [1, 2, 4, 3, 3, 3, 1, 2, 2, 4],
  [1, 4, 4, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 4, 4, 4],
  [1, 1, 1, 1, 4, 1, 3, 1, 1, 1],
  [1, 1, 1, 1, 4, 1, 3, 1, 1, 1],
  [2, 4, 4, 4, 4, 1, 3, 1, 1, 1],
  [3, 0, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 3, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 3, 0, 1, 1, 1]
];
// const obstacle = [
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0]
 
// ];
// const obstacle = [
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 3, 0, 0, 0, 0]
 
// ];
//merge arena with obstacle
function merge2(arena, obstacle) {
  //console.log('merge2');
  //console.log('obstacle.matrix: ',obstacle);

  obstacle.forEach((row, y) => {
    //console.log('1', row, y);
    row.forEach((value, x) => {
      //console.log('2', value, x);
      if (value !== 0) {
        //console.log('+',y,x);
        // y,x this is coordonates where to put obstacle
        //arena[y + player.pos.y][x + player.pos.x] = value;
        arena[y][x] = value;
      }
    });
  });
}

// work when element is freezes
function merge(arena, player) {
  //console.log('merge',arena, player);
  //console.log('player.matrix: ', player.matrix);
  player.matrix.forEach((row, y) => {
    // console.log('1', row, y);
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// function rotate(matrix, dir) {
//     for (let y = 0; y < matrix.length; ++y) {
//         for (let x = 0; x < y; ++x) {
//             [
//                 matrix[x][y],
//                 matrix[y][x],
//             ] = [
//                 matrix[y][x],
//                 matrix[x][y],
//             ];
//         }
//     }

//     if (dir > 0) {
//         matrix.forEach(row => row.reverse());
//     } else {
//         matrix.reverse();
//     }
// }

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
        //get all rocks that no londer move
        // if ((arena[y][x] === 4) && ((arena[y + 1][x] === 0))) {
        //   const obj = {x: x, y: y};
        //   arrHit.push(obj);
        // }
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
            // else if (playerMove(arena, player) === 4) {
            //   // drop
            //   arena[y + 1][x] = 6;
            //   //arena[y + 1][x] = 6;
            // }

            // if (arena[y + 1][x] === 3) {
            //   arena[y][x] = 4;
            // }
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
            
            //console.log('arena[y][x]: ',y);

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
               } //else if (arena[y + 1][x] === 5) {
              //   arena[y][x] = 0;
              //   console.log(arena);
              // }  
              // check if there no space around:
              if (
                // check logic :)
                ((arena[y + 1][x - 1] !== 0) && (arena[y + 1][x + 1] !== 0)) 
                || ((arena[y][x - 1] !== 0) && (arena[y][x + 1] !== 0)) 
                || ((arena[y][x - 1] !== 0) && (arena[y + 1][x + 1] !== 0)) 
                || ((arena[y + 1][x - 1] !== 0) && (arena[y][x + 1] !== 0))
                //|| ((arena[y + 1][x] === 5)) 
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
                 } //else if (arena[y - 1][x]) {
                  
                // }
              }
              if ((arena[y + 1][x] === 5))  {
                arena[y][x] = 0;
                arena[y][x] = 6;
              }  
            }  
            // if on the ground
            if (height === y + 1) {
              //console.log(y);
              arena[y][x] = 3;
              
            }
            // if (y + 1 === 5) {
            //   arena[x][y] = 2;
            // }
          }
        })
      })
    })
  }

  dropCounter = 0;
}

let previousPos = {
	x: null,
	y: null
}

function playerMove(x, y) {
  //console.log('move: ',x, y);
  player.pos.x += x;
  player.pos.y += y;

  // logic to prevent going outside of arena
  if (collide(arena, player)) {
    player.pos.x -= x;
    player.pos.y -= y;
	} //else if (collide(arena, player) === 3) {
  //   player.pos.x = arena[x];
  //   player.pos.y = arena[y + 1];
  // }  //else if (player.pos.x = arena[x] && player.pos.y == arena[y + 1]) {
  //   player.pos.x = arena[x];
  //   player.pos.y = arena[y];
  // }
	
	if ((previousPos.x !== null)) {
		arena[previousPos.y][previousPos.x] = 0;
	}
	arena[player.pos.y][player.pos.x] =	5;	 
	previousPos.y = player.pos.y;
	previousPos.x = player.pos.x;

	//console.log('previousPos: ',previousPos);
}
// function playerMove(offset) {
//     player.pos.x += offset;
//     if (collide(arena, player)) {
//         player.pos.x -= offset;
//     }
// }

function playerReset() {
  //console.log('playerReset');
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  // start postiton of player
  player.pos.y = 9;
  player.pos.x = 9;
  //player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

// function playerRotate(dir) {
//     const pos = player.pos.x;
//     let offset = 1;
//     rotate(player.matrix, dir);
//     while (collide(arena, player)) {
//         player.pos.x += offset;
//         offset = -(offset + (offset > 0 ? 1 : -1));
//         if (offset > player.matrix[0].length) {
//             rotate(player.matrix, -dir);
//             player.pos.x = pos;
//             return;
//         }
//     }
// }

let dropCounter = 0;
let dropInterval = 20; //70

let lastTime = 0;

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

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

function changeColor() {
  //console.log(player.matrix[0][0]);

  const matrix = player.matrix;
  player.matrix[0][0] = player.matrix[0][0] + 1;

  //reset
  if (player.matrix[0][0] === 7) {
    player.matrix[0][0] = 1;
  }

}

// document.addEventListener('touchmove', event => {
//   if () {

//   }
// });

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
  } else if (event.keyCode === 67) {
    //change color:
    //console.log('change color');
    changeColor();
  } else if (event.keyCode === 73) {
    //show arena	
    console.log(arena);
  }
});

const colors = [
  null,
  '#380000',
  '#FF0D72',
  '#565656',
  '#3877FF',
  '#FF8E0D',
  '#b20000', //#FFE138
  '#3877FF',
];


const height = 10;
const width = 10;

const arena = createMatrix(height, width);

const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: null,
  score: 0,
};

merge2(arena, obstacle);

playerReset();
updateScore();
update();
