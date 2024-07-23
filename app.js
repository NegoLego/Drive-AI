import { initCanvas, Artist } from "./functions.js";
import { Node, Layer, NeuralNetwork, NeuralNetworkRepr } from './nn.js';
import { Car, NPC, Hitbox, MovingHitbox} from "./car.js";
const {canvas: nnrCanvas, ctx: nnrCtx} = initCanvas('nnrCanvas');
const {canvas: carCanvas, ctx: carCtx} = initCanvas('carCanvas');

let nn = new NeuralNetwork(5, 3, 4);
let nnr = new NeuralNetworkRepr(nn, new Artist(nnrCtx));
let artist = new Artist(carCtx);
let car = new Car(carCtx, 250, 600);
let npcs = [];
npcs.push(new NPC(carCtx, 400, 100));
npcs.push(new NPC(carCtx, 110, 100));
let carHitbox = new MovingHitbox(car.x - 30, car.y - 50, car.x + 30, car.y + 50);
let hb1 = new Hitbox(38, -5000, 42, carCanvas.height);


nn.layers[0].nodes[0].output = 0.9;
nn.layers[0].nodes[1].output = 0.6;
nn.layers[0].nodes[2].output = 1;
nn.layers[0].nodes[3].output = 0.2;
nn.layers[0].nodes[4].output = 0.5;

function nnrRender() {
    nnrCtx.fillStyle = 'black';
    nnrCtx.fillRect(0, 0, nnrCanvas.width, nnrCanvas.height);
    nn.update();
    nnr.update();
    requestAnimationFrame(nnrRender);
}
nnrRender();
console.log(nn);
let cnt = 0;
function carRender() {
    cnt+=2;
    carCtx.translate(0, cnt);
    drawRoad();
    car.update();
    car.draw();
    //carHitboxUpdate();
    for(const i of npcs) {
        i.update();
        i.draw();
    }
    carCtx.translate(0, -cnt);
    requestAnimationFrame(carRender);
}
carRender();

function drawRoad() {
    carCtx.save();
    carCtx.fillStyle = 'lightgray';
    carCtx.fillRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.fillStyle = 'gray';
    carCtx.fillRect(40, -5000, carCanvas.width - 80, 5000 + carCanvas.height);
    carCtx.setLineDash([]);
    artist.drawLine(40, -5000, 40, carCanvas.height, 6, 'white');
    artist.drawLine(carCanvas.width - 40, -5000, carCanvas.width - 40, carCanvas.height, 6, 'white');
    carCtx.setLineDash([20, 35]);
    artist.drawLine(180, -5000, 180, carCanvas.height, 6, 'white');
    artist.drawLine(320, -5000, 320, carCanvas.height, 6, 'white');
    carCtx.restore();
}

function carHitboxUpdate() {
    carHitbox.x1 = car.x - 30 - 30 * Math.sin(car.angle);
    carHitbox.y1 = car.y - 50 - 50 * Math.cos(car.angle);
    carHitbox.x2 = car.x + 30 + 30* Math.sin(car.angle);
    carHitbox.y2 = car.y + 30 + 30* Math.cos(car.angle);
    carHitbox.draw(carCtx);
}
console.log(Math.atan(50/30));
(car.x - 30, car.y - 50, car.x + 30, car.y + 50)