<%@ Page Language="c#" CodeBehind="GetUser.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.GetUser" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>GetUser</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
</head>
<body ms_positioning="FlowLayout">
    <form id="GetUser" method="post" runat="server">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <table id="Table1" cellspacing="1" cellpadding="1" width="90%" border="0">
        <tr>
            <td align="middle">
                <table id="Table2" cellspacing="1" cellpadding="1" width="300" border="0">
                    <tr>
                        <td colspan="2" class="header">
                            <b>
                                <UI:CLabel runat="server" Text="SearchUser" /></b>
                            <p>
                            </p>
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
                        <td align="center" colspan="2">
                            <table border="0">
                                <tr>
                                    <td>
                                        <UI:CButton ID="btnSearch" runat="server" Text="BtnSearch" />
                                    </td>
                                    <td>
                                        <UI:CButton ID="btnClear" runat="server" Text="BtnClear" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="middle">
                        </td>
                    </tr>
                    <tr>
                        <td align="middle">
                            <asp:Label ID="DataGridUserSort" runat="server" Visible="False"></asp:Label><UI:CButton
                                ID="btnNewUser" runat="server" Text="BtnNewUser" Visible="False" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <div>
        <asp:DataGrid ID="DataGridUser" runat="server" AllowPaging="True" BorderColor="White"
            BorderWidth="1px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="20"
            AllowSorting="True" AutoGenerateColumns="false">
            <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
            <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
            <ItemStyle CssClass="gridline1"></ItemStyle>
            <HeaderStyle CssClass="headerlinksNI"></HeaderStyle>
            <Columns>
                <asp:ButtonColumn Text="Click" CommandName="Select" runat="server" />
                <asp:ButtonColumn Text="Log" CommandName="Edit" runat="server" Visible="False" />
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
    </div>
    </form>
</body>
</html>
