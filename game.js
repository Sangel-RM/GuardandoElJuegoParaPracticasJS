const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

// message 
const heart = document.querySelector('#hp');
const btnRestStart = document.querySelector('#Reiniciar');
const time = document.querySelector('#time');
const score = document.querySelector('#score');
const pResult = document.querySelector('#result');
btnRestStart.addEventListener('click', restStart);

let canvasSize;
let elementsSize;
let lvl = 0;
let hp = 3;

let timeStart;
let timePlayer;
let timeInterval;

console.log(`HP: ${hp}`);
const playerPosition = {
  x: undefined,
  y: undefined,
};

const gifPosition = {
  x: undefined,
  y: undefined,
}
let enemyPositions = [];
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  // console.log({ canvasSize, elementsSize });
  if(hp == 3){
    heart.innerText = emojis.HEART + emojis.HEART + emojis.HEART;
  }

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  const map = maps[lvl];
  if(!map){
    gameWin();
    return
  }
  if(!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  // console.log({map, mapRows, mapRowCols});
  

  game.clearRect(0,0,canvasSize,canvasSize)
  enemyPositions = [];

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = (elementsSize * (colI + 1));
      const posY = (elementsSize * (rowI + 1));

      if (col == 'O') {
        if(!playerPosition.y && !playerPosition.x){
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition});
        }
      }else if(col == 'I'){
          gifPosition.x = posX;
          gifPosition.y = posY;
      }else if (col == 'X'){
          enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX + 10, posY - 5);
    });
  });

  movePlayer();
}
// calculando el tiempo que se esta jugando el lvl 
function showTime(){
  time.innerText = Date.now() - timeStart;
}
function showRecord(){
  score.innerText = localStorage.getItem('record_time');
}
// ahora tienes que crear los arrays para detectar las coliciones de bombas 
        // en la clase de mañana 
function movePlayer() {
  const gitColisionX = playerPosition.x.toFixed(3) == gifPosition.x.toFixed(3);
  const gitColisionY = playerPosition.y.toFixed(3) == gifPosition.y.toFixed(3);
  const gitColision = gitColisionX && gitColisionY;
  if(gitColision){
    lvlWin();
  }

  const enemyColition = enemyPositions.find(enemy => {
    const enemyColisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyColisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyColisionX && enemyColisionY;
  }
    );
  if(enemyColition){
    lvlFail();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function lvlWin(){
  console.log('Subiste de nivel');
  if(lvl <= 2){
    lvl++;
  }
  startGame();
}
// function showLives(){
  // este pedacito de codigo crea un array de tantas posiciones
  // dicte el numeró que se le esta pasando al prototipo Array y se vera 
  // así HP: 3 se crea un array ["","",""] de 3 posciones
//   const heartsArray = Array(hp).fill(emojis.HEART)
//   heart.innerText = "";
//   heartsArray.forEach(hearts => heart.append(hearts))
// }
function restStart (){
  lvl = 0;
  hp = 3;
  emojis.PLAYER = "🤠"
  btnDown.disabled  = false;
  btnUp.disabled    = false;
  btnRight.disabled = false;
  btnLeft.disabled  = false;
  timeStart = undefined;
  if(!document.querySelector('#Reiniciar.inactive')){
    document.querySelector('#Reiniciar').classList.add('inactive');
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function lvlFail(){
  console.log('Chocaste contra una bomba');
  hp--;
  if(hp == 2){
      heart.innerText = emojis.HEART + emojis.HEART + emojis.DEATH;
  }else if(hp == 1){
      heart.innerText = emojis.HEART + emojis.DEATH + emojis.DEATH;
  }else{
    heart.innerText = emojis.DEATH + emojis.DEATH + emojis.DEATH;
  }
  console.log(`HP: ${hp}`);
  if (hp <= 0){
    clearInterval(timeInterval);
    btnDown.disabled  = true;
    btnUp.disabled    = true;
    btnRight.disabled = true;
    btnLeft.disabled  = true;
    emojis.PLAYER = '💀';
    if(document.querySelector('#Reiniciar.inactive')){
      document.querySelector('#Reiniciar.inactive').classList.remove('inactive');
    }
    return
}
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin(){
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  if(recordTime){
    if(recordTime >= playerTime){
      localStorage.setItem('record_time', playerTime);
      pResult.innerText = '¡Wow Superaste el record 🎉!';
    } else {
      pResult.innerText = 'lo siento, no superaste el record ';
    }
  } else {
    localStorage.setItem('record_time',playerTime);
    pResult.innerText = 'Wow¡ Primera ves? Felicidades ahora amigo tienes que superar tu record';
  }
  console.log({recordTime, playerTime})
  if(document.querySelector('#Reiniciar.inactive')){
    document.querySelector('#Reiniciar.inactive').classList.remove('inactive');
  }else if(!document.querySelector('#Reiniciar.inactive')){
    document.querySelector('#Reiniciar').classList.add('inactive');
  }
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if(hp > 0){
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
  }
}
function moveUp() {
  // console.log('Me quiero mover hacia arriba');
  if((playerPosition.y - elementsSize) < elementsSize){
    console.log('!out');
  }else{
    playerPosition.y -= elementsSize;
    // console.log(playerPosition.y);
    startGame();
  }
}
function moveLeft() {
  if((playerPosition.x - elementsSize) < elementsSize){
    console.log('!out');
  }else{
    // console.log('Me quiero mover hacia izquierda');
    playerPosition.x -= elementsSize;
    // console.log(playerPosition.x);
    startGame()
  }
}
function moveRight() {
  if((playerPosition.x + elementsSize) > canvasSize){
    console.log('!out');
  }else{
    // console.log('Me quiero mover hacia derecha');
    playerPosition.x += elementsSize;
    // console.log(playerPosition.x);
    startGame()
  }
}
function moveDown() {
  if((playerPosition.y + elementsSize) > canvasSize){
    console.log('!out');
  }else{
    // console.log('Me quiero mover hacia abajo');
    playerPosition.y += elementsSize;
    // console.log(playerPosition.y);
    startGame()
  }
}