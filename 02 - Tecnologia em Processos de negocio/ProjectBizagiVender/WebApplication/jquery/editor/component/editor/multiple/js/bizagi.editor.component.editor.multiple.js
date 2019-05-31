/*
@title: Editor multiple
@authors: Rhony Pedraza
@date: 05-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.multiple", {

        init: function (canvas, model, controller, params) {
            var self = this;

            model = new bizagi.editor.component.editor.multiple.model(model);

            // call base
            self._super(canvas, model, controller);


            if (params.refProperties !== undefined) {
                self.refProperties = params.refProperties;
            }
        },

        /*
        * 
        */
        renderEditor: function (container, data) {
            var self = this;

            self.value = [];

            if (self.model.isExclusive()) {

                var elEditor = $.tmpl(self.getTemplate("frame-exclusive"), self.model.getModel());
                self.renderExclusiveSubproperties(elEditor.find(".multiple-category-group"));
            } else {
                elEditor = $.tmpl(self.getTemplate("frame"), data);
                $.each(self.model.getProperties(), function (i, subproperty) {
                    self.renderSubproperty(elEditor.find(".multiple-category-group"), subproperty);
                });
            }

            elEditor.appendTo(container);
            self.setAsCollapsible(elEditor);
            self.hideSubproperties();
        },


        /*
        *
        */
        renderProperties: function (container, exclusive) {
            var self = this;

            var properties = self.model.getProperties();
            for (var i = 0, l = properties.length; i < l; i++) {
                self.renderSubproperty(container, properties[i], exclusive);
            }
        },

        /*
        *
        */
        renderExclusiveSubproperties: function (container) {
            var self = this;

            var properties = self.model.getSelectedProperty();

            for (var i = 0, l = properties.length; i < l; i++) {
                self.renderSubproperty(container, properties[i], true);
            }
        },

        /*
        *
        */
        renderSubproperty: function (container, dataProperty, exclusive) {
            var elProperty, property;

            if (dataProperty.notShow === undefined) {

                elProperty = $.tmpl(this.getTemplate("frame-property"), {});

                dataProperty["bas-type"] = this.machineName(dataProperty["bas-type"]);

                // search valid editor
                if (/^.*xpath.*$/ig.test(dataProperty["bas-type"])) {
                    // search xpath editor
                    if (exclusive === undefined) {
                        property = new bizagi.editor.component.editor.xpath(elProperty, dataProperty, this.controller);
                    } else {
                        property = new bizagi.editor.component.editor.xpath(elProperty, $.extend({}, dataProperty, { exclusive: true }), this.controller);
                    }
                    elProperty.appendTo(container);
                    property.render();
                    this.registerSubproperty(property);
                } else {
                    if (bizagi.editor.component.editor[dataProperty["bas-type"]] === undefined) {
                        throw "Editor " + dataProperty["bas-type"] + " doesn't exists.";
                    } else {
                        if (exclusive === undefined) {
                            property = new bizagi.editor.component.editor[dataProperty["bas-type"]](elProperty, dataProperty, this.controller);
                        } else {
                            property = new bizagi.editor.component.editor[dataProperty["bas-type"]](elProperty, $.extend({}, dataProperty, { exclusive: true }), this.controller);
                        }
                        elProperty.appendTo(container);
                        property.render();
                        this.registerSubproperty(property);
                    }
                }
            }
        },

        /*
        *
        */
        registerSubproperty: function (property) {
            var self = this;
            self.refProperties[property.options.name] = property;
        },

        /*
        *
        */
        machineName: function (string) {
            return string.toLowerCase().replace(/-/g, "");
        },


        /*
        *
        */
        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        /*
        *
        */
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.multiple").concat("#multiple-frame")),
                this.loadTemplate("frame-property", bizagi.getTemplate("bizagi.editor.component.editor.multiple").concat("#multiple-frame-property")),
                this.loadTemplate("frame-exclusive", bizagi.getTemplate("bizagi.editor.component.editor.multiple").concat("#multiple-frame-exclusive"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /*
        *
        */
        setAsCollapsible: function (collapsibleObj) {
            var content = $('.ui-content', collapsibleObj);
            $('h3', collapsibleObj).bind('click', function () {
                content.slideToggle(function () {
                    $(this).css('overflow', 'visible');
                });
            });
        },

        /*
        * Hide subproperties in main container
        */
        hideSubproperties: function () {
            var self = this;

            if (self.model.isExclusive() && !self.model.hasValue()) {
                self.element.find(".multiple-category-group").empty();
            }
        },

        /*
        * Updates property to undefined
        */
        updatePropertyToNone: function () {
            var self = this;
            
            if (self.model.hasValue()) {
                self.controller.publish("propertyEditorChanged", {                    
                    newValue: undefined,
                    type: self.options.name,
                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                });
            }

        },

        /********************************************************
        ----------------------- EVENTS---------------------------
        *********************************************************/


        /*
        *  handler click evenet
        */
        ".multiple-name click": function (el, event) {
            var self = this;
            var index, selected;

            index = $(".multiple-name", this.element).index(el);

            if(!el.hasClass("selected"))
            {

                if (el.hasClass("selected")) {
                    $(".multiple-name", this.element).removeClass("selected");
                    $(".biz-ico", this.element).addClass('multiple-ico-radio-uncheck').removeClass('multiple-ico-radio-check');
                    $('.biz-ico', el).addClass('multiple-ico-radio-check').removeClass('multiple-ico-radio-uncheck');
                    $(".biz-ico", this.element).addClass('bz-studio');
                    $(".biz-ico", this.element).addClass('bz-radio-unselected_16x16_standard').removeClass('bz-radio_16x16_standard');
                    $('.biz-ico', el).addClass('bz-radio_16x16_standard').removeClass('bz-radio-unselected_16x16_standard');
                    selected = false;
                } else {
                    $(".multiple-name", this.element).removeClass("selected");
                    $(".biz-ico", this.element).addClass('multiple-ico-radio-uncheck').removeClass('multiple-ico-radio-check');
                    $(".biz-ico", this.element).addClass('bz-studio');
                    $(".biz-ico", this.element).addClass('bz-radio-unselected_16x16_standard').removeClass('bz-radio_16x16_standard');
                    el.addClass("selected");
                    $('.biz-ico', el).addClass('multiple-ico-radio-check').removeClass('multiple-ico-radio-uncheck');
                    $('.biz-ico', el).addClass('bz-radio_16x16_standard').removeClass('bz-radio-unselected_16x16_standard');
                    selected = true;
                }

                this.element.find(".multiple-category-group").empty();

                var exclusive = this.model.isExclusive();
                var container = self.element.find(".multiple-category-group");

                if (selected) {
                    var property = self.model.getPropertyByIndex(index);
                    if (property) { this.renderSubproperty(container, property, exclusive); }

                } else {

                    self.renderProperties(container, exclusive);
                }

                if (el.hasClass("multiple-none-option")) {
                    self.updatePropertyToNone();
                }

            }

        }
    }
);