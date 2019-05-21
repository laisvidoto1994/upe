/**
 * Expose interface to access to render controls and their properties
 *
 * @author: Edward Morales
 */


/**
 * Locators
 *
 * bizagi.e2e.getRenderById(id)
 * bizagi.e2e.getRenderByType(type)
 * bizagi.e2e.getRenderByXpath(xpath)
 * bizagi.e2e.getRenderByDisplayName(displayName)
 * bizagi.e2e.getRenderByValue(value)
 * bizagi.e2e.getNotificationPanel()
 * bizagi.e2e.getFormButtonByCaption(caption)
 * bizagi.e2e.getFormButtons()
 */

/**
 * Standar interface for each control
 * -----------------------------------
 * locator.isRequired()
 * locator.getControl()
 * locator.getDisplayNameObj()
 * locator.getDisplayNameText()
 * locator.getValue()
 * locator.getDisplayValueText()
 * locator.getFocus()
 * locator.find(element)
 * locator.getType()
 * locator.setControlValue(value)
 * locator.setControlDisplayValue(value)
 *
 *
 * Interface for Grid
 * -----------------------------------
 * locator.getColumnByXpath(xpath)
 * locator.getColumnByName(name)
 * locator.getRecord(id)
 * locator.getNewRows()
 * locator.getCell(id, xpath)
 * locator.getGridButtonsPanel()
 * locator.getGridPaginationPanel()
 * locator.getGridHeaderPanel()
 *
 *
 * Interface for Upload and ColumnUpload
 * -----------------------------------
 * locator.getFiles()
 * locator.hasFile()
 *
 *
 * Interface for Boolean and ColumnBoolean
 * -----------------------------------
 * locator.checkByName(name)
 * locator.isChecked(name)
 *
 *
 * Interface for Combo and ColumnCombo
 * -----------------------------------
 * locator.getComboArrow()
 * locator.getComboOptions()
 *
 */


/**
 *  Class that allow extend default functionality by kind of control
 */
