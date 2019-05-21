
/*
*   Name: BizAgi FormModeler Editor Form validations Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for formvalidationscommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.formValidationsCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this,
            defer = new $.Deferred(),
            args = self.arguments;

        args.result = {};
        args.refresh = args.canRefresh;
        args.canValidate = true;

        var promises = [];

        if ($.isArray(args.validations) && args.validations.length > 0) {
            for (var i = 0, l = args.validations.length; i < l; i += 1) {
                if ($.isFunction(self["validate" + args.validations[i]])) {
                    promises.push(self["validate" + args.validations[i]]());
                }
            }
        }

        $.when.apply($, promises)
            .done(function () {
                defer.resolve(true);
            });

        return defer.promise();
    },

    /*
    *  Validates required properties
    */
    validateRequiredProperties: function () {
        var self = this,
            args = self.arguments;

        if (!self.model.validRequiredProperties()) { $.extend(args.result, { requiredProperties: true }); }
        return true;
    },

    /*
    *  Validates required properties
    */
    validateRequiredDependentProperties: function () {
        var self = this,
            args = self.arguments;

        if (!self.model.validRequiredDependentProperties()) { $.extend(args.result, { requiredDependentProperties: true }); }
        return true;
    },

    /*
    *  Validates controls with the same xpath
    */
    validateSameXpath: function () {
        var self = this;
        var hash = {}, elementsToValidate = {};
        var args = self.arguments;

        self.model.getMapXpath(self.model.form, hash);
        $.each(hash, function (index, element) {
            if (element.elements.length > 1 && element.editables > 1) {
                elementsToValidate[index] = element;
            }
        });

        if (!$.isEmptyObject(elementsToValidate)) {
            for (var key in elementsToValidate) {
                var xpath = elementsToValidate[key];
                $.each(xpath.elements, function (index, element) {
                    element = self.model.getElement(element.guid);
                    if (element && element.validSameXpath) { element.validSameXpath(key); }
                });
            }
            $.extend(args.result, { sameXpath: true });
        }
        return true;
    },

    /*
    *  Validates elements in containers
    */
    validateElementsInContainers: function () {
        var self = this,
            args = self.arguments;

        if (!self.model.validElementsInContainer()) { $.extend(args.result, { elementInContainers: true }); }
        return true;
    },

    /*
    * Validates attributes of parametric entity, aren't editables
    */
    validateAttributesAdministrables: function () {
        var self = this,
            args = self.arguments;

        var form = self.model.getForm();
        var isAdministrable = form.getProperty("isadministrable");
        var isParametricEntity = (form.triggerGlobalHandler("getContextEntityType") == "parameter");

        if (isParametricEntity && isAdministrable)
            return true;

        if (!self.model.validAttributesAdministrables()) { $.extend(args.result, { attributesAdministrables: true }); }
        return true;
    },

    /*
    * Validates properties of layoutplaceholder control
    */
    validateLayoutPlaceholder: function () {
        var self = this,
            args = self.arguments,
            template = self.model.getForm(),
            layout = template.getLayout(),
            repeaters = layout.repeaters;


        var exclude = [];
        for (var key in repeaters) {
            var repeater = repeaters[key];
            for (id in repeater.elements) {
                exclude.push(id);
            }
        }

        if (!self.model.validLayoutPlaceholder(exclude)) {
            $.extend(args.result, { layoutPlaceholder: true });
        }

        return true;
    },

    validateAttributesNoEditables: function () {
        var self = this,
            defer = $.Deferred(),
            args = self.arguments;

        $.when(self.model.validAttributesNoEditables())
            .then(function (data) {
                if (!data) {
                    $.extend(args.result, { attributesNoEditables: true })
                }

                defer.resolve(true);
            });
        
        return defer.promise();
    }
})
    