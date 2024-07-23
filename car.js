import { Controls } from "./controls.js";
export class Car {
    constructor(ctx, x, y) {
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.acc = 0.3;
        this.maxSpeed = 5.5;
        this.controls = new Controls;
        this.angle = 0;
        this.ctx = ctx;
    }
    update() {
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

    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.rect(-30, -50, 60, 100);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export class NPC {
    constructor(ctx, x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1.1;
        this.ctx = ctx;
    }
    update() {
        this.y -= this.speed;

    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.rect(-30, -50, 60, 100);
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

export class MovingHitbox extends Hitbox {
    constructor(x1, y1, x2, y2) {
        super(x1, y1, x2, y2);
        this.points = [];
        this.points.push({x1, y1});
        this.points.push({x2, y1});
        this.points.push({x1, y2});
        this.points.push({x2, y2});
    }
    isHitting(hitbox){
        for(const i of this.points){
            if(i.x > hitbox.x1 && i.x < hitbox.x2 && i.y > hitbox.y1 && i.y < hitbox.y2 ) return true;
        }
        return false;
    }
    setRotation(angle) {
        
    }
    draw(ctx) {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x1, this.y2);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x2, this.y1);
        ctx.closePath();
        ctx.stroke();
    }
}