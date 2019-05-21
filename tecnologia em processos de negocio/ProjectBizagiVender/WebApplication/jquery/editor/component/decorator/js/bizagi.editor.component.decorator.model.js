/*
 * Author : Alexande Mejia
 * Date   : 13 Ago 2012
 * Comments:
 *     Define the model of the decorator component
 *
 */

$.Class.extend("bizagi.editor.component.decorator.model", {


	/*
	 *   @static
	 *   Return the model for a specified control
	 */
	getSpecificModel: function(control) {
		var self = this;
		var type = control.type || control.name;


		self.models = {
			"grid": { specificOptions: [
				{ id: "ConfigGrid", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editcolumns"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
			] },
			"offlinegrid": { specificOptions: [
				{ id: "ConfigGrid", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editcolumns"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
			]
			},
			"adhocgrid": {
			    specificOptions: [
                    { id: "ConfigGrid", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editcolumns"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
			    ]
			},
			"groupedgrid": { specificOptions: [
				{ id: "ConfigGrid", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editcolumns"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
			] },
			"nestedform": { standardOptions: [
				{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
				{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
			],
				specificOptions: [
					{ id: "EditNestedForm", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editform"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
				]
			},
			"querynestedform": { standardOptions: [
				{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
				{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
			],
				specificOptions: [
					{ id: "EditNestedForm", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-editform"), css: "bz-studio bz-extended-table-edit-record_16x16_standard" }
				]
			},
			"horizontal": { standardOptions: [
				{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
				{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
			]
			},
			"container": {
				standardOptions: [
					{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
					{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
				]
			},
			"formbutton": {
				standardOptions: [
					{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
					{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
				]
			},
			"query": {
				standardOptions: [
					{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
					{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
				]
			}

		};

		self.standardOptions = [
			{ allowProperties: true, id: "gear", displayName: bizagi.localization.getResource("bizagi-editor-properties-caption"), css: "bz-studio bz-settings_16x16_standard" },
			{ allowXpath: true, id: "bind", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-bind"), css: "bz-studio bz-boolean-xpath_16x16_standard" },
			{ allowDelete: true, id: "delete", displayName: bizagi.localization.getResource("bizagi-editor-decorator-model-allowdelete"), css: "bz-studio bz-delete_16x16_standard" }
		];


		if(type == "queryInternal" || type == "query") {
			var model = self.models["query"] || { standardOptions: self.standardOptions };
		}
		else if (type == 'template'){
		    var model = { standardOptions: [] };
		}
		else {
			model = self.models[control.name] || self.models[type] || { standardOptions: self.standardOptions };
		}

		if(!model.standardOptions) model.standardOptions = self.standardOptions;

		return model;
	}
}, {});
