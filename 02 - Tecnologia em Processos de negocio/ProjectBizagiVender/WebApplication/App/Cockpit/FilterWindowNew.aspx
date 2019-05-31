<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FilterWindowNew.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.FilterWindowNew" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.tokenList.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.tree.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.custominput.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <link href="../../css/Analysis/jquery.bizagi.analysis.reportFilter.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/FiltroReporte.css" rel="stylesheet" type="text/css" />
    
    <script type="text/javascript" src="../../js/Analysis/json2.js"></script>    
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.js"></script>    
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.js"></script>    
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.selectmenu.js"></script>  
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.tokenList.js"></script>  
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.tree.js"></script>  
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.custominput.js"></script>  
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery.bizagi.analysis.reportFilter.js"></script>



</head>
<body>
    <form id="form1" runat="server">
        <div class="ui-analysis-report-filter-detail">
            
            <input id="ui-analysis-report-filter-detail-values" type="hidden" value="" />
            
            <div class="ui-analysis-report-filter-detail-header">
                <label><asp:Label ID="lblDimension" Font-Bold="true" runat="server" Text="xxxDimension">:</asp:Label></label>
                <div>
                    <asp:DropDownList CssClass="ui-analysis-report-filter-detail-selectDimension" ID="cbDimension" runat="server"></asp:DropDownList>
                </div>                
            </div>
            
            <div class="dimensionDescription ui-widget ui-state-default ">
                <img alt="" src="../../img/analysis/information2.png"/><label> La descripcion </label>
            </div>
            
            <fieldset class="ui-analysis-report-filter-detail-content ui-widget ui-widget-content ui-corner-all">
                <legend class="ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblFilter" Font-Bold="true" runat="server" Text="Filtro"></asp:Label></legend>
                <div class="ui-analysis-report-filter-detail-content-spacer"></div>
                <div class="ui-analysis-report-filter-detail-tabs">
                    <ul>
                        <li><a href="#ui-analysis-report-filter-detail-tab-search"><asp:Label ID="lblSearch" Font-Bold="true" runat="server" Text="xxxSearch"></asp:Label></a></li>
                        <li><a href="#ui-analysis-report-filter-detail-tab-tree"><asp:Label ID="lblList" Font-Bold="true" runat="server" Text="xxxList"></asp:Label></a></li>
                    </ul>

                    <div id="ui-analysis-report-filter-detail-tab-search" class="ui-analysis-report-filter-detail-tab">
                        <div class="ui-analysis-report-filter-detail-content-label">
                            <asp:Label ID="lblHintSearch" Font-Bold="true" runat="server" Text="Escriba los valores de la dimensi&oacute;n para seleccionarlas"></asp:Label>                            
                        </div>
                        <div class="ui-analysis-report-filter-detail-multiSearch"></div>
                    </div>
                    <div id="ui-analysis-report-filter-detail-tab-tree" class="ui-analysis-report-filter-detail-tab">
                        <div class="ui-analysis-report-filter-detail-content-label">
                            <asp:Label ID="lblHintSelect" Font-Bold="true" runat="server" Text="Seleccione los valores deseados o expanda los nodos del arbol"></asp:Label>                                                        
                        </div>
                        <div class="ui-analysis-report-filter-detail-multiTree"></div>
                    </div>
                </div>
                <div class="ui-analysis-report-filter-detail-footer">
                    <div>
                        <input type="checkbox" id="ui-analysis-report-filter-detail-noneCheckbox" />                        
                        <label runat="server" for="ui-analysis-report-filter-detail-noneCheckbox"><asp:Label ID="lblNone" Font-Bold="true" runat="server" Text="xxxDimension">Ninguno</asp:Label></label>
                    </div>                  
                </div>
            </fieldset>
        </div>
		<input runat="server" type="hidden" id="hidReportSetId" />
    </form>
</body>
</html>
