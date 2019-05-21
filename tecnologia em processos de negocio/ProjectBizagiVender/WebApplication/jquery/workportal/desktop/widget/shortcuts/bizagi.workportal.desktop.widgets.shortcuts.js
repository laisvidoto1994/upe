/**
 * Bizagi Workportal Desktop My Shortcuts list controller
 * @author Danny Gonzalez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.shortcuts", {}, {
	/**
	 * Constructor
	 * @param workportalFacade instance of facade, mandatory
	 * @param dataService instance of service tier, mandatory
	 * @param params extra params, its not mandatory
	 * @param processActionService
	 * @param accumulatedcontext
	 * @param notifier
	 */
	init: function(workportalFacade, dataService, processActionService, accumulatedcontext, notifier, params) {
		var self = this;
        self.requestsInProgressProcessGuid = {};
		self.params = params;
		self.processActionService = processActionService;
		self.accumulatedcontext = accumulatedcontext;
		self.notifier = notifier;

		// Call base
		self._super(workportalFacade, dataService, params);
		//Load templates
		self.loadTemplates({
			"myshortcuts": bizagi.getTemplate("bizagi.workportal.desktop.widget.shortcuts").concat("#shortcuts-wrapper")
		});
	},
	/**
	 * Renders the template defined in the widget
	 * @return {string} html
	 */
	renderContent: function() {
		var self = this;
		var template = self.getTemplate("myshortcuts");

        return $.when(self.getData()).done(function(data) {
            self.content = data.length > 0 ? template.render({shortcuts: data}) : '';
            return self.content;
        });
	},
    /**
     * links events with handlers
     */
    postRender: function() {
        var self = this;
        var $content = self.getContent();
        $('.wdg-srcts-container', $content).on("click", $.proxy(self.onClickShortcut, self));
    },
    /**
     *
     * @returns {*}
     */
    getData: function() {
        var self = this;

        return self.dataService.getMyShortcutsByCategory({icon:true}).then( function(data) {
            self.model = {};
            var category, i = -1;

            while (category = data[++i]) {
                var shortcut, j = -1;

                while (shortcut = category.items[++j]) {
                    var id = Math.guid();
                    shortcut.id = id;
                    self.model[id] = shortcut;
                }
            }
            return data;
        });
    },
	/**
	 * event listener for each action in the shrotcuts list
	 * @param ev
	 */
	onClickShortcut: function(ev) {
		var self = this;
		var $target = $(ev.target).closest('.wdg-srcts-container');
		var shortcut = self.model[$target.data('id')];
        self.target = $target;

        if(self.requestsInProgressProcessGuid[shortcut.idProcess])
            return;

        self.startLoading(self.target,shortcut.idProcess);

        if (shortcut) {
		    self.dataService.actionsHasStartForm({ processId: shortcut.idProcess }).done(function (data, $target) {
		        if (!data.startForm) {
		            self.dataService.actionCreateCase(shortcut).done(function (data) {
                        $.when(self.processActionService.launchActionsAfterCreateCase({
                            idCase: data.caseId,
                            caseNumber: data.caseNumber,
                            action: shortcut
                        })).done(function(){
                            self.stopLoading(self.target,shortcut.idProcess);
                        }) ;

                    });
		        }
				else {
		            var action = {
		                displayName: shortcut.displayName,
		                hasStartForm: data.startForm,
                        showConfirmation: shortcut.showConfirmation
		            };

                    $.when(self.processActionService.executeProcessAction({
		                action: action,
		                mappingstakeholders: true,
		                guidprocess: shortcut.idProcess
		            })).done(function(){
                        self.stopLoading(self.target,shortcut.idProcess);
                    });
		        }
		    }).fail(function () {
                self.notifier.showErrorMessage(
                    printf(
                        bizagi.localization.getResource('workportal-widget-sortbar-execute-error-message'),
                        shortcut.displayName
                    )
                );
                self.stopLoading(self.target,shortcut.idProcess);
            });
		}
	},
    /**
     * Detach handlers
     */
    clean: function() {
        var self = this;
        var $content = self.getContent();

        if($content) {
            $('.wdg-srcts-container', $content).off('click');
        }
    },

    /**
     * Start loading shortcut
     * */
    startLoading: function($target, idProcess){
        var self = this;
        $target.prepend("<div class=\"bz-wp-ls-list-item-loading\"><div class=\"ui-bizagi-loading-icon\"></div></div>");
        self.requestsInProgressProcessGuid[idProcess] = true;
    },

    /**
     * Stop loading shortcut
     * */
    stopLoading: function($target, idProcess){
        var self = this;
        $target.find(".bz-wp-ls-list-item-loading").remove();
        delete self.requestsInProgressProcessGuid[idProcess];
    }
});

bizagi.injector.register('bizagi.workportal.widgets.shortcuts', ['workportalFacade', 'dataService', 'processActionService', 'accumulatedcontext', 'notifier', bizagi.workportal.widgets.shortcuts]);