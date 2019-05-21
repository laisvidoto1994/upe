<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Licenses.aspx.cs" Inherits="BizAgiBPM.App.Admin.Licenses" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Licenses</title>
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/BAWindow.css" rel="stylesheet" type="text/css" />
    <%WriteHead();%>
    <script language="javascript" src="../../js/implementation.js" type="text/javascript"></script>
    <script language="javaScript" src="../../js/scripts.js" type="text/javascript"></script>
    <%--
    <script language="JavaScript" src="../../Localization/LocalizationEN.js" type="text/javascript" ></script>
    <script language="JavaScript" src="../../js/scripts.js" type="text/javascript" ></script>--%>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript">        var j$ = jQuery.noConflict(true);</script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/Licenses.js"> </script>
</head>
<body>
    <form id="form1" runat="server">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <br />
    &nbsp;
    <asp:Table ID="tblLicense" runat="server" CellSpacing="1" CellPadding="1" HorizontalAlign="Center"
        BorderWidth="0" Width="90%">
        <asp:TableRow>
            <asp:TableCell>
							&nbsp;
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
                <UI:CLabel ID="CLabel2" Text="AppLicenseInformation" class="Header" runat="server"
                    Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
                <asp:Image ID="imgCertificate" ImageUrl="../../img/Licenses/Certificate.png" runat="server" />
                <UI:CLabel ID="lblCertificate" Text="AppLicensedCertificate" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Middle">
                <asp:Image ID="imgUsers" ImageUrl="../../img/Licenses/Users.png" runat="server" />
                <UI:CLabel ID="lblUsers" Text="AppLicensedUsers" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
                <asp:Image ID="imgLicenseDate" ImageUrl="../../img/Licenses/LicenseDate.png" runat="server" />
                <UI:CLabel ID="lblLicenseDate" Text="AppLicensedUsersDate" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Middle">
                <asp:Image ID="imgLicenseType" ImageUrl="../../img/Licenses/LicenseType.png" runat="server" />
                <UI:CLabel ID="lblLicenseType" Text="AppLicenseType" runat="server" Font-Bold="True" />
                <asp:Image ID="imgTrialLicense" ImageUrl="../../img/Licenses/TrialLicense.png" runat="server" />
                <UI:CLabel ID="lblTrialLicense" Text="TrialLicense" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Middle">
                <asp:Image ID="imgClusterType" ImageUrl="../../img/Licenses/LicenseType.png" runat="server" />
                <UI:CLabel ID="lblClusterType" Text="ClusterType" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Middle">
                <asp:Image ID="imgProcess" ImageUrl="../../img/Licenses/LicenseType.png" runat="server" />
                <UI:CLabel ID="lblProcess" Text="ClusterType" runat="server" Font-Bold="True" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
                <UI:CButton ID="btnBuy" Text="BtnBuy" runat="server" class="sbttn" OnClick="btnBuy_Click"
                    CausesValidation="false" />
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
							&nbsp;
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
							&nbsp;
            </asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
                &nbsp;
            </asp:TableCell>
        </asp:TableRow>
    </asp:Table>
    <br />
    </form>
    <div id='alertDiv' style='background-color: #FFFFFF; color: #666666; width: 300px;
        height: 160px; visibility: hidden; display: none; font: 12px Verdana, Arial, Helvetica, sans-serif;
        padding: 5px; font-weight: bold;'>
        <table border="0" align="center">
            <tr style="height: 125px;">
                <td align="center">
                    <div id="innerText">
                    </div>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <input type="button" onclick="Windows.close('alertWindow');" value="Close" />
                </td>
            </tr>
        </table>
    </div>
    <br />
    <br />
    <input type="hidden" id="labelClientValidationTitle" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ClientValidationTitle1") %>" />
    <input type="hidden" id="labelApplyLicenseInformation" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppLicenseInformation") %>" />
</body>
</html>
