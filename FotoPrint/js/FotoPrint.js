'use strict';

/**
 * Represents a drawing application that manages a pool of drawing objects.
 * @class
 */
class FotoPrint {
    /**
     * Creates a new instance of the FotoPrint class.
     * @constructor
     */
    constructor() {
        // Keeps track of the object being selected first canvas.
        this.editableItem  = null; 
        // Keeps track of the object being moved first canvas.
        this.thingInMotion = null;
        // Keeps track of the object being selected sec canvas.
        this.selectedObj = null;
        this.highlightObj = null;
        // Mouse offset in the x-direction during drag.
        this.offsetx = null;
        // Mouse offset in the y-direction during drag.
        this.offsety = null;
        // Default color for drawing objects.
        
        //this.color = '#add8e6';
        this.backgroundColor = "#FFF";
        this.shapeColor = "#faab41";

        this.shapeRow = [Rect, Oval, Heart];
        this.otherShapeRow = [Bear, Ghost, MerryHat];

        // Creates a pool to manage drawing objects;  

        this.shpinDrawing  = new Pool(100);

        /* TO DO */
    }

    selectMainObj(mx, my){
        let endpt = this.shpinDrawing.stuff.length-1;
        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.editableItem = this.shpinDrawing.stuff[i];
                return true;
            }
            else this.editableItem = null;
        }
        return false;
    }

    selectObj(mx, my) {
        console.log("hereeee");
    
        let canvasSelecao = document.getElementById('pickShapes');
        let canvasHeight = canvasSelecao.getBoundingClientRect().height;
        let canvasWidth = canvasSelecao.getBoundingClientRect().width;
    
        let objectHeight = canvasHeight / 2;
        let objectWidth = canvasWidth / 3;
    
        let column = Math.floor(mx / objectWidth);
        let row;
    
        if (my < objectHeight) {
            this.selectedObj = this.shapeRow[column];
            console.log('Clicked on object:', this.selectedObj);
            row = 0;
        } 
        if (my > objectHeight) {
            this.selectedObj = this.otherShapeRow[column];
            console.log('Clicked on object:', this.selectedObj);
            row = 1;
        }

        this.highlightObj = this.selectedObj;

        return true;
    }  

    
    /**
     * Initializes the application with various drawing objects.
     */
    init() {
        let canvasSelecao = document.getElementById('pickShapes');

        let canvasWidth  = canvasSelecao.getBoundingClientRect().width;
        let canvasHeight = canvasSelecao.getBoundingClientRect().height;

        let objectWidth  = canvasWidth/2;
        let objectHeight = canvasHeight/4;
        console.log("here");
        // Initialize the application with various drawing objects.
        let r = new Rect(objectWidth / 2.6, objectHeight/4.5 + 5, 60/1.4, 60/1.4, this.shapeColor, 1, 90);
        r.draw(canvasSelecao);
        console.log("here");

        let o = new Oval(objectWidth + objectWidth/1.7, objectHeight/4.5 + 30, 30/1.4, 1, 1, this.shapeColor, 1, 90);
        o.draw(canvasSelecao);

        let h = new Heart(2 * objectWidth + objectWidth/1.7, 9 * objectHeight / 10 , 70/1.4, this.shapeColor, 1, 90);
        h.draw(canvasSelecao);

        let b = new Bear(objectWidth / 1.7, 5 * objectHeight + objectHeight/2, 32/1.4, this.shapeColor, 1, 90);
        b.draw(canvasSelecao);

        let g = new Ghost(objectWidth + objectWidth/1.7,  5 * objectHeight + objectHeight/2, 80/1.4, this.shapeColor, 1, 90);
        g.draw(canvasSelecao);

        let m = new MerryHat(1.7 * objectWidth + objectWidth/1.7,  5 * objectHeight + objectHeight/2, 80/1.4, this.shapeColor, 1, 90);
        m.draw(canvasSelecao);

        this.shapeRow = [r, o, h];
        this.otherShapeRow = [b, g, m];

        console.log('init:', this.highlightObj);

        this.processShapeRow(this.shapeRow, canvasSelecao);
        this.processShapeRow(this.otherShapeRow, canvasSelecao);
        // Create a picture (loaded from an image file) and insert it into the drawing pool.
        //const p = new Picture(10, 100, 100, 100, 'imgs/allison1.jpg');
        //this.shpinDrawing.insert(p);
    }

    processShapeRow(shapeRow, canvasSelecao) {
        for (let i = 0; i < shapeRow.length; i++) {
            if (this.highlightObj !== null && this.highlightObj.name === shapeRow[i].name) {
                shapeRow[i].changeColor('#999696');
                shapeRow[i].draw(canvasSelecao);
            }
        }
    }    

    resetSelectedObj(value){
        this.highlightObj = value;
    }

    /**
     * Draws all objects in the pool on the canvas.
     * @param {CanvasRenderingContext2D} cnv - The canvas context to draw on.
     */

    changeBackgroundColor(color){
        this.backgroundColor = color;
        let cnv = document.getElementById("canvas");
        cnv.style.backgroundColor = this.backgroundColor;
    }

     changeObjectColor(color) {
        this.shapeColor = color;
        this.init();
    }

    updateObjectColor(color) {
        let lastColor = this.shapeColor;
        this.shapeColor = color;
        let cnv = document.getElementById("canvas");   
        this.editableItem.changeColor(this.shapeColor);     
        this.drawObj(cnv);
        this.dragObj(this.editableItem.posx, this.editableItem.posy);
        this.shapeColor = lastColor;
    }

    updateColor(color) {
        if (app.editableItem !== null) {
          app.updateObjectColor(color);
        } 
        else if(this.selectedObj !== null) {
          app.changeObjectColor(color);
        }

        document.getElementById("colorShape").value = this.shapeColor;
      }  

    changeObjectSize(rangeValue){
        let scale = rangeValue/5;
        this.editableItem.changeScale(scale);
    }    

    /*
    changeObjectRotation(rangeValue){
        let rotation = rangeValue / 10;
        this.editableItem.changeObjectRotation(rotation);
    } */

    drawObj(cnv) {
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
        }
    }

    /**
     * Checks if an object is being dragged based on mouse coordinates.
     * @param {number} mx - The x coordinate of the mouse.
     * @param {number} my - The y coordinate of the mouse.
     * @returns {boolean} - True if an object is being dragged, false otherwise.
     */
    dragObj(mx, my) {
        // Check if an object is being dragged based on mouse coordinates.
        let endpt = this.shpinDrawing.stuff.length-1;
        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }

    /**
     * Move the currently dragged object based on mouse coordinates.
     * @param {number} mx - The x-coordinate of the mouse.
     * @param {number} my - The y-coordinate of the mouse.
     */
    moveObj(mx, my) {
        // Move the currently dragged object based on mouse coordinates.
        this.shpinDrawing.stuff[this.thingInMotion].posx = mx - this.offsetx;
        this.shpinDrawing.stuff[this.thingInMotion].posy = my - this.offsety;
        this.shpinDrawing.stuff[this.thingInMotion].setPos(mx - this.offsetx, my - this.offsety);
    }

    /**
     * Removes the last object from the pool.
     */
    removeObj() {
        // Remove the last object from the pool.
        if (this.shpinDrawing.stuff.length != 0) this.shpinDrawing.remove();
        this.disableButtons(true);
        this.editableItem = null;
    }

    disableButtons(disabledBool){
        let removeButton = document.getElementById('remove');
        let sliderButton = document.getElementById('size-slider');
        //let rotationButton = document.getElementById('rotation-slider');
    
        removeButton.disabled = disabledBool;
        sliderButton.disabled = disabledBool;
        //rotationButton.disabled = disabledBool;
    }

    /**
     * Inserts a cloned object into the pool based on mouse coordinates.
     * @param {number} mx - The x-coordinate of the mouse.
     * @param {number} my - The y-coordinate of the mouse.
     * @returns {boolean} - Returns true if an object was inserted, false otherwise.
     */
    insertObj(mx, my) {
        const findObject = (startIndex, condition) => {
            for (let i = startIndex; i >= 0; i--) {
                const currentObj = this.shpinDrawing.stuff[i];
                console.log(currentObj);
                if (condition(currentObj, mx, my)) {
                    const item = this.cloneObj(currentObj);
                    this.shpinDrawing.insert(item);
                    return true;
                }
            }
            return false;
        };
    
        if (findObject(this.shpinDrawing.stuff.length - 1, (obj, x, y) => obj.mouseOver(x, y))) {
            return true;
        }
    
        if (this.selectedObj !== null) {
            const item = this.cloneObj(this.selectedObj);
            item.setPos(mx, my);
            this.shpinDrawing.insert(item);
            this.editableItem = item;
            this.disableButtons(false);
            document.getElementById("size-slider").value = app.editableItem.scale * 5;
            //document.getElementById("rotation-slider").value = app.editableItem.rotation * 10; 
            return true;
        }
    
        return false;
    }
    
    /**
     * Clones a drawing object based on its type.
     * @param {Object} obj - The object to be cloned.
     * @returns {Object} - The cloned object.
     * @throws {TypeError} - If the object type cannot be cloned.
     */
    cloneObj(obj) {
        // Clone a drawing object based on its type.
        let item = {};

        switch (obj.name) {
            case 'R':
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.color, obj.scale, obj.rotation);
                break;
            case 'P':
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w/2, obj.h/2, obj.impath, obj.scale, obj.rotation);
                break;
            case 'O':
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, obj.color, obj.scale, obj.rotation);
                break;
            case 'H':
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, obj.color, obj.scale, obj.rotation);
                break;
            case 'B':
                item = new Bear(obj.posx + 20, obj.posy + 20, obj.radius, obj.color, obj.scale, obj.rotation);
                item.setPos(obj.posx + 20, obj.posy + 20);
                break;
            case 'G':
                item = new Ghost(obj.posx + 20, obj.posy + 20, obj.width, obj.color, obj.scale, obj.rotation);
                break;
            case 'M':
                item = new MerryHat(obj.posx + 20, obj.posy + 20, obj.size, obj.color, obj.scale, obj.rotation);
                break;
            case 'T':
                item = new Text(obj.text, obj.posx + 20, obj.posy + 20, obj.height, obj.width, obj.color, obj.scale, obj.rotation);
                break;
            default:
                throw new TypeError('Cannot clone this type of object');
        }
        return item;
    }
}


/**
 * Represents a pool of drawing objects.
 * @class
 */
class Pool {
    /**
     * Creates a new pool object with a specified maximum size.
     * @constructor
     * @param {number} maxSize - The maximum size of the pool.
     */
    constructor(maxSize) {
        // Maximum size of the pool.
        this.size = maxSize;
        // Array to store drawing objects.
        this.stuff = [];
    }

    /**
     * Inserts an object into the pool if it's not full.
     * @param {Object} obj - The object to be inserted into the pool.
     */
    insert(obj) {
        // Insert an object into the pool if it's not full.
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            // Display an alert if the pool is full.
            alert('The pool is full: there isn\'t more memory space to include objects');
            /* TO DO: Consider alternative actions when the pool is full, such as removing the oldest object or expanding the pool size. */
        }
    }

    /**
     * Removes the last object from the pool if it's not empty. Displays an alert if there are no objects to delete.
     */
    remove() {
        // Remove the last object from the pool if it's not empty.
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            // Display an alert if there are no objects to delete.
            alert('There are no objects in the pool to delete');
            /* TO DO: Consider alternative actions when attempting to remove an object from an empty pool, such as ignoring the request or prompting the user for additional input. */
        }
    }
}
