bizagi.rendering.collectionnavigator.extend("bizagi.rendering.collectionnavigator", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

        data.properties.displayType = "value";

        // Call base
        self._super(data);
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;

        // Call base
        this._super();

        var control = self.getControl();
        self.navigationControls = control.find(".bz-collectionnavigator-controls");
        self.canvas = self.getCanvas();
        $('[title]', control).tooltip();
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        $.when(self.isRendered())
            .done(function () {
                if (self.hasData()) {
                    self.showRow(self.getFirstRow());
                }
                self.refreshControls();
            });

        var controls = self.navigationControls.find(".bz-navigation-controls");
        controls.on("click", function (ev) {
            var target = ev.target;

            if (!$(target).hasClass("ui-state-disabled")) {
                if ($(target).hasClass("bz-navigation-next") && self.isValidRow()) {
                    $.when(self.saveChanges())
                        .done(function () {
                            self.showRow(self.getNextRow());
                        });
                }
                else if ($(target).hasClass("bz-navigation-previous") && self.isValidRow()) {
                    $.when(self.saveChanges())
                        .done(function () {
                            self.showRow(self.getPreviousRow());
                        });
                }
                else if ($(target).hasClass("bz-navigation-first") && self.isValidRow()) {
                    $.when(self.saveChanges())
                        .done(function () {
                            self.showRow(self.getFirstRow());
                        });
                }
                else if ($(target).hasClass("bz-navigation-last") && self.isValidRow()) {
                    $.when(self.saveChanges())
                        .done(function () {
                            self.showRow(self.getLastRow());
                        });
                }
                else if ($(target).hasClass("bz-navigation-remove")) {
                    if (self.hasData()) {
                        self.removeRow();
                    }
                }
                else if ($(target).hasClass("bz-navigation-add")) {
                    if (self.hasData() && self.isValidRow()) {
                        $.when(self.saveChanges())
                            .done(function () {
                                self.addInlineRow();
                            });
                    } else if (!self.hasData()) {
                        self.addInlineRow();
                    }
                }
                else {
                    return;
                }
            }
        });

        var currentRow = self.navigationControls.find(".bz-navigation-current-row");
        currentRow.on("change", function () {
            if (self.isValidRow()) {
                var value = $(this).val();
                $.when(self.saveChanges())
                    .done(function () {
                        self.updateRow(value);
                    });
            }
        });

        // Add Form
        var add = self.navigationControls.find(".bz-collectionnavigator-addform");
        add.on("click", function () {

            if (self.hasData() && self.isValidRow()) {
                $.when(self.saveChanges())
                    .done(function () {
                        self.addRow();
                    });

            } else if (!self.hasData()) {
                self.addRow();
            }
        });

        // Edit Form
        var edit = self.navigationControls.find(".bz-collectionnavigator-editform");
        edit.on("click", function () {
            if (self.isValidRow()) {
                $.when(self.saveChanges())
                    .done(function () {
                        self.editRow();
                    });
            }
        });

        // Detail Form
        var detail = self.navigationControls.find(".bz-collectionnavigator-detailform");
        detail.on("click", function () {
            if (self.isValidRow()) {
                $.when(self.saveChanges())
                    .done(function () {
                        self.showDetailForm();
                    });
            }

        });

        //Save Form
        var save = self.navigationControls.find(".bz-collectionnavigator-save");
        save.on("click", function () {
            if (self.isValidRow()) {
                var properties = self.properties;
                var refreshForm = !properties.inlineEdit && self.isTherePendingInlineRow();
                $.when(self.saveChanges())
                    .done(function () {
                        self.showRow(self.getRow());
                    });
            }
        });

        //Cancel
        var cancel = self.navigationControls.find(".bz-collectionnavigator-cancel");
        cancel.on("click", function () {
            self.cancelChanges();
        });

        self.configureButtonsForm();
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        self.postRender();
        self.configureHandlers();
    },

    /*
    * Each time an action is executed, is necessary to refresh 
    * the navigation controls
    */
    refreshControls: function () {
        var self = this;

        self.refreshForwardButtons();
        self.refreshBackButtons();
        self.refreshPagination();
        self.refreshTotal();
        self.refreshRemoveAction();
    },
    /*
    * Enabled o disabled a control (next or last)
    */
    refreshForwardButtons: function () {
        var self = this;

        var nextControl = self.getInnerControl("navigation", "next");
        var lastControl = self.getInnerControl("navigation", "last");
        var keys = self.keys.length;

        if (self.hasData() && (self.pointer < keys - 1)) {
            nextControl.removeClass("ui-state-disabled");
            lastControl.removeClass("ui-state-disabled");
        } else {
            nextControl.addClass("ui-state-disabled");
            lastControl.addClass("ui-state-disabled");
        }
    },
    /*
    * Enabled o disabled a control (previous or first)
    */
    refreshBackButtons: function () {
        var self = this;

        var previousControl = self.getInnerControl("navigation", "previous");
        var firstControl = self.getInnerControl("navigation", "first");

        if (self.hasData() && (self.pointer > 0)) {
            previousControl.removeClass("ui-state-disabled");
            firstControl.removeClass("ui-state-disabled");
        } else {
            previousControl.addClass("ui-state-disabled");
            firstControl.addClass("ui-state-disabled");
        }
    },

    /*
    * Enabled o disabled the remove button
    */
    refreshRemoveAction: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            var removeButton = self.getInnerControl("navigation", "remove");
            if (self.hasData() && !self.isTherePendingInlineRow()) {
                removeButton.removeClass("ui-state-disabled");
            } else {
                removeButton.addClass("ui-state-disabled");
            }
        }
    },

    /*
    * Updates the current row
    */
    refreshPagination: function () {
        var self = this;

        var control = self.getInnerControl("navigation", "current");
        var keys = self.keys.length;

        if (keys > 0) {
            control.val(self.pointer + 1);
            control.removeClass("ui-state-disabled");
        }
        else {
            control.val(self.pointer);
            control.addClass("ui-state-disabled");
        }
    },

    /*
    * Updates the total of rows in collection
    */
    refreshTotal: function () {
        var self = this;

        var value = self.getTotalRows();
        var total = self.getInnerControl("navigation", "total");
        total.text(value);
    },

    /*
    * Enabled o disabled the save and cancel actions
    */
    refreshActions: function (eSave, eCancel) {
        var self = this;
        var save = self.navigationControls.find(".bz-collectionnavigator-save");
        var cancel = self.navigationControls.find(".bz-collectionnavigator-cancel");

        eSave ? save.removeClass("ui-state-disabled") : save.addClass("ui-state-disabled");
        eCancel ? cancel.removeClass("ui-state-disabled") : cancel.addClass("ui-state-disabled");
    },

    /*
    * Gets the especific control
    */
    getInnerControl: function (section, action) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var group = null;
        group = $("div[data-navigation-id='" + properties.id + "']");

        if (section) {
            if (action == "next") {
                return group.find(".bz-navigation-next");
            }
            if (action == "last") {
                return group.find(".bz-navigation-last");
            }
            if (action == "previous") {
                return group.find(".bz-navigation-previous");
            }
            if (action == "first") {
                return group.find(".bz-navigation-first");
            }
            if (action == "current") {
                return group.find(".bz-navigation-current-row");
            }
            if (action == "total") {
                return group.find(".bz-navigation-total-rows");
            }
            if (action == "add") {
                return group.find(".bz-navigation-add");
            }
            if (action == "remove") {
                return group.find(".bz-navigation-remove");
            }
            if (action == "save") {
                return group.find(".bz-collectionnavigator-save");
            }
            if (action == "cancel") {
                return group.find(".bz-collectionnavigator-cancel");
            }
        }


        return undefined;
    },
    /*
    * Shows the navigation form, with the data specified in the row[id]
    */
    showRow: function (id, setFocus) {
        var self = this;
        var properties = self.properties;

        if (id) {
            $.when(self.renderForm(self.getParameters({ id: id, requestedForm: "navigationForm", url: self.properties.navigationPage, editable: properties.editable ? properties.inlineEdit : false })))
                .done(function (form) {
                    self.loadForm(form, setFocus);
                    self.refreshControls();
                });
        }
    },
    /*
    * Shows the navigation form, with the data specified in the row[id]
    */
    showDetailForm: function () {
        var self = this;
        var properties = self.properties;

        // Show dialog with new form after that
        var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            showSaveButton: false,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close")
        });

        dialog.render(self.getParameters({ id: self.getRow(), requestedForm: "detailForm", url: properties.editPage, editable: false }));
    },
    /*
    * Shows the navigation form inline, with the data specified in the row[id]
    */
    showInlineRow: function (id, setFocus) {
        var self = this;
        self.startLoading();

        $.when(self.renderForm(self.getParameters({ id: id, requestedForm: "navigationForm", url: self.properties.navigationPage, editable: true })))
            .done(function (data) {
                self.loadForm(data, setFocus);
                self.refreshControls();
            })
            .always(function () {
                self.endLoading();
            });

    },
    /*
    * Updates the navigation form, with the data specified in the row[id]
    */
    updateRow: function (id) {
        var self = this;

        if ($.isNumeric(id) && self.isValidKey(id)) {
            id = parseInt(id);
            self.setPointer(id);
            self.showRow(self.getRow());
            self.refreshControls();
        } else {
            self.refreshPagination();
        }
    },
    /*
    * Returns true if the key is within the range. Otherwise it returns false
    */
    isValidKey: function (key) {
        var self = this;

        if (key <= 0) {
            return false;
        }
        if (key > self.keys.length) {
            return false;
        }

        return true;
    },
    /*
    * Renders the navigation form
    */
    renderForm: function (params) {
        var self = this;
        var defer = new $.Deferred();

        // Load template and data
        $.when(self.dataService.getFormData(params)).pipe(function (data) {

            // Apply contextType
            data.form.contextType = params.contextType;

            //delete buttons
            delete data.form.buttons;

            // Apply editable param
            if (params.editable == false) {
                data.form.properties.editable = false;
            }

            // The transitions don't apply in collection navigator
            self.removeTransitions(data.form);

            // Render dialog template
            self.form = self.renderFactory.getContainer({
                type: "form",
                data: data.form,
                focus: params.focus || false,
                selectedTabs: params.selectedTabs,
                isRefresh: params.isRefresh || false
            });

            self.form.render();

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded", self.getFormContainer());

            // Attach a refresh handler to recreate all the form
            self.form.bind("refresh", function (_, refreshParams) {
                self.showRow(self.getRow());
            });

            self.bindRenderChangeEvent(self.form.children);

            defer.resolve(self.form);
        });

        return defer.promise();
    },

    /*
    * This method binds the render change event of each control 
    * at the current form
    */
    bindRenderChangeEvent: function (children) {
        var self = this;
        children = children || [];

        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            var type = child.getElementType();
            if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                child.bind("renderchange", function (ev, params) {
                    params = params || {}
                    var render = params.render;
                    var isEmpty;

                    if (render && (render.properties.type == "collectionnavigator" || render.properties.type == "grid")) {
                        isEmpty = false;
                    } else {
                        var changes = [];
                        self.form.hasChanged(changes);
                        isEmpty = changes.length === 0 ? true : false;
                    }

                    self.refreshActions(!isEmpty, !isEmpty);
                    self.triggerRenderChange();
                });
            } else if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                self.bindRenderChangeEvent(child.children);
            }

        }
    },

    /*
    * Returns the elements html (canvas), where will be located the navigation form 
    */
    getCanvas: function () {
        var self = this;

        var control = self.getControl();
        return control.find(".bz-collectionnavigator-navigationform");
    },
    /*
    * Return true if the data of navigation form is valid
    */
    isValidRow: function () {
        var self = this;

        if (self.form) {
            return self.form.validationController.performValidations();
        }

        return false;
    },
    /*
    * Saves changes in navigation form
    */
    saveChanges: function () {
        var self = this;
        var data = self.getChanges();
        var arrayCollectionNavigator = [];
        var hasChildren = false;

        if (self.form) {
            var children = self.getChildCollectionNavigator(self.form.children, arrayCollectionNavigator);
            hasChildren = (children.length > 0) ? true : false;
        }


        if (!$.isEmptyObject(data) || hasChildren) {
            if (hasChildren) {
                self.saveChangesChildren(arrayCollectionNavigator);
            }
            data.idPageCache = self.form.getPageCache();
            return self.submitSaveRequest(self.getRow(), data)
                .pipe(function (response) {
                    response = response || {};
                    if (response.type == "success") {
                        // Mark data collected as original values
                        self.form.collectRenderValuesForSubmit();
                        self.removeInlineAddRecord();
                        self.refreshControls();
                        self.refreshActions(false, false);
                        return self.fetchData();

                    } else {
                        if (response.type == "validationMessages") {
                            var form = self.getFormContainer();
                            var message = response.messages.join(" ");
                            form.failHandler({ message: message });
                        }
                        return false;
                    }
                });
        } else {
            self.removeInlineAddRecord();
            self.refreshControls();
            self.refreshActions(false, false);
        }

        return true;
    },
    /*
    * Cancel changes
    */
    cancelChanges: function () {
        var self = this;
        self.refreshActions(false, false);
        if (self.inlineAddRecords.length > 0) {
            self.removeKey();
            self.inlineAddRecords.pop();
            self.submitRollbackRequest();
            self.refreshTotal();
            self.refreshControls();

            if (self.getTotalRows() == 0) {
                self.removeNavigationForm();
                self.drawPreview();
            } else {
                self.showRow(self.getRow());
            }
        } else {
            var data = self.getChanges();
            if (!$.isEmptyObject(data)) {
                self.showRow(self.getRow());
            }
        }

    },
    /*
    * Gets changes of current navigation form
    */
    getChanges: function () {
        var self = this;
        var data = {};

        if (self.form) {
            self.form.collectRenderValues(data);
        }

        return data;
    },
    /*
    *  Adds a row inline to collection
    */
    addInlineRow: function () {
        var self = this;
        var setFocus = true;

        // Send add request
        $.when(self.submitAddRequest())
            .done(function (newid) {
                self.refreshActions(true, true);
                self.inlineAddRecords.push(newid);
                self.addKey(newid);
                self.showInlineRow(self.getLastRow(), setFocus);
                self.refreshTotal();
                self.refreshControls();
            });

    },
    /*
    *  Adds a row to collection
    */
    addRow: function () {
        var self = this;
        var properties = self.properties;

        // Send add request
        $.when(self.submitAddRequest())
            .done(function (newid) {

                // Show dialog with new form after that
                var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    title: properties.addLabel,
                    orientation: properties.orientation || "ltr",
                    onSave: function (data) {
                        if (properties.contextType) {
                            data[self.dataService.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = properties.contextType;
                        }
                        return self.submitSaveRequest(newid, data);
                    }
                });

                dialog.render(self.getParameters({ id: newid, requestedForm: "addForm", url: properties.addPage, editable: true }))
                    .done(function () {
                        // Set loading status
                        self.startLoading();

                        $.when(self.fetchData())
                            .done(function () {
                                self.showRow(self.getLastRow());
                            });


                        self.endLoading();
                    })
                    .fail(function () {
                        self.submitRollbackRequest();
                    });
            });
    },
    /*
    * Edits a row in the collection with Form
    */
    editRow: function () {
        var self = this;
        var properties = self.properties;
        var id = self.getRow();

        // Send edit request
        $.when(self.submitEditRequest(id))
            .done(function () {

                // Show dialog with new form
                var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    title: properties.editLabel,
                    orientation: properties.orientation || "ltr",
                    onSave: function (data) {
                        return self.submitSaveRequest(id, data);
                    }
                });

                dialog.render(self.getParameters({ id: id, requestedForm: "editForm", url: self.properties.editPage, editable: true }))
                        .done(function () {
                            $.when(self.fetchData())
                                .done(function () {
                                    self.showRow(self.getRow());
                                });
                        })
                        .fail(function () {
                            self.submitRollbackRequest();
                        });
            });
    },
    /*
    * removes current row
    */
    removeRow: function () {
        var self = this;
        var id = self.getRow();

        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function () {
                // Do a collection record deletion
                $.when(self.submitDeleteRequest(id))
                    .done(function (data) {
                        data = data || {};
                        if (data.type == "success") {
                            // Set loading status
                            self.startLoading();

                            self.removeKey();
                            self.refreshTotal();
                            self.refreshControls();

                            if (self.getTotalRows() == 0) {
                                self.removeNavigationForm();
                                self.drawPreview();
                            } else {
                                self.showRow(self.getRow());
                            }

                            self.endLoading();
                        }
                    });
            });
    },
    /*
    * Removes of local list the rows added inline
    */
    removeInlineAddRecord: function () {
        var self = this;

        if (self.isTherePendingInlineRow()) {
            self.inlineAddRecords.pop();
        }
    },
    /*
    * Loads form in canvas
    */
    loadForm: function (form, setFocus) {
        var self = this;

        self.removeNavigationForm();
        var buttons = form.container.find(".ui-bizagi-button-container");
        buttons.remove();
        self.addNavigationForm(form.container);

        if (setFocus) {
            self.focusFirstControl(form);
        }
    },
    /*
    * Method to process button actions in the form
    */
    configureButtonsForm: function () {
        var self = this;
        var form = self.getFormContainer();
        var originalProcessButton = form.processButton;

        form.processButton = function (buttonProperties) {
            // Deferred is defined in order to avoid a permanent overlay after submitting with custom buttons
            var deferred = $.Deferred();
            var valid = true;
            if (!self.form) {
                originalProcessButton.apply(form, [buttonProperties]).done(function () {
                    deferred.resolve();
                });
            } else if (buttonProperties.action == "save") {
                $.when(self.saveChanges())
                        .done(function () {
                            originalProcessButton.apply(form, [buttonProperties]);
                            deferred.resolve();
                        }).fail(function (error) {
                            self.processFailMessage(error);
                            deferred.resolve();
                        });
            } else if (buttonProperties.action == "next") {
                // Process to save form
                if (buttonProperties.validate && (valid = self.isValidRow())) {
                    $.when(self.saveChanges()).done(function () {
                        originalProcessButton.apply(form, [buttonProperties]);
                        deferred.resolve();
                    }).fail(function (error) {
                        self.processFailMessage(error);
                        deferred.resolve();
                    });
                } else {
                    if (valid) {
                        $.when(self.saveChanges()).done(function () {
                            originalProcessButton.apply(form, [buttonProperties]);
                            deferred.resolve();
                        }).fail(function (error) {
                            self.processFailMessage(error);
                            deferred.resolve();
                        });
                    } else {
                        deferred.resolve();
                    }
                }
            }
            return deferred.promise();
        };

    },
    /*
    * Removes navigation form
    */
    removeNavigationForm: function () {
        var self = this;

        self.canvas.children().remove();

    },
    /*
    * Adds navigation form
    */
    addNavigationForm: function (content) {
        var self = this;

        self.canvas.append(content);
    },
    /*
    *   Method to fetch data from the server and then update the data
    */
    fetchData: function () {
        var self = this;
        var defer = new $.Deferred();

        // Start loading to avoid multiple calls to the server
        self.startLoading();
        $.when(self.getRemoteData())
            .done(function (data) {
                self.endLoading();
                if (self.disposed) return;
                if (data) {
                    self.refresh(data);
                    defer.resolve();
                } else {
                    defer.reject();
                }
            });

        return defer.promise();
    },
    /*
    * Verify if data is different the filter
    */
    refresh: function (data) {
        var self = this;
        var keys = self.getKeys(data.rows);
        self.keys = keys;

        if (keys.indexOf(self.getRow()) == -1) {
            self.totalRows = keys.length;
            self.pointer = (self.pointer > 0) ? self.pointer - 1 : self.pointer;
            if (self.totalRows == 0) {
                self.removeNavigationForm();
                self.drawPreview();
                self.refreshControls();
            }
        }
    },
    /*
    * Sets the focus to the first control
    */
    focusFirstControl: function (form, time) {
        // Configures effect
        var effect = function () {
            var defaultControl = $("input:visible, select:visible, option:visible, textarea:visible", form.container).not(".ui-bizagi-render-date,.ui-bizagi-render-search");
            if (defaultControl.length > 0) {
                // Focus control
                var innerControl = defaultControl[0];
                try {
                    innerControl.focus();
                } catch (e) {
                }
            }
        };

        // Run effect
        if (time > 0) {
            setTimeout(effect, time);

        } else {
            effect();
        }
    },
    /*
    * Return array with children of type collectionnavigator
    */
    getChildCollectionNavigator: function (children, arrayCollectionNavigator) {
        var self = this;
        children = children || [];
        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            var type = child.getElementType();
            if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
                if (child.properties.type == "collectionnavigator" || child.properties.type == "grid") {
                    arrayCollectionNavigator.push(child);
                }
            }
            else if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
                self.getChildCollectionNavigator(child.children, arrayCollectionNavigator);
            }
        }
        return arrayCollectionNavigator
    },
    /*
    *save changes for children of type collectionnavigator
    */
    saveChangesChildren: function (arrayCollectionNavigator) {
        for (var i = 0, l = arrayCollectionNavigator.length; i < l; i++) {
            if (arrayCollectionNavigator[i].properties.type == "collectionnavigator") {
                arrayCollectionNavigator[i].saveChanges();
            }
        }
    },

    drawControls: function (html) {
        var self = this;
        var properties = self.properties;

        html = $(html);
        var controls = self.collectionControls = $(".bz-collectionnavigator-controls", html);

        self.drawForms(controls);
        self.drawControl(controls);
        if (properties.editable)
            self.drawActions(controls);

        return html[0].outerHTML;
    },
    /*  render several actions in the navigation palete
    *  ex. save, cancel 
    */
    drawActions: function (controls) {
        var self = this;
        var actions = $(".actions-group", controls);

        if (self.orientation == "rtl") {
            var template = self.renderFactory.getTemplate("collectionnavigator-actions-rtl");
            var html = $.tmpl(template);
            html.appendTo(actions);
        } else {
            var template = self.renderFactory.getTemplate("collectionnavigator-actions");
            var html = $.tmpl(template);
            html.appendTo(actions);
        }

        return controls;
    },

    /*
    * Render navigation controls (next, previous, last, first. etc )
    */
    drawControl: function (controls) {
        var self = this;
        var properties = self.properties;
        var editable = properties.editable;
        var control = $(".control-group", controls);

        if (self.orientation == "rtl") {
            var template = self.renderFactory.getTemplate("collectionnavigator-control-rtl");
            var html = $.tmpl(template, {
                inlineAdd: editable && properties.inlineAdd,
                allowDelete: editable && properties.allowDelete,
                total: self.totalRows
            });

            html.appendTo(control);
        } else {
            var template = self.renderFactory.getTemplate("collectionnavigator-control");
            var html = $.tmpl(template, {
                inlineAdd: editable && properties.inlineAdd,
                allowDelete: editable && properties.allowDelete,
                total: self.totalRows
            });

            html.appendTo(control);
        }

        return controls;
    },

    /*
    * Draw forms options (add form, edit form, navigation form)
    */
    drawForms: function (controls) {
        var self = this;
        var properties = self.properties;
        var withAddForm = properties.withAddForm, withEditForm = properties.withEditForm, allowDetail = properties.allowDetail;
        var template = null, html = null;
        var forms = $(".bz-navigation-group", controls);

        if (self.properties.orientation == "rtl") {

            if (properties.editable && (withAddForm || withEditForm || allowDetail)) {

                forms.addClass("group-visible");

                if (allowDetail) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-document bz-collectionnavigator-detailform",
                        title: bizagi.localization.getResource("render-collection-navigator-details-form")
                    });
                    html.appendTo(forms);
                }

                if (withEditForm) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-pencil bz-collectionnavigator-editform",
                        title: bizagi.localization.getResource("render-collection-navigator-edit-form")
                    });
                    html.appendTo(forms);
                }

                if (withAddForm) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-plus bz-collectionnavigator-addform",
                        title: bizagi.localization.getResource("render-collection-navigator-add-form")
                    });
                    html.appendTo(forms);
                }


            } else {
                forms.addClass("group-no-visible");
            }

        } else {
            if (properties.editable && (withAddForm || withEditForm || allowDetail)) {

                forms.addClass("group-visible");

                if (withAddForm) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-plus bz-collectionnavigator-addform",
                        title: bizagi.localization.getResource("render-collection-navigator-add-form")
                    });
                    html.appendTo(forms);
                }

                if (withEditForm) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-pencil bz-collectionnavigator-editform",
                        title: bizagi.localization.getResource("render-collection-navigator-edit-form")
                    });
                    html.appendTo(forms);
                }

                if (allowDetail) {
                    template = self.renderFactory.getTemplate("collectionnavigator-form-button");
                    html = $.tmpl(template, {
                        buttonClass: "ui-icon ui-icon-document bz-collectionnavigator-detailform",
                        title: bizagi.localization.getResource("render-collection-navigator-details-form")
                    });
                    html.appendTo(forms);
                }

            } else {
                forms.addClass("group-no-visible");
            }
        }

        return controls;
    },

    /*
    * This method removes the transitions
    */
    removeTransitions: function (data) {
        data = data || {};

        if (data.transitions) {
            delete data.transitions;
        }
    }
});