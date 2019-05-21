<%@ Import Namespace="System.Data" %>
<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<%@ Page Language="c#" CodeBehind="AsynchDisabledWorkitems.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.AsynchDisabledWorkitems" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Asynch Workitems Retries</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/AsynchDisabledWorkitems.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Jq/ui191/smoothness/jquery-ui-1.9.1.custom.css" type="text/css" rel="stylesheet" />
    <script language="javaScript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/scripts.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Jquery/ui191/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Jquery/ui191/jquery-ui-1.9.1.custom.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/AsynchDisabledWorkitems.js"></script>
</head>
<body style="width: 95%">
    <form id="Default" method="post" runat="server">
    <div class="container">
        <span id="SpanHeader" class="attention" style="position: relative" runat="server">
            <UI:CLabel runat="server" Text="AsynchronousWorkItemLabel" ID="lblHeader" NAME="lblHeader" />
        </span>
        <br />
        <span id="ui-bizagi-asynch-refresh-label" onclick="window.location='AsynchDisabledWorkitems.aspx'">
            Refresh page...</span> <span class="ui-bizagi-asynch-refresh" onclick="window.location='AsynchDisabledWorkitems.aspx'">
            </span>
        <div id="asynchWorkItemsTable">
            <div>
                <span id="TabHTML"></span>
            </div>
            <div>
                <div id="tabs">
                    <ul>
                        <li><a href="#xpTab1"><span id="tab-list"></span></a></li>
                        <li><a href="#xpTab2"><span id="tab-grouped"></span></a></li>
                    </ul>
                    <div id="xpTab1">
                        <div class="table-scroll">
                            <asp:DataGrid ID="dgAsynchDisabledWorkitems" runat="server" AllowPaging="True" BorderColor="#CCCCCC"
                                BorderWidth="1px" BackColor="White" CellPadding="4" BorderStyle="Solid" AllowSorting="True"
                                AutoGenerateColumns="False" Width="100%">
                                <SelectedItemStyle Font-Bold="True" ForeColor="#663399" BackColor="#FFCC66"></SelectedItemStyle>
                                <AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
                                <ItemStyle CssClass="gridline1"></ItemStyle>
                                <HeaderStyle CssClass="tGrpHeader"></HeaderStyle>
                                <Columns>
                                    <asp:TemplateColumn>
                                        <ItemTemplate>
                                            <asp:CheckBox runat="server" ID="chkEnable"></asp:CheckBox>
                                        </ItemTemplate>
                                    </asp:TemplateColumn>
                                    <asp:TemplateColumn>
                                        <ItemTemplate>
                                            <span class="iu-biz-asynch-log-image">
                                                <asp:ImageButton runat="server" CommandName="ViewLog" CausesValidation="false" ImageUrl=""
                                                    ID="lnkViewLog" Width="20px" Height="20px" CssClass="ui-bizagi-async-log-button">
                                                </asp:ImageButton></span>
                                        </ItemTemplate>
                                    </asp:TemplateColumn>
                                    <asp:TemplateColumn>
                                        <ItemTemplate>
                                            <span class="iu-biz-asynch-retry-image">
                                                <asp:ImageButton runat="server" CommandName="Process" CausesValidation="false" ImageUrl=""
                                                    ID="lnkProcessWorkitem" Width="20px" Height="20px" CssClass="ui-bizagi-async-retry-button">
                                                </asp:ImageButton>
                                            </span>
                                        </ItemTemplate>
                                    </asp:TemplateColumn>
                                    <asp:BoundColumn DataField="radNumber"></asp:BoundColumn>
                                    <asp:BoundColumn DataField="wfClsDisplayName"></asp:BoundColumn>
                                    <asp:TemplateColumn>
                                        <ItemTemplate>
                                            <asp:HyperLink NavigateUrl='<%# string.Format("../ListaDetalle/Detalle.aspx?idCase={0}", DataBinder.Eval(Container.DataItem, "idCase")) %>'
                                                runat="server" ID="Hyperlink1" NAME="Hyperlink1">
													<%# DataBinder.Eval(Container.DataItem, "tskDisplayName") %>
                                            </asp:HyperLink>
                                        </ItemTemplate>
                                    </asp:TemplateColumn>
                                    <asp:BoundColumn DataField="awCurrentRetries"></asp:BoundColumn>
                                    <asp:BoundColumn DataField="awCreationDate"></asp:BoundColumn>
                                    <asp:BoundColumn DataField="awLastProcessDate"></asp:BoundColumn>
                                    <asp:BoundColumn DataField="idCase" Visible="False"></asp:BoundColumn>
                                    <asp:BoundColumn DataField="idWorkitem" Visible="False"></asp:BoundColumn>
									<asp:BoundColumn DataField="idAsynchWorkitem" Visible="False"></asp:BoundColumn>									
                                </Columns>
                                <PagerStyle HorizontalAlign="Center" PageButtonCount="20" CssClass="tGrpHeader" Mode="NumericPages">
                                </PagerStyle>
                            </asp:DataGrid>
                            <asp:Label ID="lblNotFound" runat="server"></asp:Label>
                            <asp:CustomValidator ID="cvValidator" ClientValidationFunction="validateSelected"
                                EnableClientScript="True" Display="Static" runat="server">
                            </asp:CustomValidator>
                        </div>
                        <div>
                            <UI:CButton Text="AsynchDisabledWorkitems_EnableSelectedWorkitems" CausesValidation="True"
                                ID="btnEnable" runat="server"></UI:CButton>
                        </div>
                    </div>
                    <div id="xpTab2">
                        <table cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td>
                                    <%= sHTMLWfClassTree %>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <asp:Label ID="asynchRefreshLabel" runat="server" Style="display: none" Text="Refresh"></asp:Label>
        <asp:Label ID="asynchDisabledWorkitemsAsynchExecutions" runat="server" Style="display: none"
            Text=""></asp:Label>
        <asp:Label ID="asynchDisabledWorkitemsGroupedByTask" runat="server" Style="display: none"
            Text=""></asp:Label>
        <asp:Label ID="asynchDisabledWorkitemsHeader" runat="server" Style="display: none"
            Text=""></asp:Label>
    </div>
    </form>
</body>
</html>
