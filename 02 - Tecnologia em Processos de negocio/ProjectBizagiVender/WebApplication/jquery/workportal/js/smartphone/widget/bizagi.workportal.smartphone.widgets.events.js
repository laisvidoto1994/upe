/*
*   Name: BizAgi Workportal Smarthpone Render Widget Controller
*   Author: Christian Collazos 
*   Comments:
*   
*/

// Auto extend
bizagi.workportal.widgets.events.extend("bizagi.workportal.widgets.events", {}, {

    init: function (workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService, params);
    },
    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        self.content = self.getContent();

        if (self.params.options.appendToElement) {
            self.content = $(self.params.options.appendToElement).append(self.content);
        }

        self.eventLinkHandler(self.params.options.events, self.params.options.attachEventsTo, self.params.options.currentIdWorkitem);
    },

    eventLinkHandler: function (events, attachEventsTo, currentIdWorkitem) {
        var self = this;


        $(".ui-bizagi-container-events").on("click", function (e) {
            self.showEventsDialog(events, currentIdWorkitem);
        });

        if (attachEventsTo == "form") {
            self.showEventsLink(currentIdWorkitem);

            $(document).unbind("attachEventElementToForm").bind("attachEventElementToForm", function (e, idWorkitem) {
                self.showEventsLink(idWorkitem);
            });

        } else {
            $(".ui-bizagi-container-events").css("display", "block");
        }
    },

    showEventsLink: function (idWorkitem) {
        var self = this;
        var removeIdWorkitemFromList = false;

        $.when(
                self.dataService.summaryCaseEvents({
                    idCase: self.params.options.idCase
                })
            ).done(function (events) {
                if (events.events != undefined & events.events.length > 0) {
                    $(".ui-bizagi-form").find(".ui-bizagi-container-events").remove();

                    for (var i = 0; i < events.events.length; i++) {
                        $.each(events.events[i], function (iterator, element) {
                            if (idWorkitem == element.idWorkitem) {
                                removeIdWorkitemFromList = true;
                            }
                        });
                    }

                    if (events.events.length == 1 && removeIdWorkitemFromList) {
                        //do nothing, events link should not appear
                    } else {
                        var eventElementCloned = $(".ui-bizagi-container-events").clone(true);

                        if ($(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first > div:last-child").length > 0) {
                            $(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first > div:last-child").after(eventElementCloned);
                        } else {
                            $(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first").after(eventElementCloned);
                        }

                        $(eventElementCloned).css("display", "block");
                    }

                }
            });
    },
    /*
    * Show Events Dialog
    */
    showEventsDialog: function (events, currentIdWorkitem) {
        var self = this;
        var removeIdWorkitemFromList = false;

        self.dialogWidget = self.workportalFacade.getTemplate('dialog');
        self.eventsWidget = self.workportalFacade.getTemplate('case-summary-events');

        for (var i = 0; i < events.events.length; i++) {
            $.each(events.events[i], function (iterator, element) {
                if (element.idWorkitem == currentIdWorkitem) {
                    element.hideItem = true;
                }
            });
        }

        var dialogContent = $.tmpl(self.dialogWidget);
        var eventsContent = $.tmpl(self.eventsWidget, events);

        $(dialogContent).find("#ui-bizagi-wp-dialog-container").append(eventsContent);

        dialogContent.appendTo("body");

        var dialogContentHeight = $(dialogContent).css("height");
        var bodyHeight = $("body").css("height");

        dialogContentHeight = Number(dialogContentHeight.substring(0, dialogContentHeight.length - 2));
        bodyHeight = Number(bodyHeight.substring(0, bodyHeight.length - 2));

        if (dialogContentHeight < bodyHeight) {
            $(dialogContent).height($("body").css("height"));
        }

        dialogContent.delegate(".eventLink", "click", function () {
            self.routingExecute($(this));
            // Delete activity selector
            $('#ui-bizagi-wp-app-dialog-wrapper').closest('div').remove();
        });

        $(".wp-dialog-container-footer button", dialogContent).click(function () {
            // Delete activity selector
            $('#ui-bizagi-wp-app-dialog-wrapper').closest('div').remove();
        });
    }
});
