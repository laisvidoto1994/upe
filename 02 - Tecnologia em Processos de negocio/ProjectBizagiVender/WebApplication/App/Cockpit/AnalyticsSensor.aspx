<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AnalyticsSensor.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.AnalyticsSensors" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>

    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css"/>
    <link href="../../css/Analysis/panelFiltroReportes.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/AnalyticsSensors.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/report-plugin-templates/report-templates.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.tooltip.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    
    <!--Predefined behavior-->
		<%WriteHead();%>
    
    
	<script language="javascript" type="text/javascript" src="../../js/FusionCharts.js"></script>

    <!--jQuery scripts -->
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.iframe.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.jstree.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.layout.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-iframe-auto-height.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.tooltip.js"></script>    

    
    <!-- All Reportsets scripts -->    
    <script type="text/javascript" language="JavaScript" src="../../js/Analysis/panelFiltroReportes.js"></script>
    <script type="text/javascript" language="JavaScript" src="../../js/Analysis/SlicerPanel.js"></script>
	<script type="text/javascript" language="JavaScript" src="../../js/Analysis/Reports.js"></script>
    <script type="text/javascript" language="JavaScript" src="../../js/Analysis/json2.js"></script>

    <!--Report Plugins -->
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-chart.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/analysis-util-table.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_CycleTimeSummary.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_LevelOfService.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_DurationTrend_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_ActivationAndClosingTrend_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_DurationHistogram_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_LevelOfService_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Sw_CycleTimeSummary_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Count_Summary.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Count_Summary_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Count_Instances.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.Count_ActivationTrend_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.AbsoluteCount_Summary.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.AbsoluteCount_Summary_Single.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.AbsoluteCount_Instances.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/report-plugins/jquery.bizrep.AbsoluteCount_ActivationTrend_Single.js"></script>    



    <!--Reportset Specific scripts -->
    <script language="javascript" type="text/javascript" src="../../js/Analysis/AnalyticsSensor.js"></script>

