/**
 * Created by Ricardo Alirio Perez Diaz, Andres Felipe Arenas Vargas on 9/9/2015.
 */
(function($) {
    $.fn.simpleGrid = function (bizagiWidget, options) {

        //---------------------------------------------------------
        // Initial config
        //---------------------------------------------------------

        if (typeof bizagiWidget === 'undefined') {
            throw "Debe pasar como parametro el widget de bizagi, para la carga del template";
        }
        var self = this;
        var settings = $.extend({
            allowAdd: false,
            allowEdit: false,
            allowDelete: false,
            displayName: '',
            dateFormat: bizagi.localization.getResource("dateFormat"),
            filters: [],
            maxPageToShow: 5,
            orderType: 'ASC',
            orderField : '',
            page : 1,
            pageSize: 10,
            onDataBinding: function () {},
            onLoadFilter: function () {},
            onAdd: function () {},
            onEdit: function () {},
            getResource: function () {}
        }, options);
        self.grid = {
            internalData: {}
        };

        var simpleGrid = {
            render: renderGrid
        };

        //---------------------------------------------------------
        // Constructor
        //---------------------------------------------------------

        (function (){
            self.initialized = bizagiWidget.loadTemplates({
                "bizagi.simpleGrid.wrapper": bizagi.getTemplate("bizagi.simpleGrid").concat("#ui-bizagi-widget-simple-grid"),
                "bizagi.simpleGrid.content": bizagi.getTemplate("bizagi.simpleGrid").concat("#ui-bizagi-widget-simple-grid-content"),
                "bizagi.simpleGrid.paginator": bizagi.getTemplate("bizagi.simpleGrid").concat("#ui-bizagi-widget-simple-grid-paginator"),
                "filter-wrapper": bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets").concat("#column-filter-wrapper"),
                "filter-string": bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets").concat("#column-filter-control-string"),
                "filter-number": bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets").concat("#column-filter-control-number"),
                "filter-date": bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets").concat("#column-filter-control-date"),
                "filter-boolean": bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets").concat("#column-filter-control-boolean"),
                useNewEngine: false
            }).then(function () {
                self.panelWrapper = bizagiWidget.getTemplate("bizagi.simpleGrid.wrapper");
                self.panelContent = bizagiWidget.getTemplate("bizagi.simpleGrid.content");
                self.panelPaginator = bizagiWidget.getTemplate("bizagi.simpleGrid.paginator");
            });
        })();

        //---------------------------------------------------------
        // Methods
        //---------------------------------------------------------

        /**
         *
         */
        function renderGrid() {
            self.empty();
            $.when(self.initialized).done(function () {
                var params = [{
                    pag: settings.page,
                    pagSize: settings.pageSize,
                    orderType: settings.orderType,
                    orderField: settings.orderField,
                    filters: mapFilters(settings.filters)
                }];
                var numRequest = self.data("numRequest");
                self.data("numRequest", numRequest ? numRequest+=1 : 1);
                numRequest = self.data("numRequest");

                $.when(settings.onDataBinding.apply(self.get(0), params)).done($.proxy(function(data){
                    if(numRequest === self.data("numRequest")){
                        //Add grid wrapper
                        self.append($.tmpl(self.panelWrapper));
                        //keep in track the total records and pages
                        self.grid.totalRecords = data.records;
                        self.grid.totalPages = data.total;
                        showRowsEntity(data);
                        if (data.records > settings.pageSize) {
                            self.grid.page = data.page;
                            renderPagintation();
                        }
                    }

                }, numRequest));
            });
        }

        function mapFilters(filters){
            var auxFilters = Object.keys(filters).map(function (key) {
                return filters[key];
            });

            return auxFilters.filter(function(filterObject){
                if(filterObject.key === "is-null" || (filterObject.key !== "is-null" && typeof filterObject.value !== "undefined" && filterObject.value !== null ) ){
                    return true;
                }
            });
        }

        /**
         *
         * @param data
         */
        function showRowsEntity(data) {
            var $resultTableContent = $(".ui-bizagi-simple-grid-wrapper", self).html(
                $.tmpl(self.panelContent, {
                    displayName: settings.displayName,
                    headers: data.header,
                    rows: data.row,
                    orderType: settings.orderType,
                    orderField: settings.orderField,
                    guidForms: data.entity,
                    allowAdd: settings.allowAdd,
                    allowEdit: settings.allowEdit,
                    allowDelete: settings.allowDelete,
                    filterApplied: settings.filters,
                    attributeSupportFilter: attributeSupportFilter,
                    attributeSupportOrder:attributeSupportOrder
                }));

            formatTableEntity($resultTableContent);
            setFilters($resultTableContent, data.header);
        }
        /**
         *
         */
        function renderPagintation() {
            var pageToshow = (settings.maxPageToShow > self.grid.totalPages) ?  self.grid.totalPages : settings.maxPageToShow;
            var summaryWrapper = $(".bz-rn-grid-footer-pagination", self);
            var pagerData = {
                pagination: (self.grid.totalPages > 1),
                page: self.grid.page,
                pages: {}
            };

            for (var i = 1; i <= pageToshow; i++) {
                pagerData["pages"][i] = {
                    "pageNumber": i
                };
            }
            //load and append the paginator to the result table
            summaryWrapper.append($.tmpl(self.panelPaginator, pagerData));
            //add data and behaviour to pager
            $("ul#bz-widget-simple-grid-pager-wrapper", self).bizagiPagination({
                totalPages: self.grid.totalPages,
                actualPage: self.grid.page,
                listElement: $("#biz-wp-table-pager-wrapper"),
                clickCallBack: function (options) {
                    settings.page = options.page;
                    renderGrid();
                }
            });
        }
        /**
         * format colums of the table
         * @param $resultTableContent
         */
        function formatTableEntity($resultTableContent) {
            var bigIntHeaders = $("a[data-type='1']", $resultTableContent);
            var intHeaders = $("a[data-type='2'][data-attributeType='2']", $resultTableContent);
            var smallIntHeaders = $("a[data-type='3']", $resultTableContent);
            //var fileHeaders = $("a[data-type='4']", $resultTableContent);
            var tinyIntHeaders = $("a[data-type='4']", $resultTableContent);
            var booleanHeaders = $("a[data-type='5']", $resultTableContent);
            var decimalHeaders = $("a[data-type='6']", $resultTableContent);
            var numericHeaders = $("a[data-type='7']", $resultTableContent);
            var moneyHeaders = $("a[data-type='8']", $resultTableContent);
            var floatHeaders = $("a[data-type='10']", $resultTableContent);
            var realHeaders = $("a[data-type='11']", $resultTableContent);
            var dateTimeHeaders = $("a[data-type='12']", $resultTableContent);
            var scientificNotationHeaders = $("a[data-type='29']", $resultTableContent);
            var userLocalization = (typeof (bizagi.currentUser.symbol) != "undefined") ? bizagi.currentUser : settings.getResource("numericFormat");
            var userLocalizationCloned = bizagi.clone(userLocalization);
            userLocalizationCloned.decimalDigits = 0;

            //
            $.each(dateTimeHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")").find("span:contains(':')").addClass("formatDate");
                }
            });
            bizagi.util.formatInvariantDate($resultTableContent, settings.dateFormat);
            //
            $.each(moneyHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    var allowDecimals = item.getAttribute("data-allowdecimals") ? bizagi.util.parseBoolean(item.getAttribute("data-allowdecimals")) : true;
                    item.setAttribute("data-allowdecimals", allowDecimals);
                    $column.find("span").addClass("formatMoney");
                    var formatNumber = getFormatNumber(item, userLocalizationCloned);
                    var showSymbol = bizagi.util.parseBoolean(item.getAttribute('data-showsymbol'));

                    //If showSymbol is undefined, show symbol by default
                    if(showSymbol === null || showSymbol){
                        formatNumber.symbol = (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.symbol : userLocalizationCloned.symbol);
                    }
                    else{
                        formatNumber.symbol = "";
                    }

                    bizagi.util.formatInvariantMoney($column, formatNumber);
                }
            });
            //
            $.each(floatHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    var allowDecimals = item.getAttribute("data-allowdecimals") ? bizagi.util.parseBoolean(item.getAttribute("data-allowdecimals")) : true;
                    item.setAttribute("data-allowdecimals", allowDecimals);
                    $column.find("span").addClass("formatMoney");
                    var formatNumber = getFormatNumber(item, userLocalizationCloned);
                    if(formatNumber.allowDecimals && formatNumber.decimalDigits === 0){
                        //extract from render\bizagi.rendering.number.js
                        formatNumber.decimalDigits = (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2);
                    }
                    bizagi.util.formatInvariantNumber($column, formatNumber);
                }
            });
            //
            $.each(decimalHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(realHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    var formatNumber = getFormatNumber(item, userLocalizationCloned);
                    if(formatNumber.allowDecimals && formatNumber.decimalDigits === 0){
                        //extract from render\bizagi.rendering.number.js
                        formatNumber.decimalDigits = (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2);
                    }
                    bizagi.util.formatInvariantNumber($column, formatNumber);
                }
            });
            $.each(bigIntHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(intHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(smallIntHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(tinyIntHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(numericHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var $column = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")");
                    $column.find("span").addClass("formatMoney");
                    bizagi.util.formatInvariantNumber($column, getFormatNumber(item, userLocalizationCloned));
                }
            });
            //
            $.each(booleanHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var valuesBoolean = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")").find("span");
                    if (index > 0)
                        $.each(valuesBoolean, function (j, itemBoolean) {
                            var contentBoolean = $.trim($(itemBoolean).text()).toLowerCase();
                            if (contentBoolean === 'true' || contentBoolean === '1') {
                                $(itemBoolean).text('X');
                            }

                            if (contentBoolean === 'false' || contentBoolean === '0') {
                                $(itemBoolean).text('');
                            }
                        });
                }
            });
            //
            $.each(scientificNotationHeaders, function (i, item) {
                if ($(item).parent().css('display') != 'none') {
                    var index = Number(item.getAttribute('data-index'));
                    var oracleNumberList = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + index + ")").find("span");
                    $.each(oracleNumberList, function (j, numberItem) {
                        var number = $.trim($(numberItem).text());
                        $(numberItem).text(bizagi.util.scientificNotationFormat(number));
                    });
                }
            });

            /*if (fileHeaders.length > 0) {
                for (var i = 0; i < fileHeaders.length; i++) {
                    var indexFile = Number($(fileHeaders[i]).attr('data-index'));
                    var valuesFile = $(".ui-bizagi-grid-table tr", $resultTableContent).find("td:eq(" + indexFile + ")").find("span");
                    $.each(valuesFile, function (j, itemFile) {
                        var val = $(itemFile).text();
                        if (val === "true" || val === "false") {
                            $(itemFile).text('...');
                        }
                    });
                }
            }*/
            //hide de first column if the user created display form
            if ($("a[data-type='-11']").length > 0) {
                $('.admin-entities-rightframe #detailEntity table.ui-bizagi-grid-table td:nth-child(1)').css('display', 'none');
                $('.admin-entities-rightframe #detailEntity table.ui-bizagi-grid-table th:nth-child(1)').css('display', 'none');
            }
            configureHandlers($resultTableContent);
        }
        /**
         * Apply filter's plugin to headers in the table
         * @param $resultTableContent
         * @param headers
         */
        function setFilters($resultTableContent, headers) {
            var filters = settings.filters;
            var $columnFilters = $resultTableContent.find('.ui-bizagi-grid-header .ui-bizagi-render-icon-filter');

            $.each($columnFilters, function (_, element) {
                var $element = $(element),
                    $parent = $element.parent(),
                    index = $element.data('index'),
                    header = headers[index];

                if (attributeSupportFilter(header)) {
                    (function (header) {
                        var fieldValue = header.fieldValue;

                        //
                        $element.bizagi_filters({
                            type: header.dataType,
                            attributeType: header.attributeType,
                            parent: $parent,
                            templates: {
                                filterWrapper: bizagiWidget.getTemplate("filter-wrapper"),
                                filterString: bizagiWidget.getTemplate("filter-string"),
                                filterNumber: bizagiWidget.getTemplate("filter-number"),
                                filterDate: bizagiWidget.getTemplate("filter-date"),
                                filterBoolean: bizagiWidget.getTemplate("filter-boolean")
                            },
                            data: filters[fieldValue],
                            entity: header.relatedEntity,
                            dataService: {
                                getAdminEntityData: function (params) {
                                    return $.when(self.grid.internalData[fieldValue] || settings.onLoadFilter.apply(settings, new Array($.extend(params, {type: "Entity"}))))
                                        .then(function (entityData) {
                                            self.grid.internalData[fieldValue] = entityData;
                                            return entityData;
                                        });
                                }
                            }
                        });
                        //
                        $element.on('bizagi_filterschange', function (ev, value) {
                            if ($.isEmptyObject(value)) {
                                delete filters[fieldValue];
                            }
                            else {
                                value.dataType = header.dataType;
                                value.field = fieldValue;
                                if (typeof header.entity !== "undefined") {
                                    value.entity = header.entity;
                                }
                                filters[fieldValue] = value;
                            }
                            renderGrid();
                        });
                        // Change the icon when there is a filter applied
                        if (filters[fieldValue]) {
                            $element.addClass('ui-bizagi-column-filter-applied');
                        }
                    })(header);
                }
            });
        }
        /**
         * Manage button edit row entities or add row
         * @param $resultTableContent
         */
        function configureHandlers($resultTableContent) {
            // Sort entities listener
            $(".link-order-entity", $resultTableContent).click(function () {
                settings.orderField = $(this).attr('data-columnOrderField');
                settings.orderType = $(this).attr('data-orderType');
                renderGrid();
            });
            //Select entity listener
            $(".ui-bizagi-grid-body tr", $resultTableContent).click(function () {
                if ($(this).attr('class') === 'ui-bizagi-state-selected') {
                    $(this).removeClass('ui-bizagi-state-selected');
                    self.elementSelected = null;
                }
                else {
                    $('.ui-bizagi-grid-body tr', $resultTableContent).removeClass('ui-bizagi-state-selected');
                    $(this).addClass('ui-bizagi-state-selected');
                    self.elementSelected = this;
                }
            });
            //Add entity btn listener
            $("#addRowEntity", $resultTableContent).click(function (e) {
                settings.onAdd.apply(this, new Array(e, {context: self.get(0)}));
            });
            //Edit entity btn listener
            $("#editRowEntity", $resultTableContent).click(function (e) {
                if (self.elementSelected == null) {
                    bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
                }
                else {
                    settings.onEdit.apply(this,  new Array(e, self.elementSelected));
                    $('.ui-bizagi-grid-body tr', $resultTableContent).removeClass('ui-bizagi-state-selected');
                    self.elementSelected = null;
                }
            });
            //Delete entity btn listener
            $("#deleteRowEntity", $resultTableContent).click(function (e) {
                if (self.elementSelected == null) {
                    bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
                }
                else {
                    settings.onDelete.apply(this,  new Array(e, self.elementSelected));
                    $('.ui-bizagi-grid-body tr', $resultTableContent).removeClass('ui-bizagi-state-selected');
                    self.elementSelected = null;
                }
            });
        }
        /**
         * Returns true if the attribute support filter
         * images and files aren't supported
         * @param header
         * @return {boolean}
         */
        function attributeSupportFilter(header) {
            var attributeType = header.attributeType;
            var datatype = header.dataType;
            var xpath = header.xpath || "";

            if(header.masterEntity){
                return false;
            }
            if (datatype < 0) {
                return false;
            }
            // If xpath has multiples levels then ignore filters
            if (xpath.indexOf(".") > -1) {
                return false;
            }
            if (attributeType == 1003) {
                return false;
            }
            if (attributeType == 1002) {
                return false;
            }
            if (attributeType == 1004) {
                return false;
            }
            // If its paramatric entity
            if (attributeType == 1005) {
                return false;
            }
            return true;
        }

        /**
        * Check if header support order
        * In order to extend
        * @param header
        * @return {*}
        */
        function attributeSupportOrder(header) {
            var attributeType = header.attributeType,
                datatype = header.dataType,
                xpath = header.xpath || "";

            if (datatype < 0) {
                return false;
            }

            // If xpath has multiples levels then ignore filters
            if (xpath.indexOf(".") > -1) {
                return false;
            }

            if (attributeType == 1003) {
                return false;
            }

            if (attributeType == 1002) {
                return false;
            }

            return true;
        }

        /**
         * Format grid numbers
         */
        function getFormatNumber($item, userLocalizationCloned){
            var auxNumberFormat = {
                decimalDigits: 0,
                decimalSeparator: userLocalizationCloned.decimalSeparator,
            };

            var allowdecimals = $item.getAttribute('data-allowdecimals') || false;
            var numDecimals = $item.getAttribute('data-numdecimals') || 0;
            var percentage = $item.getAttribute('data-percentage') || false;
            var thousands = $item.getAttribute('data-thousands') || true;
            allowdecimals = bizagi.util.parseBoolean(allowdecimals);
            thousands = bizagi.util.parseBoolean(thousands);
            auxNumberFormat.allowDecimals = allowdecimals;
            auxNumberFormat.decimalDigits = numDecimals;
            auxNumberFormat.thousands = thousands;
            auxNumberFormat.groupSeparator = thousands ? userLocalizationCloned.groupSeparator : "";
            auxNumberFormat.percentage = percentage;

            return auxNumberFormat;
        }

        return simpleGrid;
    }
})(jQuery);
