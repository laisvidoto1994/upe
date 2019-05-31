<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page Language="c#" CodeBehind="CurrentUser.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.CurrentUser" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <title>User</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <%WriteOnClick();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
</head>
<body>
    <form id="Form1" method="post" runat="server">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <asp:Table ID="tblUserProperties" runat="server" CellSpacing="1" CellPadding="1"
        HorizontalAlign="Center" BorderWidth="0" Width="90%">
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Top" class="Header" colspan="2">
                <ui:Clabel runat="server" text="PersonalInformation" font-underline="False" id="Clabel1" />
                <br />
                <script language="javascript" type="text/javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UserPreferences") %>");
                </script>
            </asp:TableCell>
            <asp:TableCell VerticalAlign="Top"></asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell colspan="2">
                <asp:Image ID="userImage" runat="server" ImageAlign="Top" Style="float: right" Width="64"
                    Height="64" onclick="openDialog();" />
                <br />
                <ui:clabel runat="server" text="PersonalInformationDescription" font-underline="False"
                    id="Clabel12" />
                <br />
            </asp:TableCell>
            <asp:TableCell VerticalAlign="Top"></asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Top" class="Header" colspan="2">&nbsp;
            </asp:TableCell>
            <asp:TableCell VerticalAlign="Top"></asp:TableCell>
        </asp:TableRow>
        <asp:TableRow>
            <asp:TableCell>
            </asp:TableCell>
            <asp:TableCell VerticalAlign="Top">&nbsp;</asp:TableCell>
        </asp:TableRow>
    </asp:Table>
    <table>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
    </table>
    <asp:Table ID="tblUserAuthentication" runat="server" CellSpacing="1" CellPadding="1"
        HorizontalAlign="Center" BorderWidth="0" Width="90%">
        <asp:TableRow>
            <asp:TableCell VerticalAlign="Top">
                <strong>
                    <ui:Clabel runat="server" text="User Authentication" font-underline="True" id="Clabel2" />
                </strong>
                <br />
                <br />
            </asp:TableCell>
            <asp:TableCell VerticalAlign="Top"></asp:TableCell>
        </asp:TableRow>
    </asp:Table>
    <table id="Table3" cellspacing="1" cellpadding="1" width="90%" align="center" border="0">
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td valign="top">
            </td>
            <td>
                <asp:Label ID="LblMessage" runat="server" Font-Bold="True" Visible="False" />
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td style="height: 16px">
                <ui:cbutton id="btnUpdate" runat="server" class="sbttn" />
            </td>
            <td style="height: 16px">
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                <asp:HyperLink ID="LinkListUsers" runat="server" NavigateUrl="ListUsers.aspx" Visible="False">
                    <ui:Clabel runat="server" text="BackToUserList" id="Clabel3" />
                </asp:HyperLink>&nbsp;&nbsp;
            </td>
        </tr>
        <% if (sDelegatesMessage.Length > 0)
           {%>
        <tr>
            <td colspan="2">
                <hr>
                <%= sDelegatesMessage %>
            </td>
        </tr>
        <%}%>
    </table>
    <input name="isPostBack" type="hidden" value="false" />
    </form>
</body>
</html>
