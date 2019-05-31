<%@ Page language="c#" Codebehind="Event.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Event" %>
<html>
	<head>
		<title>Event</title>
        <!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
	</head>
	<body onclick="BAonclick()" onload="BAonload()">
		<DIV class="text" id="popupcalendar"></DIV>
		<% Header(); %>
		<table align="center" width="90%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="center">
					<% RenderEvent(); %>
				</td>
			</tr>
		</table>
	</body>
</html>
