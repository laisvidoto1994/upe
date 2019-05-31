
/*
*   Name: BizAgi FormModeler Editor Update Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for updateelementcommand
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.updateElementCommand", {
    renderLayout: {
        'string': 'layoutText',
        'collection': 'layoutLink',
        'label': 'layoutLabel',
        'number': 'layoutNumber',
        'float': 'layoutNumber',
        'currency': 'layoutMoney',
        'date': 'layoutDateTime',
        'image': 'layoutImage',
        'collection': 'layoutLink',
        'entity-parametric': 'layoutLink',
        'entity-master': 'layoutLink',
        'entity-system': 'layoutLink',
        'entity-stakeholder': 'layoutLink',
        'boolean': 'layoutBoolean',
        'layoutPlaceholder': 'layoutPlaceholder',
        'attachment': 'layoutUpload'
    }
},

{    
	/*
	*   Executes the command
	*/  
    execute: function(){
        var self = this,
    	    args = self.arguments,
            renderType = args.renderType,
            guid = args.guid,
            template = self.model.getForm(),
            layout = template.getLayout();
    	              
        var newElement = self.createLayoutElement();
        var element = self.element = self.model.getElement(guid);

        // Keeps the current HTML stored in the model
        if (!self.originalHtml) {            
            self.originalHtml = layout.properties.html;
            self.repeaters = bizagi.clone(layout.repeaters);           
        }

        if (self.canReplaceElement(element)) {
            self.setProperties(newElement, element);
            self.model.replaceElement(guid, newElement);            
            return true;
        }

        return false;
    },


    createLayoutElement: function(){
        var self = this,
           args = self.arguments,
           property = args.property,
           renderType = args.renderType,           
           guid = args.guid;

        var type = self.Class.renderLayout[renderType];
        var data = {
            guid: guid,
            properties: {
                rendertype: renderType
            }
        };

        data.properties[args.property] = args.value;

        return self.model.createElement(type, data);
    },


    canReplaceElement: function(element){
        var self = this,
          args = self.arguments,
          toInitialState = args.toInitialState,
          renderType = args.renderType;

        if (!element) {
            return true;
        }

        if (toInitialState) {
            return true;
        }

        if (element.properties.type == ':image' && renderType != 'image') {
            return false;
        }

        return true;

    },

    setProperties: function (newElement, element) {
        var self = this,
          args = self.arguments,
          toInitialState = args.toInitialState,
          guid = args.guid;
                    
        if (!toInitialState) {
            var properties = newElement.designValueProperties;

            for (property in properties) {
                if (property != args.property && element.designValueProperties[property]) {
                    newElement.assignProperty(property, element.getProperty(property));
                }
            }
        }

        if (element.properties.type) {
            newElement.assignProperty('type', element.getProperty('type'));
        }

        newElement.assignProperty('hide', false);
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this,
            args = self.arguments,
            guid = args.guid,
            template = self.model.getForm(),
            layout = template.getLayout(),
            repeaters = layout.repeaters;
               
        // Restore HTML
        layout.properties.html = self.originalHtml;
        self.model.replaceElement(guid, self.element);
        
        for (var key in repeaters) {
            if (!bizagi.editor.utilities.objectEquals(repeaters[key].elements, self.repeaters[key].elements)) {
                for (var id in repeaters[key].elements) {
                    self.model.removeElementById(id);
                }
                repeaters[key].elements = self.repeaters[key].elements;
            }
            
        }

        return true;
    }
})
