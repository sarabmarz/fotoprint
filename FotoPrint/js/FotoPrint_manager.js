'use strict';

let app = null;

// Entry point of the application
/**
 * Initializes the FotoPrint app and adds event listeners for mouse actions.
 * @function
 * @returns {void}
 */
function main() {
    // Get the canvas element by its id
    const cnv = document.getElementById('canvas');
    const cnv2 = document.getElementById('pickShapes');

    drawCanvasRect(cnv);// Function to draw a canvas img
    drawCanvasRect(cnv2);// Function to draw a canvas shapes

    // Create a new instance of the FotoPrint class and draw the initial canvas rectangle
    app = new FotoPrint();        
   
    app.drawObj(cnv);     // Function to draw all objects in the pool on the canvas
    // Add event listeners for the save-as-image and remove buttons
    //document.getElementById('save-as-image').addEventListener('click', saveasimage);
    //document.getElementById('remove').addEventListener('click', remove);
    app.disableButtons(true);

    // Add event listeners for mouse actions: drag, double-click, and window resize
    cnv.addEventListener('mousedown', drag, false);
    cnv.addEventListener('click', clickCanvas, false); 
    cnv.addEventListener('dblclick', makenewitem, false);
    cnv2.addEventListener('click', selectitem, false);  
    // Initialize the FotoPrint app and draw objects on the canvas
    app.init();   // Function to initialize the application with various drawing objects

    updateCanvasSize();
    window.addEventListener('resize', function () {
        updateCanvasSize();  // Function to update the canvas size on window resize
    });

    /* TO DO */
}

// Function to draw the canvas rectangle
/**
 * Draws a black rectangle border on the canvas.
 * @param {HTMLCanvasElement} cnv - The canvas element to draw on.
 */
function drawCanvasRect(cnv) {
    const ctx = cnv.getContext('2d'); 

    // Clear the canvas and draw a black rectangle border
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.strokeStyle = "white";
    //ctx.strokeStyle = app.backgroundColor;
    /* TO DO */

    ctx.lineWidth = 0;
    ctx.strokeRect(0, 0, cnv.width, cnv.height);
}

// Drag & Drop operation - mousedown event
/**
 * Handles the drag event for canvas element.
 * @param {MouseEvent} ev - The mouse event object.
 */
function drag(ev) {
    const cnv = document.getElementById('canvas');
    const [xPos, yPos] = getMouseCoord(cnv); 
    const mx = ev.x - xPos;
    const my = ev.y - yPos;

    // If dragging is successful, set cursor and add move and drop event listeners
    if (app.dragObj(mx, my)) {
        cnv.style.cursor = 'pointer';
        cnv.addEventListener('mousemove', move, false);
        cnv.addEventListener('mouseup', drop, false);
    }
}

// Drag & Drop operation - mousemove event
/**
 * Moves an object on the canvas based on mouse coordinates.
 * @param {MouseEvent} ev - The mouse event.
 */
