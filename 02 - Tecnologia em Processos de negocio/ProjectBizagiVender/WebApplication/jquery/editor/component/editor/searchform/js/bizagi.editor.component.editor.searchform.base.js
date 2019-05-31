/*
@title: Base searchform base
@authors: Rhony Pedraza
@date: 17-aug-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.searchformbase", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, form, allowNewForm, allowNone, elNewForm, elNone, self = this, i, elCaption;

            allowNewForm = data.allowNewForm === undefined ? true : data.allowNewForm;
            allowNone = data.allowNone === undefined ? true : data.allowNone;
            
            self.values = [];
            
            if(data.value === undefined) {
                data.value = [];
            } else {
                if(data.value === null) {
                    data.value = [];
                } else {
                    // self.values save elements guid
                    self.values = self.retrieveSelectedValues(data.value);
                }
            }
            
            self.inputValue = data.value;
            
            $.when(data.relatedForms)
                .done(function (values) {
                    form = values || [];
                    
                    if (data.name == "searchforms") {
                        data.icon = "searchform-image-form";
                    }

                    var captions = [];
                    if (data.value.length !== 0) {
                        captions = self.retrieveCaptions(self.values, form);
                        elEditor = $.tmpl(self.getTemplate("frame-empty"), data);
                        // render captions
                        for (i = captions.length - 1; i >= 0; i--) {
                            elCaption = $.tmpl(self.getTemplate("caption"), { caption: captions[i], version: self.versions[i], icon: data.name == "searchforms" ? "searchform-image-form" : data.icon });
                            elEditor.find(".searchform-captions").prepend(elCaption);
                        }
                    } else {
                        elEditor = $.tmpl(self.getTemplate("frame"), data);
                    }

                    if (allowNone) {
                        elNone = $.tmpl(self.getTemplate("none"), {});
                        elEditor.find(".searchform-menu").prepend(elNone);
                    }

                    if (allowNewForm) {
                        elNewForm = $.tmpl(self.getTemplate("newform"), {});
                        elEditor.find(".searchform-menu").prepend(elNewForm);
                    }

                    if (form.length > 0) {
                        $.each(form, function (_, item) {
                            self.renderParents(elEditor.find(".searchform-submenu"), item);
                        });
                    }

                    elEditor.appendTo(container);

                });

          
            
            
        },
        retrieveVersion: function(form, guid) {
            var version = null;
            return version;
        },
        retrieveSelectedValues : function(values) {
            var i, array = [];
            for(i=0; i<values.length; i++) {
                array.push(values[i].baref.ref);
            }
            return array;
        },
        retrieveCaptions : function(values, form) {
            var i, j, captions = [], self = this;
            self.versions = [];
            // se itera sobre los formularios externos
            for(i=0; i<form.length; i++) {
                if($.inArray(form[i].guid, values) !== -1) {
                    captions.push(form[i].displayname);
                    self.versions.push(form[i].version);
                }
                if(form[i].hasOwnProperty("children")) {
                    if(form[i].children !== null) {
                        for(j=0; j<form[i].children.length; j++) {
                            if($.inArray(form[i].children[j].guid, values) !== -1) {
                                captions.push(form[i].children[j].displayname);
                                self.versions.push(form[i].children[j].version);
                            }
                        }
                    }
                }
            }
            return captions;
        },
        renderParents: function (container, parent) {
            var self = this;
            var elParent;
            
            if (self.parentHasChildren(parent)) {
                //elParent = $.tmpl(self.getTemplate("item-parent-children"), parent);
                if($.inArray(parent.guid, self.values) !== -1) {
                    elParent = $.tmpl(self.getTemplate("item-parent-children-checked"), parent);
                } else {
                    elParent = $.tmpl(self.getTemplate("item-parent-children-unchecked"), parent);
                }
                elParent.data("info", parent);
                $.each(parent.children, function (_, child) {
                    self.renderChild(elParent.find("ul"), child);
                });
            } else {
                if($.inArray(parent.guid, self.values) !== -1) {
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
            
            if($.inArray(child.guid, self.values) !== -1) {
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
                            version: "1.5"
                        }
                    ]
                },
                {
                    guid : "GUID-GUID",
                    displayname: "Group Form A",
                    version : "3.141592",
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
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-frame")),
                this.loadTemplate("frame-empty", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-frame-empty")),
                this.loadTemplate("caption", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-caption")),
                this.loadTemplate("newform", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-newform")),
                this.loadTemplate("none", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-none")),
                this.loadTemplate("item-parent-no-children-checked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-parent-no-children-checked")),
                this.loadTemplate("item-parent-no-children-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-parent-no-children-unchecked")),
                /*this.loadTemplate("item-parent-children", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-parent-children")),*/
                this.loadTemplate("item-parent-children-checked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-parent-children-checked")),
                this.loadTemplate("item-parent-children-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-parent-children-unchecked")),
                this.loadTemplate("item-child-unchecked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-child-unchecked")),
                this.loadTemplate("item-child-checked", bizagi.getTemplate("bizagi.editor.component.editor.searchform").concat("#searchform-item-child-checked"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        closeMenu: function(el,menu){
            var self = this;
            menu.slideUp(function(){
                $(this).removeClass("searchform-open");
            });
            el.removeClass("searchform-open");
        },
        openMenu:function(el,menu){
            var self = this;
            $(document).bind("mouseup.searchformbase",function (e) {

                if(e.which == 1){
                    var dropDownMenu = self.element;

                    if (dropDownMenu.has(e.target).length === 0) {
                        self.closeMenu(el,menu);
                        $(document).unbind("mouseup.searchformbase");
                    }
                }
            });

            menu.slideDown(function(){
                $(this).addClass("searchform-open");
            });
            el.addClass("searchform-open");
        },
        
        toggleForm: function(el) {
            var list = el.closest(".searchform-item-expandable").find("ul");
            if (list.is(":visible")) {
                el.addClass("searchform-image-plus").removeClass("searchform-image-minus");
                list.hide();
            } else {
                el.addClass("searchform-image-minus").removeClass("searchform-image-plus");
                list.show();
            }
        },

        ".searchform-button-dropdown click": function (el, event) {
            var self = this, menu = $(".searchform-menu", this.element);
            if (el.hasClass("searchform-open")) {
                
                self.closeMenu(el,menu);
            } else {
                
                self.openMenu(el,menu);
            }
            event.stopPropagation();
        },
        
        ".searchform-image-minus click": function(el, event) {
            var self = this;
            self.toggleForm(el);
            event.stopPropagation();
        },
        ".searchform-image-plus click": function(el, event) {
            var self = this;
            self.toggleForm(el);
            event.stopPropagation();
        }
    }
);