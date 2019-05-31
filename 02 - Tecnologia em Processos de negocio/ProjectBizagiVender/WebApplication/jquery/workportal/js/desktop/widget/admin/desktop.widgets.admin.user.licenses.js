/**
* Name: BizAgi Desktop Widget User Licenses
* 
* @author Liliana Fernandez
*/


bizagi.workportal.widgets.admin.user.licenses.extend("bizagi.workportal.widgets.admin.user.licenses", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "user.licenses": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.licenses").concat("#ui-bizagi-workportal-widget-admin-user-licenses"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;
        //Template vars 
        self.generalContent = self.getTemplate("user.licenses");
        //        self.fieldsContent = self.workportalFacade.getTemplate("defaults.assignation.user.fields");
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
        self.setupButton();

    },

    /*
    * Load form data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent();

        $.when(self.dataService.licenses()
        ).done(function (result) {
            if (result.licenseType == "none") {
                $("#licenseAlert").show();
                $("#licenseContent").hide();
            } else {
                $("#licenseContent").show();
                $("#licenseAlert").hide();
                if (result.expirationDate == "") {
                    var expirationDate = "12/31/9999";
                } else {
                    var expirationDate = result.expirationDate.substring(0, 11);
                }

                if (result.licenseType == "Volume") {
                    $("#users").text(result.activeUsers + " " + bizagi.localization.getResource("workportal-widget-admin-user-licenses-titles-usersLicenses-text"));
                } else {
                    $("#users").text(result.activeUsers + "/" + result.licensedUsersAccount + "  " + bizagi.localization.getResource("workportal-widget-admin-user-licenses-titles-usersLicenses-text"));
                }
                $("#licenses").text(result.customerName);
                
                $("#date").text(expirationDate);
                $("#licenseType").text(result.licenseType);
                $("#licenseCluster").text(result.clustered);
                //$("#activeProcess").text(result.activeProcess);
            }
        });
    },

    setupButton: function () {
        var self = this,
            content = self.getContent();

        $("#btn-buyNowLicenses", content).click(function (e) {

            window.open('http://www.bizagi.com/', 'name', 'height=600,width=800');
        });
        $("#btn-auditLicenses", content).click(function (e) {


            $.when(self.dataService.getAuditLicense()).done(function (result) {

            }).fail(function (result) {

            });

        });
    }
});