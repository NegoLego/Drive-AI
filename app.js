import { initCanvas, Artist, getPng } from "./functions.js";
import { Node, Layer, NeuralNetwork, NeuralNetworkRepr } from './nn.js';
import { Car, NPC, Hitbox, MovingHitbox} from "./car.js";
import { setCtx0 } from "./context.js";
import { deleteBrains, lastBrain, uploadBrain } from "./storage.js";

const {canvas: nnrCanvas, ctx: nnrCtx} = initCanvas('nnrCanvas');
const {canvas: carCanvas, ctx: carCtx} = initCanvas('carCanvas');
const saveButton = document.getElementById('saveButton');
const deleteButton = document.getElementById('deleteButton');
setCtx0(carCtx);
const canvasCst = 600; const endY = -8000;

let artist = new Artist(carCtx);
let npcs = [];
npcs.push(new NPC(400, 100), new NPC(110, 100), new NPC(250, -180), new NPC(110, -580), new NPC(250, -580),
    new NPC(250, -950), new NPC(400, -950));
let hb1 = new Hitbox(38, endY, 42, carCanvas.height);
let hb2 = new Hitbox(458, endY, 462, carCanvas.height);
let hitboxArray = [hb1, hb2];
for(const i of npcs) hitboxArray.push(i.hitbox);
let gameState = 0;
let carArray = [];
for(let i = 0; i < 1; i++) carArray.push(new Car(250, 600, hitboxArray)); let firstCar = carArray[0];
let nnr = new NeuralNetworkRepr(carArray[0].brain, nnrCtx);

saveButton.onclick = () => {uploadBrain('last', firstCar.brain); gameState = 3;};
deleteButton.onclick = () => deleteBrains();
let frieda = await getPng('Frieda.png');

function filterCars() {
    const newArray = carArray.filter(car => car.isCrashed == false);
    if(newArray.length == 0) gameState = 2;
    else carArray = newArray; 
}

function updateCars() {
    for(const car of carArray) {
        car.update();
        car.draw();
        for(const i of hitboxArray){
            if(car.hitbox.isHitting(i)) car.isCrashed = true;
        }
        if(car.y > 800) car.isCrashed = true;
    }
}

function startScreen() {
    gameLoop();
    carCtx.fillStyle = `rgb(0, 0, 0, 0.75)`;
    carCtx.fillRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.textAlign = 'center';
    carCtx.font = "bold 48px serif";
    carCtx.fillStyle = 'white';
    carCtx.fillText('Click to Start!', 250, 300);
    carCanvas.addEventListener('click', () => {
        gameState = 1;
        setTimeout(() => {
            for(const car of carArray){
                if(car.y == 600) car.isCrashed = true;
            }
        }, 1000);
        gameLoop();
    });
}
startScreen();

function gameLoop() {
    filterCars();
    firstCar.isMainCar = false;
    firstCar = getFurthestCar();
    firstCar.isMainCar = true;
    carCtx.reset();
    carCtx.translate(0, canvasCst - firstCar.y);
    drawRoad();
    updateCars();
    for(const i of npcs) {
        i.update();
        i.draw();
    }
    for(const i of firstCar.sensors) i.draw();
    carCtx.translate(0, -canvasCst + firstCar.y);
    if(gameState == 1) requestAnimationFrame(gameLoop);
    else if(gameState == 2) endScreen();
    else if(gameState == 3) savedScreen();
}

function endScreen() {
    carCtx.fillStyle = `rgb(0, 0, 0, 0.75)`;
    carCtx.fillRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.textAlign = 'center';
    carCtx.font = "bold 52px serif";
    carCtx.fillStyle = 'white';
    carCtx.fillText('Game Over!', 250, 300);
}

function savedScreen() {
    carCtx.fillStyle = `rgb(0, 0, 0, 0.75)`;
    carCtx.fillRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.textAlign = 'center';
    carCtx.font = "bold 52px serif";
    carCtx.fillStyle = 'white';
    carCtx.fillText('Car saved!', 250, 300);
}

function drawRoad() {
    carCtx.save();
    carCtx.fillStyle = 'lightgray';
    carCtx.fillRect(0, endY, carCanvas.width, -endY + carCanvas.height);
    carCtx.fillStyle = 'gray';
    carCtx.fillRect(40, endY, carCanvas.width - 80, -endY + carCanvas.height);
    carCtx.setLineDash([]);
    artist.drawLine(40, endY, 40, carCanvas.height, 6, 'white');
    artist.drawLine(carCanvas.width - 40, endY, carCanvas.width - 40, carCanvas.height, 6, 'white');
    carCtx.setLineDash([20, 35]);
    artist.drawLine(180, endY, 180, carCanvas.height, 6, 'white');
    artist.drawLine(320, endY, 320, carCanvas.height, 6, 'white');
    carCtx.restore();
}

function getFurthestCar() {
    let ymin = 800, theCar = null;
    for(const i of carArray) {
        if(i.y < ymin) {
            ymin = i.y;
            theCar = i;
        }
    }
    return theCar;
}