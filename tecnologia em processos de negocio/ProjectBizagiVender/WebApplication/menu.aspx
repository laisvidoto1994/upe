<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="menu.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.menu" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Menu</title>
<!--#include file="include/BizAgiMeta.inc"-->
		<script language="JavaScript" src="Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="js/scripts.js"></script>
		<script language="JavaScript" src="js/implementation.js"></script>
	</HEAD>
	<body leftmargin="0" topmargin="0">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  <tr class="MenuBackgroundImage">
		    <td rowspan="2"><img src="img/img/barra/Logo.gif" width="197" height="63"></td>
		    <td height="44" colspan="2"><table width="100%" border="0" cellspacing="0" cellpadding="0">
		      <tr>
		        <td width="12%"></td>
		        <td width="88%" align="right"><a href="http://www.bizagi.com" target="_blank"><img src="img/img/barra/BizAgiPowered.gif" width="109" height="36" border="0"></a></td>
	          </tr>
					</table>
				</td>
	      </tr>
		  <tr>
		    <td align="right" class="MenuBackgroundImage"><img src="img/img/barra/Corner.gif" width="17" height="19"></td>
		    <td width="83%" valign="top">
					<a href="App/Inicio/inicio.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Home")); %>
					</a>&nbsp;| 
					<%if (UserCredential != null){%>
						<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.NewCase)){%>
							<a href="App/Radicar/application.aspx" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_NewCase")); %>
							</a>&nbsp;| 											
						<%}%>
						<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Pending)){%>
							<% if (ReadAppSettings("PendingOrderByExpirationDate", "0")!="1") {%>
								<a href="App/ListaDetalle/listaitems.aspx?I_processState=Running" target="main" class="flyoutLink">
							<% }else {%>
								<a href="App/ListaDetalle/listaitems.aspx?I_processState=Running&orden=wiEstimatedSolutionDate&T_EXPIRYDATE=1" target="main" class="flyoutLink">
							<% } %>					
							<% Response.Write(CResourceManager.RM.GetString("Menu_Pending")); %>
							</a>&nbsp;|
						<%}%>
						<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Closed)){%>
							<a href="App/ListaDetalle/listaitems.aspx?I_ProcessState=Completed" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_Closed")); %>
							</a>&nbsp;|
						<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Search)){%>
						<%}%>
							<a href="App/ListaDetalle/search.aspx" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_Search")); %>
							</a>&nbsp;|
						<%}%>
					<%}%>
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.CasesMonitor)){%>
						<a href="App/Admin/CasesMonitor.aspx" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Cases Monitor")); %>
						</a>&nbsp;|
					<%}%>
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.ProcessAnalyzer)){%>
						<a href="App/Cockpit/menuanalyzer.aspx" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_Analyzer")); %>				
						</a>&nbsp;| 
					<%}%>
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.CockPit)){%>
						<a href="App/Cockpit/menucockpit.aspx" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_Cockpit")); %>
						</a>&nbsp;|
					<%}%>
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Admin)){%>
						<a href="App/Admin" target="main" class="flyoutLink">
							<% Response.Write(CResourceManager.RM.GetString("Menu_Admin")); %>
						</a>
					<%}%>					
				<a href="app/inicio/logoff.aspx" target="_top" class="flyoutLink" ><% Response.Write(CResourceManager.RM.GetString("Menu_LogOff")); %></a>
			</td>
	      </tr>
    </table>
</body>
</HTML>
