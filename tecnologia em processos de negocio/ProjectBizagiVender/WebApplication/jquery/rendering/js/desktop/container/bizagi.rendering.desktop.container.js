/*
*   Name: BizAgi Desktop Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.container.extend("bizagi.rendering.container", {}, {

    /*
    *   Constructor
    */
    initializeData: function (params) {
        // Call base
        this._super(params);

        // Checks if the container contains grids
        this.containsGrid = this.countByRenderType("grid") != 0;
    },

    /* 
    *   Resizes the container to adjust it to the container
    */
    resize: function (size) {
        var self = this,
            container = self.container;
        var width = container.width();

        // Don't resize thin or invisible containers
        if (width < 300) return;

        // Don't resize if there are no grid renders
        if (this.containsGrid == false) return;

        $.each(self.children, function (i, child) {
            $.when(child.isRendered())
            .done(function () {
                child.resize({ width: width });
            });
        });
    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function () {
        var self = this;
        var element = self.container;
        if (element) {
            element.startLoading({ delay: 250, overlay: true });
        }
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
        var self = this;

        var element = self.container;
        if (element) {
            element.endLoading();
        }
    },

    /*
    *   Counts how many renders belong to the container with some render type
    */
    countByRenderType: function (type) {
        var self = this;
        var counter = 0;
        for (var i = 0; i < self.children.length; i++) {
            var child = self.children[i];
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                counter += child.countByRenderType(type);
            }

            if (child.properties.type == type) counter++;
        }

        return counter;
    },

    /*
    *   Counts how many renders belong to the container with some render type excluding by param
    */
    countByRenderTypeWithParams: function (type, param) {
        var self = this;
        var counter = 0;
        for (var i = 0; i < self.children.length; i++) {
            var child = self.children[i];
            if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                counter += child.countByRenderType(type);
            }

            if (child.properties.type == type && param == child.properties.height) counter++;
        }

        return counter;
    },

    /*
    *   Template method to implement in each device to customize the container's behaviour to show layout
    */
    configureLayoutView: function () {
        var self = this;
        var container = self.container;
    },

    /*
    * Return the sumatory of the height of all children
    */
    getChildrenSumHeight: function (excludeElement) {
        var self = this;
        var counter = 0;
        for (var i = 0; i < self.children.length; i++) {
            var child = self.children[i];
            if (excludeElement && excludeElement == child.properties.type && child.properties.height == -1) {
                // do nothing (exclude the element)
            } else {
                if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                    var containerHeight = $(child.container).height();
                    counter += containerHeight != null ? containerHeight : 0;
                } else if (child.getElementType() == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                    var renderHeight = $(child.element).height();
                    counter += renderHeight != null ? renderHeight : 0;
                }
            }
        }

        return counter;
    },

    /*
    * Return the count of children
    */
    getChildreCount: function () {
        var self = this;

        return self.children.length;
    }
  

});
