<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RepTpt_SwDurationHistogram.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.report_plugin_templates.RepTpt_SwDurationHistogram" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Untitled Page</title>
</head>
<body>
    <div class= "ReportHeader">
        <div id="reportTitleBar" class="reportTitleBar">
            <div id="lblReportName" class="lblReportName" runat="server"></div> 
        </div>
        <div id="lblReportDescription" class="lblReportDescription" runat="server">Duration histogram for the selected stopwatch.</div>
    </div>
    
    
    <div class= "ReportData" ></div>
    
    
    <div class= "ReportConfig"></div>
    
    
    <div class= "ReportFooter">             
    </div>
</body>
</html>
