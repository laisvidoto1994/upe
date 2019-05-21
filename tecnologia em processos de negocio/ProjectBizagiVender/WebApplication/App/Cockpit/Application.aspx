<%@ Page language="c#" Codebehind="Application.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Cockpit.Application" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Application Selection</title>
        <!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
    <!--[if lte IE 8]> <style type="text/css"> #floater1Div { position: absolute; bottom: auto; right: auto; top: expression( ( -10 - floater1Div.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' ); left: expression( ( -20 - floater1Div.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' ); } #divClose { bottom: -3px; left: 0; } </style> <![endif]-->
    <!--[if lte IE 7]> <link href="../../css/estilos.css" type="text/css" rel="stylesheet" /> <![endif]-->
	</head>
	<body MS_POSITIONING="FlowLayout" onload="BAonload()">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<% Header(); %>
		<table align="center" width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr align="center">
				<td align="center">
					<form name="frmApplication" method="GET" action="category.aspx" ">
						<table align="center" width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td colspan="3" class="header">
									BizAgi
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<% Ballon(CResourceManager.RM.GetString("SelectApplication"), ""); %>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<% BizAgi.UI.WFBiz.CMagicForm.dApplication(0, this); %>
								</td>
							</tr>
							<tr>
								<td width="30%">&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td width="30%">&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
						</table>
						<table align="center" width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td align="left">
								<UI:CHtmlInputButton class="sbttn" type="submit" value="BtnNext" tabindex="4" runat="server">
								</td>
								<td align="right" width="15%">&nbsp;</td>
							</tr>
						</table>
					</form>
				</td>
			</tr>
		</table>
	</body>
</html>
