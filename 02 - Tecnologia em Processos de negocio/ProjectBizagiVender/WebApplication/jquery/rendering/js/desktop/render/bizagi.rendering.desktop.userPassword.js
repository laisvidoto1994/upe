/*
 *   Name: BizAgi Render userPassword class
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will define basic stuff for userPassword renders
 */

bizagi.rendering.userPassword.extend("bizagi.rendering.userPassword", {}, {
    /*
    * Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        // Call base
        this._super();

        self.input = control.find("input");

        // Define max length of element
        if (self.properties.maxLength > 0) {
            self.input.attr("maxlength", self.properties.maxLength);
        }
    },

    /*
    * Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        // Attach change event
        self.input.bind("change", function () {

            var inputValue = self.input.val();

            if (inputValue !== "") {
                // Updates internal value
                self.saveValue(inputValue);
            } else { 
                self.setValue(inputValue)
            }

        }).keypress(function (e) {
            e = window.event || e;
            var keyUnicode = e.charCode || e.keyCode;
            if (e !== undefined) {
                if (keyUnicode == 13) {
                    $(this).trigger("change");
                }
            }
        });
    },

    saveValue: function (inputValue) {
        var self = this;

        var C = CryptoJS;
        var userFormsSpanner = C.enc.Utf8.parse('pc30n84e15lvdD68');
        var userFormsCode = CryptoJS.enc.Latin1.parse('1v00628X62bJE2mi');

        var aes = C.algo.AES.createEncryptor(userFormsSpanner, {
            mode: C.mode.CBC,
            padding: C.pad.Pkcs7,
            iv: userFormsCode
        });

        var resultMain = aes.finalize(inputValue);
        var resultMainFinal = C.enc.Base64.stringify(resultMain);

        self.setValue(resultMainFinal);
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        var tempHTML = "<label class='readonly-control'></label>";
        var spanTmp = $.tmpl(tempHTML, {});

        control.append(spanTmp);
    }
});