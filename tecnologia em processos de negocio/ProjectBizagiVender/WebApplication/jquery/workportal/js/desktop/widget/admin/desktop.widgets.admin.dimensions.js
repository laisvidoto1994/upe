/**
* Name: BizAgi Desktop Widget Dimensions
* 
* @author Liliana Fernandez
*/


bizagi.workportal.widgets.admin.dimensions.extend("bizagi.workportal.widgets.admin.dimensions", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "dimensions": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions").concat("#ui-bizagi-workportal-widget-admin-dimensions"),
            "dimensions.administrable": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions").concat("#ui-bizagi-workportal-widget-admin-dimensions-administrable"),
            "dimensions.properties": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions").concat("#ui-bizagi-workportal-widget-admin-dimensions-properties"),
            "dimensions.edit.properties": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions").concat("#ui-bizagi-workportal-widget-admin-dimensions-edit-properties"),
            "dimensions.process.tree": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions").concat("#ui-bizagi-workportal-widget-admin-dimensions-process-tree"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;
        //Template vars 
        self.generalContent = self.getTemplate("dimensions");
        self.listContent = self.getTemplate("dimensions.administrable");
        self.detailsContent = self.getTemplate("dimensions.properties");
        self.detailsEditContent = self.getTemplate("dimensions.edit.properties");
        self.detailsProcessTreeContent = self.getTemplate("dimensions.process.tree");
    },

    postRender: function () {
        var self = this;

        //load form data
        self.setupData();
    },

    /*
    * Setup form data
    */
    setupData: function () {
        var self = this;

        self.setupInitialData();
    },

    /*
    * Load form data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent();

        var columnDimensionsAdminWrapper = $("#column-dimensions-admin-wrapper", content);
        var columnDimensionsPropertiesWrapper = $("#column-dimensions-properties-wrapper", content);

        //append fields to wrapper
        var list = $.tmpl(self.listContent, {});
        var details = $.tmpl(self.detailsContent, {});

        columnDimensionsAdminWrapper.html(list);
        columnDimensionsPropertiesWrapper.html(details);

        self.setupListProcessPanel1();
        self.setupListProcessPanel2();

        self.setupMainButtonsleft();
        self.setupMainButtonsRight();
    },

    /*
    * Dimensions List Panel1
    */
    setupDimensionsPanel1: function (updatePanel2) {
        var self = this,
            content = self.getContent();

        var defer = $.Deferred();

        $.when(self.dataService.getDimensions()
        ).done(function (result) {
            self.dimensions = result;

            var $ulListAdmin = $('#DimenListAdmin', content);
            var $ulListFixed = $('#DimenListFixed', content);

            $('dd', $ulListAdmin).remove();
            $('dd', $ulListFixed).remove();

            $.each(result.dimensions, function (ind2, valu2) {

                if (bizagi.util.parseBoolean(valu2.administrable)) {
                    var $ulList = $ulListAdmin.find('dt#admin_' + valu2.idWfClass);
                    $ulList.append('<dd id="' + valu2.id + '" class="ddDimensionsSelect">' + "<span>" + valu2.displayName + "</span>" + "</dd>");
                } else {
                    //var $ulList = $ulListFixed.find('dt#fixed_' + valu2.guidWfClass);
                    var $ulList = $ulListFixed.find("dt#fixed_" + valu2.guidWfClass.toLowerCase());
                    $ulList.append('<dd id="' + valu2.guid + '" class="ddDimensionsSelect">' + "<span>" + valu2.displayName + "</span>" + "</dd>");
                }
                
                $ulList.show();
            });

            self.setupManageLink();
            if (updatePanel2) {
                self.setupDimensionsPanel2();
            }

            defer.resolve();
        });

        return defer.promise();
    },

    /*
    * Dimensions List Panel2
    */
    setupDimensionsPanel2: function () {
        var self = this,
            content = self.getContent();

        if (self.dimensions.dimensions.length > 0) {
            var resultfind = self.dimensions.dimensions[0]; ;
            var description = resultfind.description;
            var displayName = resultfind.displayName;
            var id = resultfind.id;
            var guid = resultfind.guid || "";
            var idWfClass = resultfind.idWfClass;
            var guidWfClass = resultfind.guidWfClass || "";
            var administrable = resultfind.administrable;
            var name = resultfind.name;
            var counter = 4;
            var nameEntityPath = "";
            var entityPath = resultfind.entityPath;
            self.fullPath = entityPath;
            entityPath = entityPath.split(".");

            while (counter < entityPath.length) {
                nameEntityPath += entityPath[counter] + ".";
                counter += 3;
            }
            nameEntityPath = nameEntityPath.substring(0, nameEntityPath.length - 1);

            $("#lblNameRead").text(name);
            $("#lblDisplayNameRead").text(displayName);
            $("#lblDescriptionRead").text(description);
            $("#lblPhatRead").text(nameEntityPath);
            if (administrable) {
                $("#lblId").val(id);
                $("#lblidWfClass").val(idWfClass);
            } else {
                $("#lblId").val(guid);
                $("#lblidWfClass").val(guidWfClass);
            }
            $("#lblIsAdministrable").val(administrable);

            if (!bizagi.util.parseBoolean(administrable)) {
                $("#btn-deleteDimensions").hide();
                $("#btn-editDimensions").hide();
            }

        } else {
            $("#content-table-dimensions-admin").hide();
        }

    },

    /*
    * Process List Panel1
    */
    setupListProcessPanel1: function () {
        var self = this,
            content = self.getContent();

        $.when(self.dataService.getActiveWFClasses()).done(function (result) {
            self.processList = result;

            var $ulListAdmin = $('#DimenListAdmin', content);
            var $ulListFixed = $('#DimenListFixed', content);

            $.each(result.WFClasses, function (ind, valu) {
                //agregamos el elemento al final de la lista (con append)
                $ulListAdmin.append('<dt id=admin_' + valu.id + ' class="titleDimensionProcess">' + valu.displayName + '</dt>');
                $ulListFixed.append('<dt id=fixed_' + valu.guid + ' class="titleDimensionProcess">' + valu.displayName + '</dt>');
            });

            self.setupDimensionsPanel1(true);

        });

    },

    /*
    * Process List Panel2
    */
    setupListProcessPanel2: function () {
        var self = this,
            content = self.getContent();

        $.when(self.dataService.getActiveWFClasses()
        ).done(function (result) {

            $.each(result, function (ind1, valu1) {
                $.each(valu1, function (ind2, valu2) {

                    var resultfind = valu2;
                    var name = resultfind.displayName;

                    $("#lblProcessRead").text(name);

                });
            });
        });
    },

    /*
    * Select Display Dimensions
    */
    displayDimensionsById: function (dimensionId) {
        var self = this,
            content = self.getContent();

        $.each(self.dimensions.dimensions, function (ind1, value) {
            if (value.guid !== undefined && value.guid.toLowerCase() === dimensionId.toLowerCase()) {
                self.fillFieldsWithSelectedDimension(value, dimensionId);
                return false;
            }
            else if (value.guid === undefined && value.id == dimensionId) {
                self.fillFieldsWithSelectedDimension(value, dimensionId);
                return false;
            }
        });

        $("#content-table-dimensions-edit").remove();
        $("#content-table-dimensions-admin").show();
    },


    /*fill fields with values */
    fillFieldsWithSelectedDimension: function (value, dimensionId) {
        var self = this,
            content = self.getContent();

       var description = value.description;
       var displayName = value.displayName;
       var name = value.name;
       var entityPath = value.entityPath;
       var idWfClass = value.idWfClass;
       var isAdmin = value.administrable;
       var counter = 4;
       var nameEntityPath = "";
       self.fullPath = entityPath;
       entityPath = entityPath.split(".");

       while (counter < entityPath.length) {
           nameEntityPath += entityPath[counter] + ".";
           counter += 3;
       }
       nameEntityPath = nameEntityPath.substring(0, nameEntityPath.length - 1);

       $("#lblNameRead").text(name);
       $("#lblDisplayNameRead").text(displayName);
       $("#lblDescriptionRead").text(description);
       $("#lblPhatRead").text(nameEntityPath);
       $("#lblId").val(dimensionId);
       $("#lblIsAdministrable").val(isAdmin);
       $("#lblidWfClass").val(idWfClass);
       self.displayProcessById(idWfClass);

       if (!bizagi.util.parseBoolean(isAdmin)) {
           $("#btn-deleteDimensions").hide();
           $("#btn-editDimensions").hide();
       } else {
           $("#btn-deleteDimensions").show();
           $("#btn-editDimensions").show();
           $("#img_select_path").focus();
       }
   },

    /*
    * Select Display Process
    */
    displayProcessById: function (idWfClass) {
        var self = this,
            content = self.getContent();

        $.when(self.dataService.getActiveWFClasses()
        ).done(function (result) {

            $.each(result, function (ind1, valu1) {
                $.each(valu1, function (ind2, valu2) {
                    var resultfind = valu2;
                    var idProcess = resultfind.Id || resultfind.id;

                    if (idWfClass == idProcess) {
                        var name = resultfind.displayName;
                        $("#lblProcessRead").text(name);
                        return false;
                    }
                });
            });
        });
    },

    /*
    * New Dimensions
    */
    newDimensionAdmin: function () {
        var self = this;
        var createTmpl = $.tmpl(self.detailsEditContent, { processList: self.processList.WFClasses });
        self.action = "create";

        $("#content-table-dimensions-edit").remove();
        $("#content-table-dimensions-admin").hide();
        $("#column-dimensions-properties-wrapper").append(createTmpl);
        self.setupManageButtons();
        self.processComboOnChange();
        $("#btn-newDimensions").unbind("click");
        self.setupPathLink();
    },

    /*
    * Validate required fields New Dimensions
    */
    validateData: function () {
        var self = this,
            content = self.getContent();

        if ($("#txtNameEdit", content).val() == "") {
            return bizagi.localization.getResource("workportal-widget-admin-dimensions-text-name");
        }
        else if ($("#txtDisplayNameEdit", content).val() == "") {
            return bizagi.localization.getResource("workportal-widget-admin-dimensions-text-displayName");
        }
        if ($("#txtPhatEdit", content).val() == "") {
            return bizagi.localization.getResource("workportal-widget-admin-dimensions-text-path");
        }

        return "true";
    },

    /*
    * Implement Changes in Dimensions
    */
    applyDimensionsAdmin: function () {
        var self = this,
            content = self.getContent();

        var displayName = $("#txtDisplayNameEdit").val();
        var name = $("#txtNameEdit").val();
        var idWfClass = $("#processTypeList").val();
        var description = $("#txtDescriptionEdit").val();
        var params = { displayName: displayName, name: name, idWfClass: idWfClass, entityPath: self.fullPath, description: description };
        var noEmptyFields = self.validateData();

        if (noEmptyFields == "true") {
            $.when(self.dataService.createAdministrableDimension(params)
            ).done(function (result) {
                if (result.id) {
                    self.setupMainButtonsleft();
                    $("#content-table-dimensions-edit").hide();
                    $("#content-table-dimensions-admin").show();

                    $.when(self.setupDimensionsPanel1(false))
                        .done(function() {
                            self.displayDimensionsById(result.id);
                        });
                } else {
                    bizagi.showMessageBox(result.message, "Bizagi", "warning");
                }

            }).fail(function (error) {
                var message = jQuery.parseJSON(error.responseText);

                bizagi.showMessageBox(message.message, "Bizagi", "warning");
            });
        }
        else {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-dimensions-comfirm-message") + ": " + noEmptyFields, "Bizagi", "warning");
        }

    },

    /*
    * Implement Changes in Dimensions
    */
    cancelDimensionsAdmin: function () {
        var self = this,
          content = self.getContent();
        $("#content-table-dimensions-edit").remove();
        if (self.dimensions.dimensions.length > 0)
            $("#content-table-dimensions-admin").show();
        self.setupMainButtonsleft();
    },

    /*
    * Delete Dimensions
    */
    deleteDimensionsAdmin: function (dimensionId) {
        var self = this,
            content = self.getContent();

        var id = $("#lblId").val();
        var administrable = $("#lblIsAdministrable").val();
        var params = { id: id, administrable: administrable };

        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-widget-admin-dimensions-invalidate-confirm-msg"), "Bizagi", "warning"))
        .done(function () {
            $.when(self.dataService.deleteDimension(params)
            ).done(function (result) {

                self.setupData();

            }).fail(function (error) {
                bizagi.log(error);
            });
        });
    },

    /*
    *
    */
    showEditInfo: function () {
        var self = this;
        var editTmpl = $.tmpl(self.detailsEditContent, { processList: self.processList.WFClasses });
        self.action = "edit";

        $("#content-table-dimensions-admin").hide();
        $("#column-dimensions-properties-wrapper").append(editTmpl);

        $("#processTypeList").val($("#lblidWfClass").val());
        $("#txtNameEdit").val($("#lblNameRead").text());
        $("#txtDisplayNameEdit").val($("#lblDisplayNameRead").text());
        $("#txtDescriptionEdit").val($("#lblDescriptionRead").text());
        $("#txtPhatEdit").val($("#lblPhatRead").text());

        self.setupManageButtons();
        self.processComboOnChange();
        self.setupMainButtonsleft();
        self.setupPathLink();
        $("#img_select_path.iconSelectPath").focus();
    },
    /*
    * Edit Dimensions
    */
    editDimensionsAdmin: function () {
        var self = this,
            content = self.getContent;

        var id = $("#lblId").val();
        var displayName = $("#txtDisplayNameEdit").val();
        var name = $("#txtNameEdit").val();
        var idWfClass = $("#processTypeList").val();
        var description = $("#txtDescriptionEdit").val();
        var params = { id: id, displayName: displayName, name: name, idWfClass: idWfClass, entityPath: self.fullPath, description: description };
        var noEmptyFields = self.validateData();

        if (noEmptyFields == "true") {

            $.when(self.dataService.editDimension(params)
            ).done(function (result) {
                if (result.id) {
                    $("#lblidWfClass").val($("#processTypeList").val());
                    $("#lblNameRead").text($("#txtNameEdit").val());
                    $("#lblDisplayNameRead").text($("#txtDisplayNameEdit").val());
                    $("#lblDescriptionRead").text($("#txtDescriptionEdit").val());
                    $("#lblPhatRead").text($("#txtPhatEdit").val());
                    $("#lblId").val(id);

                    $("#content-table-dimensions-edit").remove();
                    $("#content-table-dimensions-admin").show();

                    self.setupDimensionsPanel1(false);
                } else {
                    bizagi.showMessageBox(result.message, "Bizagi", "warning");
                }
            }).fail(function (error) {
                var message = jQuery.parseJSON(error.responseText);

                bizagi.showMessageBox(message.message, "Bizagi", "warning");
            });
        } else {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-dimensions-comfirm-message") + ": " + noEmptyFields, "Bizagi", "warning");
        }
    },

    /*
    * Display Panel Path
    */
    displayPath: function () {
        var self = this,
          content = self.getContent;

        $("#entities-tree-wrapper", content).show();
        $("#entities-tree-wrapper").draggable();
        $("#shadow-panel").css({
            'width': $(".ui-dialog").width(),
            'height': $(".ui-dialog").height(),
            'background-color': 'grey',
            'opacity': 0.1
        });
        self.setupEntitiesTree();
        self.setupEntitiesTreeButtons();
    },

    /*
    * initialize the entities tree widget
    */
    setupEntitiesTree: function () {
        var self = this;
        var content = self.getContent();

        self.entitiesTree = new bizagi.workportal.widgets.entitiestree(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#tree-content", content),
            idWfClass: $("#lblidWfClass").val()
        }));

        self.entitiesTree.render();
    },

    /************************EVENTS ***********************************/

    setupMainButtonsleft: function () {
        var self = this,
            content = self.getContent();

        $("#btn-newDimensions", content).click(function () {
            self.newDimensionAdmin();
        });
    },

    setupMainButtonsRight: function () {
        var self = this,
            content = self.getContent();

        $("#btn-editDimensions", content).click(function () {
            self.showEditInfo();
        });

        $("#btn-deleteDimensions", content).click(function () {
            self.deleteDimensionsAdmin();
        });
    },

    setupManageButtons: function () {
        var self = this,
        content = self.getContent();

        $("#btn-applyDimensions", content).click(function () {
            if (self.action == "create") {
                self.applyDimensionsAdmin();
            } else {
                self.editDimensionsAdmin();
            }
        });

        $("#btn-cancelDimensions", content).click(function () {
            self.cancelDimensionsAdmin();
        });
    },

    setupManageLink: function () {
        var self = this,
        content = self.getContent();

        $(".ddDimensionsSelect", content).click(function () {

            var dimensionId = this.getAttribute("id");
            self.dimensionId = dimensionId;
            self.displayDimensionsById(self.dimensionId);
            self.setupMainButtonsleft();

        });
    },

    setupPathLink: function () {
        var self = this,
        content = self.getContent();
        $("#img_select_path").focus();

        $("#img_select_path", content).click(function () {

            self.displayPath();
        });
    },

    processComboOnChange: function () {
        var self = this,
        content = self.getContent();

        $("#processTypeList").click(function () {
            $("#txtPhatEdit").val("");
        });
    },

    setupEntitiesTreeButtons: function () {
        var self = this,
            content = self.getContent();

        $("#btn-close-tree", content).unbind("click").bind("click", function () {
            $("#entities-tree-wrapper", content).hide();
            $("#tree-content", content).html("");
            $("#shadow-panel").removeAttr("style");
        });

        $("#btn-cancel-tree", content).unbind("click").bind("click", function () {
            $("#entities-tree-wrapper", content).hide();
            $("#tree-content", content).html("");
            $("#shadow-panel").removeAttr("style");
        });

        $("#btn-save-tree", content).unbind("click").bind("click", function () {
            var treeRoute = self.entitiesTree.getTreeRouteSelected();
            self.fullPath = treeRoute.path;
            $("#txtPhatEdit", content).val(treeRoute.name);
            $("#entities-tree-wrapper", content).hide();
            $("#tree-content", content).html("");
            $("#shadow-panel").removeAttr("style");
        });
    }

});