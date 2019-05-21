/*
 *   Name: BizAgi Render Column Decorator Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for Columns
 */

bizagi.rendering.element.extend("bizagi.rendering.columns.column", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        this.decoratedClass = params.decorated;
        this.data = params.data;
        if (params.singleInstance) {
            this.decorated = new this.decoratedClass({
                data: this.data,
                parent: this.parent,
                renderFactory: this.renderFactory,
                dataService: this.dataService
            });
            this.decorated.getControl = this.getControl;
            params.decorated = this.decorated;
            this.decorated.properties.isColumn = true;
        } else {
            this.decorateRenders = [];
        }
        this.grid = params.parent;

        // Set base column styles
        var properties = this.properties;
        properties.columnVisible = bizagi.util.parseBoolean(properties.columnVisible) != null ? bizagi.util.parseBoolean(properties.columnVisible) : true;
        properties.align = properties.align || 'center';
        properties.textFormat = properties.textFormat || {};
        properties.submitOnChange = (typeof properties.submitOnChange != "undefined") ? bizagi.util.parseBoolean(properties.submitOnChange) : false;
        properties.singleInstance = params.singleInstance;
        properties.editable = (typeof properties.editable != "undefined") ? bizagi.util.parseBoolean(properties.editable) : true;
        properties.visible = (typeof properties.visible != "undefined") ? bizagi.util.parseBoolean(properties.visible) : true;
        properties.required = (typeof properties.required != "undefined") ? bizagi.util.parseBoolean(properties.required) : false;
        properties.showColumn = (typeof properties.showColumn != "undefined") ? bizagi.util.parseBoolean(properties.showColumn) : true;

        // Define if it is editable or not        
        try {
            if (params.parent && typeof params.parent.properties.editable == "boolean" && !params.parent.properties.editable) {
                properties.editable = false;
            }
        } catch (e) {
        }

        // Define if the column is readonly
        this.readonly = properties.readonly !== undefined ? properties.readonly : false;
        if (this.readonly) properties.editable = required = false;

        // Save original properties
        this.originalProperties = JSON.parse(JSON.encode(properties));
    },

    /*
    *   Return true if the column is read-only, so we can make a quick render
    */
    isReadonly: function () {
        return false;
    },


    /*
    *   Method to retrieve the decorated control
    */
    getControl: function () {
        var self = this;
        return $(".ui-bizagi-render-control", self.element || self.observableElement);
    },
    /*
    *   Returns the decorated cell instance to use
    */
    getDecorated: function (surrogateKey) {
        var self = this;
        var properties = self.properties;
        if (properties.singleInstance) {
            return self.decorated;
        }
        else {
            var decorated = self.decorateRenders[surrogateKey];
            if (decorated == undefined) {
                if (typeof self.decorateRenders != "object") {
                    self.decorateRenders = [];
                }
                var instanceDecoratedClass = new this.decoratedClass({
                    data: bizagi.clone(this.data),
                    parent: this.parent,
                    renderFactory: this.renderFactory,
                    dataService: this.dataService
                });
                decorated = instanceDecoratedClass;
                self.decorateRenders[surrogateKey] = instanceDecoratedClass;

                // Set surrogate key to all controls
                decorated.surrogateKey = surrogateKey;

                // Execute decorated overrides
                self.applyOverrides(decorated);

                // Also override setDisplayValue on summary row for non numeric columns
                if (surrogateKey == "summary" &&
                        decorated.properties.type != "columnMoney" &&
                        decorated.properties.type != "columnNumber") {

                    decorated.setDisplayValue = function (value) {
                        var control = this.getControl();

                        // Replace line breaks for html line breaks
                        control.html(value);
                    };
                }
            }
            return decorated;
        }
    },
    /*
    *   Set a ready function to execute when the render has been inserted in the dom
    */
    ready: function () {
        return this.readyDeferred.promise();
    },
    /*
    *   Load stuff needed for the column
    *   It could return a promise if the column need to load async stuff
    */
    initialize: function () {
        // Override to do any stuff needed here
    },
    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function (surrogateKey, cellOverrides) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        if (cellOverrides) {
            decorated.properties.visible = cellOverrides.visible;
            decorated.properties.editable = cellOverrides.editable;
        }
        return decorated.canBeSent() || (!self.properties.editable && self.hasChanged());
    },
    /*
    *   Method to check if a value is valid or not in this render
    */
    isValueValid: function (surrogateKey, value, messages, propertyOverrides) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var invalidElements = [];

        if (propertyOverrides.visible) {
            self.setValue(surrogateKey, value);

            // Override properties
            decorated.properties = $.extend(decorated.properties, propertyOverrides);

            if (self.grid && typeof(decorated.grid) === "undefined") {
                decorated.grid = self.grid;
            }

            // Validate field
            decorated.isValid(invalidElements);
        }

        if (invalidElements.length > 0) {
            $.each(invalidElements, function (i, invalidElement) {
                messages.push(invalidElement.message);
            });
            return false;
        }

        return true;
    },
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
    },
    /*
    *   Returns the in-memory processed element 
    *   so the caller could append it to any place
    */
    render: function (surrogateKey, value) {
        var self = this;
        var properties = self.properties;
        // Set grid and id references to the control in order to render the content
        var decorated = self.getDecorated(surrogateKey);
        decorated.grid = self.grid;
        decorated.column = this;
        decorated.surrogateKey = surrogateKey;

        // Set cell value
        self.setValue(surrogateKey, value);

        // Override render properties
        self.overrideDecoratedRenderProperties(surrogateKey);

        // Set flag to check when a render has changed
        self.changed = false;

        // If the render is not editable return the readonly version of the column
        //Fix: Uncaught RangeError: Maximum call stack size exceeded
        if (!properties.editable && arguments[3] !== "CALLER_RENDER_READ_ONLY_COLUMNSLINK")
            return self.renderReadOnly.apply(self, arguments);

        // Returns the decorated render inside a custom layout for columns
        self.readyDeferred = new $.Deferred();
        var cell = decorated.render("cell");

        // If the render changes set the flag on
        decorated.bind("renderchange", function () {
            self.changed = true;
        });

        self.bind("rendered", function () {
            self.readyDeferred.resolve();
        });

        return cell;
    },
    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        decorated.postRenderElement(cell);
    },
    /*
    *   Returns the in-memory processed element when the element is read-only
    */
    renderReadOnly: function (surrogateKey, value) {
        var self = this;
        // Set grid and id references to the control in order to render the content
        var decorated = self.getDecorated(surrogateKey);
        decorated.grid = self.grid;
        decorated.column = this;
        decorated.surrogateKey = surrogateKey;

        // Set cell value
        self.setValue(surrogateKey, value);

        // Override render properties
        self.overrideDecoratedRenderProperties(surrogateKey);

        // Changes editable to false to render read-only
        decorated.properties.editable = false;

        // Perform the internal render
        self.readyDeferred = new $.Deferred();
        var result = decorated.render("cell.readonly");

        self.bind("rendered", function () {
            self.readyDeferred.resolve();
        });

        // Returns the decorated render inside a custom layout for columns
        return result;
    },

    /*
    *  Returns the html template to draw the summary cell
    */
    renderSummary: function (key, value) {
        var self = this;
        var result = self.renderFactory.getTemplate("cell.summary")
        return $.tmpl(result).html();
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var editable = self.properties.editable;
        decorated.properties.editable = false;
        if (self.properties.singleInstance) {
            decorated.element = cell;
        }
        decorated.postRenderElement(cell);
        decorated.properties.editable = editable;
    },

    /*
    * Return false to all columns that doesn't need special treatment (like number or currency)
    */
    postRenderSummary: function () {
        return false;
    },

    /*
    *   Returns the cell html to be inserted in the table
    */
    getCell: function () {
        return this.decorated.getDisplayValue();
    },
    /*
    *   Sets the surrogate key for this row
    */
    setSurrogateKey: function (key) {
        this.surrogateKey = key;
    },
    /*
    *   Sets the internal value, only must be called internally
    */
    setValue: function (surrogateKey, value) {
        var self = this;

        var decorated = self.getDecorated(surrogateKey);
        if (decorated != "undefined" && decorated != null) {

            decorated.properties.originalValue = value;
            decorated.properties.previousValue = value;

            if ((value === null || value === undefined) && self.properties.defaultvalue !== undefined && decorated.grid != undefined) {
                value = self.setDefaultValue(surrogateKey, decorated);
            }

            decorated.properties.value = value;
            decorated.setValue(value, false);
        }
    },

    /*
    * Set the cell default value and make this action as a change to send it to server
    */
    setDefaultValue: function (surrogateKey, decorated) {
        var self = this,
            value = self.properties.defaultvalue;

        decorated.grid.changes[surrogateKey] = decorated.grid.changes[surrogateKey] || {};
        decorated.grid.changes[surrogateKey][self.properties.xpath] = value;

        return value;
    },
    /*
    *   Gets the internal value
    */
    getValue: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        return decorated.getValue();
    },
    /*
    *   Gets the composite value (applies for non-standard render values)
    */
    getCompositeValue: function (surrogateKey) {
        return this.getValue(surrogateKey);
    },
    /*
    *   Returns the element type
    */
    getElementType: function () {
        return bizagi.rendering.element.ELEMENT_TYPE_COLUMN;
    },
    /*
    *   Determines if a render has changed its value
    */
    hasChanged: function () {
        return this.changed;
    },
    /*
    *   Triggers an event inside the control
    */
    trigger: function (eventType, data) {
        if (this.decorated)
            this.decorated.trigger(eventType, data);
    },
    /*
    *   Triggers an event handler inside the control
    */
    triggerHandler: function (eventType, data) {
        if (this.decorated)
            this.decorated.triggerHandler(eventType, data);
    },
    /*
    *   Binds to an event
    */
    bind: function (eventType, fn) {
        if (this.decorated)
            this.decorated.bind(eventType, fn);
    },
    /*
    *   Unbinds to an event
    */
    unbind: function (eventType, fn) {
        if (this.decorated)
            this.decorated.unbind(eventType, fn);
    },
    /*
    *   Override decorated properties
    */
    overrideDecoratedRenderProperties: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        // Override decorated control properties
        decorated.properties.editable = this.properties.editable;
        decorated.properties.visible = this.properties.visible;
        decorated.properties.required = this.properties.required;
    },
    overrideProperties: function (properties) {
        var self = this;

        self.properties.editable = properties.editable || self.properties.editable;
        self.properties.visible = properties.visible || self.properties.visible;
        self.properties.required = properties.required || self.properties.required;
    },

    /*
    *   Returns the xpath used to sort the grid
    */
    getSortName: function () {
        var self = this;

        // Check if there is an override for the default behaviour 
        var decorated = self.getAnyDecoratedInstance();
        if (decorated && decorated.getSortColumn) {
            return decorated.getSortColumn();
        }

        // Default behaviour
        return self.properties.xpath;
    },

    /*
    *   Returns any of the decorated instances, if there are none, return null
    */
    getAnyDecoratedInstance: function () {
        var self = this;
        var first;

        // Get the first key for the hash
        for (first in this.decorateRenders) break;

        // Return the first decorated render
        if (first) return this.decorateRenders[first];

        return null;
    },

    dispose: function () {
        var self = this;

        setTimeout(function () {
            if (self.decorated) {
                self.decorated.unbind("renderchange");
                self.decorated.dispose();
            }
        
            if (self.decorateRenders) {
                bizagi.util.arrayEach(self.decorateRenders, function (key, render) {
                    if (render) {
                        render.unbind("renderchange");
                        render.dispose();
                    }
                });
            }
        }, bizagi.override.disposeTime || 50);
        
        // Call base
        self._super();
    }
});

