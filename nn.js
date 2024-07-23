class Node {
    constructor() {
        this.bias = Math.random() ;
        this.weight = Math.random() ;
        this.inputs = [];
        this.output = null;
    }
    connectTo(node){
        node.inputs.push(this);
    }
    update(){
        if(this.inputs.length == 0) return;
        const avg = this.inputs.reduce((acc, curr) => acc + curr.output, 0) / this.inputs.length;
        this.output = Math.min(Math.max(this.bias + avg * this.weight, 0), 1);
    }
}

class Layer {
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

class NeuralNetwork {
    constructor(...params){
        this.layers = [];
        this.addInLayer(params[0]);
        for(const i of params.slice(1, -1)) this.addHidLayer(i);
        this.addOutLayer(params[params.length - 1]);
    }
    addInLayer(nr) {
        this.layers.push(new Layer(nr));
    }
    addHidLayer(nr) {
        this.layers.push(new Layer(nr));
        this.layers[this.layers.length - 2].connectTo(this.layers[this.layers.length - 1]);
    }
    addOutLayer(nr) {
        this.layers.push(new Layer(nr));
        this.layers[this.layers.length - 2].connectTo(this.layers[this.layers.length - 1]);
    }
    update() {
        for(const layer of this.layers){
            for(const node of layer.nodes){
                node.update();
            }
        }
    }
}

class NeuralNetworkRepr {
    constructor(nn, artist){
        this.refrence = nn;
        this.nnrWidth = 300;
        this.nnrHeight = 500;
        this.artist = artist;
    }
    update(){
        const yStep = -(this.nnrHeight - 50) / (this.refrence.layers.length - 1);
        let i = 0, y = this.nnrHeight;
        while(i < this.refrence.layers.length) {
            const xStep = this.nnrWidth / this.refrence.layers[i].nodes.length;
            let j = 0, x = xStep / 2;
            while(j < this.refrence.layers[i].nodes.length){
                const alpha = this.refrence.layers[i].nodes[j].output;
                this.artist.drawCircle(x, y, 18, 0.5, 'rgb(255, 250, 20, ' + alpha+')', 'black');
                x += xStep;
                j++;
            }
            y += yStep;
            i++;
        }
    }
}

export { Node, Layer, NeuralNetwork, NeuralNetworkRepr };