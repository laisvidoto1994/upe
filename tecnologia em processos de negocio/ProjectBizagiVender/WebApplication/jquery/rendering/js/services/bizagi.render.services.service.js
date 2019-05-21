/*
 *   Name: BizAgi Rendering Services
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide a facade to access to rendering REST services
 */

$.Class.extend("bizagi.render.services.service",
	{
		// Statics
		BA_ACTION_PARAMETER_PREFIX: "p_",
		BA_CONTEXT_PARAMETER_PREFIX: "h_",
		BA_PAGE_CACHE: "pageCacheId"
	},
	{
		/*
		 *   Constructor
		 */
		init: function(params) {
			params = params || {};
			params.context = params.context || "workflow";
			params.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
			this.serviceLocator = new bizagi.render.services.context(params);
			this.multiactionService = new bizagi.render.services.multiactionservice(this);

			// Userfield definitions mini-cache
			this.userfieldRequests = {};
		},
		/*
		 *   Return the multiaction-service
		 */
		multiaction: function() {
			return this.multiactionService;
		},
		/*
		 *   SINGLE SERVICES METHODS
		 */

		/*
		 *   Gets form data
		 *   Returns a promise of the data being retrieved
		 */
		getFormData: function(params) {
			var self = this;

			// Check if the params contains mocked data
			if(params && params.data) {
				return params.data;
			}

			// Define data
			params = params || {};
			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = params.action || "LOADFORM";
			if(params.idProcess)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idProcess"] = params.idProcess;
			if(params.idForm)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idForm"] = params.idForm;
			if(params.idEntity)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idEntity"] = params.idEntity;
			if(params.surrogateKey)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey"] = params.surrogateKey;
			if(params.idRender)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			if(params.xpathContext)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			if(params.requestedForm)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "requestedForm"] = params.requestedForm;
			if(params.recordXPath)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "recordXPath"] = params.recordXPath;
			if(params.summaryForm)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "summaryForm"] = params.summaryForm;
			if(params.idCase)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idCase"] = params.idCase;
			if(params.idWorkitem)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idWorkitem"] = params.idWorkitem;
			if(params.idTask)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idTask"] = params.idTask;
			if(params.idPageCache)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			if(params.contextType)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contextType;
			if(params.guidEntity)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guidEntity;
			if(!bizagi.util.isEmpty(params.isRefresh))
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isRefresh"] = params.isRefresh;
			if(params.isActionStartForm)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isActionStartForm"] = params.isActionStartForm;
			if(params.additionalXpaths)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "additionalXpaths"] = params.additionalXpaths;
			if(params.idStartScope)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idStartScope"] = params.idStartScope;
			if(typeof params.readOnlyForm !== "undefined")
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "readonlyform"] = params.readOnlyForm;
			if (typeof params.recordXpath !== "undefined")
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "recordlauncherxpath"] = params.recordXpath;
			if (params.guid)
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guid"] = params.guid;

			// Support parameter from ui
			// Parameters that affects all the same attributes of render
			if(params.printversion) {
				//Print limit grid rows
				var BA_ALL_PARAMETER_PREFIX = "all_";

				if(params[self.Class.BA_ACTION_PARAMETER_PREFIX + BA_ALL_PARAMETER_PREFIX + "rows"]) {
					data[self.Class.BA_ACTION_PARAMETER_PREFIX + BA_ALL_PARAMETER_PREFIX + "rows"] = params[self.Class.BA_ACTION_PARAMETER_PREFIX + BA_ALL_PARAMETER_PREFIX + "rows"];
				}
			}

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;


			// Call ajax and returns promise
			bizagi.chrono.initAndStart("data");
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("form-get-data"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: params.action || "LOAD"
			})
				.pipe(function(response) {
					bizagi.chrono.stopAndLog("data");

					// Transform data for read only version
					if(params.printversion) {
						try {
							response.form.properties.editable = "False";

							var transformGridDataToReadOnly = function(_data) {
								if(_data == null) {
									return _data;
								}
								if(_data.hasOwnProperty('type') && _data.type == 'grid') {
									_data.id = data.id + "-print";
									_data.allowAdd = "False";
									_data.allowDelete = "False";
									_data.allowEdit = "False";
									_data.allowGrouping = "False";
									_data.allowMore = "False";
									_data.allowSearch = "False";
								} else {
									$.each(data, function(key, value) {
										if(typeof (value) == 'object') {
											_data[key] = transformGridDataToReadOnly(_data[key]);
										}
									});
								}
								return _data;
							};
							response = transformGridDataToReadOnly(response);
						} catch(e) {
						}
					}

					return response;
				});
		},
		/*
		 *   Gets a search form data
		 *   Returns a promise of the data being retrieved
		 */
		getSearchFormData: function(params) {
			var self = this;

			// Define data
			params = params || {};
			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "SEARCHFORM";
			if(params.xpath)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			if(params.idRender)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			if(params.xpathContext)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			if(params.idSearchForm)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "searchForm"] = params.idSearchForm;
			if(params.idPageCache)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-search-form-get-data"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "SEARCHFORM"
			});
		},

		processDataValues: function(data) {
			var o;
			data = $.extend(true, {}, data);
			for(o in data) {
				if(data.hasOwnProperty(o) && $.type(data[o]) == "object") {
					// for search
					if(data[o].hasOwnProperty("id")) {
						data[o] = data[o].id;
					}
				}
			}
			return data;
		},
		/*
		 *   Sends a form action to the server
		 */
		submitData: function(params) {
			var self = this;

			// Define data
			data = self.resolveData(params.data || {}, params.xpathContext);
			data = self.processDataValues(data);

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = params.action;

			// Fill optional parameters
			params = params || {};
			if(params.xpath)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			if(params.idRender)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			if(params.xpathContext)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			if(params.idPageCache)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			if(params.guidEntity)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guidEntity;
			if(params.contexttype)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			if(params.transitions)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "transitions"] = params.transitions;
			if(params.surrogatekey)
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey"] = params.surrogatekey;
			if (params.forcePlanCompletion)
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "forcePlanCompletion"] = params.forcePlanCompletion;

			/* if (params.isActionStartForm)
			 data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isActionStartForm"] = params.isActionStartForm;
			 */
			var actionType = params.action.toString().toUpperCase();

			// Log submit data
			bizagi.debug("Data sent", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("form-submit-data"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: actionType
			});
		},
		/*
		 * Get data processing xpathcontext
		 */
		resolveData: function(data, xpathContext) {
			var name, newName, value;
			if(!$.isEmptyObject(data) && xpathContext) {
				if(xpathContext.search(/\[id=\d+\]/) !== -1) {
					for(name in data) {
						if(name.search(/\[id=\d+\]/) !== -1 && xpathContext == name.substr(0, name.search(/\]/) + 1)) {
							newName = name.substr(name.search(/\]/) + 2);
							value = data[name];
							data[newName] = value;
							delete data[name];
						}
					}
				}
			}
			return data;
		},
		/*
		 *   Fetch a property from the server
		 *   Params:
		 *   -   xpath
		 *   -   idRender
		 *   -   xpathContext
		 *   -   property
		 */
		getPropertyData: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = params.property;
			if(params.contexttype)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			if(params.guidentity)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guidentity;
			if(params.surrogatekey)
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey"] = params.surrogatekey;
			if(params.pxpath)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "xpath"] = params.pxpath;
			if(params.prows)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "rows"] = params.prows;
			if(params.ppage)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "page"] = params.ppage;
			if(params.pfilter != undefined && params.pfilter != null)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "filter"] = params.pfilter;
			/*else
			 data[self.Class.BA_ACTION_PARAMETER_PREFIX + "filter"] = "";*/
			if(params.psort != undefined && params.psort != null)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sort"] = params.psort;
			if(params.porder)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "order"] = params.porder;
			if(params.pcaseId)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "caseId"] = params.pcaseId;
			if(params.pguidEntity)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "guidEntity"] = params.pguidEntity;
			if(params.psurrogatedKey) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "surrogatedKey"] = params.psurrogatedKey;
			}
			if(params.pactionXpath) {
			    data[self.Class.BA_ACTION_PARAMETER_PREFIX + "actionXpath"] = params.pactionXpath;
			}
			if(params.ptemplateGuid) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "templateGuid"] = params.ptemplateGuid;
			}
			if(params.pparameters) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "parameters"] = params.pparameters;
			}

			// Log submit data
			bizagi.debug("Property refresh for '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			// TODO: change REST library in order to support extra HTTP parameters
			// Please be careful with dataType parameter
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-property-refresh"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json",
				serviceType: "PROCESSPROPERTYVALUE",
				beforeSend: function(xhr, status) {
					bizagi.multiactionConnection = bizagi.multiactionConnection || [];
					bizagi.multiactionConnection.push(xhr);
				}
			});

		},
		/*
		 *   Refresh the data property from the server
		 *   Params:
		 *   -   xpath
		 *   -   idRender
		 *   -   xpathContext
		 */
		getData: function(params) {
			return this.getPropertyData($.extend(params, {
				property: "data"
			}));
		},
		/*
		 *   Refresh the data property from the server
		 *   This version is to fetch search data
		 *   Params:
		 *   -   xpath
		 *   -   idRender
		 *   -   xpathContext
		 *   -   term
		 */
		getSearchData: function(params) {
			var self = this;
			params.extra = params.extra || {};
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "term"] = params.term;

			return this.getPropertyData($.extend(params, {
				property: "data"
			}));
		},

		/*
		 * Refresh tha data property from the server
		 * Params:
		 *   -   collapsestate
		 */
		getCollapseData: function (params) {
			var self = this;
			params.extra = params.extra || {};

			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "collapseState"] = params.collapseState;

			return this.getPropertyData($.extend(params, {
				property: "collapseState"
			}));
		},

		/*
		 *   Refresh the data property from the server
		 *   This version is to fetch grid data
		 *   Params:
		 *   -   xpath
		 *   -   idRender
		 *   -   xpathContext
		 *   -   sort
		 *   -   page
		 *   -   rows
		 */
		getGridData: function(params) {
			var self = this;
			params.extra = params.extra || {};

			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "sort"] = params.sort;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "order"] = params.order;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "page"] = params.page;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "rows"] = params.rows;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "searchFilter"] = params.searchFilter;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "value"] = params.value;

			return this.getPropertyData($.extend(params, {
				property: "data"
			}));
		},

		getGridDataExclusivesSelected: function(params) {
			var self = this;
			params.extra = params.extra || {};
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "rows"] = params.rows;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "value"] = params.value;
			params.extra[self.Class.BA_ACTION_PARAMETER_PREFIX + "xpathfilter"] = params.xpathfilter;
			return this.getPropertyData($.extend(params, {
				property: "exclusivesSelected"
			}));
		},

		/*
		 *   Returns the upload plugin cancel image
		 */
		getUploadCancelImage: function() {
			return bizagi.services.ajax.pathToBase + this.serviceLocator.getUrl("render-upload-cancel-image");
		},
		/*
		 *   Returns the upload file url for each file
		 */
		getUploadFileUrl: function(params) {
			var self = this;
			var url = this.serviceLocator.getUrl("render-upload-data-url");
			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = "fileContent";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "fileId"] = params.fileId;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},

		getUploadFileEntityUrl: function(params) {
			var self = this;
			var url = this.serviceLocator.getUrl("render-upload-data-url");
			var data = {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUETEMPLATE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = "fileContent";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "fileId"] = params.fileId;
			if(params.isContextContainerWidgetRender){
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "xpathactions"] = params.xpathActions;
			}
			else{
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey"] = params.surrogatekey;
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guidentity;
			}

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},

		/*
		 *   Returns the upload add url
		 */
		getUploadAddUrl: function() {
			var self = this;
			var url = this.serviceLocator.getUrl("render-upload-add-url");
			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "ADDFILE";

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},
		/*
		 *   Returns the upload add url
		 */
		getUploadAddFileUrl: function(isUserPreferences) {
			var self = this;
			var url = this.serviceLocator.getUrl("form-submit-data-upload");
			var data = {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = (isUserPreferences === true) ? "SAVEUSERIMAGE" : "savefile";

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},

		deleteImage: function(params){
			 var self = this;

			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "DELETEUSERIMAGE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			// Log submit data
			bizagi.debug("Removing image '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-upload-delete-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},

		/*
		 *   Returns the upload add url
		 */
		deleteUploadFile: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "REMOVERELATION";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			// Log submit data
			bizagi.debug("Removing file in upload '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-upload-delete-url"),
				data: data,
				type: "POST",
				dataType: "json"

			});
		},
		/*
		 * Return file meta data
		 */
		getECMMetadata: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "getECMMetadata";
			data.idFileUpload = params.idFileUpload;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;
			if(params.sessionId) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
			}
			// Log submit data
			bizagi.debug("Get file metadata '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});

		},
		/*
		 * Checkout a file
		 **/
		checkOutFile: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "checkOutFile";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;


			// Log submit data
			bizagi.debug("file checkout '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/*
		 * cancelCheckOut
		 **/
		cancelCheckOut: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "cancelCheckOut";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;

			// Log submit data
			bizagi.debug("file checkout '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/*
		 * Checkout a file
		 **/
		deleteECMFile: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "delete";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;

			// Log submit data
			bizagi.debug("delete file'" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/*
		 *  Update ECM file content
		 **/
		updateECMFileContent: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "updateECMFileContent";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;

			data.metaValues = params.metaValues;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;

			// Log submit data
			bizagi.debug("Update file content '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/*
		 *  Update file content
		 **/
		updateECMMetadata: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "updateECMMetadata";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;

			data.metaValues = params.metaValues;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;

			// Log submit data
			bizagi.debug("Update file meta data '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		getFileProperties: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "getFileProperties";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;

			// Log submit data
			bizagi.debug("Get file properties '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		uploadECMFile: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data.action = "uploadECMFile";
			data.fileUpload = params.fileUpload; // Content of file
			data.xPath = params.xPath;

			data.idAttrib = params.idAttrib;
			data.fileName = params.fileName;
			data.metaValues = params.metaValues;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;


			// Log submit data
			bizagi.debug("Upload ECM file '" + params.xPath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-ecm-upload-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		getECMFileUrl: function(params) {
			var self = this;
			var url = params.url || self.serviceLocator.getUrl("render-ecm-upload-url") + "File";

			// Define data
			var data = params.extra || {};

			data.action = "viewECMFile";
			data.idFileUpload = params.idFileUpload;
			data.xPath = params.xPath;
			data.idAttrib = params.idAttrib;

			data.fileName = params.fileName;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data.xpathContext = params.xpathContext;
			if(params.sessionId) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
			}
			if(params.p_sessionId) {
				data.p_sessionId = params.p_sessionId;
			}


			// Log submit data
			bizagi.debug("View uploaded file '" + params.xPath + "'", data);

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},
		/*
		 *
		 */
		isFileOnECM: function(params) {
			var self = this;

			// Define data
			var data = {};
			data["action"] = "isFileOnECM";
			data["idUpload"] = params.idUpload;

			//http://localhost/BizAgiR100x/Rest/Handlers/Metadata?action=isFileOnECM&idUpload=601
			//return $.read(self.serviceLocator.getUrl("async-ecm-upload-baseService"), data);

			// Call ajax and returns promise
			return $.read(self.serviceLocator.getUrl("render-ecm-upload-url"), data);
		},
		/*
		 *   Start a grid record edition
		 */
		editGridRecord: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "EDITRELATION";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			// Log submit data
			bizagi.debug("Sending edit request for relation '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-edit-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "EDITRELATION"
			});
		},
		/*
		 *   Sends a grid request to add a new row
		 *   The server returns the new row in json
		 */
		addGridRecord: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "ADDRELATION";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// Log submit data
			bizagi.debug("Sending add request for grid '" + params.xpath + "'", data);


			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-add-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "ADDRELATION"
			});
		},
		/*
		 *   Sends a grid request to add a new row, and sending the data at the same time
		 *   The server returns the new row in json
		 */
		addGridRecordData: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "ADDRELATIONWITHDATA";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			// Build data to submit
			var submitData = params.submitData || {};
			for(key in submitData) {
				data[key] = submitData[key];
			}

			// Log submit data
			bizagi.debug("Sending add request for grid '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-add-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "ADDRELATIONWITHDATA"
			});
		},
		/*
		 *   Submits the grid record data to the server
		 */
		saveGridRecord: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "SAVERELATION";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;

			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "disableServerGridValidations"] = params.disableServerGridValidations || false;

			// Send the submitted data page cache because it cointains the grid's form page cache
			if(params.submitData.idPageCache) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.submitData.idPageCache;
				delete params.submitData.idPageCache;
			}

			var submitData = params.submitData || {};

			// Build data to submit
			submitData = self.processDataValues(submitData);

			for(key in submitData) {
				data[key] = submitData[key];
			}

			// Log submit data
			bizagi.debug("Sending save request for grid '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-save-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "SAVERELATION"
			});
		},
		/*
		 *   Deletes a grid record in the server
		 */
		deleteGridRecord: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "REMOVERELATION";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			// Log submit data
			bizagi.debug("Sending delete request for grid '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-save-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "REMOVERELATION"
			});
		},

		/*
		 * Get association flipped status
		 */
		getFlipAssociation: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.id;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = "flipped";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "flipstate"] = params.flipstate;
			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			// Log request data
			bizagi.debug("Sending request for flip association control '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-property-refresh"),
				data: data,
				type: "POST",
				dataType: "text"
			}).pipe(function(response) {
				try {
					// Try to attempt to parse JSON
					return bizagi.services.ajax.parseJSON(response);
				} catch(e) {
					// If JSON is not valid we need to return the original text response
					return response;
				}
			});
		},
		/*
		 *   Cancels an add or edit request for a grid
		 */
		rollbackGridAction: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "ROLLBACK";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			if(params.contexttype) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			}

			// Log submit data
			bizagi.debug("Sending rollback request for grid '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-grid-rollback-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "ROLLBACK"
			});
		},
		/*
		 *   Returns the search render default image
		 */
		getSearchDefaultImage: function() {
			return bizagi.services.ajax.pathToBase + this.serviceLocator.getUrl("render-search-default-image");
		},

		processDataCriteria: function(criteria) {
			var o;
			criteria = $.extend(true, [], criteria);
			for(o in criteria) {
				if(criteria.hasOwnProperty(o) && criteria[o].hasOwnProperty("value") && $.type(criteria[o].value) == "object") {
					// for search
					if(criteria[o].value.hasOwnProperty("id") && criteria[o].value.hasOwnProperty("label")) {
						criteria[o].value = criteria[o].value.id;
					}
				}
			}
			return criteria;
		},

		/*
		 *   Perform entity search in the server
		 */
		submitSearch: function(params) {
			var self = this, criteria;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "SEARCHENTITYFORRENDER";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "searchForm"] = params.idSearchForm;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sort"] = params.sort;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "page"] = params.page;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "pageSize"] = params.rows;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "searchFilter"] = params.searchFilter;

			criteria = self.processDataCriteria(params.criteria);
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "searchCriteria"] = JSON.encode(criteria);

			// Optional search params
			if(params.allowFullSearch)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "allowFullSearch"] = params.allowFullSearch;
			if(params.maxRecords)
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "maxRowsAllowed"] = params.maxRecords;

			// Log submit data
			bizagi.debug("Performing advanced search", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-search-advanced-url"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "SEARCHENTITYFORRENDER"
			});
		},

		/*
		 *   Submits the stakeholder associated
		 */
		associateStakeholder: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "SAVE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey"] = params.surrogateKey;
			data["associatedUser"] = params.associatedUser;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guidentity;

			// Log submit data
			bizagi.debug("Property refresh for '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			// TODO: change REST library in order to support extra HTTP parameters
			// Please be careful with dataType parameter
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-stakeholder-associated"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json"
			});
		},

		/*
		 *   Refresh the stakeholder associated list
		 */
		refreshAssociateStakeholder: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = params.property;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// Log submit data
			bizagi.debug("Property refresh for '" + params.xpath + "'", data);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			// TODO: change REST library in order to support extra HTTP parameters
			// Please be careful with dataType parameter
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-stakeholder-associated"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json",
				serviceType: "PROCESSPROPERTYVALUE"
			});
		},

		/*
		 *   Gets the link to the letter
		 */
		getLetterNotEditableUrl: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "GETLETTER";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// Call ajax and returns promise
			var url = params.url || self.serviceLocator.getUrl("render-letter-notEditable-url");
			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},
		/*
		 *   Gets the content for editable letters
		 */
		getLetterContent: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "GETLETTER";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-letter-content-url"),
				data: data,
				type: "POST",
				dataType: "html"
			}).pipe(function(response) {
				try {
					return bizagi.services.ajax.parseJSON(response);
				} catch(e) {
					return response;
				}
			});
		},
		/*
		 *   Get the can generate letter flag
		 */
		getCanGenerateLetter: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "CANGENERATELETTER";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: self.serviceLocator.getUrl("render-letter-content-url"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/*
		 *   Saves the content for editable letters
		 */
		saveLetterContent: function(params) {
			var self = this;

			// Define data
			var data = params.extra || {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "UPDATELETTER";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

			// Define content
			var content = params.content || "";

			// Define url
			var url = params.url || (self.serviceLocator.getUrl("render-letter-save-url"));
			var fullUrl = url + "?" + jQuery.param(data);

			// Log submit data
			bizagi.debug("Save request for letter sent to: " + fullUrl, content);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare)
				return data;

			// Call ajax and returns promise
			return $.ajax({
				url: fullUrl,
				data: content,
				type: "POST",
				dataType: "html"
			});
		},
		/*
		 *   Returns the icons path for the letter plugin
		 */
		getLetterEditorIconsPath: function() {
			return bizagi.services.ajax.pathToBase + this.serviceLocator.getUrl("render-letter-content-icons");
		},
		/*
		 *   Executes a button action in the server
		 */
		executeButton: function(params) {
			return this.getPropertyData($.extend(params, {
				property: "buttonRule"
			}));
		},
		/*
		 *   Executes a fileprint action in the server
		 */
		getFilePrintUrl: function(params) {

			var self = this;
			var url = this.serviceLocator.getUrl("render-upload-data-url");
			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = "data";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "disposition"] = params.disposition;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);

		},
		/*
		 *   Start a link form edition
		 */
		editLinkForm: function(params) {
			// Actually it does the same than edit grid records
			return this.editGridRecord(params);
		},
		/*
		 *   Saves the content of the link form
		 */
		saveLinkForm: function(params) {
			// Actually it does the same than edit grid records
		    //return this.saveGridRecord(params);
		    var self = this;

		    // Define data
		    var data = params.extra || {};

		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "SAVEFORMLINKRELATION";
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;

		    if (params.contexttype) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
		    }

		    // Send the submitted data page cache because it cointains the grid's form page cache
		    if (params.submitData.idPageCache) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.submitData.idPageCache;
		        delete params.submitData.idPageCache;
		    }

		    var submitData = params.submitData || {};

		    // Build data to submit
		    submitData = self.processDataValues(submitData);

		    for (key in submitData) {
		        data[key] = submitData[key];
		    }

		    // Log submit data
		    bizagi.debug("Sending save request for grid '" + params.xpath + "'", data);

		    // If the parameter "prepare" is true, only return the data, so we can use the multiaction request
		    if (params.prepare)
		        return data;

		    // Call ajax and returns promise
		    return $.ajax({
		        url: params.url || self.serviceLocator.getUrl("render-grid-save-url"),
		        data: data,
		        type: "POST",
		        dataType: "json",
		        serviceType: "SAVEFORMLINKRELATION"
		    });
		},
		/*
		 *   Rollbacks the link form edition
		 */
		rollbackLinkForm: function(params) {
			// Actually it does the same than rollback grid records
			return this.rollbackGridAction(params);
		},
	    /*   Commit the link form edition
        */
		commitLinkForm: function (params) {
		    // Actually it does the same than rollback grid records
		    return this.commitGridAction(params);
		},
	    /*   Sends schekpoint action
        */
		sendCheckpoint: function (params) {
		    // Actually it does the same than rollback grid records
		    return this.sendCheckpointAction(params);
		},
		/*
		 *   Loads the userfield definition
		 */
		getUserfieldDefinition: function(params) {
			var self = this;
			params = params || {};

			// Check in deferreds cache
			if(self.userfieldRequests[params.userfield])
				return self.userfieldRequests[params.userfield];

			// Required params: idCase
			self.userfieldRequests[params.userfield] = $.read(self.serviceLocator.getUrl("render-userfield-definition"),
				{
					guidUserfield: params.userfield,
					device: (params.device || "desktop")
				}
			);

			// Return deferred
			return self.userfieldRequests[params.userfield];
		},
		/**
		 *  Get render json for one render o container
		 *  @param {object} params object with idRender,idPageCache
		 */
		refreshControl: function(params) {
			var self = this;
			params = params || {};

			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "REFRESH";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			(params.xpathContext) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext : "";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";
			(params.idForm) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idForm"] = params.idForm : "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("form-get-data"),
				data: data,
				type: "POST",
				dataType: "json",
				serviceType: "PARTIALREFRESH"
			});
		},
		/**
		 *  Get render json for one render o container
		 *  @param {object} params object with idRender,idPageCache
		 */
		refreshGridCell: function(params) {
			var self = this;
			params = params || {};

			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "REFRESHGRIDCELL";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidcolumn"] = params.column;
			(params.xpathContext) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext : "";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.idForm) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idForm"] = params.idForm : "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("form-get-data"),
				data: data,
				type: "POST",
				dataType: "json"
			});
		},
		/**
		 * Request to execute rule on server
		 * @param {object} params h_pageCacheId, guidrule
		 */
		executeRule: function(params) {
			var self = this;


			var data = {};
			params = params || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "EXECUTERULE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidrule"] = params.rule || "";
			(params.xpathContext) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext : "";
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.create(self.serviceLocator.getUrl("form-submit-data"), data);
		},
		/**
		 * Request to execute interface on server
		 * @param {object} params h_pageCacheId, guidinterface
		 */
		executeInterface: function(params) {
			var self = this;
			var data = {};
			params = params || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "EXECUTEINTERFACE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidinterface"] = params.interface || "";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext || "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.create(self.serviceLocator.getUrl("form-submit-data"), data);
		},
		/**
		 * Request to execute SAP Connecor
		 * @param {object} params h_pageCacheId, guidinterface
		 */
		executeSAPConnector: function(params) {
			var self = this;
			var data = {};
			params = params || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "EXECUTESAP";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidsap"] = params.guidsap || "";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext || "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.create(self.serviceLocator.getUrl("form-submit-data"), data);
		},
        /**
         * Request to execute a Bizagi connector
         * @param params
         * @return {{}}
         */
        executeConnector: function(params) {
			var self = this;
			var data = {};
			params = params || {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "EXECUTECONNECTOR";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidConnector"] = params.guidConnector || "";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext || "";

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			return $.create(self.serviceLocator.getUrl("form-submit-data"), data);
		},
		/*
		 *   Document Templates generate rest service
		 */
		generateDocumentTemplate: function(params) {
			var self = this;
			params = params || {};
			params.append = params.append ? params.append : false;

			return $.create(
				self.serviceLocator.getUrl("render-document-generate"),
				{
					h_pageCacheId: params.idPageCache,
					contextXpath: params.xpathcontext,
					groupMappingId: params.groupMapping,
					xpathAttribute: params.xpath,
					append: params.append,
					controlId: params.id
				}
			);
		},
		/*
		 *   Document Templates generate rest service
		 */
		getAllDocumentsDownloadUrl: function(params) {
			var self = this;
			var url = this.serviceLocator.getUrl("render-document-generateAllDocuments");
			var data = {};
			data["h_pageCacheId"] = params.idPageCache;
			data["contextXpath"] = params.xpathContext;
			data["xpathAttribute"] = params.xpath;
			data["idCase"] = params.idCase;
			data["idWorkItem"] = params.idWorkItem;
			data["p_sessionId"] = params.sessionId;

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);

		},


		getCaseNumber: function(params) {
			var self = this;
			//this function use sendEMail
			//and not possible use dat ain ajax
			//this is workaround (rhonyp)
			return $.ajax({
				url: self.serviceLocator.getUrl("case-handler-getCaseSummary").replace("{idCase}", params.idCase) + "?eventAsTasks=false&onlyUserWorkItems=true&mobileDevice=" + bizagi.isMobile(),
				type: "GET",
				dataType: "json"
			});
		},

		getCaseAssignees: function (params) {
			var self = this;
			params = params || {};
			// Required params: idCase
			return $.read(
				self.serviceLocator.getUrl("case-handler-getCaseAssignees"), {
					idCase: params.idCase
				}
			)
				.pipe(function (response) {
					return response;
				});
		},

		getWorkitems: function(params) {
			var self = this;
			params = params || {};

			return $.read(self.serviceLocator.getUrl("case-handler-getWorkItems"), {
				idCase: params.idCase,
				onlyUserWorkItems: params.onlyUserWorkItems || ""
			});
		},
		/*
		 *   Executes a grid export action in the server
		 */
		getGridExportUrl: function(params) {

			var self = this,
				url = this.serviceLocator.getUrl("render-upload-data-url"),
				data = {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = params.exportType; //"data";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "disposition"] = params.disposition;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sort"] = params.sort;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = params.sessionId;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "idForm"] = params.idForm;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			(params.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype : "";

			return self.verifyPathToBase(bizagi.services.ajax.pathToBase, url) + "?" + jQuery.param(data);
		},

		/*
		 * Executes a send email action in the server
		 */
		sendEmail: function(params) {
			var self = this;
			params = params || {};

			var data = {};
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "PROCESSPROPERTYVALUE";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "propertyName"] = params.property || "sendEmail";
			(params.xpathContext) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext : "";

			// Email parameters
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "to"] = params.to;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "subject"] = params.subject;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "message"] = params.message;
			data[self.Class.BA_ACTION_PARAMETER_PREFIX + "selected"] = JSON.encode(params.selected);

			// If the parameter "prepare" is true, only return the data, so we can use the multiaction request
			if(params.prepare) {
				return data;
			}

			var url = params.url || self.serviceLocator.getUrl("form-get-data");

			return $.create(url, data);
		},

		/*
		 * Search users usign parameters suchs as userName, fullName, domain and organization
		 * @params { domain: (string), userName: (string), fullName: (string), organization: (string), page: (int), pageSize: (int) }
		 * @return {deferred} ajax object with JSON content
		 */
		getUsersList: function(params) {
			var self = this;

			return $.read(self.serviceLocator.getUrl("admin-getUsersList"), params);
		},


		/*
		 * Search users usign parameters suchs as userName, fullName, domain and organization
		 * @params { domain: (string), userName: (string), fullName: (string), organization: (string), page: (int), pageSize: (int) }
		 * @return {deferred} ajax object with JSON content
		 */
		getUsersForAssignation: function(params) {
			var self = this;

			return $.read(self.serviceLocator.getUrl("admin-getUsersForAssignation"), params);
		},

        /**
         * Get Users Creation/Edition Form
         */
        getUsersForm: function (params) {
            var self = this;
            return $.create(self.serviceLocator.getUrl("admin-usersform"), params);
        },
		/**
		 *   Return generate Data To Send By Email
		 */
		generateDataToSendByEmail: function (params) {
			var self = this;
			params = params || {};
			var data = {
				action: "GenerateDataToSendByEmail",
				idUser: params.idUser,
				password: params.password
			};

			// Call ajax and returns promise
			return $.ajax({
				url: self.serviceLocator.getUrl("admin-GenerateDataToSendByEmail"),
				data: params,
				type: "POST",
				dataType: "json"
			});
		},
		/**
		 * Return generate Send user password Mail
		 */
		sendUserEmail: function (params) {
			var self = this;
			params = params || {};
			var data = {
				action: "SendUserEmail",
				emailTo: params.eMailTo,
				subject: params.subject,
				body: params.body
			};
			// Call ajax and returns promise
			return $.ajax({
				url: self.serviceLocator.getUrl("admin-sendUserEmail"),
				data: params,
				type: "POST",
				dataType: "json"
			});
		},

		/**
		 * Get bizagi configuration
		 * @param {Function}   type callback function when the file load is succed
		 * @return {deferred} ajax object with JSON content
		 */
		getConfiguration: function() {
			var self = this;
			var url = self.serviceLocator.getUrl("admin-users-config");

			return $.read(url);
		},

		/**
		 * Validate if url has 'http' string, in that case is not necesary add the pathToBase prefix
		 */
		verifyPathToBase: function(pathToBase, url) {

			if(url.indexOf("http") != -1 && pathToBase != "") {
				return url;
			} else {
				return pathToBase + url;
			}

		},

		/**
		 * Get template of entity
		 * @param params { guid, prepare}
		 */
		getTemplate: function(params) {
		    var self = this;
		    var data = {};
		    params = params || {};

		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "LOADTEMPLATE";
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = "entity";
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidEntity"] = params.guid;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isProcessData"] = params.forcePersonalizedColumns;

		    if (params.templateType) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "templatetype"] = params.templateType;
		    }

		    if (params.templateGuid) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "templateguid"] = params.templateGuid;
		    }

		    if (params.isDefaultTemplate != undefined) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isDefaultTemplate"] = params.isDefaultTemplate;
		    }

		    // Fix device type since on mobility there are tablet_ios, tablet_android, smartphone_ios, smartphone_ios
		    // and the service recives either tablet or smartphone		
		    var deviceType = bizagi.util.detectDevice();
		    if (bizagi.util.isTabletDevice()) {
		        deviceType = "tablet";
		    } else if (bizagi.util.isSmartphoneDevice()) {
		        deviceType = "mobile";
		    }

		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "devicetype"] = deviceType;

		    // When prepare is true just return data, this feature is used by multiaction service
		    if (params.prepare) {
		        return data;
		    }

		    return $.create(self.serviceLocator.getUrl("form-get-data"), data);
		},

		/**
		 * Chek if an entity has startform
		 * @param params
		 * @return {*}
		 */
		hasStartForm: function(params) {
			var self = this;
			var data = {};

			if(params.guidWFClass) {
				data.guidWFClass = params.guidWFClass;
			}

			return $.read(self.serviceLocator.getUrl("render-processes-startform"), data);
		},

		/**
		 * Get the start form of the case
		 * @param params
		 * @return {*}
		 */
		getStartForm: function(params) {
			var self = this;
			var data = {};

			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "LOADSTARTFORM";
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "guidprocess"] = params.guidprocess;
			data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "isActionStartForm"] = true;
			if(params.idStartScope) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idStartScope"] = params.idStartScope;
			}
			if(params.idCase) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idCase"] = params.idCase;
			}
			if(params.idStartScope) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idStartScope"] = params.idStartScope;
			}
            if(params.idWorkitem) {
                data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idWorkitem"] = params.idWorkitem;
            }
			if(params.additionalXpaths) {
				data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "additionalXpaths"] = params.additionalXpaths;
			}
			if(params.surrogatedKey) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "surrogatedKey"] = params.surrogatedKey;
			}
			if (params.recordXpath) {
			    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "recordlauncherxpath"] = params.recordXpath;
			}
            if (params.mappingstakeholders) {
                data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "mappingstakeholders"] = params.mappingstakeholders;
            }

			return $.ajax({
				url: self.serviceLocator.getUrl("form-get-data"),
				data: data,
				type: "POST",
				dataType: "json",
				cache: true
			});
		},
		/*
		 *   Start a link form edition
		 */
		editActionForm: function(params) {
			// Actually it does the same than edit grid records
			return this.editGridRecord(params);
		},

		/**
		 * Get list of actions in action launcher
		 * @param params
		 * @return {*}
		 */
		getActions: function(params) {
			var self = this;
			var extendParams = $.extend(params, {prepare: true});

			var data = self.getPropertyData(extendParams) || [];

			if(params.ptags) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "tags"] = params.ptags;
			}

			if(params.pmaxitems) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "maxitems"] = params.pmaxitems;
			}

			if(params.prepare) {
				return data;
			}

			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-property-refresh"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json",
				serviceType: "PROCESSPROPERTYVALUE",
				beforeSend: function(xhr, status) {
					bizagi.multiactionConnection = bizagi.multiactionConnection || [];
					bizagi.multiactionConnection.push(xhr);
				}
			});

		},

		/**
		 * Execute actions or constructors
		 * @param params
		 */
		executeActions: function(params) {
			var self = this;
			var extendParams = $.extend({}, params, {prepare: true});
			var data = self.getPropertyData(extendParams) || [];

			if(params.pguidConstructor) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "guidConstructor"] = params.pguidConstructor;
			}

			if(params.pguidAction) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "guidAction"] = params.pguidAction;
			}
			if(params.prepare) {
				return data;
			}
			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-property-refresh"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json",
				serviceType: "PROCESSPROPERTYVALUE"
			});

		},

		/**
		 * Get list of actions in action launcher
		 * @param params
		 * @return {*}
		 */
		getPolymorphicActions: function(params) {
			var self = this;
			var extendParams = $.extend(params, {prepare: true});
			var data = self.getPropertyData(extendParams) || [];

			if(params.ptags) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "tags"] = params.ptags;
			}

			if(params.additionalXpaths) {
				data[self.Class.BA_ACTION_PARAMETER_PREFIX + "additionalXpaths"] = params.additionalXpaths;
			}

			if(params.prepare) {
				return data;
			}

			return $.ajax({
				url: params.url || self.serviceLocator.getUrl("render-property-refresh"),
				data: data,
				type: "POST",
				dataType: params.dataType || "json",
				serviceType: "PROCESSPROPERTYVALUE"
			});
		},

		/**
		 * Make a JSON tree of polymorphic constructors categories
		 * @param values
		 * @return {Array}
		 */
		serializePolymorphicActions: function(values) {
			// json serializer
			var actions = [];
			var GUID_ENTITY = 0, DISPLAY_NAME = 1, XPATHCONTEXT = 2, TYPE = 3, GUID_OBJECT = 4, GUID_CONSTRUCTOR = 5, GUID_PARENT_ENTITY = 6;

			/**
			 * Get children by guid of entity
			 * @param guid
			 * @return {Array}
			 */
			var getChildren = function(guid) {
				var children = [];
				guid = guid || "";

				$.each(values, function(key, value) {
					if(value[GUID_PARENT_ENTITY] == guid) {
						children.push(value);
					}
				});
				return children;
			};

			/**
			 * Get parents by action object
			 * @param node
			 * @return {string}
			 */
			var getParents = function(node) {
				node = node || {};
				var parents = "";

				$.each(values, function(key, value) {
					if(value[GUID_ENTITY] == node[GUID_PARENT_ENTITY]) {
						parents += getParents(value) + value[DISPLAY_NAME] + " > ";
					}
				});
				return parents;
			};


			/**
			 * Make a tree of actions
			 * @param list
			 * @param guid
			 * @return {*}
			 */
			var	fillTree = function(list, guid) {
					var node;
					var children = getChildren(guid);
					$.each(children, function(key, value) {
						var child = fillTree([], value[GUID_ENTITY]);
						node = {
							"guidEntity": value[GUID_ENTITY],
							"displayName": value[DISPLAY_NAME],
							"hasConstructor": (value[GUID_CONSTRUCTOR]) ? true : false,
							"type": value[TYPE],
							"guidObject": value[GUID_OBJECT],
							"guidConstructor": value[GUID_CONSTRUCTOR],
							"xpathContext": value[XPATHCONTEXT],
							"children": child,
							"parents": getParents(value)
						};
						if(node.guidConstructor !== "" || node.children.length > 0) {
							list.push(node);
						}
					});

					return list;
				};
			fillTree(actions, "");
			return actions;
		},

		/**
		 * Gets the image for an entity xpath
		 * @param params
		 */
		getEntityImage64: function (params) {
			var self = this,
				data = {
					width: params.data,
					height: params.height,
					xpath: params.xpath
				},
		        url = self.serviceLocator.getUrl("render-entity-layout-image64").replace("{entity}", params.entity).replace("{surrogateKey}", params.surrogateKey);

			return $.ajax({
				url: url,
				data: data
			});
		},

		/**
		 * Get data files when user access from my stuff, because there is no scope
		 */
		getFilesDataForLayoutUploadControl: function(params){
			var self = this;
			return $.read(self.serviceLocator.getUrl("render-entity-layout-upload-files"), params);
		},

		/**
		* Process an upload file into the server
		* @param {} params 
		* @returns {} 
		*/
		processUploadFile: function (params) {
		        return $.ajax({
		            url: params.url,	            
		            data: params.formData,
		            type: "POST",
		            contentType: false,
		            processData: false
		        });
		},

	    /*
    *   Commit an add or edit request for a grid
    */
		commitGridAction: function (params) {
		    var self = this;

		    // Define data
		    var data = params.extra || {};

		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "COMMIT";
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

		    if (params.contexttype) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
		    }

		    // Log submit data
		    bizagi.debug("Sending rollback request for grid '" + params.xpath + "'", data);

		    // If the parameter "prepare" is true, only return the data, so we can use the multiaction request
		    if (params.prepare)
		        return data;

		    // Call ajax and returns promise
		    return $.ajax({
		        url: params.url || self.serviceLocator.getUrl("render-grid-commit-url"),
		        data: data,
		        type: "POST",
		        dataType: "json",
		        serviceType: "COMMIT"
		    });
		},
	    /*
        *   Commit an add or edit request for a grid
        */
		sendCheckpointAction: function (params) {
		    var self = this;

		    // Define data
		    var data = params.extra || {};

		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "CHECKPOINT";
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = params.xpath;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = params.idRender;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = params.xpathContext;
		    data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = params.idPageCache;

		    if (params.contexttype) {
		        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = params.contexttype;
		    }

		    // Log submit data
		    bizagi.debug("Sending checkpoint request for grid '" + params.xpath + "'", data);

		    // If the parameter "prepare" is true, only return the data, so we can use the multiaction request
		    if (params.prepare)
		        return data;

		    // Call ajax and returns promise
		    return $.ajax({
		        url: params.url || self.serviceLocator.getUrl("render-grid-checkpoint-url"),
		        data: data,
		        type: "POST",
		        dataType: "json",
		        serviceType: "CHECKPOINT"
		    });
		}

});
