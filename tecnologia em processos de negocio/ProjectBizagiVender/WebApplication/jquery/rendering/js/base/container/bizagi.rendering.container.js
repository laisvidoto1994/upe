/*
 *   Name: BizAgi Container Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base container class with common stuff related to all containers
 */

bizagi.rendering.element.extend("bizagi.rendering.container", {
    TYPE_QUERY_FORM:"queryForm"
    },
    {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

        // Call base
        self._super(data);

        // Set defaults
        var properties = self.properties;
        properties.uniqueId = Math.ceil(Math.random() * 1000000);
        properties.editable = (typeof properties.editable != "undefined") ? bizagi.util.parseBoolean(properties.editable) : true;
        properties.visible = (typeof properties.visible != "undefined") ? bizagi.util.parseBoolean(properties.visible) : true;

        // Override orientation from parent if not set
        properties.orientation = properties.orientation || (self.parent ? self.parent.properties.orientation : "ltr");

        // Save original properties
        this.originalProperties = JSON.parse(JSON.encode(properties));

        // Create children
        this.children = [];
        this.childrenHash = {};
        if (data.elements) {
            $.each(data.elements, function (i, element) {
                if (element.render) {
                    self.createRenderElement(element);
                }
                else if (element.container) {
                    self.createContainerElement(element);
                }
                else if (element.form) {
                    self.createFormElement(element);
                }
            });
        }
    },

    /*
    *   Creates a render element
    */
    createRenderElement: function (element) {
        var self = this;
        var properties = self.properties;
        var originalElement;

        // Replicate editable property when container is not editable
        if (properties.editable == false && element.render.properties.editable != true) {
            element.render.properties.editable = properties.editable;
            if (element.render.properties.type == "grid")
                element.render.properties.inlineEdit = false;
        }

        // Replicate required property when container is not required
        if (properties.required === false) {
            element.render.properties.required = properties.required;
        }

        //clone originalElement to apply duplicate render properties correctly
        if (element.render.properties.retype == "duplicate") {
            originalElement = bizagi.clone(element);
        }
        var render = self.renderFactory.getRender({
            type: element.render.properties.type,
            data: element.render,
            dataService: self.dataService,
            parent: self,
            mode: self.getMode()
        });

        // Add to children
        self.children.push(render);

        // Check for duplicate
        if (element.render.properties.retype == "duplicate") {
            self.processDuplicateRender(render, originalElement);
        }

        //TODO: at this point not posible add the retype double at this point not exist input

        // Register in form container
        self.getFormContainer().registerRender(render);
    },
    /*
    *   Creates a container element
    */
    createContainerElement: function (element) {
        var self = this;
        var properties = self.properties;

        // Replicate editable property when container is not editable
        if (properties.editable == false) {
            element.container.properties.editable = properties.editable;
        }

        // Replicate required property when container is not required
        if (properties.required === false) {
            element.container.properties.required = properties.required;
        }

        var container = self.renderFactory.getContainer({
            type: element.container.properties.type,
            data: element.container,
            parent: self,
            dataService: self.dataService,
            mode: self.getMode()
        });

        self.children.push(container);

        // Register in form container
        self.getFormContainer().registerRender(container);
    },
    /*
    *   Creates a form element
    */
    createFormElement: function (element) {
        var self = this;
        var properties = self.properties;

        // Replicate editable property when container is not editable
        if (properties.editable == false) {
            element.container.properties.editable = properties.editable;
        }

        var form = self.renderFactory.getContainer({
            type: (element.form.properties.type || "form"),
            data: element.form,
            parent: self,
            dataService: self.dataService,
            mode: self.getMode()
        });
        self.children.push(form);
    },
    /* 
    *   Gets the current container 
    */
    getElement: function () {
        var self = this;
        return self.container;
    },
    /* 
    *   Gets a collection for all elements matching a type 
    */
    getElementsByType: function (type, elements) {
        elements = elements || [];
        var self = this;

        // Iterate through elements
        $.each(self.children, function (i, child) {
            if (child.properties.type == type) {
                elements.push(child);
            }
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                child.getElementsByType(type, elements);
            }
        });

        return elements;
    },
    /*
    *   Process renders with duplicate property
    */
    processDuplicateRender: function (render, element) {
        var self = this;
        var clonedElement = JSON.parse(JSON.encode(element.render));

        // Changes properties
        clonedElement.properties.displayName = clonedElement.properties.displayName + " " + self.getResource("render-text-duplicate-label-sufix");
        clonedElement.properties.xpath = clonedElement.properties.xpath + ".clone";
        clonedElement.properties.isClone = true;

        // Creates clone
        var clone = self.renderFactory.getRender({
            type: clonedElement.properties.type,
            data: clonedElement,
            parent: self,
            mode: self.getMode()
        });

        // Associates with main render
        render.cloneRender = clone;

        // Add to collection
        self.children.push(clone);
    },
    /*
    *   Returns the element type
    */
    getElementType: function () {
        return bizagi.rendering.element.ELEMENT_TYPE_CONTAINER;
    },
    /*
    *   Returns the in-memory processed element
    */
    render: function () {
        var self = this,
            mode = self.getMode(),
            result;

        // Render container
        result = self.internalRender();

        // Apply container defaults
        self.applyContainerDefaults();

        // Add container id
        result.attr("data-container-id", self.properties.id);

        //Add container tag property
        if (self.properties.tag) {
            result.attr("data-tag", self.properties.tag);
        }

        //Add class to the requested form, to specify if is add form, edit form, or detail form
        if (self.params)
            if (self.params.requestedForm)
                result.addClass(self.params.requestedForm);

        return result;
    },
    /*
    *   Internal  rendering
    */
    internalRender: function () {
        var self = this;

        // Render the container
        var html = self.renderContainerHtml();

        // Convert html string to jquery object
        var container = self.container = $(html);

        // Post-render
        self.postRenderContainer(container);

        return self.container;
    },
    /*
    *   Renders container html
    */
    renderContainerHtml: function () {
        var self = this;
        // Start rendering deferred
        self.renderingDeferred = self.renderingDeferred || new $.Deferred();

        return this.renderContainer();
    },
    /*
    *   Check if the jquery element is ready or not
    */
    isRendered: function () {
        var self = this;
        if (!self.renderingDeferred)
            return false;
        return self.renderingDeferred.promise();
    },
    /*
    *   Return the rendered element
    */
    getRenderedElement: function () {
        if (bizagi.util.isEmpty(this.container))
            alert("container hasn't been rendered!");

        return this.container;
    },
    /* 
    *   Set container defaults
    */
    applyContainerDefaults: function () {
        var self = this,
                properties = self.properties;

        // Set customizations
        if (properties.backgroundColor)
            self.changeBackgroundColor(properties.backgroundColor);

        // Set editability and visiblity
        if (!properties.visible)
            self.changeVisibility(properties.visible);
    },
    /* 
    *  Changes background color 
    */
    changeBackgroundColor: function (color) {
        var self = this;
        var properties = self.properties;

        properties.backgroundColor = color;

        // Iterate through elements
        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                child.changeBackgroundColor(color);

            } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                child.changeBackgroundColor(color);
            }
        });
    },
    /* 
    *   Hides / Show container 
    */
    changeVisibility: function (argument) {
        var self = this;
        var properties = self.properties;

        // Store in properties
        properties.visible = bizagi.util.parseBoolean(argument);

        // Hide - show the render
        if (properties.visible) {
            self.container.show();

        } else {
            self.container.hide();
        }
    },
    /* Changes editability */
    changeEditability: function (argument) {
        var self = this;
        var properties = self.properties;

        // Store in properties
        properties.editable = bizagi.util.parseBoolean(argument);

        // Iterate through elements
        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                child.changeEditability(argument);

            } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                child.changeEditability(argument);
            }
        });
    },
    /*
    *   Replaces a <x/> tag in the container for the specified "replace" element
    */
    replaceTag: function (container, tag, replace) {
        bizagi.util.replaceSelector(container, tag, replace);
    },
    /*
    *   Replaces a <children/> tag in the container for the specified "replace" element
    */
    replaceChildrenTag: function (container, replace) {
        this.replaceTag(container, ".children", replace);
    },
    /*
    *   Replaces a {{children}} string in the specified element
    */
    replaceChildrenHtml: function (html, replace) {
        return html.replace("{{children}}", replace);
    },
    /*
    *   Template method to render the container layout, returns a string with all the builded html,
    *   must be overriden in all children
    */
    renderContainer: function () {
    },
    /*
    *   Template method to process each jquery object
    *   must be overriden in each container
    */
    postRenderContainer: function (container) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        // Resolve rendering deferred
        if (self.renderingDeferred)
            self.renderingDeferred.resolve();

        // Process children elements
        self.container = container;
        self.executeChildrenPostRender(container);

        if (mode == "execution") {
            // Apply handlers
            self.configureHandlers();
            self.applyPlaceHolderPolyfill();

        }
        if (mode == "design") {
            // Configure view
            self.configureDesignView();
        }
        if (mode == "layout") {
            // Configure view
            self.configureDesignView();
            self.configureLayoutView();
        }
    },

    applyPlaceHolderPolyfill: function () {
        var self = this;
        var config = window.placeHolderConfig || {};
        if (('placeholder' in $('<input>')[0] || 'placeHolder' in $('<input>')[0]) && !config.forceApply) {
            // don't run the polyfill when the browser has native support
            return;
        }
        Placeholders.enable();
    },
    /*
    *   Process container children
    */
    executeChildrenPostRender: function (container) {
        var self = this;
        var childrenElements = container.children();

        $.each(childrenElements, function (i, childElement) {
            childElement = $(childElement);
            var id = Number(childElement.data("unique-id"));
            if (id) {
                var child = self.childrenHash[id];
                if (child) {
                    var type = child.getElementType();
                    if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER)
                        child.postRenderElement(childElement);
                    if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER)
                        child.postRenderContainer(childElement);
                }
            } else {
                self.executeChildrenPostRender(childElement);
            }
        });
    },
    /*
    *   Template method to implement in each device to customize the container's behaviour to add handlers
    */
    configureHandlers: function () {
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
    },
    /*
    *   Template method to implement in each device to customize the container's behaviour to show layout
    */
    configureLayoutView: function () {

    },
    /**
    *   Renders all children html
    */
    renderChildrenHtml: function () {
        var self = this;
        var temp = "";

        $.each(self.children, function (i, child) {
            var type = child.getElementType();
            if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER)
                temp += child.renderElement();
            if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER)
                temp += child.renderContainerHtml();
            self.childrenHash[child.properties.uniqueId] = child;
        });

        return temp;
    },
    /*
    *   Iterate through all the renders in the container and fills the hashtable
    */
    collectRenderValues: function (renderValues) {
        var self = this;
        if (self.children) {
            $.each(self.children, function (i, child) {
                if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                    // Go though container
                    child.collectRenderValues(renderValues);

                } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                    // Check if the render can be sent to the server
                    if (child.canBeSent()) {
                        child.collectData(renderValues);
                    }
                }
            });
        }
    },

    /*
    *   Iterate through all the renders and check if has changed
    */
    hasChanged: function (result) {
        var self = this;
        result = result || [];

        if (!result.length) {
            if(self.children){
                $.each(self.children, function (i, child) {
                    if (result.length || child.hasChanged(result)) {
                        return false;
                    }
                });
            }
        } else {
            return result;
        }
    },

    /*
    *    Creates a json array parameters to search result
    */
    collectRenderValuesQueryForm: function (renderValues) {
        var self = this;
        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                // Go though container
                child.collectRenderValuesQueryForm(renderValues);

            } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                // Check if the render can be sent to the server
                if (child.canBeSentQueryForm()) {
                    child.collectDataQueryForm(renderValues);
                }
            }
        });
    },
    /*
    *   Gets the first child
    */
    firstChild: function () {
        return this.children[0];
    },
    /*
    *   Method to find all the renders matching an xpath inside the container
    */
    getRenders: function (xpath, renders) {
        var self = this;

        renders = renders || [];

        // Remove [] filters for grid columns xpaths to fully identify the grid as the xpath target
        if (xpath.indexOf("[") > 0) {
            xpath = xpath.substring(0, xpath.indexOf("["));
        }

        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                // Go though container
                child.getRenders(xpath, renders);

            } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                if (xpath == child.properties.xpath) {
                    renders.push(child);
                }
            }
        });

        return renders;
    },
    /* 
    *   Gets the first editable render 
    */
    getRender: function (xpath) {
        var self = this;
        var renders = self.getRenders(xpath);
        var result = null;
        $.each(renders, function (i, render) {
            if (render.properties.editable) {
                if (result == null)
                    result = render;
            }
        });

        // if no render has been found, skip editable condition
        if (result == null) {
            $.each(renders, function (i, render) {
                result = render;
            });
        }

        return result;
    },

    /*
     *   Gets all renders by xpath
     */
    getRendersByXpath: function (xpath) {
        var self = this;
        return self.getRenders(xpath);
    },

    /* 
    *   Gets a container by the id
    */
    getContainer: function (id) {
        var self = this;

        if (self.properties.id == id)
            return this;

        var result;
        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                // Go though container
                var o = child.getContainer(id);
                if (o != null) {
                    result = o;
                    return false;
                }
            }
        });

        return result;
    },
    /* 
    *   Validate all renders in the container 
    */
    isValid: function (invalidElements) {
        var self = this;

        $.each(self.children, function (i, child) {
            if (child.properties.visible) {
                if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                    // Go though container
                    child.isValid(invalidElements);

                } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                    // Go to the render
                    child.isValid(invalidElements);
                }
            }
        });

        return invalidElements.length == 0;
    },
    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () {
        var self = this;
        return $.when(self.parent.ready(), self.isRendered());
    },
    /*
    *   Returns a promise that will resolve when the element is ready to save
    */
    isReadyToSave: function () {
        var self = this;
        var childrenPromises = $.map(self.children, function (child) {
            return child.isReadyToSave();
        });
        return $.when.apply($, childrenPromises);
    },
    /*  
    *   Return the current focuses container
    */
    getFocus: function () {
        var self = this;
        var focus;
        $.each(self.children, function (i, child) {
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                var result = child.getFocus();
                if (!bizagi.util.isEmpty(result)) {
                    focus = result;
                }
            }
        });

        return focus;
    },
    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandlers: function () {
        var self = this;
        var form = self.getFormContainer();

        if (form) {
            return form.getCustomHandlers();
        }
    },
    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandler: function (key) {
        var self = this;
        var customHandlers = self.getCustomHandlers();

        if (customHandlers) {
            return customHandlers[key];
        }
    },
    /*
    *   Dispose the class so we can detect when a class is invalid already
    */
    dispose: function () {
        var self = this;

        // Iterate through elements
        setTimeout(function () {
            if (self.children) {
                $.each(self.children, function (i, child) {
                    child.dispose();
                });
            }
        }, bizagi.override.disposeTime || 50);

        // Call base
        self._super();
    },

    /*
    *   Refresh the current container
    */
    refreshContainer: function (args) {
        var self = this;
        var properties = self.properties;

        // Start waiting
        self.startLoading();

        // Execute personalized stuff before to refresh it
        self.beforeToRefresh();

        // Call the service
        return $.when(self.dataService.multiaction().refreshControl({
            xpath: properties.xpath,
            idRender: properties.id,
            idPageCache: properties.idPageCache,
            xpathContext: (properties.xpathContext || args.xpathContext),
            contexttype: self.properties.contexttype || ""
        }))
                .done(function (data) {

                    if (!self.isDisposed()) {
                       
                        // Unregister children of container to replace in hash self.rendersById and self.rendersByXpath
                        self.unregisterChildren();
                        delete self.children;
                        delete self.childrenHash;

                        self.getFormContainer().removeActions();

                        // update editable
                        if (self.properties.editable === false) {
                            data.container && data.container.properties ? (data.container.properties.editable = false) : "";
                        }

                        // Update the data
                        self.initializeData(data.container);

                        // Render the container again
                        var currentContainer = self.container;
                        var result = self.render();

                        if (self.properties.type == "tabItem") {
                            $(result).addClass("childrenActive");
                        }

                        currentContainer.replaceWith(result);

                        // Rebind the actions
                        var actions = data.container && data.container.actions ? data.container.actions : [];
                        self.getFormContainer().refreshActions(actions);

                        self.triggerChildrenActions();

                        // Execute personalized stuff after to refresh it
                        self.afterToRefresh();
                        
                    }
                }).fail(function (message) {
                    message = self.processFailMessage(message);

                }).always(function () {
                    self.endLoading();
                });
    },

    /*
     *   Refresh the current container
     */
    refreshDesignContainer: function (data) {
        var self = this;
        var properties = self.properties;

        // Execute personalized stuff before to refresh it
        self.beforeToRefresh(data);
        //self.setActiveTab(data.elements);

        $.extend(data.properties, {
            editable: properties.editable,
            contexttype: (properties.contexttype || ""),
            idPageCache: properties.idPageCache,
            idRender: properties.id,
            messageValidation: properties.messageValidation,
            uniqueId: properties.uniqueId,
            visible:properties.visible,
            xpath: properties.xpath,
            mode: "design",
            xpathContext: properties.xpathContext || ""
        });


        if (!self.isDisposed())
        {
            // Unregister children of container to replace in hash self.rendersById and self.rendersByXpath
            self.unregisterChildren();
            delete self.children;
            delete self.childrenHash;

            

            // update editable
            if (self.properties.editable === false) {
                data.container && data.container.properties ? (data.container.properties.editable = false) : "";
            }

            // Update the data
            self.initializeData(data.container);

            // Render the container again
            var currentContainer = self.container;
            var result = self.render();

            if (self.properties.type == "tabItem") {
                $(result).addClass("childrenActive");
            }

            currentContainer && currentContainer.replaceWith(result);
         

            // Execute personalized stuff after to refresh it
            self.afterToRefresh();
        }
    },

    beforeToRefresh: function () {
        var self = this;

        // Call beforeToRefresh of each children
        for (var i = 0; i < self.children.length; i++) {
            self.children[i].beforeToRefresh();
        }
    },

    afterToRefresh: function () {
        var self = this;

        // Call beforeToRefresh of each children
        for (var i = 0; i < self.children.length; i++) {
            self.children[i].afterToRefresh();
        }
    },

    /*
    *   Re-execute children actions
    */
    triggerChildrenActions: function () {
        var self = this;

        var form = self.getFormContainer();
        var children = self.children;

        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            var type = child.getElementType();

            if (type === bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                child.triggerChildrenActions();
            }
            else if (type === bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                child.triggerRenderChange({ changed: false });
            }
        }
    },


    /*
    * register actions container
    */
    registerActions: function (actions) {
        var self = this;
        var form = self.getFormContainer();

        if (actions) {
            form.actionController.buildActions(actions);
        }
    },

    /*
    * unregister children container
    */
    unregisterChildren: function () {
        var self = this;

        var form = self.getFormContainer();
        var children = self.children;

        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            var type = child.getElementType();

            if (type === bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                child.unregisterChildren();
            }
            else if (type === bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                form.unregisterRender(child);
            }
        }
    },
    /*
    * Replace child
    */
    replaceChild: function (element) {
        var self = this;

        var children = self.children;

        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];

            if (child.properties.uniqueId == element.properties.uniqueId) {
                children.splice(i, 1);
                children.splice(i, 0, element);
                break;
            }
        }
    },
    /*
    * Gets child
    */
    getChildById: function (id) {

        var self = this;

        var children = self.children;

        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];

            if (child.properties.id == id) {
                return child;
            }
        }

        return null;
    }

});
