/**
 * This module manage the tooltip to show information in activity map and subprocess diagrams
 *
 * @author Andrés Fernando Muñoz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activityMap.tooltip", {}, {

	/**
	 * Constructor
	 * @param workportalFacade instance of facade, mandatory
	 * @param dataService instance of service tier, mandatory
	 * @param params extra params, its not mandatory
	 */
	init: function(workportalFacade, dataService, params) {
		var self = this;
		// Call parent instance
		self._super(workportalFacade, dataService, params);
		//Load templates
		self.loadTemplates({
			"project-tooltip": bizagi.getTemplate("bizagi.workportal.desktop.widget.activityMap.tooltip").concat("#project-processmap-tooltip")
		});

		self.cache = {};
		self.radNumber = params.radNumber;
	},
	/**
	 * Render a content of the module
	 * @return {string} html
	 */
	renderContent: function(){},
	/**
	 * Set binding and set data
	 */
	postRender: function() {
		var self = this;
		self.dateFormat = self.getResource("dateFormat") + " " + self.getResource("timeFormat");
	},
	/**
	 *  Binds events to handlers
	 */
	configureHandlers: function (content, gqData) {
		var self = this;
		content.find('.ui-bizagi-wp-project-processmap-process').on('click', $.proxy(self.onProcess, self, gqData));
		content.find('.ui-bizagi-wp-project-processmap-tooltip-title').on('click', $.proxy(self.onIdCase, self, gqData));
	},
	/**
	 * Process handler
	 * @param ev
	 */
	onProcess: function(gqData, ev){
		var self = this;
		self.showGraphicQuery(gqData);
	},
	/**
	 * Id case handler
	 * @param ev
	 */
	onIdCase: function(gqData, ev){
		var self = this;
		var idCase = $(ev.currentTarget).data("idcase");
		var idWorkitem = $(ev.currentTarget).data("idworkitem");
		var idTask = $(ev.currentTarget).data("idtask");
		var idWorkflow = $(ev.currentTarget).data("idworkflow");

		self.publish("executeAction", {
			action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
			idCase: idCase,
			idWorkItem: idWorkitem,
			idTask: idTask,
			idWorkflow: idWorkflow
		});
	},
	/**
	 * Binds the tooltip to activities
	 * @param params
	 */
	bindTooltip: function (tooltipParams){
		var self = this;
		self.tooltipClass = tooltipParams.tooltipClass;
		tooltipParams.$container.tooltip({
			items: tooltipParams.items,
			content: function (callback) {
				var isContanerClicked = tooltipParams.$container.data("clicked") || false;
				if (isContanerClicked){
					return;
				}
				var diagram = tooltipParams.diagram;
				if(diagram == "activityMap"){
                    if(!$(this).is("circle")){
                        return;
                    } else if(this.className.baseVal.indexOf('activity-map-activity-highlight') < 0){
                    	return;
					}
					$.when(self.getActivityMapTooltipContent($(this))).done(function (content) {
						callback(content);
					});
				}else{
					var content = self.getSubprocessTooltipContent($(this));
					callback(content);
				}
				return "loading..";
			},
			open: function (event, ui) {
			    for (var i = 0; i < $(".ui-tooltip").length - 1; i++) {
			        $('#' + $(".ui-tooltip")[i].id).remove();
			    }
			    
			},
			show: { duration: 60, effect: 'none' },
			tooltipClass: self.tooltipClass,
			hide: { delay: 60, duration: 60 },
			position: { my: "left+20 top+20"},
			close: function (event, ui) {
				ui.tooltip.hover(
					function () {
						$(this).stop(true).fadeTo(120, 1);
					},
					function () {
						$(this).fadeOut(20, function () {
							$(this).remove();
						});
					}
				);
			}
		});
	},

	/**
	 * Returns the activity map tooltip content
	 * @param $ui
	 * @returns {*}
	 */
	getActivityMapTooltipContent: function ($ui) {
		var self = this, def = new $.Deferred(),
			guidWorkitem = $ui.data("guidWorkitem"),
			idCase = $ui.data("idCase"),
			idWorkflow = $ui.data("idWorkflow"),
			params = {
				guidWorkitem: guidWorkitem,
				gqData: {idCase: idCase, idWorkflow: idWorkflow}
			};
		self.guidWorkitem = guidWorkitem;

		if (self.isCached(params.guidWorkitem)){
			var data = self.cache[params.guidWorkitem];
			def.resolve(self.buildContent(data, params.gqData));
		}else{
			$.when(self.dataService.getActivitySummary(params)).done(function (data) {
				def.resolve(self.buildContent(data, params.gqData));
				self.appendToCache(params.guidWorkitem, data);
			});
		}
		return def.promise();
	},
	/**
	 * Returns the subprocess tooltip content
	 * @param $ui
	 * @returns {*}
	 */
	getSubprocessTooltipContent: function ($ui) {
		var self = this,
			idCase = $ui.data("idcase"),
			idWorkflow = $ui.data("idworkflow"),
			params = {
				gqData: {idCase: idCase, idWorkflow: idWorkflow}
			};

		var data = {
			"endDate": $ui.data("enddate"),
			"startDate": $ui.data("startdate"),
			"process": $ui.data("process"),
			"idCase": $ui.data("idcase")
		};
		return self.buildContent(data, params.gqData);
	},
	/**
	 * Fill the cache object with data for respective guidWorkitem
	 * @param guidWorkitem
	 * @param data
	 */
	appendToCache: function (guidWorkitem, data) {
		var self = this;
		self.cache[guidWorkitem] = data;
	},
	/**
	 * Returns true if the guidWorkitem is cached, false otherwise
	 * @param guidWorkitem
	 * @returns {boolean}
	 */
	isCached: function (guidWorkitem) {
		var self = this;
		return (typeof (self.cache[guidWorkitem]) !== "undefined");
	},
	/**
	 * Build the tooltip content
	 * @param data
	 * @param gqData
	 * @returns {*|jQuery|HTMLElement}
	 */
	buildContent: function (data, gqData){
		var self = this,
			content = $("<div></div>"),
			tmpl = self.getTemplate("project-tooltip"),
			assignee = (typeof (data.assigneeName) !== "undefined");

		data.assignee = assignee;
		data.radNumber = self.radNumber;
		data.idWorkflow = gqData.idWorkflow
		data.idTask = data.idTask || 0;
		data.idWorkitem = data.idWorkItem || 0;

		content = tmpl.render(data);
		$("."+self.tooltipClass).html(content);
		bizagi.util.formatInvariantDate(content, self.dateFormat);
		self.configureHandlers(content, gqData);
		return content;
	}
});