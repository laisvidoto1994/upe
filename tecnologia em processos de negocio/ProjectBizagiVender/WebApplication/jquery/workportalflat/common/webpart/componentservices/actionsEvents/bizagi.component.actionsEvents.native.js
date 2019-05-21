/*
 *   Name: BizAgi Case Actions Events
 *   Author: Andres Arenas V
 *   Comments:
 *   -   
 */
bizagi.actionsEvents.extend("bizagi.actionsEvents", {
    /**
     * Init constructor
     * @param dataService The dataService for making request
     * @param parent
     *  - "Entities": When it comes from RenderTemplates
     *  - "Cases": When it comes from CasesTemplates
     * @param params
     *  - "homePortalFramework": Used to handle Data Navigation and AccumulatedContext
     */
    init: function (dataService, parent, params) {
        var self = this;
        // Call base
        self._super(dataService, parent, params);
    },
    /**
     * Build the necesary params to process the action based on the action type.
     * @param action The action to execute.
     * @param entity The parent entity.
     */
    executeActionSingleData: function(action, entity) {
        var self = this;

        if (action.type === "WorkOnIt") {
            var idCase = (typeof action.idCase !== "undefined") ? action.idCase : entity.idCase;
            bizagiapp.openRenderElement({
                "idCase": idCase,
                "radNumber": entity.radNumber,
                "idTask": action.idTask,
                "idWorkitem": action.idWorkitem
            });
        } else if (typeof action.isEvent !== "undefined" && action.isEvent) {
            self.processEvent(action);
        } else {
            var actionType = action.type;
            var isMultiInstance = action.multiplicity === 2 ? true : false;

            if (actionType === "Rule") {
                var params = {
                    actionType: actionType,
                    entityId: entity.guid,
                    isMultiInstance: isMultiInstance,
                    processId: action.reference,
                    surrogateKey: entity.surrogateKey
                };

                self.processAction(params).then(function() {
                    self.refreshTemplate();
                });
            } else if (actionType === "Form" || actionType === "Process") {
                var params = {
                    actionType: actionType,
                    displayName: action.displayName,
                    entityGuid: entity.guid,
                    entitySurrogateKey: entity.surrogateKey,
                    id: action.id,
                    isMultiInstance: isMultiInstance,
                    isBatch: action.isBatch || null,
                    reference: action.reference,
                    readonlyform: action.readonlyform,
                    showConfirmation: action.showConfirmation
                };

                if (actionType === "Process") {
                    params.entityId = action.entityId;
                    params.entityName = action.entityName;
                    params.hasStartForm = action.hasStartForm;
                }
                if (typeof entity.idCase !== "undefined") {
                    params.caseId = entity.idCase;
                }
                self.processAction(params);
            }
        }
    },
    /**
     * Process the action based on the Type.
     *  - Process: Call the mapping and create a new case.
     *  - Form: Load the startform based on params.
     *  - Rule: Show confirmation dialog and if user agrees execute rule depending if it is multinstance or not.
     * @param params Contains the necesary data to process the action.
     */
    processAction: function (params) {
        return $.when(this._super(params)).done(function(createParams){
            if(params.actionType === "Process"){
                createParams.mapping = JSON.stringify(createParams.mapping);
                bizagiapp.newCase(createParams);
            }
        });
    },
    executeChangeCaseEvent: function(idCase, idTask, idWorkitem, entity){
        bizagiapp.openRenderElement({"idCase": idCase, "idTask": idTask, "idWorkitem": idWorkitem});
        bizagiLoader().stop();
    }
});