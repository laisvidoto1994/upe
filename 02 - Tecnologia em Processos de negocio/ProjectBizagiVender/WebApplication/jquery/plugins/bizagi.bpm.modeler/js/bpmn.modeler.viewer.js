bizagi.bpmn.modeler.observable.extend("bizagi.bpmn.modeler.viewer", {}, {

    /* Constructor */
    init: function( params ) {
        $.templates({
            bpm_modeler_viewer_container: '<bpm-modeler> \
                            <div id="bpm-toolbar"></div> \
                            <div id="bpm-drawing"></div> \
                            <move-helper> \
                                <move-top class="bpm-move"></move-top> \
                                <move-left class="bpm-move"></move-left> \
                                <move-bottom class="bpm-move"></move-bottom> \
                                <move-right class="bpm-move"></move-right> \
                            </move-helper> \
                        </bpm-modeler>'
        });

        // Create  model
        this.model = new bizagi.bpmn.modeler.model();
        this.model.subscribe("model.change", $.proxy(this.changed, this));
        if (params && params.model) this.model.setModel(params.model);

        // Declare dependencies
        this.drawing = new bizagi.bpmn.modeler.drawing(this.model);
        this.drawing.subscribe("drawing.externaloption", $.proxy(this.manageExternalOption, this));
        this.toolbar = new bizagi.bpmn.modeler.toolbar();
        this.toolbar.subscribe("item.dragging", $.proxy(this.onToolbarItemDragging, this));

        if(typeof params === "undefined"){
            this.model.isReadOnly = false;
        }else{
            this.model.isReadOnly = params.isReadOnly;
        }
    },

    render: function(canvas){
        this.canvas = canvas;

        //  Evaluate if flag readOnly is true
        this.isReadOnly = this.validateIsReadOnly( this.model );

        // Render container
        var container = $.templates.bpm_modeler_viewer_container.render();
        this.canvas.html(container);

        // Render dependencies if the process not is read only
        if( this.isReadOnly ){
            this.renderDrawing( this.isReadOnly );
        }else{
            this.renderToolbar();
            this.renderDrawing( this.isReadOnly );
        }
        // Assign move handlers
        this.canvas.on("click", ".bpm-move", $.proxy(this.moveCanvas, this))
    },
    validateIsReadOnly : function( model ){
        if(model.isReadOnly) return true;
    },
    renderToolbar: function(){
        var toolbarCanvas = this.canvas.find("#bpm-toolbar");
        this.toolbar.render(toolbarCanvas);
    },

    renderDrawing: function( state ){
        var drawingCanvas = this.canvas.find("#bpm-drawing");
        this.drawing.render(drawingCanvas, state);
    },

    moveCanvas: function(ev, ui){
        this.drawing.moveCanvas(ev, ui);
    },

    onToolbarItemDragging: function( event, ui){
        this.drawing.onElementDragging(event, ui);
    },

    manageExternalOption: function(ev, params){
        this.publish("bpm.modeler.externalOption", params);
    },

    setConnectionExpression: function(source, target){
        this.drawing.setExpressionForArrow(source, target);
    },

    save: function(){
        return this.model.getPersistenceModel();
    },

    load: function(json){
        this.model.setModel(json);
    },

    changed: function(){
        this.publish("bpm.modeler.changed");
    },

    setExtendedProperty: function(taskId, property, value){
        this.model.setExtendedProperty(taskId, property, value);
    },

    getExtendedProperty: function(taskId, property){
        return this.model.getExtendedProperty(taskId, property);
    }
});

// Utility functions -> Move to bizagi.js
if (!Array.prototype.removeOne) {
    Array.prototype.removeOne = function (item) {
        for(var i = this.length; i--;) {
            if(this[i] === item) {
                this.splice(i, 1);
                return;
            }
        }
    };
}
if (!Array.prototype.removeAll) {
    Array.prototype.removeAll = function (item) {
        for(var i = this.length; i--;) {
            if(this[i] === item) {
                this.splice(i, 1);
            }
        }
    };
}