<%@ Page language="c#" Codebehind="Radicar.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Radicar.Radicar" %>
<html>
<head>
<title>Radication</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
<LINK href="../../css/calendar.css" type=text/css rel=stylesheet>
<%WriteHead();%>
<script language="JavaScript" src="../../js/implementation.js"></script>
<script language="JavaScript">
//alert(BA_JAN);
</script>
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
<link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">

</head>
<body onclick="BAonclick(event)" onload="BAonload()">
<DIV class=text id=popupcalendar></DIV>
<div id="oBAContextMenu" class="BAContextMenu"></div>
<% Header(); %>
<table width="100%" border="0" cellspacing="2" cellpadding="2">
<tr> 
<td align="center"> 
<%
	((BizAgi.Defs.IMagicForm)GetMagicFormInstance()).ProcessForm();
%>
</td>
</tr>
</table>
</body>
</html>