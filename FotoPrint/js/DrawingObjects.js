'use strict';

/**
 * Represents a drawing object.
 * @abstract
 */
class DrawingObjects {
    /**
     * Creates a new DrawingObjects instance.
     * @abstract
     * @constructor
     * @param {number} px - The x-coordinate of the object's position.
     * @param {number} py - The y-coordinate of the object's position.
     * @param {string} c - The color of the object.
     * @param {string} name - The name of the object.
     */
    constructor(px, py, c, name) {
        // Check if the current instance is of the abstract class itself.
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class cannot be constructed.
            throw new TypeError('Can not construct abstract class.');
        }

        // Otherwise, this constructor is called from a child class.

        // Check if the child class has implemented the "draw" method.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError('Please implement abstract method draw.');
        }

        // Check if the child class has implemented the "mouseOver" method.
        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError('Please implement abstract method mouseOver.');
        }

        // Initialize the position and name properties.
        this.posx = px;
        this.posy = py;
        this.color = c;
        this.name = name;
    }

    changeColor(color){
        this.color = color;
    }

    changeScale(scale){
        this.scale = scale;
    }

    changeRotation(rotation){
        this.rotation = rotation;
    }

    convertToRadians(degree) {
        return degree*(Math.PI/180);
    }

    /**
     * Abstract method that should be implemented by child classes to draw the object on the canvas.
     * @param {CanvasRenderingContext2D} cnv - The canvas context where the object will be drawn.
     * @throws {TypeError} - This method should not be called from child classes.
     */
    draw(cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError('Do not call the abstract method draw from child.');
    }

    /**
     * Abstract method that should be implemented by child classes to handle mouse over events.
     * @param {number} mx - The x coordinate of the mouse pointer.
     * @param {number} my - The y coordinate of the mouse pointer.
     * @abstract
     */

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError('Do not call the abstract method mouseOver from child.');
    }

    // Helper method to calculate the square of the distance between two points.
    /**
     * Calculates the squared distance between two points.
     * @param {number} px1 - The x-coordinate of the first point.
     * @param {number} py1 - The y-coordinate of the first point.
     * @param {number} px2 - The x-coordinate of the second point.
     * @param {number} py2 - The y-coordinate of the second point.
     * @returns {number} The squared distance between the two points.
     */

    
    setPos(x, y){
        this.posx = x;
        this.posy = y;
    }
    
    sqDist(px1, py1, px2, py2) {
        const xd = px1 - px2;
        const yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }
}

/**                 SHAPE OBJECTS                 */
/**
 * Represents a rectangle object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Rect extends DrawingObjects {
    /**
     * Creates a new instance of the Rect class.
     * @constructor
     * @param {number} px - The x-coordinate of the top-left corner of the rectangle.
     * @param {number} py - The y-coordinate of the top-left corner of the rectangle.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle.
     * @param {string} c - The color of the rectangle.
     * @param {string} s - The scale of the rectangle.
     */
    constructor(px, py, w, h, c, s, rot) {
        // Call the constructor of the parent class (DrawingObjects) with the specified parameters.
        super(px, py, c, 'R');
        // Set the width, height, and color properties for the Rect instance.
        this.w = w;
        this.h = h;
        this.color = c;
        this.scale = s;
        this.rotation = rot;
    }

    /**
     * Draws a filled rectangle on the canvas at the specified position with the specified width and height.
     * @param {HTMLCanvasElement} cnv - The canvas element to draw on.
     * @returns {void}
     */
    draw(cnv) {
        // Get the 2D rendering context for the canvas.
        const ctx = cnv.getContext('2d');

        // Set the fill color to the specified color for the rectangle.
        ctx.fillStyle = this.color;

        // Draw a filled rectangle on the canvas at the specified position (this.posx, this.posy)
        // with the specified width (this.w) and height (this.h).
        ctx.fillRect(this.posx, this.posy, this.w * this.scale, this.h * this.scale);    
    }

    /**
     * Checks if the mouse coordinates are within the boundaries of the rectangle.
     * @param {number} mx - The x-coordinate of the mouse pointer.
     * @param {number} my - The y-coordinate of the mouse pointer.
     * @returns {boolean} True if the mouse is over the rectangle, false otherwise.
     */
    mouseOver(mx, my) {
        // Check if the mouse coordinates (mx, my) are within the boundaries of the rectangle.
        return (
            (mx >= this.posx) &&
            (mx <= (this.posx + (this.w * this.scale))) &&
            (my >= this.posy) &&
            (my <= (this.posy + (this.h * this.scale)))
        );
    }
}

