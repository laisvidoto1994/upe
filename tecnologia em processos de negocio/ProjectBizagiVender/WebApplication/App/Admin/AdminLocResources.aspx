<%@ Page language="c#" Codebehind="AdminLocResources.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.LocalizationResources.AdminLocResources" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Admin Localization</title>
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
	</head>
	<body  onclick="BAonclick(event)" onload="BAonload()">
		<form id="frmAdminLocRes" method="post" runat="server">
			<table border="0" width="95%" cellspacing="2" cellpadding="2" align="center">
				<tr>
					<td>
						<table cellspacing="0" cellpadding="0" width='100%' border="0">
							<tr>
								<td>
									<%								
									//bHookRespWrite = false; 
									//Ballon(BizAgi.UI.WFBase.CResourceManager.RM.GetString("LRLocalizationResources"), "", "merlin1.gif", 1); 
									//bHookRespWrite = true; 
									%>
								</td>
							</tr>
							<tr>
								<td class="header" colspan="2"><UI:CLABEL id="CLabel3" runat="server" Text="LRRestartResources"></UI:CLABEL></td>
							</tr>
							<tr>
								<td>
									<UI:CBUTTON CssClass="sbttn" id="BtnRestartRes" runat="server" Text="LRBtnRestartRes"></UI:CBUTTON>
								</td>
								<td>
									<img src="../../img/WorkPortal/Language48.gif" width="48" height="48" alt="" border="0"	align="top" style="FLOAT:right"/>
								</td>
							</tr>
							<tr>
								<td class="header" align="center" colspan="2">
									<UI:CLabel runat="server" Text="LRLocalizationResources" id="CLabel1" />
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<table cellspacing="0" cellpadding="0" width="100%" border="0">
							<tr><td><span id="TabHTML"></span></td></tr>
							<script language="JavaScript" type="text/javascript">
								var DefaultTab = 0;
								var CurrentTab = DefaultTab;
								var TabNames = new Array();
								var BAUseDefaultBizagiTab = false;
								TabNames[0]='<%=CResourceManager.RM.GetString("LRMetadata")%>';
								TabNames[1]='<%=CResourceManager.RM.GetString("LRExtended")%>';									
								TabNames[2]='<%=CResourceManager.RM.GetString("LREntity")%>';
							</script>
							<tr><td bgColor=#ffffff>
								<!--T1-->
								<div id='xpTab1' class='BAXPTab'>
									<table class='BAXPTabTable'  cellspacing="0" cellpadding="4" width="100%" border="0"  style="vertical-align:top">
										<tr>
											<td colspan="2">
												<iframe width="100%" cellspacing="0" cellpadding="0" border="0" height="450" id="fraMetadata" src="AdminMetadata.aspx"></iframe>
											</td>
										</tr>
									</table>
								</div>
								<!--T2-->
								<div id='xpTab2' class='BAXPTab'>
									<table class='BAXPTabTable'  cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">
										<tr>
											<td colspan="2">
												<iframe width="100%" cellspacing="0" cellpadding="0" border="0" height="450" id="fraExtended" src="AdminRecExtended.aspx"></iframe>
											</td>
										</tr>
									</table>
								</div>
								<!--T3-->
								<div id='xpTab3' class='BAXPTab'>
									<table class="BAXPTabTable" cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">
										<tr>
											<td colspan="2">
												<iframe width="100%" cellspacing="0" cellpadding="0" border="0" height="450" id="fraEntity" src="AdminEntityMetadata.aspx"></iframe>
											</td>
										</tr>
										
									</table>
								</div>
							</td></tr>
						</table>
					</td>
				</tr>
			</table>
		</form>	
	</body>
</html>
