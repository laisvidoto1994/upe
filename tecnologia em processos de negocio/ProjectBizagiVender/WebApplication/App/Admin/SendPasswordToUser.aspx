<%@ Page language="c#" Codebehind="SendPasswordToUser.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.SendPasswordToUser" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
  <HEAD>
		<title><%Response.Write(CResourceManager.RM.GetString("frmSendPasswordToUser_Title")); %></title> 
		<!--#include file="../../include/BizAgiMeta.inc"--><LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<base target="_self">
  </HEAD>
	<body MS_POSITIONING="FlowLayout">
		<form id="frm" method="post" runat="server">
			<TABLE cellSpacing="1" cellPadding="1" border="0" width="90%" align="center">
				<TR>
					<TD colspan="2" width="100%">&nbsp;</TD>
				</TR>
				<TR>
					<TD width="25%"><STRONG><UI:CLabel runat="server" Text="CSendPasswordToUser_To" id="lblTo" /></STRONG></TD>
					<TD width="75%">
						<asp:TextBox ID="txtTo" size=64 Runat="server"></asp:TextBox>
					</TD>
				</TR>
				<TR>
					<TD width="25%"><STRONG><UI:CLabel runat="server" Text="CSendPasswordToUser_Subject" id="lblSubject" /></STRONG></TD>
					<TD width="75%">
						<asp:TextBox ID="txtSubject" size=64 Runat="server"></asp:TextBox>
					</TD>
				</TR>
				<TR>
					<TD colspan="2" width="100%">&nbsp;</TD>
				</TR>
				<TR>
					<TD width="25%"><STRONG><UI:CLabel runat="server" Text="CSendPasswordToUser_Body" id="lblBody" /></STRONG></TD>
				</TR>
				<TR>
					<TD colSpan="2">
						<asp:TextBox TextMode="MultiLine" rows="13" Columns=85 ID="txtBody" Runat="server"></asp:TextBox>
					</TD>
				</TR>
				<TR>
					<TD colspan="2" width="100%">&nbsp;</TD>
				</TR>
				<TR>
					<TD colspan="2" align="right">
						<INPUT type="button" value="<%Response.Write(CResourceManager.RM.GetString("frmSendPasswordToUser_btnNotSend")); %>" name="btnNotSend" style="WIDTH:80px" onclick="window.close()">
						<INPUT type="submit" value="<%Response.Write(CResourceManager.RM.GetString("frmSendPasswordToUser_btnSend")); %>" name="btnSend" style="WIDTH:80px" >
						<INPUT type="hidden" value="SendMail" name="h_btnSend">
					</TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