/**
 * Represents an oval shape that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Oval extends DrawingObjects {
    /**
     * Creates a new instance of the Oval class.
     * @constructor
     * @param {number} px - The x-coordinate of the center of the oval.
     * @param {number} py - The y-coordinate of the center of the oval.
     * @param {number} r - The radius of the oval.
     * @param {number} hs - The horizontal scaling factor of the oval.
     * @param {number} vs - The vertical scaling factor of the oval.
     * @param {string} c - The fill color for the oval.
     * @param {number} s - scale for the oval
     */
    constructor(px, py, r, hs, vs, c, s, rot) {
        // Call the constructor of the parent class (DrawingObjects) with specified parameters.
        super(px, py, c, 'O');
        // Set the radius, horizontal scaling factor, vertical scaling factor, and color for the Oval instance.
        this.r = r;
        this.radsq = r * r; // Square of the radius (used for mouse-over check)
        this.hor = hs; // Horizontal scaling factor
        this.ver = vs; // Vertical scaling factor
        this.color = c;
        this.scale = s;
        this.rotation = rot;
    }

    /**
     * Checks if the mouse is over the oval object.
     * @param {number} mx - The x-coordinate of the mouse.
     * @param {number} my - The y-coordinate of the mouse.
     * @returns {boolean} - True if the mouse is over the oval object, false otherwise.
     */
    mouseOver(mx, my) {
        // Define two points: (x1, y1) is the center of the oval, and (x2, y2) is the mouse coordinates scaled by hor and ver.
        const x1 = 0;
        const y1 = 0;
        const x2 = (mx - this.posx) / this.hor;
        const y2 = (my - this.posy) / this.ver;

        // Check if the mouse coordinates are within the oval by comparing the distance squared to the square of the radius.
        return (this.sqDist(x1, y1, x2, y2) <= this.radsq * this.scale * this.scale);
    }

    /**
     * Draws an oval on the canvas.
     * @param {HTMLCanvasElement} cnv - The canvas element to draw on.
     */
    draw(cnv) {
        const ctx = cnv.getContext('2d');

        // Save the current canvas state to isolate transformations and styles.
        ctx.save();
        ctx.translate(this.posx, this.posy); // Translate the origin to the oval's position.
        ctx.scale(this.hor, this.ver); // Scale the canvas horizontally and vertically.

        // Set the fill color for the oval.
        ctx.fillStyle = this.color;

        // Begin a path for the oval, draw it as an arc at the transformed origin (0, 0) with the specified radius (this.r).
        ctx.beginPath();
        ctx.arc(0, 0, this.r * this.scale, 0, 2 * Math.PI, true);
        ctx.closePath(); // Close the path to create a filled oval shape.
        ctx.fill(); // Fill the oval with the specified color.

        // Restore the canvas state to its previous state, undoing the translations and scaling.
        ctx.restore();
    }
}

