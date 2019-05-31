bizagi.rendering.text.extend("bizagi.rendering.search.text", {
    INPUTS_INLINE_DELAY_SAVE: 600
}, {

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var textTmpl = self.renderFactory.getTemplate("edition.text");
        self.input = $.tmpl(textTmpl).appendTo(control);
       
        self.input.toggleClass( "ui-bizagi-render-edit-text-search");
       
        self.input.bind('input keyup', function () {
            var $this = $(this);
            var delay = self.Class.INPUTS_INLINE_DELAY_SAVE;
            clearTimeout($this.data('timer'));
            $this.data('timer', setTimeout(function () {
                $this.removeData('timer');
                if(self.getValue()!=self.input.val())
                self.setValue(self.input.val(), false);

            }, delay));
        });

        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        } else {
            container.addClass("bz-command-edit-inline");
        }


    },

    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        self.setValue(value, false);
        self.input.html(value);

    }
});