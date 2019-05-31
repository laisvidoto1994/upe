<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<%@ Page Language="c#" Codebehind="LockedAccount.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Inicio.LockedAccount" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Bizagi Login</title>
    <base target="_self">
    <!--#include file="../../include/BizAgiMeta.inc"-->
    <%--<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">--%>
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
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
</head>
<body id="loginForm">
<<script type='text/javascript'>
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
        <form id="frmUnlockAccountPassword" name="frmUnlockAccountPassword" autocomplete = "off" runat="server">
            <div id="header">
                <div id="logo">
                </div>
            </div>
            <div id="loginBox">
                <div class="top">
                </div>
                <div class="content">
                    <img class="icon" src="../../img/login/loginIcon.png" width="64" height="64" alt="Error Icon" />
                    <UI:CLabel CssClass="login-title" ID="CLabel1" runat="server" Text="Login_UnlockAccountLink"></UI:CLabel>
                    <p id="lblMessages">
                        <UI:CLabel ID="lblMessage" runat="server"></UI:CLabel></p>
                    <fieldset class="info">
                        <div class="fieldsetboxtop">
                        </div>
                        <div class="fieldsetboxcontent">
                            <div class="formItem">
                                <label>
                                    <UI:CLabel ID="lblUsername" runat="server" Text="Login_Username"></UI:CLabel></label>
                                <asp:TextBox ID="txtUsername" runat="server" ></asp:TextBox>
                                <asp:RequiredFieldValidator ID="usernameValidator" runat="server" Display="None"
                                    ControlToValidate="txtUsername"></asp:RequiredFieldValidator>
                            </div>
                            <div class="formItem">
                                <label>
                                    <UI:CLabel ID="lblPassword" runat="server" Text="Login_Password"></UI:CLabel></label>
                                <asp:TextBox ID="txtPassword" runat="server" TextMode="Password"></asp:TextBox>
                            </div>
                            <div class="formItem">
                                <label>
                                    <UI:CLabel ID="lblDomain" runat="server" Text="Login_Domain"></UI:CLabel></label>
                                <asp:DropDownList ID="cbDomains" runat="server">
                                </asp:DropDownList>
                            </div>
                            <div class="formItem">
                                <label>
                                    <UI:CLabel ID="lblObservation" runat="server" Text="Login_Observation"></UI:CLabel></label>
                                <asp:TextBox ID="txtObservation" runat="server" TextMode="MultiLine"
                                    Rows="4" Columns="39"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="observationValidator" runat="server" Display="None"
                                    ControlToValidate="txtObservation"></asp:RequiredFieldValidator>
                            </div>
                            <div class="formItem button">
                                <span class="login">
                                    <UI:CButtonLogin ID="btnUnlockAccount" runat="server" Text="Login_UnlockAccountLink">
                                    </UI:CButtonLogin>
                                    <asp:ValidationSummary ID="lockedAccountValidationSummary" runat="server" DisplayMode="List"
                                        ShowMessageBox="True" ShowSummary="False"></asp:ValidationSummary>
                                </span>
                                <span class="locks">
                                <UI:CImageLink ID="lnkBackToLogin" BorderStyle="None" runat="server" AlternateText="Login_BackToLogin" ToolTip="Login_BackToLogin" 
                                    ImageUrl="../../img/login/backToLogin.png" Url="Login.aspx" CausesValidation="False">
                                </UI:CImageLink>
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
