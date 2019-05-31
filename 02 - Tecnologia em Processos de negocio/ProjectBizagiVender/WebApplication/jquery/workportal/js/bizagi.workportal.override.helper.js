/*
*   Name: BizAgi Workportal
*   Author: Diego Parra
*   Comments:
*   -   This script will define helper functions so the projects can customize via javascript some aspects for the UI appearance and some behaviours
*/
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.override = (typeof (bizagi.override) !== "undefined") ? bizagi.override : {};

/*
*   Allow to customize an url in the workportal
*/
bizagi.override.customWorkportalHandlers = {};
bizagi.override.customizeWorkportalHandler = function(handler, newUrl) {

	// Redefine a handler to allow customization
	bizagi.override.customWorkportalHandlers[handler] = newUrl;
};

if (bizagi.workportal.services.context) {
    bizagi.workportal.services.context.original = $.extend(true, {}, bizagi.workportal.services.context.prototype);
	$.extend(bizagi.workportal.services.context.prototype, {
        getUrl: function (service) {
            if (this.context == "workportal" && bizagi.override.customWorkportalHandlers[service]) {
            	return bizagi.override.customWorkportalHandlers[service];
            }
        	return bizagi.workportal.services.context.original.getUrl.apply(this, arguments);
        }
    });
}

/*
*   Allows to extend widget features by extending the postRender method and calling a custom calllback
*/
bizagi.override.customizeWorkportalWidget = function(widget, extensionMethod) {
	var widgetImplementation = bizagi.workportal.desktop.facade.getWidgetImplementation(widget);
	
    if (widgetImplementation) {

    	// Prototype modification
    	eval(widgetImplementation).extend(widgetImplementation, { }, {
    		/*
            *   Override postRender
            */
    		postRender: function() {
    			var self = this;

    			// Call bizagi implementation
    			self._super();

    			// Call custom implementation
    			var content = self.getContent();
    			if (extensionMethod) extensionMethod(this, content);
    		}
    	});
    }
};

/*
*   Allows to add custom menus to the main menu bar
*/
bizagi.override.customButtons = [];
bizagi.override.addCustomMenuButton = function (button) {
    bizagi.override.customButtons.push(button);
};
// Set an override to menu
if (bizagi.workportal.controllers.menu) {
    bizagi.workportal.controllers.menu.original = $.extend(true, {}, bizagi.workportal.controllers.menu.prototype);
    $.extend(bizagi.workportal.controllers.menu.prototype, {
        postRender: function () {
            var self = this;
            var customButtonTemplate = self.workportalFacade.getTemplate("menu.custom-button");

            // Render the menu
            return $.when(bizagi.workportal.controllers.menu.original.postRender.apply(this, arguments))
                .pipe(function (result) {
                    var menuButtonContainer = $("[data-bizagi-component=menuItems]", result);

                    $.each(bizagi.override.customButtons, function (i, button) {
                        
                        if (typeof button.isAvailable == "function") {
                            if (!button.isAvailable()) return;
                        }
                        var customButton = $.tmpl(customButtonTemplate, button);

                        // Bind click handler
                        if (button.submenu == null) {
                            customButton.click(function () {
                                if (button.click) button.click(self);
                            });
                        } else {
                            customButton.click(function () {
                                // Pops up the submenu
                                self.renderSubMenu(customButton, button.submenu, button.click);
                            });
                        }

                        menuButtonContainer.append(customButton);
                    });

                    return result;
                });
        }
    });
}

/*
*   Allows to add custom services
*/
bizagi.override.addDataService = function (functionName, fn) {
    if (bizagi.workportal.services.service) {
        bizagi.workportal.services.service.original = $.extend(true, {}, bizagi.workportal.services.service.prototype);
        
        // Create an extension object
        var extensionObject = { };
        extensionObject[functionName] = fn;

        // Extend data service
        $.extend(bizagi.workportal.services.service.prototype, extensionObject);
    }
};

//TODO: How to customize project aspx or ashx without compilation