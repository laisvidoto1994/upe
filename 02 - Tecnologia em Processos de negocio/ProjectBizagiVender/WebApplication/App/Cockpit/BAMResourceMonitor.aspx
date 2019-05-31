<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BAMResourceMonitor.aspx.cs"
    Inherits="BizAgiBPM.App.Cockpit.BAMResourceMonitor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Business Activity Monitor</title>
    <%WriteHead();%>
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/GraphicReports.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/panelFiltroReportes.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/report-plugin-templates/report-templates.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.tooltip.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>

    <script language="javascript" type="text/javascript" src="../../js/FusionCharts.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/json2.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/Reports.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/panelFiltroReportes.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/SlicerPanel.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-table.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.iframe.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.jstree.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.layout.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-iframe-auto-height.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.tooltip.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.selectmenu.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/HighCharts/highcharts.src.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/HighCharts/modules/exporting.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/json2.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/Reports.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/panelFiltroReportes.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/SlicerPanel.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-table.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-chart.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-highchart.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Onl_Res_WorkInProgress.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Onl_Res_WorkInProgressByUser.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/BAMResourceMonitor.js"></script>
    </head>
<body ms_positioning="FlowLayout">
    <form id="FormBamResourceMonitor" method="post" runat="server">
    <script type="text/javascript" language="javascript">
        BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("BAM_Rep_ResourceMonitor") %>");
    </script>
    <div id="Analysis_NavigationMenuBack" class="Analysis_NavigationMenuBack">
        <table style="width: 100%">
            <tr>
                <td id="cellWorkInProgress" class="Analysis_NavigationMenuItem" onmouseover="" onmouseout=""
                    onclick="">
                    <label runat="server" id="lblWorkInProgress" style="cursor: pointer">
                        Recursos por actividad</label>
                </td>
                <td id="cellMyTeam" class="Analysis_NavigationMenuItem" onmouseover="" onmouseout=""
                    onclick="">
                    <label runat="server" id="lblMyTeam" style="cursor: pointer">
                        My Team...</label>
                </td>
                <td id="cellLoadAnalysis" class="Analysis_NavigationMenuItem" onmouseover="" onmouseout=""
                    onclick="">
                    <label runat="server" id="lblLoadAnalysis" style="cursor: pointer">
                        Recursos por usuario</label>
                </td>
                <td>
                </td>
                <td style="text-align: right; width: 0px">
                    <asp:PlaceHolder runat="server" ID="phButtonSave">
                        <div id="SaveQueryButton" class="Analysis_BottomSavePanel" onmouseover="this.className='Analysis_BottomSavePanel_hover';"
                            onmouseout="this.className='Analysis_BottomSavePanel';" style="width: 150px;"
                            onclick="">
                            <table style="width: 100%">
                                <tr>
                                    <td>
                                        <asp:Image ID="Image1" runat="server" ImageUrl="../../img/analysis/save_as.png">
                                        </asp:Image>
                                    </td>
                                    <td>
                                        <b>
                                            <asp:Label ID="lblSaveQuery" runat="server" Text="Save Query" />...</b>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </asp:PlaceHolder>
                </td>
            </tr>
        </table>
    </div>
    <br />
    <!-- Filter panel-->
    <div id="panelFilters">
        <!-- Process filter -->
        <div id="divProcessFilterPanel">
            <div class="divProcessFilterIcon">
                <img alt="filtros" src="../../img/analysis/funnel.png" />
            </div>
            <div id="divProcessFilter_WfClass" class="divProcessFilter_WfClass">
                <asp:Label CssClass="processFilterText" ID="lblWorkflowSelectTitle" runat="server"
                    Text="Process:"></asp:Label>
                <asp:DropDownList runat="server" ID="ddlWorkflows" onchange="">
                </asp:DropDownList>
            </div>
        </div>
        <!-- User filters -->
        <div id="divSlicers">
        </div>
    </div>
    <div id="divLoadingMessage" style="text-align: center; width: 100%; background: transparent;
        display: none; position: absolute; top: 30%; left: 0">
        <table width="150px" align="center" style="border: solid 1px #BBC0B5; height: 70px;
            text-align: left; background: white">
            <tr>
                <td>
                    Loading charts...
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Image ID="imgWait" runat="server" ImageUrl="../../img/analysis/loading.gif">
                    </asp:Image>
                </td>
            </tr>
        </table>
    </div>
    <div id="divResourceUserMessage" style="display: none; clear: both; padding-top: 25px;">
        <label runat="server" id="labelEmptyResourceUserMessage" style="cursor: pointer;
            font-weight: bold; padding-top: 25px">
            You must select at least a user/role filter in order to show results</label>
    </div>
    <!-- Load Analysis Panel -->
    <div id="divLoadAnalysis" class="silverlightPicture" style="display: block;">
        <iframe id="iframeSilverlight" frameborder="0" src="SLContainer.aspx" width="100%"
            height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
    </div>
    <!-- Task Table Panel -->
    <div id="taskValuesPanel" class="taskValuesPanel" style="display: block; padding-top: 25px;">
        <div id="divResourceManagerTable" style="text-align: left">
        </div>
        <div id="prooftable"></div>
        <label runat="server" id="labelResourceEmptyMessage" style="cursor: pointer; display: none;
            font-weight: bold; padding-top: 25px">
            There are no result to show.</label>
    </div>
    <br />
    <!-- Parameters when a user query was sent in the querystring -->
    <input type="hidden" id="hidUserQuerySlicers" runat="server" />
    <!-- Messages -->
    <input type="hidden" id="hidMsgOK" runat="server" />
    <input type="hidden" id="hidMsgCancel" runat="server" />
    <input type="hidden" id="hidMsgClose" runat="server" />
    <input type="hidden" id="selectedTaskId" runat="server" value="-1" />
    <input type="hidden" id="isQueryLoaded" runat="server" value="false" />
    <input type="hidden" id="selectedWorkflowId" runat="server" value="-1" />
    <asp:Label ID="userNameLabel" runat="server" Style="display: none" Text="User..."></asp:Label>
    <asp:Label ID="countCaseLabel" runat="server" Style="display: none" Text="Number of cases..."></asp:Label>
    </form>
</body>
</html>
