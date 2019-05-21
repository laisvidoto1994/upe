<%@ Page language="c#" Codebehind="VerticalMenu.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.VerticalMenu" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Menu</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<!--#include file="include/BizAgiMeta.inc"-->
		<script language="JavaScript" src="Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="js/scripts.js"></script>
		<script language="JavaScript" src="js/implementation.js"></script>
	</HEAD>
	<body leftmargin="0" topmargin="0" class="MenuBackgroundImage">
		<table cellSpacing="0" cellPadding="0" width="50%" align="center" border="0">
			<tr>
				<td align="center"><img src="img/img/barra/Logo.gif" width="140" ></td>
			</tr>
			<tr height = "50px">
				<td align="center">&nbsp;</td>
			</tr>
			<tr>
				<td align="center">
					<a href="App/Inicio/inicio.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Home")); %>
					</a>
				</td>
			</tr>
			<%if (UserCredential != null){%>
			<tr>
				<td align="center">
					<a href="App/Radicar/application.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_NewCase")); %>
					</a>
				</td>
			</tr>
			<tr>
				<td align="center">
					<a href="App/ListaDetalle/listaitems.aspx?I_processState=Running" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Pending")); %>
					</a>
				</td>
			</tr>
			<tr>
				<td align="center">
					<a href="App/ListaDetalle/listaitems.aspx?I_ProcessState=Completed" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Closed")); %>
					</a>
				</td>
			</tr>
			<tr>
				<td align="center">
					<a href="App/ListaDetalle/search.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Search")); %>
					</a>
				</td>
			</tr>
			<%}%>
			<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.CasesMonitor)){%>
			<tr>
				<td align="center">
					<a href="App/Admin/CasesMonitor.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Cases Monitor")); %>
					</a>
				</td>
			</tr>
			<%}%>
			<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.ProcessAnalyzer)){%>
			<tr>
				<td align="center">
					<a href="App/Cockpit/menuanalyzer.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Analyzer")); %>
					</a>
				</td>
			</tr>
			<%}%>
			<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.CockPit)){%>
			<tr>
				<td align="center">
					<a href="App/Cockpit/menucockpit.aspx" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Cockpit")); %>
					</a>
				</td>
			</tr>
			<%}%>
			<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Admin)){%>
			<tr>
				<td align="center">
					<a href="App/Admin" target="main" class="flyoutLink">
						<% Response.Write(CResourceManager.RM.GetString("Menu_Admin")); %>
					</a>
				</td>
			</tr>
			<%}%>
			<tr height="50px">
				<td align="center">&nbsp;</td>
			</tr>			
			
			<tr>
				<td width="88%" align="right" align="center"><a href="http://www.bizagi.com" target="_blank"><img src="img/img/barra/BizAgiPowered.gif" width="109" height="36" border="0"></a></td>
			</tr>
		</table>
	</body>
</HTML>