</head>
<body>
    <form id="form1" runat="server">
        
        <script type="text/javascript" language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Analytics_Rep_Phases") %>");
		</script>
		
        
        <div id="panelCommands">
            <div class="Analysis_NavigationMenuItem Analysis_SaveButton " onclick= "SaveQuery();" > <asp:label id="lblSaveQuery" runat="server" Text="xSave query..."/></div>
            <div class="Analysis_NavigationMenuItem Analysis_SensorEdit_Button " onclick= "EditSensors();" > <asp:label id="lblEditSensors" runat="server" Text="xEdit Sensors..."/></div>
        </div>
        
        
        
        <!--Slicers -->
        <div id="panelFilters">
            <div id="divSlicers"></div>
        </div>
        
        
        
        <!--Main central screen -->
        <div id="panelReportScreen">
            
            <!--Sensor tree region -->
            <div id="panelReportMenu" class="ui-layout-west">
                <div id="divSensorTreeTitle" class="ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblSensorTreeTitle" Font-Bold="true" runat="server" Text="xxxSensors"></asp:Label></div>
                <div id="divSensorTree"></div>
            </div>
            
            <div id="panelReportContents" class="ui-layout-center" style="width:100%">
                
                <!-- Tab group -->
                <div id="reportTabGroup-processSensors">
                    
                    <!-- tab headers -->
                    <ul>
                        <li class="liTabStopwatches"><a href="#reportTab-Stopwatches"><asp:Label ID="lblStopwatches" Font-Bold="true" runat="server" Text="xxxStopwatches"></asp:Label></a></li>
                        <li class="liTabCounters"><a href="#reportTab-Counters"><asp:Label ID="lblCounters" Font-Bold="true" runat="server" Text="xxxCounters"></asp:Label></a></li>
                    </ul>

                    <!-- Process stopwatch reports -->
                    <div id="reportTab-Stopwatches" class="reportTab">
                        <div id="divRep_sw_CycleTimeSummary" class="reportContainer">sw_CycleTimeSummary</div>
                        <div id="divRep_sw_LevelOfService" class="reportContainer">sw_LevelOfService</div>

                    </div>

                    <!-- Process counter reports -->                
                    <div id="reportTab-Counters" class="reportTab">
                        <div class="divCaseCounterReports">
                            <div id="divRep_count_Summary" class="reportContainer">count_Summary</div>
                            <div id="divRep_count_Instances" class="reportContainer">count_Instances</div>
                        </div>
                        <div class="divAbsoluteCounterReports">
                            <div id="divRep_count_Summary_Absolute" class="reportContainer">count_Summary_Absolute</div>
                            <div id="divRep_count_Instances_Absolute" class="reportContainer">count_Instances_Absolute</div>
                        </div>
                    </div>

                </div>


                <!-- Single stopwatch reports -->                
                <div id="divStopwatchReports">
                    <div id="divRep_sw_CycleTimeSummary_Single" class="reportContainer">sw_CycleTimeSummary_Single</div>
                    <div id="divRep_sw_LevelOfService_Single" class="reportContainer">sw_LevelOfService_Single</div>
                    <div id="divRep_sw_DurationHistogram_Single" class="reportContainer">sw_DurationHistogram_Single</div>
                    <div id="divRep_sw_DurationTrend_Single" class="reportContainer">sw_DurationTrend_Single</div>
                    <div id="divRep_sw_ActivationClosingTrend_Single" class="reportContainer">sw_ActivationClosingTrend_Single</div>
                </div>
                
                <!-- Single counter reports -->                
                <div id="divCounterReports">
                    <div class="divCaseCounterReports">
                        <div id="divRep_count_Summary_Single" class="reportContainer">count_Summary_Single</div>
                        <div id="divRep_count_ActivationTrend_Single" class="reportContainer">count_ActivationTrend_Single</div>
                    </div>
                    <div class="divAbsoluteCounterReports">
                        <div id="divRep_count_Summary_Single_Absolute" class="reportContainer">count_Summary_Single_Absolute</div>
                        <div id="divRep_count_ActivationTrend_Single_Absolute" class="reportContainer">count_ActivationTrend_Single_Absolute</div>
                    </div>
                </div>
 
            </div>

        </div>
        
        
        
        <!-- Time filter -->
        <div id="panelTimeFilter">
            <iframe id="iframeTimeFilter" style="z-index:0;overflow:hidden" frameborder="0" src="TimeFilterPanel.aspx" width="100%" height="200px" scrolling="no" marginwidth="0" marginheight="0"></iframe>
            <input type="hidden"    id="hidFixedDateRange" runat="server" />
        </div>



        <!-- Loading message -->   
        <div id="divLoadingMessage" style="display:none; z-index:10; text-align:center; width:100%; background:transparent; position:absolute; top:30%; left:0 ">
            <table width="150px" align="center" style="border:solid 1px #BBC0B5; height:70px; text-align:left; background:white" align="center">
                <tr><td>Loading charts...</td></tr>
                <tr><td><asp:image id="imgWait" runat="server" ImageUrl="../../img/analysis/loading.gif"></asp:image></td></tr>
            </table>
        </div>


        <!-- JSON Sensor model -->
        <input type="hidden"    id="hidSensorModel" value = "[]" runat="server" />

        <!-- Parameters when a user query was sent in the querystring -->
        <input type="hidden"    id="hidUserQuerySlicers" runat="server" />
        <input type="hidden"    id="hidUserQuerySensorNode" runat="server" />

        <!-- Messages -->
        <input type="hidden"    id="hidMsgOK" value = "xOK" runat="server" />
        <input type="hidden"    id="hidMsgCancel" value = "xCancel" runat="server" />
        <input type="hidden"    id="hidMsgNoDimensions" value = "xNo dimensions" runat="server" />
        <input type="hidden"    id="hidHoursDay" runat="server" />
        <input type="hidden"    id="hidMsgClose" runat="server" />

        <input type="hidden"    id="hidMsgViewCaseCounts" runat="server" />
        <input type="hidden"    id="hidMsgViewAbsoluteCounts" runat="server" />

        <input type="hidden"    id="hidDescCaseCounts" runat="server" />
        <input type="hidden"    id="hidDescAbsoluteCounts" runat="server" />        
        <input type="hidden"    id="hidMsgSelectCountType" runat="server" />

        <input type="hidden"    id="hidMsgNoSensorsDefined" runat="server" />

    </form>
</body>
</html>
