/*
*   Name: BizAgi Workportal Security Command
*   Author: Edward Morales
*   Comments:
*   -   This script will define a common class to access the security data
*/


$.Class("bizagi.workportal.command.security", {}, {


    init: function (dataService) {
        var self = this;
        self.dataService = dataService;
        self.rawData = {};
    },

    getSecurity: function () {
        var self = this;
        var def = new $.Deferred();
        self.security = {};
        self.jsonSecurityList = {};

        if (bizagi.menuSecurity) {
            def.resolve(bizagi.menuSecurity);
        } else {
            $.when(self.dataService.getMenuAuthorization()).done(function (data) {
                if(bizagi.currentUser.associatedStakeholders && bizagi.currentUser.associatedStakeholders.length > 0){
                    data.permissions.push({"associatedStakeholders": []});
                }
                self.rawData = data;
                bizagi.menuSecurity = self.convertSecurityData(data);
                self.jsonSecurityList = data;
                $.each(self.security, function (key, value) {
                    authMenu[key] = value;
                });

                $(document).trigger("securityLoaded", {});

                def.resolve(bizagi.menuSecurity);
            });
        }

        return def.promise();
    },


    convertSecurityData: function (data) {
        var permsMenu = {};
        var getRecursivePerms = function (perms) {
            $.each(perms, function (key, value) {
                if (typeof value == 'object') {
                    if (typeof key != "number") {
                        permsMenu[key] = true;
                    }
                    getRecursivePerms(value);
                } else {
                    permsMenu[value] = true;
                }
            });
        };
        getRecursivePerms(data.permissions);
        return permsMenu;
    },

    checkSecurityPerm: function (module) {
        var self = this;
        module = module || "";
        var deferred = $.Deferred();

        if (!bizagi.menuSecurity) {
            $(document).bind("securityLoaded", function () {
                deferred.resolve(!!bizagi.menuSecurity[module]);
            });
        } else {
            deferred.resolve(!!bizagi.menuSecurity[module]);
        }

        return deferred.promise();
    },

    getRawData: function () {
        return this.rawData;
    }
});