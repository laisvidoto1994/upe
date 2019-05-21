/*
* jQuery BizAgi Render User Field Implementations 
* NOTE: THIS IS A DEMO TEST, THIS CODE MUST BE GENERATED FROM THE DB
*
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.userfield.js
*/

(function ($) {

    /* 
    *  Hello world user field
    */
    $.ui.userFieldRender.subclass('ui.helloWorldUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Creates control
            var label = $('<label> HELLO WORLD!!!! </label>')
                        .appendTo(control);
        }
    });

    /* 
    *  Image
    */
    $.ui.userFieldRender.subclass('ui.imageUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Creates control
            var img = $('<img  src="/BizAgiJQuery2/defaultImages/Penguins.jpg" width="200" height="200" />')
                        .appendTo(control);
        }
    });

    /* 
    *  Parameterized Image
    */
    $.ui.userFieldRender.subclass('ui.parameterizedImageUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Creates control
            var img = $('<img  src="/BizAgiJQuery2/defaultImages/' + properties.parameters.imageName + '" width="200" height="200" />')
                        .appendTo(control);
        }
    });

    /* 
    *  Color label
    */
    $.ui.userFieldRender.subclass('ui.colorInputUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            /* <USER FIELD CODE>*/
            // Creates control
            self.colorInput = $('<input type="text" />')
                        .appendTo(control);

            // Set style
            self.colorInput.css("color", properties.parameters.color);

            // Attach change event
            self.colorInput.bind("change", function () {
                // Updates internal value
                self._setInternalValue($(this).val());
            });

            /* </USER FIELD CODE>*/
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            /* <USER FIELD CODE>*/
            // Set value in input
            if (value != undefined && properties.editable) {
                var self = this;
                self.colorInput.val(value);
            }
            /* </USER FIELD CODE>*/
        }

    });

    /* 
    AMORTIZATION USER FIELD
    */
    $.ui.userFieldRender.subclass('ui.amortizationUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Make control to behave as a block container
            self.control.addClass("ui-bizagi-render-display-block");

            // Creates control
            var table = $('<table border="1" class="ui-widget">')
                        .append('<thead  class="ui-widget-header">' +
                                '<tr><td colspan=5></td></tr>' +
                                '<tr><td>Payment</td> <td>Value Payment</td> <td>Interests</td> <td>Capital</td> <td>Balance</td></tr>' +
                                '</thead>' +
                                '<tbody class="ui-widget-content"></tbody>')
                        .width("100%")
                        .appendTo(control);

            var iMonthlyRate = (properties.parameters.rate / 100) / 12;
            var iPayment = 1;
            var iBalance = properties.parameters.amount;
            var temp = iPayment;

            while (iBalance > 0 && iPayment < 40) {
                var iInterest = iBalance * iMonthlyRate;
                var iCapital = properties.parameters.payment - iInterest;
                iBalance = iBalance - iCapital;
                if (iBalance < 0) {
                    iBalance = 0;
                }

                $("tbody", table).append('<tr><td>' + iPayment +
                                         '</td><td>' + properties.parameters.payment.toFixed(2) +
                                         '</td><td>' + iInterest.toFixed(2) +
                                         '</td><td>' + iCapital.toFixed(2) +
                                         '</td><td>' + iBalance.toFixed(2) +
                                         '</td></tr>')
                iPayment++;
            }
        }
    });

    /* 
    PRODUCT LIST FIELD
    */
    $.ui.userFieldRender.subclass('ui.productListUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
                properties = self.options.properties,
                control = self.control;

            // Make control to behave as a block container
            self.control.addClass("ui-bizagi-render-display-block");

            // Creates control
            var table = $('<table border="1" class="ui-widget">')
                            .append('<thead  class="ui-widget-header">' +
                                    '<tr><td>Product ID</td> <td>Name</td> <td>Price</td> </tr>' +
                                    '</thead>' +
                                    '<tbody class="ui-widget-content"></tbody>')
                            .width("100%")
                            .appendTo(control);

            $.each(properties.value, function (i) {
                var item = properties.value[i];


                $("tbody", table).append('<tr><td>' + item.id +
                                             '</td><td>' + item.nombre +
                                             '</td><td>' + item.valor +
                                             '</td></tr>');
            });
        }
    });


    /* 
    PIE USER FIELD
    */
    $.ui.userFieldRender.subclass('ui.pieUserFieldRender', {

        /* Renders the control*/
        _render: function () {
            var self = this,
                properties = self.options.properties,
                control = self.control;

            // Make control to behave as a block container
            self.control.addClass("ui-bizagi-render-display-block");

            $.jqplot.config.enablePlugins = true;
            self.getXPath(properties.xpath, function (data) {

                var transformedData = [];
                $.each(data, function (i) {
                    transformedData.push([data[i].Name, data[i].Sales, data[i].Id]);
                });

                // Create containers
                var divPie = $('<div id="divPie" class="basUserFieldPieChart"></div>')
                            .appendTo(self.control);
                var table = $('<table border="1" class="ui-widget basUserFieldPieChartDetail" >')
                            .appendTo(self.control);

                // ONLY CAN DRAW CHARTS WHEN ELEMENT IS VISIBLE
                self.pieDrew = false;

              if (self.element.parents(".ui-bizagi-container-tab").length > 0) {
                    var tabContainer = self.element.parents(".ui-bizagi-container-tabContainer:first");
                    var tab = self.element.parents(".ui-bizagi-container-tab:first");

                    tabContainer.bind("tabsshow", function (event, ui) {
                        if ($(ui.panel).attr("id") == tab.attr("id")) {
                            drawPie();
                        }
                    });
                }

                drawPie = function () {
                    if (self.pieDrew) return;
                    self.pieDrew = true;

                    // Uses the chart plugin
                    var plot = $.jqplot('divPie', [transformedData], {
                        seriesDefaults: { renderer: $.jqplot.PieRenderer, trendline: { show: true} },
                        legend: { show: true }
                    });

                    // Bind slice click element
                    divPie.bind('jqplotDataClick', function (e, gridpos, datapos, neighbor) {
                        var region = neighbor[2];

                        // Get xpath for selected region
                        self.getXPath(properties.xpath + "[id=" + region + "].details", function (data) {

                            // Draw headers
                            table.empty()
                                .append('<thead  class="ui-widget-header">' +
                                        '<tr><td>Product ID</td> <td>Name</td> <td>Quantity</td> </tr>' +
                                        '</thead>' +
                                        '<tbody class="ui-widget-content"></tbody>')
                                .width("40%");

                            // Draw table rows
                            $.each(data, function (i) {
                                var item = data[i];


                                $("tbody", table).append('<tr><td>' + item.Id +
                                             '</td><td>' + item.Name +
                                             '</td><td>' + item.Sales +
                                             '</td></tr>');
                            });
                        });
                    });
                };
            });
        }
    });

    /* Hashtable to determine the subclass to use based on the user field id*/
    $.bizAgiUserFields = [];
    $.bizAgiUserFields[10001] = 'helloWorldUserFieldRender';
    $.bizAgiUserFields[10002] = 'imageUserFieldRender';
    $.bizAgiUserFields[10003] = 'parameterizedImageUserFieldRender';
    $.bizAgiUserFields[10004] = 'colorInputUserFieldRender';
    $.bizAgiUserFields[10005] = 'amortizationUserFieldRender';
    $.bizAgiUserFields[10006] = 'productListUserFieldRender';
    $.bizAgiUserFields[10007] = 'pieUserFieldRender';

})(jQuery);