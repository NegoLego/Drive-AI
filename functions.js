export function initCanvas(name){
    const canvas = document.getElementById(name);
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
}

export function lerp(t, x, y) {
    return x + t*(y - x);
}

export function getIntersection(A, B, C, D) {
    const top = (D.x - C.x)*(A.y - C.y) - (D.y - C.y)*(A.x - C.x) ;
    const top2 = (C.y - A.y)*(A.x - B.x) - (C.x - A.x)*(A.y - B.y);
    const bottom = (D.y - C.y)*(B.x - A.x) - (D.x - C.x)*(B.y - A.y);
    if(bottom == 0) return null;
    const t = top / bottom;
    const u = top2 / bottom;
    if(t < 0 || t > 1 || u < 0 || u > 1) return null;
    return {x: lerp(t, A.x, B.x), y:lerp(t, A.y, B.y), t:t};
}

export class Artist {
    constructor(ctx) {
        this.ctx = ctx; 
    }
    wipe(){
        this.ctx.reset();
    }
    drawCircle(x, y, radius, lineWidth, color, lineColor){
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = lineColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.stroke();
    }
    drawLine(x1, y1, x2, y2, width, color) {
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}

export function getPng(path){
    return new Promise((resolve, reject) => {
        let x = new Image;
        x.src = path;
        x.onload = () => resolve(x);
        x.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    });
}