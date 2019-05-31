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
        // Next lines when the language is not available yet.
        bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
        bizagi.localization = (typeof (bizagi.localization) !== "undefined") ? bizagi.localization : {};
        bizagi.localization.language = (typeof (bizagi.localization.language) !== "undefined") ? bizagi.localization.language : bizagi.language;
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
            "overrides": params.proxyPrefix + "Rest/Util/Overrides",
            "authorization-handler-getMenuAuthorization": params.proxyPrefix + "Rest/Authorization/MenuAuthorization",
            "authorization-handler-isCaseCreationAuthorized": params.proxyPrefix + "Rest/Authorization/Processes/{0}/IsCaseCreationAuthorized",
            "case-handler-getCaseSummary": params.proxyPrefix + "Rest/Cases/{idCase}/Summary",
            "case-handler-getCaseSummaryByGuid": params.proxyPrefix + "Rest/Cases/{guid}/SummaryByGuid",
            //ReleaseActivityResponse
            "case-handler-releaseActivity": params.proxyPrefix + "Rest/Cases/{idCase}/ReleaseActivity",

            //mobile beta services
            "case-handler-getCasesList": params.proxyPrefix + "Rest/Processes/GetCases",
            // Services to Offline capability
            "offline-getProcessTree": params.proxyPrefix + "Rest/Processes/OfflineProcessTree",
            //"offline-getForms": params.proxyPrefix + "Rest/Handlers/Render",
            "offline-getForms": params.proxyPrefix + "Rest/RenderForm/offlineForms",
            "offline-sendForm": params.proxyPrefix + "Rest/Cases/SaveAsynchWorkItemOffLine",
            ///
            "case-handler-getCaseTasks": params.proxyPrefix + "Rest/Cases/{idCase}/Tasks",
            "case-handler-getCaseEvents": params.proxyPrefix + "Rest/Cases/{idCase}/Events",
            "case-handler-getCaseSubprocesses": params.proxyPrefix + "Rest/Cases/{idCase}/Subprocesses",
            "case-handler-getTaskAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Tasks/{idTask}/Assignees",
            "case-handler-getCaseAssignees": params.proxyPrefix + "Rest/Cases/{idCase}/Assignees",
            "case-handler-getWorkItems": params.proxyPrefix + "Rest/Cases/{idCase}/WorkItems",
            "case-handler-getWorkItemsByGuid": params.proxyPrefix + "Rest/Cases/{guid}/WorkItemsByGuid",
            "case-handler-getAsynchExecutionState": params.proxyPrefix + "Rest/Cases/{idCase}/AsynchExecutionState",
            "case-handler-addNewCase": params.proxyPrefix + "Rest/Cases",
            "case-handler-startProcess": params.proxyPrefix + "Rest/Processes/StartProcess/{idProcess}",
            "case-handler-supportedLogTypes": params.proxyPrefix + "Rest/Cases/SupportedLogsTypes",
            "case-handler-getActivityLog": params.proxyPrefix + "Rest/Cases/{idCase}/ActivityLog",
            "case-handler-getActivityDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idWorkItemFrom}/ActivityDetailLog",
            "case-handler-getEntityLog": params.proxyPrefix + "Rest/Cases/{idCase}/EntityLog",
            "case-handler-getEntityDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/EntityDetailLog",
            "case-handler-getUserLog": params.proxyPrefix + "Rest/Cases/{idCase}/UserLog",
            "case-handler-getUserDetailLog": params.proxyPrefix + "Rest/Cases/{idCase}/{idUser}/UserDetailLog",
            "case-handler-getAdminLog": params.proxyPrefix + "Rest/Cases/{idCase}/AdminLog",
            "case-handler-getCaseFormsRenderVersion": params.proxyPrefix + "Rest/Cases/{idCase}/FormsRenderVersion",
            "case-handler-getCaseFormsRenderVersionByGuid": params.proxyPrefix + "Rest/Cases/{guid}/FormsRenderVersionByGuid",
            //Favorites Restful
            "favorites-handler-saveFavorite": params.proxyPrefix + "Rest/Favorites",
            "favorites-handler-deleteFavorite": params.proxyPrefix + "Rest/Favorites/{guidFavorite}",
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

            //Processes
            "process-handler-getAllProcesses": params.proxyPrefix + "Rest/Processes",
            "process-handler-getFavourites": params.proxyPrefix + "Rest/Home/MyFavorites/Count",
            "process-handler-getMyStuff": params.proxyPrefix + "Rest/Home/MyStuff",
            "process-handler-getFavouriteCases": params.proxyPrefix + "Rest/Home/MyFavorites",
            "process-handler-getActions": params.proxyPrefix + "Rest/Home/Actions",
            "process-handler-getCustomizedColumnsData": params.proxyPrefix + "Rest/Processes/CustomizedColumnsData",
            "process-handler-getCategory": params.proxyPrefix + "Rest/Processes/Categories",
            "process-handler-getRecentProcesses": params.proxyPrefix + "Rest/Processes/RecentProcesses",
            "process-handler-getCustomizedColumnsDataInfo": params.proxyPrefix + "Rest/Processes/CustomizedColumnsDataInfo",
            "process-handler-getOrganizations": params.proxyPrefix + "Rest/Profile/Organizations",
            "process-handler-getActivitiesData": params.proxyPrefix + "Api/Processes/CasesData/MyActivities",
            "process-handler-getPendingsData": params.proxyPrefix + "Api/Processes/CasesData/MyPendings",
            "process-handler-getUsersCases": params.proxyPrefix + "Api/Cases/{caseId}/Users",
            "process-handler-getActionsEvents": params.proxyPrefix + "Api/Cases/{caseId}/CurrentEvents",
            // TODO: Check this service
            // This service make an error when the user try to create a new case
            //"process-handler-getOrganizations": params.proxyPrefix + "Rest/Profile/{type}",

            //Queries Restful
            "query-handler-getqueries": params.proxyPrefix + "Rest/Queries",
            "query-handler-getqueries-definitions": params.proxyPrefix + "Rest/Queries/Definitions",
            "query-handler-getQueryFormResponse": params.proxyPrefix + "Rest/Queries/Search",
            "query-handler-getQueryFormExportExcel": params.proxyPrefix + "Rest/Queries/ExportToExcel",
            "query-handler-getQueryForm": params.proxyPrefix + "Rest/Handlers/Render",
            "query-handler-storedQueryForm": params.proxyPrefix + "Rest/StoredQueryForms",
            "query-handler-storedQueryForm-id": params.proxyPrefix + "Rest/StoredQueryForms/{idStoredQueryForm}",

            //Preferences Restfull
            "preferences-handler-getPreferencesForm": params.proxyPrefix + "Rest/Handlers/Render",

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
            "ListPreferences": (bizagi.UserPreferencesUrl != "") ? params.proxyPrefix + bizagi.UserPreferencesUrl : params.proxyPrefix + "App/Admin/CurrentUser.aspx",
            "GRDimensionAdmin": params.proxyPrefix + "App/Cockpit/DimensionEdit.aspx",
            "Licenses": params.proxyPrefix + "App/Admin/Licenses.aspx",
            "AnalysisQueries": params.proxyPrefix + "App/Inicio/WPAnalysisQuery.aspx",
            "DocumentTemplates": params.proxyPrefix + "App/Admin/AdminDocumentTemplates.aspx",
            "ProcessAdmin": params.proxyPrefix + "App/Admin/AdminProcess.aspx",
            "ResourceBAM": params.proxyPrefix + "App/Cockpit/BAMResourceMonitor.aspx",
            "WorkPortalVersion": params.proxyPrefix + "Rest/Util/Version",
            // user preferences old form
            "PreferenceFormOld": params.proxyPrefix + "App/Admin/CurrentUserByForm.aspx",
            // entities administration
            "entities-administration": "RestServices/EntityHandler.ashx",
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
            "massive-activity-assignments-searchUsers": params.proxyPrefix + "Rest/Users",
            "massive-activity-assignments-searchUsersById": params.proxyPrefix + "Rest/Users/ByIds",
            //Asynchronous ECM Upload
            "async-ecm-upload-baseService": params.proxyPrefix + "Rest/Handlers/Metadata",
            // Workportal
            "domains": params.proxyPrefix + "Rest/Authentication/Domains",
            // Theme Builder
            "ThemeBuilder": params.proxyPrefix + "ThemeBuilder/index.html?language=" + bizagi.localization.language,
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
            "admin-sendUserEmail": params.proxyPrefix + "Rest/Users/SendUserEmail",
            "admin-getApplicationList": params.proxyPrefix + "Rest/Application",
            "admin-getApplicationProcesses": params.proxyPrefix + "Rest/Application/{idApp}/Process",
            "admin-getProcessVersion": params.proxyPrefix + "Rest/Processes/Version",
            "admin-getProcessTasks": params.proxyPrefix + "Rest/Processes/Version/{version}/Tasks",
            "admin-userGetPositions": params.proxyPrefix + "Rest/Users/GetPositions",

            //users administration
            "admin-usersform": params.proxyPrefix + "Rest/Handlers/Render",

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
            "admin-getUsersForAssignation": params.proxyPrefix + "Rest/Users/UsersForAssignation",
            "admin-getUsersList": params.proxyPrefix + "Rest/Users/SearchUsers",
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
            "admin-async-activities-get-retry-now": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idworkItem}/{idAsynchWorkitem}/RetryNow",
            "admin-async-activities-get-activities-by-task": params.proxyPrefix + "Rest/Cases/Asynchronous/Activities/Task",
            "admin-async-activities-enable-execution": params.proxyPrefix + "Rest/Cases/Asynchronous/Enable",
            "admin-async-activities-enable-multiple": params.proxyPrefix + "Rest/Cases/Asynchronous/EnableMultiple",
            "admin-async-activities-async-execution": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idWorkitem}/AsynchExecution",
            "admin-async-activities-async-execution-log": params.proxyPrefix + "Rest/Cases/{idCase}/Workitem/{idworkItem}/{idAsynchWorkitem}/AsynchExecutionLog",
            "admin-Licenses": params.proxyPrefix + "Rest/Licenses",
            "admin-audit-license": params.proxyPrefix + "Rest/Licenses/auditLicense",
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
            //"admin-entities-list": params.proxyPrefix + "Rest/Entities",
            "admin-entities-list": params.proxyPrefix + "Api/Entities/Parametrics",
            "admin-stakeholders-list": params.proxyPrefix + "Api/Entities/Stakeholders",
            //"admin-entities-row-data": params.proxyPrefix + "Rest/Entities/{idEntity}/Instances",
            "admin-entities-row-data": params.proxyPrefix + "Api/Entities/{guidEntity}/Data",
            "admin-user-stakeholders": params.proxyPrefix + "Api/Users/{idUser}/Stakeholders",
            "admin-entities-migrated-entity": params.proxyPrefix + "Rest/Entities/migratedEntity",
            "admin-entities-get-form": params.proxyPrefix + "Rest/Handlers/Render",
            "admin-entity-simpleData": params.proxyPrefix + "Rest/Entities/{idEntity}/Instances/Brief",
            "admin-language-bizagi-objects": params.proxyPrefix + "Rest/Multilanguage/BizagiObjects",
            "admin-language-entities": params.proxyPrefix + "Rest/Multilanguage/Entities",
            "admin-language-resource": params.proxyPrefix + "Rest/Multilanguage/Resource",
            "admin-language-resource-download": params.proxyPrefix + "Rest/Multilanguage/LanguageExcel",
            "admin-language-entities-download": params.proxyPrefix + "Rest/Multilanguage/EntitiesExcel",
            "admin-language-languages": params.proxyPrefix + "Rest/Multilanguage/Languages",
            "admin-language-reset": params.proxyPrefix + "Rest/Multilanguage/ResetPersonalization",
            "admin-holidays-schemas": params.proxyPrefix + "Api/WorkingTimeSchema/Holidays",
            "admin-holidays-schema": params.proxyPrefix + "Api/WorkingTimeSchema/Holidays/{schema}",
            "admin-projectname": params.proxyPrefix+ "Api/Project/Name",
            "bam-resourcemonitor-myteam": params.proxyPrefix + "Rest/Reports/BAM/Resources/MyTeam",
            "reports-analysisquery": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "reports-analysisquery-update": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "reports-analysisquery-delete": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
            "processviewer-processdefinition": params.proxyPrefix + "Rest/Reports/Components/ProcessDefinition",
            "processviewer-processgraphicinfo": params.proxyPrefix + "Rest/Reports/Components/ProcessGraphicInfo",
            "processviewer-paths": params.proxyPrefix + "Rest/Reports/Analytics/Process/FrequentPaths",

            // Mobile Updates
            "mobile-getLastUpdate": params.proxyPrefix + "Rest/Util/mobileUpdates",

            // Rest for users log (dummy)
            "admin-userslog": params.proxyPrefix + "Rest/Users/UserAdminLog",

            // Rest to get number of licenses
            "admin-userslicenses": params.proxyPrefix + "Rest/Licenses/CanAddNewUser",
            "admin-createuserform": params.proxyPrefix + "Rest/Users/CreateUserAdminForm",
            "graphicquery-trailusers": params.proxyPrefix + "Rest/Cases/TrailUsers",

            // Rest to Feature Project
            "admin-userpreferenceform-isnew": params.proxyPrefix + "Rest/Authorization/UserPreferenceForm",
            "time-schemas-effectiveduration": params.proxyPrefix + "Api/WorkingTimeSchema/EffectiveDuration?idUser={idUser}&fromDate={fromDate}&toDate={toDate}",
            "time-schemas-end-hour-working-by-date": params.proxyPrefix + "Api/WorkingTimeSchema/EndHourWorkingByDate?idUser={idUser}&date={date}",

            // Rest to Feature Project Resources
            "project-resource-action": params.proxyPrefix + "Api/CaseResource/{typeResource}",
            "project-resource-get": params.proxyPrefix + "Api/CaseResource/{typeResource}?globalParent={globalParent}",
            "project-resource-delete": params.proxyPrefix + "Api/CaseResource/{typeResource}/{idResource}",
            "project-users-get": params.proxyPrefix + "Rest/Users/UserPictures",
            "project-comments-get": params.proxyPrefix + "Api/CaseResource/{idParent}/Comment?dateTime={dateTime}&count={count}",
            "project-comments-count-by-parent": params.proxyPrefix + "Api/CaseResource/{idParent}/Comment/Count",
            "project-util-current-time": params.proxyPrefix + "Api/CaseResource/Util/CurrentTime",
            "project-comments-uploadfiles": params.proxyPrefix + "Api/CaseResource/Attachment",
            "project-attachment-download": params.proxyPrefix + "Api/CaseResource/Attachment/{Attachment}",
            "project-files-upload": params.proxyPrefix + "Api/CaseResource/File",
            "project-files-list": params.proxyPrefix + "Api/CaseResource/File?globalParent={globalParent}",
            "project-files-thumbnails": params.proxyPrefix + "Api/CaseResource/File/Thumbnails",
            "project-plan-createactivity": params.proxyPrefix + "Api/Plans/{idPlan}/Activities",
            "project-plan-get": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-get-case": params.proxyPrefix + "Api/Plans/{idPlan}/IdCase",
            "project-plan-get-by-parent": params.proxyPrefix + "Api/Plans?parentWorkItem={parentWorkItem}",
            "project-plan-execute": params.proxyPrefix + "Api/Plans/Execute",
            "project-plan-close": params.proxyPrefix + "Api/Plans/Close",
            "project-plan-delete": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-activities": params.proxyPrefix + "Api/Plans/{idPlan}/Activities",
            "project-plan-workitems": params.proxyPrefix + "Api/Plans/{idPlan}/WorkItems",
            "project-plan-parent": params.proxyPrefix + "Api/Plans/{idPlan}/ParentCase",
            "project-plan-first-parent-plan": params.proxyPrefix + "Api/Plans/{idPlan}/FirstParentPlan",
            "project-plan-first-parent": params.proxyPrefix + "Api/Plans/{idPlan}/FirstParentCase",
            "project-activity-update-progress": params.proxyPrefix + "Api/Plans/Activity/{idActivity}/Progress",
            "project-plan-update": params.proxyPrefix + "Api/Plans/{idPlan}",
            "project-plan-activity-tasks-get": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/{idActivity}/Items",
            "project-plan-activity-get": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/{idActivity}",
            "project-plan-activity-delete": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/{id}",
            "project-plan-activity-edit": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/{id}",
            "project-plan-transitions-get": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/Transitions",
            "project-plan-transitions-put": params.proxyPrefix + "Api/Plans/{idPlan}/Activities/Transitions",
            "project-plan-template-create-by-plan": params.proxyPrefix + "Api/Plans/Templates",
            "project-plan-template-get": params.proxyPrefix + "Api/Templates",
            "project-timeline-events-get": params.proxyPrefix + "Api/CaseResource/TimeLine?globalParent={idCase}",
            "project-workitem-assignees": params.proxyPrefix + "Api/CaseResource/{idWorkitem}/Assignees",


            // Rest to Feature Action Planning Resources
            "project-plan-create": params.proxyPrefix + "Api/Plans",
            "project-plan-create-by-template": params.proxyPrefix + "Api/Templates/{idTemplate}/Plans",
            "project-plan-get-all": params.proxyPrefix + "Api/Plans/Templates/get",
            "plans": params.proxyPrefix + "Api/Plans",

            //HomePortal
            "stuff-handler-getUserStuff": params.proxyPrefix + "Api/CurrentUser/Collections",
            "get-current-theme": params.proxyPrefix + "Api/CurrentUser/GetCurrentTheme",

            "process-handler-getIdCasesOfProcessEntities": params.proxyPrefix + "Api/Entities/Cases",

            //HomePortal
            "handler-get-myShortcuts": params.proxyPrefix + "Api/CurrentUser/Shortcuts",
            "handler-execute-action-start": params.proxyPrefix + "Api/Cases/{processId}/Start", //-dg-c-
            "handler-validate-action-has-start-form": params.proxyPrefix + "Api/Processes/{processId}/StartContext", //-dg-c-

            //ICONS && IMAGES
            "process-getIcon": params.proxyPrefix + "Api/Processes/{processId}/Icon",
            "collections-getIcon": params.proxyPrefix + "Api/CurrentUser/Collections/{collectionId}/Icon",

            //Templates
            "data-navigation-handler-collection": params.proxyPrefix + "Api/CurrentUser/Collections/{reference}/Data/{surrogateKey}",
            "data-navigation-handler-entity": params.proxyPrefix + "Api/CurrentUser/Entities/{reference}/Data/{surrogateKey}/{xpath}",
            "data-navigation-handler-entity-filters": params.proxyPrefix + "Api/CurrentUser/Entities/{reference}/Filters/{surrogateKey}/{xpath}",

            //"action-handler-getProcessAddAction": params.proxyPrefix + "Api/Entities/{guidLeftEntity}/Collection/{guidFact}/Actions?surrogateKey={surrogateKeyLeftEntity}",
            "action-handler-getProcessAddAction": params.proxyPrefix + "Api/CurrentUser/Collections/{reference}/{surrogateKey}/Actions",

            "entities-handler-getMapping" : params.proxyPrefix + "Rest/Entities/Mapping",
            "entities-handler-getActions": params.proxyPrefix + "Api/Entities/{guidEntity}/{surrogateKey}/actions",
            "actions-handler-getDataForm": params.proxyPrefix + "Rest/Handlers/Render",
            "actions-handler-hasStartForm": params.proxyPrefix + "Rest/Processes/HasStartForm",
            "actions-handler-executeRule-simple": params.proxyPrefix + "Api/Rules/{ruleId}/Execute",
            "actions-handler-executeRule-multiple": params.proxyPrefix + "Api/Rules/{ruleId}/ExecuteMultiple",

            //sort bar
            "sort-bar-getMultipleInstancesActions" : params.proxyPrefix + "Rest/Entities/multipleInstancesActions",
            "sort-bar-getMapping" : params.proxyPrefix + "Rest/Entities/Mapping",
            "sort-bar-execute" : params.proxyPrefix + "Api/Action/Execute",

			// activity map
			"activity-map":params.proxyPrefix + "Rest/Processes/ActivityMap/",
            "activity-map-getActivitySummary" : params.proxyPrefix + "Rest/Processes/ActivitySummary",
            "subprocess-map": params.proxyPrefix + "Rest/Processes/SubProcessMap",

            //Shocuts
            'shorcuts-getStakeHolderShorcuts': params.proxyPrefix + "/Api/Stakeholder/Shortcuts",

            //My Search
            'my-search-getSearchLists': params.proxyPrefix + "Api/CurrentUser/Searches",
            'my-search-getFilters': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/Filters",
            'my-search-getFiltersData': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/FilterData",
            'my-search-getData': params.proxyPrefix + "Api/CurrentUser/Searches/{guidSearch}/Data",

            //Adhoc Processes
            "admin-createNewAdhocProcess": params.proxyPrefix + "Api/AdhocProcessesTemp",
            "adhoc-process-start": params.proxyPrefix + "Api/AdhocProcesses/{processId}/Start",
            "admin-getAdhocProcessesList": params.proxyPrefix + "Api/AdhocProcesses/Search",
            "admin-createAdhocProcess": params.proxyPrefix + "Api/AdhocProcesses/Create",
            "admin-updateAdhocProcess": params.proxyPrefix + "Api/AdhocProcesses/Update",
            "admin-updateAdhocTask": params.proxyPrefix + "Api/AdhocProcesses/{processId}/Activity",
            "admin-deleteAdhocTask": params.proxyPrefix + "Api/AdhocProcesses/{processId}/Activity/{taskId}",
            "admin-deleteAdhocProcess": params.proxyPrefix + "Api/AdhocProcesses/{processId}",
            "admin-publishAdhocProcess": params.proxyPrefix + "Api/AdhocProcesses/Publish",
            "admin-cloneAdhocProcess": params.proxyPrefix + "Api/AdhocProcesses/Clone",
            "admin-getAdhocDataSchema": params.proxyPrefix + "Api/AdhocProcesses/DataSchema/{processId}",
            "admin-getAdhocProcessDiagram": params.proxyPrefix + "Api/AdhocProcessesTemp/{processId}/Diagram/{diagramId}",
            "admin-getAdhocTask": params.proxyPrefix + "Api/AdhocProcesses/{processId}/Task/{taskId}",
            "admin-getAllEntities": params.proxyPrefix + "Api/AdhocProcesses/Entities",
            "admin-getAllCategories": params.proxyPrefix + "Api/AdhocProcesses/Categories",
            "admin-saveAdhocProcessDiagram": params.proxyPrefix + "Api/AdhocProcessesTemp/{processId}/Diagram",

            //Adhoc Entities
            "admin-adhoc-entities-list": params.proxyPrefix + "Api/AdhocProcesses/AdhocEntity/All",
            "admin-saveAdhocEntity": params.proxyPrefix + "Api/AdhocProcesses/AdhocEntity/Save",
            "admin-saveAdhocEntityInstance": params.proxyPrefix + "Api/AdhocProcesses/AdhocEntity/{entityId}/Instance/{isNew}",
            "admin-adhoc-entity-instances": params.proxyPrefix + "Api/AdhocProcesses/AdhocEntity/{entityId}/Instances",
            "admin-entity-values": params.proxyPrefix + "Api/AdhocProcesses/{context}/{entityId}/Values",

            //Adhoc Groups
            "admin-adhoc-user-group-list": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/All",
            "admin-adhoc-user-group-save": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/Save",
            "admin-adhoc-user-group-delete": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/{groupId}",            
            "admin-adhoc-user-group-data-get": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/{groupId}/Users",
            "admin-adhoc-user-group-data-add": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/{groupId}/Users/{userId}/Add",
            "admin-adhoc-user-group-data-remove": params.proxyPrefix + "Api/AdhocProcesses/AdhocGroup/{groupId}/Users/{userId}",
            "admin-adhoc-authorization-data-get": params.proxyPrefix + "Api/AdhocProcesses/Authorization",
            "admin-adhoc-authorization-data-save": params.proxyPrefix + "Api/AdhocProcesses/{processId}/{isAdhocTask}/Authorization/Save",
	    
	        //oauth2 Applications
            "oauth2-getApplications": params.proxyPrefix + "oauth2/server/application",
            "oauth2-getApplication": params.proxyPrefix + "oauth2/server/application/id/{applicationId}",
            "oauth2-createApplication": params.proxyPrefix + "oauth2/server/application",
            "oauth2-deleteApplication": params.proxyPrefix + "oauth2/server/application/{applicationId}",
            "oauth2-updateApplication": params.proxyPrefix + "oauth2/server/application/{applicationId}",
            "oauth2-updateClientSecretKeysApplication": params.proxyPrefix + "oauth2/server/application/{applicationId}/updateClientSecretKeys"
        };
    }

    // Sharepoint end-points (must be customized for each project)
    if (params.context == "sharepoint" || params.context == "portal") {
        if (typeof (params.sharepointProxyPrefix) === "undefined")
            alert("sharepointProxyPrefix param is requiered to build endpoints when context is 'sharepoint'");
        return {
            "user-handler": params.sharepointProxyPrefix + "RestServices/UserHandler.ashx",
            "process-handler": params.sharepointProxyPrefix + "RestServices/ProcessHandler.ashx",
            "query-handler": params.sharepointProxyPrefix + "Rest/Handlers/Query",
            "case-handler": params.sharepointProxyPrefix + "RestServices/CaseHandler.ashx",
            "query-form": params.sharepointProxyPrefix + "App/ListaDetalle/QueryForm.aspx",
            "query-form-edit": params.sharepointProxyPrefix + "App/ListaDetalle/SaveQuery.aspx",
            "query-form-delete": params.sharepointProxyPrefix + "App/ListaDetalle/QueryForm.aspx",

            "query-form-delete-cube": params.sharepointProxyPrefix + "Rest/Queries/Cubes/{idCube}",

            "favorites-handler": params.sharepointProxyPrefix + "RestServices/FavoritesHandler.ashx",
            "file-handler": params.sharepointProxyPrefix + "RestServices/EntityHandler.ashx",
            "login-handler": params.sharepointProxyPrefix + "RestServices/UserHandler.ashx?action=authenticateUser&userName={0}&password={1}&domain={2}",
            "logoff-handler": params.sharepointProxyPrefix + "RestServices/UserHandler.ashx?action=logOff",
            // Rest Services
            "overrides": params.sharepointProxyPrefix + "Rest/Util/Overrides",
            "authorization-handler-getMenuAuthorization": params.sharepointProxyPrefix + "Rest/Authorization/MenuAuthorization",
            "authorization-handler-isCaseCreationAuthorized": params.sharepointProxyPrefix + "Rest/Authorization/Processes/{0}/IsCaseCreationAuthorized",
            "case-handler-getCaseSummary": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Summary",
            "case-handler-getCaseSummaryByGuid": params.sharepointProxyPrefix + "Rest/Cases/{guid}/SummaryByGuid",
            //ReleaseActivityResponse
            "case-handler-releaseActivity": params.proxyPrefix + "Rest/Cases/{idCase}/ReleaseActivity",
            "case-handler-getCaseTasks": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Tasks",
            "case-handler-getCaseEvents": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Events",
            "case-handler-getCaseSubprocesses": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Subprocesses",
            "case-handler-getTaskAssignees": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Tasks/{idTask}/Assignees",
            "case-handler-getCaseAssignees": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Assignees",
            "case-handler-getWorkItems": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/WorkItems",
            "case-handler-getWorkItemsByGuid": params.sharepointProxyPrefix + "Rest/Cases/{guid}/WorkItemsByGuid",
            "case-handler-getAsynchExecutionState": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/AsynchExecutionState",
            "case-handler-addNewCase": params.sharepointProxyPrefix + "Rest/Cases",
            "case-handler-startProcess": params.sharepointProxyPrefix + "Rest/Processes/StartProcess/{idProcess}",
            "case-handler-getActivityLog": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/ActivityLog",
            "case-handler-getActivityDetailLog": params.sharepointProxyPrefix + "Rest/Cases/{idWorkItemFrom}/ActivityDetailLog",
            "case-handler-getEntityLog": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/EntityLog",
            "case-handler-getEntityDetailLog": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/EntityDetailLog",
            "case-handler-getUserLog": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/UserLog",
            "case-handler-getUserDetailLog": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/UserDetailLog",
            "case-handler-getCaseFormsRenderVersion": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/FormsRenderVersion",
            "case-handler-getCaseFormsRenderVersionByGuid": params.sharepointProxyPrefix + "Rest/Cases/{guid}/FormsRenderVersionByGuid",
            // Services to Offline capability
            "offline-getProcessTree": params.proxyPrefix + "Rest/Processes/OfflineProcessTree",
            //"offline-getForms": params.proxyPrefix + "Rest/Handlers/Render",
            "offline-getForms": params.proxyPrefix + "Rest/RenderForm/offlineForms",
            "offline-sendForm": params.proxyPrefix + "Rest/Cases/SaveAsynchWorkItemOffLine",
            //mobile beta services
            "case-handler-getCasesList": params.proxyPrefix + "Rest/Processes/GetCases",

            //Favorites Restful
            "favorites-handler-saveFavorite": params.sharepointProxyPrefix + "Rest/Favorites",
            "favorites-handler-deleteFavorite": params.sharepointProxyPrefix + "Rest/Favorites/{guidFavorite}",
            //BAMAnalytics Restful
            "bamAnalytics-handler-getAnalisysQueries": params.sharepointProxyPrefix + "Rest/BAMAnalytics/AnalisysQueries",
            "bamAnalytics-handler-updateQuery": params.sharepointProxyPrefix + "Rest/BAMAnalytics/Reports/Ids/{idQuery}",
            //Inbox Restful
            "inbox-handler-getInboxSummary": params.sharepointProxyPrefix + "Rest/Inbox/Summary",
            //Messages Restful
            "MessageHandler-NewComment": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments",
            "MessageHandler-GetComments": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments",
            "MessageHandler-SetCategoryToComment": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments/{idComment}",
            "MessageHandler-RemoveComment": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments/{idComment}",
            "MessageHandler-ReplyComment": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments/{idComment}/Replies",
            "MessageHandler-RemoveReply": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments/{idComment}/Replies/{idReply}",
            "MessageHandler-GetCategoryColors": params.sharepointProxyPrefix + "Rest/Cases/Comments/CategoryColors",
            "MessageHandler-RenameCategoryColor": params.sharepointProxyPrefix + "Rest/Cases/Comments/CategoryColors/{idColorCategory}",
            "MessageHandler-CountNewComments": params.sharepointProxyPrefix + "Rest/Cases/{idCase}/Comments/{idLastComment}",
            //Processes Restful
            "process-handler-getAllProcesses": params.sharepointProxyPrefix + "Rest/Processes",
            "process-handler-getCustomizedColumnsData": params.sharepointProxyPrefix + "Rest/Processes/CustomizedColumnsData",
            "process-handler-getCategory": params.sharepointProxyPrefix + "Rest/Processes/Categories",
            "process-handler-getRecentProcesses": params.sharepointProxyPrefix + "Rest/Processes/RecentProcesses",
            "process-handler-getCustomizedColumnsDataInfo": params.sharepointProxyPrefix + "Rest/Processes/CustomizedColumnsDataInfo",
            "process-handler-getActivitiesData": params.sharepointProxyPrefix + "Rest/Processes/CasesData/MyActivities",
            "process-handler-getPendingsData": params.proxyPrefix + "Rest/Processes/CasesData/MyPendings",
            //Queries Restful
            "query-handler-getqueries": params.sharepointProxyPrefix + "Rest/Queries",
            //Users Restful
            "user-handler-getCurrentUser": params.sharepointProxyPrefix + "Rest/Users/CurrentUser",
            // Old render integration, readonly
            "old-render": params.sharepointProxyPrefix + "App/ListaDetalle/Detalle.aspx",
            //Service locator for reports 
            "Reports": params.sharepointProxyPrefix + "RestServices/BAMAnalyticsHandler.ashx",
            "reports-handler-deleteQueries": params.sharepointProxyPrefix + "Rest/BAMAnalytics/Reports/{QueryId}",
            //Service locator for bizagi folders
            "folders-handler-getUserQueries": params.sharepointProxyPrefix + "Rest/SmartFolders",
            "folders-associate-deleteSmartFolder": params.sharepointProxyPrefix + "Rest/SmartFolders/{idSmartFolder}",
            "folders-handler": params.sharepointProxyPrefix + "RestServices/SmartFoldersHandler.ashx",
            "folders-associate": params.sharepointProxyPrefix + "App/Ajax/AJAXGateway.aspx",
            "smartfolders-integration": params.sharepointProxyPrefix + "App/WorkPortal/ConfigureFilteredFolder.aspx",
            //Service locator for menu        
            "AlarmAdmin": params.sharepointProxyPrefix + "App/Admin/AlarmsAdmin.aspx",
            "AnalyticsProcess": params.sharepointProxyPrefix + "App/Cockpit/AnalyticsProcess.aspx",
            "AnalyticsSensor": params.sharepointProxyPrefix + "App/Cockpit/AnalyticsSensor.aspx",
            "AnalyticsTask": params.sharepointProxyPrefix + "App/Cockpit/AnalyticsTask.aspx",
            "AsynchronousWorkitemRetries": params.sharepointProxyPrefix + "App/Admin/AsynchDisabledWorkitems.aspx",
            "AuthenticationLogQuery": params.sharepointProxyPrefix + "App/Admin/AuthLogQuery.aspx",
            "BAMProcess": params.sharepointProxyPrefix + "App/Cockpit/BAMProcess.aspx",
            "BAMTask": params.sharepointProxyPrefix + "App/Cockpit/BAMTask.aspx",
            "BusinessPolicies": params.sharepointProxyPrefix + "App/Admin/BusinessPolicies/BusinessPoliciesSelector.aspx",
            "CaseAdmin": params.sharepointProxyPrefix + "App/Admin/CaseSearch.aspx",
            "CasesMonitor": params.sharepointProxyPrefix + "App/Admin/CasesMonitor.aspx",
            "Closed": params.sharepointProxyPrefix + "App/ListaDetalle/listaitems.aspx?h_Location=Cerrados&I_ProcessState=Completed",
            "CurrentUser": params.sharepointProxyPrefix + "App/Admin/CurrentUser.aspx",
            "EncryptionAdmin": params.sharepointProxyPrefix + "App/Admin/Encrypt.aspx",
            "MobileUpdatesAdmin": params.sharepointProxyPrefix + "App/MobileUpdates/default.aspx",
            "EntityAdmin": params.sharepointProxyPrefix + "App/Admin/Entity.aspx",
            "LocationResources": params.sharepointProxyPrefix + "App/Admin/AdminLocResources.aspx",
            "NewCase": params.sharepointProxyPrefix + "App/Radicar/application.aspx",
            "Pending": params.sharepointProxyPrefix + "App/ListaDetalle/listaitems.aspx?h_Location=Pendientes&I_processState=Running",
            "Profiles": params.sharepointProxyPrefix + "App/Admin/ProfilesAdminSearch.aspx",
            "Search": params.sharepointProxyPrefix + "App/ListaDetalle/Search.aspx",
            "UserAdmin": params.sharepointProxyPrefix + "App/Admin/ListUsers.aspx",
            "UserDefaultAssignation": params.sharepointProxyPrefix + "App/Admin/DefaultAssignationUser.aspx?h_AdminDefaultAssign=1",
            "UserPendingRequests": params.sharepointProxyPrefix + "App/Admin/UserPendingRequests.aspx",
            "ListPreferences": params.sharepointProxyPrefix + "App/Admin/CurrentUser.aspx",
            "GRDimensionAdmin": params.sharepointProxyPrefix + "App/Cockpit/DimensionEdit.aspx",
            "Licenses": params.sharepointProxyPrefix + "App/Admin/Licenses.aspx",
            "AnalysisQueries": params.sharepointProxyPrefix + "App/Inicio/WPAnalysisQuery.aspx",
            "ProcessAdmin": params.sharepointProxyPrefix + "App/Admin/AdminProcess.aspx",
            "ResourceBAM": params.sharepointProxyPrefix + "App/Cockpit/BAMResourceMonitor.aspx",
            "WorkPortalVersion": params.sharepointProxyPrefix + "Rest/Util/Version",
            // entities administration
            "entities-administration": "RestServices/EntityHandler.ashx",
            // Themes
            "getCurrentTheme": params.sharepointProxyPrefix + "Api/Theme/Current",

            //HomePortal            
            "process-handler-getFavourites": params.proxyPrefix + "Rest/Home/MyFavorites/Count",
            "process-handler-getFavouriteCases": params.proxyPrefix + "Rest/Home/MyFavorites",
            "stuff-handler-getUserStuff": params.sharepointProxyPrefix + "Rest/Stakeholder/Collections",
            "stuff-handler-getUserStuff-v2": params.sharepointProxyPrefix + "Rest/Stakeholder/Collections/v2",
            //"templates-handler-getCollectionData": params.proxyPrefix + "Rest/Stakeholder/CollectionData",
            "templates-handler-getCollectionData": params.proxyPrefix + "Api/Collection/{idFact}/Data",
            "templates-handler-getVirtualCollectionData": params.proxyPrefix + "Api/Collection/{guidVirtualCollection}/VirtualData",
            "entities-handler-getMapping" : params.sharepointProxyPrefix + "Rest/Entities/Mapping",
            "entities-handler-getActions" : params.sharepointProxyPrefix + "Rest/Entities/Actions",
            "actions-handler-getDataForm": params.sharepointProxyPrefix + "Rest/Handlers/Render",
            "actions-handler-hasStartForm": params.sharepointProxyPrefix + "Rest/Processes/HasStartForm",
            "actions-handler-executeRule": params.sharepointProxyPrefix + "Rest/Action/Rule",
            "process-handler-getUsersAndEvents": params.sharepointProxyPrefix + "Rest/Processes/CasesData/UsersAndEvents"

        };
    }

    return {};
};
