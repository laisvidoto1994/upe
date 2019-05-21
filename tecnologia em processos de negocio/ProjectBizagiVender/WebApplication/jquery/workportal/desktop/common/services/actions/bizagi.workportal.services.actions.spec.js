describe("bizagi.workportal.services.actions", function () {
    checkWorkportalDependencies();
    var actionsService,
        UsersEventsService,        
        processActionService,
        dataService,
        loadTemplatesService,
        UsersAndEventsData,
        basicActionsData,
        advancedActionsData,
        guiEntity = '05984A74-7BD0-4B35-8D9E-84547CBC659F',
        getActionsData;

    beforeEach(function(){
        UsersAndEventsData = [
            {
                idCase: 4252,
                assignees: [{ "idUser": 55, "name": "Adam Smith C", "idTask": 47}],
                events: [],
                createdBy: { "idUser": 57,  "name": "Marie Bell C" }
            },
            {
                idCase: 4051,
                "assignees": [
                    { "idUser": 57, "name": "Marie Bell C", "idTask": 1061},
                    { "idUser": 57, "name": "Marie Bell C", "idTask": 1059}
                ],
                "events": [{ "idTask": 1061,  "displayName": "Evento 007", "idWorkitem": 4304, isEvent: true, guid: Math.guid() }],
                "createdBy": { "idUser": 57, "name": "Marie Bell C" }

            }
        ];
        var promiseBasicActionsData = $.Deferred();
        basicActionsData = {
            actions:
                [
                    {
                        idCaseEvent: '123',
                        displayName: 'Booking again',
                        description: 'Booking again',
                        guidAction: 'd20d9ab6-8a38-4fa2-927a-0f765e45dd78',
                        type: 'Process',
                        multiplicity: 1,
                        mode: 'Entity',
                        data: {
                            hasStartForm: false,
                            guidEntity: guiEntity,
                            xpathContext: 'Booking'
                        }
                    },
                    {
                        displayName: 'EntityAction01',
                        description: 'EntityAction01',
                        guidAction: '88f5afa1-a52e-4148-bb2c-ace5686389b4',
                        type: 'Form',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guid: '9417CF78-B3EA-4991-B353-5EADA5ADF4CA',
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'RuleAction01',
                        description: 'EntityAction01 test',
                        guidAction: 'd9afbe9b-a2f9-4f6c-a26c-149ac4459ddc',
                        type: 'Rule',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'Booking again',
                        description: 'Booking again',
                        guidAction: '41E5E673-AEF4-417B-A1AF-6B8156B31C65',
                        type: 'Process',
                        mode: 'Collection',
                        data: {
                            hasStartForm: false,
                            guidEntity: guiEntity,
                            xpathContext: 'Booking'
                        }
                    },
                    {
                        displayName: 'EntityAction01',
                        description: 'EntityAction01',
                        guidAction: 'F3B1A104-016F-483B-AA3E-6FCCFC80D480',
                        type: 'Form',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'RuleAction01',
                        description: 'EntityAction01 test',
                        guidAction: 'A14C76BB-A040-4496-8799-996113CCCFEF',
                        type: 'Rule',
                        mode: 'Collection',
                        data: {
                            guidEntity: guiEntity
                        }
                    }
                ]
        };
        promiseBasicActionsData.resolve(basicActionsData.actions);
        var promiseAdvancedActionsData = $.Deferred();
        advancedActionsData = {
            actions: basicActionsData.actions.concat([
                    {
                        displayName: 'Booking again',
                        description: 'Booking again',
                        guidAction: '71F80986-3788-47D5-9F14-8877EA94D39D',
                        type: 'Process',
                        hasStartForm: false,
                        multiplicity: 1,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity,
                            xpathContext: 'Booking'
                        }
                    },
                    {
                        displayName: 'EntityAction01',
                        description: 'EntityAction01',
                        guidAction: 'C3416D3D-274F-420F-B488-11B65C314EE9',
                        type: 'Form',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'RuleAction01',
                        description: 'EntityAction01 test',
                        guidAction: '1561D263-62B0-422E-9CBF-DDD553547149',
                        type: 'Rule',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'Booking again',
                        description: 'Booking again',
                        guidAction: 'A03F5ED2-0AD3-41D2-A110-232890627DA4',
                        type: 'Process',
                        hasStartForm: false,
                        mode: 'Collection',
                        data: {
                            guidEntity: guiEntity,
                            xpathContext: 'Booking'
                        }
                    },
                    {
                        displayName: 'EntityAction01',
                        description: 'EntityAction01',
                        guidAction: 'C4065884-80E4-4D18-94A1-9FF754F28724',
                        type: 'Form',
                        multiplicity: 2,
                        mode: 'Entity',
                        data: {
                            guidEntity: guiEntity
                        }
                    },
                    {
                        displayName: 'RuleAction01',
                        description: 'EntityAction01 test',
                        guidAction: 'B34C2162-1BD2-41DB-9A18-1578F7C768A4',
                        type: 'Rule',
                        mode: 'Collection',
                        data: {
                            guidEntity: guiEntity
                        }
                    }
            ])
        };
        promiseAdvancedActionsData.resolve(advancedActionsData.actions);

        dataService = bizagi.injector.get('dataService');
        globalHandlersService = bizagi.injector.get('globalHandlersService');
        loadTemplatesService = bizagi.injector.get('loadTemplatesService');
        usersCasesService =  bizagi.injector.get('loadTemplatesService');
        actionsEventsService =  bizagi.injector.get('actionsEventsService');
        accumulatedcontext =  bizagi.injector.get('accumulatedcontext');
        processActionService = bizagi.injector.get('processActionService');

        spyOn(dataService, "actionsHasStartForm").and.returnValue(false);
        spyOn(actionsEventsService, "getEvents").and.callFake(function(){
            return [{
                idCaseEvent: "idCaseEvent1",
                displayName: 'Booking again',
                description: 'Booking again',
                guidAction: 'd20d9ab6-8a38-4fa2-927a-0f765e45dd78',
                type: 'Event',
                data: {
                    idCaseEvent: "idCaseEvent1",
                    hasStartForm: false,
                    guidEntity: guiEntity,
                    xpathContext: 'Booking'
                }
            }];
        });

        getActionsData = sinon.stub(dataService, 'getActionsData');

        getActionsData.returns(promiseBasicActionsData.promise());

        getActionsData
            .withArgs({
                guidEntity: guiEntity,
                idCase: 4051,
                surrogateKey: 14
            })
            .returns(promiseBasicActionsData.promise());

        getActionsData
            .withArgs({
                guidEntity: guiEntity,
                idCase: 1024,
                surrogateKey: 1024
            })
            .returns(promiseAdvancedActionsData.promise());

        var defer2 = $.Deferred();
        var response2 = {
            actions: [
                {
                    displayName: 'Booking again',
                    description: 'Booking again',
                    guidAction: 'd20d9ab6-8a38-4fa2-927a-0f765e45dd78',
                    type: 'Process',
                    multiplicity: 1,
                    mode: 'Entity',
                    data: {
                        hasStartForm: false
                    }
                },
                {
                    displayName: 'EntityAction01',
                    description: 'EntityAction01',
                    guidAction: '88f5afa1-a52e-4148-bb2c-ace5686389b4',
                    type: 'Form',
                    multiplicity: 2,
                    mode: 'Entity'
                }
            ]
        };
        defer2.resolve(response2.actions);
        getActionsData
            .withArgs({
                guidEntity: guiEntity,
                idCase: 10,
                surrogateKey: 10
            })
            .returns(defer2.promise());

        var defer1 = $.Deferred();
        var response1 = {
            actions: [
                {
                    displayName: 'RuleAction01',
                    description: 'EntityAction01 test',
                    guidAction: '1561D263-62B0-422E-9CBF-DDD553547149',
                    type: 'Rule',
                    multiplicity: 2,
                    mode: 'Entity'
                },
                {
                    displayName: 'EntityAction01',
                    description: 'EntityAction01',
                    guidAction: '88f5afa1-a52e-4148-bb2c-ace5686389b4',
                    type: 'Form',
                    multiplicity: 2,
                    mode: 'Entity'
                }
            ]
        }
        defer1.resolve(response1.actions);
        getActionsData
            .withArgs({
                guidEntity: guiEntity,
                idCase: 20,
                surrogateKey: 20
            })
            .returns(defer1.promise());

        sinon.stub(processActionService, 'executeProcessAction', function(){});
        sinon.stub(processActionService, 'executeFormAction', function(){});
        sinon.stub(processActionService, 'executeRuleAction', function () { });

        actionsService = new bizagi.workportal.services.action(dataService,
            loadTemplatesService,usersCasesService,
            actionsEventsService, processActionService,accumulatedcontext);

    });

    it('dependencies should defined', function(){

        expect(dataService).toBeDefined();
        expect(loadTemplatesService).toBeDefined();                          
        expect(dataService.getActionsData).toBeDefined();

    });

    it('Service should be defined', function(){
        expect(actionsService).toBeDefined();
    });

    
    describe('Basic Actions View', function () {
        beforeEach(function(){
            actionsService.init();
        });

        it('Should to display actions', function(done){
            $.when(actionsService.getActionsView({
                actionData : {
                    guidEntity: guiEntity,
                    idCase: 4051,
                    surrogateKey: 14
                },
                loadEvents: false,
                isRefresh: false
            }))
                .done(function(responseActions){
                    var $actionsTemplate = responseActions.actionsView;
                    dependencies.canvas.empty();
                    dependencies.canvas.append($actionsTemplate);
                    
                    var $elements = $actionsTemplate.find('li');

                    expect($actionsTemplate).toBeDefined();
                    expect($elements.length).toBe(3);

                    var showMore = $actionsTemplate.find('.bz-actions-showmore');
                    expect(showMore.length).toBe(0);

                    done();
                });
        });
    });

    describe('Advanced Actions View', function(){

        beforeEach(function(){
            actionsService.init();
        });

        afterEach(function(){

        });

        it('Should to display the advanced option', function(done) {
            $.when(actionsService.getActionsView({
                actionData : {
                    guidEntity: guiEntity,
                    idCase: 1024,
                    surrogateKey: 1024
                },
                loadEvents: false,
                isRefresh: false
            }))
                .done(function(responseActions){
                    var $actionsTemplate = responseActions.actionsView;
                    dependencies.canvas.empty();
                    dependencies.canvas.append($actionsTemplate);

                    var $elements = $actionsTemplate.find('li');

                    expect($actionsTemplate).toBeDefined();
                    expect($elements.length).toBe(6);

                    var showMore = $actionsTemplate.find('.bz-actions-showmore');
                    expect(showMore.length).toBe(0);

                    done();
                });
        });

        it('Should to display the hidden actions', function(done){
            $.when(actionsService.getActionsView({
                actionData : {
                    guidEntity: guiEntity,
                    idCase: 1024,
                    surrogateKey: 1024
                },
                loadEvents: false,
                isRefresh: false
            }))
                .done(function(responseActions){
                    var $actionsTemplate = responseActions.actionsView;
                    dependencies.canvas.empty();
                    dependencies.canvas.append($actionsTemplate);

                    var $showMore = $actionsTemplate.find('.bz-actions-showmore');

                    $showMore.trigger('click');
                    setTimeout(function () {

                        var $tooltip = $actionsTemplate.find('.template-box-tooltip .actions-hidden-container li');
                        expect($tooltip.length).toBe(0);

                        done();
                    }, 150);

                });
        });
    });

    describe('Actions & Events View', function(){
        beforeEach(function(){
            actionsService.init();
        });

        it('Should to display events', function(done){
            $.when(actionsService.getActionsView({
                actionData : {
                    guidEntity: guiEntity,
                    idCase: 4051,
                    surrogateKey: 14
                },
                loadEvents: true,
                isRefresh: false
            }))
                .done(function(responseActions){
                    var $actionsTemplate = responseActions.actionsView;
                    dependencies.canvas.empty();
                    dependencies.canvas.append($actionsTemplate);

                    var $showMore = $actionsTemplate.find('.bz-actions-showmore');
                    expect($showMore.length).toBe(0);

                    $showMore.trigger('click');
                    setTimeout(function () {
                        $tooltip = $actionsTemplate.find('.template-box-tooltip .actions-hidden-container li');
                        expect($tooltip.length).toBe(0);

                        done();
                    }, 150);
                });
        });
    });

    describe('Process Actions', function () {
        var actionPromise;

        beforeEach(function () {
            actionsService.init();

            actionPromise = $.when(actionsService.getActionsView({
                actionData: {
                    idCaseEvent: "1",
                    guidEntity: guiEntity,
                    idCase: 1024,
                    surrogateKey: 1024
                },
                loadEvents: false,
                isRefresh: false
            }))
                .pipe(function ($actionsTemplate) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append($actionsTemplate);

                    return $actionsTemplate;
                });
            
            sinon.stub(dataService, 'getMapping', function () { return { mapping : [1]}});
        });

        afterEach(function () {           
            dataService.getMapping.restore();
        });
        
    });

    describe('Common Actions', function () {
        var actionsPromise;
        beforeEach(function () {

            actionsService.init();

            actionsPromise = $.when(actionsService.getActionsView({ actionData: { guidEntity: guiEntity, idCase: 4051, surrogateKey: 14 }, loadEvents: false, isRefresh: false }),
                                    actionsService.getActionsView({ actionData: { guidEntity: guiEntity, idCase: 1024, surrogateKey: 1024 }, loadEvents: false, isRefresh: false }),
                                    actionsService.getActionsView({ actionData: { guidEntity: guiEntity, idCase: 10, surrogateKey: 10 }, loadEvents: false, isRefresh: false }),
                                    actionsService.getActionsView({ actionData: { guidEntity: guiEntity, idCase: 20, surrogateKey: 20 }, loadEvents: false, isRefresh: false }))
                .pipe(function () {
                    return;
                });
        });

        it('Should to get the actions to process', function (done) {
            $.when(actionsPromise)
                .done(function () {
                    var actions = actionsService.getActions({
                        4051: { surrogateKey: 4051, guidEntity: guiEntity },
                        1024: { surrogateKey: 1024, guidEntity: guiEntity }
                    });

                    expect(actions[4051]).toBeDefined();
                    expect(actions[4051].length).toBe(0);
                    expect(actions[1024]).toBeDefined();
                    expect(actions[1024].length).toBe(12);

                    done();
                });
        });

        it('Should to return the common actions', function (done) {
            $.when(actionsPromise)
                .done(function () {
                    var actions = actionsService.getCommonActions({
                        10: { surrogateKey: 10, guidEntity: guiEntity },
                        20: { surrogateKey: 20, guidEntity: guiEntity }
                    });

                    expect(actions.length).toBe(4);
                    expect(actions[0].guidAction).toEqual('d20d9ab6-8a38-4fa2-927a-0f765e45dd78');
                    done();
                });
        });



    });



    afterEach(function () {
        dataService.getActionsData.restore();
        processActionService.executeProcessAction.restore();
        processActionService.executeFormAction.restore();
        processActionService.executeRuleAction.restore();

    });

});
