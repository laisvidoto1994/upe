<%@ Page language="c#" Codebehind="JoinSearch.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.JoinSearch" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>JoinSearch</title> 
		<!--	<% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppListaDetalleFormsJoinSearchDialog_JoinSearchDialog")); %> -->
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
			<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
				<%WriteHead();%>
				<script language="JavaScript" src="../../js/implementation.js"></script>
				
				<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
				<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
				<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
				
	</HEAD>
	<body onclick="BAonclick(event)" onload="BAonloadNoWizard()">
		<div id="JSDialogMainWindow" style="visibility:visible;display:block;">
			<DIV class="text" id="popupcalendar"></DIV>
			<table width="100%" border="0" cellspacing="2" cellpadding="2">
				<tr>
					<td align="center">
						<%((BizAgi.Defs.IMagicForm)GetMagicFormInstance()).ProcessForm();%>
					</td>
				</tr>
			</table>
		</div>
		<div id="NewEntityWindow" style="visibility:hidden;display:none;height:400px;">
			<iframe style="width:100%;height:100%;" name="iNewEntity" id="iNewEntity" frameborder="0">
			</iframe>
		</div>
	</body>
</HTML>
