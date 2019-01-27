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
let dropInterval = 500;

let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    //drop();
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update);
}

function playerReset() {
  // start postiton of player
  player.pos.y = 9;
  player.pos.x = 9;
  
  // if (collide(arena, player)) {
  //   arena.forEach(row => row.fill(0));
  //   player.score = 0;
  //   updateScore();
  // }
}

// function collide: 
// if returns true you can make your move
function collide(arena, player, x, y) {
  const playerDesiredPosY = player.pos.y + y;
  const playerDesiredPosX = player.pos.x + x;

  // check limits of arena
  if ((playerDesiredPosY < 0 || playerDesiredPosY > height - 1) || (playerDesiredPosX < 0 || playerDesiredPosX > width - 1)) {
    console.log('limits of arena');
		return false;
	} else if (arena[playerDesiredPosY][playerDesiredPosX] === 3) {
    console.log('rock collide');
    return false;
  } else {
    return true;
  }
}

function playerMove(x, y) {
  if (collide(arena, player, x, y)) {
		player.pos.x += x;
		player.pos.y += y;
  } 
  
	// if ((previousPos.x !== null)) {
	// 	arena[previousPos.y][previousPos.x] = 0;
	// }
	// arena[player.pos.y][player.pos.x] =	5;	 
	// previousPos.y = player.pos.y;
	// previousPos.x = player.pos.x;
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
  }
});

const player = {
  pos: {
    x: 0,
    y: 0
  },
  matrix: [[5]],
  //score: 0,
};

// params
const map = [
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
update();