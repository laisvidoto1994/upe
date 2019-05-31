<%@ Page language="c#" Codebehind="SimpleListSearch.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.SimpleListSearch.SimpleListSearch" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>SimpleListSearch</title>
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
			<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
				<%WriteHead();%>
			<script language="JavaScript" src="../../js/implementation.js"></script>
				
	</HEAD>
	<body onclick="BAonclick(event)" onload="BAonloadNoWizard()">
		<DIV class="text" id="popupcalendar"></DIV>
		<div id="oBAContextMenu" class="BAContextMenu">jsjsjs</div>
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="center">
					<%((BizAgi.Defs.IMagicForm)GetMagicFormInstance()).ProcessForm();%>
				</td>
			</tr>
		</table>
		
	</body>
</HTML>
