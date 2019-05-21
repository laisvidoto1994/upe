<%@ Page Language="c#" CodeBehind="ListUsers.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.ListUsers" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <title>User List</title>
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/BAWindow.css" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/scripts.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javaScript" type="text/javascript">        var j$ = jQuery.noConflict(true);</script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/ListUsers.js"></script>
</head>
<body>
    <form id="Form1" method="post" runat="server">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <table id="Table1" cellspacing="1" cellpadding="1" width="90%" border="0">
        <tr>
            <td align="middle">
                <table id="Table2" cellspacing="1" cellpadding="1" width="300" border="0">
                    <tr>
                        <td colspan="2" class="header">
                            <p>
                                <span id="SpanReassign" runat="server"></span>
                                <br />
                                <b>
                                    <UI:CLabel runat="server" Text="SearchUser" />
                                </b>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="Domain" /></b>
                        </td>
                        <td>
                            <asp:TextBox ID="txtDomain" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="User" /></b>&nbsp;
                        </td>
                        <td>
                            <asp:TextBox ID="txtSAMAccount" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="UserFullName" /></b>&nbsp;
                        </td>
                        <td>
                            <asp:TextBox ID="txtFullName" runat="server"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>
                                <UI:CLabel runat="server" Text="OrganizationName" /></b>&nbsp;
                        </td>
                        <td>
                            <asp:DropDownList ID="ddlOrganizations" runat="server">
                            </asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="2">
                            <table border="0">
                                <tr>
                                    <td>
                                        <UI:CButton ID="btnSearch" runat="server" Text="BtnSearch" class="sbttn" />
                                    </td>
                                    <td>
                                        <UI:CButton ID="btnClear" runat="server" Text="BtnClear" class="sbttn" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="middle">
                <asp:DataGrid ID="DataGridUser" runat="server" AllowPaging="True" BorderColor="White"
                    BorderWidth="2px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="20"
                    AllowSorting="True" AutoGenerateColumns="false">
                    <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
                    <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                    <ItemStyle CssClass="gridline1"></ItemStyle>
                    <HeaderStyle CssClass="headerlinksNI"></HeaderStyle>
                    <Columns>
                        <asp:ButtonColumn Text="Click" CommandName="Select" />
                        <asp:ButtonColumn Text="Log" CommandName="Edit" />
                        <asp:BoundColumn DataField="WFBizCAdminUser_Id" SortExpression="WFBizCAdminUser_Id">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_User" SortExpression="WFBizCAdminUser_User">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_Domain" SortExpression="WFBizCAdminUser_Domain">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_Name" SortExpression="WFBizCAdminUser_Name">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_EMail" SortExpression="WFBizCAdminUser_EMail">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_EnabledForAssignation" SortExpression="WFBizCAdminUser_EnabledForAssignation">
                        </asp:BoundColumn>
                        <asp:BoundColumn DataField="WFBizCAdminUser_Enabled" SortExpression="WFBizCAdminUser_Enabled">
                        </asp:BoundColumn>
                    </Columns>
                    <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="headerlinksNI"
                        Mode="NumericPages"></PagerStyle>
                </asp:DataGrid>
            </td>
        </tr>
        <tr>
            <td align="middle">
                <asp:Label ID="DataGridUserSort" runat="server" Visible="False"></asp:Label>
            </td>
        </tr>
        <tr>
            <td align="middle">
                <UI:CButton ID="btnNewUser" runat="server" Text="BtnNewUser" class="sbttn" />
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td align="center" colspan="2">
                <asp:Table ID="tblLicense" Visible="false" runat="server">
                    <asp:TableRow>
                        <asp:TableCell>
                            <table cellspacing="1" cellpadding="1" width="300" border="0">
                                <tr>
                                    <td colspan="2" align="center" class="header">
                                        <UI:CLabel ID="CLabel3" runat="server" Text="AppLicenseInformation" Font-Underline="False" />
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
                        </asp:TableCell>
                    </asp:TableRow>
                </asp:Table>
            </td>
        </tr>
    </table>
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
    <input type="hidden" id="lblBASetLocationFromMain" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("SearchUser") %>" />
</body>
</html>
