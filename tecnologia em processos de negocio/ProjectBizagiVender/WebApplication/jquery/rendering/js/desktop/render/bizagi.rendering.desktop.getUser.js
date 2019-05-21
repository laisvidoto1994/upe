/**
 * Description of file
 * @author: Jeison Borja
 */
bizagi.rendering.getUser.extend("bizagi.rendering.getUser", {}, {
    /**
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var opt = {};
        self.input = $(".ui-bizagi-render-text", self.getControl());

        if (self.properties.value != null && self.properties.value.length > 0) {
            self.setDisplayValue(self.properties.value[0]);
        }
        // Call base
        this._super();
    },
    /**
     * Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        self.bindSearchUserPlugin(control);
        $('#btn-clear-user', control).on('click', function () {
            self.clearValue();
        });
    },
    /**
     * Set display value
     */
    setDisplayValue: function (data) {
        var self = this;
        var control = self.getControl();
        var value = (typeof (data) !== "undefined") ? data.value : null;

        if (self.properties.editable) {
            self.input.val(value);
        }

        self.setValue(data, false);
    },
    /**
     * Clear data control
     */
    clearValue: function () {
        var self = this;
        var control = self.getControl();

        if (self.input) {
            self.setDisplayValue("");
        }
    },
    /**
     * Binds the search user plugin
     */
    bindSearchUserPlugin: function (control) {
        var self = this;
        var options = {
            title: self.getResource("render-plugin-search-users-title"),
            maximize: false,
            filters: ["domain", "userName", "fullName"],
            displayNames: [
                self.getResource("render-plugin-search-users-domain"),
                self.getResource("render-plugin-search-users-user-name"),
                self.getResource("render-plugin-search-users-full-name")],
            searchButtonName: self.getResource("render-plugin-search-users-search-button-name"),
            clearButtonName: self.getResource("render-plugin-search-users-clear-button-name"),
            valuesToSelect: ["iduser", "user"], //"iduser","username","user","domain","email"
            selectItem: function () {
                var deferred = $.Deferred();
                deferred.done(function (data) {
                    self.onItemSelectedSuccess(data);
                }).fail(function (error) {
                    bizagi.log(error);
                });
                return deferred;
            },
            searchUsers: function (filterData) {
                return self.dataService.getUsersList(filterData);
            },
            getTableTemplate: function (usersResults, currentPage, pagination, pagesArray) {
                var content = self.renderFactory.getTemplate("bizagi.plugin.search.user");
                var usersTableTmpl = $.tmpl(content, { users: usersResults, links: [self.getResource("render-plugin-search-users-select-link")], page: currentPage, pagination: pagination, pagesArray: pagesArray });
                return usersTableTmpl;
            },
            showError: function (error) {
                bizagi.log(error);
            },
            showMessageBox: function (message) {
                bizagi.showMessageBox(bizagi.localization.getResource(message), "Bizagi", "warning");
            }
        };

        if (self.properties.xpath === "idDelegate") {
            options.editingUser = self.properties.idUser;
        }
        opt = options;

        // Allows add new user when creating the pluggin
        var params = self.getParams();
        if (typeof params.isEntityForm !== "undefinded" && params.isEntityForm) {
            options.allowAddUser = true;
            options.dataService = self.dataService;
            options.renderFactory = self.renderFactory;
        }

        $('#btn-get-user', control).bizagiSearchUser(options);
    },
    /**
     * returns the opt var for unit testing
     */
    getOptions: function () {
        return opt;
    },
    /**
     *
     * @param itemSelected
     */
    onItemSelectedSuccess: function (itemSelected) {
        var self = this;
        var control = self.getControl();
        var data = {
            id: itemSelected.iduser,
            value: itemSelected.user
        };

        self.setDisplayValue(data);
    }
});
