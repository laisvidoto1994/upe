bizagi.bpmn.modeler.observable.extend("bizagi.bpmn.modeler.drawing", {}, {

    /* Constructor */
    init: function(model) {
        var that = this;

        $.templates({
            bpm_modeler_drawing: '<drawing> \
                                    {{for tasks tmpl="bpm_modeler_drawingItem"/}} \
                                  </drawing>',
            bpm_modeler_drawingItem: '<item id="{{: id}}" class="bpm-{{:type}} bpm-moveable" \
                                            style="left:{{:position.x}}px; top:{{:position.y}}px" \
                                            data-type="{{: type}}"\
                                            data-show-aura="{{:showAura}}"> \
                                            <label class="label_task_name">{{:displayName}}</label> \
                                            {{if ~root.isGateway(type)}}<gateway-helper></gateway-helper>{{/if}} \
                                            {{if duration}}<duration>{{:duration}}</duration>{{/if}} \
                                       </item>'
        });

        // Set model
        this.drawingWidth = 0;
        this.drawingHeight = 0;
        this.model = model;
        this.model.subscribe("model.redraw", $.proxy(this.refresh, this));

        // Create dependencies
        this.aura = new bizagi.bpmn.modeler.aura(this.model);
        this.aura.subscribe("item.drag", $.proxy(this.onElementDragging, this));
        this.aura.subscribe("arrow.drag", $.proxy(this.onArrowDragging, this));
        this.aura.subscribe("arrow.setExpression", $.proxy(this.editExpressionForArrow, this));
        this.aura.subscribe("arrow.setElse", $.proxy(this.triggerElseExpressionForArrow, this));
        this.aura.subscribe("task.externaloption", $.proxy(this.manageExternalOption, this));

        this.connector = new bizagi.bpmn.modeler.connector();
    },

    render: function( canvas, readOnly ){
        var that = this;
        this.readOnly = readOnly || false;
        var initializeGeneralHandlers = (this.canvas == null);
        this.canvas = canvas;

        // Render template
        var viewModel = this.model.getViewModel();
        //console.log(viewModel);
        var html = $.templates.bpm_modeler_drawing.render(viewModel);
        canvas.append(html);
        // Set drawing canvas
        this.drawing = canvas.find("drawing");
        // Calculate size for drawing
        this.canvasWidth = canvas.width();
        this.canvasHeight = canvas.height();
        this.scrollTop =  viewModel.canvas.top || 0;
        this.scrollLeft =  viewModel.canvas.left || 0;
        this.drawingWidth = viewModel.canvas.width || this.canvasWidth;
        this.drawingHeight = viewModel.canvas.height || this.canvasHeight;
        //this.drawing.css({ minWidth: this.canvasWidth, minHeight: this.canvasHeight, width: this.drawingWidth, height: this.drawingHeight});
        this.canvas.scrollLeft(this.scrollLeft);
        this.canvas.scrollTop(this.scrollTop);

        // Add connectors
        setTimeout(function(){ that.addConnectors(viewModel); }, 0);

        // Add event handlers
        this.addHandlers();

        // Add general event handlers (ONLY ONCE)
        if (initializeGeneralHandlers && !this.readOnly ) this.addGeneralHandlers();

        // Show aura for item where data-show-aura = true
        this.drawing.find("item[data-show-aura=true]").click();

        /*
         *** La siguiente funcion evular si el nombre la tarea sale del tamaño del label contenedor
         */
        $("#bpm-drawing").find(".label_task_name ").each(function(index, obj){
            var value = $(obj).text();
            if( that.setNameTask( value,$(obj) ) ){
                $(obj).text(value.substring(0,20) + '...');
            }else{
                $(obj).text(value);
            }
        });
    },

    refresh: function(){
        this.canvas.empty();
        this.aura.hide();
        this.render(this.canvas);
    },
    /************************************************************************
     HANDLER CONFIGURATION SECTION
     ************************************************************************/
    addHandlers: function(){
        // Add movement to items
        this.drawing.find("item").draggable({
            containment: "#bpm-drawing",
            grid: [20, 20],
            drag: $.proxy(this.onTaskDragging, this)
        });

        // Configure drop area
        this.configureDroppable();
    },

    addGeneralHandlers: function(){
        // Make items clickable
        this.canvas.on("click", "item", $.proxy(this.showAura, this));

        // Edit task name
        this.canvas.on("dblclick", "item label", $.proxy(this.editTaskName, this));

        // Edit task duration
        this.canvas.on("dblclick", "item duration", $.proxy(this.editDuration, this));

        // Make arrows clickable
        this.canvas.on("click", "connector", $.proxy(this.showAuraForArrow, this));
    },

    configureDroppable: function(){
        var that = this;
        this.drawing.droppable({
            // We use a setTimeout to avoid some weird error from jquery ui
            drop: function(event, ui) { setTimeout(function() {
                if (ui.helper.hasClass("bpm-cloneable")) that.addTask(ui);
                else if  (ui.helper.hasClass("bpm-moveable")) that.moveTask(ui);
                else if  (ui.helper.hasClass("bpm-option-arrow")) that.addArrow(ui);
            }, 0);},
            accept: ".bpm-cloneable, .bpm-moveable, .bpm-option-arrow"
        });

    },

    /************************************************************************
     MODEL MODIFIERS SECTION
     ************************************************************************/
    addTask: function(ui){
        var type = ui.draggable.data("type");
        var predecessor = ui.draggable.data("predecessor");
        var pos = this.fixPosition(ui.offset);
        var x = pos.left;
        var y = pos.top;

        /* Align to the grid*/
        x = x - (x%20);
        y = y - (y%20);
        this.model.addTask(type, {x: x, y: y}, predecessor);
    },

    moveTask: function(ui){
        var type = ui.draggable.data("type");
        var id = ui.draggable.attr("id");
        var x = ui.position.left;
        var y = ui.position.top;

        /* Align to the grid*/
        x = x - (x%20);
        y = y - (y%20);

        this.model.moveTask(id, {x: x, y: y});
    },

    editTaskName: function(ev, params){
        var that = this;
        var label = $(ev.currentTarget);
        var taskId = label.parent().attr("id");
        var input = $("<input type='text' />");
        input.val(label.text());
        this.showPopupEditor(label, input, function(value){
            that.model.changeTaskName(taskId, value);
            if( that.setNameTask(value,label) ) {
                label.text(value.substring(0, 20) + '...');
            }else{
                label.text(value);
            }
        });
    },

    manageExternalOption: function(ev, params){
        this.publish("drawing.externaloption", params);
    },

    editDuration: function(ev, params){
        var that = this;
        var label = $(ev.currentTarget);
        var taskId = label.parent().attr("id");
        var input = $('<input type="number" min="1" onkeypress="if(this.value.length==4) return false; return event.charCode >= 48 && event.charCode <= 57"/>');
        input.val(label.text());
        this.showPopupEditor(label, input, function(value){
            that.model.changeDuration(taskId, value);
            label.text(value);
        });
    },

    addArrow: function(ui){
        var source = ui.draggable.data("predecessor");
        var position = this.fixPosition(ui.offset);
        var tasksAtPosition = this.getTasksAtPosition(position);
        if (tasksAtPosition.length == 1){
            // Add connection in model
            var target = tasksAtPosition.attr("id");
            this.model.addConnection(source, target);
        } else {
            //  Remove temporal arrow
            this.connector.removeTemporalConnector(this.canvas);
        }
    },

    editExpressionForArrow: function(ev, arrowId){
        var source = bizagi.bpmn.modeler.connector.getSourceTaskFromId(arrowId);
        var target = bizagi.bpmn.modeler.connector.getTargetTaskFromId(arrowId);
        this.publish("drawing.externaloption", {option: "rule", source: source, target: target});
    },

    triggerElseExpressionForArrow: function(ev, arrowId){
        var source = bizagi.bpmn.modeler.connector.getSourceTaskFromId(arrowId);
        var target = bizagi.bpmn.modeler.connector.getTargetTaskFromId(arrowId);
        this.publish("drawing.externaloption", {option: "else", source: source, target: target});
    },

    setExpressionForArrow: function(sourceTaskId, targetTaskId){
        this.model.setConnectionRule(sourceTaskId, targetTaskId, "boolean");
    },

    moveCanvas: function(ev, ui){
        var DISTANCE = 100;
        var element = $(ev.target);
        var tag = element.prop("tagName").toLowerCase();
        if (tag == "move-right"){
            this.scrollLeft += DISTANCE;
            if (this.canvasWidth + this.scrollLeft >= this.drawingWidth) this.drawingWidth += DISTANCE;
        }
        if (tag == "move-left"){
            this.scrollLeft -= DISTANCE;
        }
        if (tag == "move-top"){
            this.scrollTop -= DISTANCE;
        }
        if (tag == "move-bottom"){
            this.scrollTop += DISTANCE;
            if (this.canvasHeight + this.scrollTop >= this.drawingHeight) this.drawingHeight += DISTANCE;
        }

        // Validations
        if (this.scrollTop < 0) this.scrollTop = 0;
        if (this.scrollLeft < 0) this.scrollLeft = 0;

        // Apply changes
        this.drawing.width(this.drawingWidth);
        this.drawing.height(this.drawingHeight);
        this.canvas.scrollLeft(this.scrollLeft);
        this.canvas.scrollTop(this.scrollTop);

        // Update model
        this.model.setCanvasBounds({
            top: this.scrollTop,
            left: this.scrollLeft,
            width: this.drawingWidth,
            height: this.drawingHeight
        });
    },

    /************************************************************************
     DRAGGING HANDLERS
     ************************************************************************/
    onTaskDragging: function( event, ui){
        this.redrawConnector(ui.helper.attr("id"), ui.position);

        // Move aura
        this.aura.moveTo(ui.helper);
        this.onElementDragging(event, ui);
    },

    onArrowDragging: function(ev, params){
        var drawing = this.drawing;

        // Fixes position to make it relative to drawing container
        var position = this.fixPosition(params.target);

        // Draw temporal connector
        this.connector.drawTemporalConnector(drawing, drawing.find("#" + params.source), position);

        // Find hovering task
        var draggingOverTasks = this.getTasksAtPosition(position);

        // Remove class to all elements
        drawing.find("item").removeClass("dragging-arrow");

        // Add class to tasks where the cursor is hovering when dragging
        draggingOverTasks.addClass("dragging-arrow");
    },

    onElementDragging: function(ev, ui){
        // TO BE IMPLEMENTED MAYBE, THE IDEA IS TO PERFORM SCROLL AUTOMATICALLY
    },

    /************************************************************************
     CONNECTORS CONFIGURATION SECTION
     ************************************************************************/
    redrawConnector: function(taskId){
        var that = this;
        var task = this.model.getTaskById(taskId);
        var drawing = this.drawing;
        $.each(task.predecessors, function(i, predecessorId){
            if (predecessorId){
                that.connector.refresh(drawing, drawing.find("#" + predecessorId), drawing.find("#" + taskId));
            }
        });
        $.each(task.successors, function(i, successorId){
            if (successorId){
                that.connector.refresh(drawing, drawing.find("#" + taskId), drawing.find("#" + successorId));
            }
        });
    },

    addConnectors: function(viewModel){
        var that = this;
        $.each(viewModel.tasks, function (i, task) {
            $.each(task.successors, function(j, successorId){
                that.addConnector(task.id, successorId);
            });
        });
    },

    addConnector: function(task1, task2){
        var expression = this.model.getConnectionRule(task1, task2);
        this.connector.connect(this.drawing, this.drawing.find("#" + task1), this.drawing.find("#" + task2), expression);
    },

    /************************************************************************
     AURA CONFIGURATION SECTION
     ************************************************************************/
    showAura: function(ev){
        var task = $(ev.currentTarget);

        var auraShown = this.aura.showForTask(task);
        this.model.setAura(task.id, auraShown);

        this.drawing.find("*").removeClass("active");
        if (auraShown){
            // Remove active class from all items, and add it to this one
            task.addClass("active");
        }
    },

    showAuraForArrow: function(ev){
        var arrow = $(ev.currentTarget);
        var id = arrow.attr("id");
        var sourceTask = bizagi.bpmn.modeler.connector.getSourceTaskFromId(id);
        var showRuleOption = this.model.successorConnectionsCanContainRule(sourceTask);
        var auraShown = this.aura.showForArrow(arrow, showRuleOption);
        this.drawing.find("*").removeClass("active");
        if (auraShown){
            arrow.addClass("active");
        }
    },

    /************************************************************************
     HELPERS SECTION
     ************************************************************************/
    getTasksAtPosition: function(position){
        return  this.drawing.find("item")
            .filter(function() {
                var el = $(this);
                var pos = el.position();
                var coords = {x: pos.left, y: pos.top, w: el.width(), h: el.height()};
                return ( coords.x <= position.left && position.left <= (coords.x + coords.w) ) &&
                    ( coords.y <= position.top && position.top <= (coords.y + coords.h) );
            });
    },

    showPopupEditor: function(label, input, callback){
        // Create input
        label.hide();
        label.after(input);
        input.focus();
        input.select();

        var closeEditor =  function(){
            var value = input.val();
            callback(value);
            label.show();
            input.detach();
        };

        // Change handler
        input.keypress(function(ui){
            if (ui.key == "Enter"){
                closeEditor();
            }

        });

        // Close up handler
        input.click(function(e){ e.preventDefault(); return false;});
        this.drawing.one("click", closeEditor);
    },

    fixPosition: function(position){
        // Fixes position to make it relative to drawing container
        var relative = this.drawing.offset();
        position.left -= relative.left;
        position.top -= relative.top;
        return position;
    },
    setNameTask: function( text, obj){
        if(text.length > 20 || obj.height() > 34){
            return true;
        }
    }

});