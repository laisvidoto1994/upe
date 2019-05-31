/*
*   Name: BizAgi smartphone Render Link Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the link render class to adjust to tablet devices
*/
bizagi.rendering.link.extend("bizagi.rendering.link", {}, {
    renderSingle: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var link = $(".ui-bizagi-render-link", control);

        self.input = control.find("a");
        self.getArrowContainer().hide();

        // If link is not editable, gives a visual feedback
        if (!properties.editable) {
            link.addClass("ui-state-disabled");
            container.addClass("bz-rn-non-editable");
        } else {
            self.configureHandlers();
        }
    },

    setDisplayValue: function (value) {
        var self = this;

        if (self.isValidValue(value)) {
            self.input.attr("href", $.trim(value));
        }
    },

    configureHandlers: function(){
        var self = this;
        var properties = self.properties;

        self.input.on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if(self.isValidValue(properties.value)){
                if (self.properties.linktarget === "newwindow" || bizagi.util.isCordovaSupported()) {
                    window.open(encodeURI(this.getAttribute("href")), "_system", "location=yes");
                } else{
                    window.open(encodeURI(this.getAttribute("href")), "_system");
                }
            }
        });
    },

    isValidValue: function(value){
        var self = this;

        return (value && $.trim(value + "").toLowerCase().match(/^(http|https):\/\//) !== null) || false;
    }
});
