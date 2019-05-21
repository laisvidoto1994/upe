<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="LoginWindow.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.LoginWindows" enableViewState="False"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>BizAgi Login</title>
		<base TARGET="_self">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
	</HEAD>
	<body>
		<form runat="server">
			<TABLE cellSpacing="1" cellPadding="1" width="340" border="0" align="center">
				<TR height="10">
					<TD colspan="3">
					</TD>
				</TR>
				<TR height="20">
					<TD colspan="3" class="header">
						<UI:CLabel runat="server" Text="Login_WelcomeMessage" id="lblWelcomeMessage" /></TD>
				</TR>
				<TR height="10">
					<TD colspan="3">
					</TD>
				</TR>
				<TR>
					<TD><B><UI:CLabel runat="server" Text="Login_Username" id="lblUsername" /></B></TD>
					<TD><INPUT type="text" name="Login_User" tabIndex="1" style="WIDTH:170px"></TD>
					<TD align="right"><UI:CHtmlInputButton id="btnLogin" runat="server" Value="Login_btnLogin" tabIndex="4" style="WIDTH:80px" /></TD>
				</TR>
				<TR>
					<TD><UI:CLabel runat="server" Text="Login_Password" id="lblPassword" /></TD>
					<TD><INPUT type="password" name="Login_Password" tabIndex="2" style="WIDTH:170px"></TD>
					<TD align="right">
						<UI:CHtmlInputButton id="btnCancel" runat="server" Value="Login_btnCancel" type="Button" tabIndex="5"
							style="WIDTH:80px" /></TD>
				</TR>
				<TR>
					<TD><UI:CLabel runat="server" Text="Login_Domain" id="lblDomain" /></TD>
					<TD><select name="Login_Domain" tabindex="3" style="WIDTH:170px">
							<option value="" selected></option>
							<%=GetAvailableDomains()%>
						</select></TD>
					<TD></TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
				</TR>
				<TR>
					<TD vAlign="bottom" align="center" colSpan="3"><a href="ChangeAccountPassword.aspx">
							<UI:CLABEL id="lblChangePassword" runat="server" Text="Login_ChangePasswordLink"></UI:CLABEL></a>
					</TD>
				</TR>
				<%if(IsBizAgiAuthentication()) {%>
					<TR>
						<TD vAlign="bottom" align="center" colSpan="3"><a href="ForgotPassword.aspx">
								<UI:CLABEL id="lblForgotPassword" runat="server" Text="Login_ForgotPasswordLink"></UI:CLABEL></a>
						</TD>
					</TR>
					<TR>
						<TD vAlign="bottom" align="center" colSpan="3"><a href="LockedAccount.aspx">
								<UI:CLABEL id="lblUnlockAccount" runat="server" Text="Login_UnlockAccountLink"></UI:CLABEL></a>
						</TD>
					</TR>
				<%}%>
			</TABLE>
			<input type="hidden" name="bSubmitted" value="1">
		</form>
		<script language="javascript">
	//Set default size
	window.dialogHeight = "210px";
	window.dialogWidth =  "400px";
	
	function doCustomOnLoginValidation()
	{
		return true;
	}
	
	function doCustomOnCancelValidation()
	{
		return true;
	}
	
		</script>
	</body>
</HTML>
