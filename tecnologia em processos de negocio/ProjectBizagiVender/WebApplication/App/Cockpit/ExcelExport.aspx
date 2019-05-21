<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ExcelExport.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.ExcelExport" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.js"></script>
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <input type="hidden" name = "pluginTableData" class= "pluginTableData" />
            <input type="hidden" name = "ReportId" class= "pluginReportId" />
        </div>
    </form>
</body>
</html>