function move(ev) {
    let mx = null;
    let my = null;
    const cnv = document.getElementById('canvas');
    const [xPos, yPos] = getMouseCoord(cnv); 
    mx = ev.x - xPos;
    my = ev.y - yPos;

    // Move the object, redraw canvas rectangle, and draw objects
    app.moveObj(mx, my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

// Drag & Drop operation - mouseup event
/**
 * Removes move and drop event listeners and resets cursor.
 */
function drop() {
    const cnv = document.getElementById('canvas'); 

    // Remove move and drop event listeners, reset cursor
    cnv.removeEventListener('mousemove', move, false);
    cnv.removeEventListener('mouseup', drop, false);
    cnv.style.cursor = 'crosshair';
}

function clickCanvas(ev){
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;
    if (app.selectMainObj(mx, my)) {
        app.disableButtons(false);
        document.getElementById("size-slider").value = app.editableItem.scale * 5; 
      //  document.getElementById("rotation-slider").value = app.editableItem.rotation * 10; 
    }
    else{
        app.disableButtons(true);
        app.resetSelectedObj(null);
        console.log("me here");
        app.init();
    }
}

// Insert a new Object on Canvas - dblclick event
/**
 * Creates a new item on the canvas at the position of the mouse click event.
 * @param {MouseEvent} ev - The mouse click event.
 */
function makenewitem(ev) {
    let mx = null;
    let my = null;
    const cnv = document.getElementById('canvas');

    // Calculate mouse coordinates relative to the canvas
    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    // If insertion is successful, redraw canvas rectangle and draw objects
    if (app.insertObj(mx, my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }
}

function resizeObject(rangeValue){
    let cnv = document.getElementById('canvas');
    app.changeObjectSize(rangeValue);
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

/*
function rotateObject(rangeValue){
    let cnv = document.getElementById('canvas');
    app.changeObjectRotation(rangeValue);
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}*/

function selectitem(ev) {
    let mx = null;
    let my = null;
    const cnv2 = document.getElementById('pickShapes');

    let xPos = 0;
    let yPos = 0;
    [xPos, yPos] = getMouseCoord(cnv2);
    mx = ev.x - xPos;
    my = ev.y - yPos;

    drawCanvasRect(cnv2)
    if (app.selectObj(mx, my)) {;
        app.init();
    }
}

// Delete button - onclick event
/**
 * Removes the last object from the canvas, redraws the canvas rectangle, and draws the remaining objects.
 */
function remove() {
    const cnv = document.getElementById('canvas'); 

    // Remove the last object, redraw canvas rectangle, and draw objects
    app.removeObj();
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

// Save button - onclick event
/**
 * Saves the contents of the canvas element as a PNG image with the specified file name.
 * @function
 * @name saveasimage
 * @returns {void}
 */
function saveasimage() {
    try {
        // Get the canvas element by its ID
        const canvas = document.getElementById('canvas'); 

        // Convert the contents of the canvas to a data URL representing a PNG image
        const dataUrl = canvas.toDataURL('image/png');

        // Create a temporary link element
        const link = document.createElement('a'); 

        // Set the link's href to the data URL and the download attribute to the specified file name
        link.href = dataUrl;
        link.download = 'photo.png';

        // Trigger a click on the link to start the download
        link.click();
    } catch (err) {
        // Display an alert if there is an issue with saving and log the error to the console
        alert('Failed to save the canvas as an image. Please try again.');
        console.error(err);
    }
}

// clean all the canva
function reset(){
    let cnv = document.getElementById('canvas');
    cnv.style.backgroundColor = "white";
    let cnv2 = document.getElementById('pickShapes');
    drawCanvasRect(cnv);
    drawCanvasRect(cnv2);
    app = new FotoPrint();
    app.drawObj(cnv);
    cnv.addEventListener('mousedown', drag, false);
    cnv.addEventListener('dblclick', makenewitem, false);
    cnv.addEventListener('click', clickCanvas, false);
    cnv2.addEventListener('click', selectitem, false);
    app.disableButtons(true);
    app.init();
}

// Function to get mouse coordinates for all browsers
/**
 * Calculates the coordinates of the mouse relative to the top-left corner of the specified element.
 * @param {HTMLElement} el - The element to calculate the coordinates relative to.
 * @returns {Array<number>} An array containing the x and y coordinates of the mouse.
 */
function getMouseCoord(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            let yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return [xPos,yPos];
}


/**
 * Insert Text
 */
function insertText(){
    // Get the canvas element and its 2D rendering context
    let cnv = document.getElementById("canvas");
    let ctx = cnv.getContext("2d");
    // Prompt the user to input text
    let text  = prompt("Insert text here");
    if (text === null) return; // If the user cancels the prompt, exit the function
    // If the user cancels the prompt, exit the function
    let width = ctx.measureText(text).width; // Measure the width of the entered text
    let addedText = new Text(text, 50, 50, 20, width, app.shapeColor, 1);
    // Insert the new Text object into the drawing
    app.shpinDrawing.insert(addedText);
    // Redraw the canvas with the updated drawing
    app.drawObj(cnv);
}

/**
 * Insert Image
 */
function insertImage(){
    // Get the file input element that allows selecting files
    let fileInput = document.getElementById('inserirImagem');
    // Create a URL for the selected file
    let fileUrl = window.URL.createObjectURL(fileInput.files[0]);
    // Get the canvas element
    let cnv = document.getElementById("canvas");
    // Create a new Image object
    let imgobj = new Image();
    // Set the source of the Image object to the file URL
    imgobj.src = fileUrl;

    imgobj.onload = function() {
        // Calculate the scaling factors for width and height
        // 2.5 I got based on the scale and everything
        let widthScale = cnv.width / (imgobj.naturalWidth*2.5);
        let heightScale = cnv.height / (imgobj.naturalHeight*2.5);
    
        // Choose the minimum scale factor to maintain aspect ratio
        let scale = Math.min(widthScale, heightScale);
    
        // Calculate the proportional width and height
        let proportionalWidth = imgobj.naturalWidth * scale;
        let proportionalHeight = imgobj.naturalHeight * scale;
    
        // Create the Picture object with proportional dimensions
        let imagem = new Picture(50, 50, proportionalWidth, proportionalHeight, fileUrl, 1, 90);
    
        // Initialize the 'imagem' variable to null
        app.shpinDrawing.insert(imagem);
        app.drawObj(cnv);
    };
}

/**
 * Updates the size of the canvas and draws the canvas rectangle and objects.
 */
function updateCanvasSize() {
    const canvas = document.getElementById('canvas');
    let canvasWidth  = canvas.parentElement.getBoundingClientRect().width;
    let canvasHeight  =  canvas.parentElement.getBoundingClientRect().height;
    // // Set the width of the canvas to match the body's width
    canvas.width = canvasWidth;
    canvas.height = canvasHeight + 1;
    // // Draw the canvas rectangle and objects
    drawCanvasRect(canvas);
    app.drawObj(canvas);
}
