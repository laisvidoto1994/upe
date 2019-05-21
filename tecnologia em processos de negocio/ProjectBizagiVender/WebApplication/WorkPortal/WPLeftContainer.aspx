<%@ Register TagPrefix="uc1" TagName="WPLeftPanelHeaderBar" Src="WPLeftPanelHeaderBar.ascx" %>
<%@ Page language="c#" Codebehind="WPLeftContainer.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.WorkPortal.WPLeftContainer" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>WPLeftContainer</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<style>
		TD{
				color: #2D2D2E;
				font : 8pt Tahoma;	
				font-weight: bold;			
		}
		</style>
		<script language="JavaScript" src="../js/WorkPortal/WPLeftPanel.js"></script>
		<link href="../css/WorkPortal/WPPanel.css" type="text/css" rel="stylesheet">
		<link href="../css/estilos.css" type="text/css" rel="stylesheet">
		<link href="../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<script language=javascript>
		function BARefreshParentFrame(frmName){
			eval(frmName+".location = "+frmName+".location;");
		}
		</script>
		
	</HEAD>
	<body onLoad="BALPLoad()" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" class="WPBgBody">
		<table border="0" width="100%" height="100%" id="BALPMainTable" cellpadding="0" cellspacing="0" >
			<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.Pending)) {%>
			<uc1:WPLeftPanelHeaderBar id="WPLeftPanelHeaderBar1" runat="server" BAName="BACases" HRef="../App/Inicio/WPTree.aspx" BAImageName="CasesTab.png" BADisplayNameResource="WPLeftPanelBizagiCasesTab" IsFirstImage=true></uc1:WPLeftPanelHeaderBar>
			<%}%>
			<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.SmartFolders)) {%>
			<uc1:WPLeftPanelHeaderBar id="Wpleftpanelheaderbar2" runat="server" BAName="BASmartFolders" HRef="../App/Inicio/WPSmartFolders.aspx" BAImageName="SmartFoldersTab.png" BADisplayNameResource="WPLeftPanelSmartFoldersTab"></uc1:WPLeftPanelHeaderBar>
			<%}%>
			<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.CustomFolders)) {%>
			<uc1:WPLeftPanelHeaderBar id="Wpleftpanelheaderbar3" runat="server" BAName="BACustomFolders" HRef="../App/Inicio/WPCustomFolders.aspx" BAImageName="CustomFolderTab.png" BADisplayNameResource="WPLeftPanelCustomFoldersTab"></uc1:WPLeftPanelHeaderBar>
			<%}%>
			<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.BizagiQueries)) {%>
			<uc1:WPLeftPanelHeaderBar id="Wpleftpanelheaderbar4" runat="server" BAName="BAQuery" HRef="../App/Inicio/WPQuery.aspx" BAImageName="SearchTab.png" BADisplayNameResource="WPLeftPanelCustomQueriesTab"></uc1:WPLeftPanelHeaderBar>			
			<%}%>
			<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.AnalysisQueries))      {%>
			<uc1:WPLeftPanelHeaderBar id="Wpleftpanelheaderbar5" runat="server" BAName="BAAnalysisQuery" HRef="../App/Inicio/WPAnalysisQuery.aspx" BAImageName="Analysis.png" BADisplayNameResource="WPLeftPanelAnalysisQueriesTab"></uc1:WPLeftPanelHeaderBar>			
			<%}%>
		</TABLE>
		  <img src="../img/WorkPortal/Frames/HeaderUp.gif" id=imgUp name=imgUp style="display:none"/>
		  <img src="../img/WorkPortal/Frames/HeaderDown.gif" id=imgDown name=imgDown style="display:none"/>

	</body>
</HTML>
