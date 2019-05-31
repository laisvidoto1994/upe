<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SensorEdit.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.SensorEdit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>

    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css"/>
    <link href="../../css/Analysis/jquery/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/SensorEdit.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <!--Predefined behavior-->
		<%WriteHead();%>

    <!--jQuery scripts -->
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.metadata.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.iframe.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.js"></script>    
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.selectmenu.js"></script>  
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.layout.js"></script>    

    <script language="javascript" type="text/javascript" src="../../js/Analysis/SensorEdit.js"></script>    

</head>
<body>
    
    <div id="panelCommands" >
        <div class="Analysis_BackToReports_Button " onclick= "BackToReports();" ><asp:label id="lblBackToReports" runat="server" Text="xBack to reports"/></div>
    </div>
    
    <div id="panelMain">
    
        <div id="panelLeft"  class="ui-layout-west">        
            
            <div id="divSensorsMenu">
                
                <div id="divSensormenuTitle" class="ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblSensorMenuTitle" Font-Bold="true" runat="server" Text="xSensors"></asp:Label></div>
                
                <div id="divlblProcess"><asp:label id="lblProcess" runat="server" Text="xProcess:"/></div>
                
                <div id="divProcessSelect">
                        <select id="cmbWorkflows"></select>
                </div>
                
                <div id="divSensorList">
                    <fieldset class="ui-widget ui-widget-content ui-corner-all">
                        <legend ><asp:Label ID="lblSensorListTitle" runat="server" Text="Process sensors"></asp:Label></legend>
                        <ul></ul>
                    </fieldset>
                </div>
                
                <div id="divNewSensorButtons">                
                    <input type="button" runat="server" id="btnNewStopwatch" value= "xNew Stopwatch" />
                    <input type="button" runat="server" id="btnNewCounter" value= "xNew Counter" />
                </div> 
            </div>
            
            
            
                
            <!-- Stopwatch read -->
            <div id="panelStopwatchRead" class="panelSensorProperties">
                <div class="sensorPropertiesTitle ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblStopwatchReadTitle" Font-Bold="true" runat="server" Text="xStopwatch properties"></asp:Label></div>
                <table class="sensorPropertiesTable">
                    <tr><th><asp:Label ID="lblStopwatchRead_Name" runat="server" Text="xName"></asp:Label></th><td><div id="txtStopwatchRead_Name"></div></td></tr>
                    <tr><th><asp:Label ID="lblStopwatchRead_DisplayName" runat="server" Text="xDisplay Name"></asp:Label></th><td><div id="txtStopwatchRead_DisplayName"></div></td></tr>
                    <tr><th><asp:Label ID="lblStopwatchRead_Description" runat="server" Text="xDescription"></asp:Label></th><td><textarea cols="0" id="txtStopwatchRead_Description" rows="3" style="border:none" readonly="readonly"></textarea> </td></tr>
                    <tr><th><asp:Label ID="lblStopwatchRead_SLA" runat="server" Text="xSLA"></asp:Label></th><td><div id="txtStopwatchRead_SLA"></div></td></tr>
                </table>
                
                <div class="sensorPropertiesButtons">                
                    <input type="button" runat="server" id="btnEditStopwatch" value= "xEdit" />
                    <input type="button" runat="server" id="btnDeleteStopwatch" value= "xDelete" />
                </div> 
                
            </div>
            
            
            
            <!-- Stopwatch edit -->
            <div id="panelStopwatchEdit" class="panelSensorProperties">
                <div class="sensorPropertiesTitle ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblStopwatchEditTitle" Font-Bold="true" runat="server" Text="xStopwatch properties"></asp:Label></div>
                <table class="sensorPropertiesTable">
                    <tr><th><asp:Label ID="lblStopwatchEdit_Name" runat="server" Text="xName"></asp:Label></th><td><input type="text" runat="server" id="txtStopwatchEdit_Name" maxlength="50"/></td></tr>
                    <tr><th><asp:Label ID="lblStopwatchEdit_DisplayName" runat="server" Text="xDisplay Name"></asp:Label></th><td><input type="text" runat="server" id="txtStopwatchEdit_DisplayName" maxlength="50"/></td></tr>
                    <tr><th><asp:Label ID="lblStopwatchEdit_Description" runat="server" Text="xDescription"></asp:Label></th><td><textarea cols="0" id="txtStopwatchEdit_Description" rows="3" maxlength="200"></textarea></td></tr>
                    <tr><th><asp:Label ID="lblStopwatchEdit_SLA" runat="server" Text="xSLA"></asp:Label></th>
                        <td>
                            <!--Duration edit table -->
                            <table class="durationTable">
                                <tr>
                                    <td><input id="txtStopwatchEdit_SLA_Days" type="text" class="daysInput" /></td><td>d , </td>
                                    <td><input id="txtStopwatchEdit_SLA_Hours" type="text" class="hoursInput"/></td><td>h , </td>
                                    <td><input id="txtStopwatchEdit_SLA_Minutes" type="text" class="minutesInput"/></td><td>m  </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div class="sensorPropertiesButtons">                
                    <input type="button" runat="server" id="btnCancelEditStopwatch" value= "xCancel" />
                    <input type="button" runat="server" id="btnSaveStopwatch" value= "xSave" />
                </div> 

            </div>



            <!-- Counter read -->
            <div id="panelCounterRead" class="panelSensorProperties">
                <div class="sensorPropertiesTitle ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblCounterReadTitle" Font-Bold="true" runat="server" Text="xCounter properties"></asp:Label></div>
                <table class="sensorPropertiesTable">
                    <tr><th><asp:Label ID="lblCounterRead_Name" runat="server" Text="xName"></asp:Label></th><td><div id="txtCounterRead_Name"></div></td></tr>
                    <tr><th><asp:Label ID="lblCounterRead_DisplayName" runat="server" Text="xDisplay Name"></asp:Label></th><td><div id="txtCounterRead_DisplayName"></div></td></tr>
                    <tr><th><asp:Label ID="lblCounterRead_Description" runat="server" Text="xDescription"></asp:Label></th><td><textarea cols="0" id="txtCounterRead_Description" rows="3" style="border:none" readonly="readonly"></textarea></td></tr>
                </table>

                <div class="sensorPropertiesButtons">                
                    <input type="button" runat="server" id="btnEditCounter" value= "xEdit" />
                    <input type="button" runat="server" id="btnDeleteCounter" value= "xDelete" />
                </div> 
            </div>




            <!-- Counter edit -->
            <div id="panelCounterEdit" class="panelSensorProperties">
                <div class="sensorPropertiesTitle ui-widget ui-widget-header ui-corner-all"><asp:Label ID="lblCounterEditTitle" Font-Bold="true" runat="server" Text="xCounter properties"></asp:Label></div>
                <table class="sensorPropertiesTable">
                    <tr><th><asp:Label ID="lblCounterEdit_Name" runat="server" Text="xName"></asp:Label></th><td><input type="text" runat="server" id="txtCounterEdit_Name" maxlength="50"/></td></tr>
                    <tr><th><asp:Label ID="lblCounterEdit_DisplayName" runat="server" Text="xDisplay Name"></asp:Label></th><td><input type="text" runat="server" id="txtCounterEdit_DisplayName" maxlength="50"/></td></tr>
                    <tr><th><asp:Label ID="lblCounterEdit_Description" runat="server" Text="xDescription"></asp:Label></th><td><textarea cols="0" id="txtCounterEdit_Description" rows="3" maxlength="200"></textarea></td></tr>
                </table>

                <div class="sensorPropertiesButtons">                
                    <input type="button" runat="server" id="btnCancelEditCounter" value= "xCancel" />
                    <input type="button" runat="server" id="btnSaveCounter" value= "xSave" />
                </div> 

            </div>

        </div>
        
        <div id= "panelRight" class="ui-layout-center">
            <iframe id="iframeSilverlight" frameborder="0" src="SLContainer.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
        </div>

    </div>
    
    <!-- JSON Sensor model -->
    <input type="hidden"    id="hidSensorModel" value = "[]" runat="server" />

    <input type="hidden"    id="hidHoursDay" runat="server" />
    <input type="hidden"    id="hidMsgConfirmDelete" value = "xSure you want to delete this sensor?" runat="server" />
    <input type="hidden"    id="hidMsgMustSelectStopwatchLimits" value = "xPlease select stopwatch task limits on the diagram" runat="server" />
    <input type="hidden"    id="hidMsgMustSelectCounterTask" value = "xPlease select counter task on the diagram" runat="server" />
    <input type="hidden"    id="hidMsgMustEnterNameAndDisplayName" value = "xPlease type a name and a display name for this sensor" runat="server" />
    
        
</body>
</html>
