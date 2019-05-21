/*
*   Name: BizAgi Services WorkPortal End Points
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -   This script defines all the end-points used to retrieve ajax stuff
*   -   All urls must be relative to the base application
*/

// Create or define namespace
bizagi.workportal = (typeof (bizagi.workportal) !== "undefined") ? bizagi.workportal : {};
bizagi.workportal.services = (typeof (bizagi.workportal.services) !== "undefined") ? bizagi.workportal.services : {};
bizagi.workportal.services.endPoints = [];

// Creates a endpoint hash factory to resolve custom requirements
bizagi.workportal.services.getEndPoints = function (params) {
    // Default workportal end-points
    if (params.context == "workportal") {
        return {
            "user-handler": params.proxyPrefix + "RestServices/UserHandler.ashx",
            "process-handler": params.proxyPrefix + "RestServices/ProcessHandler.ashx",
            "query-handler": params.proxyPrefix + "Rest/Handlers/Query",
            "case-handler": params.proxyPrefix + "RestServices/CaseHandler.ashx",
            "query-form": params.proxyPrefix + "App/ListaDetalle/QueryForm.aspx",
            "query-form-edit": params.proxyPrefix + "App/ListaDetalle/SaveQuery.aspx",
            "query-form-delete": params.proxyPrefix + "App/ListaDetalle/QueryForm.aspx",
            "query-form-delete-cube": params.proxyPrefix + "Rest/Queries/Cubes/{idCube}",
            "favorites-handler": params.proxyPrefix + "RestServices/FavoritesHandler.ashx",
            "file-handler": params.proxyPrefix + "RestServices/EntityHandler.ashx",
            "login-handler": params.proxyPrefix + "Rest/Users/UserAuthentication",
            "login-handlerv10": params.proxyPrefix + "RestServices/UserHandler.ashx?action=authenticateUser&userName={0}&password={1}&domain={2}",
            "logoff-handler": params.proxyPrefix + "RestServices/UserHandler.ashx?action=logOff",
            "logoff-handlerv1": params.proxyPrefix + "Rest/Users/LogOff",

            // Rest Services
            "authorization-handler-getMenuAuthorization": params.proxyPrefix + "Rest/Authorization/MenuAuthorization",
            "authorization-handler-isCaseCreationAuthorized": params.proxyPrefix + "Rest/Authorization/Processes/{0}/IsCaseCreationAuthorized",
            "case-handler-getCaseSummary": params.proxyPrefix + "Rest/Cases/{idCase}/Summary",

            //ReleaseActivityResponse
            "case-handler-releaseActivity": params.proxyPrefix + "Rest/Cases/{idCase}/ReleaseActivity",

            //mobile beta services
            "case-handler-getCasesList": params.proxyPrefix + "Rest/Processes/SearchCases",
            "case-handler-getActivityList": params.proxyPrefix + "Api/Cases/Activities",
            
            // Services to Offline capability
            "offline-getProcessTree": params.proxyPrefix + "Rest/Processes/OfflineProcessTree",

            //"offline-getForms": params.proxyPrefix + "Rest/Handlers/Render",
            "offline-getForms": params.proxyPrefix + "Rest/RenderForm/offlineForms",
            "offline-sendForm": params.proxyPrefix + "Rest/Cases/SaveAsynchWorkItemOffLine",

            // StartProcess
            "case-handler-getCaseTasks": params.proxyPrefix + "Rest/Cases/{idCase}/Tasks",
            "case-handler-getCaseEvents": params.proxyPrefix + "Rest/Cases/{idCase}/Events",
            "case-handler-getCaseSubprocesses": params.proxyPrefix + "Rest/Cases/{idCase}/Subprocesses",
            "case-handler-getTaskAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Tasks/{idTask}/Assignees",
            "case-handler-getCaseAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Assignees",
            "case-handler-getWorkItems": params.proxyPrefix + "Rest/Cases/{idCase}/WorkItems",
            "case-handler-getAsynchExecutionState": params.proxyPrefix + "Rest/Cases/{idCase}/AsynchExecutionState",
            "case-handler-addNewCase": params.proxyPrefix + "Rest/Cases",
            "case-handler-startProcess": params.proxyPrefix + "Rest/Processes/StartProcess/{idProcess}",
            "handler-execute-action-start": params.proxyPrefix + "Api/Cases/{processId}/Start",
            "case-handler-supportedLogTypes": params.proxyPrefix + "Rest/Cases/SupportedLogsTypes",
            "case-handler-getActivityLog": params.proxyPrefix + "Rest/Cases/{idCase}/ActivityLog",
            "case-handler-getActivityDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/{idWorkItemFrom}/ActivityDetailLog",
            "case-handler-getEntityLog": params.proxyPrefix + "Rest/Cases/{idCase}/EntityLog",
            "case-handler-getEntityDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/EntityDetailLog",
            "case-handler-getUserLog": params.proxyPrefix + "Rest/Cases/{idCase}/UserLog",
            "case-handler-getUserDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/{idUser}/UserDetailLog",
            "case-handler-getAdminLog": params.proxyPrefix + "Rest/Cases/{idCase}/AdminLog",
            "case-handler-getCaseFormsRenderVersion": params.proxyPrefix + "Rest/Cases/{idCase}/FormsRenderVersion",
            "case-handler-validateHasStartForm": params.proxyPrefix + "Api/Processes/{processId}/StartContext",

            //Favorites Restful
            "favorites-handler-saveFavorite": params.proxyPrefix + "Rest/Favorites",
            "favorites-handler-deleteFavorite": params.proxyPrefix + "Rest/Favorites/{guidFavorite}",

            //ICONS && IMAGES
            "process-getIcon": params.proxyPrefix + "Api/Processes/{processId}/Icon",
            "collections-getIcon": params.proxyPrefix + "Api/CurrentUser/Collections/{collectionId}/Icon",

            //BAMAnalytics Restful
            "bamAnalytics-handler-getAnalisysQueries": params.proxyPrefix + "Rest/BAMAnalytics/AnalisysQueries",
            "bamAnalytics-handler-updateQuery": params.proxyPrefix + "Rest/BAMAnalytics/Reports/Ids/{idQuery}",

            //Inbox Restful
            "inbox-handler-getInboxSummary": params.proxyPrefix + "Rest/Inbox/Summary",

            //Messages Restful
            "MessageHandler-NewComment": params.proxyPrefix + "Rest/Cases/Comments",
            "MessageHandler-GetComments": params.proxyPrefix + "Rest/Cases/Comments",
            "MessageHandler-SetCategoryToComment": params.proxyPrefix + "Rest/Cases/Comments/{idComment}",
            "MessageHandler-RemoveComment": params.proxyPrefix + "Rest/Cases/Comments/{idComment}",
            "MessageHandler-ReplyComment": params.proxyPrefix + "Rest/Cases/Comments/{idComment}/Replies",
            "MessageHandler-RemoveReply": params.proxyPrefix + "Rest/Cases/Comments/{idComment}/Replies/{idReply}",
            "MessageHandler-GetCategoryColors": params.proxyPrefix + "Rest/Cases/Comments/CategoryColors",
            "MessageHandler-RenameCategoryColor": params.proxyPrefix + "Rest/Cases/Comments/CategoryColors/{idColorCategory}",
            "MessageHandler-CountNewComments": params.proxyPrefix + "Rest/Cases/Comments/{idComment}/NewComments/Count",

            //Processes Restful
            "process-handler-getAllProcesses": params.proxyPrefix + "Rest/Processes",
            "process-handler-getFavourites": params.proxyPrefix + "Rest/Home/MyFavorites/Count",
            "process-handler-getFavouriteCases": params.proxyPrefix + "Rest/Home/MyFavorites",
            "process-handler-getCustomizedColumnsData": params.proxyPrefix + "Rest/Processes/CustomizedColumnsData",
            "process-handler-getCategory": params.proxyPrefix + "Rest/Processes/Categories",
            "process-handler-getRecentProcesses": params.proxyPrefix + "Rest/Processes/RecentProcesses",
            "process-handler-getCustomizedColumnsDataInfo": params.proxyPrefix + "Rest/Processes/CustomizedColumnsDataInfo",
            "process-handler-getOrganizations": params.proxyPrefix + "Rest/Profile/Organizations",                                              

            //workportal
            "process-handler-getMyStuff": params.proxyPrefix + "Api/CurrentUser/Collections",
            "process-handler-getIdCasesOfProcessEntities": params.proxyPrefix + "Api/Entities/Cases",
	        "templates-handler-getCollectionData": params.proxyPrefix + "Api/Collection/{idFact}/Data",
            //"data-navigation-handler": params.proxyPrefix + "Api/Entities/{guidLeftEntity}/Data/{surrogateKeyLeftEntity}",
            "data-navigation-handler-collection": params.proxyPrefix + "Api/CurrentUser/Collections/{reference}/Data/{surrogateKey}",
            "data-navigation-handler-entity": params.proxyPrefix + "Api/CurrentUser/Entities/{reference}/Data/{surrogateKey}/{xpath}",
            "data-navigation-handler-entity-filters": params.proxyPrefix + "Api/CurrentUser/Entities/{reference}/Filters/{surrogateKey}/{xpath}",

            //"action-handler-getProcessAddAction": params.proxyPrefix + "Api/Entities/{guidLeftEntity}/Collection/{guidFact}/Actions",
            "action-handler-getProcessAddAction": params.proxyPrefix + "Api/CurrentUser/Collections/{reference}/{surrogateKey}/Actions",

            //My Searches
            'my-search-getSearchLists': params.proxyPrefix + "Api/CurrentUser/Searches",
            'my-search-getFilters': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/Filters",
            'my-search-getFiltersData': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/FilterData",
            'my-search-getData': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/Data",

            "templates-handler-getVirtualCollectionData" : params.proxyPrefix + "Api/Collection/{guidVirtualCollection}/VirtualData",
            "templates-handler-getMultipleActions" : params.proxyPrefix + "Rest/Entities/multipleInstancesActions",
            
            "process-handler-getMapping" : params.proxyPrefix + "Rest/Entities/Mapping",
            "process-handler-getForm" : params.proxyPrefix + "Rest/Handlers/Render",
            "process-handler-startform": params.proxyPrefix + "Rest/Processes/HasStartForm",
            //"process-handler-rule": params.proxyPrefix + "Rest/Action/Rule",
            "process-handler-rule": params.proxyPrefix + "Api/Rules/{ruleId}/Execute",
            //"process-action-execute" : params.proxyPrefix + "Api/Action/Execute",
            "process-action-execute": params.proxyPrefix + "Api/Rules/{ruleId}/ExecuteMultiple",
            "process-handler-getActivitiesData": params.proxyPrefix + "Api/Processes/CasesData/MyActivities",
            "process-handler-getPendingsData": params.proxyPrefix + "Api/Processes/CasesData/MyPendings",
            
            //"entities-handler-getActions" : params.proxyPrefix + "Rest/Entities/Actions",
            "entities-handler-getActions": params.proxyPrefix + "Api/Entities/{guidEntity}/{surrogateKey}/actions",
            "entities-handler-getUsersAndEvents" : params.proxyPrefix + "Rest/Processes/CasesData/UsersAndEvents",
            "entities-handler-getUsers" : params.proxyPrefix + "Api/Cases/{caseId}/Users",
            "entities-handler-getEvents" : params.proxyPrefix + "Api/Cases/{caseId}/CurrentEvents",
            "entities-handler-getUsersImages" : params.proxyPrefix + "Rest/Users/UserPictures",
            "entities-handler-getShotCuts" : params.proxyPrefix + "Api/CurrentUser/Shortcuts",
            
            //Queries Restful
            "query-handler-getqueries": params.proxyPrefix + "Rest/Queries",
            "query-handler-getQueryForm": params.proxyPrefix + "Rest/Handlers/Render",

            //Users Restful
            "user-handler-getCurrentUser": params.proxyPrefix + "Rest/Users/CurrentUser",

            // Old render integration, readonly
            "old-render": params.proxyPrefix + "App/ListaDetalle/Detalle.aspx",

            //Service locator for reports
            "Reports": params.proxyPrefix + "RestServices/BAMAnalyticsHandler.ashx",
            "reports-handler-deleteQueries": params.proxyPrefix + "Rest/BAMAnalytics/Reports/{QueryId}",

            //Service locator for bizagi folders
            "folders-handler-getUserQueries": params.proxyPrefix + "Rest/SmartFolders",
            "folders-associate-deleteSmartFolder": params.proxyPrefix + "Rest/SmartFolders/{idSmartFolder}",
            "folders-handler": params.proxyPrefix + "RestServices/SmartFoldersHandler.ashx",
            "folders-associate": params.proxyPrefix + "App/Ajax/AJAXGateway.aspx",
            "smartfolders-integration": params.proxyPrefix + "App/WorkPortal/ConfigureFilteredFolder.aspx",

            //Service locator for menu
            "AlarmAdmin": params.proxyPrefix + "App/Admin/AlarmsAdmin.aspx",
            "AnalyticsProcess": params.proxyPrefix + "App/Cockpit/AnalyticsProcess.aspx",
            "AnalyticsSensor": params.proxyPrefix + "App/Cockpit/AnalyticsSensor.aspx",
            "AnalyticsTask": params.proxyPrefix + "App/Cockpit/AnalyticsTask.aspx",
            "AsynchronousWorkitemRetries": params.proxyPrefix + "App/Admin/AsynchDisabledWorkitems.aspx",
            "AuthenticationLogQuery": params.proxyPrefix + "App/Admin/AuthLogQuery.aspx",
            "BAMProcess": params.proxyPrefix + "App/Cockpit/BAMProcess.aspx",
            "BAMTask": params.proxyPrefix + "App/Cockpit/BAMTask.aspx",
            "BusinessPolicies": params.proxyPrefix + "App/Admin/BusinessPolicies/BusinessPoliciesSelector.aspx",
            "CaseAdmin": params.proxyPrefix + "App/Admin/CaseSearch.aspx",
            "adminReassignCases": "CaseAdmin", // Open workportal module called 'adminCases'
            "asyncECMUpload": "asyncECMUpload", // Open workportal module called 'asyncECMUpload'
            "CasesMonitor": params.proxyPrefix + "App/Admin/CasesMonitor.aspx",
            "Closed": params.proxyPrefix + "App/ListaDetalle/listaitems.aspx?h_Location=Cerrados&I_ProcessState=Completed",
            "CurrentUser": params.proxyPrefix + "App/Admin/CurrentUser.aspx",
            "EncryptionAdmin": params.proxyPrefix + "App/Admin/Encrypt.aspx",
            "MobileUpdatesAdmin": params.proxyPrefix + "App/MobileUpdates/default.aspx",
            "EntityAdmin": params.proxyPrefix + "App/Admin/Entity.aspx",
            "LocationResources": params.proxyPrefix + "App/Admin/AdminLocResources.aspx",
            "NewCase": params.proxyPrefix + "App/Radicar/application.aspx",
            "Pending": params.proxyPrefix + "App/ListaDetalle/listaitems.aspx?h_Location=Pendientes&I_processState=Running",
            "Profiles": params.proxyPrefix + "App/Admin/ProfilesAdminSearch.aspx",
            "Search": params.proxyPrefix + "App/ListaDetalle/Search.aspx",
            "UserAdmin": params.proxyPrefix + "App/Admin/ListUsers.aspx",
            "UserDefaultAssignation": params.proxyPrefix + "App/Admin/DefaultAssignationUser.aspx?h_AdminDefaultAssign=1",
            "UserPendingRequests": params.proxyPrefix + "App/Admin/UserPendingRequests.aspx",
            "ListPreferences": (bizagi.UserPreferencesUrl !== "") ? params.proxyPrefix + bizagi.UserPreferencesUrl : params.proxyPrefix + "App/Admin/CurrentUser.aspx",
            "GRDimensionAdmin": params.proxyPrefix + "App/Cockpit/DimensionEdit.aspx",
            "Licenses": params.proxyPrefix + "App/Admin/Licenses.aspx",
            "AnalysisQueries": params.proxyPrefix + "App/Inicio/WPAnalysisQuery.aspx",
            "DocumentTemplates": params.proxyPrefix + "App/Admin/AdminDocumentTemplates.aspx",
            "ProcessAdmin": params.proxyPrefix + "App/Admin/AdminProcess.aspx",
            "ResourceBAM": params.proxyPrefix + "App/Cockpit/BAMResourceMonitor.aspx",
            "WorkPortalVersion": params.proxyPrefix + "Rest/Util/Version",

            // entities administration
            "entities-administration": "RestServices/EntityHandler.ashx",

            //Theme Rest Service Handler
            "theme-handler-getLogoImagePath": params.proxyPrefix + "Rest/Theme/LogoImage",

            // Logout Service, already implemented on java environment
            "logout": params.proxyPrefix + "Rest/Authentication/logout",
            "logoutDotNet": params.proxyPrefix + "App/Inicio/LogOff.aspx",            
            "authenticationConfig": params.proxyPrefix + "Api/Authentication/BizagiConfig",
            "logout-oauth2": params.proxyPrefix + "Api/Authentication/OAuth2/IdentityProvider/Server/Logout",
            "oauth2AuthenticationConfig": params.proxyPrefix + "Api/Authentication/OAuth2/OAuth2AuthenticationConfig",

            //Massive Activity Asigments
            "massive-activity-assignments-getOrganizationInfo": params.proxyPrefix + "Rest/Users/OrganizationInfo",
            "massive-activity-assignments-getCasesByOrganization": params.proxyPrefix + "Rest/Queries/GetCasesByOrganization",
            "massive-activity-assignments-reassignCases": params.proxyPrefix + "Rest/Cases/ReassignCases",
            "massive-activity-assignments-searchUsers": params.proxyPrefix + "Rest/Users/",

            //Asynchronous ECM Upload
            "async-ecm-upload-baseService": params.proxyPrefix + "Rest/Handlers/Metadata",

            // Workportal
            "domains": params.proxyPrefix + "Rest/Authentication/Domains",

            // Theme Builder
            //"ThemeBuilder": params.proxyPrefix + "ThemeBuilder/index.html?language=" + bizagi.localization.language,
            "getCurrentTheme": params.proxyPrefix + "Api/Theme/Current",

            //Frankenstein
            "admin-getAuthenticationLog": params.proxyPrefix + "Rest/Users/AuthLog",
            "admin-getAuthenticationDomains": params.proxyPrefix + "Rest/Users/Domains",
            "admin-getAuthenticationEventsTypes": params.proxyPrefix + "Rest/Users/EventTypes",
            "admin-getAuthenticationEventSubTypes": params.proxyPrefix + "Rest/Users/EventSubTypes",
            "admin-EncryptString": params.proxyPrefix + "Rest/Util/EncryptString",
            "admin-UserPendingRequests": params.proxyPrefix + "Rest/Users/UserPendingRequests",
            "admin-UserAuthenticationInfo": params.proxyPrefix + "Rest/Users/UserAuthenticationInfo",
            "admin-updateUserAuthenticationInfo": params.proxyPrefix + "Rest/Users/UpdateUserAuthenticationInfo",
            "admin-generateRandomPassword": params.proxyPrefix + "Rest/Util/GenerateRandomPassword",
            "admin-GenerateDataToSendByEmail": params.proxyPrefix + "Rest/Users/GenerateDataToSendByEmail",
            "admin-sendEmail": params.proxyPrefix + "Rest/Util/SendEmail/",
            "admin-getApplicationList": params.proxyPrefix + "Rest/Application",
            "admin-getApplicationProcesses": params.proxyPrefix + "Rest/Application/{idApp}/Process",
            "admin-getProcessVersion": params.proxyPrefix + "Rest/Processes/Version",
            "admin-getProcessTasks": params.proxyPrefix + "Rest/Processes/Version/{version}/Tasks",

            //servicios alarmas
            "admin-getTaskAlarms": params.proxyPrefix + "Rest/Alarm/TaskAlarms",
            "admin-getLapseMode": params.proxyPrefix + "Rest/Alarm/LapseMode",
            "admin-getRecurrMode": params.proxyPrefix + "Rest/Alarm/RecurrMode",
            "admin-getScheduleType": params.proxyPrefix + "Rest/Alarm/ScheduleType",
            "admin-getBossList": params.proxyPrefix + "Rest/Alarm/Boss",
            "admin-addAlarm": params.proxyPrefix + "Rest/Alarm",
            "admin-editAlarm": params.proxyPrefix + "Rest/Alarm/{idAlarm}",
            "admin-deleteAlarm": params.proxyPrefix + "Rest/Alarm",
            "admin-alarmRecipients": params.proxyPrefix + "Rest/Alarm/{idAlarm}/Recipient",
            "admin-deleteAlarmRecipients": params.proxyPrefix + "Rest/Alarm/Recipient",
            "admin-recipientToAlarm": params.proxyPrefix + "Rest/Alarm/{idAlarm}/Recipient/{idRecipient}",
            "admin-enableAlarm": params.proxyPrefix + "Rest/Alarm/Task/{idTask}/ToggleAlarm",
            "admin-getCategoriesList": params.proxyPrefix + "Rest/Application/Category",
            "admin-getCasesList": params.proxyPrefix + "Rest/Queries/SearchCases",
            "admin-abortItems": params.proxyPrefix + "Rest/Cases/Abort",
            "admin-reassignItems": params.proxyPrefix + "Rest/Cases/Reassign",
            "admin-getDefaultAssignationUserToAllProcess": params.proxyPrefix + "Rest/Users/{serviceAction}/",
            "admin-getDefaultAssignationUserToProcess": params.proxyPrefix + "Rest/Users/Process/{process}/AssignationUser",
            "admin-setDefaultAssignationUserToProcess": params.proxyPrefix + "Rest/Users/Process/{process}/AssignationUser",
            "admin-getProfilesTypes": params.proxyPrefix + "Rest/Profile/Types",
            "admin-searchProfiles": params.proxyPrefix + "Rest/Profile",
            "admin-getUsersByProfile": params.proxyPrefix + "Rest/Users/Profile/{type}/{id}",
            "admin-removeUserFromProfile": params.proxyPrefix + "Rest/Profile/{type}/{id}/User/{idUser}/",
            "admin-addUserToProfile": params.proxyPrefix + "Rest/Profile/{type}/{id}/User/{idUser}/",
            "admin-async-activities-get-activities": params.proxyPrefix + "Rest/Cases/Asynchronous/Activities",
            "admin-async-activities-get-retry-now": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idworkItem}/RetryNow",
            "admin-async-activities-get-activities-by-task": params.proxyPrefix + "Rest/Cases/Asynchronous/Activities/Task",
            "admin-async-activities-enable-execution": params.proxyPrefix + "Rest/Cases/Asynchronous/Enable",
            "admin-async-activities-enable-multiple": params.proxyPrefix + "Rest/Cases/Asynchronous/EnableMultiple",
            "admin-async-activities-async-execution": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idWorkitem}/AsynchExecution",
            "admin-async-activities-async-execution-log": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idworkItem}/AsynchExecutionLog",
            "admin-Licenses": params.proxyPrefix + "Rest/Licenses",
            "admin-GetDimensions": params.proxyPrefix + "Rest/Dimensions",
            "admin-EditDimension": params.proxyPrefix + "Rest/Dimensions/{id}",
            "admin-CreateAdministrableDimension": params.proxyPrefix + "Rest/Dimensions/Administrable",
            "admin-DeleteDimension": params.proxyPrefix + "Rest/Dimensions/{id}?isAdministrable={administrable}",
            "admin-EntityPathChildNodesAction": params.proxyPrefix + "Rest/Dimensions/EntityChildNodes",
            "admin-GetActiveWFClasses": params.proxyPrefix + "Rest/Dimensions/ActiveProcess",
            "admin-document-templates-storeDocumentTemplates": params.proxyPrefix + "Rest/DocumentTemplates/StoreDocumentTemplates",
            "admin-document-templates-restoreDocumentTemplates": params.proxyPrefix + "Rest/DocumentTemplates/RestoreDocumentTemplate",
            "admin-document-templates-uploadDocumentTemplate": params.proxyPrefix + "Rest/DocumentTemplates/UploadDocumentTemplate",
            "admin-processes-workflowClasses": params.proxyPrefix + "Rest/Processes/WorkflowClasses",
            "admin-processes-tasksByWorkflow": params.proxyPrefix + "Rest/Processes/TasksByWorkflow",
            "admin-processes-modifyProcessDuration": params.proxyPrefix + "Rest/Processes/{idWorkflow}/Duration/",
            "admin-processes-modifyTaskDuration": params.proxyPrefix + "Rest/Processes/Task/{idTask}/Duration/",
            "admin-language-resource": params.proxyPrefix + "Rest/Multilanguage/Resource",
            "admin-language-languages": params.proxyPrefix + "Rest/Multilanguage/Languages",
            "bam-resourcemonitor-myteam": params.proxyPrefix + "Rest/Reports/BAM/Resources/MyTeam",
            "reports-analysisquery": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "reports-analysisquery-update": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "reports-analysisquery-delete": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "processviewer-processdefinition": params.proxyPrefix + "Rest/Reports/Components/ProcessDefinition",
            "processviewer-processgraphicinfo": params.proxyPrefix + "Rest/Reports/Components/ProcessGraphicInfo",
            
             // Mobile Updates
            "mobile-getLastUpdate": params.proxyPrefix + "Rest/Util/mobileUpdates",

            //discussionCase
            "discussion-case": params.proxyPrefix + "Api/CaseResource/Discussion?globalParent={globalParent}",
            "discussion-case-v2": params.proxyPrefix + "Api/CaseResource/{globalParent}/Discussion",
            "get-users": params.proxyPrefix + "Rest/Users/UserPictures",
            "new-discussion": params.proxyPrefix + "Api/CaseResource/Discussion",
            "count-comments": params.proxyPrefix + "Api/CaseResource/{idParent}/Comment/Count",
            "comment-case": params.proxyPrefix + "Api/CaseResource/{idParent}/Comment",
            "new-comment": params.proxyPrefix + "Api/CaseResource/Comment",
            "new-comment-attach": params.proxyPrefix + "Api/CaseResource/Attachment",
            "get-list-files": params.proxyPrefix + "Api/CaseResource/File?globalParent={globalParent}",
            "get-list-files-v2": params.proxyPrefix + "Api/CaseResource/{globalParent}/File",
            "project-resource-action": params.proxyPrefix + "Api/CaseResource/{typeResource}",
            "thumbnail-file": params.proxyPrefix + "Api/CaseResource/File/Thumbnails",
            "get-attachment": params.proxyPrefix + "Api/CaseResource/Attachment/{idAttachment}",
            "get-mobile-attachment": params.proxyPrefix + "Api/CaseResource/Mobile/Attachment/{idAttachment}",

            //Files and Attachments
            "project-files-upload": params.proxyPrefix + "Api/CaseResource/File",
            "count-files": params.proxyPrefix + "Api/CaseResource/File/Count?globalParent={globalParent}",
            "count-files-v2": params.proxyPrefix + "Api/CaseResource/{globalParent}/File/Count",
            "remove-comment": params.proxyPrefix + "Api/CaseResource/Comment",

            //Mobile CaseSummary
            "time-schemas-effectiveduration": params.proxyPrefix + "Api/WorkingTimeSchema/EffectiveDuration?idUser={idUser}&fromDate={fromDate}&toDate={toDate}",
            "case-handler-getCaseAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Assignees",
            "project-users-get": params.proxyPrefix + "Rest/Users/UserPictures",

            //Mobile plans
            "project-plan-get": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-activities": params.proxyPrefix + "Api/Plans/{idPlan}/Activities",
            "project-plan-workitems": params.proxyPrefix + "Api/Plans/{idPlan}/WorkItems",
            "project-plan-transitions-get": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/Transitions",
            "project-plan-activity-edit": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/{id}",
            "project-plan-get-by-parent": params.proxyPrefix + "Api/Plans?parentWorkItem={parentWorkItem}",
            "project-plan-parent": params.proxyPrefix + "Api/Plans/{idPlan}/ParentCase",
            "project-plan-update": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-execute": params.proxyPrefix + "Api/Plans/Execute",
            "project-plan-close": params.proxyPrefix + "Api/Plans/Close",
            "project-plan-delete": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-first-parent-plan": params.proxyPrefix + "Api/Plans/{idPlan}/FirstParentPlan"
        };
    }
    return {};
};