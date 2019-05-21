<%@ Page language="c#" Codebehind="Default.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin._Default" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Import Namespace="BizAgi.Defs" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Administration</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body>
		<form id="Default" method="post" runat="server">
			<span id="SpanHeader" runat="server"></span>
			<TABLE id="Table1" cellSpacing="1" cellPadding="1" width="90%" border="0" align="center">
				<TR>
					<td colspan="3" class="header">
						<UI:CLabel runat="server" Text="Administration" id="CLabel1" />
					</td>
				</TR>
				<TR>
					<TD></TD>
				</TR>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.UserAdmin)){%>
				<TR>
					<TD>&nbsp;&nbsp;<a href="ListUsers.aspx"><b><UI:CLabel runat="server" Text="Users" id="CLabel2" /></b></a></TD>
				</TR>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.Licenses)){%>
				<TR>
					<TD>&nbsp;&nbsp;<a href="Licenses.aspx"><b><UI:CLabel runat="server" Text="Licenses" id="CLabel7" /></b></a></TD>
				</TR>
				<%}%>
				<%}%>					
				<TR>
					<TD>&nbsp;&nbsp;<a href="Entity.aspx"><b><UI:CLabel runat="server" Text="Entities" id="CLabel3" /></b></a></TD>
				</TR>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.CaseAdmin)){%>
				<TR>
					<TD>&nbsp;&nbsp;<a href="CaseSearch.aspx"><b><UI:CLabel runat="server" Text="Cases" id="CLabel4" /></b></a></TD>
				</TR>
				<%}%>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.AlarmAdmin)){%>
				<TR>
					<TD>&nbsp;&nbsp;<a href="AlarmsAdmin.aspx"><b><UI:CLabel runat="server" Text="Alarms" id="CLabel5" /></b></a></TD>
				</TR>
				<%}%>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.EncryptionAdmin)){%>
				<TR>
					<TD>&nbsp;&nbsp;<a href="Encrypt.aspx"><b><UI:CLabel runat="server" Text="Password Encryption" id="CLabel6" /></b></a></TD>
				</TR>
				<%}%>
				<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.AsynchronousWorkitemRetries)){%>
					<TR>
						<TD>&nbsp;&nbsp;<a href="AsynchDisabledWorkitems.aspx"><b><UI:CLabel runat="server" Text="AsynchDisabledWorkitems_Header" id="lblAsynchWIRetries" /></b></a></TD>
					</TR>
				<%}%>
				<%if (AuthenticationService.GetCurrentAuthenticationType() == EAuthenticationType.BizAgi){%>
					<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential, AuthorizationPages.UserPendingRequests)){%>
					<TR>
						<TD>&nbsp;&nbsp;<a href="UserPendingRequests.aspx"><b><UI:CLabel runat="server" Text="Admin_UserPendingRequests" id="Clabel8" /></b></a></TD>
					</TR>
					<%}%>
					<%if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential, AuthorizationPages.AuthenticationLogQuery)){%>
					<TR>
						<TD>&nbsp;&nbsp;<a href="AuthLogQuery.aspx"><b><UI:CLabel runat="server" Text="Admin_AuthLogQuery" id="lblAuthLogQuery" /></b></a></TD>
					</TR>
					<%}%>
				<%}%>
				
			</TABLE>
		</form>
	</body>
</HTML>
