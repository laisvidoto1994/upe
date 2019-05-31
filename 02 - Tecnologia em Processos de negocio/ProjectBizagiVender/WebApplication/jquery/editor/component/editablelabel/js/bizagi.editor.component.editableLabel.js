/*
 * @title : Xpath component
 * @author : D/ego Parra 
 * @date   : /13mar12 
 * Comments:
 *     Define the editable label component
 */

bizagi.editor.component.controller("bizagi.editor.component.editableLabel", {

    /*
    *   Constructor, accepts params in order to configure
    *
    *   - label
    *   - presenter
    *   - value
    */
    init: function (canvas, params) {
        // Call super
        this._super(canvas);

        // Set up the variables
        this.canvas = canvas;
        this.params = params;
        this.presenter = params.presenter;
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "editableLabel": bizagi.getTemplate("bizagi.editor.component.editablelabel")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Renders the component
    */
    render: function () {
        var self = this;
        var params = self.params;

        $.when(self.loadTemplates())
        .done(function () {
            // Render component
            var editableLabel = self.editablelabel = $.tmpl(self.getTemplate("editableLabel"), { value: params.value });
            editableLabel.width(params.label.width());

            // Replace original element
            params.label.hide();
            params.label.after(editableLabel);

            // Add handlers
            var input = editableLabel.find("input"),
                inputValue = params.value,
                inputWidth = editableLabel.width()-50;
            input.width(inputWidth);
            input.keyup(function (ev) {
                self.onInputKeyUp(input, ev);
            });
            input.click(function (ev) {
                ev.stopPropagation();
            });
            input.keydown(function (ev) {
                ev.stopPropagation();
            });
            input.blur(function (ev) {
                ev.stopPropagation();
                ev.stopimmediatepropagation();
                self.onInputBlur(input, ev);

            });
            $(".ui-bizagi-input-icon", editableLabel).mousedown(function (ev) { self.onIconClicked(input, ev); });

            // Place the cursor at the end of text input
            input.focus();
            input.val('');
            input.val(inputValue);
        });
    },

    /*
    *   Destroys the component
    */
    destroy: function () {
        var self = this;
        var params = self.params;

        // Restore original element
        params.label.show();
        self.editablelabel.detach();

        // Detach element
        this.element.detach();

    },


    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/
    /*
    *   Manages input key up
    */
    onInputKeyUp: function (element, ev) {
        var self = this,
            newValue = element.val();

        if (ev.keyCode === 13) {
            if (self.params.value === newValue) {

                self.presenter.publish("keyup", { value: newValue, keyCode: ev.keyCode });
                
                // Destroy the element
                self.presenter.destroy();
                return;
            } else {
                // Publish change
                self.presenter.publish("change", { value: newValue });
                return;
            }
        }

        // By default publish keyup event
        self.presenter.publish("keyup", { value: newValue, keyCode: ev.keyCode });
    },

    /*
    *   Manage icon options
    */
    onIconClicked: function (element, ev) {
        var self = this;
        var newValue = element.val();

        $(".ui-bizagi-input-icon").data("iconClicked", true);

        if ($(ev.target).hasClass("ui-bizagi-input-icon-ok") && self.params.value !== newValue) {
            // User presses ok icon and the value has changed
            self.presenter.publish("change", { value: newValue });
        }
        // Destroy the element
        self.presenter.destroy();
    },

    /*
     *   Manage input on blur
     */
    onInputBlur: function (element, ev) {
        var self = this;
        if($(".ui-bizagi-input-icon").data("iconClicked") != true){
            var newValue = element.val();
            self.presenter.publish("change", { value: newValue });
        }
    }
});

