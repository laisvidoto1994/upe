/**
 * Name: Bizagi Workportal Desktop Paginator Controller
 * Author: Mauricio Sánchez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.paginator", {}, {

    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
        //Load templates
        self.loadTemplates({
            "paginator": bizagi.getTemplate("bizagi.workportal.desktop.widget.paginator").concat("#paginator-wrapper"),
            "content": bizagi.getTemplate("bizagi.workportal.desktop.widget.paginator").concat("#paginator-content")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var hide = self.params.referenceType === "ENTITY";
        var template = self.getTemplate("paginator" + self.getSuffixWidget());
        self.content = template.render({hide:hide});

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;

        self.sub("PAGINATOR-UPDATE", $.proxy(self.updateView, self));
        self.configureHandlers();
    },

    /**
     *
     * @returns {string}
     */
    getSuffixWidget: function(){
        return "";
    },

    /**
     * Updates la view with the data related to entity:
     * Name entity
     * Number of records
     * Number of pages
     * */
    updateView: function (ev, params) {
        var self = this;
        var args = params.args;
        var hide = args.referenceType === "ENTITY";
        var $content = self.getContent();

        self.setModel(args);
        $content.empty();

        if (args.fromActionLauncher){
            if (self.totalRecords > 1) {
                renderTemplate();
            }
            else {
                self.clean();
            }
        }
        else {
            renderTemplate();
        }

        /**
         *
         */
        function renderTemplate( ){
            var contentTemplate = self.getTemplate("content" + self.getSuffixWidget());

            contentTemplate.render({
                totalRecords: self.totalRecords,
                totalPages: self.totalPages,
                displayName: self.displayName,
                currentPage: self.currentPage,
                hide: hide
            }).appendTo($content);
        }
    },

    /**
     * Builds the navigation model
     */
    setModel: function (args) {
        var self = this;

        self.totalRecords = typeof(args.totalRecords) == "undefined" ?  self.totalRecords : args.totalRecords;
        self.totalPages = args.totalPages || self.totalPages;
        self.displayName = args.histName || self.displayName;
        self.currentPage = args.currentPage || self.currentPage;
        self.action = args.action;
        self.reference = args.reference || self.reference;
        self.surrogateKey = args.surrogateKey || self.surrogateKey;
        self.referenceType = args.referenceType || self.referenceType;
        self.event = args.event;
    },

    /**
     *  Gets the current model
     */
    getModel: function () {
        var self = this;

        return {
            page: self.currentPage,
            totalRecords: self.totalRecords,
            action: self.action,
            reference: self.reference,
            surrogateKey: self.surrogateKey,
            referenceType: self.referenceType,
            stopNavigation : true
        };
    },

    /**
     *  Binds events to handles
     */
    configureHandlers: function () {
        var self = this,
            $content = self.getContent();

        $content.on("click", $.proxy(self.onPageBreak, self));
    },

    /**
     * This event get a new page
     */
    onPageBreak: function (ev) {
        var self = this,
            $target = $(ev.target);

        if ($target.hasClass("control-icon") && !$target.hasClass("ui-state-disabled")) {
            var type = $target.data("type");

            if (type == "forward") {
                self.currentPage += 1;
            }
            else if (type == "rewind") {
                self.currentPage -= 1;
            }
            else if (type == "fastrewind") {
                self.currentPage = 1;
            }
            else {
                self.currentPage = self.totalPages;
            }

            self.pub("notify", { type: "UPDATE-DATATEMPLATE-VIEW", args: self.getModel() });
        }
    },

    /**
     *
     */
    clean: function(){
        var self = this;
        var $content = self.getContent();

        if($content){
            $content.empty();
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.paginator", ["workportalFacade", "dataService", bizagi.workportal.widgets.paginator]);