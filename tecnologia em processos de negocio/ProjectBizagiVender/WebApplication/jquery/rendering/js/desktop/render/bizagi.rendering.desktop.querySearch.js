/*
*   Name: BizAgi Desktop querySearch
*   Author: Ivan Ricardo Taimal Narvaez
*   Comments:querySearch
*   -
*/

bizagi.rendering.search.extend("bizagi.rendering.querySearch", {}, {
     /*
     *   Opens the search dialog
     */
    showSearchDialog: function () {
        var self = this,
            properties = self.properties,
            extraButtons,
            contextType = (properties.searchForms.length > 0 && properties.searchForms[0].type == "searchForm") ? "metadata" : "entity";

        // Define add button
        if (properties.allowNew) {
            extraButtons = self.showAddRecordDialog();
        }

        // Show search dialog
        self.searchDialog = new bizagi.rendering.dialog.search(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch,
            maxRecords: properties.maxRecords
        }, extraButtons);

        self.searchDialog.render({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: contextType
        }).done(function (item) {
            data={id:item.id,value:item.id};
            // Set data
            self.setDisplayValue(data);
            self.setValue(data);
        });
    }
});

