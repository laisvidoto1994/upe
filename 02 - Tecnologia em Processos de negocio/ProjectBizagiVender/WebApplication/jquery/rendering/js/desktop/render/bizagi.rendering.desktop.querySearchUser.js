/*
 *   Name: BizAgi Render Query Search User
 *   Author: Jeison Borja
 *   Comments:
 *   -   This script will define desktop stuff for query search user renders
 *   Modified by: Andrés F. Muñoz
 *   Comments:
 *   - This control Implemments the search users plugin
 */

bizagi.rendering.querySearchUser.extend("bizagi.rendering.querySearchUser", {
    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        // Call base
        this._super(data);
    },

    /*
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        // Call base
        self.input = $(".ui-bizagi-render-text", self.getControl());
        // Call base
        this._super();
    },

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        if (typeof value === "object"){
            if(typeof value[0] === "object" && value[0].label !== undefined){
                value = value[0].label;
            }
            else{
                value = value.label;
            }
        }
        else{
            value = '';
        }

        var self = this,
            properties = self.properties;

        // Call base
        this._super(value);

        // Set value in input
        if (!bizagi.util.isEmpty(value) && properties.editable) {
            self.input.val(value);
        }
    },

    /*
     * Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        self.bindSearchUserPlugin(control);
    },

    /*
     * Binds the search user plugin
     */
    bindSearchUserPlugin: function (control) {
        var self = this;
        var options = {
            title: self.getResource("render-plugin-search-users-title"),
            filters:["domain", "userName","fullName"],
            displayNames:[
                self.getResource("render-plugin-search-users-domain"),
                self.getResource("render-plugin-search-users-user-name"),
                self.getResource("render-plugin-search-users-full-name")],
            searchButtonName: self.getResource("render-plugin-search-users-search-button-name"),
            clearButtonName: self.getResource("render-plugin-search-users-clear-button-name"),
            valuesToSelect: ["iduser","username"],//"iduser","username","user","domain","email"
            selectItem: function(){
                var deferred = $.Deferred();
                deferred.done(function (data) {
                    self.onItemSelectedSuccess(data);
                }).fail(function (error) {
                    bizagi.log(error);
                });
                return deferred;
            },
            searchUsers: function(filterData){
                return self.dataService.getUsersList(filterData);
            },
            getTableTemplate: function(usersResults,currentPage,pagination,pagesArray){
                var content = self.renderFactory.getTemplate("bizagi.plugin.search.user");
                var usersTableTmpl = $.tmpl(content, { users: usersResults, links: [self.getResource("render-plugin-search-users-select-link")], page: currentPage, pagination: pagination, pagesArray: pagesArray });
                return usersTableTmpl;
            },
            showError: function(error){
                bizagi.log(error);
            },
            showMessageBox: function(message){
                bizagi.showMessageBox(bizagi.localization.getResource(message), "Bizagi", "warning");
            }
        };

        opt = options;

        $('#btn-get-user',control).bizagiSearchUser(options);
    },
    /*
    * returns the opt var for unit testing
    * */
    getOptions: function(){
        return opt;
    },

    onItemSelectedSuccess: function(itemSelected){
        var self = this;
        var control = self.getControl();
        $(".ui-bizagi-render-text",control).val(itemSelected.username);
        var item = {};
        item.id = itemSelected.iduser;
        item.label = itemSelected.username;
        item.value = itemSelected.username;
        self.setValue(item);
    }
});