/**
 * Represents a heart shape object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Heart extends DrawingObjects {
    /**
     * Creates a new instance of DrawingObjects with specified parameters.
     * @constructor
     * @param {number} px - The x-coordinate of the object.
     * @param {number} py - The y-coordinate of the object.
     * @param {number} w - The width of the object.
     * @param {string} c - The fill color for the heart.
     * @param {string} c - The scale for the heart.
     */
    constructor(px, py, w, c, s, rot) {
        // Call the constructor of the parent class (DrawingObjects) with specified parameters.
        super(px, py, c, 'H');
        // Set the height of the heart, half width, square of the radius, angle, and color.
        this.h = w * 0.7; // Height
        this.drx = w / 4; // Half of the width (radius)
        this.radsq = this.drx * this.drx; // Square of the radius (used for mouse-over check)
        this.ang = 0.25 * Math.PI; // Angle for drawing the arcs
        this.color = c;
        this.scale = s;
        this.rotation = rot;
    }

    /**
     * Checks if a point is outside the specified bounding box.
     * @param {number} x - The x-coordinate of the top-left corner of the bounding box.
     * @param {number} y - The y-coordinate of the top-left corner of the bounding box.
     * @param {number} w - The width of the bounding box.
     * @param {number} h - The height of the bounding box.
     * @param {number} mx - The x-coordinate of the point to check.
     * @param {number} my - The y-coordinate of the point to check.
     * @returns {boolean} - True if the point is outside the bounding box, false otherwise.
     */
    outside(x, y, w, h, mx, my) {
        // Check if a point (mx, my) is outside the specified bounding box (x, y, w, h).
        return mx < x || mx > x + w || my < y || my > y + h;
    }

    /**
     * Draws a heart shape on the given canvas context.
     * @param {CanvasRenderingContext2D} cnv - The canvas context to draw on.
     */
    draw(cnv) {
        const ctx = cnv.getContext('2d');

        // Calculate the positions of control points and the tip of the heart.
        const leftctrx = this.posx - (this.drx * this.scale);
        const rightctrx = this.posx + (this.drx * this.scale);
        const cx = rightctrx + (this.drx * this.scale) * Math.cos(this.ang);
        const cy = this.posy + (this.drx * this.scale)  * Math.sin(this.ang);

        // Set the fill color for the heart.
        ctx.fillStyle = this.color;

        // Begin drawing the heart shape with arcs and lines.
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy); // Move to the starting point.

        // Draw the left half of the heart using an arc.
        ctx.arc(leftctrx, this.posy, (this.drx * this.scale), 0, Math.PI - this.ang, true);

        // Continue to the bottom point of the heart and then to the tip.
        ctx.lineTo(this.posx, this.posy + (this.h * this.scale));
        ctx.lineTo(cx, cy);

        // Draw the right half of the heart using another arc.
        ctx.arc(rightctrx, this.posy, (this.drx * this.scale), this.ang, Math.PI, true);

        ctx.closePath(); // Close the path to complete the heart shape.
        ctx.fill(); // Fill the heart shape with the specified color.
    }

    /**
     * Checks if the given point is inside the heart shape.
     * @param {number} mx - The x-coordinate of the point to check.
     * @param {number} my - The y-coordinate of the point to check.
     * @returns {boolean} - True if the point is inside the heart shape, false otherwise.
     */
    mouseOver(mx, my) {
        // Define the positions and dimensions for the bounding rectangle.
        const leftctrx = this.posx - (this.drx * this.scale);
        const rightctrx = this.posx + (this.drx * this.scale);
        const qx = this.posx - 2 * (this.drx * this.scale);
        const qy = this.posy - (this.drx * this.scale);
        const qwidth = 4 * (this.drx * this.scale);
        const qheight = (this.drx * this.scale) + (this.h * this.scale);

        // Define two points for comparison (x2, y2) and the slope (m).
        const x2 = this.posx;
        const y2 = this.posy + (this.h * this.scale);
        let m = (this.h * this.scale) / (2 * (this.drx * this.scale));

        // Quick test to check if the point is outside the bounding rectangle.
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        // Compare the point to the two circle centers of the heart.
        if (this.sqDist(mx, my, leftctrx, this.posy) < (this.radsq * this.scale * this.scale)) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < (this.radsq * this.scale * this.scale)) return true;

        // If the point is above the heart and outside the circles, return false.
        if (my <= this.posy) return false;

        // Compare the point to the slopes of the left and right sides of the heart.
        if (mx <= this.posx) {
            return my < m * (mx - x2) + y2;
        } else { // Right side
            m = -m;
            return my < m * (mx - x2) + y2;
        }
    }
}

