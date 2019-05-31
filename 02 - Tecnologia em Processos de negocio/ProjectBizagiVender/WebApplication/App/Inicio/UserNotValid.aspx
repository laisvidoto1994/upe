<%@ Page language="c#" Codebehind="UserNotValid.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.UserNotValid" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title><% Response.Write(CResourceManager.RM.GetString("UserNotValid"));%></title>
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td>
					<form id="UserNotValid" method="post" runat="server">
						<br>
						<br>
						<P align="center"><FONT size="6"><STRONG><% Response.Write(CResourceManager.RM.GetString("UserNotValid"));%></STRONG></FONT></P>
					</form>
				</td>
			</tr>
		</table>
	</body>
</HTML>
