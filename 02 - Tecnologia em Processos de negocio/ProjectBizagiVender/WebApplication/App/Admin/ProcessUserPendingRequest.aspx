<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="ProcessUserPendingRequest.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.ProcessUserPendingRequest" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>ProcessUserPendingRequest</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		</style>
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<%=GetHeader()%>
		<form id="Form1" method="post" runat="server">
			<table align="center" width="90%">
				<tr>
					<td class="header" colspan="2">
						<B>
							<UI:CLabel runat="server" Text="ProcessPendingRequest_Header" id="lblHeader" /></B>
					</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
				</tr>
				<tr>
					<td>&nbsp;&nbsp;</td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Username" id="lblUsername" /></td>
					<td><asp:TextBox ID="txtUsername" runat="server" Width="200px"></asp:TextBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Domain" id="lblDomain" /></td>
					<td><asp:TextBox ID="txtDomain" runat="server" Width="200px"></asp:TextBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Email" id="lblEmail" /></td>
					<td><asp:TextBox ID="txtEmail" runat="server" Width="200px"></asp:TextBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Password" id="lblPassword" /></td>
					<td>
						<table bordeR="0">
						<tr>
						<td>						
							<asp:TextBox ID="txtPassword" runat="server" Width="200px"></asp:TextBox>&nbsp;&nbsp;
						</td>
						<td>	
							<UI:CButton id="btnRamdomPassword" runat="server" Text="BtnRandomPassword" class="sbttn"/>
						</td>
						</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Locked" id="lblLocked" /></td>
					<td><asp:CheckBox ID="chkLocked" runat="server"></asp:CheckBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Enabled" id="lblEnabled" /></td>
					<td><asp:CheckBox ID="chkEnabled" runat="server"></asp:CheckBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Expired" id="lblExpired" /></td>
					<td><asp:CheckBox ID="chkExpired" runat="server"></asp:CheckBox></td>
				</tr>
				<tr>
					<td width="25%"><UI:CLabel runat="server" Text="CUserPendingRequests_Observation" id="lblObservation" /></td>
					<td><asp:TextBox ID="txtObservation" TextMode="MultiLine" runat="server" Width="200px" Height="48px"></asp:TextBox></td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td colspan="2">
						<table>
						<tr>
						<td>
						<UI:CButton  ID="btnCancel" Text="BtnCancel" Runat="server" Width="100px"/>
						</td>
						<td>
						&nbsp;&nbsp;&nbsp;&nbsp;
						</td>
						<td>
						<UI:CButton ID="btnUpdate" Text="BtnUpdate" Runat="server" Width="100px"/>
						</td>
						</tr>
						</table>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