/**
 * Represents a heart shape object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Bear extends DrawingObjects {
    constructor(px, py, r, c, scale, rot) {
        super(px, py, c, 'B');
        this.radius = r;
        this.color = c;
        this.scale = scale;
        this.rotation = rot;

        // Ears
        this.leftEar = new Oval(this.posx - this.radius / 1.2, this.posy - this.radius / 1.4, this.radius / 2, 1, 1, this.color, this.scale);
        this.leftEarCenter = new Oval(this.posx - this.radius / 1.2, this.posy - this.radius / 1.4, this.radius / 4.2, 1, 1, "black", this.scale);
        this.rightEar = new Oval(this.posx + this.radius / 1.2, this.posy - this.radius / 1.4, this.radius / 2, 1, 1, this.color, this.scale);
        this.rightEarCenter = new Oval(this.posx + this.radius / 1.2, this.posy - this.radius / 1.4, this.radius / 4.2, 1, 1, "black", this.scale);

        // Face center
        this.face = new Oval(this.posx, this.posy, this.radius, 1.2, 1, this.color, this.scale);
        this.leftEye = new Oval(this.posx - this.radius / 2.5, this.posy - this.radius / 4.9, this.radius / 7, 1, 1, "black", this.scale);
        this.leftEyeShine = new Oval(this.posx - this.radius / 2, this.posy - this.radius / 3.9, this.radius / 25, 1, 1, "white", this.scale);
        this.rightEye = new Oval(this.posx + this.radius / 2.5, this.posy - this.radius / 4.9, this.radius / 7, 1, 1, "black", this.scale);
        this.rightEyeShine = new Oval(this.posx + this.radius / 3, this.posy - this.radius / 3.9, this.radius / 25, 1, 1, "white", this.scale);
        this.nose = new Oval(this.posx, this.posy + this.radius / 10, this.radius / 5, 1.5, 1, "black", this.scale);
        this.noseShine = new Oval(this.posx - this.radius / 6, this.posy + 1, this.radius / 18, 1, 1, "white", this.scale);
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");

        this.leftEar.draw(cnv);
        this.leftEarCenter.draw(cnv);
        this.rightEar.draw(cnv);
        this.rightEarCenter.draw(cnv);
        this.face.draw(cnv);
        this.leftEye.draw(cnv);
        this.leftEyeShine.draw(cnv);
        this.rightEye.draw(cnv);
        this.rightEyeShine.draw(cnv);
        this.nose.draw(cnv);
        this.noseShine.draw(cnv);

        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.arc(this.posx + (this.radius * this.scale) / 4.5, this.posy + (this.radius * this.scale) / 4.5, (this.radius * this.scale) / 4, 0, Math.PI, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.posx - (this.radius * this.scale) / 4.5, this.posy + (this.radius * this.scale) / 4.5, (this.radius * this.scale) / 4, 0, Math.PI, false);
        ctx.stroke();
    }

    // Calls the changeColor method of ovals that should change color (ears and face)
    changeColor(color) {
        super.changeColor(color);
        this.leftEar.changeColor(color);
        this.rightEar.changeColor(color);
        this.face.changeColor(color);
    }

    // Updates the scale of all components, maintaining proportion
    changeScale(newScale) {
        super.changeScale(newScale);
        this.leftEar.changeScale(newScale);
        this.leftEarCenter.changeScale(newScale);
        this.rightEar.changeScale(newScale);
        this.rightEarCenter.changeScale(newScale);
        this.face.changeScale(newScale);
        this.leftEye.changeScale(newScale);
        this.leftEyeShine.changeScale(newScale);
        this.rightEye.changeScale(newScale);
        this.rightEyeShine.changeScale(newScale);
        this.nose.changeScale(newScale);
        this.noseShine.changeScale(newScale);
        this.setPos(this.posx, this.posy);
    }

    mouseOver(mx, my) {
        // Mouse over is true if clicked on one of the ears or the face, calling the corresponding oval method
        return (this.leftEar.mouseOver(mx, my) || this.face.mouseOver(mx, my) || this.rightEar.mouseOver(mx, my));
    }

    // Updates the position of all components, maintaining proportion
    setPos(px, py) {
        this.leftEar.setPos(px - (this.radius * this.scale) / 1.2, py - (this.radius * this.scale) / 1.4);
        this.leftEarCenter.setPos(px - (this.radius * this.scale) / 1.2, py - (this.radius * this.scale) / 1.4);
        this.rightEar.setPos(px + (this.radius * this.scale) / 1.2, py - (this.radius * this.scale) / 1.4);
        this.rightEarCenter.setPos(px + (this.radius * this.scale) / 1.2, py - (this.radius * this.scale) / 1.4);
        this.face.setPos(px, py);
        this.leftEye.setPos(px - (this.radius * this.scale) / 2.5, py - (this.radius * this.scale) / 4.9);
        this.leftEyeShine.setPos(px - (this.radius * this.scale) / 2, py - (this.radius * this.scale) / 3.9);
        this.rightEye.setPos(px + (this.radius * this.scale) / 2.5, py - (this.radius * this.scale) / 4.9);
        this.rightEyeShine.setPos(px + (this.radius * this.scale) / 3, py - (this.radius * this.scale) / 3.9);
        this.nose.setPos(px, py + (this.radius * this.scale) / 10);
        this.noseShine.setPos(px - (this.radius * this.scale) / 6, py + 1);
        super.setPos(px, py);
      }
}

/**
 * Represents a heart shape object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Triangle extends DrawingObjects{
    constructor (posx, posy, height, base, c, scale, rot) {
        super(posx, posy, c,"T")
        this.height = height;
        this.base = base;
        this.color = c;
        this.scale = scale;
        this.rotation = rot;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.lineTo(this.posx, this.posy + (this.height * this.scale));
        ctx.lineTo(this.posx + (this.base * this.scale), this.posy);
        ctx.closePath();
        ctx.fill();
    }

    setPos(px, py){
        super.setPos(px, py);
    }

    // Calculates the area of a triangle given its three vertices
    computeArea(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
    }

    // Checks if the mouse coordinates are within the boundaries of the triangle
    mouseOver (mx, my) {
        let totalArea = this.computeArea(this.posx, this.posy, this.posx, this.posy + (this.height * this.scale), this.posx + (this.base * this.scale), this.posy);
        let area1 = this.computeArea(mx, my, this.posx, this.posy + (this.height * this.scale), this.posx + (this.base * this.scale), this.posy);
        let area2 = this.computeArea(this.posx, this.posy, mx, my, this.posx + (this.base * this.scale), this.posy);
        let area3 = this.computeArea(this.posx, this.posy, this.posx, this.posy + (this.height * this.scale), mx, my);

        return totalArea + 0.1 >= area1 + area2 + area3 && totalArea - 0.1 <= area1 + area2 + area3;
    }
}

/**
 * Represents a heart shape object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Ghost extends DrawingObjects {
    constructor(px, py, width, color, scale, rot) {
        super(px, py, color, 'G');
        this.width = width;
        this.height = width / 2;
        this.color = color;
        this.scale = scale;
        this.rotation = rot;

        // Bottom triangles
        this.bottomTriangle1 = new Triangle(this.posx - this.width / 2, this.posy + this.width / 4.2, this.height / 2, this.width / 10, color, this.scale);
        this.bottomTriangle2 = new Triangle(this.posx - this.width / 2 + (3 * this.width) / 10 + 0.3, this.posy + this.width / 4.2, this.height / 2, -2 * this.width / 10, color, this.scale);
        this.bottomTriangle3 = new Triangle(this.posx - this.width / 2 + (3 * this.width) / 10, this.posy + this.width / 4.2, this.height / 2, 2 * this.width / 10, color, this.scale);
        this.bottomTriangle4 = new Triangle(this.posx + this.width / 2, this.posy + this.width / 4.2, this.height / 2, -this.width / 10, color, this.scale);
        this.bottomTriangle5 = new Triangle(this.posx + this.width / 2 - (3 * this.width) / 10, this.posy + this.width / 4.2, this.height / 2, -2 * this.width / 10, color, this.scale);
        this.bottomTriangle6 = new Triangle(this.posx + this.width / 2 - (3 * this.width) / 10 - 0.6, this.posy + this.width / 4.2, this.height / 2, 2 * this.width / 10, color, this.scale);

        // Eyes
        this.leftEye = new Oval(this.posx - this.width / 4, this.posy + this.width / 30, this.width / 8.5, 1, 1, "white", this.scale);
        this.leftEyeIris = new Oval(this.posx - this.width / 3.5, this.posy + this.height / 4.5, this.width / 23, 1, 1, "black", this.scale);
        this.rightEye = new Oval(this.posx + this.width / 4, this.posy + this.width / 30, this.width / 8.5, 1, 1, "white", this.scale);
        this.rightEyeIris = new Oval(this.posx + this.width / 4.6, this.posy + this.height / 4.5, this.width / 23, 1, 1, "black", this.scale);
    }

    draw(cnv) {
        let ctx = cnv.getContext("2d");
        ctx.fillStyle = this.color;

        // Ghost head with quadratic curves (1 point is given for each "curved" line)
        // Left side
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.posx - this.width * this.scale / 2, this.posy + this.width * this.scale / 4.1)
        ctx.lineTo(this.posx - this.width * this.scale / 2, this.posy);
        ctx.quadraticCurveTo(this.posx - this.width * this.scale / 2, this.posy - this.height * this.scale, this.posx + 0.5, this.posy - this.height * this.scale / 1);
        ctx.lineTo(this.posx + 0.5, this.posy + this.width * this.scale / 4);
        ctx.closePath();
        ctx.fill();

        // Right side
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.posx + this.width * this.scale / 2, this.posy + this.width * this.scale / 4.1)
        ctx.lineTo(this.posx + this.width * this.scale / 2, this.posy);
        ctx.quadraticCurveTo(this.posx + this.width * this.scale / 2, this.posy - this.height * this.scale, this.posx, this.posy - this.height * this.scale / 1);
        ctx.lineTo(this.posx, this.posy + this.width * this.scale / 4);
        ctx.closePath();
        ctx.fill();

        this.bottomTriangle1.draw(cnv);
        this.bottomTriangle2.draw(cnv);
        this.bottomTriangle3.draw(cnv);
        this.bottomTriangle4.draw(cnv);
        this.bottomTriangle5.draw(cnv);
        this.bottomTriangle6.draw(cnv);
        this.leftEye.draw(cnv);
        this.rightEye.draw(cnv);
        this.leftEyeIris.draw(cnv);
        this.rightEyeIris.draw(cnv);
    }

    changeColor(color) {
        super.changeColor(color);
        this.bottomTriangle1.changeColor(color);
        this.bottomTriangle2.changeColor(color);
        this.bottomTriangle3.changeColor(color);
        this.bottomTriangle4.changeColor(color);
        this.bottomTriangle5.changeColor(color);
        this.bottomTriangle6.changeColor(color);
    }

    changeScale(scale) {
        super.changeScale(scale);
        this.bottomTriangle1.changeScale(scale);
        this.bottomTriangle2.changeScale(scale);
        this.bottomTriangle3.changeScale(scale);
        this.bottomTriangle4.changeScale(scale);
        this.bottomTriangle5.changeScale(scale);
        this.bottomTriangle6.changeScale(scale);
        this.leftEye.changeScale(scale);
        this.leftEyeIris.changeScale(scale);
        this.rightEye.changeScale(scale);
        this.rightEyeIris.changeScale(scale);
        this.setPos(this.posx, this.posy);
    }

    mouseOver(mx, my) {
        // Horizontal click rectangle parameterization
        let mouseOverHorizontal = (mx >= this.posx - this.width * this.scale / 2 && mx <= this.posx + this.width * this.scale / 2) && (my <= this.posy + this.width * this.scale / 4.1 && my >= this.posy + this.width * this.scale / 30 - this.width * this.scale / 8);
        // Vertical click rectangle parameterization
        let mouseOverVertical = (mx >= this.posx - this.width * this.scale / 4 + this.width * this.scale / 10 && mx <= this.posx + this.width * this.scale / 4 - this.width * this.scale / 10) && (my <= this.posy - this.height * this.scale / 4.1 && my >= this.posy - this.height * this.scale);

        // Obtaining and applying the formula of an ellipse covering the ghost's head
        let a = (this.posx - this.width * this.scale / 2) - this.posx;
        let b = (this.posy - this.height * this.scale) - this.posy;
        let x = Math.abs(mx - this.posx);
        let y = Math.abs(my - this.posy);
        let mouseOverEllipse = (((((x * x) / (a * a)) + ((y * y) / (b * b))) <= 1.1) && (my <= this.posy - this.height * this.scale / 4.1 && my >= this.posy - this.height * this.scale));

        return (this.bottomTriangle1.mouseOver(mx, my) || this.bottomTriangle2.mouseOver(mx, my) ||
            this.bottomTriangle3.mouseOver(mx, my) || this.bottomTriangle4.mouseOver(mx, my) || mouseOverEllipse ||
            this.bottomTriangle5.mouseOver(mx, my) || this.bottomTriangle6.mouseOver(mx, my) || mouseOverHorizontal || mouseOverVertical);
    }

    setPos(px, py) {
        super.setPos(px, py);
        this.bottomTriangle1.setPos(px - this.width * this.scale / 2, py + this.width * this.scale / 4.2);
        this.bottomTriangle2.setPos(px - this.width * this.scale / 2 + (3 * this.width * this.scale) / 10 + 0.3, py + this.width * this.scale / 4.2);
        this.bottomTriangle3.setPos(px - this.width * this.scale / 2 + (3 * this.width * this.scale) / 10, py + this.width * this.scale / 4.2);
        this.bottomTriangle4.setPos(px + this.width * this.scale / 2, py + this.width * this.scale / 4.2);
        this.bottomTriangle5.setPos(px + this.width * this.scale / 2 - (3 * this.width * this.scale) / 10, py + this.width * this.scale / 4.2);
        this.bottomTriangle6.setPos(px + this.width * this.scale / 2 - (3 * this.width * this.scale) / 10 - 0.6, py + this.width * this.scale / 4.2);
        this.leftEye.setPos(px - this.width * this.scale / 4, py + this.width * this.scale / 30);
        this.rightEye.setPos(px + this.width * this.scale / 4, py + this.width * this.scale / 30);
        this.leftEyeIris.setPos(px - this.width * this.scale / 3.5, py + this.height * this.scale / 4.5);
        this.rightEyeIris.setPos(px + this.width * this.scale / 4.6, py + this.height * this.scale / 4.5);
    }
}

/**
 * Represents a star shape object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class MerryHat extends DrawingObjects {
    constructor(posX, posY, size, color, scale, rot) {
        super(posX, posY, color, 'M');
        this.size = size;
        this.scale = scale;
        this.color = color;
        this.rotation = rot;

        const darkerColor = this.adjustColorBrightness(this.color, -20);

        // Define dimensions and positions for the hat components
        const triangleHeight = this.size / 1.25 * this.scale;
        const triangleWidth = this.size / 3 * this.scale;
        const topFoldHeight = this.size / 6 * this.scale;
        const topFoldLeftWidth = this.size / 4 * this.scale;
        const topFoldRightWidth = this.size / 4 * this.scale;
        const topBallSize = this.size / 4 * this.scale;
        const rectangleWidth = this.size / 1.5 * this.scale;
        const rectangleHeight = this.size / 5 * this.scale;
        const circleSize = this.size / 5 * this.scale;

        // Create instances of Rect, Oval, and Triangle for different hat components
        this.topFold = new Triangle(this.posx + this.size / 2 * this.scale, this.posy + triangleHeight / 4.5 + this.size / 4.2 - triangleHeight, 0.9 - topFoldHeight, topFoldLeftWidth + topFoldRightWidth, darkerColor, this.scale);
        this.topBall = new Oval(this.posx + this.size / 2 * this.scale + topFoldLeftWidth + topFoldRightWidth, this.posy + triangleHeight / 4.5 + this.size / 4.2 - triangleHeight, topBallSize / 2, 1, 1, '#f4f2e5', this.scale);

        this.triangle = new Triangle(this.posx + this.size / 2 * this.scale, this.posy + this.size / 4.2, -triangleHeight, -triangleWidth, this.color, this.scale);
        this.triangle2 = new Triangle(this.posx + this.size / 2 * this.scale - 1, this.posy + this.size / 4.2, -triangleHeight, triangleWidth, this.color, this.scale);

        this.rectangle = new Rect(this.posx + this.size / 2 * this.scale - triangleWidth, this.posy + this.scale / 10 + 1.5 * rectangleHeight, rectangleWidth, rectangleHeight, '#f4f2e5', this.scale);
        this.leftCircle = new Oval(this.posx + this.size / 2 * this.scale - triangleWidth, this.posy + this.scale / 10 + 2 * rectangleHeight, circleSize / 2, 1, 1, '#f4f2e5', this.scale);
        this.rightCircle = new Oval(this.posx + this.size / 2 * this.scale - triangleWidth + rectangleWidth, this.posy + this.scale / 10 + 2 * rectangleHeight, circleSize / 2, 1, 1, '#f4f2e5', this.scale);
    }

    /**
     * Adjusts the brightness of a given color.
     * @param {string} color - The color in hexadecimal format (#RRGGBB).
     * @param {number} factor - The factor to adjust brightness (-100 to 100).
     * @returns {string} The adjusted color in hexadecimal format.
     */
    adjustColorBrightness(color, factor) {
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r, g, b];
        };

        const rgbToHex = (r, g, b) => {
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        };

        const [r, g, b] = hexToRgb(color);
        const adjustedR = Math.max(0, Math.min(255, r + (factor * 255) / 100));
        const adjustedG = Math.max(0, Math.min(255, g + (factor * 255) / 100));
        const adjustedB = Math.max(0, Math.min(255, b + (factor * 255) / 100));

        return rgbToHex(adjustedR, adjustedG, adjustedB);
    }

    changeColor(newColor) {
        super.changeColor(newColor);
        this.topFold.changeColor(this.adjustColorBrightness(newColor, -20));
        this.triangle.changeColor(newColor);
        this.triangle2.changeColor(newColor);
    }

    changeScale(scale) {
        super.changeScale(scale);
        this.topFold.changeScale(scale);
        this.topBall.changeScale(scale);
        this.triangle.changeScale(scale);
        this.triangle2.changeScale(scale);
        this.rectangle.changeScale(scale);
        this.leftCircle.changeScale(scale);
        this.rightCircle.changeScale(scale);
        this.setPos(this.posx, this.posy);
    }

    draw(canvas) {
        // Draw each hat component
        this.topFold.draw(canvas);
        this.topBall.draw(canvas);
        this.triangle.draw(canvas);
        this.triangle2.draw(canvas);
        this.rectangle.draw(canvas);
        this.leftCircle.draw(canvas);
        this.rightCircle.draw(canvas);
    }

    setPos(px, py) {
        super.setPos(px, py);
        // Update positions for MerryHat components
        this.topFold.setPos(px + this.size / 2 * this.scale - 25, (this.size / 1.25 * this.scale) / 5 + py + this.size / 4.2 - (this.size / 1.25 * this.scale));
        this.topBall.setPos(px + this.size / 2 * this.scale + (this.size / 4 * this.scale + this.size / 4 * this.scale) - 25, (this.size / 1.25 * this.scale) / 5 + py + this.size / 4.2 - this.size / 1.25 * this.scale);
      
        this.triangle.setPos(px + this.size / 2 * this.scale - 25, py + this.size / 4.2);
        this.triangle2.setPos(px + this.size / 2 * this.scale - 1 - 25, py + this.size / 4.2);
      
        this.rectangle.setPos(px + this.size / 2 * this.scale - this.size / 3 * this.scale - 25, 0.8 * (this.size / 5 * this.scale) + (py + this.size / 4.2) - (this.size / 5 * this.scale) / 2);
        this.leftCircle.setPos(px + this.size / 2 * this.scale - this.size / 3 * this.scale - 25, 0.8 * (this.size / 5 * this.scale) + (py + this.size / 4.2));
        this.rightCircle.setPos(px + this.size / 2 * this.scale - this.size / 3 * this.scale - 25 + this.size / 1.5 * this.scale, 0.8 * (this.size / 5 * this.scale) + (py + this.size / 4.2));
    }

    mouseOver(mx, my) {
        // Check if the mouse coordinates are within the boundaries of any hat component
        return (
            this.triangle.mouseOver(mx, my) ||
            this.triangle2.mouseOver(mx, my) ||
            this.topFold.mouseOver(mx, my) ||
            this.topBall.mouseOver(mx, my) ||
            this.rectangle.mouseOver(mx, my) ||
            this.leftCircle.mouseOver(mx, my) ||
            this.rightCircle.mouseOver(mx, my)
        );
    }
}

