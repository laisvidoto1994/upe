<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="AdminMetadata.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.LocalizationResources.AdminMetadata" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Admin Metadata</title> 
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link href="../../css/estilos.css" type="text/css" rel="stylesheet"/>
		<link href="../../css/calendar.css" type="text/css" rel="stylesheet"/>
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js" type="text/javascript"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js" type="text/javascript"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js" type="text/javascript"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js" type="text/javascript"></script>
		<link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet"/>
		<script language="JavaScript" src="../../js/scripts.js" type="text/javascript"></script>
		<script language="javascript" type="text/javascript">
			function btnUpd_OnClick()
			{
				if(window.confirm("<%=CResourceManager.RM.GetString("LRMsWarningUpd")%>"))
				{
					frm.action = "OperationsLoc.aspx?type=Metadata";
					frm.submit();							
				}
			}
		</script>
	</head>
	<body onclick="BAonclick()" onload="BAonload()">
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
</html>
