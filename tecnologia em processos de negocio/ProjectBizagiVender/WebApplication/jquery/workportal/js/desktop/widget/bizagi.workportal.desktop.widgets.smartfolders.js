/*
 *   Name: BizAgi Workportal Desktop Smart Folders Widget Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will provide desktop overrides to implement the smart folder widget
 */

// Auto extend
bizagi.workportal.widgets.smartfolders.extend("bizagi.workportal.widgets.smartfolders", {}, {

	/**
	 *   To be overriden in each device to apply layouts
	 */
	postRender: function () {
		var self = this;

		self.params.options.onlyFolderMode = self.params.options.onlyFolderMode || false;

		// Set bind event for last element
		self.configureTreeNavigation();

		// Bind back button
		self.configureBackButton();

		// Render default folders
		// self.renderDefaultFolders();

		// Render base categories
		self.renderFolders((self.params.options.onlyFolderMode) ? "-1" : "");

		// set vertical scroll
		self.scrollVertical({
			"autohide": false
		});
	},

	renderDefaultFolders: function () {
		var self = this;
		var content = self.getContent();
		var template = self.getTemplate("smartfolders-default");
		var container = $("#queries", content);

		container.empty();
		$.tmpl(template).appendTo(container);

	},

	/**
	 * Render List categories for each idCategory
	 */
	renderFolders: function (id, appendElement) {
		var self = this;
		var content = self.getContent();
		var template = (self.params.options.onlyFolderMode != undefined && self.params.options.onlyFolderMode) ? self.getTemplate("smartfolders-add-case") : self.getTemplate("smartfolders-elements");
		var emptyTemplate = self.getTemplate("smartfolders-empty-elements");
		var container = $("#queries", content);
		var queryContent;
		var mergeData;
		var mergeNewFolder = {};

		id = id || "";

		$.when(self.dataService.getSmartFolders(id))
		.done(function (data) {

			container.empty();

			// check if service it has nodes
			data = data || undefined;
			var idParent = "";
			try {
				if (data.folders != undefined && data.folders.length > 0) {
					idParent = data.folders[0]["idParent"];
				}
			} catch (e) { }


			if (data.folders != undefined && data.folders != "") {
				// Check if it has appendElement
				if (appendElement != undefined) {
					mergeData = {
						folders:
						(data != undefined) ? appendElement.concat(data.folders) : appendElement
					};
				//$.merge({folders:appendElement},data)
				//$.merge(appendElement, data); //appendElement.concat(data.folders)
				} else {
					mergeData = data;
				}
				// Count number of childs
				$.each(mergeData.folders, function (key, value) {
					if (value != undefined && value.childs.folders != undefined) {
						mergeData.folders[key]["countChilds"] = mergeData.folders[key]["childs"]["folders"].length;
					} else {
						mergeData.folders[key]["countChilds"] = 0;
					}
				});

				// Append "new folder"element
				if (!self.params.options.onlyFolderMode) {
					mergeNewFolder.folders = mergeData.folders.concat({
						"name": self.getResource("workportal-widget-folders-new"),
						"id": 'newFolder',
						"idParent": idParent,
						"childs": [],
						"categoryWithLink": "true",
						"countChilds": 0
					});
				} else {
					mergeNewFolder = mergeData;
				}

				queryContent = $.tmpl(template, mergeNewFolder);
			} else if (!self.params.options.onlyFolderMode) {
				//Don't have results
				mergeNewFolder.folders = [{
					"name": self.getResource("workportal-widget-folders-new"),
					"id": 'newFolder',
					"idParent": idParent,
					"childs": [],
					"categoryWithLink": "true",
					"countChilds": 0
				}];
				queryContent = $.tmpl(template, mergeNewFolder);
			} else {
				queryContent = $.tmpl(emptyTemplate);
			}
			queryContent.appendTo(container);

			// set actions to rendered html
			self.configureNavTree();
		});
	},


	configureNavTree: function () {
		var self = this;
		var confirm = self.getTemplate("smartfolders-query-confirm");

		// Bind for list elements
		$("li", "#queries").click(function (e) {
			e.stopPropagation();
			var id = $(this).data("id");
			var countChilds = $(this).data("childslength");
			var name = $(this).data("name");
			var urlParameters = $(this).data("urlparameters");
			var idParent = $(this).data("idparent");

			//            var categoryTree = $("#categoryTree");
			var queriesListDisplay = $(".queriesListDisplay li");

			// Config inbox view
			if (countChilds == 0 && self.params.options.onlyFolderMode) {
				return;
			}

			// If the node is base folder
			if (id == "-1") {
				// Is category		

				// Set bind event for last element
				self.configureTreeNavigation(idParent);

				// Render sub-categories
				self.renderFolders(id);
			} else if (id == "newFolder") {
				// Create new folder
				self.makeFolder({
					listElements: queriesListDisplay,
					idParent: idParent
				});

			} else if (countChilds > 0) {
				// Is category with link


				// Set bind event for last element
				self.configureTreeNavigation(idParent);

				// Apend this object to children
				self.renderFolders(id,
					(self.params.options.onlyFolderMode) ? [] :
					[{
						"name": name,
						"id": id,
						"idParent": '',
						"childs": [],
						"categoryWithLink": true,
						"urlParameters": urlParameters
					}]
					);
			} else {
				// Is Process
				bizagi.workportal.desktop.popup.closePopupInstance();
				if (countChilds == 0 && urlParameters) {
					if(bizagi.override.viewSmartFoldersAsSearch){
						$.when(
							self.dataService.getCustomizedColumnsData({
								smartfoldersParameters: urlParameters
							}))					
						.done(function (data) {
							bizagi.lstIdCases = data.lstIdCases;
							// Define radnumber for render actions bottons
							bizagi.referrerParams = bizagi.referrerParams || {};
							bizagi.referrerParams.radNumber = ""; //params.radNumber;
							bizagi.referrerParams.page = ""; //params.page;
							bizagi.referrerParams.referrer = "folders";
							bizagi.referrerParams.urlParameters = urlParameters;
							bizagi.referrerParams.name = name;
							bizagi.referrerParams.id = id;

							// Define widget customized for pagination purposes
							data.customized = true;
							data.urlParameters = urlParameters;

							// Define title of widget
							data.title = name;

							// Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
							data.casesGroupedByFolder = true;
							data.idFolder = id;

							self.publish("changeWidget", {
								widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
								data: data,
								referrerParams: {}
							});
						});
					}else{
						bizagi.referrerParams = bizagi.referrerParams || {};
						var widgetRedirect;
						if(self.params.options.foldersView == 'inboxgrid'){
							widgetRedirect = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
							bizagi.referrerParams = {
								urlParameters : urlParameters,
								referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
							}
						}else{
							widgetRedirect = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
							bizagi.referrerParams = {
								urlParameters : urlParameters,
								referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
							}
						}
						
						self.publish("changeWidget", {
							widgetName: widgetRedirect,
							smartfoldersParameters: {
								urlParameters : urlParameters
							},
							referrerParams: {}
						});
					}															
				}
			}
		});


		// Bind for action elements (Edit and delete buttons)
        
		$(".editButton", "#queries").click(function (e) {
			e.stopPropagation();
			self.editFolder($(this).parent());
		});


		$(".deleteButton", "#queries").click(function (e) {
			e.stopPropagation();

			var content = $.tmpl(confirm);
			var idSmartFolder = $(this).data("id");
			var idParent = $(this).data("idparent");

			// Open dialog with confirm message
			$(content).dialog({
				resizable: true,
				modal: true,
				title: self.getResource("workportal-widget-queries-confirm-title"),
				buttons: [
				{
					text: self.getResource("workportal-widget-queries-confirm-delete"),
					click: function () {						
						self.dataService.deleteSmartFolder({
							idSmartFolder: idSmartFolder,
							idUser: bizagi.currentUser.idUser || 0
						});

						$(this).dialog("close");
						self.renderFolders(idParent);
					//bizagi.workportal.desktop.popup.closePopupInstance();
					}
				},
				{
					text: self.getResource("workportal-widget-queries-confirm-cancel"),
					click: function () {
						$(this).dialog("close");
					}
				}
				]
			});
		});
	
	},

	/**
 *   Binds the back buttons so we can navigate back
 */
	configureBackButton: function () {
		var self = this;
		var content = self.getContent();
		var btnBack = $("#bt-back", content);
		var categoryTree = $("#categoryTree", content);

		// Bind click
		btnBack.click(function () {
			if ($("li", categoryTree).length > 1) {
				// Removes last child
				$("li:last-child", categoryTree).remove();
				var idParentQuery = $("li:last-child").children("#idParent").val();

				// Render Querie again
				self.renderFolders(idParentQuery);
			}
		});
	},

	/**
 * Configure Edit input field
 */
	makeFolder: function () {
		var self = this;
		var url =self.dataService.getUrl({
			endPoint:"smartfolders-integration"
		})+"?ParentQueryId=-1";
					
		self.publish("showDialogWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
			widgetURL: url,
			modalParameters: {
				title: self.getResource("workportal-widget-folders-new"),
				width:"1020px"
			}
		});
		
	},

	
	/**
 * Edit folder
 */
	editFolder: function (element) {
		var self = this;
		var value = $(element).find("h3").html();
		var id = $(element).data("id");
		var url =self.dataService.getUrl({
			endPoint:"smartfolders-integration"
		})+"?iQueryFormId="+id;

		self.publish("showDialogWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
			widgetURL: url,
			modalParameters: {
				title: value,
				width:"1020px"
			}
		});
	},


	/**
 * Bind tree navigation
 */
	configureTreeNavigation: function (idParent) {
		var self = this;
		var content = self.getContent();
		var categoryTree = $("#categoryTree", content);

		// Bind header events
		$("li:last-child", categoryTree).click(function () {
			idParent = idParent || $(this).children("#idParent").val();

			if (self.params.options.onlyFolderMode && idParent == "") {
				self.renderFolders(-1);
			}
			// Remove all elements
			$(this).nextAll().remove();
			// Render query tree again
			self.renderFolders(idParent);
		});
	},

	scrollVertical: function () {
		var self = this;
		var content = self.getContent();

		$("#queries", content).bizagiScrollbar({
			"autohide": false
		});
	}
    
});
