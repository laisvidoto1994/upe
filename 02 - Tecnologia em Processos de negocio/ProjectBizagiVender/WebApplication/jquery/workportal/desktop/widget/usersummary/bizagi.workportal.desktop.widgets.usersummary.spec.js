describe("Widget desktop.widgets.usersummary", function () {
    var widget;
    var $content = null;
    var currentUser = {
        "idUser": 3,
        "user": "domain\\Client",
        "userName": "Client",
        "domain": "domain",
        "delegateUserName": "",
        "idDelegateUser": -1,
        "enableExpireAccount": true,
        "groupSeparator": ".",
        "language": "es-ES",
        "decimalSeparator": ",",
        "decimalDigits": "2",
        "symbol": "€",
        "shortDateFormat": "dd/MM/yyyy",
        "timeFormat": "H:mm",
        "longDateFormat": "dddd, d' de 'MMMM' de 'yyyy",
        "twoDigitYearMax": 2029,
        "twoDigitYearMaxDelta": 14,
        "uploadMaxFileSize": "1048576",
        "allowSaveCredentials": true,
        "offlineForms": false,
        "isMultiOrganization": "false",
        "sArea": "",
        "userFullName": "Amanda Client",
        "sRoles": [],
        "sUserProperties": [
            {
                "key": "contactemail",
                "value": "andrea.dominguez@bizagi.com"
            },
            {
                "key": "userpicture",
                "value": "0"
            },
            {
                "key": "delegateenabled",
                "value": ""
            },
            {
                "key": "username",
                "value": "Client"
            },
            {
                "key": "normalcost",
                "value": ""
            },
            {
                "key": "enabled",
                "value": "True"
            },
            {
                "key": "createdcasesskipassigrules",
                "value": "False"
            },
            {
                "key": "iduser1",
                "value": ""
            },
            {
                "key": "idworkingtimeschema",
                "value": ""
            },
            {
                "key": "fullname",
                "value": "Amanda Client"
            },
            {
                "key": "notifbymessenger",
                "value": ""
            },
            {
                "key": "iddelegate",
                "value": ""
            },
            {
                "key": "enabledforassignation",
                "value": "1"
            },
            {
                "key": "idarea",
                "value": ""
            },
            {
                "key": "iduser",
                "value": "3"
            },
            {
                "key": "overtimecost",
                "value": ""
            },
            {
                "key": "notifbycell",
                "value": ""
            },
            {
                "key": "contactcell",
                "value": ""
            },
            {
                "key": "idlocation",
                "value": ""
            },
            {
                "key": "wfclassaccesscacheexpiry",
                "value": ""
            },
            {
                "key": "notifbyemail",
                "value": "True"
            },
            {
                "key": "idbossuser",
                "value": ""
            },
            {
                "key": "contactmessenger",
                "value": ""
            },
            {
                "key": "offlineforms",
                "value": "True"
            },
            {
                "key": "language",
                "value": ""
            },
            {
                "key": "domain",
                "value": "domain"
            },
            {
                "key": "idtimezone",
                "value": ""
            }
        ],
        "sPositionName": "",
        "sPositionDisplayName": "",
        "associatedStakeholders": [
            {
                "idEnt": 10002,
                "name": "Client",
                "displayName": "Client",
                "guid": "d2c3bfa7-026c-487f-8d66-e44c4fefd917"
            },
            {
                "idEnt": 10007,
                "name": "Grouptrainer",
                "displayName": "Group trainer",
                "guid": "56dc2177-b907-4ace-a242-bf49206fdc93"
            },
            {
                "idEnt": 10023,
                "name": "Gymmanager",
                "displayName": "Gym manager",
                "guid": "96b3fa9a-7909-4db8-95cb-04781be8a69f"
            }
        ]
    };

    checkWorkportalDependencies();

    beforeEach( function () {
        bizagi = bizagi || {};
        bizagi.currentUser = currentUser;
    });

    it("Environment has been defined", function (done) {
        widget = new bizagi.workportal.widgets.usersummary(dependencies.workportalFacade, dependencies.dataService, {});

        $.when(widget.areTemplatedLoaded()).then(function () {
            return widget.render();
        }).done(function ($content) {
            dependencies.canvas.empty();
            dependencies.canvas.append($content);

            expect($content).not.toBe("");
            expect($content).toBeDefined();

            done();
        });
    });

    describe("postRender function and validate call of functions handlers", function(){
        beforeEach(function () {
            $content = widget.getContent();
        });

        it("Should render the ellipsis", function(){
            expect($content.find(".ellipsis-icon").length).toEqual(1);
        });

        it("Should have configured the handlers for the tooltip", function(){
            // Check that the tooltip isn't open
            expect($(".wdg-usmry-stk-overlay", $content).css('display')).toBe('none');

            // Click the see more to open the tooltip
            $('.wdg-usmry-see-more', $content).click();

            // Check that the tooltip is displayed
            expect($(".wdg-usmry-stk-overlay", $content).css('display')).toBe('block');
        });
    });

    describe("Behavior when the user have 3 or less stakeholders", function(){
        beforeEach(function () {
            bizagi.currentUser.associatedStakeholders = [
                {
                    "idEnt": 10023,
                    "name": "admon",
                    "displayName": "Client",
                    "guid": "3ecdb3da-e0c2-4c02-ad6e-df9ba070de63"
                },
                {
                    "idEnt": 10025,
                    "name": "entrepenur",
                    "displayName": "nurse",
                    "guid": "c5c8310a-53ef-4567-aaf4-1d71f6b384df"
                }
            ];
            widget.renderContent();
            widget.postRender();
            $content = widget.getContent();
        });

        it("Should check that ellipsis doesn't appear", function(){
            expect($content.find(".ellipsis-icon").length).toEqual(0);
        });

        it("Should organize the user info to return the necessary format", function(){
            var data = widget.getInfoToUser(currentUser);
            expect(data).toBeDefined();
            expect(data.user).toBe("Client");
            expect(data.stakeholders).toBe("Client, nurse");
            expect(data.showMore).toBe(false);
        });
    });

    describe("Behavior when there is no current user", function(){
        beforeEach(function () {
            bizagi.currentUser = null;
            sinon.spy(widget.dataService, 'getCurrentUser');
            widget.dataService.getCurrentUser.restore();

            sinon.stub(widget.dataService, 'getCurrentUser', function(){
                var defer = new $.Deferred();
                defer.resolve(currentUser);
                return defer.promise();
            });

            $content = widget.getContent();
        });

        it("Should call getCurrentUser service when there is no current user", function(){
            var data = widget.getData();
            expect(widget.dataService.getCurrentUser.called).toBe(true);
        });
    });
});

