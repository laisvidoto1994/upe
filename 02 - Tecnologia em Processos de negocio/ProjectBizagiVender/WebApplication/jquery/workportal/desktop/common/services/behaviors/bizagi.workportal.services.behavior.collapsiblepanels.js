bizagi.workportal.services.behaviors = bizagi.workportal.services.behaviors || {};
bizagi.workportal.services.behaviors.collapsiblepanels = (function () {
   var self = this;

   /**
    * Collapsed panels
    */

   self.addClassesCollapseSideBar = function(content, classSuffix, isShowAlwaysSidebar){

      var width = $(window).width();
      if (width > 1366) {
         if(isShowAlwaysSidebar){

            $("#ui-bizagi-wp-project-homeportal-main", self.content).removeClass("ui-bizagi-wp-project-collapse" + classSuffix);
         }
         else{
            $("#ui-bizagi-wp-project-homeportal-main", self.content).toggleClass("ui-bizagi-wp-project-collapse" + classSuffix, function () {
               if ($(this).hasClass("ui-bizagi-wp-project-collapse" + classSuffix)) {

                  $("#ui-bizagi-wp-project-homeportal-main", self.content).removeClass("ui-bizagi-wp-project-open" + classSuffix);
                  $(".ui-bizagi-wp-project-dashboard-breadcrumb-container",self.content).css("margin-bottom", "1px");

               } else {
                  $("#ui-bizagi-wp-project-homeportal-main", self.content).addClass("ui-bizagi-wp-project-open" + classSuffix);
                  $(".ui-bizagi-wp-project-dashboard-breadcrumb-container",self.content).css("margin-bottom", "");
               }
            });
         }

      } else {
         if(isShowAlwaysSidebar){
            $("#ui-bizagi-wp-project-homeportal-main", self.content).addClass("ui-bizagi-wp-project-open" + classSuffix);
         }
         else{
            $("#ui-bizagi-wp-project-homeportal-main", self.content).toggleClass("ui-bizagi-wp-project-open" + classSuffix, function () {
               if ($(this).hasClass("ui-bizagi-wp-project-open" + classSuffix)) {
                  $("#ui-bizagi-wp-project-homeportal-main", self.content).removeClass("ui-bizagi-wp-project-collapse" + classSuffix);
               } else {
                  $("#ui-bizagi-wp-project-homeportal-main", self.content).addClass("ui-bizagi-wp-project-collapse" + classSuffix);
               }
            });
         }
      }

      self.calculateBarsDays(content);
   };

   self.calculateBarsDays = function(content){
      var $barRemainingDate = $(".ui-bizagi-wp-project-plan-progress .remaining-days .time-remaining", content);
      var widthNumberDays = $(".ui-bizagi-wp-project-plan-progress .remaining-days .days", content).width();
      $barRemainingDate.css("padding-left", (widthNumberDays + 7).toString() + "px");

      $barRemainingDate = $(".ui-bizagi-wp-project-plan-time .remaining-days .time-remaining", content);
      widthNumberDays = $(".ui-bizagi-wp-project-plan-time .remaining-days .days", content).width();
      $barRemainingDate.css("padding-left", (widthNumberDays + 7).toString() + "px");
   };

   /*
    * Enable Side Bar
    */
   self.enableSideBar = function () {
      var self = this;
      $("#ui-bizagi-wp-project-homeportal-main", self.content).removeClass("ui-bizagi-wp-project-collapse-right");
      $("#ui-bizagi-wp-project-homeportal-main", self.content).addClass("ui-bizagi-wp-project-open-right");
      $("#ui-bizagi-wp-project-dashboard-sidebar-right").show();
   };

   self.disableSideBar = function () {
      var self = this;
      $("#ui-bizagi-wp-project-homeportal-main", self.content).addClass("ui-bizagi-wp-project-collapse-right");
      $("#ui-bizagi-wp-project-homeportal-main", self.content).removeClass("ui-bizagi-wp-project-open-right");
      $("#ui-bizagi-wp-project-dashboard-sidebar-right").hide();
   };


   return {
      addClassesCollapseSideBar: self.addClassesCollapseSideBar,
      enableSideBar: self.enableSideBar,
      disableSideBar: self.disableSideBar
   };

});

bizagi.injector.register("behaviorCollapsiblePanels", [bizagi.workportal.services.behaviors.collapsiblepanels]);