/*
 @title: Editor orientation
 @authors: Danny González
 @date: 27-Enero-2015s
 */
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.currencysymbol", {
        /*
         * Constructor
         */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            this.focus = null;
        },
        responseChangeCombo: function (elValue, event, self) {
            var oldCurrencySymbolValue, newCurrencySymbolValue, options;
            oldCurrencySymbolValue = self.inputValue;
            newCurrencySymbolValue = elValue;

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: oldCurrencySymbolValue,
                newValue: newCurrencySymbolValue,
                data: newCurrencySymbolValue,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = newCurrencySymbolValue;

            var label = $('.ui-comboBox-value', self.element).html();
            $('.ui-bizagi-editor-comboBox-selector', self.element).attr('title', label);
        },

        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.currencysymbol").concat("#currencysymbol-frame"))
            ).done(function () {
                    deferred.resolve();
                });
            return deferred.promise();
        },
        /*
         * Process the information about of editor and render it
         */
        renderEditor: function (container, data) {

            var self = this, currencySymbolEditor;
            $.extend(data, {
                uiCurrencySymbolValues: [
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-separator-main"),value: "-1", unselectable:true},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-DEF"),value: ""},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-USD"),value: "US$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-EUR"),value: "€"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GBP"),value: "£"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-INR"),value: "₹"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AUD"),value: "AUD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CAD"),value: "CAD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SGD"),value: "SGD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-separator-all"),value: "-1", unselectable:true},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AED"),value: "AED$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AFN"),value: "AFN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ALL"),value: "ALL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AMD"),value: "AMD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ANG"),value: "ANG$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AOA"),value: "AOA$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ARS"),value: "ARS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AUD"),value: "AUD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AWG"),value: "AWG$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-AZN"),value: "AZN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BAM"),value: "BAM$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BBD"),value: "BBD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BDT"),value: "BDT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BGN"),value: "BGN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BHD"),value: "BHD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BIF"),value: "BIF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BMD"),value: "BMD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BND"),value: "BND$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BOB"),value: "BOB$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BRL"),value: "R$"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BSD"),value: "BSD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BTN"),value: "BTN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BWP"),value: "BWP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BYR"),value: "BYR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-BZD"),value: "BZD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CAD"),value: "CAD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CDF"),value: "CDF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CHF"),value: "CHF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CLP"),value: "CLP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CNY"),value: "元"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-COP"),value: "COP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CRC"),value: "CRC$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CUC"),value: "CUC$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CUP"),value: "CUP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CVE"),value: "CVE$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-CZK"),value: "Kč"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-DJF"),value: "DJF "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-DKK"),value: "kr"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-DOP"),value: "DOP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-DZD"),value: "DZD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-EGP"),value: "EGP£ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ERN"),value: "ERN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ETB"),value: "ETB$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-EUR"),value: "€"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-FJD"),value: "FJD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-FKP"),value: "FKP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GBP"),value: "£"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GEL"),value: "GEL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GGP"),value: "GGP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GHS"),value: "GHS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GIP"),value: "GIP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GMD"),value: "GMD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GNF"),value: "GNF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GTQ"),value: "GTQ$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-GYD"),value: "GYD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-HKD"),value: "HKD元 "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-HNL"),value: "HNL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-HRK"),value: "HRK$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-HTG"),value: "HTG$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-HUF"),value: "Ft"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-IDR"),value: "Rp"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ILS"),value: "₪"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-IMP"),value: "IMP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-INR"),value: "₹"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-IQD"),value: "IQD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-IRR"),value: "IRR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ISK"),value: "ISKkr "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-JEP"),value: "JEP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-JMD"),value: "J$"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-JOD"),value: "JOD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-JPY"),value: "¥"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KES"),value: "KES$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KGS"),value: "KGS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KHR"),value: "KHR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KMF"),value: "KMF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KPW"),value: "KPW$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KRW"),value: "₩"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KWD"),value: "KWD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KYD"),value: "KYD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-KZT"),value: "KZT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LAK"),value: "LAK$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LBP"),value: "LBP£ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LKR"),value: "₨"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LRD"),value: "LRD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LSL"),value: "LSL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-LYD"),value: "LYD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MAD"),value: "MAD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MDL"),value: "MDL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MGA"),value: "MGA$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MKD"),value: "MKD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MMK"),value: "MMK$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MNT"),value: "MNT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MOP"),value: "MOP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MRO"),value: "MRO$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MUR"),value: "MUR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MVR"),value: "MVR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MWK"),value: "MWK$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MXN"),value: "MXN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-MZN"),value: "MZN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NAD"),value: "NAD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NGN"),value: "NGN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NIO"),value: "NIO$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NOK"),value: "NOKkr "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NPR"),value: "NPR₨ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-NZD"),value: "NZD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-OMR"),value: "﷼"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PAB"),value: "B/."},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PEN"),value: "PEN$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PGK"),value: "PGK$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PHP"),value: "Ph"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PKR"),value: "PKR₨ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PLN"),value: "zł"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-PYG"),value: "PYG "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-QAR"),value: "QAR﷼ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-RON"),value: "le"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-RSD"),value: "RSD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-RUB"),value: "RUB "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-RWF"),value: "RWF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SAR"),value: "SAR﷼ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SBD"),value: "SBD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SCR"),value: "SCR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SDG"),value: "SDG$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SEK"),value: "SEKkr "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SGD"),value: "SGD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SHP"),value: "SHP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SLL"),value: "SLL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SOS"),value: "SOS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SPL"),value: "SPL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SRD"),value: "SRD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-STD"),value: "STD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SVC"),value: "SVC$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SYP"),value: "SYP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-SZL"),value: "SZL$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-THB"),value: "฿"},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TJS"),value: "TJS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TMT"),value: "TMT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TND"),value: "TND$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TOP"),value: "TOP$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TRY"),value: "YTL "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TTD"),value: "TTD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TVD"),value: "TVD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TWD"),value: "TWD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-TZS"),value: "TZS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-UAH"),value: "UAH$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-UGX"),value: "UGX$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-USD"),value: "US$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-UYU"),value: "UYU$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-UZS"),value: "UZS$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-VEF"),value: "VEFBs "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-VND"),value: "VND$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-VUV"),value: "VUV$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-WST"),value: "WST$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XAF"),value: "XAF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XAG"),value: "XAG$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XAU"),value: "XAU$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XBT"),value: "XBT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XCD"),value: "XCD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XDR"),value: "XDR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XOF"),value: "XOF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XPD"),value: "XPD$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XPF"),value: "XPF$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-XPT"),value: "XPT$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-YER"),value: "YER$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ZAR"),value: "ZAR$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ZMW"),value: "ZMW$ "},
                    {label: bizagi.localization.getResource("formmodeler-component-editor-currency-symbol-ZWD"),value: "ZWD$ "}
                ]
            });

            // Configuracion tooltips
            data.uiCurrencySymbolValues.forEach(function(currency){
                $.extend(currency, {tooltip: currency.label});
            });

            if (typeof (data.value) === undefined || data.value === null) {
                data.value = "$";
            }

            self.inputValue = data.value;
            currencySymbolEditor = $.tmpl(self.getTemplate("frame"), data);
            currencySymbolEditor.appendTo(container);

            if (typeof self.options.value == "undefined"){
                data.uiCurrencySymbolValues[1].selected = "selected";
            }

            var currencySymbolEditorCombo = new self.uiControls.comboBox({
                uiWidthIcon: 32,
                uiEditor: self,
                uiContainer: $('.ui-control-editor', currencySymbolEditor),
                uiValues: data.uiCurrencySymbolValues,
                onChange: function (elValue, event) {
                    if (elValue != -1){
                        self.responseChangeCombo(elValue, event, self);
                    }
                }
            });
        }
    }
);
