<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="AnalyticsProcess.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.AnalyticsProcess" %>
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

	<script type="text/javascript" src="../../js/Analysis/AnalyticsProcess.js"></script>
	
  </head>
  <body MS_POSITIONING="FlowLayout">
	
    <form id="Form1" method="post" runat="server">
        <script language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Analytics_Rep_ProcessInstances") %>");
		</script>

        <div class="Analysis_NavigationMenuBack">        
            <table style="width:100%">
                <tr>
                    <td id="cellCycleTime" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowCycleTime();" >
				            <label runat="server" id="lblCycleTime" style="cursor:pointer">Tiempo de Ciclo</label>
                    </td>
                    <td id="cellDurationHistogram" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowProcessDurationHistogram();" >
				            <label runat="server" id="lblDurationHistogram" style="cursor:pointer">Histograma de duraciones</label>
		            </td>
                    <td id="cellProcessActivity" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowProcessActivity();" >
				            <label runat="server" id="lblProcessActivity" style="cursor:pointer">Actividad de Proceso</label>
		            </td>
                    <td id="cellActivityRanking" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowProcessActivityRanking();" >
				            <label runat="server" id="lblActivityRanking" style="cursor:pointer">Ranking de Actividad de Proceso</label>
		            </td>
                    <td id="cellPathAnalysis" class="Analysis_NavigationMenuItem" onmouseover="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem_hover';" onmouseout="if(this.className!='Analysis_NavigationMenuItem_Selected') this.className='Analysis_NavigationMenuItem';" onclick="ShowPathAnalysis();" >
				            <label runat="server" id="lblPathAnalysis" style="cursor:pointer">xxRutas criticas</label>
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
                   <asp:DropDownList runat="server" ID="ddlWorkflows" onchange="ClearSlicerPanel(); FillVersionCombo(); ExecuteNewSearch();" ></asp:DropDownList>                                            
                </div>
                
                <div class="divProcessFilter_WfVersion">
                    <asp:Label CssClass="processFilterText" ID="lblWFVersion" runat="server" Text="Version:"></asp:Label>
                    <asp:DropDownList Width="70" runat="server" ID="ddlWfVersions" onchange="ExecuteNewSearch();" ></asp:DropDownList>
                </div>
                
            </div>                      
        
            <!-- User filters -->	
            <div id="divSlicers"></div>
            
        </div>


        <!-- Cycle Time Panel -->
        <div id="divCycleTime" STYLE="DISPLAY:none;">
            <Table class='Analysis_TableFilled' cellSpacing="0" cellPadding="4" width='100%'  valign='top'>
	            
	            <!-- Basic CycleTime data -->
	            <tr>
	                <td>
	                    <table width="100%">
	                        <tr >
	                            <td style="border: #DDDDDD 1px solid; width:25%; text-align:center; " > 
                                    <div id="divCycleTSummary" style="text-align:center;padding:10px"> </div> 
	                            </td>
	                            <td style="border: #DDDDDD 1px solid;width:40%" align="center" valign="top" > 
	                                <table border="0" cellpadding="5" cellspacing="0">
	                                    <tr><td style="text-align:center"><div id="divChartDuration"> </div></td></tr> 
	                                    <tr>
	                                        <td style="text-align:justify;">
                                                <asp:label id="lblTitleDurations" runat="server" Text="xxx:" Font-Bold="true" />
                                                <asp:label id="lblTextDurations" runat="server" Text="xxx"/>
	                                        </td>
	                                    </tr>
	                                </table>
	                            </td>
	                            <td style="border: #DDDDDD 1px solid;width:35%;" align="center" valign="top" > 
	                                <table border="0" cellpadding="5" cellspacing="0">
	                                    <tr><td style="text-align:center"><div id="divChartAccomplishment"> </div></td></tr>
	                                    <tr>
	                                        <td style="text-align:justify">
	                                            <asp:label id="lblTitleAccompPie" runat="server" Text="xxx:" Font-Bold="true"/>
	                                            <asp:label id="lblTextAccompPie" runat="server" Text="xxx"/>
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

        <!-- Duration Histogram panel-->
        <div id="divDurationHistogram" STYLE="DISPLAY:none;">
            <Table class='Analysis_TableFilled' cellSpacing=0 cellPadding=4 width='100%' border=0 valign='top'>
	            <!-- Histogram -->
	            <tr>
	                <td>
	                    <table width="50%">
	                        <tr>
	                            <td><div id= "divChartHistogram" ></div></td>
	                        </tr>
	                        <tr>
	                            <td valign="top">
	                                <asp:label id="lblTitleHistogram" runat="server" Text="xxx:" Font-Bold="true" />
	                                <asp:label id="lblTextHistogram" runat="server" Text="xxx"/>
	                            </td>
	                        </tr>
	                    </table>
	                </td>
	            </tr>
            </Table>
        </div>

        <!-- Process activity Panel-->
        <div id="divProcessActivity" STYLE="DISPLAY:none;">
            <Table class='Analysis_TableFilled' cellSpacing=0 cellPadding=4 width='100%' border=0 valign='top'>
                <tr>
                    <td>
                        <table width="100%">
                            <tr>

                                <td style="border: #DDDDDD 1px solid;width:25%; text-align:center"><div id= "divActivitySummary" style="text-align:center;padding:10px"></div></td>
                                <td style="border: #DDDDDD 1px solid;width:30%;text-align:center;"  align="center" valign="top">
                                	<table border="0" cellpadding="5" cellspacing="0">
                                	    <tr><td style="text-align:center">
                                	        <div id= "divChartActivity" ></div></td></tr>                                           
	                                    <tr>
	                                        <td style="text-align:justify;">                                            
                                                <asp:label id="lblTitlePActivity" runat="server" Text="xxx:" Font-Bold="true" />
                                                <asp:label id="lblTextPActivity" runat="server" Text="xxx"/>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td style="border: #DDDDDD 1px solid;width:45%;text-align:center" align="center" valign="top">
                                	<table border="0" cellpadding="5" cellspacing="0">
                                	    <tr><td style="text-align:center"><div id= "divChartTrend" ></div></td></tr>                                        
                                        <tr>
                                            <td style="text-align:justify">                                            
                                                <asp:label id="lblTitleOpenTrend" runat="server" Text="xxx:" Font-Bold="true" />
                                                <asp:label id="lblTextOpenTrend" runat="server" Text="xxx"/>
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

        <!-- Process activity ranking panel -->
        <div id="divActivityRanking" STYLE="DISPLAY:none;">
            <Table class='Analysis_TableFilled'  cellSpacing=0 cellPadding=4 width='100%' border=0 valign='top'>
                <tr>
                    <td >
                        <div id= "divChartOpenRank"></div>
                        <asp:label id="lblTitleOpenRank" runat="server" Text="xxx:" Font-Bold="true" />
                        <asp:label id="lblTextOpenRank" runat="server" Text="xxx"/>
                    </td>
                </tr>
            </Table>
        
        </div>

        <!-- Path Analysis panel -->
        <div id="divPathAnalysis" STYLE="DISPLAY:none;">
            <iframe id="iframeSilverlight" style="z-index:0" frameborder="0" src="SLContainer.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        </div>
        
        
        
        <!-- Start: Time filter -->
        <iframe id="iframeTimeFilter" style="z-index:0;overflow:hidden " frameborder="0" src="TimeFilterPanel.aspx" width="100%" height="200px" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        <input type="hidden"    id="hidFixedDateRange" runat="server" />
        <!-- End: Time filter -->


        <div id="divLoadingMessage" style="text-align:center; width:100%; background:transparent; position:absolute; top:30%; left:0 ">
            <table width="150px" align="center" style="border:solid 1px #BBC0B5; height:70px; text-align:left; background:white" align="center">
                <tr><td>Loading charts...</td></tr>
                <tr><td><asp:image id="imgWait" runat="server" ImageUrl="../../img/analysis/loading.gif"></asp:image></td></tr>
            </table>
        </div>

        <!-- Parameters when a user query was sent in the querystring -->
        <input type="hidden"    id="hidUserQuerySlicers" runat="server" />
        
        <!-- Messages -->
        <input type="hidden"    id="hidMsgOK" runat="server" />
        <input type="hidden"    id="hidMsgCancel" runat="server" />
        <input type="hidden"    id="hidMsgClose" runat="server" />
        <input type="hidden"  id="HidWfVersions" runat="server" />

     </form>
     

  </body>
</html>
