/*
*   Name: BizAgi Tablet Popup Implementation
*   Author: Diego Parra
*   Comments:
*   -   This script will shows a widget inside a popup box
*/

// Bind resize window
$(window).bind("resize", function () {
    //todo: in android is necesary ignore this event
    if (bizagi.detectDevice() == "tablet_android")
        return;
    
    bizagi.workportal.tablet.popup.closePopupInstance();
});

// Extends itself
$.Class.extend("bizagi.workportal.tablet.popup", {

    /*
    *   Static method that will return the current popup instance
    */
    closePopupInstance: function () {
        if (bizagi.workportal.tablet.popup.instance) {
            bizagi.workportal.tablet.popup.instance.close();
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
        //Lines below were commented for avoid popup content being misplaced, from now on the height and width are going to be handled by the own widget css file
        this.sourceElement = options.sourceElement;
        this.my = options.my || "center top";
        this.at = options.at || "center bottom";
        this.css_class = options.css_class || "";
        this.offset = options.offset || "18 -20";
        this.activeScroll = options.activeScroll || false;

        // This option is only to help graphics designers on dummy pages
        this.dontClose = options.dontClose || false;

        // TODO: implement scroll for personalised container
        this.scrollElement = options.scrollElement || ".content";

        if (options.insertAfter) {
            this.insertAfter = options.insertAfter;
        }

    },

    /*
    *   Renders some content inside a popup
    *   Return a deferred to check when the popup closes
    */
    render: function (content, options) {
        var self = this;
        var doc = window.document;
        var template = self.workportalFacade.getTemplate("popup");

        options = options || {};
        var elmToAppend = (options.length == 0 || options.elmToAppend == undefined) ? "body" : options.elmToAppend;

        // Creates an instance deferred to be resolved when the popup closes
        self.closeDeferred = new $.Deferred();

        // Check if there are any popup open so we close first those instances
        self.Class.closePopupInstance();

        // Add to popup instances
        bizagi.workportal.tablet.popup.instance = this;

        // Append content into a div
        self.popup = $.tmpl(template, {
            activeScroll: self.activeScroll
        });

        //Add  css class
        self.popup.addClass(self.css_class);

        $(".content", self.popup).append(content);

        if (self.insertAfter) {
            $(self.insertAfter).after(self.popup);
        } else {
            self.popup.appendTo(elmToAppend, doc);
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
            if (self.insertAfter) {
                popup.find(".selectarrow").hide();
                popup.css({
                    display: "inline-block",
                    "float": "left",
                    position: "relative",
                    left: "50%",
                    top: "20px",
                    "z-index": 1
                });
            } else {
                popup.position({
                    my: self.my,
                    at: self.at,
                    of: $(self.sourceElement),
                    collision: "none",
                    offset: self.offset
                });
            }
        } else {
            popup.css("left", ($(window).width() - popup.width()) / 2);
            popup.css("top", ($(window).height() - popup.height()) / 2);
        }

        // Define handler to close the item
        setTimeout(function () {
            // Capture all click elements inside the popup
            popup.click(function (e) {
                e.stopPropagation();
            });

            // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
            $(doc).one("click", function () {
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

        $(doc).unbind("click");

        // Just for testing purposes
        if (this.dontClose) return;

        // Removes element
        self.popup.remove();
        bizagi.workportal.tablet.popup.instance = null;

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

