import { Artist } from "./functions.js";
export class Node {
    constructor() {
        this.bias = Math.random() * 20 - 10;
        this.weights = [];
        this.inputs = [];
        this.output = null;
    }
    connectTo(node){
        node.inputs.push(this);
    }
    update(){
        if(this.inputs.length == 0) return;
        if(this.weights.length == 0) for(const i of this.inputs) this.weights.push(Math.random() * 20 - 10);
        let z = 0;
        for(let i = 0; i < this.inputs.length; i++) z += this.inputs[i].output * this.weights[i];
        z += this.bias;
        this.output = 1 / (1 + Math.exp(-z));
    }
}

export class Layer {
    constructor(nr) {
        this.nodes = [];
        this.addNodes(nr);
    }
    addNodes(nr){
        while(nr){
            this.nodes.push(new Node);
            nr--;
        }
    }
    connectTo(targetLayer){
        for(const i of this.nodes){
            for(const j of targetLayer.nodes){
                i.connectTo(j);
            }
        }
    }
}

export class NeuralNetwork {
    constructor(...params){
        this.layers = [];
        if(!params[0]) return;
        this.layers.push(new Layer(params[0]));
        for(const i of params.slice(1)) {
            this.layers.push(new Layer(i));
            this.layers[this.layers.length - 2].connectTo(this.layers[this.layers.length - 1]);
        }
    }
    update() {
        for(const layer of this.layers){
            for(const node of layer.nodes){
                node.update();
            }
        }
    }
}

export class NeuralNetworkRepr {
    constructor(nn, ctx){
        this.refrence = nn;
        this.nnrWidth = 300;
        this.nnrHeight = 500;
        this.ctx = ctx;
        this.artist = new Artist(ctx);
        this.update = this.update.bind(this);
        this.update();
    }
    update(){
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, nnrCanvas.width, nnrCanvas.height);

        const yStep = -(this.nnrHeight - 50) / (this.refrence.layers.length - 1);
        let i = 0, y = this.nnrHeight;
        while(i < this.refrence.layers.length) {
            const xStep = this.nnrWidth / this.refrence.layers[i].nodes.length;
            let j = 0, x = xStep / 2;
            while(j < this.refrence.layers[i].nodes.length){
                const alpha = this.refrence.layers[i].nodes[j].output;
                this.artist.drawCircle(x, y, 18, 0.5, `rgb(255, 250, 20, ${alpha})`, 'black');
                x += xStep;
                j++;
            }
            y += yStep;
            i++;
        }
        requestAnimationFrame(this.update);
    }
}

export function mutateBrain(brain, factor){
    const newBrain = new NeuralNetwork();
    for(const layer of brain.layers) {
        newBrain.layers.push(new Layer(layer.length));
        for(const node of layer.nodes) {
            let c = new Node;
            c.bias = node.bias + factor * (Math.random() * 20 - 10);
            for(let weight of node.weights) {
                c.weights.push(weight + factor * (Math.random() * 20 - 10));
            } 
            newBrain.layers[newBrain.layers.length - 1].nodes.push(c);
        }
    }
    for(let i = 1; i < newBrain.layers.length; i++) {
        newBrain.layers[i - 1].connectTo(newBrain.layers[i]);
    }
    return newBrain;
}