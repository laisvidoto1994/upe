$.Widget.prototype.destroy = function() {
    this._destroy();    
    
    // we can probably remove the unbind calls in 2.0
    // all event bindings should go through this._on()
    this.element
    .unbind(this.eventNamespace)
    // 1.9 BC for #7810
    // TODO remove dual storage
    .removeData(this.widgetName)
    .removeData(this.widgetFullName)
    // support: jquery <1.6.3
    // http://bugs.jquery.com/ticket/9413
    .removeData($.camelCase(this.widgetFullName));
    this.widget()
    .unbind(this.eventNamespace)
    .removeAttr("aria-disabled")
    .removeClass(
        this.widgetFullName + "-disabled " +
        "ui-state-disabled");
        
    // clean up events and states
    this.bindings.unbind(this.eventNamespace);
    this.hoverable.removeClass("ui-state-hover");
    this.focusable.removeClass("ui-state-focus");
};
      