/*
*   Name: Bizagi FormModeler Editor Minitoolbar Adapter
*   Author: Rhony Pedraza, Diego Parra(refactor)
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.layout.presenter", {}, {

    /*
    *   Constructor
    */
    init : function(params) {
        var self = this;

        // Call base
        self._super();

        // Process params
        params = params || {};
        
        // Creates component
        self.layout = new bizagi.editor.component.layout(params.canvas, {
            model: params.model,
            presenter: self,
            context: params.context,
            isActivityForm: params.isActivityForm
        });
    },
    
    /*
    *   Renders the layout component
    */
    render : function(params) {
        var self = this;
        return self.layout.render(params);
    }
});
