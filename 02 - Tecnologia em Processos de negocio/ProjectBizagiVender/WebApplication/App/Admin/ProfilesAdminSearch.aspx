<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<%@ Page Language="c#" CodeBehind="ProfilesAdminSearch.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.ProfilesAdminSearch" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Profiles Admin</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript">
        function GetDisplayDiv() {

            var sel = document.getElementById("I_PROFILETYPE");
            var valor = sel.options[sel.selectedIndex].value;
            HideShowOrganization(valor);

        }

        //Hide or show the combo organization, when position is selected.
        function HideShowOrganization(valor) {

            var selOrg = document.getElementById("I_ORGANIZATION")


            if (valor == "1") {
                if (selOrg.options.length > 1) {
                    document.getElementById('divOrg1').style.display = "block";
                    document.getElementById('divOrg2').style.display = "block";
                }
                else {
                    document.getElementById('divOrg1').style.display = "none";
                    document.getElementById('divOrg2').style.display = "none";

                }
            }

            else {
                document.getElementById('divOrg1').style.display = "none";
                document.getElementById('divOrg2').style.display = "none";
            }
        }
        //GetDisplayDiv();
    </script>
</head>
<body onload="BAonload();GetDisplayDiv();">
    <form name="frm" method="post" runat="server">
    <span id="SpanHeader" runat="server"></span>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td class="header" colspan="2">
                <b>
                    <UI:CLabel runat="server" Text="CProfile_ProfilesAdmin" ID="ClabelTitle" />
                </b>
            </td>
            <script language="javascript" type="text/javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProfilesAdmin") %>");
            </script>
        </tr>
        <tr>
            <td colspan="2">
                <img src="../../img/WorkPortal/WPProfilesHelp.gif" width="48" height="48" alt=""
                    border="0" align="top" style="float: right" />
                <UI:CLabel runat="server" Text="CManageProfile_Help" ID="lblHelp" />
            </td>
        </tr>
        <tr>
            <td valign="top" class="Header" colspan="2">
                &nbsp;
            </td>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td width="20%">
                <b>
                    <UI:CLabel runat="server" Text="CProfile_ProfileType" ID="ClabelType" />
                </b>
            </td>
            <td valign="top">
                <asp:DropDownList ID="I_PROFILETYPE" runat="server" Style="width: 200px" />
            </td>
        </tr>
        <tr>
            <td width="20%">
                <div id="divOrg1">
                    <b>
                        <UI:CLabel runat="server" Text="CProfile_Organization" ID="ClabelOrganization" />
                    </b>
                </div>
            </td>
            <td valign="top">
                <div id="divOrg2">
                    <asp:DropDownList ID="I_ORGANIZATION" runat="server" Style="width: 200px" />
                </div>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <b>
                    <UI:CLabel runat="server" Text="CProfile_ProfileName" ID="ClabelName" /></b>
            </td>
            <td valign="top">
                <input type="text" name="I_PROFILENAME" maxlength="50" size="30" style="width: 200px" />
            </td>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="left">
                <table>
                    <tr>
                        <td>
                            <%	H.WPButton("reset", "btnReset", BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnClear"), "Return", "sbttn", "");	%>
                        </td>
                        <td>
                            <UI:CButton ID="btnSearch" runat="server" Text="BtnSearch" class="sbttn" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2" width="100%">
                <asp:DataGrid ID="DataGridProfiles" runat="server" AllowPaging="True" BorderColor="White"
                    BorderWidth="2px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="20"
                    AllowSorting="True" AutoGenerateColumns="False">
                    <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66" Width="100%">
                    </SelectedItemStyle>
                    <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                    <ItemStyle CssClass="gridline1"></ItemStyle>
                    <HeaderStyle CssClass="headerlinksNI"></HeaderStyle>
                    <Columns>
                        <asp:ButtonColumn Text="Adm" CommandName="Select"></asp:ButtonColumn>
                        <asp:BoundColumn Visible="False" DataField="Id" HeaderText="Id"></asp:BoundColumn>
                        <asp:BoundColumn DataField="Name" HeaderText="Profile Name"></asp:BoundColumn>
                    </Columns>
                    <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="headerlinksNI"
                        Mode="NumericPages"></PagerStyle>
                </asp:DataGrid>
                <br />
                <span id="SpanMessage" runat="server"></span>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
