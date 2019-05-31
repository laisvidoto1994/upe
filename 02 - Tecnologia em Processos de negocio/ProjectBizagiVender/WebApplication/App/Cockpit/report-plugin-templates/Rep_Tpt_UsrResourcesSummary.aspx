<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Rep_Tpt_UsrResourcesSummary.aspx.cs"
    Inherits="BizAgiBPM.App.Cockpit.report_plugin_templates.Rep_Tpt_UsrResourcesSummary" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript">
        function ChartClicked(clickParams) {
            $("<div></div>").BizRep_Onl_Res_WorkInProgress_ChartClick(clickParams);
        }
    </script>
</head>
<body>
    <table class='Analysis_TableFilled' cellspacing="0" cellpadding="4" width='100%'>
        <thead style="display: none">
            <tr>
                <td style="border: #DDDDDD 1px solid; width: 50%;">
                </td>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <td style="border: #DDDDDD 1px solid; width: 50%;">
                    <div class="ReportFooter">
                    </div>
                </td>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td style="border: #DDDDDD 1px solid; width: 100%;">
                    <div id="reportTitleBar" class="reportTitleBar" style="display: none">
                        <div id="lblReportName" class="lblReportName" runat="server">
                        </div>
                    </div>
                    <div id="ReportDataTable" class="ReportData">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td style="width: 50%; text-align: left">
                                <div id="lblExportExcel" class="lblReportDescription" runat="server">
                                    Export this table to excel.</div>
                            </td>
                            <td style="width: 50%; text-align: left">
                                <div id="ReportDataExcel" class="ReportDataExcel" style="float: left">
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="ReportConfig">
    </div>
</body>
</html>
