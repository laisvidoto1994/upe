/*
 *   Name: BizAgi Render Stateholder
 *   Author: Fabian Moreno
 */

bizagi.rendering.render.extend("bizagi.rendering.stakeholder", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);

        if (typeof this.properties.value === "undefined") {
            this.properties.value = [];
        }

        if (typeof this.properties.data === "undefined") {
            this.properties.data = [];
        }
        self.properties = this.properties;
    },
    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("stakeholder");

        var params =  {
            currentUser: bizagi.currentUser.userName,
            userNames: (typeof self.properties.value == "string") ? JSON.parse(self.properties.value).value: self.properties.value,
            entities: self.properties.data
        };

        // Render template
        var html = $.fasttmpl(template, params);
        return html;
    },

    getData: function (valueXpath, currentPage, filter, sort, order) {
        var self = this;

        if (typeof currentPage === "undefined" || currentPage == null)
            currentPage = "1";

        var params= {
            pxpath:valueXpath,
            prows: "10",
            ppage: currentPage.toString(),
            xpath:valueXpath,
            idRender:self.properties.id,
            xpathContext:self.properties.xpathContext,
            idPageCache:self.properties.idPageCache,
            property:"dataxpath",
            contexttype:"entity",
            pfilter: filter,
            psort: sort
        };

        if(order) params.porder = order;

        return self.dataService.multiaction().getPropertyData(params);
    },

    associatedUser: function (idEntity, guidEntity, idUser) {
        var self = this;

        return self.dataService.associateStakeholder({

            idPageCache:self.properties.idPageCache,
            contexttype:"entity",
            surrogateKey: parseInt(idEntity),
            associatedUser: JSON.encode({dataType:"Int", value:(idUser == "null")?idUser:parseInt(idUser)}),
            guidentity: guidEntity
        });
    },

    refreshStakeholderList: function () {
        var self = this;

        return self.dataService.refreshAssociateStakeholder({

            idRender:self.properties.id,
            contexttype:"entity",
            property:"value",
            idPageCache:self.properties.idPageCache
        });
    }
});