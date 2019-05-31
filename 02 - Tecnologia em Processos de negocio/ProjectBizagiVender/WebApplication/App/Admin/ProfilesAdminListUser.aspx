<%@ Page Language="c#" CodeBehind="ProfilesAdminListUser.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.ProfilesAdminListUser" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Profiles Admin</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <script type="text/javascript" language="javascript" src="../../js/implementation.js"></script>
    <script type="text/javascript" language="javascript" src="../../js/scripts.js"></script>
    <script type="text/javascript" language="javascript" src="../../js/BizAgiAJAX.js"></script>
    <script type="text/javascript" language="javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script type="text/javascript" language="javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script type="text/javascript" language="javascript" src="../../js/WorkPortal/BAWindows/BAwindow.js"></script>
    <script type="text/javascript" language="javascript">
        function AddUser() {
            //alert("AddUser" + oResult);
            document.frm.submit();
        };
    </script>
</head>
<body onload="BAonload()">
    <form id="frm" method="post" runat="server">
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td class="header" colspan="3">
                <b>
                    <UI:CLabel runat="server" Text="CProfile_ProfilesAdmin" ID="CTitle" />
                </b>
            </td>
            <script language="javascript" type="text/javascript">
                BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProfilesAdmin") %>");
            </script>
        </tr>
        <tr>
            <td colspan="3">
                <img src="../../img/WorkPortal/WPProfilesHelp.gif" width="48" height="48" alt="" border="0" align="top" style="float: right" />
                <UI:CLabel runat="server" Text="CManageProfile_Help" ID="lblHelp" />
            </td>
        </tr>
        <tr>
            <td valign="top" class="Header" colspan="3">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td align="center">
                <b>
                    <UI:CLabel runat="server" Text="CProfile_ProfilesListUser" ID="ClabelTitle" />
                    <span id="SpanProfileSelected" runat="server"></span></b>
            </td>
            <script language="javascript" type="text/javascript">
				BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProfilesAdmin") %>");
            </script>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="center">
                <asp:DataGrid ID="DataGridProfiles" runat="server" AllowPaging="True" BorderColor="White"
                    BorderWidth="2px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="20"
                    AllowSorting="True" AutoGenerateColumns="False">
                    <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
                    <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                    <ItemStyle CssClass="gridline1"></ItemStyle>
                    <HeaderStyle CssClass="headerlinksNI"></HeaderStyle>
                    <Columns>
                        <asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
                        <asp:BoundColumn Visible="False" DataField="Id" HeaderText="Id"></asp:BoundColumn>
                        <asp:BoundColumn DataField="FullName" HeaderText="User Name"></asp:BoundColumn>
                    </Columns>
                    <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="headerlinksNI"
                        Mode="NumericPages"></PagerStyle>
                </asp:DataGrid>
                <br />
                <span id="SpanMessage" runat="server"></span>
            </td>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="center">
                <table>
                    <tr>
                        <td>
                            <UI:CButton ID="btnReturn" runat="server" Text="BtnReturn" class="sbttn" />
                        </td>
                        <td>
                            <UI:CButton ID="btnNewUser" runat="server" Text="BtnNewUser" class="sbttn" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <div style="display: none">
        <asp:TextBox ID="hdnBossUserId" runat="server" AutoPostBack="true" />
        <input type="text" name="txtBossUserName" />
    </div>
    </form>
</body>
</html>
