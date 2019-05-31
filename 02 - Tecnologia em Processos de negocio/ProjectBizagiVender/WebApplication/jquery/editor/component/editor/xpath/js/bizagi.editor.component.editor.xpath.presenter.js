/*
*   Name: Bizagi FormModeler xpath editor presenter
*   Author: Rhony Pedraza
*   Date: 18jul12
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.editor.xpath.presenter", {}, {
    
    init : function(canvas, model) {
        this._super();
        this.canvas = canvas;
        this.model = model;
        this.create();
    },
    create : function() {
        this.xpathEditorNavigator = new bizagi.editor.component.xpathnavigator(this.canvas, this.model, this);
    },
    render : function(model, expand) {
        var self = this;
        
        self.model = (model !== undefined) ? model : self.model;
        self.xpathEditorNavigator.updateModel(self.model);
        self.xpathEditorNavigator.render(expand);
    },
    showXpath : function(xpath) {
        return this.xpathEditorNavigator.showXpath(xpath);
    }
    
});