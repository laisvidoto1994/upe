<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PhaseList.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.PhaseList" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
	<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/Analysis/GraphicReports.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/Analysis/PhaseDefinition.css" type="text/css" rel="stylesheet">
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
		<%WriteHead();%>

	<script language="JavaScript" src="../../js/Analysis/PhaseList.js"></script>
</head>
<body onload="SelectCurrentPhase();">
    <form id="form1" runat="server">
        
        <table style="width:100%;height:100%;padding:0px;border-spacing:0px;overflow:visible">
            <!-- Go to report button -->
            <tr style="height:10px">
                <td >
                    <div class="Analysis_BottomSavePanel" onmouseover="this.className='Analysis_BottomSavePanel_hover';" onmouseout="this.className='Analysis_BottomSavePanel';"  style="width:150px; " onclick= "parent.GoToReport();" >        
                        <table style="width:100%">
                            <tr>
                                <td><asp:image ID="Image1" runat="server" ImageUrl="../../img/analysis/undo.png"></asp:image></td>
                                <td><b><asp:label id="lblGoToReport" runat="server" Text="xxx"/>...</b></td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <tr >
                <td style="vertical-align:top; height:20px;border-bottom: #DDDDDD 1px solid;" >
                    <br />
                    <br />
                    <table  style="width:100px">
                        <tr>
                            <td>
                                <asp:Label ID="lblPhaseListTitle" runat="server" Text="XXXXXX"></asp:Label>
                            </td>
                        </tr>
                    </table>                    
                    
                </td>
            </tr>
            <tr><td height="10px"></td></tr>
            <tr style="vertical-align:top; height:10px">
                <td>
                    <table id="tblPhases" runat="server" style="width:100%;padding:0px;border-spacing:0px"></table>
                </td>
            </tr>
            <tr><td height="30px"></td></tr>
            <tr style="vertical-align:top">
                <td>
                    <UI:CWPHtmlInputButton runat="server" type="button" value="BtnGR_NewPhase" name="BtnGR_NewPhase" ID="BtnGR_NewPhase" onclick="NewPhase();" />    
                </td>
            </tr>
            
        </table>
        
        
</form>
</body>
</html>
