
/*
 * Author : Alexander Mejia Garzon
 * Date   : 30mar12 
 * Comments:
 *     Define the node of model in the xpath navigator component
 *
 */

bizagi.editor.observableClass.extend("bizagi.editor.component.xpathnavigator.node", {
    icons: {
        "entity": "bz-studio bz-entity_16x16_standard",
        "entity-application": "bz-studio bz-application_16x16_standard",
        "entity-master": "bz-studio bz-master_16x16_standard",
        "entity-stakeholder": "bz-studio bz-stakeholderentity_16x16_standard",
        "entity-parametric": "bz-studio bz-Parametersentity_16x16_standard",
        "entity-system": "bz-studio bz-entity_16x16_standard",
        "number": "bz-studio bz-number_16x16_standard",
        "form": "bz-studio bz-reusable-forms_16x16_standard",
        "string": "bz-studio bz-textbox_16x16_standard",
        "text": "bz-studio bz-textbox_16x16_standard",
        "date": "bz-studio bz-date_16x16_standard",
        "boolean": "bz-studio bz-boolean_16x16_standard",
        "currency": "bz-studio bz-money_16x16_standard",
        "image": "bz-studio bz-image_16x16_standard",
        "attachment": "bz-studio bz-file-uploads_16x16_standard",
        "float": "bz-studio bz-number_16x16_standard",
        "uploadecm": "bz-studio bz-file-uploads-ecm_16x16_standard",
        "collection": "bz-studio bz-collections_16x16_standard",
        "metadata-metadata": "bz-studio bz-process-filters_16x16_standard",
        "metadata-applications": "bz-studio bz-process-filters-application_16x16_standard",
        "metadata-process": "bz-studio bz-process-filters-process_16x16_standard",
        "metadata-task": "bz-studio bz-process-task_16x16_standard",
        "metadata-task-current": "bz-studio bz-process-current-task_16x16_standard",
        "metadata-task-previous": "bz-studio bz-process-previous-task_16x16_standard",
        "metadata-task-entry-date": "bz-studio bz-process-task-entry-date_16x16_standard",
        "metadata-task-expiry-date": "bz-studio bz-process-task-expiry-date_16x16_standard",
        "metadata-task-state": "bz-studio bz-process-task-state_16x16_standard",
        "metadata-cases": "bz-studio bz-process-case_16x16_standard",
        "metadata-case-creation-date": "bz-studio bz-case-creation-date_16x16_standard",
        "metadata-case-creator": "bz-studio bz-case-creator_16x16_standard",
        "metadata-case-id": "bz-studio bz-case-id_16x16_standard",
        "metadata-case-number": "bz-studio bz-case-number_16x16_standard",
        "metadata-case-solution-date": "bz-studio bz-case-solution-date_16x16_standard",
        "metadata-case-state": "bz-studio bz-case-state_16x16_standard",
        "metadata-users": "bz-studio bz-users_16x16_standard",
        "metadata-users-creator": "bz-studio bz-users-creator_16x16_standard",
        "metadata-users-creator-fullname": "bz-studio bz-users-creator-fullname_16x16_standard",
        "metadata-users-creator-username": "bz-studio bz-users-creator-name_16x16_standard",
        "metadata-users-creator-position": "bz-studio bz-users-creator-position_16x16_standard",
        "metadata-users-currentuser": "bz-studio bz-users-current_16x16_standard",
        "metadata-users-currentuser-fullname": "bz-studio bz-users-current-fullname_16x16_standard",
        "metadata-users-currentuser-username": "bz-studio bz-users-current-name_16x16_standard",
        "metadata-users-currentuser-position": "bz-studio bz-users-current-position_16x16_standard",
        "metadata-users-previoususer": "bz-studio bz-users-previous_16x16_standard",
        "metadata-users-previoususer-fullname": "bz-studio bz-users-previous-fullname_16x16_standard",
        "metadata-users-previoususer-username": "bz-studio bz-users-previous-name_16x16_standard",
        "metadata-users-previoususer-position": " bz-studio bz-users-previous-position_16x16_standard"
    }
}, {

    /*
    *   Creates a model for a single node
    */
    init: function (node) {
        var self = this;

        // call base
        self._super();

        self.nodes = null;
        self.data = node;

        if (node) self.processData(node);
    },

    /*
    *   Process the node data
    */
    processData: function (node) {
        var self = this;

        self.id = Math.guid();
        self.canHaveChildren = node.canHasChildren === undefined ? false : node.canHasChildren; // manage default values
        self.displayName = node.displayName;
        self.guid = node.guid;
        self.isDraggable = node.isDragabble === undefined ? true : node.isDragabble; // manage default values
        self.style = node.style;
        self.renderType = node.renderType;
        self.xpath = node.xpath;
        self.isScopeAttribute = node.isScopeAttribute === undefined ? false : node.isScopeAttribute; // manage default values
        self.guidRelatedEntity = node.guidRelatedEntity;
        self.hasRelatedEntity = self.guidRelatedEntity && self.guidRelatedEntity != "00000000-0000-0000-0000-000000000000" ? true : false;
        self.contextScope = node.contextScope;
        self.formVersion = node.formVersion;
        self.maxLength = node.maxLength;
        self.contextEntityType = node.contextEntityType;
        if (node.entityContext) self.entityContext = node.entityContext;
        if (node.predefinedValues) self.predefinedValues = node.predefinedValues;


        // TODO: Data definition must be changed in order to avoid the next workaround
        if (self.isScopeAttribute === true || self.isScopeAttribute == "true") {
            self.nodeType = node.style.replace('ui-bizagi-type-scope-', '').replace(/(attribute)(-\w+)/g, "$1");
            self.nodeSubtype = node.style.replace('ui-bizagi-type-scope-', '').replace(/(attribute)(-)(\w+)/g, "$3");
        } else {
            self.nodeType = node.style.replace('ui-bizagi-type-', '').replace(/(attribute)(-\w+)/g, "$1");
            self.nodeSubtype = node.style.replace('ui-bizagi-type-', '').replace(/(attribute)(-)(\w+)/g, "$3");
        }

        self.icon = self.Class.icons[self.nodeSubtype];

        /// This allow us to remove if from template
        if (self.isDraggable === "true")
            self.dragabbleClass = "ui-bizagi-draggable-item ui-bizagi-itemfordrag";
    },

    /*
    *   Gets the original data
    */
    getOriginalData: function () {
        var self = this;
        var data = self.data;

        // Skip children
        data.nodes = [];
        return data;
    },

    /*
    *   Set the children nodes
    */
    setChildren: function (children) {
        var self = this;
        self.nodes = children;
    },

    /*
    *   Retrieve the children nodes
    */
    getChildren: function () {
        var self = this;
        return self.nodes;
    },

    /*
    *   Set the parent node
    */
    setParent: function (parent) {
        this.parent = parent;
    },

    /*
    *   Retrieve the paent node
    */
    getParent: function () {
        return this.parent;
    },

    /*
    *   Retrieve the displayName node
    */
    getDisplayName: function () {
        return this.displayName;
    },

    /*
    *   Gets xpath context menu model for the node
    */
    getContextMenuModel: function (context) {
		var self = this;
        var key = self.nodeTypeContextMenuMappings[this.nodeType];        

        function removeItems(data) {
            var result = data;

            if (context == 'template') {
                var items = [];               
                for (var i = 0, l = data.items.length; i < l; i++) {
                    if (data.items[i].action != 'addelement' && 
                        data.items[i].action != 'addchildelements' &&
                        data.items[i].separator == undefined) {
                        items.push(data.items[i]);
                    }                    
                }
                result.items = items;
            } 

            return result;
        }
        
        var data = removeItems(self.contextMenuModels[key]);

        return new bizagi.editor.component.contextmenu.model(data);
    },

    /*
    * Changes caption for item viewAll in contextMenu 
    */
    setCaptionViewContextMenu: function () {
        var self = this;
        var model = self.getContextMenuModel();
        var viewItem = model.getItemByAction("viewall");

        if (viewItem) {

            viewItem.caption = (viewItem.caption == bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-viewall")) ?
                               bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-onlycontextentity") :
                               bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-viewall");
        }
    },

    /*
    * Return true if the dragg option is enabled
    */
    enableDrag: function (context) {
        var self = this;

        if (context === "grid" || context === "queryform") {
            return bizagi.util.parseBoolean(self.isDraggable);
        }

        return self.parentIsGrid() ? false : bizagi.util.parseBoolean(self.isDraggable);
    },

    /*
    * Returns true is the ancestor is a grid
    */
    parentIsGrid: function () {
        var self = this;
        var result = false;

        if (self.parent) {
            result = (self.parent.renderType === "grid") || self.parent.parentIsGrid();
        }

        return result;
    },

    /*
    * Return true if the parent is the process entity
    */
    parentIsProcessEntity: function (processEntityId) {
        var self = this;

        if (!processEntityId) { return false; }
        return (processEntityId === self.guidRelatedEntity);

    },

    /*
    * Gets maxLength attribute
    */
    getMaxLength: function () {
        var self = this;
        return self.maxLength;
    },

    /*
    * Gets render type
    */
    getRenderType: function () {
        return this.nodeSubtype;
    },

    /*
     * Gets data type
     */
    getDataType: function () {
        var self = this;
        return self.DataType;
    },

    /*
    * Sets of value of property scopeAttribute
    */
    setScopeAttribute: function (value) {
        var self = this;

        self.isScopeAttribute = value;
    },

    /*
    *  Returns true if node is an attribute of a parameter entity
    */
    parentIsParametricEntity: function () {
        var self = this;
        var result = false;

        if (self.parent) {
            result = (self.parent.style == "ui-bizagi-type-entity-parametric") || self.parent.parentIsParametricEntity();
        }

        return result;
    }

});

/*
* Define context menu models
*/

bizagi.editor.component.xpathnavigator.node.extend("bizagi.editor.component.xpathnavigator.node", {},
	{
		init: function(args) {
		var self = this;

		/*
		 *   Xpath context menu static models by node
		 */
		self.contextMenuModels = {
			applicationEntity: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-editentity"), style: "editentity", action: "editentity", icon: "bz-studio bz-edit-entity_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-viewall"), style: "viewall", action: "viewall", icon: "bz-studio view-all_16x16_standard" },
					{ "separator": true },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-refresh"), style: "refresh", action: "refresh", icon: "bz-studio bz-refresh_16x16_standard" }
				]
			},

			masterEntity: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addelement"), style: "addelement", action: "addelement", icon: "bz-studio bz-add-element_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addchildelements"), style: "addchildelements", action: "addchildelements", icon: "bz-studio bz-add-elements_16x16_standard" },
					{ "separator": true },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-editentity"), style: "editentity", action: "editentity", icon: "bz-studio bz-edit-entity_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-refresh"), style: "refresh", action: "refresh", icon: "bz-studio bz-refresh_16x16_standard" }
				]
			},

			entity: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addelement"), style: "addelement", action: "addelement", icon: "bz-studio bz-add-element_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addchildelements"), style: "addchildelements", action: "addchildelements", icon: "bz-studio bz-add-elements_16x16_standard" },
					{ "separator": true },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-editentity"), style: "editentity", action: "editentity", icon: "bz-studio bz-edit-entity_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-editvalues"), style: "editvalues", action: "editvalues", icon: " bz-studio bz-edit-entity-values_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-refresh"), style: "refresh", action: "refresh", icon: "bz-studio bz-refresh_16x16_standard" }
				]
			},

			entitySystem: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addelement"), style: "addelement", action: "addelement", icon: "bz-studio bz-add-element_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addchildelements"), style: "addchildelements", action: "addchildelements", icon: "bz-studio bz-add-elements_16x16_standard" },
					{ "separator": true },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-refresh"), style: "refresh", action: "refresh", icon: "bz-studio bz-refresh_16x16_standard" }
				]
			},

			attribute: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addelement"), style: "addelement", action: "addelement", icon: "bz-studio bz-add-element_16x16_standard" }
				]
			},

			form: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-newform"), style: "newform", action: "newForm", icon: "bz-studio bz-new-form_16x16_standard" }
				]
			},

			collection: {
				items: [
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-addelement"), style: "addelement", action: "addelement", icon: "bz-studio bz-add-element_16x16_standard" },
					{ "separator": true },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-editentity"), style: "editentity", action: "editentity", icon: "bz-studio bz-edit-entity_16x16_standard" },
					{ caption: bizagi.localization.getResource("formmodeler-component-xpathnavigator-context-menu-refresh"), style: "refresh", action: "refresh", icon: "bz-studio bz-refresh_16x16_standard" }
				]
			}
		};

		/*
		 *   Define node type mappings for context menus
		 */
		self.nodeTypeContextMenuMappings = {
			"entity-application": "applicationEntity",
			"entity-master": "masterEntity",
			"entity-parametric": "entity",
			"entity-system": "entitySystem",
            "entity-stakeholder": "entity",
			"attribute": "attribute",
			"form": "form"
		};

		self._super(args);
	}
    
});

