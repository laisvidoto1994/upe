/*
*   Name: BizAgi Database Plugin
*   Author: oscaro
*   Comments:
*   -   This script creates a plugin to handler oll db functionalities
*   -   Pre-requisite pouchDB
*/

bizagi.workportal.services.db.extend("bizagi.workportal.services.db", {}, {

    /**
     * This method return the form for a new case to offline status
     * @param {} idWFClass 
     * @returns {} Returns a promise
     */
    getFormData: function(idWFClass) {
        var self = this;
        var def = new $.Deferred();

        self.dbForms.get(idWFClass + "-" + idWFClass + "-" + self.globalId, function(err, doc) {
            if (!err) {
                if (typeof (doc.form) !== "undefined") {
                    def.resolve({ form: doc.form, type: "form" });
                } else {
                    var responseText = '{ "message": "'
                        + bizagi.localization.getResource("workportal-offline-error-nonexisting-form-message")
                        + '", "errorType": "'
                        + bizagi.localization.getResource("workportal-offline-error-nonexisting-form") + '" }';
                    def.reject(responseText);
                }
            } else {
                def.reject(err);
            }
        });

        return def.promise();
    },

    /**
     * This method merge the form and the data to result form
     * @param {} doc 
     * @param {} form 
     * @returns {} 
     */
    mergeForm: function(doc, form) {

        var self = this;
        var def = new $.Deferred();

        $.when(form).done(function(form) {
            if (!doc.data) {
                def.resolve(form);
            } else {
                // If it case is in outbox or closed, hide buttons in the form
                if (!doc.isOpen) {
                    form.form.buttons = [];
                }

                for (prop in doc.data) {
                    fillForm(form.form.elements, {
                        key: prop,
                        value: doc.data[prop]
                    });
                }

                function fillForm(element, data) {
                    if (element.length && element.length > 0) {
                        for (var i = 0, len = element.length; i < len; i++) {
                            fillForm(element[i], data);
                        }
                    } else {
                        if (element.container) {
                            fillForm(element.container.elements, data);
                        } else {
                            // If it case is in outbox or closed, make all renders in the form not editable
                            if (!doc.isOpen) {
                                element.render.properties.editable = false;
                            }
                            if (element.render.properties.xpath == data.key) {
                                if (element.render.properties.type === "grid") {
                                    self.setRenderGridValues(element.render);
                                }
                                self.setRenderValues(element.render.properties, data.value);
                            }

                        }
                    }
                }

                def.resolve(form);
            }
        }).fail(function(cause) {
            if (!cause.responseText)
                cause.responseText = '{ "message": "'
                    + bizagi.localization.getResource("workportal-offline-error-nonexisting-form-message")
                    + '", "errorType": "'
                    + bizagi.localization.getResource("workportal-offline-error-nonexisting-form") + '" }';
            def.reject(cause);
        });

        return def.promise();
    },

    /**
     * Set render Grid values
     * @param {} render 
     * @returns {} 
     */
    setRenderGridValues: function(render) {
        render.properties.data.columns = [];
        for (var i = 0, length = render.elements.length; i < length; i++) {
            render.properties.data.columns.push(render.elements[i].render.properties.xpath);
        }
    },

   /**
    * This function sets the type of each xpath
    * @param {} doc 
    * @param {} form 
    * @returns {} 
    */
    setDataType: function(doc, form) {

    },
  
    /**
     *  This method return the categories like the services if exists in the database
     * @param {} params 
     * @param {} data 
     * @returns {} Returns a promise
     */
    setRenderValues: function(params, data) {
        var type = params.type;

        if (!type) type = "label";

        var typeGroupBasic = ["text", "label", "number", "money", "date", "boolean", "geolocation", "hidden", "upload"];
        var typeGroupCombo = ["combo", "cascadingCombo", "radio", "list"];

        if (typeGroupBasic.indexOf(type) !== -1) {
            params.value = data.value;
            return;
        }

        if (typeGroupCombo.indexOf(type) !== -1) {
            for (var i = 0, len = params.data.length; i < len; i++) {
                if (params.data[i].id == data.value) {
                    params.value = [
                        {
                            id: data.value,
                            value: params.data[i].value
                        }
                    ];
                }
            }
            return;
        }       

        if (type === "search") {
            for (var j = 0, lengthData = params.data.length; j < lengthData; j++) {
                if (params.data[j].id == data.value.id) {
                    params.value = data.value;
                }
            }
            return;
        }

        if (type === "image") {
            params.value = data;
            return;
        }

        if (type === "grid") {
            params.data.records = data.value.length;
            params.data.total = 1;
            params.data.page = 1;

            var lengthColumns = params.data.columns.length;

            var tmpEditAndVisible = [];
            for (var row = 0, lengthRows = data.value.length; row < lengthRows; row++) {
                var tmpElement = [];

                // Add random value
                var idRow = bizagi.util.randomNumber();
                tmpElement[tmpElement.length] = idRow;

                var tempRow = [];
                for (var col = 0; col < lengthColumns; col++) {
                    var index = typeof data.value[row][col] !== "undefined" 
		    	? params.data.columns.indexOf(data.value[row][col].xpath) : -1;
                    if (index != -1) {
                        tempRow[index] = data.value[row][col];
                    }

                    tempRow[col] = (typeof (tempRow[col]) === "undefined") ? {} : tempRow[col];
                    tmpElement[tmpElement.length] = "true";
                }

                params.data.rows.push($.merge([idRow], tempRow));
                tmpEditAndVisible[tmpEditAndVisible.length] = tmpElement;
            }

            params.data.editable = tmpEditAndVisible;
            params.data.visible = tmpEditAndVisible;

            return;
        }

        // No type supported
        try {
            params.value = data.value;
        } catch (e) {
        }

        bizagi.log(type + " not supported in render factory", data, "error");
        return null;
    },

    /**
     * This method simulate a summary response
     * @param {} params 
     * @returns {} Returns a promise
     */
    getSummary: function(params) {
        var self = this;
        var def = new $.Deferred();
        self.dbCases.get(params.idCase, function(err, doc) {
            if (!err)
                def.resolve($.extend(doc, {
                    processPath: "/",
                    currentState: doc.workItems,
                    countAssigness: 0,
                    countEvents: 0,
                    isOpen: doc.isOpen.toString(),
                    countSubProcesses: 0
                }));
            else
                def.reject(err);
        });

        return def.promise();
    },

    /*
    *   This method save the form info in the DB
    *   Returns a promise
    */
    saveFormInfo: function(params, data) {
        var self = this;
        var def = new $.Deferred();

        self.dbCases.get(params.idCase, function(err, doc) {
            if (!err) {
                self.mergeDataDocument(
                    data,
                    doc,
                    self.getFormData(doc.idWfClass.toString())).done(function(resp) {
                    if (data.h_action == "next") {
                        doc.isOpen = false;
                    }

                    doc.data = doc.data || {};

                    for (var i in resp) {
                        var assigned = false;
                        for (var j in doc.data) {
                            if (i == j) {
                                if (bizagi.util.isEmpty(resp[i]) || bizagi.util.isEmpty(resp[i].value)) {
                                    delete doc.data[j];
                                    assigned = true;
                                } else {
                                    doc.data[j] = resp[i];
                                    assigned = true;
                                }
                            }
                        }

                        if (!assigned) {
                            doc.data[i] = resp[i];
                        }
                    }

                    self.dbCases.put(doc, function(error, response) {
                        if (!error)
                            def.resolve(response);
                        else
                            def.reject(error);
                    });
                });

            } else {
                def.reject(err);
            }
        });

        return def.promise();
    },

    mergeDataDocument: function(data, doc, form) {
        var defer = new $.Deferred();
        var response = {};
        $.when(form).done(function(resp) {

            for (prop in data) {
                if (prop != "h_action") {
                    response[prop] = {};
                    response[prop].value = data[prop];
                    fillForm(resp.form.elements, {
                        key: prop,
                        value: data[prop]
                    });
                }
            }

            function fillForm(element, datafill) {
                if (element.length && element.length > 0) {
                    for (var i = 0, len = element.length; i < len; i++) {
                        fillForm(element[i], datafill);
                    }
                } else {
                    if (element.container) {
                        fillForm(element.container.elements, datafill);
                    } else {
                        if (element.render.properties.xpath == datafill.key) {
                            response[datafill.key].DataType = element.render.properties.dataType || "";
                            response[datafill.key].type = element.render.properties.type || "";

                            // Remove empty object of the Collection
                            if (!bizagi.util.isEmpty(response[datafill.key])) {
                                var lenghtRows = response[datafill.key].value.length;
                                for (var row = 0 ; row < lenghtRows; row++) {
                                    if (!bizagi.util.isEmpty(response[datafill.key].value[row])) {
                                        var tempDataColumn = [];
                                        for (var col = 0, lenghtCols = response[datafill.key].value[row].length; col <
                                            lenghtCols; col++) {
                                            if (!bizagi.util.isEmpty(response[datafill.key].value[row][col])) {
                                                tempDataColumn.push(response[datafill.key].value[row][col]);
                                            }
                                        }

                                        response[datafill.key].value[row] = tempDataColumn;
                                    }
                                }
                            }
                        }

                    }
                }
            }

            defer.resolve(response);
        });
        return defer.promise();
    }
});