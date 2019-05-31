/**
 * Initialize desktop.widgets.project.subprocesses widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.subprocesses", function () {
    checkWorkportalDependencies();
    var widget;
    bizagi.currentUser = {
        "idUser": 1,
        "user": "domain\admon",
        "userName": "admon",
        "uploadMaxFileSize": 1048576
    };
    var params = {};
    params["args"] = {
        "idCase": 13405,
        "showParentProcess": "true",
        "caseNumber": "13404",
        "process": "Identify the priority to attend the bug",
        "creationDate": "01/21/2015 11:52",
        "estimatedSolutionDate": "01/22/2015 13:53",
        "hasPlanAccess": true,
        "isSuperUser": false,
        "workflowPlanId": 389,
        "isWorkflowPlan": false,
        "solutionDate": "01/21/2015 11:52",
        "isOpen": "true",
        "idParentCase": 13404,
        "radNumberParentCase": "13404",
        "isFavorite": "false",
        "guidFavorite": "",
        "parentDisplayName": "Bug Tracking",
        "canAccesToParentProcess": "true",
        "isDelegatedCase": "false",
        "isAborted": "false",
        "hasComments": "false",
        "countEvents": 0,
        "countSubProcesses": 0,
        "countAssigness": 0,
        "helpUrl": "",
        "hasGlobalForm": "true",
        "currentState": [{
            "idWorkItem": 687152,
            "idTask": 0,
            "state": "New Task 3",
            "colorState": "Red",
            "tskDescription": "",
            "estimatedSolutionDate": "01/22/2015 13:53",
            "isEvent": "false",
            "helpUrl": "",
            "allowsReassign": "false",
            "assignToCurrentUser": "true",
            "idworkflowplan": 0,
            "closedPlan": false
        }],
        "createdBy": {"idUser": 123456789, "userName": "admon", "Name": "fabian"},
        "caseDescription": ""
    };


    it("Environment has been defined", function (done) {
        widget = new bizagi.workportal.widgets.project.subprocesses(dependencies.workportalFacade, dependencies.dataService, params);
        widget.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];

        spyOn(widget.dataService, "summarySubProcess").and.callFake(function () {
            return {
                "idCase": "6410",
                "subProcesses": [{
                    "idCase": 6411,
                    "displayName": "Subproceso Uno",
                    "radNumber": "6410",
                    "isOpen": "true",
                    "custData": [1000000, 123456, function () {
                        return "aaaa";
                    }],
                    "idCustData": -1,
                    "custDataTypes": ["Money", "Float", "Function"]
                }],
                "CustFields": [{"0": []}],
                "showSubProcess": true,
                "showSubProcesColumns": false
            };
        });

        $.when(widget.areTemplatedLoaded())
            .done(function () {
                $.when(widget.renderContent()).done(function (html) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append(html);
                    widget.postRender();
                    $.when(widget.updateView({}, params)).done(function () {
                        done();
                    });
                });
            });
    });

    it("Environment has content", function (done) {
        var contentWidget = widget.getContent();
        expect(contentWidget).not.toBe("");
        done();
    });

    describe("Events", function () {
        it("should call routingExecute when click parent case", function () {
            spyOn(widget, "routingExecute");
            $(".list-subprocesses a", widget.getContent()).click();
            expect(widget.routingExecute).toHaveBeenCalled();
        });
    });

    describe("Functions", function () {
        describe("getContentTooltip", function () {
            it("Should dont have error, and show tooltip", function () {
                $(".list-subprocesses li", widget.getContent()).mouseenter();
                setTimeout(function () {
                    expect($("div[role='tooltip']").css('display')).toBe("block");
                }, 100)
            });
        });

        describe("getSubprocessData", function () {
            it("It should return subprocess data at 0 index", function () {

                var responseSubprocess =  {"idCase":"103","subProcesses":[{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}],"CustFields":[{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]}],"showSubProcess":true,"showSubProcesColumns":true,"subProcPersonalized":{"0":{"subProcesses":{"0":{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"1":{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"2":{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}},"CustFields":{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]},"idCase":"103"}}};
                var indexSubprocess = 0;

                var subProcessData = widget.getSubprocessData(responseSubprocess,indexSubprocess, 0);
                expect(subProcessData.custData.length).toBe(6);
                expect(subProcessData.custDataTypes.length).toBe(6);
                expect(subProcessData.displayName).toBe("G050a - Suivi");

            });

            it("It should return subprocess data at 1 index", function () {

                var responseSubprocess =  {"idCase":"103","subProcesses":[{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}],"CustFields":[{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]}],"showSubProcess":true,"showSubProcesColumns":true,"subProcPersonalized":{"0":{"subProcesses":{"0":{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"1":{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"2":{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}},"CustFields":{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]},"idCase":"103"}}};
                var indexSubprocess = 1;

                var subProcessData = widget.getSubprocessData(responseSubprocess,indexSubprocess, 0);
                expect(subProcessData.custData.length).toBe(6);
                expect(subProcessData.custDataTypes.length).toBe(6);
                expect(subProcessData.displayName).toBe("G050a - Suivi");

            });

            it("It should return subprocess data at 2 index", function () {

                var responseSubprocess =  {"idCase":"103","subProcesses":[{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}],"CustFields":[{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]}],"showSubProcess":true,"showSubProcesColumns":true,"subProcPersonalized":{"0":{"subProcesses":{"0":{"idCase":104,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"1":{"idCase":105,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]},"2":{"idCase":106,"displayName":"G050a - Suivi","radNumber":"G050-2016-0004","isOpen":"true","custData":["G050-2016-0004","En traitement","S�curit� des infrastructures","N�gligeable","R�f�rence","7/12/2016 9:00:00 AM"],"idCustData":0,"custDataTypes":["VarChar","VarChar","VarChar","VarChar","VarChar","DateTime"]}},"CustFields":{"0":["Non-conformit�","Etat","Domaine","Gravit�","Intitul�","Solution Date"]},"idCase":"103"}}};
                var indexSubprocess = 1;

                var subProcessData = widget.getSubprocessData(responseSubprocess,indexSubprocess, 0);
                expect(subProcessData.custData.length).toBe(6);
                expect(subProcessData.custDataTypes.length).toBe(6);
                expect(subProcessData.displayName).toBe("G050a - Suivi");

            });

            it("It should return 17 customFields, because going to show second subprocess", function () {
                var responseSubprocess = {"idCase":"56","subProcesses":[{"idCase":57,"displayName":"Stand alone","radNumber":"56","isOpen":"false","custData":[true,"Mexico","8/27/2016 12:00:00 AM","العربي ج","Chia","Nuevo Leon"],"idCustData":0,"custDataTypes":["Boolean","VarChar","DateTime","VarChar","VarChar","VarChar"]},{"idCase":58,"displayName":"integ","radNumber":"56","isOpen":"false","custData":["56",true,"Mexico","صانع الخاص ب جيفريز سنت","صانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنت","8/27/2016 12:00:00 AM",435,235,32,"صانع الخاص ب جيفريز سنت",634,345,"العربي ج","Chia",345,"Nuevo Leon",234],"idCustData":1,"custDataTypes":["VarChar","Boolean","VarChar","VarChar","VarChar","DateTime","BigInt","Float","Money","VarChar","Int","Real","VarChar","VarChar","SmallInt","VarChar","SmallInt"]}],"CustFields":[{"0":["Booleano","pais","Fecha2","Nombre","Municipio","Estado"]},{"1":["Case Number","Booleano","pais","Descripcion","Descripcion2","Fecha2","Integ big","Flot","Moneda","Nombre","Numero","Reals","Nombre","Municipio","Small Integ","Estado","Tiny Integ"]}],"showSubProcess":true,"showSubProcesColumns":true,"subProcPersonalized":{"0":{"subProcesses":{"0":{"idCase":57,"displayName":"Stand alone","radNumber":"56","isOpen":"false","custData":[true,"Mexico","8/27/2016 12:00:00 AM","العربي ج","Chia","Nuevo Leon"],"idCustData":0,"custDataTypes":["Boolean","VarChar","DateTime","VarChar","VarChar","VarChar"]}},"CustFields":{"0":["Booleano","pais","Fecha2","Nombre","Municipio","Estado"]},"idCase":"56"},"1":{"subProcesses":{"0":{"idCase":58,"displayName":"integ","radNumber":"56","isOpen":"false","custData":["56",true,"Mexico","صانع الخاص ب جيفريز سنت","صانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنتصانع الخاص ب جيفريز سنت","8/27/2016 12:00:00 AM",435,235,32,"صانع الخاص ب جيفريز سنت",634,345,"العربي ج","Chia",345,"Nuevo Leon",234],"idCustData":1,"custDataTypes":["VarChar","Boolean","VarChar","VarChar","VarChar","DateTime","BigInt","Float","Money","VarChar","Int","Real","VarChar","VarChar","SmallInt","VarChar","SmallInt"]}},"CustFields":{"1":["Case Number","Booleano","pais","Descripcion","Descripcion2","Fecha2","Integ big","Flot","Moneda","Nombre","Numero","Reals","Nombre","Municipio","Small Integ","Estado","Tiny Integ"]},"idCase":"56"}}};
                var indexSubprocess = "1";
                var idCustData = "1";

                var subProcessData = widget.getSubprocessData(responseSubprocess,indexSubprocess, idCustData);
                expect(subProcessData.custFields.length).toBe(17);
            });
        });

        describe("clean", function () {
            beforeEach(function () {
                spyOn(widget, "unsub");
            });
            it("Should call unsub", function () {
                widget.clean();
                expect(widget.unsub).toHaveBeenCalled();
            });
        });
    });
});
