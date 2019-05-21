/* 
* Simple Pagination Control for Bizagi Workportal
* @author: Edward J Morales
*/

(function ($) {
    $.fn.bizagiPagination = function (options) {
        // define options
        options = options || {};

        var opt = {
            limInf: 0,
            totalPages: 1,
            actualPage: 1,

            // Controllers elements
            listElement: $("ul"),
            first: '&lt;&lt;',
            firstClass: "first",
            prev: '&lt;',
            prevClass: 'prev',
            next: "&gt;",
            nextClass: "next",
            last: "&gt;&gt;",
            lastClass: "last",

            // Default class of pagination template, ui-bizagi-workportal-widget-inbox-common-pagination
            // <li {{if page==pageNumber}} class="page active" {{else}} class="page" {{/if}} data-page="${pageNumber}">
            // <span class="number">${pageNumber}</span>
            // </li>
            liClass: "bz-page",
            arrowClass: "bz-pageArrow",

            // Auto focus on selected element
            selectedFocus: true,

            // Call back methods
            clickCallBack: function () { }

        };


        if (options.actualPage > options.totalPages) {
            options.actualPage = options.totalPages;
        }

        var pagination = {
            previousPage: (opt.actualPage > 1) ? opt.actualPage - 1 : 1,
            nextPage: (opt.actualPage < opt.totalPages) ? opt.actualPage + 1 : opt.totalPages
        }

        // Extend options
        $.extend(opt, opt, options);


        function init() {
            // Count total elements
            opt.totalElements = $("li." + opt.liClass, opt.listElement).length;


            // Add control elements
            if (opt.totalPages > opt.totalElements && opt.totalElements > 1) {
                appendControlsArrows();
            }

            // Add events
            bindElements();

            // Set focus
            if (opt.selectedFocus && opt.actualPage >= opt.totalElements && opt.totalPages > opt.totalElements) {
                var firstElementValue;
                var halfDisplace = (opt.actualPage - Math.round(opt.totalElements / 2));

                if (halfDisplace < 1) {
                    firstElementValue = 1;
                } else if ((halfDisplace + opt.totalElements) > opt.totalPages) {
                    firstElementValue = (opt.totalPages - opt.totalElements);
                    firstElementValue = (firstElementValue < 1) ? 1 : firstElementValue;
                } else {
                    firstElementValue = halfDisplace;
                }

                if (opt.listElement.find("li.active").length == 0) {
                    displaceElements(firstElementValue, 1);
                }
            }
        }

        // Append control arrow to list
        function appendControlsArrows() {
            // add prev arrow
            opt.listElement.prepend("<li/>").find("li:first").addClass(opt.prevClass).data("page", pagination.previousPage).html(opt.prev);

            // add first arrow
            opt.listElement.prepend("<li/>").find("li:first").addClass(opt.arrowClass + " " + opt.firstClass).data("page", "1").html(opt.first);

            // add next arrow
            opt.listElement.append("<li/>").find("li:last").addClass(opt.nextClass).data("page", pagination.nextPage).html(opt.next);

            // add last arrow
            opt.listElement.append("<li/>").find("li:last").addClass(opt.arrowClass + " " + opt.lastClass).data("page", opt.totalPages).html(opt.last);
        }


        // Add events
        function bindElements() {
            // Click event for list element
            var options = {};
            $("li." + opt.liClass + ", li." + opt.arrowClass, opt.listElement).click(function () {
                // Next line now includes a ternary operator in order to confirm last arrow (>>) if going indeed to the last page
                options.page = ($(this).hasClass(opt.lastClass)) ? opt.totalPages : $.trim($(this).data("page") + " ");
                options.parent = $(this).parent();
                options.self = $(this);
                opt.clickCallBack(options);
            });

            bindNextArrow();
            bindPrevArrow();
        }


        // Bind for back scroll
        function bindPrevArrow() {
            $("li." + opt.prevClass, opt.listElement).hover(function () {
                back = setInterval(function () {
                    pageScroll(-1);
                }, 300);
            }, function () {
                clearInterval(back);
            });
        }

        // Bind for next scroll
        function bindNextArrow() {
            $("li." + opt.nextClass, opt.listElement).hover(function () {
                next = setInterval(function () {
                    pageScroll(1);
                }, 300);
            }, function () {
                clearInterval(next);
            });
        }

        // Change values of elements
        function pageScroll(increment) {
            // if increment its positive, execute right scroll
            // if increment its negative, execute left scroll
            increment = increment || 1;
            var displace = false;

            // Define first element value
            var firstPageValue = $("li." + opt.liClass + ":first", opt.listElement).data("page");
            var lastPageValue = $("li." + opt.liClass + ":last", opt.listElement).data("page");


            // Check left scroll - decrement
            if (increment < 0 && firstPageValue > 1) {
                displace = true;
            } else if (increment > 0 && lastPageValue < opt.totalPages) {
                displace = true;
            }

            if (displace) {
                displaceElements(firstPageValue, increment);
            }
        }

        // Displace elements
        function displaceElements(firstElementValue, increment) {
            firstElementValue = firstElementValue || 1;
            increment = increment || 0;
            var pageData;

            if (increment > 0) {
                // Increment                
                pageData = firstElementValue;
            } else if (increment < 0) {
                // Decrement  
                pageData = firstElementValue - 2;
            } else {
                return;
            }

            $.each($("li." + opt.liClass, opt.listElement), function (key, value) {
                pageData++;
                $(this).data("page", pageData);
                $(this).find("span").html(pageData);
                // Changes the attribute content of data-page with the current number pageData
                $(this).attr("data-page", pageData);
                // Check if selected style
                if (opt.actualPage == pageData && !$(this).hasClass("active")) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });

            // Show or hide tooltip pagination
            if ($(opt.listElement).find(".active").length == 1) {
                $(opt.listElement).parent().find("#tooltipPagination").css("visibility", "hidden");
            } else {
                $(opt.listElement).parent().find("#tooltipPagination").css("visibility", "visible");
            }
        }

        // Init plugin
        init();
    };
})(jQuery);



