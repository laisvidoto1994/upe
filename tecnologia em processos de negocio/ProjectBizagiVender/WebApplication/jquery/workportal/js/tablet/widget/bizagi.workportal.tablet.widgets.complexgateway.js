bizagi.workportal.widgets.complexgateway.extend("bizagi.workportal.widgets.complexgateway", {}, {
    
    postRender : function() {
        var self = this;
        var content = self.getContent();
        var transitions = self.params.options.transitions;
        
        var headerTemplate = self.workportalFacade.getTemplate("complex-gateway-header");
        var header = $.tmpl(headerTemplate);
        var contentRender = content.find(".complex-content");
        
        contentRender.append(header);
        
        if(transitions.length > 0) {
            $.each(transitions, function(_, transition) {
                var check;
                var def = transition.isDefaultOption;
                var template = self.workportalFacade.getTemplate("complex-gateway-row");
                var row = $.tmpl(template);
                // id
                row.attr("data-transition-id", transition.transitionId)
                // name
                row.find(".complex-row-name > span").text(transition.transitionName);
                // check
                check = row.find(".complex-row-check > span");
                if(def === undefined || def === null || def == "false" || def === false) {
                    check.attr("data-state", "uncheck");
                } else {
                    check.attr("data-state", "check");
                }
                
                contentRender.append(row);
                
                // events
                row.click(function() {
                    check = row.find(".complex-row-check > span");
                    if(check.attr("data-state") == "uncheck") {
                        check.attr("data-state", "check");
                    } else {
                        check.attr("data-state", "uncheck")
                    }
                });
            });
        }
    }
    
});