var renderInterface = (function () {
    var self = this;

    /**
     * Public interface for each render control
     * This method is merged with control and has
     * access to all properties of them
     */
    var controlInterface = (function () {
        return {
            isRequired: function () {
                var self = this;
                return self.properties.required;
            },
            getControl: function () {
                var self = this;
                return self.control;
            },
            getDisplayNameObj: function () {
                var self = this;
                return self.getLabel();
            },
            getDisplayNameText: function () {
                var self = this;
                return self.properties.displayName;
            },
            getValue: function () {
                var self = this;
                return self.value;
            },
            getDisplayValueText: function () {
                var self = this;
                return self.getDisplayValue();
            },
            getFocus: function () {
                var self = this;
                return (self.focus()) ? true : false;
            },
            find: function (elm) {
                var self = this;
                var control = self.getControl();
                return control.find(elm);
            },
            getType: function () {
                var self = this;
                return self.properties.type;
            },
            setControlValue: function (value) {
                var self = this;
                self.setValue(value);
            },
            setControlDisplayValue: function (value) {
                var self = this;
                self.setDisplayValue(value);
            }
        };
    })();

    /**
     * Public interface for grid control
     */
    var gridControlInterface = (function () {
        return {
            getColumnByXpath: function (xpath) {
                var self = this;
                return (typeof xpath === "undefined") ? {} : this.getColumn(xpath);
            },
            getColumnByName: function (name) {
                var self = this;
                var resultColumn = {};
                $.each(self.columns, function (key, column) {
                    if (column.properties.displayName === name) {
                        resultColumn = column;
                    }
                });

                return resultColumn;
            },
            getRecord: function (id) {
                var self = this;
                return $('[data-business-key="' + id + '"]', self.getControl());
            },
            getNewRows: function () {
                var self = this;
                return $('[data-new-row="' + true + '"]', self.getControl());
            },
            getCell: function (id, xpath) {
                var self = this;
                var control = self.getControlCell(id, xpath);

                // Extend control with public interfacecontrol
                control = renderInterface.extendControlInterface(control);
                return control;
            },
            getGridButtonsPanel: function () {
                var self = this;
                return $('[data-bizagi-component="buttons"]', self.getControl());
            },
            getGridPaginationPanel: function () {
                var self = this;
                return $('[data-bizagi-component="pager"]', self.getControl());
            },
            getGridHeaderPanel: function () {
                var self = this;
                return $('[data-bizagi-component="columns"]', self.getControl());
            }
        };
    })();

    var uploadInterface = (function () {
        return {
            getFiles: function () {
                var self = this;
                var listOfFiles = [];
                if (self.files) {
                    $.each(self.files, function (key, value) {
                        listOfFiles.push(value[1]);
                    });
                }
                return listOfFiles;
            },
            hasFile: function (fileName) {
                var self = this;
                var files = self.getFiles();
                var result = false;
                if (files.length > 0) {
                    $.each(files, function (key, value) {
                        if (value.indexOf(fileName) >= 0) {
                            result = true;
                        }
                    });
                }
                return result;
            }
        };
    })();

    var booleanInterface = (function () {
        return {
            checkByName: function (name) {
                var self = this;
                var control = self.getControl();
                var label = $(".ui-bizagi-render-boolean-yesno label", control);
                $.each(label, function (key, value) {
                    if (value && $.trim($(value).text()) == name) {
                        value.click();
                    }
                });
            },
            isChecked: function (name) {
                var self = this;
                var control = self.getControl();
                var label = $("label.ui-radio-state-checked", control);
                var checked = false;

                if (label.length > 0) {
                    $.each(label, function (key, value) {
                        if (value && $.trim($(value).text()) == name) {
                            checked = true;
                        }
                    });
                }
                return checked;
            }
        };
    })();


    var comboInterface = (function () {
        return {
            getComboArrow: function () {
                var self = this;
                return $(".ui-selectmenu-btn", self.getControl());
            },

            getComboOptions: function () {
                var self = this;
                return $(".ui-select-dropdown ul", self.getControl().parent());
            }
        }
    })();


    self._getInterface = function (control) {
        var interfaz;
        switch (control) {
            case "generic":
                interfaz = controlInterface;
                break;
            case "grid":
                interfaz = gridControlInterface;
                break;
            case "upload":
                interfaz = uploadInterface;
                break;
            case "boolean":
                interfaz = booleanInterface;
                break;
            case "combo":
                interfaz = comboInterface;
                break;

        }
        return interfaz;
    };

    self._getExtendedInterfaceByControl = function (control) {
        var type = (typeof control !== "undefined" && control.properties && control.properties.type) ? control.properties.type : "";
        var extendedInterface;
        var objEspecificInterface = [];

        var extendObject = function (control, objToExtend) {
            if (objToExtend.length > 0) {
                $.each(objToExtend, function (keyToExtend, valueToExtend) {
                    if (typeof valueToExtend === "object") {
                        $.each(valueToExtend, function (key, value) {
                            control[key] = value;
                        });
                    }
                });
            }
            return control;
        };

        switch (type) {
            case "grid":
                objEspecificInterface = [self._getInterface("generic"), self._getInterface("grid")];
                extendedInterface = extendObject(control, objEspecificInterface);
                break;
            case "upload":
            case "columnUpload":
                objEspecificInterface = [self._getInterface("generic"), self._getInterface("upload")];
                extendedInterface = extendObject(control, objEspecificInterface);
                break;
            case "boolean":
            case "columnBoolean":
                objEspecificInterface = [self._getInterface("generic"), self._getInterface("boolean")];
                extendedInterface = extendObject(control, objEspecificInterface);
                break;
            case "combo":
            case "columnCombo":
                objEspecificInterface = [self._getInterface("generic"), self._getInterface("combo")];
                extendedInterface = extendObject(control, objEspecificInterface);
                break;
            default:
                objEspecificInterface = [self._getInterface("generic")];
                extendedInterface = extendObject(control, objEspecificInterface);
                break;
        }

        return extendedInterface;
    };

    self._extendControlInterface = function (control) {
        var result;
        if (!control) {
            return;
        }

        if (control.length && control.length > 1) {
            result = [];
            $.each(control, function (key, value) {
                result.push(self._getExtendedInterfaceByControl(value));
            });
        } else if (control.length && control.length == 1) {
            result = self._getExtendedInterfaceByControl(control[0]);
        } else {
            result = self._getExtendedInterfaceByControl(control);
        }

        // Set auto focus
        (typeof result.focus === "function") ? result.focus() : "";

        return result;
    };

    // Public methods
    return {
        getInterface: self._getInterface,
        extendControlInterface: self._extendControlInterface
    };
})();


/**
 * Public access interface that provide locators and new functionalities
 */
