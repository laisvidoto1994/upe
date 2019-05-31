/*
*   Name: BizAgi smartphone Render option select
*   Author: Oscar O
*   Comments:
*   -   Renders an option html input with attached handlers
*/

// Extends itself
bizagi.rendering.combo.extend("bizagi.rendering.combo", {
    MAXIMUN_ALLOWED_EDIT_INLINE: 40
}, {

    renderSingle: function () {
        var self = this;
        self._super();
        var properties = self.properties;
        var container = self.getContainerRender();
        var params = {};
        self.selectedValue = self.properties.value;
        
        if (properties.parentComboValue && properties.parentComboValue != null) {
            params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = properties.parentComboValue;
        }


        if (properties.editable) {
            if (typeof self.initialValueSet !== "undefined" && !self.initialValueSet) {
                $.when(self.renderCombo(params)).done(function (html) {
                    self.getControl().html(html);
                    self.input = self.combo = self.getControl();
                    self.configureCombo();
                });
            } else {

                self.configureCombo();
            }

        } else {

            self.input = self.combo = self.getControl();
            container.addClass("bz-command-not-edit");
            if (self.input) {
                self.inputSpan = self.input.html("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");
                if (self.value != null) {
                    self.inputSpan.html(self.value.value || self.value.id); 
                }
                self.input.prop("readonly", true);
                self.input.find(".bz-rn-cm-text-label").parent().addClass("disabled");
                self.input.find(".bz-rn-cm-text-label").closest(".bz-rn-combo-cn-select-div").addClass("disabled");
            }
        }

    },


    configureCombo: function () {

        var self = this;
        var container = self.getContainerRender();
        self.input = self.combo = self.getControl();
        self.input.find('option:first').empty().html("---");
        self.inputSpan = self.input.find(".bz-rn-cm-text-label");
        self.inputSpan.html($("option:selected", self.input).text());
        self.inputSpan.val($("option:selected", self.input).text());
        self.input.bind("change", function () {

            var valueItem = $("option:selected", this).text();
            var valueObjet = { id: $("option:selected", this).val(), value: valueItem };

            if (valueObjet.id == "" && (valueObjet.value == "" || valueObjet.value == "---")) {
                valueObjet = "";
            }
            self.changeCombo(valueItem, valueObjet);
        });

        if (self.properties.data && self.properties.data.length && self.properties.data.length >= self.Class.MAXIMUN_ALLOWED_EDIT_INLINE) {
            self.inputSpan.parent().addClass("disabled");
            self.inputSpan.closest(".bz-rn-combo-cn-select-div").addClass("disabled");
            if (self.input.find(".bz-rn-combo-list").length >= 1)
                self.input.find(".bz-rn-combo-list").hide();
        }
        else {
            container.addClass("bz-command-edit-inline");
            self.getArrow().addClass("edit-combo-arrow");
            self.getArrowContainer().show();
        }

    },

    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();

        if (properties.editable) {
            if (self.properties.data && self.properties.data.length && self.properties.data.length >= self.Class.MAXIMUN_ALLOWED_EDIT_INLINE) {

                self.inputSpan.parent().addClass("disabled");
                self.inputSpan.closest(".bz-rn-combo-cn-select-div").addClass("disabled");

                if (self.input.find(".bz-rn-combo-list").length >= 1) self.input.find(".bz-rn-combo-list").hide();
            }
            else {
                container.addClass("bz-command-edit-inline");

            }
        }

        self._super();

    },

    renderEdition: function () {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var container = self.getContainerRender();
        var data = self.properties.data;

        if (data[0] && data[0].value == "- - - - - - - - - - - - - - - - - - - - - - -" && data[0].id == "") {
            data[0].id = "default";
        }

        var template = self.renderFactory.getTemplate(self.getTemplateEditionName());
        self.inputEdition = $.tmpl(template, $.extend(self.getTemplateParams(), {
            id: properties.id,
            xpath: properties.xpath,
            idPageCache: properties.idPageCache,
            items: data
        }));

        self.inputEdition.find("#default").addClass('bz-rn-combo-selected');
        self.inputEdition.find(">div").bind('click', function () {
            self.trigger('selectElement', [this]);
        });

        self.inputEdition.find(">div").bind('click', function () {
            self.inputEdition.find(">div.bz-rn-combo-selected").removeClass('bz-rn-combo-selected');
            $(this).addClass('bz-rn-combo-selected');
        });

    },

    setDisplayValueEdit: function (value) {
        var self = this;
        self.inputEdition.find(">div.bz-rn-combo-selected").removeClass('bz-rn-combo-selected');
        self.inputEdition.find("[id='" + value.id + "']").addClass('bz-rn-combo-selected');
    },
    actionSave: function () {
        var self = this;
        var selected = this.inputEdition.find('.bz-rn-combo-selected');
        var valueItem = selected.find(">div >span").html();
        var valueObjet = { id: selected.attr("id"), value: valueItem };
        self.changeCombo(valueItem, valueObjet);
    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (value && value.id) {
            // Check if the value is a json object
            if ((value.id != undefined) && ((typeof value.id == 'number' && value.id != null) || (typeof value.id == 'string' && value.id.length > 0))) {
                self.input.find("option[value='" + value.id + "']").prop("selected", true);
            } else {
                // If the value is the key then assign it
                self.input.find("option[value='" + value + "']").prop("selected", true);
            }
        }



        var valuers = value.value ? bizagi.rendering.combo.prototype.formatItem.call(self, value.value) : value.value;
        if (properties.editable) {
            $(self.input).val(value.id);
            self.inputSpan.html(valuers);
            self.inputSpan.val(valuers);
        }
        else {
            var tmpreadonly = $("<span class=\"bz-rn-text\" disabled=\"disabled\"></span>");
            control.html(tmpreadonly.html(valuers));
        }

    },

    addDisplayValue: function (children) {
        var self = this;
        var self_children = children;
        var value = self_children.value;
        var control = self.getControl();

        valuers = value.value ? self.formatItem(value.value) : value.value;
        self_children.input.html(valuers)
        self_children.input.attr("id", value.id);
        self_children.input.appendTo(control);
    },

    addComboToControl: function (children) {
        var self = this;
        var self_children = children;
        var control = self.getControl();

        var parentElement = (control.find("#" + self_children.properties.parentCombo).length > 0) ? control.find("#" + self_children.properties.parentCombo) : '';

        (control.find("#" + self_children.properties.id).length > 0) ?
            control.find("#" + self_children.properties.id).replaceWith(self_children.input) :
             (parentElement != "") ?
                 parentElement.after(self_children.input) :
                    self_children.input.appendTo(control);
    },

    changeCombo: function (valueItem, valueObjet) {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        self.setValue(valueObjet);
        self.selectedValue = valueItem;
        self.trigger('selectElement', valueObjet);
        self.inputSpan.html(valueItem);
        self.inputSpan.val(valueItem);
    },

    getTemplateName: function () {
        return "combo";
    },
    getTemplateEditionName: function () {
        return "edition.combo";
    }

});
