<%@ Page Language="c#" CodeBehind="Encrypt.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.Encrypt" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Encrypt</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
</head>
<body ms_positioning="FlowLayout">
    <form id="Encrypt" method="post" runat="server">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <table id="Table1" cellspacing="1" cellpadding="1" width="90%" border="0" align="center">
        <tr>
            <td align="middle">
                <table id="Table2" cellspacing="1" cellpadding="1" width="450" border="0">
                    <tr>
                        <td colspan="3" class="header">
                            <UI:CLabel runat="server" Text="TextEncryption" ID="lblTextEncryption" />
                            <script language="javascript">
										BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("TextEncryption") %>");
                            </script>
                        </td>
                    </tr>
                    <tr>
                        <td height="10">
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="TextToEncrypt" ID="lblTextToEncrypt" /></b>
                        </td>
                        <td>
                            <asp:TextBox ID="txtTextToEncrypt" runat="server" TextMode="Password" Width="250"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="ConfirmTextToEncrypt" ID="lblConfirmTextToEncrypt" /></b>&nbsp;
                        </td>
                        <td>
                            <asp:TextBox ID="txtConfirmTextToEncrypt" runat="server" TextMode="Password" Width="250"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td height="5">
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <UI:CButton ID="btnEncrypt" runat="server" Text="BtnEncrypt" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:RequiredFieldValidator ID="rfvTextToEncrypt" runat="server" Display="None" ControlToValidate="txtTextToEncrypt"
                                ErrorMessage="TextToEncryptIsRequired"></asp:RequiredFieldValidator>
                            <asp:RequiredFieldValidator ID="rfvConfirmTextToEncrypt" runat="server" Display="None"
                                ControlToValidate="txtConfirmTextToEncrypt" ErrorMessage="ConfirmTextToEncryptIsRequired"></asp:RequiredFieldValidator>
                            <asp:CompareValidator ID="cvTextToEncrypt" runat="server" Display="None" ControlToValidate="txtTextToEncrypt"
                                ControlToCompare="txtConfirmTextToEncrypt" ErrorMessage="TextToEncryptIsNotEqual"></asp:CompareValidator>
                            <asp:ValidationSummary ID="vsValidationSummary" runat="server" ShowMessageBox="True"
                                ShowSummary="False" DisplayMode="SingleParagraph"></asp:ValidationSummary>
                        </td>
                    </tr>
                    <tr>
                        <td height="5">
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="EncryptedText" ID="lblEncryptedText" /></b>&nbsp;
                        </td>
                        <td>
                            <asp:TextBox ID="txtEncryptedText" runat="server" Enabled="False" Width="300"></asp:TextBox>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
