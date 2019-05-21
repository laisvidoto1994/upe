/*
@title: Editor de tags
@authors: Cristian Olaya
@date: 18-ago-15
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.tags", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("tagsFrame", bizagi.getTemplate("bizagi.editor.component.editor.tags").concat("#tags-tagsframe"))
            ).done(function () {
                    deferred.resolve();
                });
            return deferred.promise();
        },

        renderEditor: function (container, data) {
            var self = this;

            var tagsParameters = data["editor-parameters"] || {};
            
            $.when(tagsParameters.tags)
                .done(function (tags) {
                    tags = tags || [];

                    if (tags.length > 0) {

                        self.value = (data.value) ? data.value : [];
                        data.hasValue = self.value.length > 0;
                        self.container = container;

                        data.tagsSelected = self.getTagsSelected(tags);
                        data.tags = tags;
                        var $elEditor = $.tmpl(self.getTemplate("tagsFrame"), data);
                        $elEditor.appendTo(container);
                    }
                });            
        },

        /*
         * Returns true if the tag selected isn't defined yet
         */
        isNewValue: function (key) {
            var self = this,
                result = true;
            var l = self.value.length;

            if (l == 0) {
                return result;
            }

            for (var i = 0; i < l; i++){
                var item = self.value[i];
                if ((item.id || item) == key) {
                    result = false;
                    break;
                }
            }

            return result;
        },

        /*
         * Returns the tag selected
         */
        getTagsSelected: function (tags) {
            var self = this,
                l = self.value.length,
                result = [];

            if (l == 0) {
                return result;
            }

            for (var i = 0; i < l; i++) {
                var key = self.value[i].id || self.value[i];
                for (var j = 0, k = tags.length; j < k; j++){
                    var tag = tags[j];
                    if (tag.key == key){
                        result.push(tag);
                    }
                }
            }

            return result;
        },

        /*
         * Update the tags property value
         */
        updateProperty: function () {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                newValue: self.value,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });
        },

        /*
         * Shows tags availables
         */
        showValues: function ($el, $container) {
            var self = this;

            $(document).bind("mouseup.tags", function (e) {

                if (e.which == 1) {
                    var dropDownMenu = self.element;

                    if (dropDownMenu.has(e.target).length === 0) {
                        self.hideValues($el, $container);
                        $(document).unbind("mouseup.tags");
                    }
                }
            });

            $container.slideDown(function () {
                $(this).addClass("tags-values-open");
            });

            $el.addClass("tags-values-open");
        },

        /*
         * Refresh view
         */
        refresh: function ($el) {
            var self = this,
                $containerValues = self.element.find('#tag-values');

            self.hideValues($el, $containerValues);
            self.container.empty();
            self.renderEditor(self.container, self.options);

        },

        /*
         * Hildes the list of tags
         */
        hideValues: function ($el, $container) {
            var self = this;

            $container.slideUp(function () {
                $(this).removeClass("tags-values-open");
            });

            $el.removeClass("tags-values-open");
        },

        /**
         * Events
         * */
        '.tag-select click': function (element, ev) {
            var self = this;
            var $containerValues = self.element.find('#tag-values');

            ev.stopPropagation();

            element.hasClass('tags-values-open')   ?
                self.hideValues(element, $containerValues) :
                self.showValues(element, $containerValues);

        },

        '.tag-item.tag-value click': function($el, ev) {
            var self = this;
            var key = $el.data('key');

            if (self.isNewValue(key)) {
                self.value.push($el.data('key'));
                self.options.value = self.value;
                self.updateProperty();
            }

            self.refresh($el);
        },

        '.item-image-delete-tag click': function ($el) {
            var self = this;
            var index = $el.data('id');

            self.value.splice(index, 1);
            self.updateProperty();
            self.refresh($el);
        }
    }
);