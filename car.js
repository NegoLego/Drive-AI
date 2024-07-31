import { ctx0 } from "./context.js";
import { Controls } from "./controls.js";
import { mutateBrain, NeuralNetwork } from "./nn.js";
import { Sensor } from "./sensors.js";
import { lastBrain } from "./storage.js";
export class Car {
    constructor(x, y, hitboxArray) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 100;
        this.speed = 0;
        this.acc = 0.3;
        this.maxSpeed = 5;
        this.angle = 0;
        this.ctx = ctx0;
        this.hitbox = new MovingHitbox(this.ctx, this);
        this.hitboxArray = hitboxArray;
        this.brain = mutateBrain(lastBrain, 0);
        this.controls = new Controls(this.brain);
        this.isMainCar = false;
        this.isCrashed = false;
        this.sensors = [];
        this.sensors.push(new Sensor(this, -Math.PI / 2 - 2 * Math.PI / 11, hitboxArray, this.brain.layers[0].nodes[0]));
        this.sensors.push(new Sensor(this, -Math.PI / 2 - Math.PI / 11, hitboxArray, this.brain.layers[0].nodes[1]));
        this.sensors.push(new Sensor(this, -Math.PI / 2, hitboxArray, this.brain.layers[0].nodes[2]));
        this.sensors.push(new Sensor(this, -Math.PI / 2 + Math.PI / 11, hitboxArray, this.brain.layers[0].nodes[3]));
        this.sensors.push(new Sensor(this, -Math.PI / 2 + 2 * Math.PI / 11, hitboxArray, this.brain.layers[0].nodes[4]));
        this.savedY = this.y; this.cnt = 0;
    }
    update() {
        if(!this.isMoving()) this.isCrashed = true;
        if(this.speed > 0) this.speed = Math.max(this.speed - 0.1, 0);
        else this.speed = Math.min(this.speed + 0.1, 0);
        if(this.controls.forward){
            this.speed += this.acc;
            if(this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        }
        if(this.controls.backward){
            this.speed -= this.acc;
            if(this.speed < -this.maxSpeed/2) this.speed = -this.maxSpeed/2;
        }
        if(this.controls.left){
            this.angle -= 0.005 * this.speed;
        }
        if(this.controls.right){
            this.angle += 0.005 * this.speed;
        }
        this.y -= this.speed * Math.cos(this.angle);
        this.x += this.speed * Math.sin(this.angle);
        this.hitbox.update();
        for(const i of this.sensors) i.update();
        this.brain.update();
    }
    draw(img) {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.rect(-30, -50, 60, 100);
        if(this.isMainCar) this.ctx.fillStyle = 'blue';
        else this.ctx.fillStyle = 'rgb(5, 5, 220, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        //this.ctx.drawImage(img, -img.width/8, -img.height/8, img.width / 4, img.height / 4);
        this.ctx.restore();
    }
    isMoving() {
        this.cnt++;
        if(this.cnt == 60) {
            this.cnt = 0;
            if(Math.abs(this.savedY - this.y) < 5) {
                return false;
            }
            this.savedY = this.y;
        }
        return true;
    }
}

export class NPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 110;
        this.speed = 1.1;
        this.ctx = ctx0;
        this.hitbox = new CarHitbox(this.ctx, this);
    }
    update() {
        this.y -= this.speed;
        this.hitbox.update();
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.rect(-35, -55, 70, 110);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export class Hitbox {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

export class CarHitbox {
    constructor(ctx, car) {
        this.car = car;
        this.update();
    }
    update() {
        this.x1 = this.car.x - this.car.width / 2;
        this.x2 = this.car.x + this.car.width / 2;
        this.y1 = this.car.y - this.car.height / 2;
        this.y2 = this.car.y + this.car.height / 2;
    }
}

export class MovingHitbox {
    constructor(ctx, car) {
        this.car = car;
        this.x = car.x;
        this.y = car.y;
        this.w = car.width /2;
        this.h = car.height / 2;
        this.angle = car.angle;
        this.p1 = {};
        this.p2 = {};
        this.p3 = {};
        this.p4 = {};
        this.points = [];
        this.points.push(this.p1);
        this.points.push(this.p2);
        this.points.push(this.p3);
        this.points.push(this.p4);
        this.update();
        this.ctx = ctx;
    }
    isHitting(hitbox){
        for(const p of this.points){
            if(p.x > hitbox.x1 && p.x < hitbox.x2 && p.y > hitbox.y1 && p.y < hitbox.y2) return true;
        }
        return false;
    }
    update() {
        this.angle = this.car.angle;
        this.x = this.car.x;
        this.y = this.car.y;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const wCos = this.w * cos, wSin = this.w * sin;
        const hCos = this.h * cos, hSin = this.h * sin;
        this.p1.x = this.x + wCos - hSin;
        this.p1.y = this.y + wSin + hCos;
        this.p2.x = this.x - wCos - hSin;
        this.p2.y = this.y -wSin + hCos;
        this.p3.x = this.x -wCos + hSin;
        this.p3.y = this.y - wSin - hCos;
        this.p4.x = this.x + wCos + hSin;
        this.p4.y = this.y + wSin - hCos;
    }
    draw() {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y);
        this.ctx.lineTo(this.p2.x, this.p2.y);
        this.ctx.lineTo(this.p3.x, this.p3.y);
        this.ctx.lineTo(this.p4.x, this.p4.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}