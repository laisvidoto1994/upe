/**
 * Unit Testing bizagi.workportal.desktop.facade
 */

describe("Desktop Facade", function () {
    var workportalFacade;
    bizagi.currentUser = {
        "sUserProperties": [
            {"key": "userstartpage","value": ""}
        ],
        "associatedStakeholders": [
            {
                "idEnt": 10005
            }
        ]
    };
    it("Environment has been defined", function(){
        workportalFacade = new bizagi.workportal.facade();
    });
    describe("Get widget to load", function () {
        describe("When userstartpage property value is empty or 1", function () {
            it("Should be automatic", function () {
                bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX, { expires: 30 });
                spyOn(workportalFacade, "getWidgetByCookieAndStakeholders");
                workportalFacade.getWidgetByDataUser();
                expect(workportalFacade.getWidgetByCookieAndStakeholders).toHaveBeenCalled();
            });
        });
        describe("When userstartpage property value is 2", function () {
            describe("and have stakeholders associated", function () {
                it("Should Me", function () {
                    bizagi.currentUser.sUserProperties[0].value = "2";

                    spyOn(workportalFacade, "currentUserHaveStakeholderAssociated").and.returnValue(true);

                    expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL);
                    expect(workportalFacade.currentUserHaveStakeholderAssociated).toHaveBeenCalled();
                });
            });
            describe("and dont have stakeholders associated", function () {
                it("Should be by cookie and force inbox or inboxGrid : Test inbox", function () {
                    bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX, { expires: 30 });
                    bizagi.currentUser.sUserProperties[0].value = "2";

                    spyOn(workportalFacade, "currentUserHaveStakeholderAssociated").and.returnValue(false);
                    spyOn(workportalFacade, "getWidgetByCookie").and.callThrough();

                    expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX);
                    expect(workportalFacade.getWidgetByCookie).toHaveBeenCalledWith(true);
                });

                it("Should be by cookie and force inbox or inboxGrid : Test homeportal", function () {
                    bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL, { expires: 30 });
                    bizagi.currentUser.sUserProperties[0].value = "2";

                    spyOn(workportalFacade, "currentUserHaveStakeholderAssociated").and.returnValue(false);
                    spyOn(workportalFacade, "getWidgetByCookie").and.callThrough();

                    expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID);
                    expect(workportalFacade.getWidgetByCookie).toHaveBeenCalledWith(true);
                });

                it("Should be by cookie and force inbox or inboxGrid : Test inbox grid", function () {
                    bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID, { expires: 30 });
                    bizagi.currentUser.sUserProperties[0].value = "2";

                    spyOn(workportalFacade, "currentUserHaveStakeholderAssociated").and.returnValue(false);
                    spyOn(workportalFacade, "getWidgetByCookie").and.callThrough();

                    expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID);
                    expect(workportalFacade.getWidgetByCookie).toHaveBeenCalledWith(true);
                });
            });
        });
        describe("When userstartpage property value is 3", function () {
            it("Should be force inbox : test inbox grid", function () {
                bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID, { expires: 30 });
                bizagi.currentUser.sUserProperties[0].value = "3";

                spyOn(workportalFacade, "getWidgetByCookie").and.callThrough();

                expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID);
                expect(workportalFacade.getWidgetByCookie).toHaveBeenCalledWith(true);
            });

            it("Should be force inbox : test inbox", function () {
                bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX, { expires: 30 });
                bizagi.currentUser.sUserProperties[0].value = "3";

                spyOn(workportalFacade, "getWidgetByCookie").and.callThrough();

                expect(workportalFacade.getWidgetByDataUser()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX);
                expect(workportalFacade.getWidgetByCookie).toHaveBeenCalledWith(true);
            });
        });

        describe("When the widget to load is different: homeportal, inbox, inboxgrid", function () {
            var OTHER_WIDGET = "other";
            it("Should be load the different widget always", function () {
                bizagi.cookie("bizagiDefaultWidget", OTHER_WIDGET, { expires: 30 });
                expect(workportalFacade.getWidgetByDataUser()).toBe(OTHER_WIDGET);
            });
        });

    });
});