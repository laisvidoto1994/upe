/*
@title: Editor (general) stakeholders
@authors: Alexander Mejia
@date: 10-jun-2015
*/
bizagi.editor.component.editor('bizagi.editor.component.editor.stakeholders', {
	
    // Constructor
    init: function (canvas, model, controller) {
        this._super(canvas, model, controller);
    },

    loadTemplates: function () {
        var deferred = $.Deferred();
        $.when(
            this.loadTemplate("stakeholdersFrame", bizagi.getTemplate("bizagi.editor.component.editor.stakeholders").concat("#stakeholders-stakeholdersframe"))
        ).done(function () {
            deferred.resolve();
        });
        return deferred.promise();
    },

    /*
    * Renders the stakeholders editor
    */
    renderEditor: function (container, data) {
        var self = this,
            editorParameters = data["editor-parameters"] || {},
            stakeholdersPromise = editorParameters.stakeholders;
	            
        $.when(stakeholdersPromise)
            .done(function (stakeholders) {
                self.value = (data.value) ? data.value : [];
                data.hasValue = self.value.length > 0;
                self.container = container;

                self.updateProperty();

                data.stakeholdersSelected = self.getStakeholdersSelected(stakeholders);
                data.stakeholders = stakeholders;
                var $elEditor = $.tmpl(self.getTemplate("stakeholdersFrame"), data);
                $elEditor.appendTo(container);
            });       
                   
    },

    /*
    * Returns true if the stakeholder selected isn't defined yet
    */
    isNewValue: function (guid) {
        var self = this,
            result = true;
            l = self.value.length;

        if (l == 0) {
            return result;
        }

        for (var i = 0; i < l; i++){
            var item = self.value[i];
            if (item.baref.ref == guid) {
                result = false;
                break;
            }
        }

        return result;
    },

    /*
    * Returns the stakeholders selected
    */
    getStakeholdersSelected: function (stakeholders) {
        var self = this,
             l = self.value.length,
            result = [];
        
        if (l == 0) {
            return result;
        }

        for (var i = 0; i < l; i++) {
            var guid = bizagi.editor.utilities.resolveComplexReference(self.value[i]);
            for (j = 0, k = stakeholders.length; j < k; j++){
                var stakeholder = stakeholders[j];
                if (stakeholder.guid == guid){
                    result.push(stakeholder);
                }
            }
        }

        return result;
    },

    /*
    * Refresh view
    */
    refresh: function ($el) {
        var self = this,        
            $containerValues = self.element.find('#stakeholder-values');

        self.hideValues($el, $containerValues);

        self.container.empty();

        self.renderEditor(self.container, self.options)

    },

    /*
    * Update the stakeholders property with the current value
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
    * Shows stakeholders availables
    */
    showValues: function ($el, $container) {
        var self = this;
        
        $(document).bind("mouseup.stakeholders", function (e) {

            if (e.which == 1) {
                var dropDownMenu = self.element;

                if (dropDownMenu.has(e.target).length === 0) {
                    self.hideValues($el, $container);
                    $(document).unbind("mouseup.stakeholders");
                }
            }
        });

        $container.slideDown(function () {
            $(this).addClass("stakeholders-values-open");
        });

        $el.addClass("stakeholders-values-open");

    },

    /*
    * Hildes the list of stakeholders
    */
    hideValues: function ($el, $container) {
        var self = this;

        $container.slideUp(function () {
            $(this).removeClass("stakeholders-values-open");
        });

        $el.removeClass("stakeholders-values-open");
    },

    //----------------------------  Events handlers  -----------------------------
    '.stakeholder-select click': function (el, ev) {
        var self = this;
        
        ev.stopPropagation();

        var $containerValues = self.element.find('#stakeholder-values');

        el.hasClass('stakeholders-values-open')   ?
            self.hideValues(el, $containerValues) :
            self.showValues(el, $containerValues);
        
    },

    '.stakeholder-item.stakeholder-value click': function($el, ev) {
        var self = this,
            guid = $el.data('guid');

        if (self.isNewValue(guid)) {
            self.value.push(bizagi.editor.utilities.buildComplexReference($el.data('guid')));
            self.options.value = self.value;

            self.updateProperty();
        };

        self.refresh($el);
    },

    '.item-image-delete-stakeholder click': function ($el) {
        var self = this,
            index = $el.data('id');
                            
        self.value.splice(index, 1);
        self.updateProperty();
        self.refresh($el);
    }

});