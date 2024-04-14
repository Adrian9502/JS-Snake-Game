document.addEventListener("DOMContentLoaded", (event) => {
  const startBtn = document.querySelector(".start-button");
  const highScoreText = document.getElementById("high-score");

  const gameBoard = document.querySelector("#game-board");
  const ctx = gameBoard.getContext("2d");
  const scoreText = document.querySelector("#scoreText");
  const resetBtn = document.querySelector("#reset-button");

  const gameWidth = gameBoard.width;
  const gameHeight = gameBoard.height;

  const boardBackground = "rgb(3, 103, 0)";
  const snakeColor = "skyblue";
  const foodColor = "red";


  // snake size
  const unitSize = 25;
  let running = false;
  let xVelocity = unitSize;
  let yVelocity = 0;
  let foodX;
  let foodY;
  let score = 0;
  let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

  // Event listener for changing direction when arrow keys and A,W,S,D letters are pressed
  window.addEventListener("keydown", changeDirection);
  // Event listener for clicking the reset button
  resetBtn.addEventListener("click", resetGame);

  // Event listener for clicking the start button
  startBtn.addEventListener("click", ()=>{
    if(!running){
      gameStart();
    }else return;
  });
  // Retrieve the high score from localStorage, or set to default to 0
  let highScore = localStorage.getItem("highScore") || 0;

  // call the function to display the text
  displayStart();
  highScoreText.textContent = highScore;
  // display text before game start
  function displayStart() {
    ctx.font = "23px 'Press Start 2P'";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("Press Start to begin!", gameWidth / 2, gameHeight / 2);
  }
  // start the game
  function gameStart() {
    running = true;
    scoreText.textContent = 0;
    createFood();
    drawFood();
    nextTick();
  }
  // execute the game logic in each tick
  function nextTick() {
    if (running) {
      const timeoutDuration = Math.max(50, 100 - score * 2);
      setTimeout(() => {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        nextTick();
      }, timeoutDuration);
    } else {
      displayGameOver();
    }
  }
  // clear the game board
  function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }
  // create food randomly using math.random
  function createFood() {
    function randomFood(min, max) {
      const randNum =
        Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
      return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
  }
  // set color of food which is red
  function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
  }
  // move the snake
  function moveSnake() {
    // Calculate the new position of the snake's head based on velocity
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if the snake's head has reached the food
    if (snake[0].x == foodX && snake[0].y == foodY) {
      // Increase the score and update the score display and make food randomly again
      score += 1;
      scoreText.textContent = score;
      createFood();
      // If the snake's head did not reach the food, remove the last element of the snake (its tail)
    } else {
      snake.pop();
    }
  }
  // draw the snake on the canvas
  function drawSnake() {
    // Set the fill style to the snake color
    ctx.fillStyle = snakeColor;
    // Loop through each part of the snake
    snake.forEach((snakePart) => {
      // Draw a filled rectangle representing each part of the snake
      ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
      // Draw an outline around each part of the snake
      ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
  }
  function changeDirection(event) {
    const keyPressed = event.keyCode;

    // Left arrow or Letter A
    const LEFT = 37;
    const A = 65;
    // Up arrow or Letter W
    const UP = 38;
    const W = 87;
    // Right arrow or Letter D
    const RIGHT = 39;
    const D = 68;
    // Down arrow or Letter S
    const DOWN = 40;
    const S = 83;

    // Check the current direction of the snake
    const goingUp = yVelocity == -unitSize;
    const goingDown = yVelocity == unitSize;
    const goingRight = xVelocity == unitSize;
    const goingLeft = xVelocity == -unitSize;

    // Switch case to handle different key presses and prevent reverse movement
    switch (true) {
      case keyPressed == LEFT || (keyPressed == A && !goingRight):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
      case keyPressed == UP || (keyPressed == W && !goingDown):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
      case keyPressed == RIGHT || (keyPressed == D && !goingLeft):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
      case keyPressed == DOWN || (keyPressed == S && !goingUp):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
    }
  }
  // check game over
  function checkGameOver() {
    // Check if the snake's head has collided with the game boundaries
    switch (true) {
      case snake[0].x < 0:
      case snake[0].x > gameWidth:
      case snake[0].y < 0:
      case snake[0].y > gameHeight:
        // If any of the conditions are met, stop the game and disable the start button
        running = false;
        break;
    }
    // Check if the snake has collided with itself
    for (let i = 1; i < snake.length; i += 1) {
      if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
        // If the snake collides with itself, stop the game
        running = false;
      }
    }
  }
  // display the game over message
  function displayGameOver() {
    // font size and font family
    ctx.font = "40px 'Press Start 2P'";
    // font color
    ctx.fillStyle = "yellow";
    // align text in the center
    ctx.textAlign = "center";
    // display message when game over
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    // if score > high score , update high score
    updateHighScore();
    // display high score
    updateHighScoreDisplay();
    running = false;
  }
  // reset game
  function resetGame() {
    // set score to 0
    if (!running) {
      // If the game is not running, reset the game
      score = 0;
      xVelocity = unitSize;
      yVelocity = 0;
      snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
      ];
      // Start the game
      gameStart();
    }
  }
  // update high score
  function updateHighScore() {
    // if score is greater than high score, the score is the new high score and set to local storage
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }
  function updateHighScoreDisplay() {
    // display the high score
    highScoreText.textContent = highScore;
  }
});
