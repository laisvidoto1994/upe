<%@ Page language="c#" Codebehind="FolderBusinessFilter.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.WorkPortal.FolderBusinessFilter" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>FolderBusinessFilter</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">		
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="../../js/scripts.js"></script>
		
		<script language="JavaScript" src="../../js/WMask.js"></script>
		<%WriteHead();%>
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
		    function BusinessFilterReturn(){
				GetObject("h_Button").value = "btnReturn";				
				SubmitForm();
			}

		</script>
	</HEAD>
	<body MS_POSITIONING="FlowLayout" onload="BAVerifyBehavior()">
	<DIV class=text id=popupcalendar></DIV>
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
					<td><asp:dropdownlist id="Attributes" runat="server" Width="146px" AutoPostBack="True"></asp:dropdownlist></td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigValue") %></b></td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigValueDesc") %></td>
				</tr>
				<tr>
					<td></td>
					<td colSpan="1"><asp:placeholder id="PlaceHolderValues" runat="server"></asp:placeholder></td>
				</tr>
				<tr>
					<td></td>
					<td>
						<asp:LinkButton id="btnAddNewValue" runat="server" ></asp:LinkButton></td>
				</tr>
				<tr>
					<td colspan='2' align="center">
						<%
				H.WPButton("button","btnReturn",BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersFilterConfigReturn"),"Return","sbttn","onclick='BusinessFilterReturn();'");
				%>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
