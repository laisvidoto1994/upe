describe("bizagi.workportal.services.processactions", function () {
    var notifierService,
        processActionService,
        dialogWidgetsService,
        dataService,
        globalHandlersService;

    beforeEach(function(){
        dataService = bizagi.injector.get('dataService');
        notifierService = bizagi.injector.get('notifier');
        dialogWidgetsService = bizagi.injector.get('dialogWidgets');
        globalHandlersService = bizagi.injector.get('globalHandlersService');
        loadTemplatesService = bizagi.injector.get('loadTemplatesService');
    });

    it('dependencies should defined', function () {
        processActionService = new bizagi.workportal.services.processaction(dataService,
            notifierService, globalHandlersService, {},
            dialogWidgetsService, loadTemplatesService);
        expect(notifierService).toBeDefined();
        expect(globalHandlersService).toBeDefined();
    });

    it('Service should be defined', function () {
        expect(processActionService).toBeDefined();
    });

    describe('Process Action - single instance', function () {

        describe('Without start form', function () {
            it('If the confirmation is CANCEL, should do not invoke the create case service', function () {
            });
        });


        describe('With start form', function () {
            beforeEach(function(){
                bizagi = bizagi || {};
                bizagi.currentUser = bizagi.currentUser || {};
                bizagi.currentUser.idUser = 123;
            });
            describe('When current user belong to next activity', function () {
                beforeEach(function(){
                    params = {
                        usersAssigned: [{idUser: 123}],
                        idCase: 345
                    };
                    /*Not spy currentUserBelongNextActivity :(
                    spyOn(processActionService, "currentUserBelongNextActivity").and.callFake(function(){
                        var defer = $.Deferred();
                        defer.resolve(true)
                        return defer.promise();
                    });
                    spyOn(globalHandlersService, "publish");
                    */
                });
                it("Should go to case", function(){

                });
            });
            describe('When current user dont belong to next activity', function () {
                beforeEach(function(){

                });

                it("Should show notification", function(){

                });
            });
        });
    });

    describe('Form Action-single instance', function () {

        describe('Entity mode', function () {
            it('The dialog should be closed, once the form has been processed', function () {

            });
        });

        describe('Collection Mode', function () {
            it('The dialog should be closed, once the form has been processed', function () {

            });
        });
    });






});
