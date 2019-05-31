<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="BizAgiBPM.Admin.Login" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<HEAD>
		<title>LoginBackground</title> 
		<!--#include file="../include/BizAgiMeta.inc"-->
		<%--<LINK href="../css/estilos.css" type="text/css" rel="stylesheet">--%>
		<LINK href="../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="no-cache" http-equiv="Pragma" />
        <meta name="GENERATOR" content="MSHTML 8.00.6001.18813" />
        <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
        <meta content="C#" name="CODE_LANGUAGE" />
        <meta content="JavaScript" name="vs_defaultClientScript" />
        <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
		<script language="JavaScript" src="../Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="../js/scripts.js"></script>
		
		<script src="../js/fonts/cufon-yui.js" type="text/javascript"></script>
        <script src="../../js/fonts/BeauSansRegular.js" type="text/javascript"></script>
        <script src="../js/fonts/fonts.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="../css/default.css" />
	</HEAD>
	<body id="loginForm">
	<div id="contentWrap">
		<form id="frm" runat="server" autocomplete = "off">
		
			<div id="header">
                <div id="logo">
                </div>
            </div>
            <div id="loginBox">
                <div class="top">
                </div>
                <div class="content">
                    <img class="icon" src="../img/login/loginIcon.png" width="64" height="64" alt="Error Icon" />
                        <UI:CLabel CssClass="login-title" ID="lblTitle" runat="server" Text="Login_WelcomeMessage"></UI:CLabel>
                    <p id="lblMessages">
                        <UI:CLabel ID="lblMessage" runat="server"></UI:CLabel></p>
                    <fieldset class="info">
                        <div class="fieldsetboxtop">
                        </div>
                        <div class="fieldsetboxcontent">
                            <div class="formItem">
                                <label>
                                    <span id="lblUsername"><% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("Login_Username")); %></span></label>
                                <asp:TextBox ID="txtUsername" TabIndex="1" runat="server" Text="domain\admon"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="usernameValidator" runat="server" ErrorMessage="llename"
                                    ControlToValidate="txtUsername" Display="None"></asp:RequiredFieldValidator>
                            </div>
                            <div class="formItem">
                                <label>
                                    <span id="lblPassword"><% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("Login_Password")); %></span></label>
                                <asp:TextBox ID="txtPassword" TabIndex="2" runat="server" TextMode="Password"></asp:TextBox>
                            </div>
                            <div class="formItem button">
                                <span class="login">
                                    <UI:CButtonLogin ID="btnLogin" TabIndex="4" runat="server" Text="Login_btnLogin" ></UI:CButtonLogin>
                                    <asp:ValidationSummary ID="loginValidationSummary" runat="server" ShowMessageBox="True"
                                        ShowSummary="False" DisplayMode="List"></asp:ValidationSummary>
                                </span>
                                <span class="locks">
		                            <UI:CIMAGELINK id="lnkBackToLogin" BorderStyle="None" runAt="server" AlternateText="Login_BackToLogin" ToolTip="Login_BackToLogin" ImageUrl="../img/login/backToLogin.png" Url="../App/Inicio/Login.aspx" CausesValidation="False"></UI:CIMAGELINK>
	        		            </span>
                            </div>
                        </div>
                        <div class="fieldsetboxbottom">
                        </div>
                    </fieldset>
                    
                   <div class="errorMessage">
                                <asp:Label ID="lblErrorMessage" runat="server" ForeColor="Red"
                                    Visible="False"></asp:Label>
                                <asp:Label ID="Label1" runat="server" ForeColor="WhiteSmoke"
                                    Visible="False"></asp:Label>
                   </div>
                </div>
                <!--end content-->
                <div class="bottom">
                </div>
                <!--end bottom-->
            </div>
			
			<script type="text/javascript">
        <!--
        var Page_ValidationSummaries =  new Array(document.getElementById("loginValidationSummary"));
        var Page_Validators =  new Array(document.getElementById("usernameValidator"));
        // -->
            </script>

            <script type="text/javascript">
        <!--

        var Page_ValidationActive = false;
        if (typeof(ValidatorOnLoad) == "function") {
            ValidatorOnLoad();
        }

        function ValidatorOnSubmit() {
            if (Page_ValidationActive) {
                return ValidatorCommonOnSubmit();
            }
            else {
                return true;
            }
        }
                // -->
            </script>
		</form>
		
		 <script languaje='javascript'>	
			if (window.parent != null){
				if (window.parent.frames.length > 1){
					//If the page is loaded inside a frame, reload the full page
					window.parent.document.location = window.location;
				}
			}
			else {
				BACloseWaitFrame();
			}
		</script>
		</div>
	</body>
</html>