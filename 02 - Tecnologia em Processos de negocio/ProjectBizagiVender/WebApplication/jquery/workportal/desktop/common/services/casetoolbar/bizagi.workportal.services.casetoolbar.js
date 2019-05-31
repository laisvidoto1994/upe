bizagi.workportal.services.casetoolbar = (function (dataService, notifier, loadTemplatesService, globalHandlersService) {
    var self = this;

    //load Templates
    loadTemplatesService.loadTemplates({
        'casetoolbarTemplate': bizagi.getTemplate('bizagi.workportal.services.casetoolbar').concat('#casetoolbar-wrapper')
    });

    /**
     * Set handlers to some elements in the widget
     */
    self.configureHandlers = function ( $casestoolbarTemplate ) {
        $casestoolbarTemplate.on('click', '.btn-view', self.onClickViewPath);
        $casestoolbarTemplate.on('click', '.btn-fallowing', self.onClickFavorite);
        $casestoolbarTemplate.on('click', '.btn-workonit', self.onClickWorkOnIt);
        $casestoolbarTemplate.find(".casetoolbar ul li").tooltip();
    };

    /**
     * load services if is necesary
     * @param params
     * @returns {boolean}
     */
    self.getCaseToolbar = function (params) {
        var $casestoolbar = loadTemplatesService.getTemplate("casetoolbarTemplate");
        var $casestoolbarTemplate = $casestoolbar.render(params);

        self.configureHandlers($casestoolbarTemplate);
        return $casestoolbarTemplate;
    };

    /***
     *
     * @param event
     */
    self.onClickFavorite = function (event) {
        event.preventDefault();
        var self = this,
            favoriteOptions = {},
            message = "",
            title = "",
            $idCase = $(event.target).parent().data('idcase');

        if ($(event.target).hasClass("on")) {
            favoriteOptions = {
                idObject: $(event.target).parent().data('guid'),
                favoriteType: "CASES"
            };
            $.when(dataService.delFavorite(favoriteOptions)).done(function (favoritesData) {
                message = bizagi.localization.getResource('workportal-service-casetoolbar-following-off');
                message = message.replace('{0}', $idCase);
                $(event.target).toggleClass("on");
                notifier.showSucessMessage(message, title, {});
            });
        }
        else {
            favoriteOptions = {
                idObject: $(event.target).parent().data('idcase'),
                favoriteType: "CASES"
            };
            $.when(dataService.addFavorite(favoriteOptions)).done(function (favoritesData) {
                message = bizagi.localization.getResource('workportal-service-casetoolbar-following-on');
                message = message.replace('{0}', $idCase);
                $(event.target).parent().attr('data-guid', favoritesData.idFavorites);
                $(event.target).toggleClass("on");
                notifier.showSucessMessage(message, title, {});
            });
        }
    };

    /**
     *
     * @param event
     */
    self.onClickViewPath = function (event) {
        event.preventDefault();
        var target = $(event.target).closest('.btn-view');
        var params = {
            idCase: target.data('idcase'),
            idWorkflow: target.data('idworkflow')
        };

        bizagi.loader.start("processviewer").then(function () {
            globalHandlersService.showDialogWidget({
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GRAPHIC_QUERY,
                data: params,
                modalParameters: {
                    title: bizagi.localization.getResource("render-graphic-query"),
                    refreshInbox: false
                },
                maximizeOnly: true
            });
        });
    };

    /**
     *
     * @param event
     */
    self.onClickWorkOnIt = function (event) {
        globalHandlersService.publish('executeAction', {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: $(event.target).parent().data('idcase')
        });
    };

    return {
        getCaseToolbar: self.getCaseToolbar
    };

});

bizagi.injector.register('casetoolbar', ['dataService', 'notifier', 'loadTemplatesService', 'globalHandlersService', bizagi.workportal.services.casetoolbar]);