<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AdminDocumentTemplates.aspx.cs"
    Inherits="BizAgiBPM.App.Admin.AdminDocumentTemplates" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <title>Admin Document Templates</title>
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
    <link rel="stylesheet" href="../../css/Admin/AdminDocumentTemplates.css" type="text/css">
    <link rel="stylesheet" href="../../jquery\themes\bizagiDefault\devices\desktop\default.less.css"
        type="text/css">
    <script src="../../jquery/common/base/js/lib/desktop/jquery.js" type="text/javascript"></script>
    <script src="../../jquery/common/jquery.ui/js/desktop/jquery.ui.js" type="text/javascript"></script>
    <link href="../../jquery/common/jquery.ui/css/desktop/jquery.ui.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="../../js/Admin/AdminDocumentTemplates.js"></script>
</head>
<body>
    <form id="form1" method="post" runat="server">
    <asp:HiddenField ID="hdfMessage" runat="server" />
    <asp:HiddenField ID="hdfOperation" runat="server" />
    <div id="biz-documentTemplates-contentDiv">
        <div id="biz-documentTemplates-centerPanel">
            <div class="header">
                <b>
                    <UI:CLabel ID="CLabel3" runat="server" Text="AdminDocumentTemplatesTitle" /></b>
            </div>
            <div class="biz-documentTemplates-table">
                <div id="biz-documentTemplates-LoadBdtFilePanel">
                    <h3>
                        <b>
                            <UI:CLabel ID="CLabel2" runat="server" Text="AdminDocumentTemplatesBdtFileLabel" /></b></h3>
                    <div>
                        <div class="biz-documentTemplates-accordionData">
                            <asp:FileUpload ID="fuBdtFile" runat="server" />
                            <div class="biz-documentTemplates-space">
                            </div>
                            <div class="biz-documentTemplates-button">
                                <UI:CButton ID="CButton1" runat="server" Text="AdminDocumentTemplatesLoadBdt" class="sbttn" OnClick="btnLoad_Click" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="header">
                        <b><UI:CLabel ID="CLabel1" runat="server" Text="AdminDocumentTemplatesDataTitle" /></b></div>
                    <div id="biz-documentTemplates-tabs">
                        <ul>
                            <li><a href="#tabs-1"><UI:CLabel ID="CLabel4" runat="server" Text="AdminDocumentTemplatesTabTemplates" /></a></li>
                        </ul>
                        <div id="tabs-1" class="biz-documentTemplates-innerTab">
                            <%= RenderTemplates() %>
                        </div>
                    </div>
                </div>
            </div>
            <div class="biz-documentTemplates-space"></div>
            <div class="biz-documentTemplates-message"><span id="lblLoadFileMessage"></span></div>
        </div>
        <asp:Table ID="tblLicense" Visible="false" runat="server">
            <asp:TableRow>
                <asp:TableCell>
                    <table cellspacing="1" cellpadding="1" width="300" border="0">
                        <tr>
                            <td colspan="2" align="center" class="header">
                                <UI:CLabel ID="CLabel6" runat="server" Text="AppLicenseInformation" Font-Underline="False" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UI:CLabel ID="lblLicense" runat="server" Text="AppLicensedUsers" Font-Underline="False" />
                            </td>
                        </tr>
                        <tr>
                            <td align="center" colspan="2">
                                <asp:Label ID="LblMessage" runat="server" Font-Bold="True" Visible="False" ForeColor="Red" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td align="center" colspan="2">
                                <table border="0">
                                    <tr>
                                        <td>
                                            <UI:CButton ID="btnBuy" Text="BtnBuy" runat="server" class="sbttn" />
                                        </td>
                                        <td>
                                            <UI:CButton ID="btnLicense" Text="BtnLicense" runat="server" class="sbttn" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                    </table>
                </asp:TableCell></asp:TableRow>
        </asp:Table>
    </div>
    </form>
</body>
</html>
