/* 
 * Simple Pagination Control for Bizagi Mobile
 * @author: Richar Urbano <Richar.Urbano@Bizagi.com>
 */

(function ($) {
    $.fn.mobilePagination = function (options) {
        // define options
        options = options || {};

        var defaultOptions = {
            firstPage: 1,
            totalPages: 1,
            actualPage: 1,
            pages: [],

            // Controllers elements
            listElement: $("ul"),
            first: '<spaz class="bz-mo-icon bz-grid-backwards-fast"></span>',
            firstClass: "first",
            previous: '<spaz class="bz-mo-icon bz-grid-backwards"></span>',
            previousClass: 'previous',
            next: '<spaz class="bz-mo-icon bz-grid-forward"></span>',
            nextClass: "next",
            last: '<spaz class="bz-mo-icon bz-grid-forward-fast"></span>',
            lastClass: "last",
            liClass: "bz-page",
            arrowClass: "bz-page-arrow",

            // Call back methods
            clickCallBack: function () { }

        };

        if (options.actualPage > options.totalPages) {
            options.actualPage = options.totalPages;
        }

        // Extend options
        $.extend(defaultOptions, defaultOptions, options);

        var pagination = {
            previousPage: (defaultOptions.actualPage > 1) ? defaultOptions.actualPage - 1 : 1,
            nextPage: (defaultOptions.actualPage < defaultOptions.totalPages) ? defaultOptions.actualPage + 1 : defaultOptions.totalPages
        };

        // Modalview template
        var modalTemplate = "<div data-role='modalview' class='bz-rn-modal-pagination' style='width: 50%; height: 65%;'>" +
            "	<div data-role='header' class='bz-rn-modal-pagination-header'>" +
            "		<div class='bz-rn-modal-pagination-header-navigation' data-role='navbar'>" +
            "			<div class='bz-rn-modal-pagination-header-title'>" +
            "				<span class='bz-rn-modal-pagination-header-title-text'>#=data.title#</span>" +
            "				<span class='bz-rn-modal-pagination-header-title-cancel bz-mo-icon bz-cancel'></span>" +
            "			</div>" +
            "			<div class='bz-rn-modal-pagination-header-search'>" +
            "				<input class='bz-rn-modal-pagination-header-filter' type='text' placeholder='Type page...' />" +
            "				<span class='bz-rn-modal-pagination-header-filter-search bz-mo-icon bz-search'></span>" +
            "				<span class='bz-rn-modal-pagination-header-filter-cancel bz-mo-icon bz-circle-cross-full'></span>" +
            "			</div>" +
            "		</div>" +
            "	</div>" +
            "	<div class='bz-rn-modal-pagination-content'>" +
            "		<ul class='bz-rn-modal-pagination-content-list'>" +
            "			# $.each (data.list, function (i, item) { #" +
            "			<li class='bz-rn-modal-pagination-content-list-item' data-page='#= item.id #'>#= item.value #</li>" +
            "			# }) #" +
            "		</ul>" +
            "	</div>" +
            "	<div data-role='footer' class='bz-rn-modal-pagination-footer'>" +
            "		<div class='bz-rn-modal-pagination-footer-navigation' data-role='navbar'>" +
            "			<a class='bz-rn-modal-pagination-footer-action' data-align='right' data-role='button'>#=data.action#</a>" +
            "		</div>" +
            "	</div>" +
            "</div>";

        /**
         * init
         * @returns {} 
         */
        function init() {
            // Add control elements
            if (defaultOptions.totalPages && defaultOptions.totalPages > 1) {

                defaultOptions.pages = [];
                for (var i = 1; i <= defaultOptions.totalPages; i++) {
                    defaultOptions.pages.push({
                        id: i,
                        value: i,
                        active: (i === defaultOptions.actualPage)
                    });
                }

                renderControlsArrows();

                // Add events
                attachEvents();
            }
        }

        /**
         * Append control arrow to list
         * @returns {} 
         */
        function renderControlsArrows() {
            // add prev arrow
            defaultOptions.listElement.prepend("<li/>").find("li:first")
                .addClass(defaultOptions.arrowClass + " " + defaultOptions.previousClass)
                .data("page", pagination.previousPage)
                .html(defaultOptions.previous);

            // add first arrow
            defaultOptions.listElement.prepend("<li/>").find("li:first")
                .addClass(defaultOptions.arrowClass + " " + defaultOptions.firstClass)
                .data("page", defaultOptions.firstPage)
                .html(defaultOptions.first);

            // add next arrow
            defaultOptions.listElement.append("<li/>").find("li:last")
                .addClass(defaultOptions.arrowClass + " " + defaultOptions.nextClass)
                .data("page", pagination.nextPage)
                .html(defaultOptions.next);

            // add last arrow
            defaultOptions.listElement.append("<li/>").find("li:last")
                .addClass(defaultOptions.arrowClass + " " + defaultOptions.lastClass)
                .data("page", defaultOptions.totalPages)
                .html(defaultOptions.last);
        }

        /**
         * Add events
         * @returns {} 
         */
        function attachEvents() {
            // Click event for list element            
            $("li." + defaultOptions.arrowClass, defaultOptions.listElement).click(function () {
                var page = ($(this).hasClass(defaultOptions.lastClass)) ? defaultOptions.totalPages : Number($(this).data("page"));

                defaultOptions.clickCallBack({ page: page });
            });

            // Show popup pager
            $("li.active .bz-page-index", defaultOptions.listElement).click(function () {
                showModalPage();
            });
        }

        /**
         * show modalview with pages
         * @returns {} 
         */
        function showModalPage() {
            //var title = bizagi.localization.getResource("text-cancel");
            var title = "Go to page";
            var placeholder = "Type page...";
            var action = "GO";

            var modalPagerTemplate = kendo.template(modalTemplate, { useWithBlock: false });
            var modalPager = $(modalPagerTemplate({ list: defaultOptions.pages, title: title, placeholder: placeholder, action: action }).trim());

            modalPager.kendoMobileModalView({
                close: function() {
                    this.destroy();
                    this.element.remove();
                },
                useNativeScrolling: true,
                modal: false
            });

            attachModalHandlers(modalPager);

            // Add arrow on modal
            modalPager.closest(".km-modalview-wrapper")
                .addClass("bz-rn-modal-pagination-position")
                .addClass("bz-rn-modal-pagination-container");

            modalPager.kendoMobileModalView("open");
        }

        /**
         * Attach events to modalview
         * @param {} modalContainer 
         * @returns {} 
         */
        function attachModalHandlers(modalContainer) {

            var listItems = modalContainer.find(".bz-rn-modal-pagination-content-list li");
            var modalListContainer = modalContainer.find(".bz-rn-modal-pagination-content-list");

            // Close modalview
            modalContainer.on("click", ".bz-rn-modal-pagination-header-title-cancel", function () {
                modalContainer.kendoMobileModalView("close");
            });

            // Change to page selected
            modalContainer.on("click", ".bz-rn-modal-pagination-footer-action", function () {
                var itemSelected = modalListContainer.find(".bz-rn-modal-pagination-content-list-item-selected");

                if (itemSelected && itemSelected.length > 0) {
                    var page = Number(itemSelected.data("page"));

                    modalContainer.kendoMobileModalView("close");
                    defaultOptions.clickCallBack({ page: page });
                }
            });

            // Filtering list
            modalContainer.find(".bz-rn-modal-pagination-header-filter").keyup(function (event) {
                var that = this;

                if (event.which === 13) {
                    search({ container: modalContainer, list: listItems, query: that.value, force: true });
                } else {
                    if (that.timeout)
                        clearTimeout(that.timeout);

                    that.timeout = setTimeout(function () {
                        search({ container: modalContainer, list: listItems, query: that.value });
                    }, 300);
                }
            });

            // Cleaning list
            modalContainer.find(".bz-rn-modal-pagination-header-filter-cancel").on("click", function () {
                search({ container: modalContainer, list: listItems, query: "", force: true });
                modalContainer.find(".bz-rn-modal-pagination-header-filter").val("");
            });

            // List Selectable
            modalListContainer.on("click", "li", function () {
                var that = this;

                modalListContainer
                    .find(".bz-rn-modal-pagination-content-list-item-selected")
                    .removeClass("bz-rn-modal-pagination-content-list-item-selected");

                $(that).addClass("bz-rn-modal-pagination-content-list-item-selected");
            });
        }

        /**
         * filter pages
         * @param {} params 
         * @returns {} 
         */
        function search(params) {
            var self = this;
            var container = params.container;
            var list = params.list;

            if (params.query === self.lastProcessedValue && !params.force) {
                return;
            }

            self.lastProcessedValue = params.query;

            if (params.query !== "") {
                if (container.find(".bz-rn-modal-pagination-header-filter-cancel").css("display") === "none")
                    container.find(".bz-rn-modal-pagination-header-filter-cancel").show(500);
            } else {
                container.find(".bz-rn-modal-pagination-header-filter-cancel").hide(500);
            }

            // List filter
            var filter = new RegExp(params.query, "i");
            list.filter(function () {
                var that = this;
                if (filter.test($(that).text())) {
                    return $(that);
                } else {
                    $(that).hide();
                }
            }).show();
        }

        // Init plugin
        init();
    };
})(jQuery);

