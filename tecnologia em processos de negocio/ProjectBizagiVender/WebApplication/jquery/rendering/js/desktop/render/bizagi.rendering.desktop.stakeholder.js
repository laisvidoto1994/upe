/**
 *   Name: BizAgi Desktop Stakeholder
 *   Author: Fabian Moreno
 */
bizagi.rendering.stakeholder.extend("bizagi.rendering.stakeholder", {}, {
    /**
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var bizagiControl = $('.ui-bizagi-render-stakeholder-container').closest('.ui-bizagi-control.ui-bizagi-render-align-left ');

        // Hide initial control label
        bizagiControl.css('width', '100%');
        bizagiControl.prev().css('display', 'none');

        self.maxElemShow = 10;
        self.maxPageToShow = 5;
        self.selectedItems = [];
        self.valueXpath;
        self.guidEntity;
        self.currentPage;

        // Call base
        this._super();
    },

    /**
     * Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        //Event to associate stakeholder
        $("#ui-bizagi-render-stakeholder-add", control).click($.proxy(self.addInstance, self));
        $(".ui-bizagi-render-stakeholder-entity-row", control).click($.proxy(self.addGrid, self));
        $(".ui-bizagi-render-stakeholder-back", control).click($.proxy(self.goToBack, self));
        $(".ui-bizagi-render-stakeholder-link", control).click($.proxy(self.removeAssociated, self));
        $(".ui-bizagi-render-stakeholder-search", control).keyup($.proxy(self.onKeyUpFilter, self));

        control.on("click", "table .sortColumnsData-stakeholder", function (e) {
            var currentTarget = $(e.currentTarget);
            var paramField = currentTarget.data("orderfield");
            var orderType = currentTarget.data("ordertype");

            self.gridDataService(self.currentPage, null, paramField, (orderType === "DESC") ? "ASC" : "DESC");
        });
    },

    /**
     *
     */
    goToBack: function () {
        var self = this;
        var control = self.getControl();

        if (self.status === "step1") {
            $("#ui-bizagi-render-stakeholder-entity-list", control).hide();
            $("#ui-bizagi-render-stakeholder-add-instance", control).hide();

            $("#ui-bizagi-render-stakeholder-associated-list", control).show();
            $(".ui-bizagi-render-stakeholder-associated", control).show();
            $("#ui-bizagi-render-stakeholder-add", control).show();

            $(".ui-bizagi-render-stakeholder-back", control).hide();

            self.status = null;
        }
        else if (self.status === "step2") {
            $("#ui-bizagi-render-stakeholder-grid", control).hide();
            $("#ui-bizagi-render-stakeholder-add-instance", control).show();

            self.status = "step1";
        }
    },

    /**
     *
     */
    addInstance: function () {
        var self = this;
        var control = self.getControl();

        self.status = "step1";
        $("#ui-bizagi-render-stakeholder-associated-list", control).hide();
        $(".ui-bizagi-render-stakeholder-associated", control).hide();
        $("#ui-bizagi-render-stakeholder-add", control).hide();
        $("#ui-bizagi-render-stakeholder-entity-list", control).show();
        $("#ui-bizagi-render-stakeholder-add-instance", control).show();
        $(".ui-bizagi-render-stakeholder-back", control).show();
        $(".ui-bizagi-render-stakeholder-entity-row").removeClass("ui-bizagi-render-stakeholder-selected");

    },

    /**
     *
     * @param e
     */
    addGrid: function (e) {
        var self = this;
        var control = self.getControl();
        self.valueXpath = $( e.currentTarget).attr( "data-value" );
        self.guidEntity = $( e.currentTarget).attr( "guid-entity" );

        self.status = "step2";
        $(".ui-bizagi-render-stakeholder-entity-row").removeClass("ui-bizagi-render-stakeholder-selected");
        $(e.currentTarget).addClass("ui-bizagi-render-stakeholder-selected");

        $("#ui-bizagi-render-stakeholder-add-instance", control).hide();
        $("#ui-bizagi-render-stakeholder-grid", control).show();

        $(".ui-bizagi-render-stakeholder-search", control).val("");

        self.gridDataService(null, "", "", "DESC");
    },

    /**
     *
     * @param currentPage
     * @param filter
     * @param sort
     * @param orderType
     */
    gridDataService: function (currentPage, filter, sort, orderType) {
        var self = this;

        self.getData(self.valueXpath, currentPage, filter, sort, orderType).done(function (data) {
            self.onGetData(data, orderType);
        }).fail(function (e) {
            self.onGetDataFail(e);
        });
    },

    /**
     *
     * @param data
     */
    onGetData : function(data, orderType){
        var self = this;
        var control = self.getControl();
        var tempGrid = self.renderFactory.getTemplate("stakeholder-grid");
        self.currentPage  = data.page;

        if(data.rows.length > 0){
            var dataColumns = data.rows[0][1];

            //preprocess columns because more template simple
            var tempColumns = dataColumns.slice(1, dataColumns.length);
            var columns = [];
            for(iColumn = 0; iColumn < tempColumns.length; iColumn++){
                var objectColumn = {
                    name: tempColumns[iColumn][0],
                    displayName: tempColumns[iColumn][1],
                    orderType: orderType
                };
                columns.push(objectColumn);
            }


            var idData = self.selectedItems[self.valueXpath];

            $.each( data.rows, function (key, value) {
                var item = value[2][0][0];
                if((!idData && (item != undefined)) || (idData && (item == idData.id)))
                {
                    self.selectedItems[self.valueXpath] = {"id" : value[0], "idInstance": item, "nameInstance" : value[2][0][1]};
                    return;
                }
            });

            if(self.selectedItems[self.valueXpath] && self.selectedItems[self.valueXpath].idUser == "null")
            {
                delete self.selectedItems[self.valueXpath];
            }

            //preprocess data.rows because more template simple
            var newDataRows = [];
            for(var iRow = 0; iRow < data.rows.length; iRow++){
                var stateInstance = "";
                var tooltipLink = "";

                if(data.rows[iRow][2][0][0] && data.rows[iRow][2][0][0] != self.properties.idUser){
                    stateInstance = "associatedWithAnotherUser";
                    tooltipLink = bizagi.localization.getResource("render-stakeholder-link-tooltip-associate-another-user").replace("{0}", data.rows[iRow][2][0][1]);
                }
                else if(data.rows[iRow][2][0][0] == self.properties.idUser){
                    stateInstance = "associateMe";
                    tooltipLink = bizagi.localization.getResource("render-stakeholder-link-tooltip-associate");
                }
                else{
                    stateInstance = "unassociated";
                    tooltipLink = bizagi.localization.getResource("render-stakeholder-link-tooltip-unassociate");
                }

                var rowTemplate = {};
                rowTemplate.columns = [];
                rowTemplate.columns.push({
                    stateInstance: stateInstance,
                    value: data.rows[iRow][0],
                    tooltipLink: tooltipLink
                });

                for(var iColumn = 0; iColumn < data.rows[iRow][2].length; iColumn++){
                    if(iColumn > 0){
                        rowTemplate.columns.push({value: data.rows[iRow][2][iColumn]});
                    }
                }

                newDataRows.push(rowTemplate);
            }

            var gridTmp = $.tmpl(tempGrid, {
                datasource: newDataRows,
                columns: columns,
                tooltipUnassociated: bizagi.localization.getResource("render-stakeholder-link-tooltip-unassociate")
            });

            $(".ui-bizagi-render-stakeholder-items-grid-content", control).empty().append(gridTmp);

            var tempPagination = self.renderFactory.getTemplate("stakeholder-paginator");

            //Keep in track the total Records
            self.totalRecords = data.records;
            //keep in track the total pages
            self.totalPages = data.total;
            var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
            var pagerData = {};

            // show or hide "load more" button
            pagerData.pagination = (self.totalPages > 1);
            pagerData.page = data.page;
            pagerData.pages = {};

            for (var i = 1; i <= pageToshow; i++) {
                pagerData["pages"][i] = {
                    "pageNumber": i
                };
            }

            //load and append the paginator to the result table
            paginationHtml = $.tmpl(tempPagination, pagerData).html();
            $(".ui-bizagi-render-stakeholder-paginator", control).empty().append(paginationHtml);

            var $pager = $(".ui-bizagi-render-stakeholder-paginator ul", control);

            $pager.bizagiPagination({
                maxElemShow: self.maxPageToShow,
                totalPages: self.totalPages,
                actualPage: self.currentPage,
                listElement: $pager,
                clickCallBack: function (options) {
                    self.gridDataService(options.page);
                }
            });

            self.setRowsEvents();


        }
        else{//hay datos en data.rows//No
            $(".ui-bizagi-render-stakeholder-items-grid-content", control).empty();
            $(".ui-bizagi-render-stakeholder-paginator", control).empty();
        }

    },


    /**
     *
     * @param e
     */
    onGetDataFail : function(e){
        console.log("process property value error: " + e);
    },

    /**
     *
     */
    setRowsEvents: function () {
        var self = this;
        $(".ui-bizagi-render-stakeholder-table-link").click($.proxy(self.onLinkClick, self));
    },

    /**
     *
     * @param e
     */
    onLinkClick : function(e){
        var self = this;
        var idUser;
        var idEntity = $( e.currentTarget).attr( "data-value" );


        function executeLinkClickIfProceed(event){
            if ($(event.currentTarget).hasClass("ui-bizagi-render-stakeholder-table-link-close")) {
                $(".ui-bizagi-render-stakeholder-table-link").removeClass("ui-bizagi-render-stakeholder-table-link-close");
                idUser = "null";
            }
            else {
                $(".ui-bizagi-render-stakeholder-table-link").removeClass("ui-bizagi-render-stakeholder-table-link-close");
                $(event.currentTarget).addClass("ui-bizagi-render-stakeholder-table-link-close");
                idUser = self.properties.idUser;
            }

            self.selectedItems[self.valueXpath] = {"id" : idEntity, "idUser" : idUser};

            //if idUser is null, remove associated Stakeholder
            self.associatedUser(idEntity, self.guidEntity, idUser).done(function () {
                self.refreshStakeholderValue();

                //if only target contents ui-bizagi-render-stakeholder-table-stakeholder-associated-other-user
                //set association stakeholder to user
                if ($(event.currentTarget).hasClass("ui-bizagi-render-stakeholder-table-stakeholder-associated-other-user")) {
                    $(".ui-bizagi-render-stakeholder-table-link").removeClass("ui-bizagi-render-stakeholder-table-stakeholder-associated-other-user");
                    $(event.currentTarget).addClass("ui-bizagi-render-stakeholder-table-link-close");
                    idUser = self.properties.idUser;
                    self.associatedUser(idEntity, self.guidEntity, idUser).done(function () {
                        self.refreshStakeholderValue();
                    }).fail(function (e) {
                        self.onStakeAssociatedFail(e);
                    });
                }

            }).fail(function (e) {
                self.onStakeAssociatedFail(e);
            });
        }

        //Confirm to delete stakeholder association with another user.
        if($(e.currentTarget).hasClass("ui-bizagi-render-stakeholder-table-link-close") && $(e.currentTarget).hasClass("ui-bizagi-render-stakeholder-table-stakeholder-associated-other-user")){
            var confirmationMsg = bizagi.localization.getResource("render-stakeholder-delete-associate-instance-other-user-confirm-msg");
            $.when(bizagi.showConfirmationBox(confirmationMsg, "Bizagi", "warning"))
                .done(function () {
                    executeLinkClickIfProceed(e);
                });
        }
        else{
            executeLinkClickIfProceed(e);
        }
    },

    /**
     *
     * @param e
     */
    removeAssociated: function (e) {
        var self = this;

        var idEntity = $( e.currentTarget).attr( "data-value" );
        self.guidEntity = $( e.currentTarget).attr( "guid-entity" );
        var state = "null";
        self.selectedItems[self.valueXpath] = {"id" : idEntity, "idUser" : state};

        self.associatedUser(idEntity, self.guidEntity, state).done(function () {
            self.refreshStakeholderValue();
        }).fail(function (e) {
            self.onStakeAssociatedFail(e);
        });
    },

    /**
     *
     * @param e
     */
    onKeyUpFilter : function (e) {
        var self = this;
        if(e.keyCode == 13)
        {
            var filter = $(e.target).val();
            self.gridDataService(null,  filter);
        }

    },

    /**
     *
     */
    refreshStakeholderValue : function(){
        var self = this;
        var control = self.getControl();

        self.refreshStakeholderList().done(function (data) {
            //Update Stakeholder List
            self.setValue(data);
            control.empty().append(self.renderControl());
            self.configureHandlers();
        }).fail(function (e) {
            self.onStakeAssociatedFail(e);
        });
    },

    /**
     *
     * @param e
     */
    onStakeAssociatedFail : function(e){
        console.log("stakeholder associated error: " + e);
    },

    /**
     * Override display value
     */
    setDisplayValue: function (value) {
        var self = this;

        // Set internal value
        self.setValue(value);
    },

    /**
     *   Sets the internal value
     */
    setValue: function (value) {
        var self = this;

        // Set previous value
        self.properties.previousValue = self.properties.originalValue = JSON.stringify({ "value": self.value });

        // Change internal value
        self.value = self.properties.value = JSON.stringify({ "value": value });
    }
});
