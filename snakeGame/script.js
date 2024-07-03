const board=document.getElementById('gameBoard');
let snake=[{x:10,y:10}];//array of objects
let food=generateFood();//returns objects which has position of the food
let direction='left';
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;
const score=document.getElementById('score');
const highScoreText=document.getElementById('highScore')
const instructionText=document.getElementById('instruction');
const logo=document.getElementById('logo')
let highScore=0;
// board.addEventListener("click",Print);
// function Print(event){
//     const clickElement=createGameElement('div','food');
//     const xCoordinates=Math.floor((event.x-260)/20)+1;
//     const yCoordinates=Math.floor((event.y-201)*0.050505)+1;
//     clickElement.style.gridRow=yCoordinates;
//     clickElement.style.gridColumn=xCoordinates;
//     console.log(yCoordinates);
//     console.log(xCoordinates)
//     board.appendChild(clickElement);
    
// }
function draw(){
    board.innerHTML='';
    drawSnake();
    generateFood();
    drawFood();
}
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
}
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}
function setPosition(element,Position){
    element.style.gridColumn=Position.x;
    element.style.gridRow=Position.y;
}
function drawFood(){
    if(gameStarted){
    const foodElement=createGameElement('div','food');
    setPosition(foodElement,food);
    board.appendChild(foodElement);
    }
}
function generateFood(){
     const x=Math.floor(Math.random()*20)+1;
     const y=Math.floor(Math.random()*20)+1;
     return {x,y};
} 

function move(){
    const head={...snake[0]};
    switch(direction ){
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
             break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++; 
            break;
    }
    snake.unshift(head);//append the head at first of snake array
   // snake.pop();//removes the last element
   if(head.x===food.x&&head.y===food.y){
      food=generateFood();
      increaseSpeed();
      clearInterval(gameInterval);//just make smooth transition
      gameInterval=setInterval(()=>{
        move();
        checkCollision();
        draw();
        updateScore();
      },gameSpeedDelay);
   }
   else{
    snake.pop();
   }
}

function startGame(){
    gameStarted=true;
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(()=>{
        move();
        draw();
        checkCollision();  
        updateScore();
      },gameSpeedDelay)
}
// keypress event listener
function handleKeyPress(event){
    if(!gameStarted&&event.code==='Space'||!gameStarted&&event.key===' '){//some browser use key and some use event for space
    startGame();
    }
    else{
        switch(event.key){
            case 'ArrowUp':
                direction='up';
                break
            case 'ArrowDown':
                direction='down';
                break
             case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                 direction='right';
                 break;
        }
    }
}

function increaseSpeed(){
    if(gameSpeedDelay>150)
    gameSpeedDelay-=5;
    else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }
    else if(gameSpeedDelay>75){
        gameSpeedDelay-=2;
    }
    else if(gameSpeedDelay>50){
        gameSpeedDelay-=1;
    }
}
function checkCollision(){
    const head=snake[0];
    if(head.x>20||head.y>20||head.x<=0||head.y<=0){
       resetGame();
    }
    //console.log(head.x );  
    for(let i=1;i<snake.length;i++){
        const body=snake[i];
        if(head.x===body.x&&head.y===body.y){
            resetGame();
        }
    }
}
function resetGame(){
    updateHighScore();
    stopGame();
    snake=[{x:10,y:10}];
    food=generateFood();
    direction='right';
    gameSpeedDelay=200;
    updateScore();
}
function updateScore(){
    const currentScore=snake.length-1;
    score.textContent=currentScore.toString().padStart(3,'0');
    updateHighScore();
}
function updateHighScore(){
    const currentScore=snake.length-1;
    if(highScore<currentScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block'
}
function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display='block';
    logo.style.display='inline';
}
//always listen for keys

document.addEventListener('keydown',handleKeyPress);