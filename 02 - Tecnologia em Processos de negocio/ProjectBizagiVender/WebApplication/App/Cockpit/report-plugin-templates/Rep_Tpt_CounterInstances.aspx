<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Rep_Tpt_CounterInstances.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.report_plugin_templates.Rep_Tpt_CounterInstances" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Untitled Page</title>

    <script type="text/javascript">
        function ChartClicked(clickParams){
            $("<div></div>").BizRep_Count_Instances_ChartClick(clickParams);
        }
        function ChartClicked_Absolute(clickParams){
            $("<div></div>").BizRep_AbsoluteCount_Instances_ChartClick(clickParams);
        }
    </script>

</head>

<body>
        <div class= "ReportHeader">
        <div id="reportTitleBar" class="reportTitleBar">
            <div id="lblReportName" class="lblReportName" runat="server"></div> 
        </div>
            <div id="lblReportDescription" class="lblReportDescription" runat="server">xInstances column chart for all counters in the selected process.</div>
        </div>
        
        
        <div class= "ReportData" ></div>
        
        
        <div class= "ReportConfig"></div>
        
        
        <div class= "ReportFooter"></div>
</body>
</html>
