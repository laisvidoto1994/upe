/*
 *   Name:
 *   Author: ChristianC
 *   Comments:
 *   -   This script will define homePortal Framework
 */

bizagi.workportal.homeportalFramework.extend("bizagi.workportal.homeportalFramework", {}, {

    _backRenderTemplates: function (transition) {
        var self = this;

        if (self.accumulatedContext.length > 1) {
            var context = self.accumulatedContext[self.accumulatedContext.length - 1];
            if (context.navigateFromRender) {
                bizagiapp.openRenderElement();
            } else {
                //TODO validar si en nativo esta parte se comporta igual o no
                var accumulatedContext = self.popContext().context;
                var data = accumulatedContext[accumulatedContext.length - 1];
                var args = {
                    data: data,
                    calculateFilters: data.calculateFilters || false,
                    filters: [],
                    eventType: "DATA-NAVIGATION"
                };

                bizagi.webpart.publish("homeportalShow", {
                    "what": "stuffTemplates",
                    "title": args.data.displayName,
                    "params": args,
                    "preventNavigate": true
                });
            }
        } else {
            if (self.navigateFromRender) {
                bizagiapp.openRenderElement();
            }
        }

        self._back(transition);
    }

});
