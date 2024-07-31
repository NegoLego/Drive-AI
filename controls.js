export class Controls {
    constructor(brain){
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.brain = brain;
        this.#addKeyboardListeners();
        this.update = this.update.bind(this);
        this.update();
    }
    #addKeyboardListeners(){
        document.onkeydown = event =>{
            switch(event.key){
                case 'w':
                    this.forward = true;
                    break;
                case 's':
                    this.backward = true;
                    break;
                case 'a':
                    this.left = true;
                    break;
                case 'd':
                    this.right = true;
                    break;
            }
        }
        document.onkeyup = event =>{
            switch(event.key){
                case 'w':
                    this.forward = false;
                    break;
                case 's':
                    this.backward = false;
                    break;
                case 'a':
                    this.left = false;
                    break;
                case 'd':
                    this.right = false;
                    break;
            }
        }
    }
    update() {
        if(this.brain.layers[2].nodes[0].output >= 0.5) this.forward = true;
        else this.forward = false;
        if(this.brain.layers[2].nodes[1].output >= 0.5) this.backward = true;
        else this.backward = false;
        if(this.brain.layers[2].nodes[2].output >= 0.5) this.left = true;
        else this.left = false;
        if(this.brain.layers[2].nodes[3].output >= 0.5) this.right = true;
        else this.right = false;
        requestAnimationFrame(this.update);
    }
}