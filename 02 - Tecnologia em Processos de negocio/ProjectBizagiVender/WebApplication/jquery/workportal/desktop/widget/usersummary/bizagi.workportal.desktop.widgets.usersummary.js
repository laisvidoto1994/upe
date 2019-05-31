/**
 * Name: Bizagi Workportal Desktop Dashboard Controller
 * Author: Mauricio Sánchez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.usersummary", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.workportalFacade = workportalFacade;
        self.dataService = dataService;
        self.params = params;

        // Call base
        self._super(workportalFacade, dataService, params);
        //Load templates
        self.loadTemplates({
            "usersummary": bizagi.getTemplate("bizagi.workportal.desktop.widget.usersummary").concat("#usersummary-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("usersummary");

        return $.when(self.getData()).done(function(data){
            self.content = template.render(data);
        });
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this,
            $container = $(".wdg-usmry-stk-container", self.getContent());

        $container.on("click", "div.wdg-usmry-see-more", $.proxy(self.showStakeholders, self));
    },

    /**
     * Show the tooltip if the user have more of 3 stakeholder related
     */
    showStakeholders: function () {
        var self = this,
            $tooltip = $(".wdg-usmry-stk-overlay", self.getContent());

        $tooltip.show( "fast", function(){
            $tooltip.click(function (e) {
                e.stopPropagation();
            });
            $(document).one("click", function () {
                $tooltip.hide( "fast" );
            });
        });
    },

    /**
     * End point service to get User Info
     */
    getData: function () {
        var self = this;

        if(!bizagi.currentUser) {
            return self.dataService.getCurrentUser().then(function (data) {
                bizagi.currentUser = data;
                return self.getInfoToUser(data);
            });
        }

        return this.getInfoToUser(bizagi.currentUser);
    },

    /**
     * Organize the user info to return the necessary format
     */
    getInfoToUser : function (currentUser) {
        var stakeholders = [];
        var totalStakeholders = currentUser.associatedStakeholders.length;
        var stakeholdersToShow = currentUser.associatedStakeholders.slice(0, 2);
        var stakeholdersHidden = currentUser.associatedStakeholders.slice(2, totalStakeholders);
        var showMore = (totalStakeholders > 2);

        $.each(stakeholdersToShow, function (index, item) {
            stakeholders.push(item.displayName);
        });

        var data = {
            user: currentUser.userName,
            stakeholders: (stakeholders.length > 0) ? stakeholders.join(', ') : '--',
            stakeholdersHidden: (stakeholdersHidden.length > 0) ? stakeholdersHidden : '',
            showMore: showMore,
            orgArray: stakeholders,
            initials: currentUser.initials
        };

        if (currentUser.userPicture) {
            data.photo = 'data:image/png;base64,' + currentUser.userPicture;
        }

        return data;
    }
});

bizagi.injector.register('bizagi.workportal.widgets.usersummary', ['workportalFacade', 'dataService', bizagi.workportal.widgets.usersummary]);