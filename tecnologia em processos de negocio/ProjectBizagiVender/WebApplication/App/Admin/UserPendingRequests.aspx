<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<%@ Page Language="c#" CodeBehind="UserPendingRequests.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.UserPendingRequests" %>

<%@ Import Namespace="System.Data" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>PendingActivations</title>
    <meta name="GENERATOR" content="Microsoft Visual Studio .NET 7.1" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
</head>
<body ms_positioning="FlowLayout">
    <%=GetHeader()%>
    <form id="Form1" method="post" runat="server">
    <table align="center" width="90%">
        <tr>
            <td align="center" class="header">
                <b>
                    <UI:CLabel runat="server" Text="UserPendingRequests_Header" ID="lblHeader" /></b>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <asp:DataGrid ID="dgUserPendingRequests" runat="server" AllowPaging="True" BorderColor="White"
                    BorderWidth="1px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="10"
                    AllowSorting="True" Width="540px">
                    <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
                    <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                    <ItemStyle CssClass="gridline1"></ItemStyle>
                    <HeaderStyle CssClass="headerlinksNI"></HeaderStyle>
                    <Columns>
                        <asp:TemplateColumn>
                            <ItemTemplate>
                                <asp:HyperLink runat="server" Text="<%# GetSelectLinkName()%>" NavigateUrl='<%# DataBinder.Eval(Container.DataItem, "idUser", "ProcessUserPendingRequest.aspx?idUser={0}") %>'>
                                </asp:HyperLink>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                        <asp:TemplateColumn>
                            <ItemTemplate>
                                <asp:Image runat="server" ImageUrl="../../img/lista/BombilloVerdet.gif" Visible='<%# !IsExpired( ((DataRowView)Container.DataItem)["requestDate"] )%>'>
                                </asp:Image>
                                <asp:Image runat="server" ImageUrl="../../img/lista/BombilloRojot.gif" Visible='<%# IsExpired( ((DataRowView)Container.DataItem)["requestDate"] )%>'>
                                </asp:Image>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                        <asp:BoundColumn DataField="requestDate"></asp:BoundColumn>
                        <asp:BoundColumn DataField="domain"></asp:BoundColumn>
                        <asp:BoundColumn DataField="userName"></asp:BoundColumn>
                        <asp:BoundColumn DataField="requestObservation"></asp:BoundColumn>
                    </Columns>
                    <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="headerlinksNI"
                        Mode="NumericPages"></PagerStyle>
                </asp:DataGrid>
                <asp:Label runat="server" ID="lblNotFound"></asp:Label>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
