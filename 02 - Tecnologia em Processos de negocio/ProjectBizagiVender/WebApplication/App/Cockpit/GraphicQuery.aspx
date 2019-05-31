<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GraphicQuery.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.GraphicQuery" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <script language="javascript" type="text/javascript">
        
        function SLDiagramNotifyLoaded(){
            try{
                ShowGraphicQuery();
            }
            catch(ex){
                window.alert("Error:\n" + ex.message);
            }
        }
        
        function SLDiagramNotifyChange(params) {
        }
        

        function SLCloseWindow(){
            window.close();
        }
        
        function ShowGraphicQuery() {        

	        var workflowId  = document.getElementById("txtWorkflowId").value;
	        var caseId      = document.getElementById("txtCaseId").value;

            var slFrame     = document.getElementById("iframeSilverlight");
            slFrame.contentWindow.ConfigureForTrail(workflowId, caseId);
        }
        
        
    </script>
</head>
<body >
    <form id="form1" runat="server">
    <div id = "divSl" >
        <iframe id="iframeSilverlight" style="width:100%; height:100%;"  frameborder="0" src="SLContainer.aspx" scrolling="no" marginwidth="0" marginheight="0"></iframe>
    </div>
    
    
        
    <input type="hidden" id="txtCaseId" value="<%=this.CaseId%>"/>    
    <input type="hidden" id="txtWorkflowId" value="<%=this.WorkflowId%>" />
    </form>
</body>
</html>
