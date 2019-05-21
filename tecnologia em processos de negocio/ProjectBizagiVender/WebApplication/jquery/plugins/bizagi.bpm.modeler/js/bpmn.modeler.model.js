bizagi.bpmn.modeler.observable.extend("bizagi.bpmn.modeler.model", {}, {

    /* Constructor */
    init: function() {
        this.tasks = {};
        this.canvas = {};
    },

    setModel: function(model){
        this.tasks = model.tasks;
        this.canvas = model.canvas;
        this.triggerModelRedraw();
    },

    /************************************************************************
     GETTERS SECTION
     ************************************************************************/

    getViewModel: function(){
        var task_list = [];
        for( val in this.tasks){
            task_list.push(this.tasks[val]);
        }
        return {
            tasks: task_list,
            canvas: this.canvas,
            isGateway: this.isGateway
        };
    },

    getPersistenceModel: function(){
        var result = { tasks:  jQuery.extend({}, this.tasks), canvas:   jQuery.extend({}, this.canvas)};
        $.each(result.tasks, function(i, task){
            // Remove showAura
            delete task.showAura;
        });
        return result;
    },

    getTaskById: function(id){
        return this.tasks[id];
    },

    getConnectionRule: function(sourceTaskId, targetTaskId){
        var source = this.tasks[sourceTaskId];
        if (!this.isGateway(source.type)) return null;

        // Connection rules only work for gateways
        var rule = $.grep(source.rules, function(rule){
            return rule.target == targetTaskId;
        });
        //return rule.length > 0? rule[0].expression: "missing";
        return rule.length > 0? rule[0].expression: null;
    },

    successorConnectionsCanContainRule: function(task){
        var task = this.tasks[task];
        return this.isGateway(task.type);
    },

    /************************************************************************
     CANVAS MANAGEMENT SECTION
     ************************************************************************/
    setCanvasBounds: function(bounds){
        this.canvas = bounds;
        this.triggerModelChange({redraw: false});
    },

    /************************************************************************
     EXTENDED PROPERTIES SECTION
     ************************************************************************/

    setExtendedProperty: function(id, property, value){
        if (this.tasks[id]){
            // make sure we have extendedProperties
            this.tasks[id].extendedProperties = this.tasks[id].extendedProperties || {};
            this.tasks[id].extendedProperties[property] = value;

            // Publish event but don't redraw'
            this.triggerModelChange({redraw: false});
        }
    },

    getExtendedProperty: function(id, property){
        if (this.tasks[id]){
            return this.tasks[id].extendedProperties[property];
        }
        return null;
    },

    /************************************************************************
     ADD SECTION
     ************************************************************************/

    addTask: function(taskType, position, predecessor){
        var task = {
            id: this.newGuid(),
            type: taskType,
            displayName: this.getDefaultName(taskType),
            duration: this.getDuration(taskType),
            position: position,
            showAura: false,
            predecessors: [],
            successors: [],
            rules: [],
            extendedProperties: {}
        };
        // Add predecessor
        if (predecessor) task.predecessors.push(predecessor);

        // Add the new task
        this.tasks[task.id] = task;

        // Add succesor to predecessor
        if (this.tasks[predecessor]) this.tasks[predecessor].successors.push(task.id);

        // Set the new task, to use the aura
        this.setAura(task.id, true);

        // Publish event
        this.triggerModelChange();
    },

    addConnection: function(sourceTaskId, targetTaskId){
        var source = this.tasks[sourceTaskId];
        var target = this.tasks[targetTaskId];
        source.successors.push(targetTaskId);
        target.predecessors.push(sourceTaskId);

        // Publish event
        this.triggerModelChange();
    },

    /************************************************************************
     EDIT SECTION
     ************************************************************************/

    changeTaskName: function(id, newDisplayName){
        if (this.tasks[id]){
            if (this.tasks[id].displayName == newDisplayName) return;
            this.tasks[id].displayName = newDisplayName;
            // Publish event but don't redraw'
            this.triggerModelChange({redraw: false});
        }
    },

    changeDuration: function(id, duration){
        if (this.tasks[id]){
            if (this.tasks[id].duration == duration) return;
            this.tasks[id].duration = duration;
            // Publish event but don't redraw'
            this.triggerModelChange({redraw: false});
        }
    },

    changeTaskType: function(id, newType){
        if (this.tasks[id]){
            if (this.tasks[id].type == newType) return;
            this.tasks[id].type = newType;
            // Publish event
            this.triggerModelChange();
        }
    },

    moveTask: function(id, position){
        if (this.tasks[id]){
            this.tasks[id].position = position;

            // Publish event
            this.triggerModelChange();
        }
    },

    setAura: function(id, showAura){
        $.each(this.tasks, function( key, task ) {
            task.showAura = false;
        });
        if (this.tasks[id]) this.tasks[id].showAura = showAura;
    },

    setConnectionRule: function(sourceTaskId, targetTaskId, expression){
        var source = this.tasks[sourceTaskId];

        // Get / create rule
        var rules = $.grep(source.rules, function(rule){
            return rule.target == targetTaskId;
        });
        var rule = rules.length > 0 ? rules[0] : {target: targetTaskId};
        if (rules.length == 0)  source.rules.push(rule);

        // Change rule (possible values: boolean/else)
        rule.expression = expression;

        // Publish event
        this.triggerModelChange();
    },

    /************************************************************************
     DELETE SECTION
     ************************************************************************/

    deleteTask: function(id){
        $.each(this.tasks, function( key, task ) {
            // Remove from predecessors
            if(task.predecessors && task.predecessors.length > 0) task.predecessors.removeAll(id);
            // Remove from successors
            if(task.successors && task.successors.length > 0) task.successors.removeAll(id);
        });

        // Remove task
        delete this.tasks[id];

        // Publish event
        this.triggerModelChange();
    },

    deleteArrow: function(sourceTaskId, targetTaskId){
        var source = this.tasks[sourceTaskId];
        var target = this.tasks[targetTaskId];
        if (source) source.successors.removeAll(targetTaskId);
        if (target) target.predecessors.removeAll(sourceTaskId);

        // Publish event
        this.triggerModelChange();
    },

    /************************************************************************
     MISC METHODS SECTION
     ************************************************************************/

    newGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    getDefaultName: function(taskType){
        if (taskType == "UserTask"){
            var manualTasks = $.grep(Object.values(this.tasks), function(task) { return task.type == "UserTask"; });
            return "Task " +(manualTasks.length + 1);
        }
        return null;
    },

    getDuration: function(taskType){
        if (taskType == "UserTask"){
            return 1;
        }
        return null;
    },

    triggerModelRedraw: function(){
        this.publish("model.redraw");
    },

    triggerModelChange: function(params){
        params = params || {redraw: true};
        this.publish("model.change");
        if (params.redraw) this.triggerModelRedraw();
    },

    isGateway: function(type){
        return type == "ExclusiveGateway" || type == "ParallelGateway" || type == "InclusiveGateway" || type == "ComplexGateway";
    }
});