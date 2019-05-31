<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Rep_Tpt_UsrResourcesByUserSummary.aspx.cs"
    Inherits="BizAgiBPM.App.Cockpit.report_plugin_templates.Rep_Tpt_UsrResourcesByUserSummary" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript">
        function ChartClicked(clickParams) {
            $("<div></div>").BizRep_Onl_Res_WorkInProgressByUser_ChartClick(clickParams);
        }
    </script>
</head>
<body>
    <div id="reportTitleBar" class="reportTitleBar">
        <div id="lblReportName" class="lblReportName" runat="server">
        </div>
        
    </div>
    

    <div id="ReportDataTable" class="ReportData">
    </div>
    <table>
        <tr>
            <td style="width: 50%; text-align: left"  >
                <div id="lblExportExcel" class="lblReportDescription" runat="server">Export this table to excel.</div>
            </td>   
            <td style="width: 50%; text-align: left" >
                <div id="ReportDataExcel" class="ReportDataExcel" style="float: left"></div>
            </td>
        </tr>
    </table>
    
    <div class="ReportConfig">
    </div>
</body>
</html>
