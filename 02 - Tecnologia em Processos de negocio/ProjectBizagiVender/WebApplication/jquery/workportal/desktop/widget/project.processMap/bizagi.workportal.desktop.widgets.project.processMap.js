/**
 * This module manage all graphical diagrams of process map
 *
 * @author Edward J Morales
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.processMap", {}, {

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
			"project-processmap": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-wrapper"),
			"project-process-diagram": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-process-diagram"),
			"project-activity-map": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-activity-map"),
			"project-subprocess": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-subprocess")
		});
	},

	/**
	 * Render a content of the module
	 * @return {string} html
	 */
	renderContent: function() {
		var self = this;
		var template = self.getTemplate("project-processmap");
		var data = self.viewOptions =  {
            processDiagram: bizagi.util.parseBoolean(self.params.showProcessDiagram) !== null ? bizagi.util.parseBoolean(self.params.showProcessDiagram) : true,
            activityMap: bizagi.util.parseBoolean(self.params.showActivityMap) !== null ? bizagi.util.parseBoolean(self.params.showActivityMap) : true,
            processMap: bizagi.util.parseBoolean(self.params.showProcessMap) !== null ? bizagi.util.parseBoolean(self.params.showProcessMap) : true
        }
        self.viewOptions.showTabs = (Number(data.processDiagram) + Number(data.activityMap) + Number(data.processMap)) > 1;
        self.content = template.render(self.viewOptions);
		return self.content;
	},

	/**
	 * Set binding and set data
	 */
	postRender: function() {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent());
		if ($($content).is(":empty")) {
		    if (self.viewOptions.processDiagram) {
		        self.onProcessDiagram();
		    } else if (self.viewOptions.activityMap) {
		        self.onActivityMap();
		    } else if (self.viewOptions.processMap) {
		        self.onSupprocess();
		    }
		}

		self.configureHandlers();
		self.resize();
	},

	/**
	 *  Binds events to handlers
	 */
	configureHandlers: function() {
		var self = this,
			$content = self.getContent(),
			$processDiagram = $(".ui-bizagi-wp-project-processmap-process-diagram", $content),
			$activityMap = $(".ui-bizagi-wp-project-processmap-activity-map", $content),
			$subProcess = $(".ui-bizagi-wp-project-processmap-subprocess", $content);

		var toogleClass = function(target) {
			$(".selected", $content).removeClass("selected");
			$(target).addClass("selected");
		};

		$processDiagram.on("click", function() {
			toogleClass(this);
			self.onProcessDiagram();
		});
		$activityMap.on("click", function() {
			toogleClass(this);
			self.onActivityMap();
		});
		$subProcess.on("click", function() {
			toogleClass(this);
			self.onSupprocess();
		});
	},

	/**
	 * Process diagram handler
	 */
	onProcessDiagram: function() {
		var self = this;

		self.navigationManager(self.getTemplate("project-process-diagram"));
		self.renderProcessDiagram();
	},

	/**
	 * Activity map handler
	 */
	onActivityMap: function() {
		var self = this;
		self.navigationManager(self.getTemplate("project-activity-map"));
		self.renderActivityMap();
	},

	/**
	 * Subprocess handler
	 */
	onSupprocess: function() {
		var self = this;
		var content = self.getContent();
		self.navigationManager(self.getTemplate("project-subprocess"));
		var tooltipParams = {
			diagram: "subprocess",
			$container: $(".ui-bizagi-wp-project-processmap-subprocess-content", content),
			tooltipClass: "bz-gq-subprocess-tooltip-wrapper",
			items: ".subprocess-tooltip",
			radNumber: bizagi.context.radNumber
		};
		self.renderSubProcessMap();
		self.bindTooltip(tooltipParams);
		self.appendSubprocessZoom();
		self.appendSubprocessDragScroll();
	},

	/**
	 * Manage navigation between the 3 diagrams
	 * @param template
	 * @param params
	 */
	navigationManager: function(template) {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent());
		$($content).empty();
		$($content).append(template.render(self.viewOptions));
	},

	/**
	 * Render the process diagram in the process diagram container
	 */
	renderProcessDiagram: function() {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent()),
			widget,
			idCase = self.params.idCase || bizagi.context.idCase || 0,
			idWorkflow = self.params.idWorkflow || bizagi.context.idWorkflow || 0;

		//if access to process map from the context: activity of plan, so get data from parent
		if(self.params.plan.idActivitySelected){
			idCase = self.params.plan.firstParent.idCase;
			idWorkflow = self.params.plan.firstParent.idWorkflow || 0;
		}

		var params = {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_PROCESS_DIAGRAM_HELPER,
			data: {idCase: idCase, idWorkflow: idWorkflow}
		};
		var widgetInstancePromise = params.widgetInstance ? params.widgetInstance : self.workportalFacade.getWidget(params.widgetName, params);
		// Creates widget
		$.when(widgetInstancePromise)
			.pipe(function(result) {
				widget = result;
				return widget.render(params);
			}).done(function() {
				var content = widget.getContent();
				var $processDiagramContent = $(".ui-bizagi-wp-project-processmap-process-diagram-content", $content);
				$($processDiagramContent).append(content);
				self.resize();
			});

		
	},

	resize: function () {
	    var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent()),
	        heightWindow = $(window).height();
	},
	/**
	 * Set plugin activity map, draw sequence map
	 */
	renderActivityMap: function() {
		var self = this;
		var content = self.getContent();
		var radNumber = bizagi.context.radNumber || null;
		var idCase = bizagi.context.idCase || null;

		$.when(self.dataService.getActivityMap({
			radNumber: radNumber
		})).done(function(data) {
			$("#bz-activity-map", content).empty();
			if(typeof data.activities === "undefined" || data.activities.length === 0)
			{
				var emptyMessage = "<div class=\"admin-stakeholder-message\"> " +
					"<i class=\"bz-wp-empty__img\"></i> " +
					"<p class=\"bz-wp-empty__info bz-wp-empty__info--first\"> " +
					bizagi.localization.getResource("workportal-general-first-line-no-records-found") +
					"</p></div>";
				$("#bz-activity-map", content).append(emptyMessage);
				$(".bz-zoom-container", content).hide();
			}
			else{
				$("#bz-activity-map", content).activityMap({
					data: data,
					width: "100%",
					height: "100%",
					currentActivity: idCase
				});
				var tooltipParams = {
					diagram: "activityMap",
					$container: $(".ui-bizagi-wp-project-processmap-activity-map-content", content),
					tooltipClass: "bz-gq-activity-map-tooltip-wrapper",
					items: ".activity-map-tooltip",
					radNumber: bizagi.context.radNumber
				};
				self.bindTooltip(tooltipParams);

				$(".bz-zoom-container", content).show();
				self.appendActivityMapZoom();
				self.resize();
			}
		});
	},

	renderSubProcessMap: function() {
		var self = this;
		var content = self.getContent();
		var radNumber = bizagi.context.radNumber || null;
		var container = $("#bz-subprocess-map", content);

		$.when(self.dataService.getSubProcessMap({
			radNumber: radNumber
		})).done(function(data) {
			container.height($(window).height() - 250);
			container.processMap({
				data: data
			});
			var tooltipParams = {
				diagram: "subprocess",
				$container: $(".ui-bizagi-wp-project-processmap-subprocess-content"),
				tooltipClass: "bz-gq-subprocess-tooltip-wrapper",
				items: ".subprocess-tooltip",
				radNumber: bizagi.context.radNumber
			};
			self.bindTooltip(tooltipParams);
			$(".bz-zoom-container", content).show();
			self.appendProcessMapZoom();

			self.resize();
		});
	},

	/**
	 * Append the activity map zoom
	 */
	appendActivityMapZoom: function() {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent());
		var $processDiagramContent = $(".bz-activity-map-zoom-wrapper", $content);
		$processDiagramContent.zoom({
			onZoom: function(value) {
				$("#bz-activity-map").trigger("zoom", [value / 100]);
			}
		});

	},

	/**
	 * Append the process map zoom
	 */
	appendProcessMapZoom: function() {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-content", self.getContent());
		var $processDiagramContent = $(".bz-processmap-zoom-wrapper", $content);
		$processDiagramContent.zoom({
			onZoom: function(value) {
				$("#bz-subprocess-map").trigger("zoom", [value / 100]);
			}
		});

	},

	/**
	 * Append the subprocess zoom
	 */
	appendSubprocessZoom: function() {
		var self = this,
			$content = $(".ui-bizagi-wp-project-processmap-subprocess-content", self.getContent()),
			$subProcess = $("#bz-subprocess-map", self.getContent());
		var $processDiagramContent = $(".bz-subprocess-zoom-wrapper"/*, $content*/);
		$processDiagramContent.zoom({
			onZoom: function(value) {
				$subProcess.processMap("scale", value / 100);
			}
		});

	},
	/**
	 * Append the subprocess drag and scroll
	 */
	appendSubprocessDragScroll: function() {
		var self = this,
			$scrollable = $(".ui-bizagi-wp-project-processmap-subprocess-content", self.getContent());
		$content = $("#bz-subprocess-map", self.getContent());
		$content.dragScroll({
			$scrollable: $scrollable
		});

	},

	/**
	 * binds the tooltip to each activity in activity map
	 */
	bindTooltip: function(tooltipParams) {
		var self = this;
		var widget;
		var params = {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_ACTIVITY_MAP_TOOLTIP,
			radNumber: tooltipParams.radNumber
		};
		var widgetInstancePromise = params.widgetInstance ? params.widgetInstance : self.workportalFacade.getWidget(params.widgetName, params);

		$.when(widgetInstancePromise)
			.pipe(function(result) {
				widget = result;
				return widget.render(params);
			}).done(function() {
				widget.bindTooltip(tooltipParams);
			});
	}
});

bizagi.injector.register('bizagi.workportal.widgets.project.processMap', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.processMap]);