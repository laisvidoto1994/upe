if(!$.bizagi){
	$.bizagi = {ui:{}};
}

$.bizagi.ui = {
	controls:{
			uitable:{
				namespace : 'bizagi.ui.controls.uitable',
				availableComponents:['uicombo','uiradio', 'uicheckbox'],
				css:'biz-ui-controls-table',
				tmpl: 'bizagi.ui.controls.table.template',
				tmpl2: 'bizagi.ui.controls.table.tr.template',
				tmpl3: 'bizagi.ui.controls.table.list.template'
			},
			uicombo:{
				namespace: 'bizagi.ui.controls.uicombo',
				css: 'biz-ui-controls-combo',
				tmpl: 'bizagi.ui.controls.combo.template',
				tmpl2: 'bizagi.ui.controls.combo.list.template'
			},
			uicheckbox:{
				namespace: 'bizagi.ui.controls.uicheckbox',
				css: 'biz-ui-controls-checkbox',
				tmpl: 'bizagi.ui.controls.checkbox.template'
			},
			uiradio:{
				namespace: 'bizagi.ui.controls.uiradio',
				css: 'biz-ui-controls-radio',
				tmpl: 'bizagi.ui.controls.radio.template'
			},
			uitreeview: {
				namespace: 'bizagi.ui.controls.uitreeview',
				css: 'biz-ui-controls-treeview',
				tmpl: 'bizagi.ui.controls.treeview.template'
			},
			uimultiselect: {
				namespace: 'bizagi.ui.controls.multiselect',
				css: 'biz-ui-controls-multiselect',
				tmpl: 'bizagi.ui.controls.multiselect.template'
			}
		}
};