/**            IMAGE AND TEXT OBJECTS            */
/**
 * Represents a picture object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Picture extends DrawingObjects {
    /**
     * Creates a new Picture object.
     * @constructor
     * @param {number} px - The x-coordinate of the picture.
     * @param {number} py - The y-coordinate of the picture.
     * @param {number} w - The width of the picture.
     * @param {number} h - The height of the picture.
     * @param {string} impath - The path to the image file.
     * @param {number} s - The scale of the picture.
     * @param {number} r - The rotation of the picture.
     */
    constructor(px, py, w, h, impath, s, rot) {
        // Call the constructor of the parent class (DrawingObjects) with the specified parameters.
        super(px, py, null, 'P');
        // Set the width, height, image path, and create an Image object for the Picture instance.
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
        this.scale = s;
        this.rotation = rot;
    }

    /**
     * Draws the image object on the canvas at the specified position and dimensions.
     * If the image is not yet loaded, it adds a load event listener to handle drawing when the image is ready.
     *
     * @param {HTMLCanvasElement} cnv - The canvas element to draw on.
     * @returns {void}
     */
    draw(cnv) {
        // Get the 2D rendering context for the canvas.
        const ctx = cnv.getContext('2d');

        // Check if the image is already loaded and complete.
        if (this.imgobj.complete) {
            // If the image is loaded, draw it on the canvas at the specified position (this.posx, this.posy)
            // with the specified width (this.w) and height (this.h).
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w * this.scale, this.h * this.scale);
        } else {
            // If the image is not yet loaded, add a load event listener to handle drawing when the image is ready.
            // Using a reference to the current instance (self) to access it inside the event listener function.
            const self = this;
            this.imgobj.addEventListener('load', function () {
                // Draw the image on the canvas once it's loaded, using the specified position and dimensions.
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    /**
     * Checks if the given mouse coordinates are within the boundaries of the image.
     * @param {number} mx - The x-coordinate of the mouse.
     * @param {number} my - The y-coordinate of the mouse.
     * @returns {boolean} - True if the mouse is within the boundaries of the image, false otherwise.
     */
    mouseOver(mx, my) {
        // Check if the mouse coordinates (mx, my) are within the boundaries of the image.
        return (
            (mx >= this.posx) &&
            (mx <= (this.posx + this.w)) &&
            (my >= this.posy) &&
            (my <= (this.posy + this.h))
        );
    }
}

/**
 * Represents a Text object that can be drawn on a canvas.
 * @extends DrawingObjects
 */
class Text extends DrawingObjects{
    constructor (text, px, py, height, width, c, scale, rot) {
        super(px, py, 'Text');
        this.text   = text;
        this.height = height;
        this.width  = width;
        this.color  = c;
        this.scale  = scale; 
        this.rotation = rot;
    }

    draw(cnv){
        let ctx = cnv.getContext("2d");
        ctx.font = ((this.height * this.scale) + 'px Courier New');
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.posx, this.posy);
        let textWidth = ctx.measureText(this.text);
        this.width = textWidth.width;
    }

    mouseOver(mx, my){
        if (mx >= this.posx && my <= this.posy && my >= this.posy - (this.height * this.scale) && mx <= this.posx + (this.width)) return true;
        else return false;
    }
}


//TO DO: You may need to add more classes other than the following two (e.g., a third new object type and a text object).
/*class Bear extends DrawingObjects
{
    constructor () {
        super(px, py, 'B');

    }

    mouseOver (mx, my) {

    }

    draw (cnv) {
        const ctx = cnv.getContext('2d');


    }
}

class Ghost extends DrawingObjects
{
    constructor () {
        super(px, py, 'G');

    }

    mouseOver (mx, my) {

    }

    draw (cnv) {
        const ctx = cnv.getContext('2d');


    }
}
*/
