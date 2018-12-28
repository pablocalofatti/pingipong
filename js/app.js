//declar dos variables, canvas va a manejar toda la informacion de las dimenciones del area y canvasContext va a tener la informacion grafica como circulos triangulos y rectangulos
let canvas;
let canvasContext;
//variable para movimiento de la pelota
let ballX = 50;
let ballSpeedX = 20;
let ballY = 50;
let ballSpeedY = 20;
//movimiento del paddle
let paddle1Y = 250;
const PADDLE_HEIGHT = 100;
//paddle computadora derecho
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
//players score
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 6;
let winScreen = false;
//calcula la posicion del mouse (evt es resumen de evento)
function calculateMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };

}
function handleMouseClick(evt) {
	if(winScreen) {
		player1Score = 0;
		player2Score = 0;
		winScreen = false;
	}
}
//cuando cargue la pagina,
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    //con setInterval le digo que dibuje cada tanto tiempo en milisegundos
    let fps = 30;
    setInterval(()=>{
        moveEverything();
        drawEverything();}, 1000/fps);
     //click para continuar
    canvas.addEventListener('mousedown', handleMouseClick);
    //movimiento del paddle con el mouse 
    canvas.addEventListener('mousemove',evt => {
        let mousePos = calculateMousePos(evt);
      //alinea la posicion y del paddle al centro con el movimiento del mouse
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
    
}
//resetear la pelota
function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        player1Score = 0;
        player2Score = 0;
        winScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}
//computadora AI
function computerMovement() {
    //aca centramos el paddle 2, lo que dice paddle2y es donde esta el top, y paddle height lo edividimos por 2 para obtener el centro del paddle
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    //si el paddle 2 esta por debajo de la pelota entonces subi 10 de lo contrario baja 10, lo que hace el ballY-35 y +35 es que ignore seguir la pelota mientras  esta35 pix arriba o debajo del paddle center pos
     if(paddle2YCenter < ballY - 35){
         paddle2Y += 20;
     }else if(paddle2YCenter > ballY + 35){
        paddle2Y -= 20;

     }
}
//funcion para mover la pelota y los jugadores
function moveEverything() {
     computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    //lo que se calcula aca es que si la pelota esta rebotando o no contra el paddle
    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            //le damos control a la pelota depende de donde rebote va a salir menos recta y con mas o menos velocidad
            let deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else{
            player2Score++;
            ballReset();
        }
        
    }
    if(ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else{
            player1Score++;
            ballReset();
        }
    }
    
    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
}
//dinujar la red
function drawNet(){
    //vamos a usar un for que dice que la variable arranca en 0 y que suma de a 40 osea deja unos 40 pixeles de distancia
    for(let i = 0; i < canvas.height; i += 40){
        colorRect(canvas.width/2-1, i, 2, 20, 'white');

    }
} 
    
  
// dibuja y usa la funcion colorRect para que este todo mas clean
function drawEverything(){
    //dibuja pantalla negra
    colorRect(0,0,canvas.width, canvas.height, 'black');
	if(winScreen) {
		canvasContext.fillStyle = 'white';

		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won", 350, 200);
		}

		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	drawNet();
   
   
    //paddle izq
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');
    //paddle derecha
    colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');

    //dibuja la pelota
    colorCircle(ballX, ballY, 10, 'white');
     //mostrar el score
     canvasContext.fillText(player1Score, 100,300);
     canvasContext.fillText(player2Score, canvas.width-100,300);

}
//funcion para resumir codigo para el paddle
function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
//resume codigo del circulo
function colorCircle(centerX, centerY, radius, drawColor){
  //dibuja la pelota
  canvasContext.fillStyle = drawColor;
  //dibuja a la pelota redonda
  canvasContext.beginPath(); 
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
