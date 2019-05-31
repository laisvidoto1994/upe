
/*
*   Name: BizAgi FormModeler Editor Delete Repeater Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for deleteRepeaterItemcommand
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.deleteRepeaterItemCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var guid = args.guid;

        if (!guid) {
            return false;
        }

        var template = self.model.getForm(),
            layout = template.getLayout();
      
        self.deleteItem(layout, guid);

        return true;
    },

    /*
    * Finds and deletes the repeater item in the model and html 
    */
    deleteItem: function (layout, guid) {
        var self = this;

        var html = layout.properties.html,            
            match,
            doWork = true,            
            repeaters = html.split('\{\{\/repeater\}\}'),
            regexPlaceholders = /{{placeholder(:\w*)?(\s*\{"id":"([\w-]+)"\})?/g;

        self.originalHtml = html;
        self.originalElements = {};
        
        for (j = 0, r = repeaters.length;j < r; j++) {
            var items = repeaters[j].split('\{\{separator\}\}');
            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                if (item.indexOf(guid) >= 0) {
                    var repeaterItem = /{{repeater:item}}[\w\W]+{{\/repeater:item}}/g.exec(item)[0];
                    while ((match = regexPlaceholders.exec(repeaterItem)) !== null) {
                        var id = match[3];
                        self.originalElements[id] = layout.removeElementById(id);
                    }
                    
                    layout.properties.html = html.replace(repeaterItem + '{{separator}}', '');

                    doWork = false;
                    break;
                }
            }

            if (!doWork) { break;}
        }    
    },

    undo: function () {
        var self = this,
            template = self.model.getForm(),
            layout = template.getLayout();

        layout.properties.html = self.originalHtml; 

        for (id in self.originalElements) {
            layout.addElement(self.originalElements[id]);
        }

        return true;
    }
})
