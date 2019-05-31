
/*
*   Name: BizAgi FormModeler Editor Observable Class
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for observable's class
*/

// Pub/Sub class declaration
$.Class.extend("bizagi.editor.observableClass", {}, {
    init: function() {
        this.observableElement = $({});
    },
    subscribe: function () {
        this.observableElement.bind.apply(this.observableElement, arguments);
    },
    unsubscribe: function () {
        this.observableElement.unbind.apply(this.observableElement, arguments);
    },
    publish: function () {
        return this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    }
});



$.Controller.extend("bizagi.editor.observableController", {}, {
    init: function () {
        this.observableElement = $({});
    },
    subscribe: function () {
        this.observableElement.bind.apply(this.observableElement, arguments);
    },
    unsubscribe: function () {
        this.observableElement.unbind.apply(this.observableElement, arguments);
    },
    publish: function () {
        return this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    }
});