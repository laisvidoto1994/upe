/*
@title: Base form
@authors: Rhony Pedraza
@date: 02-aug-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.formbase", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, elCaptionObject, form, allowNewForm, allowNone, elNewForm, elNone, elIconStyle, self = this;

            allowNewForm = data.allowNewForm === undefined ? true : data.allowNewForm;
            allowNone = data.allowNone === undefined ? true : data.allowNone;

            if (data.value === undefined) {
                data.value = {
                    baref: {
                        ref: ""
                    }
                };
            } else {
                if (data.value === null) {
                    data.value = {
                        baref: {
                            ref: ""
                        }
                    };
                }
            }

            self.inputValue = data.value;

            self.editorParameters = data["editor-parameters"] || { };

            // para pruebas
            //form = self.getDataForms();
            $.when(data.relatedForms)
                .done(function (values) {
                    form = values || [];

                    elIconStyle = data.name.replace(/\./g, "-").toLowerCase();
                    data.icon = elIconStyle;

                    if (data.value.baref.ref != "") {
                        //data.captionForm = data.value.baref.ref;
                        elCaptionObject = self.updateCaption(data.value, form);
                        data.captionForm = elCaptionObject.caption;
                        if (elCaptionObject.version) {
                            data.version = elCaptionObject.version;
                        }
                    }

                    elEditor = $.tmpl(self.getTemplate("frame"), data);
                    var lblRequired = $('label', elEditor);
                    self.addRequired(lblRequired);

                    if (allowNone) {
                        elNone = $.tmpl(self.getTemplate("none"), {});
                        elEditor.find(".form-menu").prepend(elNone);
                    }

                    if (allowNewForm) {
                        elNewForm = $.tmpl(self.getTemplate("newform"), {});
                        elEditor.find(".form-menu").prepend(elNewForm);
                    }

                    if (form.length > 0) {
                        $.each(form, function (_, item) {
                            self.renderParents(elEditor.find(".form-submenu"), item);
                        });
                    }

                    elEditor.appendTo(container);

                    $('.form-button-caption[title]', elEditor).tooltip({
                        tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-rule-editor-tooltip',
                        position: {
                            my: "left top+10",
                            at: "left bottom"

                        }
                    });
                });            
            
        },
        updateCaption: function (value, form) {
            var caption = '', version = "", i, j, exit = false;
            var guid = value.baref.ref;
            for (i = 0; i < form.length; i++) {
                if (guid == form[i].guid) {
                    caption = form[i].displayname;
                    version = form[i].version;
                    break;
                }
                if (form[i].children) {
                    for (j = 0; j < form[i].children.length; j++) {
                        if (guid == form[i].children[j].guid) {
                            caption = form[i].children[j].displayname;
                            version = form[i].children[j].version;
                            exit = true;
                            break;
                        }
                    }
                }
                if (exit) {
                    break;
                }
            }
            return { caption: caption, version: version };
        },
        renderParents: function (container, parent) {
            var self = this;
            var elParent;
            if (self.parentHasChildren(parent)) {
                if (parent.guid == self.inputValue.baref.ref) {
                    elParent = $.tmpl(self.getTemplate("item-parent-children-checked"), parent);
                } else {
                    elParent = $.tmpl(self.getTemplate("item-parent-children-unchecked"), parent);
                }
                elParent.data("info", parent);
                $.each(parent.children, function (_, child) {
                    self.renderChild(elParent.find("ul"), child);
                });
            } else {
                if (parent.guid == self.inputValue.baref.ref) {
                    elParent = $.tmpl(self.getTemplate("item-parent-no-children-checked"), parent);
                } else {
                    elParent = $.tmpl(self.getTemplate("item-parent-no-children-unchecked"), parent);
                }
                elParent.data("info", parent);
            }
            elParent.appendTo(container);
        },
        renderChild: function (container, child) {
            var self = this;
            var elChild;

            child.icon = self.options.icon;

            if (child.guid == self.inputValue.baref.ref) {
                elChild = $.tmpl(self.getTemplate("item-child-checked"), child);
            } else {
                elChild = $.tmpl(self.getTemplate("item-child-unchecked"), child);
            }
            elChild.data("info", child);
            elChild.appendTo(container);
        },
        parentHasChildren: function (parent) {
            var hasChildren = true;
            if (parent.children === undefined) {
                hasChildren = false;
            } else {
                if (parent.children === null) {
                    hasChildren = false;
                } else {
                    if (parent.children.length <= 0) {
                        hasChildren = false;
                    }
                }
            }
            return hasChildren;
        },
        getDataForms: function () {
            return [
                {
                    guid: "GUID-FORM-1",
                    displayname: "Group Form 1",
                    version: "1.0",
                    children: [
                        {
                            guid: "GUID-FORM-1-1",
                            displayname: "Form 1, G1",
                            version: "1.0"
                        },
                        {
                            guid: "GUID-FORM-1-2",
                            displayname: "Form 2, G1",
                            version: "1.5",
                            selected: true
                        }
                    ]
                },
                {
                    guid: "GUID-GUID",
                    displayname: "Group Form A",
                    version: "3.141592",
                    children: null
                },
                {
                    guid: "GUID-FORM-2",
                    displayname: "Group Form 2",
                    version: "1.0",
                    children: [
                        {
                            guid: "GUID-FORM-2-1",
                            displayname: "Form 1, G2",
                            version: "1.0"
                        }
                    ]
                },
                {
                    guid: "GUID-FORM-3",
                    displayname: "Group Form 3",
                    version: "1.0",
                    children: [
                        {
                            guid: "GUID-FORM-3-1",
                            displayname: "Form 1, G3",
                            version: "2.0"
                        },
                        {
                            guid: "GUID-FORM-3-2",
                            displayname: "Form 2, G3",
                            version: "1.0"
                        }
                    ]
                }
            ];
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-frame")),
                this.loadTemplate("newform", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-newform")),
                this.loadTemplate("none", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-none")),
                this.loadTemplate("item-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-unchecked")),
                this.loadTemplate("item-checked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-checked")),
                this.loadTemplate("item-parent-no-children-checked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-parent-no-children-checked")),
                this.loadTemplate("item-parent-no-children-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-parent-no-children-unchecked")),
                this.loadTemplate("item-child-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-child-unchecked")),
                this.loadTemplate("item-child-checked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-child-checked")),
                this.loadTemplate("item-parent-children-checked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-parent-children-checked")),
                this.loadTemplate("item-parent-children-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.form").concat("#form-item-parent-children-unchecked"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        closeMenu: function (el, menu) {
            menu.slideUp(function () {
                $(this).removeClass("form-open");
            });
            el.removeClass("form-open");
        },
        openMenu: function (el, menu) {
            var self = this;
            $(document).bind("mouseup.formbase", function (e) {

                if (e.which == 1) {
                    var dropDownMenu = self.element;

                    if (dropDownMenu.has(e.target).length === 0) {
                        self.closeMenu(el, menu);
                        $(document).unbind("mouseup.formbase");
                    }
                }
            });

            menu.slideDown(function () {
                $(this).addClass("form-open");
            });
            el.addClass("form-open");
        },
        toggleForm: function (el) {
            var list = el.closest(".form-item-expandable").find("ul");
            if (list.is(":visible")) {
                el.addClass("form-image-plus").removeClass("form-image-minus");
                list.hide();
            } else {
                el.addClass("form-image-minus").removeClass("form-image-plus");
                list.show();
            }
        },

        ".form-button-dropdown click": function (el, event) {
            var self = this, menu = $(".form-menu", this.element);
            if (el.hasClass("form-open")) {

                self.closeMenu(el, menu);
            } else {

                self.openMenu(el, menu);
            }
            event.stopPropagation();
        },

        ".form-image-minus click": function (el, event) {
            var self = this;
            self.toggleForm(el);
            event.stopPropagation();
        },
        ".form-image-plus click": function (el, event) {
            var self = this;
            self.toggleForm(el);
            event.stopPropagation();
        }
    }
);