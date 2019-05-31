bizagi.bpmn.modeler.observable.extend("bizagi.bpmn.modeler.aura",
    {
        /* STATIC STUFF */
        externalOptions:  {
            "form": "bz-icon bz-icon-template-outline",
            "assignee":"bz-icon bz-icon-user-manage"
        },

        getClassForExternalOption: function(type){
            return this.externalOptions[type];
        }

    }, {

        /* INSTANCE STUFF */

        /* Constructor */
        init: function(model) {
            // Define converter for task type class        
            $.views.converters("externaloption_class", function(val) {
                return bizagi.bpmn.modeler.aura.getClassForExternalOption(val);
            });

            $.templates({
                bpm_modeler_aura: '<aura class="bpm-aura-for-{{:type}}"> \
                                    {{if showArrow}} \
                                            <aura-option class="bpm-option-arrow bpmn-icon-connection-multi" data-predecessor="{{:~root.id}}"></aura-option> \
                                    {{/if}} \
                                    {{for options tmpl="bpm_modeler_auraOption"/}} \
                                    <special-options {{if showRuleOption}} class="bpm-show-rule-option" {{/if}}> \
                                        <special-option class="bpm-option-delete bpmn-icon-trash"></special-option> \
                                        {{if showRuleOption}} \
                                            <special-option class="bpm-option-expression bpmn-icon-conditional-flow"></special-option> \
                                            <special-option class="bpm-option-else bpmn-icon-default-flow"></special-option> \
                                        {{/if}} \
                                        {{if changeTo && changeTo.length > 0}} \
                                        <special-option class="bpm-option-change bz-icon bz-icon-asynchronous-outline"></special-option> \
                                        <aura-change> \
                                            {{for changeTo tmpl="bpm_modeler_auraChangeTo"/}} \
                                        </aura-change> \
                                        {{/if}} \
                                    </special-options> \
                                    {{if externalOptions && externalOptions.length > 0}} \
                                        <external-options> \
                                            {{for externalOptions tmpl="bpm_modeler_auraExternalOption"/}} \
                                        </external-options> \
                                    {{/if}} \
                                </aura>',
                bpm_modeler_auraOption: '<aura-option class="bpm-{{:#data}} {{tasktype_class: #data}} bpm-cloneable" \
                                            data-type="{{:#data}}" \
                                            data-predecessor="{{:~root.id}}"> \
                                        </aura-option>',
                bpm_modeler_auraChangeTo: '<aura-change-to class="bpm-{{:#data}} {{tasktype_class: #data}}"  \
                                                data-type="{{:#data}}" \
                                                data-task="{{:~root.id}}"> \
                                        </aura-change-to>',
                bpm_modeler_auraExternalOption: '<external-option class="bpm-{{:#data}} {{externaloption_class: #data}}" \
                                                        data-option="{{:#data}}" \
                                                        data-task="{{:~root.id}}"> \
                                                </external-option>',
            });

            // Set class variables
            this.model = model;
            this.previousElementId = null;
            this.aura = null;
        },

        /************************************************************************
         SHOW METHODS SECTION
         ************************************************************************/
        showForTask: function(task){
            var that = this;
            var taskId = task.attr("id");
            var params = {
                type: "UserTask",
                options: this.getOptions(task),
                changeTo: this.getChangeTo(task),
                externalOptions: this.getExternalOptions(task),
                showArrow: true,
                positioning: "right"
            }

            // Show aura
            var shown = this.show(task, params);

            if (shown){
                // Put special options at bottom
                var specialOptions = this.aura.find("special-options");
                specialOptions.position({ of: task, my: "center-8 top+10", at: "center bottom", collision: "none" });

                // Manage changeTo handler
                this.aura.find("special-option.bpm-option-change").on("click",function(){ that.showChangeToOptions(this);});

                // Manage delete handler
                this.aura.find("special-option.bpm-option-delete").on("click",function(){ that.deleteTask(taskId); });

                // Manage external options handler
                this.aura.find("external-option").on("click",function(){ that.manageExternalOption($(this), taskId); });

                // Make arrow dragabble
                this.aura.find("aura-option.bpm-option-arrow").draggable({
                    helper: "clone",
                    containment: "#bpm-drawing" ,
                    grid: [20, 20],
                    drag: function(ev, ui){ that.dragArrow(ui, taskId); }
                });
            }

            return shown;
        },

        showForArrow: function(arrow, showRuleOption){
            var that = this;
            var arrowId = arrow.attr("id");
            var params = {
                type: "arrow",
                positioning: "center",
                showRuleOption: showRuleOption
            }

            // Show aura
            var shown = this.show(arrow, params);

            if (shown){
                // Put special options at bottom
                var specialOptions = this.aura.find("special-options");
                specialOptions.position({ of: arrow, my: "center center", at: "center center", collision: "none" });

                // Manage delete handler
                this.aura.find("special-option.bpm-option-delete").on("click",function(){ that.deleteArrow(arrowId); });

                // Manage rule handler
                this.addHandlersForExpressions(arrowId);
            }

            return shown;
        },

        show: function(element, params){
            var that = this;
            var elementId = element.attr("id");

            // Check previous element to toggle on/off
            if (this.previousElementId) {
                var isSame = this.previousElementId == elementId;
                this.hide(this.previousElementId);
                if (isSame) return false;
            }
            this.previousElementId = elementId;

            // Render template
            var aura = $.templates.bpm_modeler_aura.render($.extend(params, {id: elementId}));
            this.aura = $(aura);
            element.after(this.aura);
            this.moveTo(element, params.positioning);

            // Put external options at top
            if (params.externalOptions){
                var externalOptions = this.aura.find("external-options");
                externalOptions.position({ of: element, my: "center-15 bottom+16", at: "center top", collision: "none" });
            }

            // Make items draggable
            this.aura.find("aura-option").draggable({
                helper: "clone",
                containment: "#bpm-drawing" ,
                grid: [20, 20],
                drag: function(ev, ui){ that.publish("item.drag", ui); }
            });

            return true;
        },

        /************************************************************************
         OTHER PUBLIC METHODS SECTION
         ************************************************************************/

        hide: function(elementId){
            elementId = elementId || this.previousElementId;
            if (elementId == null) return;
            if (this.aura) this.aura.detach();
            this.previousElementId = null;
        },

        moveTo: function(element, positioning){
            var id = element.attr("id");
            if (id != this.previousElementId) {
                this.hide();
                return;
            }
            // Only perform the move when the aura is displayed for the given task
            positioning = positioning || "right";
            if (positioning == "right")
                this.aura.position({of: element, my: "left+20 center", at: "right center", collision: "none" });
        },


        /************************************************************************
         HANDLER METHODS SECTION
         ************************************************************************/
        showChangeToOptions: function(element){
            var changeToOptions  = this.aura.find("aura-change");
            changeToOptions.toggleClass("visible");
            changeToOptions.position({ of: element, my: "center top+10", at: "center bottom", collision: "none"});

            // Add click handlers
            changeToOptions.find("aura-change-to").click($.proxy(this.changeTo, this));
        },

        addHandlersForExpressions: function(arrowId){
            var that = this;

            // Add click handlers
            this.aura.find(".bpm-option-else").click(function(){
                var source = bizagi.bpmn.modeler.connector.getSourceTaskFromId(arrowId);
                var target = bizagi.bpmn.modeler.connector.getTargetTaskFromId(arrowId);

                // Publish event
                that.publish("arrow.setElse", arrowId);

                // Change model
                that.model.setConnectionRule(source, target, "else");
            });
            this.aura.find(".bpm-option-expression").click(function(){
                // Publish event
                that.publish("arrow.setExpression", arrowId);
            });
        },

        deleteTask: function(taskId){
            this.model.deleteTask(taskId);
        },

        deleteArrow: function(arrowId){
            var source = bizagi.bpmn.modeler.connector.getSourceTaskFromId(arrowId);
            var target = bizagi.bpmn.modeler.connector.getTargetTaskFromId(arrowId);
            this.model.deleteArrow(source, target);
        },

        dragArrow: function(ui, elementId){
            // Publish event
            this.publish("arrow.drag", {source: elementId, target: ui.offset});
        },

        changeTo: function(ev){
            var changeOption = $(ev.currentTarget);
            var type = changeOption.data("type");
            var task = changeOption.data("task");

            // Publish event
            this.model.changeTaskType(task, type);
        },

        manageExternalOption: function(externalOption, taskId){
            var option = externalOption.data("option");

            // Publish event
            this.publish("task.externaloption", {task: taskId, option: option});
        },

        /************************************************************************
         MISC METHODS SECTION
         ************************************************************************/
        getOptions: function(task){
            var type = task.data("type");
            if (type == "EndEvent") return [];

            return [
                "IntermediateEvent",
                "EndEvent",
                "ExclusiveGateway",
                "UserTask"];
        },

        getChangeTo: function(task){
            var type = task.data("type");
            var possibleChanges = [];
            if (type == "ExclusiveGateway" || type == "ParallelGateway" || type == "InclusiveGateway" || type == "ComplexGateway") {
                //possibleChanges =  [ "ParallelGateway", "ExclusiveGateway"];
                possibleChanges =  [ "ParallelGateway", "InclusiveGateway", "ComplexGateway", "ExclusiveGateway"];
            }
            else if (type == "EndEvent" || type == "TerminateEvent"){
                possibleChanges =  [ "EndEvent", "TerminateEvent"];
            }
            if (possibleChanges.length > 0){
                possibleChanges.removeOne(type);
                return possibleChanges
            }
            return null;
        },

        getExternalOptions: function(task){
            var type = task.data("type");
            if (type != "UserTask" && type != "IntermediateEvent") return [];

            return [ "form","assignee"];
        }
    }
);