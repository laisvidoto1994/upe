/*
*   Name: BizAgi Desktop Letter Dialog Implementation
*   Author: Diego Parra
*   Comments:
*   -   This script will shows a letter inside a popup dialog in order to edit
*/

// Extends itself
$.Class.extend("bizagi.rendering.dialog.letter", {

    POPUP_WIDTH: 800,
    POPUP_HEIGHT: 550
    
}, {

    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory) {
        this.dataService = dataService;
        this.renderFactory = renderFactory;
    },

    /*
    *   Render the letter content
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (content) {
        var self = this;
        var doc = window.document;
        var template = self.renderFactory.getTemplate("letter.dialog");
        
        // Render template
        var dialog = $.tmpl(template);
        
        // Append form  in the dialog
        dialog.appendTo("body", doc);
        
        // Set height and width manually to adjust to the container
        var textarea = $("#ui-bizagi-rtfeditor", dialog);
        textarea.width(this.Class.POPUP_WIDTH - 30);
        textarea.height(this.Class.POPUP_HEIGHT - 150);
        
        // Apply plugin
        new nicEditor({
            iconsPath: self.dataService.getLetterEditorIconsPath(),
            fullPanel: true
        }).panelInstance('ui-bizagi-rtfeditor');
        
        // Create a templateParts array to hold the full html separated by body tags
        self.templateParts = content.split(/(<body>|<\/body>)/ig);
        
        // Set data
        nicEditors.findEditor("ui-bizagi-rtfeditor").setContent(content);
        
        // Create dialog box
        return self.showDialogBox(dialog);
    },

    /*
    *   Shows the dialog box in the browser
    *   Returns a promise that the dialog will be closed
    */
    showDialogBox: function (dialogBox) {
        var self = this;
        
        // Define buttons
        var buttons = {};
        var defer = new $.Deferred();
                   
        buttons[bizagi.localization.getResource("render-letter-dialog-box-save")] = function () {
            var newContent = nicEditors.findEditor("ui-bizagi-rtfeditor").getContent();
            
            // Destroy dialog
            dialogBox.dialog('destroy');
            dialogBox.remove();
            
            // Append content to template, because the plugine removed html, head and body tags
            //  - Actually there is an incosistent behaviour between IE8 and IE9
            //  - In IE8, the templateParts doesn't include the <body> in the splitted array
            //  - In IE9, the templateParts includes the <body> in the splitted array
            if (self.templateParts[1] == "<body>") {
            	
            	// Remove empty headers, rare behaviour in IE9
            	 self.templateParts[2] = newContent.replaceAll("<header></header>", "");
            	
            	// Return new content
                defer.resolve(self.templateParts.join(""));
            
            } else {
            	// Return new content
                defer.resolve(self.templateParts[0] + "<body>" + newContent + "</body>" + (self.templateParts.length > 2 ? self.templateParts[2] : ""));
            }
            
            
        };
        buttons[bizagi.localization.getResource("render-letter-dialog-box-cancel")] = function () {
            dialogBox.dialog('close'); 
        };

        // Creates a dialog
        dialogBox.dialog({
            width: this.Class.POPUP_WIDTH,
            height: this.Class.POPUP_HEIGHT,
        	title: bizagi.localization.getResource("render-letter-dialog-title"),
            modal: true,
            buttons: buttons,
            close: function (ev, ui) {
                dialogBox.dialog('destroy');
                dialogBox.remove();
                defer.reject();
            }
        });

        // Return promise
        return defer.promise();
    }
});

