/**
 * Name:
 *   Author: Bizagi Mobile team
 *   Comments:
 * Structure to applicate plugin
 *  <div class="bz-bizagi-container-tap-popup"> //container
    <div class="cell bz-container-items-tabs"> // represent item of tab
    <span >${displayName}</span>// the first span always is the title                                    
    <span> ........</span> // after the span can place the items you want
    <div> .........</div> // etc
    </div> <!-- end cell-->
    </div><!-- end bz-bizagi-container-tap-popup-->
**/
(function ($) {
    $.fn.bztabs = function (params) {

        var self = $(this);

        params = params || {};
        params.activeTab = params.activeTab || 0;
        params.tabNumber = params.tabNumber || 1;


        var activate = (params.activate && typeof params.activate === "function") ? params.activate : function () { };
        var beforeActivate = (params.beforeActivate && typeof params.beforeActivate === "function") ? params.beforeActivate : function () { };

        // PopUp control
        var popUp = self.find(">div.bz-bizagi-container-tap-popup").hide();
        // Depending on tabNumber a percentage will be in the width of each tab
        var tabCountPopup = popUp.children().length;
        // Base to build the header of tabs
        var tabHeader = $("<div class='bz-header_select'></div>");

        var tabCountReal = (params.tabNumber > tabCountPopup) ? tabCountPopup : params.tabNumber;

        // round down
        var widthRow = Math.floor(100 / Number(tabCountReal));

        // Duplicate the tabs to create the header
        popUp.children().each(function (i, item) {
            tabHeader.append(
                "<div class='bz-wp-tabs-ui bz-wp-tabs-item' data-index='" + i + "' data-reference-tab='" +
                item.getAttribute("data-reference-tab") + "'><span>" +
                item.textContent + "</span></div>");
        });

        tabHeader.find("> .bz-wp-tabs-ui").css("width", widthRow + "%");        
        tabHeader.append("<div class='bz-wp-tabs-arrow-container'><div class='bz-cm-icon bz-mo-icon bz-plus'></div></div>");

        self.prepend(tabHeader);

        var tabCurrent = self.find("> .bz-bizagi-container-tap-popup > .bz-container-items-tabs").eq(params.activeTab);
        var itemCurrent = $($(tabCurrent).data("reference-tab"), self);

        itemCurrent.addClass("childrenActive");
        tabCurrent.addClass("tabSelected");

        // Mark the selected tab in the header
        var activeTab = $(".bz-wp-tabs-ui:nth-child(" + (params.activeTab + 1) + ")", tabHeader).addClass("tabSelected");

        // The new width will be added to the tabSelected in order to complete the 100% on tabs
        var widthTabSelected = widthRow + (100 - (widthRow * tabCountReal));
        activeTab.css("width", widthTabSelected + "%");

        function updateTabSize() {
            if (params.tabNumber < tabCountPopup) {
                // Select the current tab
                $(".bz-wp-tabs-arrow-container", self).first().addClass("show-pluss");
                tabHeader.addClass("show-pluss");
                activeTab.trigger("click", { origin: "popUp" });
            } else {
                $(".bz-wp-tabs-arrow-container", self).removeClass("show-pluss");
                tabHeader.removeClass("show-pluss");
                tabHeader.find("> .bz-wp-tabs-ui:last").addClass("bz-wp-no-border");
            }
        }

        // Reorder tabs
        function reorderTabs(dataRef) {

            var tempTabs = tabHeader.find(".bz-wp-tabs-ui");
            var moveAtTheEnd = true;

            tempTabs.each(function (i, item) {
                if (dataRef !== item.getAttribute("data-reference-tab") && moveAtTheEnd) {
                    tabHeader.remove("[data-reference-tab='" + dataRef + "']");
                    tabHeader.append(item);
                } else {
                    moveAtTheEnd = false;
                }
            });
        }

        // Change tabs
        function changeTab(e, params) {

            params = params || {};
            params.origin = params.origin || "header";

            e.stopPropagation();
            e.preventDefault();

            if ($(this).hasClass("tabSelected") && params.origin !== "popUp") {
                return;
            }

            var dataRef = e.currentTarget.getAttribute("data-reference-tab");
            var tabChildren = $(dataRef, self);

            activeTab = $(e.currentTarget);
            // Changes the visibility of the contents of the tabs
            self.find(">div.childrenActive").removeClass("childrenActive");
            tabChildren.addClass("childrenActive");

            // Add the normal width
            tabHeader.find(">div.tabSelected").removeClass("tabSelected").css("width", widthRow + "%");

            if (popUp.css("display") === "block") {
                popUp.toggle();
            }

            if (params.origin && params.origin === "popUp") {
                activeTab = $("[data-reference-tab='" + dataRef + "']", tabHeader);
                reorderTabs(dataRef);
            }

            // Add the new width for tabSelected to complete the 100%
            activeTab.addClass("tabSelected").css("width", widthTabSelected + "%");
            activate(e, params);
        }

        if (typeof (params.domIncluded) !== "undefined") {
            // Until the control is added to the DOM can be known widths to add the icon popup         
            $.when(params.domIncluded).done(function () {
                updateTabSize();
            });
        } else {
            updateTabSize();
        }

        // Attach events
        self.find(".bz-wp-tabs-arrow-container").first().bind("click", function (event) {

            // Determine if an item is visible or not
            var headerWidth = (tabHeader.innerWidth() - 29);
            var totalWidth = 0;

            // Remove the visible elements
            $(".bz-container-items-tabs", popUp).removeClass("show");

            tabHeader.find(".bz-wp-tabs-ui").each(function (i, item) {

                totalWidth += $(":first-child", item).outerWidth();

                // If "true" then it is a tab to display the popup
                if (totalWidth > headerWidth) {

                    popUp.children().each(function (j, pop) {
                        if (pop.textContent === item.textContent) {
                            $(pop).addClass("show");
                            $(".cell.bz-container-items-tabs").css("border-bottom", "");
                            $(".cell.bz-container-items-tabs.show").last().css("border-bottom", "none");

                            return;
                        }
                    });
                }
            });

            event.stopPropagation();
            event.preventDefault();
            popUp.toggle();
        });

        $(">div.cell", popUp).bind("click", function (e) {
            changeTab(e, { origin: "popUp" });
        });

        $(".bz-wp-tabs-ui", tabHeader).bind("click", changeTab);

        tabHeader.bind("resizeHeader", function () {
            updateTabSize();
        });
    };
})(jQuery);