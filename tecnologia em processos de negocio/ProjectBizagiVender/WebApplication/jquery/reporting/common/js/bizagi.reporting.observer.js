 /*
 *  Name: Observer
 *  Author: David Romero
 *  Comments:
 *   -   This script define a base clase to handle events
 */

$.Controller.extend("bizagi.reporting.observer", {}, {
    init: function () {
        this.observableElement = $({});
    },

    /*
    *   Allows consumers to subscribe from a component event
    */
    subscribe: function () {
        this.observableElement.bind.apply(this.observableElement, arguments);
    },

    /*
    *   Allows consumers to unsubscribe from a component event
    */
    unsubscribe: function () {
        this.observableElement.unbind.apply(this.observableElement, arguments);
    },

    /*
    *   Allows the component to publish events to consumers
    */
    publish: function () {
        this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    }
});