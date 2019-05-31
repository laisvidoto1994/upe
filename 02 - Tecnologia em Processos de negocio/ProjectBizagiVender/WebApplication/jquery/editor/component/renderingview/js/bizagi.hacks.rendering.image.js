/*
*   Name: BizAgi Form Modeler Image Extension
*   Author: Christian Collazos
*   Comments:
*   -   This script will redefine the image class to adjust to form modeler
*/

bizagi.rendering.imageNoFlash.original = $.extend(true, {}, bizagi.rendering.imageNoFlash.prototype);
// Extends itself
$.extend(bizagi.rendering.imageNoFlash.prototype, {


    /*
    * Extend original method
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var width = self.properties.width;
        var containerType = self.parent.properties.type;

        // Call original method
        bizagi.rendering.imageNoFlash.original.postRender.apply(this, arguments);

        setTimeout(function () {
            if (width === -1) {

                var thumbnail = $(".resizable_img", control);
                var widthWrapper = control.width();
                var height = control.height();
                var containerHeight = 0;
                var totalImagesInSameContainer = 0;

                if (containerType == "grid") {
                    containerHeight = $(".resizable_img", control).closest("td").height();
                }
                else {
                    if (self.parent.properties.id == self.getFormContainer().properties.id) {
                        containerHeight = 50;
                    } else {
                        var containerChildsSize = self.parent.getChildreCount();
                        var containerChildsHeightSum = self.parent.getChildrenSumHeight("image");
                        containerHeight = $(".resizable_img", control).closest(".ui-bizagi-container").height() - 17;
                        containerHeight = containerHeight < 50 ? 50 : containerHeight;
                        totalImagesInSameContainer = self.parent.countByRenderTypeWithParams("image", -1);

                        if (containerChildsSize > 1) {
                            containerHeight = containerHeight - (containerChildsHeightSum);
                        }
                    }
                }

                thumbnail.width(widthWrapper);

                if (totalImagesInSameContainer > 1) {
                    if (null != containerHeight && containerHeight > 0) {
                        $(".resizable_img",self.parent.container).height(containerHeight / totalImagesInSameContainer + "px");
                    } else {
                        $(".resizable_img",control).height(height + "px");
                    }
                } else {
                    if (null != containerHeight && containerHeight > 0) {
                        thumbnail.height(containerHeight + "px");
                    } else {
                        thumbnail.height(height + "px");
                    }
                }
            }

            self.triggerGlobalHandler("controlRefreshCanvas");

        }, 160);

    },

    /*
    * Get image width and height and send them to modeler 
    */
    changeImageSize: function (imageWidth, imageHeight) {
        var self = this;
        var control = self.getControl();

        self.executeTriggerHandler(control, imageWidth, imageHeight, "string");

    },

    /*
    * Update control definition
    */
    executeTriggerHandler: function (control, imageWidth, imageHeight, type) {
        var self = this;
        var widthValue = "";
        var heightValue = "";

        if (type == "string") {
            widthValue = imageWidth.slice(0, -2);
            heightValue = imageHeight.slice(0, -2);
        } else {
            widthValue = imageWidth;
            heightValue = imageHeight;
        }
        self.triggerGlobalHandler("resizeImage", {
            guid: self.properties.guid,
            properties: [{
                property: "thumbnail.width",
                value: widthValue
            },
            {
                property: "thumbnail.height",
                value: heightValue
            }]
        });
    }

})