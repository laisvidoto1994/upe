<%@ Page language="c#" Codebehind="AdminEntityMetadata.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.LocalizationResources.AdminEntityMetadata" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
  <HEAD>
		<title>Admin Metadata</title> 
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
		<link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../js/scripts.js"></script>
		<script language="javascript">
			function btnUpd_OnClick()
			{
				if(window.confirm("<%=CResourceManager.RM.GetString("LRMsWarningUpd")%>"))
				{
					frm.action = "OperationsLoc.aspx?type=Entity";
					frm.submit();							
				}
			}
		</script>
	</HEAD>
	<body onclick="BAonclick()" onload="BAonload()">
		<DIV class="text" id="popupcalendar"></DIV>
		<div id="oBAContextMenu" class="BAContextMenu"></div>
		<form name="frm" id="frm" action="" method="post">
			<table width="100%" border="0" cellspacing="2" cellpadding="2">
				<tr>
					<td>
						<%								
							//bHookRespWrite = false; 
							//Ballon(BizAgi.UI.WFBase.CResourceManager.RM.GetString("Entities"), "", "merlin1.gif", 1); 
							//bHookRespWrite = true; 
						%>
					</td>
				</tr>
				<tr>
					<td><% DrawGrid();%></td>
				</tr>
			</table>
			<table width="60%" border="0" cellspacing="2" cellpadding="2">
				<tr>
					<td><span id="SpanButton" runat="server"></span></td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
