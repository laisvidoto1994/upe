$.Class.extend("bizagi.bpmn.modeler.path", {}, {
    curve: 8,
    arrowHeight: 10,
    calculateAnchors: function(el1, el2){
        var threshold_x = Math.min(el1.width, el2.width);
        var threshold_y = Math.min(el1.height, el2.height);
        var e1xh = el1.x + el1.width /2;
        var e2xh = el2.x + el2.width /2;
        var e1yh = el1.y + el1.height /2;
        var e2yh = el2.y + el2.height /2;

        // FIRST CASES, THE ELEMENTS ARE FAR ENOUGH IN X-AXIS
        // Task 1 is at x from Task 2
        if (el1.x + el1.width + threshold_x < el2.x) return {el1: "right", el2: "left"};
        // Task 1 is at right from Task 2
        if (el1.x > el2.x + el2.width + threshold_x) return {el1: "left", el2: "right"};

        /* SECOND CASES, THE ELEMENT'S CENTERS ARE VERY CLOSE IN X-AXIS*/
        if(this.areElementsVeryCloseInXAxis(el1, el2, threshold_x)){
            // Task 1 and Task 2 centers are almost in the same x-axis position, but task 1 is on y of task 2 
            if (el1.y + el1.height < el2.y) return {el1: "bottom", el2: "top"};
            // Task 1 and Task 2 centers are almost in the same x-axis position, but task 1 is on bottom of task 2
            if (el1.y > el2.y + el2.height) return {el1: "top", el2: "bottom"};
        }

        // THIRD CASES, THE ELEMENTS ARE VERY CLOSE IN X-AXIS, AND VERY CLOSE IN Y-AXIS
        if(Math.abs(e1yh - e2yh) < threshold_y){
            // Task 1 is at x from Task 2
            if (el1.x < el2.x) return {el1: "right", el2: "left"};
            // Task 1 is at right from Task 2
            if (el1.x >= el2.x) return {el1: "left", el2: "right"};
        }

        // FOURTH CASES, THE ELEMENTS ARE CLOSE BUT NOT SO CLOSE, SO WE NEED TO MOVE THE ANCHORS
        if (e1xh < e2xh && e1yh < e2yh) return {el1: "bottom", el2: "left"};
        if (e1xh > e2xh && e1yh < e2yh) return {el1: "bottom", el2: "right"};
        if (e1xh < e2xh && e1yh > e2yh) return {el1: "top", el2: "left"};
        if (e1xh > e2xh && e1yh > e2yh) return {el1: "top", el2: "right"};
    },

    getPath: function(box, anchors, el1, el2){
        var threshold_x = Math.min(el1.width, el2.width);
        var threshold_y = Math.min(el1.height, el2.height);
        var coords = { x:this.arrowHeight, y: this.arrowHeight, w: box.width - this.arrowHeight, h: box.height - this.arrowHeight};

        /* STRAIGHT LINE CASES */
        if (this.areVerticalAnchors(anchors) && Math.abs(el1.x - el2.x) < 10){
            // Task 1 is at y from task2, and the difference in x-axis is very small
            if (el1.y < el2.y) return this.getPathTopToBottom(coords, el1, el2);
            // Task 1 is at bottom from task2, and the difference in x-axis is very small
            if (el1.y > el2.y) return this.getPathBottomToTop(coords, el1, el2);
        }
        if (this.areHorizontalAnchors(anchors) && Math.abs(el1.y - el2.y) < 10){
            // Task 1 is at x from task2, and the difference in y-axis is very small
            if (el1.x < el2.x) return this.getPathLeftToRight(coords);
            // Task 1 is at right from task2, and the difference in y-axis is very small
            if (el1.x > el2.x) return this.getPathRightToLeft(coords);
        }

        /* MUST DRAW TWO CURVE CASES */
        if (this.areHorizontalAnchors(anchors)){
            // Task 1 is at x-y from task2
            if (el1.x < el2.x && el1.y < el2.y) return this.getPathLeftToRightBottom(coords);
            // Task 1 is at x-bottom from task2
            if (el1.x < el2.x && el1.y > el2.y) return this.getPathLeftToRightTop(coords);
            // Task 1 is at right-y from task2
            if (el1.x > el2.x && el1.y < el2.y) return this.getPathRightToLeftBottom(coords);
            // Task 1 is at right-bottom from task2
            if (el1.x > el2.x && el1.y > el2.y ) return this.getPathRightToLeftTop(coords);
        }
        if (this.areVerticalAnchors(anchors)){
            // Task 1 is at x-y from task2
            if (el1.x < el2.x && el1.y < el2.y) return this.getPathTopToBottomLeft(coords);
            // Task 1 is at x-bottom from task2
            if (el1.x < el2.x && el1.y > el2.y) return this.getPathBottomToTopLeft(coords);
            // Task 1 is at right-y from task2
            if (el1.x > el2.x && el1.y < el2.y) return this.getPathTopToBottomRight(coords);
            // Task 1 is at right-bottom from task2
            if (el1.x > el2.x && el1.y > el2.y ) return this.getPathBottomToTopRight(coords);
        }

        /* MUST DRAW ONE CURVE CASES*/
        if (anchors.el1 == "bottom" && anchors.el2 == "left") return this.getPathBottomToLeft(coords);
        if (anchors.el1 == "bottom" && anchors.el2 == "right") return this.getPathBottomToRight(coords);
        if (anchors.el1 == "top" && anchors.el2 == "left") return this.getPathTopToLeft(coords);
        if (anchors.el1 == "top" && anchors.el2 == "right") return this.getPathTopToRight(coords);
    },

    getTransform: function(anchors, el1, el2){
        if (this.areVerticalAnchors(anchors)){
            if (Math.abs(el1.x - el2.x) < this.arrowHeight) return "translate(5, 0)";
        }
        if (anchors.el1 == "left" || anchors.el1 == "right"){
            if (Math.abs(el1.y - el2.y) < this.arrowHeight) return "translate(0, 5)";
        }
        return "";
    },

    areHorizontalAnchors: function(anchors){
        return (anchors.el1 == "left" && anchors.el2 == "right") || (anchors.el1 == "right" && anchors.el2 == "left");
    },

    areVerticalAnchors: function(anchors){
        return (anchors.el1 == "top" && anchors.el2 == "bottom") || (anchors.el1 == "bottom" && anchors.el2 == "top");
    },

    areElementsVeryCloseInXAxis: function(el1, el2, threshold){
        var e1xh = el1.x + el1.width /2;
        var e2xh = el2.x + el2.width /2;
        // Centers are very close
        if (Math.abs(e1xh - e2xh) < threshold) return true;
        // Center of 1 is close to left edge of 2
        if (Math.abs(e1xh - el2.x) < threshold) return true;
        // Center of 1 is close to right  edge of 2
        if (Math.abs(e1xh - el2.x + el2.width) < threshold) return true;
        // Center of 2 is close to left edge of 1
        if (Math.abs(e2xh - el1.x) < threshold) return true;
        // Center of 2 is close to right  edge of 1
        if (Math.abs(e2xh - el1.x + el1.width) < threshold) return true;
        return false;
    },

    /* STRAIGHT LINES */
    getPathLeftToRight: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.h/2, y2 = coords.h/2;
        return  "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x2 + "," + y2 + " " +  // Go to the end
            this.getArrowRight(x2, y2);
    },

    getPathRightToLeft: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.h/2, y2 = coords.h/2;
        return  "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x2 + "," + y2 + " " +    // Go to the end
            this.getArrowLeft(x2, y2);
    },

    getPathTopToBottom: function(coords, el1, el2){
        var min = el1.x < el2.x ? this.arrowHeight : coords.w;
        var x1 = min/2, x2 = min/2, y1 = coords.y, y2 = coords.h;
        return  "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x2 + "," + y2 + " " +  // Go to the end
            this.getArrowDown(x2, y2);
    },

    getPathBottomToTop: function(coords, el1, el2){
        var min = el1.x < el2.x ? this.arrowHeight : coords.w;
        var x1 = min/2, x2 = min/2, y1 = coords.h, y2 = coords.y;
        return  "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x2 + "," + y2 + " " +  // Go to the end
            this.getArrowUp(x2, y2);
    },

    /* TWO CURVES X-AXIS*/
    getPathLeftToRightBottom: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.y, y2 = coords.h;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + (xh - c) + "," + y1 + " " +  // Go half the way
            "S " + xh + "," + y1 + " " + xh + "," + (y1 + c) + " " + // Create a corner
            "L " + xh + "," + (y2 - c) + " " +  // Go down in y-axis
            "S " + xh + "," + y2 + " " + (xh + c) + "," + y2 + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go another half-way
            this.getArrowRight(x2, y2);

    },

    getPathLeftToRightTop: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.h, y2 = coords.y;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + (xh - c) + "," + y1 + " " +  // Go half the way
            "S " + xh + "," + y1 + " " + xh + "," + (y1 - c) + " " + // Create a corner
            "L " + xh + "," + (y2 + c) + " " +  // Go up in y-axis
            "S " + xh + "," + y2 + " " + (xh + c) + "," + y2 + " " + // Create a corner
            "L " + x2  + "," + y2 + " " +  // Go another half-way
            this.getArrowRight(x2, y2);
    },

    getPathRightToLeftBottom: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.y, y2 = coords.h;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + (xh + c) + "," + y1 + " " +  // Go half the way in reverse
            "S " + xh + "," + y1 + " " + xh + "," + (y1 + c) + " " + // Create a corner
            "L " + xh + "," + (y2 - c) + " " +  // Go down in y-axis
            "S " + xh + "," + y2 + " " + (xh - c) + "," + y2 + " " + // Create a corner
            "L " + x2  + "," + y2 + " " +  // Go another half-way in reverse
            this.getArrowLeft(x2, y2);
    },

    getPathRightToLeftTop: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.h, y2 = coords.y;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + (xh + c) + "," + y1 + " " +  // Go half the way in reverse
            "S " + xh + "," + y1 + " " + xh + "," + (y1 - c) + " " + // Create a corner
            "L " + xh + "," + (y2 + c) + " " +  // Go up in y-axis
            "S " + xh + "," + y2 + " " + (xh - c) + "," + y2 + " " + // Create a corner
            "L " + x2  + "," + y2 + " " +  // Go another half-way in reverse
            this.getArrowLeft(x2, y2);
    },

    /* TWO CURVES Y-AXIS*/
    getPathTopToBottomLeft: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.y, y2 = coords.h;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (yh - c) + " " +  // Go half the way down
            "S " + x1 + "," + yh + " " + (x1 + c) + "," + yh + " " + // Create a corner
            "L " + (x2 - c) + "," + yh + " " +  // Go left in y-axis
            "S " + x2 + "," + yh + " " + x2 + "," + (yh + c) + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go another half-way
            this.getArrowDown(x2, y2);

    },

    getPathTopToBottomRight: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.y, y2 = coords.h;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (yh - c) + " " +  // Go half the way down
            "S " + x1 + "," + yh + " " + (x1 - c) + "," + yh + " " + // Create a corner
            "L " + (x2 + c) + "," + yh + " " +  // Go right in y-axis
            "S " + x2 + "," + yh + " " + x2 + "," + (yh + c) + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go another half-way
            this.getArrowDown(x2, y2);
    },

    getPathBottomToTopLeft: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.h, y2 = coords.y;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (yh + c) + " " +  // Go half the way up
            "S " + x1 + "," + yh + " " + (x1 + c) + "," + yh + " " + // Create a corner
            "L " + (x2 - c) + "," + yh + " " +  // Go left in y-axis
            "S " + x2 + "," + yh + " " + x2 + "," + (yh - c) + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go another half-way
            this.getArrowUp(x2, y2);

    },

    getPathBottomToTopRight: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.h, y2 = coords.y;
        var xh = coords.w/2, yh = coords.h/2, c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (yh + c) + " " +  // Go half the way up
            "S " + x1 + "," + yh + " " + (x1 - c) + "," + yh + " " + // Create a corner
            "L " + (x2 + c) + "," + yh + " " +  // Go right in y-axis
            "S " + x2 + "," + yh + " " + x2 + "," + (yh - c) + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go another half-way
            this.getArrowUp(x2, y2);

    },

    /* ONE CURVE */
    getPathBottomToLeft: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.y, y2 = coords.h;
        var c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (y2 - c) + " " +  // Go down in y-axis
            "S " + x1 + "," + y2 + " " + (x1 + c) + "," + y2 + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go to final position
            this.getArrowRight(x2, y2);
    },

    getPathBottomToRight: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.y, y2 = coords.h;
        var c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (y2 - c) + " " +  // Go down in y-axis
            "S " + x1 + "," + y2 + " " + (x1 - c) + "," + y2 + " " + // Create a corner
            "L " + x2 + "," + y2 + " " + // Go to final position (reverse)
            this.getArrowLeft(x2, y2);
    },

    getPathTopToLeft: function(coords){
        var x1 = coords.x, x2 = coords.w, y1 = coords.h, y2 = coords.y;
        var c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (y2 + c) + " " +  // Go up in y-axis
            "S " + x1 + "," + y2 + " " + (x1 + c) + "," + y2 + " " + // Create a corner
            "L " + x2 + "," + y2 + " " +  // Go to final position
            this.getArrowRight(x2, y2);
    },

    getPathTopToRight: function(coords){
        var x1 = coords.w, x2 = coords.x, y1 = coords.h, y2 = coords.y;
        var c = this.curve;
        return      "M "  + x1 + "," + y1 + " " + // Start position
            "L " + x1 + "," + (y2 + c) + " " +  // Go up in y-axis
            "S " + x1 + "," + y2 + " " + (x1 - c) + "," + y2 + " " + // Create a corner
            "L " + x2 + "," + y2 + " " + // Go to final position (reverse)
            this.getArrowLeft(x2, y2);
    },

    /* ARROWS */
    getArrowRight: function(x, y){
        var ah = this.arrowHeight/2;
        return  "m -" + ah + ",-" + ah + " " +
            "l " + ah + "," + ah + " " +
            "l -" + ah + "," + ah;
    },

    getArrowLeft: function(x, y){
        var ah = this.arrowHeight/2;
        return  "m " + ah + ",-" + ah + " " +
            "l -" + ah + "," + ah + " " +
            "l " + ah + "," + ah;
    },

    getArrowUp: function(x, y){
        var ah = this.arrowHeight/2;
        return  "m -" + ah + "," + ah + " " +
            "l " + ah + ",-" + ah + " " +
            "l " + ah + "," + ah;
    },

    getArrowDown: function(x, y){
        var ah = this.arrowHeight/2;
        return  "m -" + ah + ",-" + ah + " " +
            "l " + ah + "," + ah + " " +
            "l " + ah + ",-" + ah;
    }

});