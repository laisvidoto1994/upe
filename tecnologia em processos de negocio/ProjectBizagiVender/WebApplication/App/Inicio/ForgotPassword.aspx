<%@ Page language="c#" Codebehind="ForgotPassword.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.ForgotPassword" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<HEAD>
		<title>Bizagi Login</title>
		<base target="_self">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<%--<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">--%>
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="no-cache" http-equiv="Pragma" />
        <meta name="GENERATOR" content="MSHTML 8.00.6001.18813" />
        <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
        <meta content="C#" name="CODE_LANGUAGE" />
        <meta content="JavaScript" name="vs_defaultClientScript" />
        <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
        <script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
        <script language="JavaScript" src="../../js/scripts.js"></script>
        <script src="../../js/fonts/cufon-yui.js" type="text/javascript"></script>
        <script src="../../js/fonts/BeauSansRegular.js" type="text/javascript"></script>
        <script src="../../js/fonts/fonts.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="../../css/default.css" />
	</HEAD>
	<body id="loginForm">
    <script type='text/javascript'>
        var reloadUrl;
        var sizeExt;
        var currentFile = location.pathname.search("aspx");
        if (currentFile = !"") {
            sizeExt = location.pathname.search("/App/Inicio/");
            reloadUrl = "http://" + location.hostname + location.pathname.slice(0, sizeExt) + "/index.html";
            location.href = reloadUrl;
        }
     </script>
	<div id="contentWrap">
		<form id="frmForgotPassword" name="frmForgotPassword" autocomplete = "off" runat="server">
		    <div id="header">
                <div id="logo">
                </div>
            </div>
		
			<div id="loginBox">

            <div class="top">
            </div>

            <div class="content">
            <img class="icon" src="../../img/login/loginIcon.png" width="64" height="64" alt="Error Icon" />
            <UI:CLabel CssClass="login-title" ID="CLabel1" runat="server" Text="Login_ForgotPasswordLink"></UI:CLabel>
            <p id="lblMessages"><UI:CLabel ID="lblMessage" runat="server"></UI:CLabel></p>

            <fieldset class="info">

            <div class="fieldsetboxtop">
            </div>

            <div class="fieldsetboxcontent">

            <div class="formItem">
		<label><UI:CLABEL id="lblUsername" runat="server" Text="Login_Username"></UI:CLABEL></label>
		<asp:textbox id="txtUsername" runat="server"></asp:textbox>
		<asp:RequiredFieldValidator id="usernameValidator" runat="server" Display="None" ControlToValidate="txtUsername"></asp:RequiredFieldValidator>
            </div>

            <div class="formItem">
		<label><UI:CLABEL id="lblDomain" runat="server" Text="Login_Domain"></UI:CLABEL></label>
		<asp:dropdownlist id="cbDomains" runat="server"></asp:dropdownlist>
            </div>

            <div class="formItem">
            <table>
            <tr id="trSecretQuestionField" runat="server">
            <td>
		        <label><UI:CLABEL id="lblSecretQuestion" runat="server" Text="Login_SecretQuestion"></UI:CLABEL></label>
		        <asp:textbox id="txtSecretQuestion" runat="server" ReadOnly="True"></asp:textbox>
		    </td>
		    </tr>
		    </table>
            </div>

            <div class="formItem">
            <table>
            <tr id="trSecretAnswerField" runat="server">
            <td>
		        <label><UI:CLABEL id="lblSecretAnswer" runat="server" Text="Login_SecretAnswer"></UI:CLABEL></label>
		        <asp:textbox id="txtSecretAnswer" runat="server"></asp:textbox>
		        <asp:RequiredFieldValidator id="secretAnswerValidator" runat="server" Display="None" ControlToValidate="txtSecretAnswer"></asp:RequiredFieldValidator>
		    </td>
		    </tr>
		    </table>
            </div>

            <div class="formItem button">
	            <span class="login">
		            <UI:CButtonLogin id="btnRecoverPassword" runAt="server" Text="Login_RecoverPassword" ></UI:CButtonLogin>
			    <UI:CButtonLogin id="btnLookupSecretQuestion" runAt="server" Text="Login_LookupSecretQuestion" ></UI:CButtonLogin>
			    <asp:ValidationSummary id="forgotPasswordValidationSummary" runat="server" ShowMessageBox="True" ShowSummary="False" DisplayMode="List"></asp:ValidationSummary></td>
	            </span>
                <span class="locks">
		            <UI:CIMAGELINK id="lnkBackToLogin" BorderStyle="None" runAt="server" AlternateText="Login_BackToLogin" ToolTip="Login_BackToLogin" ImageUrl="../../img/login/backToLogin.png" Url="Login.aspx" CausesValidation="False"></UI:CIMAGELINK>
	        		</span>
            </div>

            </div>

            <div class="fieldsetboxbottom">
            </div>

            </fieldset>


            		<div class="errorMessage">
		            <asp:Label ID="lblErrorMessage" runat="server" ForeColor="Red" Visible="False"></asp:Label>
		            <asp:Label ID="Label1" runat="server" ForeColor="WhiteSmoke" Visible="False"></asp:Label>
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
