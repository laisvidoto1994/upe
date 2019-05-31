
/*
*   Name: BizAgi Workportal Observable Class
*   Author: Mauricio S�nchez
*   Comments:
*   -   This script will define a class with the publish/subscribe pattern
*/


$.Class.extend("bizagi.workportal.observable", {}, {
    /* 
    *   Constructor
    */
    init: function () {
        this.observableElement = $({});
    },

    sub: function (event) {
        // Gets events registered
        var events = $._data(this.observableElement[0], "events");
        // If the events exist, ignore it
        if (!events || !events[event]) {
            this.observableElement.on.apply(this.observableElement, arguments);
        }
    },

    unsub: function () {
        if (this.observableElement.off.unbind) {
            this.observableElement.off.unbind.apply(this.observableElement, arguments);
        }
        else {
            this.observableElement.off.apply(this.observableElement, arguments);
        }
    },
    pub: function () {
        return this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    }
});