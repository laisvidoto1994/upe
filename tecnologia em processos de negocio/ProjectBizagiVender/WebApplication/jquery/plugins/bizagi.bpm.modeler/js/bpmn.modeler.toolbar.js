bizagi.bpmn.modeler.observable.extend("bizagi.bpmn.modeler.toolbar", {

    /* STATIC STUFF */
    bpmShapes:  {
        "StartEvent": "bpmn-icon-start-event-none",
        "IntermediateEvent":"bpmn-icon-intermediate-event-none",
        "EndEvent": "bpmn-icon-end-event-none",
        "TerminateEvent": "bpmn-icon-end-event-terminate",
        "ExclusiveGateway": "bpmn-icon-gateway-xor",
        "ParallelGateway": "bpmn-icon-gateway-parallel",
        "InclusiveGateway": "bpmn-icon-gateway-or",
        "ComplexGateway": "bpmn-icon-gateway-complex",
        "UserTask": "bpmn-icon-task"
    },

    getClassForType: function(type){
        return this.bpmShapes[type];
    }

},{

    /* INSTANCE STUFF */

    /* Constructor */
    init: function() {
        // Define converter for task type class
        $.views.converters("tasktype_class", function(val) {
            return bizagi.bpmn.modeler.toolbar.getClassForType(val);
        });

        $.templates({
            bpm_modeler_toolbar: '<toolbar> {{for items tmpl="bpm_modeler_toolbarItem"/}}</toolbar>',
            bpm_modeler_toolbarItem: '<item class="bpm-{{:#data}} {{tasktype_class: #data}}  bpm-cloneable" data-type="{{:#data}}"></item>'
        });

        // Define items
        this.items =  [
            "StartEvent",
            "IntermediateEvent",
            "EndEvent",
            "ExclusiveGateway",
            "UserTask"
        ];
    },

    render: function(canvas){
        var that = this;
        this.canvas =canvas;

        // Render template
        var html = $.templates.bpm_modeler_toolbar.render({items: this.items});
        this.canvas.append(html);

        // Make items draggable
        canvas.find("item").draggable({
            helper: "clone",
            containment: "#bpm-drawing",
            grid: [20, 20],
            drag: $.proxy(this.onItemDragging, this)
        });
    },

    onItemDragging: function( event, ui){
        this.publish("item.dragging", ui);
    }
});