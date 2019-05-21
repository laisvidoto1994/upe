/**
// * Admin module to case massively reassign
 * 
// * @author Lilian Fernandez, David Nino
 */


bizagi.workportal.widgets.admin.encrypt.passwords.extend("bizagi.workportal.widgets.admin.encrypt.passwords", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "encrypt.passwords": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.encrypt.passwords").concat("#ui-bizagi-workportal-widget-admin-encrypt-passwords"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;

        //Template vars
        self.generalContentTmpl = self.getTemplate("encrypt.passwords");
        self.setupFooterButtons();
    },

    /*
    *
    */
    setupFooterButtons: function () {
        var self = this,
            content = self.getContent();
        var params = {};

        var widgetButtonSet = $("#encryp-password-data-buttonset", content);

        var noEmptyFields;
        var equalFields;

        $("#btn-encrypt", widgetButtonSet).click(function (e) {
            params.entry = $("#txtTextToEncrypt").val();

            noEmptyFields = self.validateData();
            equalFields = self.comparePasswords();

            if (noEmptyFields && equalFields) {
                $.when(self.dataService.encryptString(params)).done(function (result) {
                    $("#txtEncryptedText", content).val(result.encryptedPassword);
                }).fail(function (error) { });
            }
            else {

                if (!noEmptyFields)
                    bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-encrypt-passwords-emptyfields-message"), "Bizagi", "warning");
                else
                    if (!equalFields)
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-encrypt-passwords-emptyfields-message-equals"), "Bizagi", "warning");
            }
        });

    },
    /*
    *
    */
    comparePasswords: function () {
        var self = this,
            content = self.getContent();

        var password = $("#txtTextToEncrypt", content).val();
        var confirmPassword = $("#txtConfirmTextToEncrypt", content).val();

        if (password != confirmPassword) {
            return false;
        } else {
            return true;
        }
    },

    /*
    * Validate required fields
    */
    validateData: function () {
        var self = this,
            content = self.getContent(),
            fieldsAreEmpty = false;


        if ($("#txtTextToEncrypt", content).val() != "") {
            fieldsAreEmpty = true;
        }
        else if ($("#txtConfirmTextToEncrypt", content).val() != "") {
            fieldsAreEmpty = true;
        }

        return fieldsAreEmpty;
    }

});