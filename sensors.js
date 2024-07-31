import { Artist, getIntersection, lerp } from "./functions.js";

class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export class Sensor {
    constructor(car, angle, hitboxArray, target) {
        this.ctx = car.ctx;
        this.car = car;
        this.angle = angle;
        this.hitboxArray = hitboxArray;
        this.target = target;
        this.length = 300;
        this.end = {x:null, y:null};
        this.artist = new Artist(this.ctx);
        this.t = null;
        this.update();
    }
    update() {
        this.end.x = this.car.x + this.length * Math.cos(this.car.angle + this.angle);
        this.end.y = this.car.y + this.length * Math.sin(this.car.angle + this.angle);
        this.t = 1;
        for(const hb of this.hitboxArray){    
            const i1 = getIntersection(new Point(this.car.x, this.car.y), new Point(this.end.x, this.end.y), new Point(hb.x1, hb.y1), new Point(hb.x1, hb.y2));
            const i2 = getIntersection(new Point(this.car.x, this.car.y), new Point(this.end.x, this.end.y), new Point(hb.x1, hb.y2), new Point(hb.x2, hb.y2));
            const i3 = getIntersection(new Point(this.car.x, this.car.y), new Point(this.end.x, this.end.y), new Point(hb.x2, hb.y2), new Point(hb.x2, hb.y1));
            const i4 = getIntersection(new Point(this.car.x, this.car.y), new Point(this.end.x, this.end.y), new Point(hb.x2, hb.y1), new Point(hb.x1, hb.y1));
            const v = []; v.push(i1, i2, i3, i4);
            for(const i of v) if(i) this.t = Math.min(this.t, i.t);
        }
        this.target.output = this.t;
    }
    draw() {
        this.artist.drawLine(this.car.x, this.car.y, this.end.x, this.end.y, 2, 'black');
        this.artist.drawLine(this.car.x, this.car.y, lerp(this.t, this.car.x, this.end.x), lerp(this.t, this.car.y, this.end.y), 3, 'yellow');
    }
}