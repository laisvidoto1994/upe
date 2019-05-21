<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="AnalyticsTask.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.AnalyticsTask" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <title>Analytics Task</title>

	<%WriteHead();%>
    
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css" />
	<link href="../../css/Analysis/GraphicReports.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/panelFiltroReportes.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>

	<script type="text/javascript" src="../../js/FusionCharts.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.js"></script>    
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.js"></script>    
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.iframe.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.selectmenu.js"></script>  
    <script type="text/javascript" src="../../js/Analysis/json2.js"></script>
	<script type="text/javascript" src="../../js/Analysis/Reports.js"></script>
    <script type="text/javascript" src="../../js/Analysis/panelFiltroReportes.js"></script>
	<script type="text/javascript" src="../../js/Analysis/SlicerPanel.js"></script>

	<script type="text/javascript" src="../../js/Analysis/AnalyticsTask.js"></script>

  </head>
  <body MS_POSITIONING="FlowLayout" >
	
    <form id="Form1" method="post" runat="server">
        <script language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Analytics_Rep_Tasks") %>");
		</script>

        <div class="Analysis_NavigationMenuBack" >
            <table style="width:100%">
                <tr>
                    <td id="cellCycleTime" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowCycleTime();" >
				            <label runat="server" id="lblCycleTime" style="cursor:pointer">Tiempo de Ciclo</label>
                    </td>
                    <td></td>
                    <td style="text-align:right; width:0px">
                        <asp:PlaceHolder runat="server" ID="phButtonSave">
                            <div class="Analysis_BottomSavePanel" onmouseover="this.className='Analysis_BottomSavePanel_hover';" onmouseout="this.className='Analysis_BottomSavePanel';"  style="width:150px; " onclick= "SaveQuery();" >        
                                <table style="width:100%">
                                    <tr>
                                        <td><asp:image id="Image1" runat="server" ImageUrl="../../img/analysis/save_as.png"></asp:image></td>
                                        <td><b><asp:label id="lblSaveQuery" runat="server" Text="xxx"/>...</b></td>
                                    </tr>
                                </table>
                            </div>
                        </asp:PlaceHolder>
                    </td>
		        </tr>
            </table>
        </div><br />		

		<!-- Filter panel-->	
        <div id="panelFilters">
        
		    <!-- Process filter -->	
            <div id="divProcessFilterPanel" >
            
                <div class="divProcessFilterIcon">
                    <img src="../../img/analysis/funnel.png" />
                </div>    
                
                <div class="divProcessFilter_WfClass">
                   <asp:Label CssClass="processFilterText" ID="lblWorkflowSelectTitle" runat="server" Text="Process:"></asp:Label>
                   <asp:DropDownList runat="server" ID="ddlWorkflows" onchange="ClearSlicerPanel(); ExecuteNewSearch();" ></asp:DropDownList>                                            
                </div>

            </div>                      
        
            <!-- User filters -->	
            <div id="divSlicers"></div>
            
        </div>
        			

        <!-- Cycle Time Panel -->
        <div id="divCycleTime" STYLE="DISPLAY:none; ">
            <iframe id="iframeSilverlight" style="z-index:0" frameborder="0" src="SLContainer.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        </div>
                    

        <br/>
        <!-- Start: Time filter -->
        <iframe id="iframeTimeFilter" style="z-index:0;overflow:hidden" frameborder="0" src="TimeFilterPanel.aspx" width="100%" height="200px" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        <input type="hidden"    id="hidFixedDateRange" runat="server" />
        <!-- End: Time filter -->

        <!-- Parameters when a user query was sent in the querystring -->
        <input type="hidden"    id="hidUserQuerySlicers" runat="server" />
        <!-- Messages -->
        <input type="hidden"    id="hidMsgOK" runat="server" />
        <input type="hidden"    id="hidMsgCancel" runat="server" />
        <input type="hidden"    id="hidMsgClose" runat="server" />

     </form>
     


  </body>
</html>
