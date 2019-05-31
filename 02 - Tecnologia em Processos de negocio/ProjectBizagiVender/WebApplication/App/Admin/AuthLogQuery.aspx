<%@ Page Language="c#" CodeBehind="AuthLogQuery.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.AuthLogQuery" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Import Namespace="System.Data" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>AuthLogQuery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-1252" />
    <meta name="GENERATOR" content="Microsoft Visual Studio .NET 7.1" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet"/>
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet"/>
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet"/>
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
</head>
<body onload="BAonload()">
    <form id="frm" method="post" runat="server">
    <table align="center" width="90%">
        <tr width="30%">
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td align="center" class="header" colspan="2">
                <b>
                    <UI:CLabel runat="server" Text="AuthLogQuery_Header" ID="lblHeader" /></b>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <UI:CLabel runat="server" Text="AuthLogQuery_Domain" ID="lblDomain" />
            </td>
            <td>
                <asp:DropDownList ID="cbDomain" runat="server" Width="200px">
                </asp:DropDownList>
            </td>
        </tr>
        <tr>
            <td>
                <UI:CLabel runat="server" Text="AuthLogQuery_Username" ID="lblUsername" />
            </td>
            <td>
                <asp:TextBox ID="txtUserName" runat="server" Width="200px"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>
                <UI:CLabel runat="server" Text="AuthLogQuery_EventType" ID="lblEventType" />
            </td>
            <td>
                <asp:DropDownList ID="cbAuthEventType" runat="server" Width="200px">
                </asp:DropDownList>
            </td>
        </tr>
        <tr>
            <td>
                <UI:CLabel runat="server" Text="AuthLogQuery_EventSubType" ID="lblEventSubType" />
            </td>
            <td>
                <asp:DropDownList ID="cbAuthEventSubType" runat="server" Width="200px">
                </asp:DropDownList>
            </td>
        </tr>
        <%DrawCalendars();%>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <UI:CButton ID="btnSearch" runat="server" Text="BtnSearch" class="sbttn" />
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <asp:DataGrid ID="dgAuthLogQueryResult" runat="server" AllowPaging="True" BorderColor="White"
                    BorderWidth="1px" BackColor="White" CellPadding="4" BorderStyle="None" PageSize="10"
                    AllowSorting="True" Width="80%">
                    <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
                    <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                    <ItemStyle CssClass="gridline1"></ItemStyle>
                    <HeaderStyle CssClass="gridheader"></HeaderStyle>
                    <Columns>
                        <asp:BoundColumn DataField="blEntryDate"></asp:BoundColumn>
                        <asp:BoundColumn DataField="domain"></asp:BoundColumn>
                        <asp:BoundColumn DataField="userName"></asp:BoundColumn>
                        <asp:BoundColumn DataField="ipAddress"></asp:BoundColumn>
                        <asp:TemplateColumn>
                            <ItemTemplate>
                                <%# GetEventTypeName(((DataRowView)Container.DataItem)["idAuthEventType"])%>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                        <asp:TemplateColumn>
                            <ItemTemplate>
                                <%# GetEventSubtypeName(((DataRowView)Container.DataItem)["idAuthEventSubType"])%>
                            </ItemTemplate>
                        </asp:TemplateColumn>
                    </Columns>
                    <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="gridheader" Mode="NumericPages">
                    </PagerStyle>
                </asp:DataGrid>
                <asp:Label runat="server" ID="lblNotFound"></asp:Label>
            </td>
        </tr>
    </table>
    </form>
    <div class="text" id="popupcalendar">
    </div>
    <%WriteValidation();%>
</body>
</html>
