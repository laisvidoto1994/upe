/*
*   Name: Bizagi FormModeler Search Result Presenter
*   Author: Diego Parra
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.searchresulteditor.presenter", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        self._super();

        // Process params
        params = params || {};
        this.model = new bizagi.editor.component.searchresulteditor.model(params.searchResultModel);

        // Creates component
        self.searchresulteditor = new bizagi.editor.component.searchresulteditor(params.canvas, {
            model: this.model,
            presenter: self
        });
    },

    /*
    *   Refreshes the component
    */
    refresh: function (params) {
        var self = this;
        self.searchresulteditor.refresh(params);
    },

    /*
    *   Renders the component view
    */
    render: function (params) {
        var self = this;
        self.searchresulteditor.render($.extend(params));
    }
})