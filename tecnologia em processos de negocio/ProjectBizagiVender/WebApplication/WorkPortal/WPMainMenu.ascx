<%@ Control Language="c#" AutoEventWireup="false" Codebehind="WPMainMenu.ascx.cs" Inherits="BizAgiBPM.WorkPortal.WPMainMenu" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<%= this.AddMenuHeader(AuthorizationPages.Cases, "MenuCases") %>
		<%= this.AddMenuOption(AuthorizationPages.NewCase, "App/Radicar/application.aspx", "img/WorkPortal/Menu/WPNewCaseMenu.png", "Menu_NewCase")%>
		<%= this.AddMenuOption(AuthorizationPages.Pending, "App/ListaDetalle/listaitems.aspx?h_Location=" + BizAgi.UI.WFBase.CResourceManager.RM.GetString("Menu_Pending") + "&I_processState=Running", "img/WorkPortal/Menu/WPPendingCasesMenu.png", "Menu_Pending")%>
		<%= this.AddMenuOption(AuthorizationPages.Closed, "App/ListaDetalle/listaitems.aspx?h_Location=" + BizAgi.UI.WFBase.CResourceManager.RM.GetString("Menu_Closed") + "&I_ProcessState=Completed", "img/WorkPortal/Menu/WPClosedCasesMenul.png", "Menu_Closed")%>
		<%= this.AddMenuOption(AuthorizationPages.Search, "App/ListaDetalle/Search.aspx", "img/WorkPortal/Menu/WPCaseSearch.png", "Menu_Search")%>
	<%= this.AddMenuFooter(AuthorizationPages.Cases) %>

    <%= this.AddMenuHeader(AuthorizationPages.AnalysisReports, "MenuBAM") %>
        <%= this.AddMenuOption(AuthorizationPages.BAMProcess, "App/Cockpit/BAMProcess.aspx", "img/WorkPortal/Menu/GR_BAM_proc_lit.png", "BAM_Rep_ProcessInstances")%>
        <%= this.AddMenuOption(AuthorizationPages.BAMTask, "App/Cockpit/BAMTask.aspx", "img/WorkPortal/Menu/GR_BAM_task_lit.png", "BAM_Rep_Tasks")%>
        <%= this.AddMenuOption(AuthorizationPages.AnalyticsProcess, "App/Cockpit/AnalyticsProcess.aspx", "img/WorkPortal/Menu/GR_analysis_proc_lit.png", "Analytics_Rep_ProcessInstances")%>
        <%= this.AddMenuOption(AuthorizationPages.AnalyticsTask, "App/Cockpit/AnalyticsTask.aspx", "img/WorkPortal/Menu/GR_analysis_task_lit.png", "Analytics_Rep_Tasks")%>
        <%= this.AddMenuOption(AuthorizationPages.AnalyticsSensor, "App/Cockpit/AnalyticsSensor.aspx", "img/WorkPortal/Menu/GR_analysis_phase_lit.png", "Analytics_Rep_Phases")%>
    <%= this.AddMenuFooter(AuthorizationPages.AnalysisReports) %>

	<%= this.AddMenuHeader(AuthorizationPages.Admin, "MenuAdmin")%>
		<%if (IsProductionEnvironment){%>
		    <%= this.AddMenuOption(AuthorizationPages.ProcessAdmin, "App/Admin/AdminProcess.aspx", "img/analysis/WFClasses.png", "AdminProcesses")%>
		<%}%>
		
		<%= this.AddMenuOption(AuthorizationPages.UserAdmin, "App/Admin/ListUsers.aspx", "img/WorkPortal/Menu/WPAdminUsersMenu.png", "Users", BizAgi.Defs.BAEnvironment.CBAEnvironmentManager.IsDevelopmentEnvWithDeployedPackage())%>
		<%= this.AddMenuOption(AuthorizationPages.Licenses, "App/Admin/Licenses.aspx", "img/WorkPortal/Menu/symbol_copyright.png", "Licenses")%>
		<%= this.AddMenuOption(AuthorizationPages.EntityAdmin, "App/Admin/Entity.aspx", "img/WorkPortal/Menu/WPAdminEntitiesMenu.png", "Entities")%>
        <%= this.AddMenuOption(AuthorizationPages.CaseAdmin, "App/Admin/CaseSearch.aspx", "img/WorkPortal/Menu/WPAdminCasesMenu.png", "Cases")%>
        <%= this.AddMenuOption(AuthorizationPages.AlarmAdmin, "App/Admin/AlarmsAdmin.aspx", "img/WorkPortal/Menu/WPAdminAlarmsMenu.png", "Alarms", !this.IsProductionEnvironment)%>
        <%= this.AddMenuOption(AuthorizationPages.EncryptionAdmin, "App/Admin/Encrypt.aspx", "img/WorkPortal/Menu/WPAdminPasswordMenu.png", "Password Encryption")%>
        <%= this.AddMenuOption(AuthorizationPages.MobileUpdatesAdmin, "App/MobileUpdates/default.aspx", "img/WorkPortal/Menu/GR_BAM_proc_lit.png", "Mobile Updates")%>
        <%= this.AddMenuOption(AuthorizationPages.AsynchronousWorkitemRetries, "App/Admin/AsynchDisabledWorkitems.aspx", "img/WorkPortal/Menu/WPAdminAsyncMenu.png", "AsynchDisabledWorkitems_Header")%>

		<%if (this.IsBizagiAuthentication){%>
			<%= this.AddMenuOption(AuthorizationPages.UserPendingRequests, "App/Admin/UserPendingRequests.aspx", "img/WorkPortal/ContextMenu/CMEdit.png", "Admin_UserPendingRequests")%>
			<%= this.AddMenuOption(AuthorizationPages.AuthenticationLogQuery, "App/Admin/AuthLogQuery.aspx", "img/WorkPortal/ContextMenu/CMEdit.png", "Admin_AuthLogQuery")%>
		<%}%>
		
		<%= this.AddMenuOption(AuthorizationPages.CasesMonitor, "App/Admin/CasesMonitor.aspx", "img/WorkPortal/Menu/WPCaseMonitorMenu.png", "Cases Monitor")%>
        
		<%--if (this.HasAdvancedDeployment) {--%>
		    <%= this.AddMenuOption(AuthorizationPages.BusinessPolicies, "App/Admin/BusinessPolicies/BusinessPoliciesSelector.aspx", "img/WorkPortal/Menu/WPBusinessPoliciesMenu.png", "BusinessPolicies")%>
		<%--}%--%>
		
		<%--= this.AddMenuOption(AuthorizationPages.UsersActivity, "App/Admin/UsersActivity.aspx", "img/WorkPortal/Menu/WPAdminUsersActivityMenu.png", "UsersActivity") --%>
		<%= this.AddMenuOption(AuthorizationPages.Profiles, "App/Admin/ProfilesAdminSearch.aspx", "img/WorkPortal/Menu/WPProfilesMenu.png", "ProfileManager")%>
		<%= this.AddMenuOption(AuthorizationPages.UserDefaultAssignation, "App/Admin/DefaultAssignationUser.aspx?h_AdminDefaultAssign=1", "img/WorkPortal/Menu/WPDefaulUserAssignMenu.png", "UserDafultAssignationManager")%>
        <%if (this.HasAdvancedDeployment) {%>
		    <%= this.AddMenuOption(AuthorizationPages.LocationResources, "App/Admin/AdminLocResources.aspx", "img/WorkPortal/Menu/WPLanguageMenu.png", "LRLocalizationResources")%>
		<%}%>    
		<%= this.AddMenuOption(AuthorizationPages.GRDimensionAdmin, "App/Cockpit/DimensionEdit.aspx", "img/analysis/dimension.png", "GRAdminDim_Dimensions")%>
    <%= this.AddMenuFooter(AuthorizationPages.Admin)%>
	
    <%= this.AddMenuHeader(AuthorizationPages.CurrentUserAdministration, "MenuTools")%>
		<%if (UserPreferencesForm <= 0){%>
		    <%= this.AddMenuOption(AuthorizationPages.CurrentUserAdministration, "App/Admin/CurrentUser.aspx", "img/WorkPortal/Menu/WPPreferencesMenu.gif", "UserPreferences")%>
		<%} else {%>
		    <%= this.AddMenuOption(AuthorizationPages.CurrentUserAdministration, "App/Admin/CurrentUserByForm.aspx?idForm=" + this.UserPreferencesForm + "&referer=userPreferences", "img/WorkPortal/Menu/WPPreferencesMenu.gif", "UserPreferences")%>
		<%}%>
    <%= this.AddMenuFooter(AuthorizationPages.CurrentUserAdministration)%>
