$.Class.extend("bizagi.bpmn.modeler.connector", {

    /* STATIC STUFF */
    buildConnectorId: function(source, target){
        return "svgFrom_" + source + "_to_" + target;
    },

    getSourceTaskFromId: function(id){
        var i1 = id.indexOf("svgFrom_");
        var i2 = id.indexOf("_to_");
        return id.substring(i1 + 8, i2);
    },

    getTargetTaskFromId: function(id){
        var i1 = id.indexOf("_to_");
        return id.substring(i1 + 4);
    },


}, {
    /* INSTANCE STUFF */

    /* Constructor */
    init: function() {
        $.templates({
            bpm_modeler_connector: '<connector style="position:absolute;left:{{:left}}px;top:{{:top}}px" \
                                                id="{{:id}}" \
                                                class="bpm-{{:expression}}" \
                                                data-expression="{{:expression}}"> \
                                        <svg width="{{:width}}" height="{{:height}}"> \
                                            <path d="{{:path}}" fill="none" stroke="{{:stroke}}" transform="{{:transform}}"/> \
                                        </svg> \
                                        {{if expression == "else"}} <connector-label>else</connection-label> {{/if}} \
                                    </connector>'

        });

        // Create dependencies
        this.path = new bizagi.bpmn.modeler.path();
        this.stroke = "#000";
    },

    connect: function(canvas, task1, task2, expression){
        var el1 = this.getBounds(task1);
        var el2 = this.getBounds(task2);
        var id = this.Class.buildConnectorId(task1.attr("id"), task2.attr("id"));
        this.drawLine(canvas, id, el1, el2, expression);
    },

    drawLine: function(canvas, id, el1, el2, expression){
        // Adjust positions for better fit
        var anchors = this.modifyPositions(el1, el2);
        var data = {
            id: id,
            top: this.getTop(el1, el2),
            left: this.getLeft(el1, el2),
            width: this.getWidth(el1, el2),
            height: this.getHeight(el1, el2),
            transform: this.path.getTransform(anchors, el1, el2),
            expression: expression,
            stroke: this.stroke
        };

        // Create path
        data.path =this.path.getPath(data, anchors, el1, el2);
        var html = $.templates.bpm_modeler_connector.render(data);
        connector = $(html);
        canvas.append(connector);

        // If ELSE
        if (expression == "else"){
            var svg = connector.find("svg");
            var elseLabel = connector.find("connector-label");
            elseLabel.position({ of: svg, my: "center center",  at: "center center", collision: "none"});
        }
    },

    refresh: function(canvas, task1, task2){
        var id = this.Class.buildConnectorId(task1.attr("id"), task2.attr("id"));
        var line = $("#" + id);
        var expression = line.data("expression");
        line.detach();
        this.connect(canvas, task1, task2, expression);
    },

    drawTemporalConnector: function(canvas, sourceTask, target){
        var id = "svgTemporalConnector";

        // Remove previous line
        canvas.find("#" + id).detach();

        // Draw a new line
        var el1 = this.getBounds(sourceTask);
        var el2 = {x: target.left, y: target.top, width: 0, height: 0};
        this.drawLine(canvas, id, el1, el2);
    },

    removeTemporalConnector: function(canvas){
        var id = "svgTemporalConnector";

        // Remove 
        canvas.find("#" + id).detach();
    },

    getBounds: function(element){
        var position = element.position();
        return {x: position.left, y: position.top, width: element.outerWidth(), height: element.outerHeight()};
    },

    getLeft: function(el1, el2){
        return Math.min(el1.x, el2.x) - this.path.arrowHeight;
    },

    getTop: function(el1, el2){
        return Math.min(el1.y, el2.y) - this.path.arrowHeight;
    },

    getWidth: function(el1, el2){
        return Math.abs(el1.x - el2.x) + this.path.arrowHeight * 2;
    },

    getHeight: function(el1, el2){
        return Math.abs(el1.y - el2.y) + this.path.arrowHeight * 2;
    },

    modifyPositions: function(el1, el2){
        var anchors = this.path.calculateAnchors(el1, el2);
        // Modify according anchors
        this.adjustToAnchor(el1, anchors.el1);
        this.adjustToAnchor(el2, anchors.el2);

        return anchors;
    },

    adjustToAnchor: function(el, anchor){
        if (anchor == "top" || anchor == "bottom") el.x = el.x + el.width / 2 // adjust to x-center
        if (anchor == "left"  || anchor == "right") el.y = el.y + el.height / 2 // adjust to y-center
        if (anchor == "bottom") el.y = el.y + el.height; // Put to bottom
        if (anchor == "right") el.x = el.x + el.width; // Put to right
    }
});