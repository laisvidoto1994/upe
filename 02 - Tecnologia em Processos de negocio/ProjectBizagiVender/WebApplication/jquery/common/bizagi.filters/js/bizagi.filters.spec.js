/**
 * Bizag.filters
 *
 * @author Andrés Fernando Muñoz
 */


describe("Bizagi.filters", function () {

    /**
     * Global Variables
     */
    var originalCurrentUser = bizagi.currentUser;
    checkWorkportalDependencies();
    beforeEach(function(){
        bizagi.currentUser = JSON.parse('{"idUser":1,"user":"admon","userName":"admon","groupSeparator":".","language":"es-ES","decimalSeparator":",","decimalDigits":"2","symbol":"€","shortDateFormat":"dd/MM/yyyy","timeFormat":"H:mm"}');
    });
    afterEach(function(){
        bizagi.currentUser = originalCurrentUser;
    });

    var ID_WRAPPER_FILTER = "#biz-column-filter";
    /**
     * Initialize widget stakeholders
     */
    var widgetStakeholders;
    initializeWidgetStakeholders();

    /**
     * Initialize unit testing filters
     */

    var $parent = $('<div class="ui-bizagi-grid-column ui-bizagi-grid-title-align-center"> <a href="#" class="link-order-entity" data-ordertype="ASC" data-columnorderfield="tdecimal_moneda" data-index="1" data-type="8" data-allowdecimals="" data-numdecimals="" data-thousands="" data-percentage="" data-showsymbol="" data-attributetype="8"> tdecimal_moneda <span class="sortColumnsDataDownIcon"> <span class="arrowUpIcon"></span> <span class="arrowDownIcon"></span> </span> </a> <i class="ui-bizagi-render-icon-filter" data-index="1"></i> </div>');
    var $iconFilter = $('.ui-bizagi-render-icon-filter', $parent);

    checkRenderDependencies();

    it("Basic test initialize filters", function(){
        $(widgetStakeholders.getContent()).append($iconFilter);
        $('.ui-bizagi-render-icon-filter',widgetStakeholders.getContent()).bizagi_filters({
            type: 8,
            attributeType: 8,
            parent: $parent,
            templates: {
                filterWrapper: widgetStakeholders.getTemplate("filter-wrapper"),
                filterString: widgetStakeholders.getTemplate("filter-string"),
                filterNumber: widgetStakeholders.getTemplate("filter-number"),
                filterDate: widgetStakeholders.getTemplate("filter-date"),
                filterBoolean: widgetStakeholders.getTemplate("filter-boolean")
            }
        });
    });

    describe("Functions", function () {
        describe("applyFilter", function () {
            describe("When operator is null, so", function () {
                it("Should the Value is remove it, for compatibility on JAVA", function () {
                    var mockData = {
                        key: "is-null",
                        value: "123456"
                    };
                    $.ui.bizagi_filters().testPrivateFunction("applyFilter", mockData);
                    expect(mockData.value).toBeUndefined();
                });
            });
        });
    });






    function initializeWidgetStakeholders(){
        var stakeholdersList = [
            {"guid":"d40d18f7-4f7a-44d4-b908-4268c8dbb06b","displayName":"AL stakeholder","name":"ALstakeholder","idAddForm":"bae45983-0da7-40a8-8255-7fc35b50c6a5","allowViewData":true,"allowAdd":true,"allowEdit":true,"allowDelete":false},
            {"guid":"954a463f-00ed-44d1-87c6-d8862c14115a","displayName":"Doctor","name":"Doctor","allowViewData":true,"allowAdd":true,"allowEdit":true,"allowDelete":false},
            {"guid":"696f5f58-59f3-4709-8d17-c11b3a814bda","displayName":"Zoo","name":"Zoo","idAddForm":"65a89f9a-5799-48b9-9e21-88310bb340e8","allowViewData":true,"allowAdd":true,"allowEdit":true,"allowDelete":false}
        ];
        var doctorInstances = {
            "header":[
                {"displayName":"idDoctor","fieldValue":"idDoctor","dataType":2,"attributeType":2,"entity":null},
                {"displayName":"Phone Number","fieldValue":"PhoneNumber","dataType":15,"attributeType":15,"entity":null},
                {"displayName":"Medical School","fieldValue":"MedicalSchool","dataType":15,"attributeType":15,"entity":null},
                {"displayName":"Specialty","fieldValue":"Specialty","dataType":2,"attributeType":2,"entity":"d1fa85b6-46b5-4df5-9bc2-1cbf2dd9aee1"},
                {"displayName":"associatedUser","fieldValue":"fullName","dataType":15,"attributeType":15,"entity":"35e453a0-755d-4171-80ed-f2618b092ede"}
            ],
            "row":[
                ["51","777 896 234","University of Birmingham Medical School","Gynecologist","Cristopher Wallman"],
                ["101","555 456 321","Newcastle University Medical School","Pathologist",""],
                ["301","444 567 234","UCL Medical School","Microbiology",""]
            ],
            "total":1,
            "page":1,
            "records":3
        }

        it("Environment has been defined", function(done) {
            var params = {
                "widgetName":"adminStakeholders",
                "data":{"idCase":"StakeholderAdmin"},
                "closeVisible":false,
                "maximize":true,
                "modalParameters":{
                    "title":"Stakeholders",
                    "width":"910px",
                    "id":"StakeholderAdmin"
                },
                "referrer": "subMenu",
                "dialogBox":{
                    "0":{},
                    "length":1
                }
            };

            widgetStakeholders = new bizagi.workportal.widgets.admin.stakeholders(dependencies.workportalFacade, dependencies.dataService, params);

            spyOn(widgetStakeholders.dataService, 'getAdminStakeholdersList').and.callFake(function () {
                return stakeholdersList;
            });

            $.when(widgetStakeholders.render()).done(function(html) {
                dependencies.canvas.empty();
                dependencies.canvas.append(html);

                expect(html).not.toBe("");
                done();
            });
        });
    }
});