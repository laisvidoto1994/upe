bizagi.workportal.services.globalhandlers = (function (dialogWidgets) {
    var self = this;
    
    /*
    * publish global handler
    */
    self.publish = function (eventName, params) {
        $(document).triggerHandler(eventName, params);
    };
    
    self.showDialogWidget = function (data) {
        dialogWidgets.renderWidget(data);
        return dialogWidgets;
    };

    return {
        publish: self.publish,
        showDialogWidget: self.showDialogWidget
    }

});

bizagi.injector.register('globalHandlersService', ['dialogWidgets', bizagi.workportal.services.globalhandlers]);