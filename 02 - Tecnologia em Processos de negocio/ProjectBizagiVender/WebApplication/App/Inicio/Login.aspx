<%@ Page Language="c#" Codebehind="Login.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.Login" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>LoginBackground</title>
    <!--#include file="../../include/BizAgiMeta.inc"-->
    <%--<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">--%>
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="no-cache" http-equiv="Pragma" />
    <meta name="GENERATOR" content="MSHTML 8.00.6001.18813" />
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
    <script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
    <script language="JavaScript" src="../../js/scripts.js"></script>
    <script src="../../js/fonts/cufon-yui.js" type="text/javascript"></script>
    <script src="../../js/fonts/BeauSansRegular.js" type="text/javascript"></script>
    <script src="../../js/fonts/fonts.js" type="text/javascript"></script>


</head>
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
        <form id="frm" autocomplete = "off" runat="server">
            <div id="header">
                <div id="logo">
                </div>
            </div>
            <div id="loginBox">
                <div class="top">
                </div>
                <div class="content">
                    <img class="icon" src="../../img/login/loginIcon.png" width="64" height="64" alt="Error Icon" />
                        <UI:CLabel CssClass="login-title" ID="lblTitle" runat="server" Text="Login_WelcomeMessage"></UI:CLabel>
                    <p id="lblMessages">
                        <UI:CLabel ID="lblMessage" runat="server"></UI:CLabel></p>
                    <fieldset class="info">
                        <div class="fieldsetboxtop">
                        </div>
                        <div class="fieldsetboxcontent">
                            <div class="formItem">
                                <label><span id="lblUsername"><UI:CLabel ID="lblUsername1" runat="server" Text="Login_Username"></UI:CLabel></span></label>
                                <asp:TextBox ID="txtUsername" TabIndex="1" runat="server" ></asp:TextBox>
                                <asp:RequiredFieldValidator ID="usernameValidator" runat="server" ErrorMessage="" ControlToValidate="txtUsername" Display="None"></asp:RequiredFieldValidator>
                            </div>
                            <div class="formItem">
                                <label><span id="lblPassword"><UI:CLabel ID="lblPassword1" runat="server" Text="Login_Password"></UI:CLabel></span></label>
                                <asp:TextBox ID="txtPassword" TabIndex="2" runat="server" TextMode="Password"></asp:TextBox>
                                <asp:requiredfieldvalidator id="passwordValidator" runat="server" ErrorMessage="" ControlToValidate="txtPassword" Display="None"></asp:requiredfieldvalidator>
                            </div>
                            
                            <% if (MoreOneDomain())
                            { %>
                            <div class="formItem">
                                <label><span id="lblDomain"><UI:CLabel ID="lblDomain1" runat="server" Text="Login_Domain"></UI:CLabel></span></label>
                                <asp:DropDownList ID="cbDomains" TabIndex="3" runat="server" >
                                </asp:DropDownList>
                            </div>
                            <%}%>
                            
                            <div class="button">
                                <span class="login">
                                    <UI:CButtonLogin ID="btnLogin" TabIndex="4" runat="server" Text="Login_btnLogin"></UI:CButtonLogin>
                                    <asp:ValidationSummary ID="loginValidationSummary" runat="server" ShowMessageBox="True"
                                        ShowSummary="False" DisplayMode="List"></asp:ValidationSummary>
                                </span>
                                <span class="locks">
                                    <UI:CImageLink ID="lnkChangePassword" TabIndex="5" Url="ChangeAccountPassword.aspx"
                                        ImageUrl="../../img/login/changePassword.png" AlternateText="Login_ChangePasswordLink"
                                        runat="server" BorderStyle="None" CausesValidation="False" ToolTip="Login_ChangePasswordLink"></UI:CImageLink>
                                    <%if (IsBizAgiAuthentication())
                                      {%>
                                    <UI:CImageLink ID="lnkForgotPassword" TabIndex="6" Url="ForgotPassword.aspx" ImageUrl="../../img/login/forgotPassword.png"
                                        AlternateText="Login_ForgotPasswordLink" runat="server" BorderStyle="None" CausesValidation="False" ToolTip="Login_ForgotPasswordLink">
                                    </UI:CImageLink>
                                    <% if (LockAccountEnabled)
                                       { %>
                                    <UI:CImageLink ID="lnkLockedAccount" TabIndex="7" Url="LockedAccount.aspx" ImageUrl="../../img/login/unlockAccount.png"
                                        AlternateText="Login_UnlockAccountLink" runat="server" BorderStyle="None" CausesValidation="False" ToolTip="Login_UnlockAccountLink">
                                    </UI:CImageLink>
                                    <%}%>
                                    <%}%>
                                </span>
                            </div>
                        </div>
                        <div class="fieldsetboxbottom">
                        </div>
                    </fieldset>
                    <fieldset>
                        <div style="display: none; color: red" id="Div1" displaymode="List" showsummary="False"
                            showmessagebox="True">
                        </div>
                        <span class="radiologin">
                            <UI:CRadioButton ID="rbSaveAccountPassword" runat="server" Text="Login_optSaveAccountAndPassword"
                                CssClass="radiologin" GroupName="rbRemember"></UI:CRadioButton>
                        </span><span class="radiologin">
                            <UI:CRadioButton ID="rbSaveAccount" runat="server" Text="Login_optSaveAccountOnly"
                                CssClass="radiologin" GroupName="rbRemember"></UI:CRadioButton>
                        </span><span class="radiologin">
                            <UI:CRadioButton ID="rbAskAlways" runat="server" Text="Login_optAlwaysAsk" CssClass="radiologin"
                                GroupName="rbRemember"></UI:CRadioButton>
                        </span>
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
            <!--end loginBox-->
            <div id="footer">
                <span class="adminLogin">
                    <UI:CHyperlink ID="CHyperlink1" runat="server" NavigateUrl="../../Admin/Login.aspx">Login_AdministratorLink</UI:CHyperlink>
                </span>
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

        if (navigator.userAgent.match(/iPad/i) !== null) {
            $('body').addClass('iPad');
        }
        
        </script>

    </div>
</body>
</html>
