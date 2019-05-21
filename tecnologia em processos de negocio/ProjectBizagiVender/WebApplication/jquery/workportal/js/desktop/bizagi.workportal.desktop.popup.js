/*
*   Name: BizAgi Desktop Popup Implementation
*   Author: Diego Parra
*   Comments:
*   -   This script will shows a widget inside a popup box
*/

// Bind resize window
$(window).bind("resize",function(){                             
        bizagi.workportal.desktop.popup.closePopupInstance();          
});

// Extends itself
$.Class.extend("bizagi.workportal.desktop.popup", {

    /*
    *   Static method that will return the current popup instance
    */
    closePopupInstance: function () {
        if (bizagi.workportal.desktop.popup.instance) {
            bizagi.workportal.desktop.popup.instance.close();
        }
    }
}, {

    /* 
    *   Constructor
    */
    init: function (dataService, workportalFacade, options) {
        this.dataService = dataService;
        this.workportalFacade = workportalFacade;

        // Set display options
        options = options || {};
        this.sourceElement = options.sourceElement;
        this.my = options.my || "center top";
        this.at = options.at || "center bottom";
        this.offset = options.offset || "18 -20";
        this.activeScroll = options.activeScroll || false;
        this.arrowPosition = options.arrowPosition || false;
        if(options.position) {
            this.position = options.position;
        }
        if(options.insertAfter) {
            this.insertAfter = options.insertAfter;
        }

        // This option is only to help graphics designers on dummy pages
        this.dontClose = options.dontClose || false;

        // TODO: implement scroll for personalised container
        this.scrollElement = options.scrollElement || ".content";
    },

    /*
    *   Renders some content inside a popup
    *   Return a deferred to check when the popup closes
    */
    render: function (content, params) {
        var self = this;
        var doc = window.document;
        var template = self.workportalFacade.getTemplate("popup");

        params = params || {};

        // Creates an instance deferred to be resolved when the popup closes
        self.closeDeferred = new $.Deferred();

        // Check if there are any popup open so we close first those instances
        self.Class.closePopupInstance();

        // Add to popup instances
        bizagi.workportal.desktop.popup.instance = this;

        // Extend Parameters
        $.extend(params, params, { activeScroll: self.activeScroll });

        // Append content into a div
        self.popup = $.tmpl(template, params);
        $(".content", self.popup).append(content);
        
        if(self.insertAfter) {
            $(self.insertAfter).after(self.popup);
        } else {
            self.popup.appendTo("body", doc);
        }

        // Create popup box
        self.showPopup(self.popup);
    },

    /*
    *   Shows the popup box in the browser
    */
    showPopup: function (popup) {
        var doc = window.document;
        var self = this;

        // Set width and height
        if (self.popupWidth) popup.width(self.popupWidth);
        if (self.popupHeight) popup.height(self.popupHeight);

        // Locate over element
        if (self.sourceElement) {
            if(self.insertAfter) {
                popup.find(".selectarrow").hide();
                popup.css({
                    display: "inline-block",
                    "float": "left",
                    position: "relative",
                    left: "37%",
                    top: "20px",
                    "z-index" : 1
                });
            } else {
                popup.position({
                    my: self.my,
                    at: self.at,
                    of: $(self.sourceElement),
                    collision: "none",
                    offset: self.offset
                });
                if(self.position) {
                    popup.css("position", self.position);
                }
            }
        } else {
            popup.css("left", ($(window).width() - popup.width()) / 2);
            popup.css("top", ($(window).height() - popup.height()) / 2);
        }

		// Move arrow
		if(self.arrowPosition){
			var arrow = $(".selectarrow",popup);
			arrow.css(self.arrowPosition);
		}

        // Define handler to close the item
        setTimeout(function () {
            // Capture all click elements inside the popup
            popup.click(function (e) {
                e.stopPropagation();
            });

            // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
            $(doc).one("click", function() {
                self.close();
            });
        }, 100);
    },

    /*
    *   Returns the instance deferred to hold executions until 
    *   the popup is closed
    */
    closed: function () {
        var self = this;
        return self.closeDeferred;
    },

    /*
    *   Forces to close the popup
    */
    close: function () {
        var doc = window.document;
        var self = this;

        // Just for testing purposes - used in complexgateway
        if (this.dontClose) return;
        
        //$(doc).unbind("click"); Comment for prevent disable others click event

        // Removes element
        self.popup.remove();
        bizagi.workportal.desktop.popup.instance = null;

        // Resolve deferred
        self.closeDeferred.resolve();
    },

    /*
    *   Returns the popup content
    */
    getContent: function () {
        var self = this;
        return self.popup;
    }

});
