<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="CurrentUserByForm.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.CurrentUserByForm" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Entity</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/calendar.css" type=text/css rel=stylesheet>
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
		<link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">

	</HEAD>
	<body MS_POSITIONING="GridLayout" onclick="BAonclick()" onload="BAonload()">
					<DIV class=text id=popupcalendar></DIV>
		<div id="oBAContextMenu" class="BAContextMenu"></div>
			<P><span id="SpanHeader" runat="server"></span></P>

			<asp:table id="tblUserProperties" runat="server" cellspacing="1" cellpadding="1" HorizontalAlign="Center"
				BorderWidth="0" width="90%" >
				<asp:TableRow >
					<asp:TableCell VerticalAlign="Top" class="Header" colspan="2">
							<UI:CLabel runat="server" Text="PersonalInformation" Font-Underline="False" ID="Clabel1"/></STRONG><BR>
							<script language="javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UserPreferences") %>");
							</script>
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top"></asp:TableCell>
				</asp:TableRow>				
				<asp:TableRow >
					<asp:TableCell colspan="2" >
						<img src="../../img/WorkPortal/Folders/UserPreferences.gif" width="48" height="48" alt="" border="0" align="top" style="float:right">
						<br>
						<UI:CLabel runat="server" Text="PersonalInformationDescription" Font-Underline="False" ID="Clabel12"/></STRONG><BR>
						
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top"></asp:TableCell>
				</asp:TableRow>
				<asp:TableRow >
					<asp:TableCell VerticalAlign="Top" class="Header" colspan="2">&nbsp;
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top"></asp:TableCell>
				</asp:TableRow>		

				<asp:TableRow >
					<asp:TableCell >
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top">&nbsp;</asp:TableCell>
				</asp:TableRow>
			</asp:table>
			
		
			<table align=center width='90%'>
				<tr>
					<td>
						<span id="SpanEntity" runat="server"></span>
					</td>
				</tr>
				<% if (sDelegatesMessage.Length > 0 ) {%>
				<TR>
					<TD colspan="2">					
					<hr>
					<%= sDelegatesMessage %>									
					</td>
				</TR>
				<%}%>
			</table>
			<% bHookRespWrite = false;	 %>
	</body>
</HTML>
