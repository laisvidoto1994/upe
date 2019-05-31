/*
*   Name: 
*   Author: Oscar Osorio
*   Comments:
*   

structure to applicate plugin
<div class="isTab"> //container 
<div class="cell bz-container-items-tabs"> //represent item of tab
<span >${displayName}</span>// the first span always is the title
//after the span can place the items you want
<span> ........</span>
<div> .........</div> //etc 
</div> <!-- end cell-->
</div><!-- end isTab-->


*/

(function ($) {

    $.fn.bztabs = function (params) {

        $.extend(params, { enableUnselectedTab: false });

        return $(this).each(function (i) {
            var self = $(this);
            //no permite el ingreso de la variable text a la refernecia memoria text es un objeto que utiliza bizagi para edicion pero en este punto no se edita
            if (!self.is("DIV"))
                return;

            /*self.prepend("<div class='bz-header_select'><div class='bz-wp-tabs-ui'> <span></span> </div>  <div class='bz-wp-tabs-arrow'> <div class='bz-wp-tabs-arrow-down'></div> </div> </div>");*/
            self.prepend("<div class='bz-header_select'><div class='bz-wp-tabs-ui'> <span></span> <div class='bz-wp-tabs-arrow-container'><div class='bz-cm-icon bz-wp-tabs-arrow'></div></div>   </div> </div>");

            self.find(">div.isTab").hide();

            self.find(">.bz-header_select ").bind('click', function (event) {

                event.stopPropagation();
                event.preventDefault();

                if (self.find(">div.isTab:visible").length != 1)
                    $(".isTab:visible").hide();

                self.find(".bz-wp-tabs-arrow >div").toggleClass("bz-wp-tabs-arrow-down bz-wp-tabs-arrow-up");
               
                //toggle tab just if it has not been cloned
                if ($(".ui-bizagi-form").children(".isTab").length <= 0) {
                    self.find(">div.isTab").toggle();
                }

                //clone tab and put it at the end of the form, this allow to see the tab over the form buttons
                if (self.find(">div.isTab:visible").length > 0) {
                    $(".ui-bizagi-form").children(".isTab").remove();
                    var tabCloned = self.find(">div.isTab").clone(true);
                    var distance = self.offset().top;

                    //hide REAL tab to allow see the CLONED tab
                    self.find(">div.isTab").toggle();
                    $(".ui-bizagi-form").append(tabCloned);
                    $(".ui-bizagi-form").children(".isTab").css("top", distance + 50 + "px");
                } else {
                    //delete CLONED tab
                    $(".ui-bizagi-form").children(".isTab").remove();
                }
                
                self.parent().unbind("click");
                self.elementBindClick = self.parent().bind("click", function () {
                    if (self.find(">div.isTab:visible").length > 0) {
                        self.find(">.bz-header_select").trigger('click');
                    }

                    self.elementBindClick.unbind("click");
                });
            });

            self.find(">div.isTab >div.cell").bind("click", function (event) {
                event.stopPropagation();
                event.preventDefault();

                if ($(this).hasClass("tabSelected")) {
                    if (params.enableUnselectedTab) {
                        self.find(">div.isTab >div.cell").not(".tabSelected").show();
                        self.parent().find("div.childrenActive").removeClass("childrenActive");
                        self.find(">div.isTab >div.tabSelected").removeClass("tabSelected");
                        self.find(">.bz-header_select ").trigger('click');
                    }
                    self.elementBindClick.unbind("click");
                    return;
                }

                //remove class ONLY to tab selected
                self.find(">div.childrenActive").removeClass("childrenActive");
                //self.find(">div.isTab").find(">div.tabSelected").removeClass("tabSelected");
                self.find(">div.isTab").find(">div.tabSelected").removeClass("tabSelected");

                var tabChildren = $($(this).data("reference-tab"));
                tabChildren.addClass("childrenActive");

                //add selected class to the REAL tab (not cloned), because it will be cloned again
                self.find(">div.isTab").find(".bz-container-items-tabs[data-reference-tab=" + $(this).attr("data-reference-tab") + "]").addClass("tabSelected");
                
                self.find(">.bz-header_select .bz-wp-tabs-ui >span:first-child").html($(this).find("> span:first-child").html());
                self.find(">.bz-header_select ").trigger('click');

                self.elementBindClick.unbind("click");

            });

            if (params != undefined) {

                if (params.enableFirst != undefined && params.enableFirst) {

                    var tabfirst = self.find("> .isTab > .bz-container-items-tabs:eq(0)");
                    var itemfirst = $($(tabfirst).data("reference-tab"), self);

                    itemfirst.addClass("childrenActive");
                    tabfirst.addClass("tabSelected");

                    $(self).find(">.bz-header_select .bz-wp-tabs-ui >span:first-child").html(tabfirst.find("> span:first-child", self).html());
                }

                if (params.activeTab != undefined) {
                    var tabCurrent = self.find("> .isTab > .bz-container-items-tabs").eq(params.activeTab);
                    var itemCurrent = $($(tabCurrent).data("reference-tab"), self);

                    itemCurrent.addClass("childrenActive");
                    tabCurrent.addClass("tabSelected");
                    $(self).find(">.bz-header_select .bz-wp-tabs-ui >span:first-child").html(tabCurrent.find("> span:first-child", self).html());
                }
            }

            // prevent when the content is small and the content in the tab is large
            setTimeout(function () {
                self.css("min-height", self.find("> .isTab").height() + 15);
            }, 600);

        });
    };


})(jQuery);