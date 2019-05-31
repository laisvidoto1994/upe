/*
*   Name: BizAgi Tablet Render Text Extension
*   Author: Andres Valencia
*   Comments: Extended text implementation
*/

// Extends itself
bizagi.rendering.extendedText.extend("bizagi.rendering.extendedText", {}, {

    /* CONSTRUCTOR
    =====================================================*/
    init: function (params) {
        var self = this;

        // Call base
        self._super(params);

        // Fill default properties
        var properties = self.properties;

        // Set rowSize default
        properties.rowSize = properties.rowSize || 5;
    },

    /* POSTRENDER
    =====================================================*/
    postRender: function () {

        var self = this;
        var properties = self.properties;
        var counter = 0;

        // Call base 
        this._super();

        self.textarea = $("textarea", self.getControl());

        // Increase default textarea rows to improve readability
        self.textarea.prop('rows', properties.rowSize);


        // Define max length of element
        if (properties.maxLength > 0) {
            self.textarea.attr("maxlength", properties.maxLength);
        }

        // extend textArea to allow to see all the content
        var autoAdjustIntervalMethod = function () {
            if ((counter > 2000) || (typeof (self.textarea) !== "undefined" && self.textarea[0] && self.textarea[0].scrollHeight > 0)) {
                self.autoAdjustExtendedFrame(self.textarea[0]);
                stopAutoAdjustInterval();
            }
            counter += 500;
        };

        var stopAutoAdjustInterval = function () {
            clearInterval(autoAdjustInterval);
        };

        var autoAdjustInterval = properties.autoExtend ? setInterval(function () { autoAdjustIntervalMethod(); }, 500) : null;
    },

    postRenderReadOnly: function () {

        var self = this;

        // Call base 
        self._super();

        self.textarea = $("textarea", self.getControl());

    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super(value);
        self.postRenderReadOnly();

        // Set value in input
        if (value && properties.editable) {

            // Offline capability
            var isOfflineForm = typeof (bizagi.context.isOfflineForm) !== "undefined"
		    && bizagi.util.parseBoolean(bizagi.context.isOfflineForm);

            if (isOfflineForm) {
                value = typeof (value) === "object" && value.value ? value.value : value;
            }

            var resolvedValue = $.br2nl(value);
            resolvedValue = resolvedValue.replaceAll('\\n', '\n');
            self.textarea.text(resolvedValue);

        }
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();
        // Define max length of element
        if (properties.maxLength > 0) {
            if (properties.autoExtend) {
                $(self.textarea).bind("keydown keypress", function (e) {
                    self.autoAdjustExtendedFrame(this);
                });
            }
        }
    },

    autoAdjustExtendedFrame: function (element) {

        // If scrollHeight <= 0 a div must be created with the same content 
	// to get the height that should have the extendedText 
        if (element.scrollHeight <= 0) {
            var hiddenDiv = $(document.createElement('div')),
            content = null;

            $(hiddenDiv).attr("display", "none");
            $('body').append(hiddenDiv);

            content = $(element).val();
            content = content.replace(/\n/g, '<br>');
            hiddenDiv.html(content + '<br>');

            $(element).css('height', hiddenDiv.height());

            hiddenDiv.remove();
        } else {

            if ($(element).height() > 100) {
                $(element).height($(element).height() - 20);
            }
            while ($(element).outerHeight() < element.scrollHeight) {
                $(element).height($(element).height() + 1);
            };
        }
    }

});