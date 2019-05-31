<%@ Page language="c#" Codebehind="ChangeAccountPassword.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.ChangeAccountPassword" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<HEAD>
		<title>Bizagi Login</title> 
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
        <form id="frmChangeAccountPassword" autocomplete = "off" runat="server">
            <div id="header">
                <div id="logo">
                </div>
            </div>
            
            <div id="loginBox">

            <div class="top">
            </div>

            <div class="content">
            <img class="icon" src="../../img/login/loginIcon.png" width="64" height="64" alt="Error Icon" />
            <UI:CLabel CssClass="login-title" ID="CLabel1" runat="server" Text="Login_ChangePasswordLink"></UI:CLabel>
            <p id="lblMessages"><UI:CLabel ID="lblMessage" runat="server"></UI:CLabel></p>

            <fieldset class="info2">

            <div class="fieldsetboxtop"> </div>

            <div class="fieldsetboxcontent">

            <div class="formItem">
            <label><UI:CLABEL id="lblUsername" runat="server" Text="Login_Username"></UI:CLABEL></label>
            <asp:TextBox id="txtUsername" runat="server"></asp:TextBox>
            <asp:RequiredFieldValidator id="usernameValidator" runat="server" ControlToValidate="txtUsername" Display="None"></asp:RequiredFieldValidator>
            </div>

            <div class="formItem">
            <label><UI:CLabel runat="server" Text="Login_Domain" id="lblDomain" /></label>
            <asp:DropDownList id="cbDomains" runat="server"></asp:DropDownList>
            </div>

            <div class="formItem">
            <label><UI:CLABEL id="lblOldPassword" runat="server" Text="Login_OldPassword" Width="120"></UI:CLABEL></label>
            <asp:TextBox id="txtPassword" runat="server" TextMode="Password"></asp:TextBox>
            </div>

            <div class="formItem">
            <label><UI:CLABEL id="lblNewPassword" runat="server" Text="Login_NewPassword"></UI:CLABEL></label>
            <asp:TextBox id="txtNewPassword" runat="server" TextMode="Password"></asp:TextBox>
            <asp:RequiredFieldValidator id="newPasswordValidator" runat="server" ControlToValidate="txtNewPassword" Display="None"></asp:RequiredFieldValidator>
            </div>

            <div class="formItem">
            <label><UI:CLABEL id="lblNewPasswordConfirmation" runat="server" Text="Login_NewPasswordConfirmation"></UI:CLABEL></label>
            <asp:TextBox id="txtNewPasswordConfirmation" runat="server" TextMode="Password"></asp:TextBox>
            <p></p>
            <asp:CompareValidator id="passwordCompareValidator" runat="server" ControlToValidate="txtNewPasswordConfirmation" ControlToCompare="txtNewPassword"></asp:CompareValidator>
            </div>

            <%if(bSecretQuestionEnabled) {%>

            <div class="formItem">
            <label><UI:CLABEL id="lblSecretQuestion" runat="server" Text="Login_SecretQuestion"></UI:CLABEL></label>
            <asp:TextBox id="txtSecretQuestion" runat="server" ></asp:TextBox>
            <asp:RequiredFieldValidator id="secretQuestionValidator" runat="server" ControlToValidate="txtSecretQuestion" Display="None"></asp:RequiredFieldValidator>
            </div>

            <div class="formItem">
            <label><UI:CLABEL id="lblSecretAnswer" runat="server" Text="Login_SecretAnswer"></UI:CLABEL></label>
            <asp:TextBox id="txtSecretAnswer" runat="server"></asp:TextBox>
            <asp:RequiredFieldValidator id="secretAnswerValidator" runat="server" ControlToValidate="txtSecretAnswer" Display="None"></asp:RequiredFieldValidator>
            </div>

            <%}%>

            <div class="formItem button">
	            <span class="login">
		            <UI:CButtonLogin id="btnChangePassword" tabIndex="4" runat="server" Text="Login_ChangePasswordLink"></UI:CButtonLogin>
		            <asp:ValidationSummary id="changePasswordValidationSummary" runat="server" ShowMessageBox="True" ShowSummary="False" DisplayMode="List"></asp:ValidationSummary>
	            </span>
                 <span class="locks">
                                 <UI:CImageLink Url="Login.aspx" ImageUrl="../../img/login/backToLogin.png" AlternateText="Login_BackToLogin" ToolTip="Login_BackToLogin" runAt="server" BorderStyle="None" id="lnkBackToLogin" CausesValidation="False"></UI:CImageLink>
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
            <!--end loginBox-->            

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
