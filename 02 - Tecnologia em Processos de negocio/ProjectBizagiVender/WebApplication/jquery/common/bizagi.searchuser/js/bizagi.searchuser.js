/*
 * Control to search users for Bizagi rendering
 * @author: Andrés fernando Muñoz
 */
(function ($) {
    $.fn.bizagiSearchUser = function (options) {
        var self = this;
        options = options || {};
        var filterData = {};
        var maxPages = 10;
        var maxRows = 9;
        var usersResults = [];
        var currentPage = 1
        var totalPages = 0;
        var dBox = {};
        var editingUser = options.editingUser;

        var methods = {
            "init":function(){
                var filterData = {};
                methods.bindElements();
            },
            "bindElements":function(){
                self.click(function () {
                    methods.openUploadDialog();
                });
            },
            "openUploadDialog":function(){
                var self = this;
                var doc = window.document;
                var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-search-user'/>");
                dBox = dialogBox.dialog({
                    width: 950,
                    maximize: false,
                    resize: false,
                    draggable: false,
                    height: 650,
                    title: options.title,
                    modal: true
                });
                methods.showFilters();
                methods.showButtons();
                methods.addHandlers();
            },
            "showFilters":function(){
                var filtersContainer = $("<div id='filtersContainer' class='filters-container clearfix'></div>");
                $.each(options.filters, function(index, value){
                    $(filtersContainer, dBox).append("<div class='filters-row clearfix'><div class='filters-cell'><span>" + options.displayNames[index] + "</span></div><div class='filters-cell'><input id=" + value + " type='text'> </input></div></div>");
                });
                filtersContainer.appendTo(dBox);
            },
            "showButtons":function(){
                var buttonsContainer = $("<div id='buttonsContainer'class='biz-wp-buttonset'></div>");
                $(buttonsContainer,dBox).append("<button id='btnSearchUsers' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover' role='button' aria-disabled='false'><span class='ui-button-text'>" + options.searchButtonName + "</span></button>");
                $(buttonsContainer,dBox).append("<button id='btnClear' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover' role='button' aria-disabled='false'><span class='ui-button-text'>" + options.clearButtonName + "</span></button>");

                // Append new user Button
                if (options.allowAddUser) {
                    var newUserBtn =
                        "<button id='btnNew' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover' role='button' aria-disabled='false'>" +
                            "<span class='ui-button-text'>" +
                                bizagi.localization.getResource("workportal-widget-admin-user-profiles-button-label-newUserProfiles") +
                            "</span>" +
                        "</button>";

                    $(buttonsContainer, dBox).append(newUserBtn);
                    buttonsContainer.appendTo(dBox);

                    $("#btnNew", dBox).bizagiCreateUser(options.dataService, options.renderFactory, {
                            canvas: $(dBox),
                            onCreate: options.selectItem(),
                            onCancel: function () {
                                $(dBox).dialog('option', 'title', options.title);
                                $(dBox).empty();

                                methods.showFilters();
                                methods.showButtons();
                                methods.addHandlers();
                            }
                        }
                    );
                }
                else {
                    buttonsContainer.appendTo(dBox);
                }
            },
            "addHandlers":function(){
                $("#btnSearchUsers", dBox).click(function() {
                    methods.getUsersTableData();
                 });

                $("#btnClear", dBox).click(function() {
                    methods.clickClearPluginValues();
                });
                return this;
            },
            "clickClearPluginValues":function(){
                $.each(options.filters, function(index, value){
                    $('#'+value, dBox).val('');
                });
                $("#searchResults", dBox).remove();
            },
            "getUsersTableData": function () {
                var self = this;
                methods.updateFiltersInformation();
                var deferred = options.searchUsers(filterData);
                $.when(deferred).done(function (data) {
                    usersResults = data.users;
                    totalPages = data.total;
                    methods.showUsersTable();
                }).fail(function (error) {
                    options.showError(error);
                });
            },
            "updateFiltersInformation":function(){
                $.each(options.filters, function(index, value){
                    filterData[value] = $('#'+value,dBox).val();
                });
                filterData['pag'] = currentPage;
                filterData['pagSize'] = maxRows;
                if (typeof (editingUser) !== "undefined" && editingUser !== "") {
                    filterData['editingUser'] = editingUser;
                }
            },
            "showUsersTable": function () {
                if (usersResults.length > 0) {
                    var pagination = (totalPages > 1) ? true : false;
                    var pagesArray = methods.getPagesArray();
                    $("#searchResults",dBox).remove();
                    var usersTableTmpl = options.getTableTemplate(usersResults,currentPage,pagination,pagesArray);
                    $(dBox).append(usersTableTmpl);
                    methods.addTableHandlers();
                    methods.setUpPagination();
                } else {
                    options.showMessageBox("workportal-widget-usertable-empty");
                    $("#searchResults", dBox).remove();
                }
            },
            "addTableHandlers":function(){
                $('table :button', dBox).click(function () {
                    var buttonSelf = $(this);
                    var itemSelected = {};
                    $.each(options.valuesToSelect, function(index, value){
                        itemSelected[value] = buttonSelf.data(value);
                    });
                    var selItemDeferred = options.selectItem();
                    selItemDeferred.resolve(itemSelected);
                    dBox.remove();
                })
            },
            "getPagesArray": function () {
                var pagesToShow = (maxPages > totalPages) ? totalPages : maxPages;
                var aux = [];
                for (var a = 0; a < pagesToShow; a++) {
                    aux.push(a + 1);
                }
                return aux;
            },
            "setUpPagination": function () {
                var self = this;
                var $pager = $("#biz-wp-userstable-pager ul", dBox);
                $pager.bizagiPagination({
                    maxElemShow: maxRows,
                    totalPages: totalPages,
                    actualPage: currentPage,
                    listElement: $pager,
                    clickCallBack: function (options) {
                        filterData.pag = currentPage = parseInt(options.page);
                        self.getUsersTableData();
                    }
                });
            }
        };

        methods.init();
        return methods;
    }

})(jQuery);
