export function initCanvas(name){
    const canvas = document.getElementById(name);
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
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

