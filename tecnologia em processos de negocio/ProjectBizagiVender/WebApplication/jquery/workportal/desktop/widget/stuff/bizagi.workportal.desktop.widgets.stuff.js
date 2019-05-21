/**
 * Bizagi Workportal Desktop Stuff Controller
 * @author Alexander Mejia
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.stuff", {}, {
	/**
	 * Constructor
	 * @param workportalFacade
	 * @param dataService
	 * @param accumulatedcontext
	 * @param params
	 */
	init: function(workportalFacade, dataService, accumulatedcontext, params) {
		var self = this;
        self.accumulatedcontext = accumulatedcontext;

		// Call base
		self._super(workportalFacade, dataService, params);
		//Load templates
		self.loadTemplates({
			"stuff": bizagi.getTemplate("bizagi.workportal.desktop.widget.stuff").concat("#stuff-wrapper")
		});
	},
	/**
	 * Renders the template defined in the widget
	 * @return {*}
	 */
	renderContent: function() {
		var self = this;
		var template = self.getTemplate("stuff");

        return $.when(self.getData()).done(function(data) {
            self.content = data.collections.length > 0 ? template.render(data) : "";
            return self.content;
        });
	},
	/**
	 * links events with handlers
	 */
	postRender: function() {
		var self = this;
		var $content = self.getContent();

		$('.wdg-stf-card', $content).on("click", $.proxy(self.onClickEntity, self));
		self.sub('TEMPLATEENGINE-VIEW', $.proxy(self.selectItem, self));
	},
    /**
     *
     * @returns {*}
     */
    getData: function() {
        var self = this;

        return $.when(self.dataService.getUserStuff({icon:true})).then(function(data) {
            data = self.buildModel(data) || {};
            return {
                title: bizagi.localization.getResource("workportal-widget-dashboard-stuff"),
                collections: data
            };
        });
    },
    /**
     * Add style to the selected item
     */
	selectItem: function () {
	    var self = this;
		$('.wdg-stf-card', self.content).removeClass('wdg-stf-selected');
	    $("#" + arguments[1].args.reference, self.content).addClass('wdg-stf-selected');
	},
	/**
	 * Holds a refence to each collection
	 * @param data
	 * @return {Array}
	 */
	buildModel: function(data) {
        var self = this;
		var collections = {};
        var items = [];
        data = data || {};
		self.model = {};

		for (var i = 0, lf = data.length; i < lf; i++) {
			var item = data[i];
			item.guid = Math.guid();
			collections[item.guid] = item;
			items.push(item);
		}

		self.model.collections = collections;

		return items;
	},
	/**
	 * Raises the execution of templates for the entity selected
	 * @param ev
	 */
	onClickEntity: function(ev) {
		var self = this;
		var target = $(ev.target).closest('.wdg-stf-card');
		var item = self.model.collections[target.data('guid')];
		var args = {
            calculateFilters: true,
            filters: [],
            fromActionLauncher: false,
            histName: target.data('title') || item.displayName,
            level: 1,
            page: 1,
            reference: item.reference,
            referenceType: item.referenceType,
            surrogateKey: item.surrogateKey
		};

        if (typeof item.entityId !== "undefined" && item.entityId) {
            args.guidEntityCurrent = item.entityId;
        }
        if (typeof item.xpath !== "undefined" && item.xpath) {
            args.xpath = item.xpath;
        }

		self.accumulatedcontext.clean();

		self.pubDeadLockDetection("notify", {type: "TEMPLATEENGINE-VIEW", args: args});
	},
	/**
	 *  Detach events linked
	 */
	clean: function() {
		var self = this;
		var $content = self.getContent();

		if($content) {
			$('.wdg-stf-card', $content).off('click');
			self.unsub('TEMPLATEENGINE-VIEW');
		}
	}
});

bizagi.injector.register('bizagi.workportal.widgets.stuff', ['workportalFacade', 'dataService', 'accumulatedcontext', bizagi.workportal.widgets.stuff]);