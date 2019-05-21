
/*
*   Name: BizAgi FormModeler Editor Replace And Restore Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for replaceandrestoreelement
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.replaceAndRestoreElementCommand", {},
{    
    /*
	*   Executes the command
	*/  
    execute: function(){
        var self = this,
    	    args = self.arguments,
            guid = args.sourceGuid;
            
        self.originalSourceElement = self.model.getElement(guid);
        self.originalTargetElement = self.model.getElement(args.guid);

        var propertiesSource = self.originalSourceElement.properties || {};
        var propertiesTarget = self.originalTargetElement.properties || {};


        // If the target control is an image defined in the layout, then the source control must to be an image too, 
        // else the command isn't executed
        if (self.isImageControl(propertiesTarget.type) && !self.isImageControl(propertiesSource.type)) {
            return false;
        }

        // If the source element is a placeholder ignore
        if (self.originalSourceElement.type == "layoutPlaceholder") {
            return false;
        }

        self.restoreSourceElement(guid);
        self.replaceTargetElement();
        
        return true;
    },

    /*
    *  Restore source element to initial state
    */
    restoreSourceElement: function(guid) {
        var self = this,
            properties = self.originalSourceElement.properties,
            type = properties.type;

        // If the source control is a imagen by definition in the layout, it can't be replaced
        if (type.search(/image/ig) >= 0) {
            return;
        }
        
        var data = {
            guid: guid,
            properties: {
                rendertype: 'layoutPlaceholder',
                type: properties.type
            }
        };

        var element = self.model.createElement('layoutPlaceholder', data);
        self.model.replaceElement(guid, element);
    },

    /*
    * Replace the target element with the element dropped
    */
    replaceTargetElement: function() {
        var self = this,
             args = self.arguments,
             properties = bizagi.clone(self.originalSourceElement.properties),
             typeSource = properties.type || '',            
             propertiesTarget = self.originalTargetElement.properties,
             typeTarget = propertiesTarget.type || '',
             guid = args.guid;       

        var data = {
            guid: guid,
            properties: $.extend(properties, { type: self.originalTargetElement.properties.type })
        };

        var element = self.model.createElement(self.originalSourceElement.type, data);               
        self.model.replaceElement(guid, element);
    },
    
    /*
    * Returns true if the control is a layoutImage
    */
    isImageControl: function (type) {
        var self = this,
            type = type || '';

        return (type.search(/image/ig) >= 0);
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this,
            args = self.arguments,
            originalProperties = self.originalSourceElement.properties,
            sourceGuid = args.sourceGuid,
            targetGuid = args.guid;

        // Replace source element
        if (originalProperties.type.search(/image/ig) == -1) {
            self.model.replaceElement(sourceGuid, self.originalSourceElement);
        }        

        // Replace target element
        self.model.replaceElement(targetGuid, self.originalTargetElement);

        return true;
    }
})
