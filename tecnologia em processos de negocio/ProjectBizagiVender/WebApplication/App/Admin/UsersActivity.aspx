<%@ Page language="c#" Codebehind="UsersActivity.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.UsersActivity" enableViewState="False" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>UsersActivity</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<% Header(); %>
		<form id="Form1" method=get runat="server" action="UsersActivity.aspx" name=Form1>
			<table id="tblUsersActivity" cellspacing="1" cellpadding="1" align="Center" border="0" style="border-width:0px;width:90%;">
				<tr>
					<td valign="Top" class="Header" colspan="2"><span id="Clabel1"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UsersActivity") %></span></STRONG><BR>
							<script language="javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UsersActivity") %>");
							</script>
					</td>
					<td valign="Top"></td>
				</tr>
				<tr>
					<td colspan="2">
						<img src="../../img/WorkPortal/Folders/UsersActivity.png" width="48" height="48" alt="" border="0" align="top" style="float:right">
						<br>
						<span id="Clabel12"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UsersActivity.Header") %>.</span></STRONG><BR>					
					</td>
					<td valign="Top"></td>
				</tr>
				<tr>
					<td valign="Top" class="Header" colspan="2">&nbsp;</td>
					<td valign="Top"></td>
				</tr>
				<tr>
					<td colspan="3">
						<table width="100%" border="0">
							<tr>
								<td align="left">				
									<table border="0">
										<tr>
											<td>
												<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UsersActivity.ChoosePeriod") %>:
											</td>
											<td>
												<% DrawPeriods(); %>
											</td>
											<td>
												<UI:CButton id="btnView" runat="server" Text="UsersActivity.GetUsers" class="sbttn" />
											</td>
											<td>
												<UI:CButton id="btnGetFile" runat="server" Text="UsersActivity.GetFile" class="sbttn" />
											</td>
										</tr>
									</table>
								</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td colspan="2">
									<% DrawUsersTable(); %>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
