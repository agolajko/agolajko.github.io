const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");


const COL = COLUMN = 10; //number of columns
const ROW = 20; //numbr of rows
const SQ= squaresize = 20;
const VACANT = "WHITE";

// make a square
// draws a square filled with a color
// and with borders
function drawSquare(x,y,color){
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ, y*SQ, SQ,SQ);

  ctx.strokeStyle = "BLACK";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x*SQ, y*SQ, SQ,SQ);
}

// create a  board
// the board is a simple matrix with rows and columns

let board = [];
for (r=0; r<ROW; r++){
  board[r] =[];
  for (c=0;c< COL; c++){
    board[r][c]= VACANT;
  }
}

// draw the board
// here I draw the board (the matrix) using squares
// squares are the same color as the color entry of the board
function drawBoard(){
  for(r=0; r<ROW; r++){
    for(c=0; c < COL; c++){
      drawSquare(c,r,board[r][c]);
    }
  }
}

drawBoard();

// the pieces
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// generate a random piece out of our list of options
// make a new piece from the above list of values
// this will be matched with the existing list of tetrominos
function randomPiece(){
  let r = randomN = Math.floor(Math.random() * PIECES.length )
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();


// the object piece
//in what order do I want to have the Piece fn and the randomPiece fn?

// deinfes what a Piece is
function Piece(tetromino, color){
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; // set the base defined tetromino at the start
  // find this tetromino from the list
  this.activeTetromino = this.tetromino[this.tetrominoN];

// set position above the board in the centre
  this.x=3;
  this.y=-2;
}



// fil function

Piece.prototype.fill = function(color){
  for(r=0;r<this.activeTetromino.length ; r++){
    for(c=0; c<this.activeTetromino.length; c++){
      if(this.activeTetromino[r][c]){
        drawSquare(this.x + c, this.y+r, color);
      }
    }
  }
}

// the draw function
// applie the above defined function .fill to make a piece with given color
Piece.prototype.draw = function(){
  this.fill(this.color);
}

// the undraw funtion
// draws the same piece but with no color
Piece.prototype.unDraw = function(){
  this.fill(VACANT);
}

// test for collision
// if there is no collision under the piece it will move it down
Piece.prototype.moveDown = function(){
  if(!this.collision(0,1,this.activeTetromino)){
    this.unDraw();
    this.y++;
    this.draw();
  }
  else{
    // this is when the piece is at the bottom
    this.lock();
    p = randomPiece();
  }
}

// move the pice right
Piece.prototype.moveRight = function(){
  if(!this.collision(1,0,this.activeTetromino)){
    this.unDraw();
    this.x++;
    this.draw();
  }
}

// move the pice left
Piece.prototype.moveLeft = function(){
  if(!this.collision(-1,0,this.activeTetromino)){
    this.unDraw();
    this.x--;
    this.draw();
  }
}

// rotate the  piece

Piece.prototype.rotate = function(){
  // finds the pattern I want to use after rotation
  let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
  let kick = 0;

  // checks for collions first on the right wall and then on the left wall
  // if there is a collision it will move the piece by 1
  if(this.collision(0,0,nextPattern)){
    if(this.x > COL/2){
      // the piece is on the right wall
      kick = -1; //move to the left
    }
    else {
      //it's the left wall
      kick = 1;
    }
  }
  // if there is no collision after moving the block by the above defined amount
  // it will redraw the block after rotation
  if(!this.collision(kick,0,nextPattern)){
    this.unDraw();
    this.x+= kick;
    this.tetrominoN = (this.tetrominoN +1 )%this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}

let score =0;

Piece.prototype.lock = function(){
  for(r=0;r<this.activeTetromino.length ; r++){
    for(c=0; c<this.activeTetromino.length; c++){
      if(!this.activeTetromino[r][c]){
        continue;
      }

      // if the current piece is above  the board, game over
    if(this.y + r <0){
      alert("Game over");
      gameOver = true;
      break;
    }
    // make the current occupied squares in the bord the same color as the tetromino
    // meaning after the piece is in place, the board will take it's color
    board[this.y+r][this.x+c] = this.color;
    }
  }
  // remove full rows
  for(r=0; r<ROW; r++){
    let isRowFull = true;
    for(c=0; c<COL; c++){
      // loop over all rows and then columns
      // and for a row that has all columns full mark it as full
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if(isRowFull){
      // take all the rows above the given roww that is isRowFull
      // and decrease their row value by a single value
      for(y=r; y>1; y--){
        for(c=0; c<COL; c++){

          // move the entries down by a single row value
          board[y][c] =  board[y-1][c];
        }
      }
      // as teh top row has no rows above, mark these as VACANT
      for(c=0; c< COL; c++){
        board[0][c] = VACANT;
      }
      // and increment score as an empty row is the goal
      score += 10;
    }

  }
  // redraw the updated board
  drawBoard();

  // print new score
  scoreElement.innerHTML = score;
}

// collision function
// what is this?: it checks for a collision
// with the existing pieces or the wall
Piece.prototype.collision = function(x,y,piece){
  for(r=0; r<piece.length; r++){
    for(c=0; c<piece.length; c++){
      // if the square is empty skip it
      if(!piece[r][c]){
        continue;
      }
      // coordinates of the pice after movement
      // want to find if there are values of the square that will be
      // in an illegal position after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // conditions
      // if to the left, to the right or too low the piece is colliding
      if(newX < 0 || newX >= COL || newY >= ROW){
        return true;
      }

      // skip newY <0
      // what is this?
      // ellucidating that if the piece is high, that is still ok
      if(newY<0){
        continue;
      }
      // is there a locked piece in place?
      // checks if at the new position there is already a piece it could collide with
      if(board[newY][newX] != VACANT){
        return true;
      }
    }
  }
  // otherwise it will return false, meaning there is no collision
  return false;
}

// control the piece

document.addEventListener("keydown", CONTROL);
//this starts thge control fn

function CONTROL(event){
  if(event.keyCode == 37){
    p.moveLeft();
    dropStart = Date.now();
  }
  else if(event.keyCode == 38){
    p.rotate();
    dropStart = Date.now();
  }
  else if(event.keyCode == 39){
    p.moveRight();
    dropStart = Date.now();
  }
  else if(event.keyCode == 40){
    p.moveDown();
  }
}

// drop the piece every second

let dropStart = Date.now();
let gameOver = false;
function drop(){
  let now = Date.now();
  let delta= now - dropStart;
  let speed_up = 1000;
  speed_up = speed_up - score * 8; 
  if(delta> speed_up){
    p.moveDown();
    dropStart = Date.now();

  }
  if (!gameOver){
    requestAnimationFrame(drop);

  }
}

drop();
