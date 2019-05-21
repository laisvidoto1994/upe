<%@ Page language="c#" Codebehind="FolderProcessFilter.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.WorkPortal.FolderProcessFilter" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>FolderProcessFilter</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="../../js/scripts.js"></script>
		<script language='javascript'>
		function SubmitForm() {
			var theform;
			if (window.navigator.appName.toLowerCase().indexOf("netscape") > -1) {
				theform = document.forms["Form1"];
			}
			else {
				theform = document.Form1;
			}
			theform.submit();
		}
		function RemoveValueItem(oId){
		    GetObject("h_RemoveId").value = oId;
		    SubmitForm();
		}
		function ProcessFilterReturn(){
			GetObject("h_Button").value = "btnReturn";						
			SubmitForm();
		}
		</script>
	</HEAD>
	<body topMargin="10" MS_POSITIONING="FlowLayout" marginheight="10" marginwidth="10">
		<base target="_self">
		<form id="Form1" method="post" runat="server">
			<table cellSpacing="2" cellPadding="2" width="100%" border="0">
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigHeader") %></td>
				</tr>
				<tr>
					<td><br>
					</td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigFilter") %></b></td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigSelectProperty") %></td>
				</tr>
				<tr>
					<td></td>
					<td><asp:dropdownlist id="Attributes" runat="server" Width="146px" AutoPostBack="True" onselectedindexchanged="ListInternal_SelectedIndexChanged">
						</asp:dropdownlist></td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigValue") %></b></td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigValueDesc") %>
					</td>
				</tr>
				<tr>
					<td></td>
					<td colSpan="1"><asp:placeholder id="PlaceHolderValues" runat="server"></asp:placeholder></td>
				</tr>
				<tr>
					<td></td>
					<td>
						<asp:LinkButton id="btnAddNewValue" runat="server" >
						<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigAddAnotherValue") %>												
						</asp:LinkButton></td>
				</tr>
				<tr>
					<td colspan='2' align="center">
						<%
				H.WPButton("button","btnReturn",BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigReturn"),"Return","sbttn","onclick='ProcessFilterReturn();'");
				%>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
