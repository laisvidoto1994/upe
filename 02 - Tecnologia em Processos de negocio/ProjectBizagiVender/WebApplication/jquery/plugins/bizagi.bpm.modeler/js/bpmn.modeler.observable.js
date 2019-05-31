// Pub/Sub class declaration
$.Class.extend("bizagi.bpmn.modeler.observable", {}, {
    subscribe: function () {
        this.observableElement().bind.apply(this.observableElement(), arguments);
    },
    unsubscribe: function () {
        this.observableElement().unbind.apply(this.observableElement(), arguments);
    },
    publish: function () {
        return this.observableElement().triggerHandler.apply(this.observableElement(), arguments);
    },
    observableElement: function(){
        return !this._observableElement ? this._observableElement = $({}) :this._observableElement;
    }
});