bizagi.e2e = (function () {
    var self = this;
    var dialogIsOpen = false;

    var setScopeDefinition = function () {
        if (!dialogIsOpen) {
            self.form = bizagi.rendering.facade.form;
            self.formReady = bizagi.rendering.facade.executionDeferred.promise();

            if (!self.form) {
                $.when(self.formReady).done(function (deferredForm) {
                    self.form = deferredForm;
                }).fail(function (m) {
                    console.log("Error: " + m.toString());
                });
            }
        }
    };

    bizagi.rendering.dialog.form.extend("bizagi.rendering.dialog.form", {}, {
        renderDialogBox: function (dialogBox, params) {
            $.when(this._super(dialogBox, params)).done(function (form) {
                dialogIsOpen = true;
                self.form = form;
            });
        },
        closeDialogBox: function () {
            dialogIsOpen = false;
            this._super();
        }
    });

    bizagi.rendering.searchForm.extend("bizagi.rendering.searchForm", {}, {
        configureHandlers: function (container) {
            $.when(this._super(container)).done(function (form) {
                dialogIsOpen = true;
                self.form = form.getFormContainer();
            });
        },
        closeDialogBox: function () {
            dialogIsOpen = false;
            this._super();
        }
    });

    bizagi.rendering.dialog.search.extend("bizagi.rendering.dialog.search", {}, {
        closeDialogBox: function () {
            dialogIsOpen = false;
            this._super();
        }
    });


    /**
     * Get all controls within form
     * @returns {{rendersById: (*|bizagi.rendering.form.rendersById), rendersByXpath: (*|bizagi.rendering.form.rendersByXpath), rendersByType: (*|bizagi.rendering.form.rendersByType)}}
     * @private
     */
    self._getAllrenders = function () {
        var result = {
            rendersById: self.form.rendersById,
            rendersByXpath: self.form.rendersByXpath,
            rendersByType: self.form.rendersByType
        };

        return result;
    };

    self._findRenderByProperty = function (property, propertyvalue) {
        var result = [];
        var renders = self._getAllrenders() || {};

        if (property) {
            $.each(renders.rendersById, function (controlId, controlClass) {
                if (controlClass.properties.hasOwnProperty(property)) {
                    if (controlClass.properties[property] == propertyvalue) {
                        result.push(controlClass);
                    }
                }
            });
        }
        return result;
    };

    /**
     * Find controls by id
     * @param id
     * @returns {*}
     */
    self.getRenderById = function (id) {
        setScopeDefinition();
        id = id || "";
        return renderInterface.extendControlInterface(self.form.getRenderById(id));
    };

    /**
     * Find controls by type
     * @param type
     * @returns {*}
     */
    self.getRenderByType = function (type) {
        setScopeDefinition();
        type = type || "";
        return renderInterface.extendControlInterface(self.form.getRenderByType(type));
    };

    /**
     * Find controls by Xpath
     * @param xpath
     * @returns {*}
     */
    self.getRenderByXpath = function (xpath) {
        setScopeDefinition();
        xpath = xpath || "";
        return renderInterface.extendControlInterface(self.form.getRender(xpath));
    };


    self.getRenderByDisplayName = function (displayName) {
        setScopeDefinition();
        return renderInterface.extendControlInterface(self._findRenderByProperty("displayName", displayName));
    };

    self.getRenderByValue = function (value) {
        setScopeDefinition();
        return renderInterface.extendControlInterface(self._findRenderByProperty("value", value));
    };

    self.getNotificationPanel = function () {
        setScopeDefinition();
        return (function () {
            var getControl = function () {
                return $(".ui-bizagi-notifications-container-bottom .ui-bizagi-notifications-content");
            };

            var getMessages = function () {
                var response = [];
                var messagesHtml = $(".ui-bizagi-notification-item", getControl());

                if (messagesHtml.length > 0) {
                    $.each(messagesHtml, function (key, value) {
                        response.push($.trim($(value).find("label").text()));
                    });
                }
                return response;
            };
            var hasMessage = function (message) {
                var messages = getMessages();
                var result = false;
                if (message !== "" && messages.length > 0) {
                    $.each(messages, function (key, value) {
                        if (value.indexOf(message) >= 0) {
                            result = true;
                        }
                    });
                }
                return result;
            };

            return {
                getMessages: getMessages,
                hasMessage: hasMessage
            };
        })();
    };

    self.getFormButtonByCaption = function (caption) {
        setScopeDefinition();
        var buttons = self.form.getButtons();
        var render = $("<button>");

        // Find button by display name
        $.each(buttons, function (key, value) {
            if (value.value === caption) {
                render = value;
            }
        });

        return render;
    };

    self.getFormButtons = function () {
        setScopeDefinition();
        return self.form.getButtons();
    }

    /**
     * Check if render is on the DOM
     * @returns {boolean}
     */
    self.ready = function () {
        return (bizagi.rendering.facade.executionDeferred.state() === "resolved") ? true : false;
    };

    return {
        getRenderById: self.getRenderById,
        getRenderByType: self.getRenderByType,
        getRenderByXpath: self.getRenderByXpath,
        getRenderByDisplayName: self.getRenderByDisplayName,
        getRenderByValue: self.getRenderByValue,
        getNotificationPanel: self.getNotificationPanel(),
        getFormButtonByCaption: self.getFormButtonByCaption,
        getFormButtons: self.getFormButtons,
        ready: self.ready
    };
})();