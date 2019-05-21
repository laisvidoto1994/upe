<%@	Page language="c#" Codebehind="InvalidSessionError.aspx.cs"	AutoEventWireup="false"	Inherits="BizAgiBPM.App.ListaDetalle.InvalidSessionError" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<HTML>
	<HEAD>
		<title>Asynch Workitem Error</title>
		<META http-equiv="Content-Type" content="text/html; charset=windows-1252">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
	</HEAD>
	<body onclick="BAonclick(event)" onload="BAonload()">
		<DIV class="text" id="popupcalendar"></DIV>
		<% Header(); %>
		<form name="frm" runat="server">
			<table width="100%" border="0" cellspacing="2" cellpadding="2">
				<tr>
					<td align="center">
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td align="left" colspan="3" class="header">
									&nbsp;
								</td>
							<tr>
							<tr>
								<td>
									<font color="red">
										<%= GetErrorMessage() %>
									</font>
								</td>
							</tr>
							<tr>
								<td>
									&nbsp;
								</td>
							<tr>
							<tr>
								<td>
									<a href="listaitems.aspx?I_processState=Running">
										<UI:CLabel Text="AsynchWorkitemError_PendingLink" Runat="server" id="CLabel1"></UI:CLabel>
									</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
