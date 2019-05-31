<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="BAMTask.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.BAMTask" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
  <head>
    <title>Business Activity Monitor</title>

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

	<script type="text/javascript" src="../../js/Analysis/BAMTask.js"></script>
	
  </head>
  <body MS_POSITIONING="FlowLayout">
	
    <form id="Form1" method="post" runat="server">
        <script type="text/javascript" language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("BAM_Rep_Tasks") %>");
		</script>

        <div class="Analysis_NavigationMenuBack">        
            <table style="width:100%">
                <tr>
                    <td id="cellWorkInProgress" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowWorkInProgress();" >
				            <label runat="server" id="lblWorkInProgress" style="cursor:pointer">Trabajo en progreso</label>
		            </td>
                    <td id="cellLoadAnalysis" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowLoadAnalysis();" >
				            <label runat="server" id="lblLoadAnalysis" style="cursor:pointer">Análisis de Carga</label>
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

<%--		<!-- Filter panel-->		
	    <Table  class='Analysis_TableFilled' style="border-bottom-width: 0px;" cellSpacing=0 cellPadding=4 width='100%' border=0 valign='top'>
	        <tr >
	            <!-- Process Filter -->		
	            <td id="divProcessFilterPanel" style="width:160px">
	                <div style="display:inline;">
                        <table cellpadding='2' cellspacing='0' style='width:160px; border:solid 1px #DDDDDD'>
	                        <tr>
	                            <td rowspan='2' style='border-right:solid 1px #DDDDDD; width:18px; background:#E6E9EA'><img  src='../../img/analysis/funnel.png'/></td>
	                            <td> <div style="overflow:hidden;height:16px;"><asp:Label ID="lblWorkflowSelectTitle" runat="server" Text="Process:"></asp:Label></div></td>
	                        </tr>
                            <tr style='background:#E6E9EA'>
	                            <td ><div style="overflow:hidden;height:16px; "><asp:DropDownList runat="server" ID="ddlWorkflows" onchange="ClearSlicerPanel(); ExecuteNewSearch();" ></asp:DropDownList> </div></td>
                            </tr> 
                        </table>
                    </div>
                </td>
                <!-- User Filters -->		
                <td><div id="divSlicers"></div></td>
            </tr>
        </Table>
--%>        

        
			
        <!-- Work in progress panel -->
        <div id="divWorkInProgress" STYLE="DISPLAY:inline;">
            <Table class='Analysis_TableFilled' cellSpacing="0" cellPadding="4" width='100%' valign='top'>
	            <tr>
	                <td>
	                    <table width="100%">
	                        <tr>
	                            <td style="border: #DDDDDD 1px solid;" align="center" valign="top">
	                                <table>
	                                    <tr align="center"><td> <div id= "divChartAccomplishment"></div> </td></tr>	                                    
	                                    <tr>
                                            <td style="text-align:justify">
	                                            <asp:label id="lblTitlePie" runat="server" Text="xxx:" Font-Bold="true"/>
	                                            <asp:label id="lblTextPie" runat="server" Text="xxx"/>
	                                        </td>
	                                    </tr>
	                                </table>
	                            </td>
	                            <td style="border: #DDDDDD 1px solid;" align="center" valign="top">
	                                <table>
	                                    <tr align="center"><td> <div id= "divChartHistogram" ></div> </td></tr>
	                                    <tr>
	                                        <td style="text-align:justify">
	                                            <asp:label id="lblTitleHistogram" runat="server" Text="xxx:" Font-Bold="true" />
	                                            <asp:label id="lblTextHistogram" runat="server" Text="xxx"/>
	                                        </td>
	                                    </tr>
	                                </table>
	                            </td>
	                        </tr>
	                    </table>
	                </td>
	            </tr>
	        </Table>
        </div>

        <!-- Load Analysis Panel -->
        <div id="divLoadAnalysis" STYLE="DISPLAY:none;">
            <iframe id="iframeSilverlight" frameborder="0" src="SLContainer.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        </div>
        
        <div id="divLoadingMessage" style=" text-align:center; width:100%; background:transparent; DISPLAY:none;position:absolute; top:30%; left:0 ">
            <table width="150px" align="center" style="border:solid 1px #BBC0B5; height:70px; text-align:left; background:white">
                <tr><td>Loading charts...</td></tr>
                <tr><td><asp:image id="imgWait" runat="server" ImageUrl="../../img/analysis/loading.gif"></asp:image></td></tr>
            </table>
        </div>

        <br />

        <!-- Parameters when a user query was sent in the querystring -->
        <input type="hidden"    id="hidUserQuerySlicers" runat="server" />
        <!-- Messages -->
        <input type="hidden"    id="hidMsgOK" runat="server" />
        <input type="hidden"    id="hidMsgCancel" runat="server" />
        <input type="hidden"    id="hidMsgClose" runat="server" />

     </form>
  </body>
</html>
