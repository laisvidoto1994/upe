<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AdminProcess.aspx.cs" Inherits="BizAgiBPM.App.Admin.AdminProcess" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Untitled Page</title>

    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" rel="stylesheet" type="text/css"/>
    <link href="../../css/Admin/AdminProcess.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Analysis/jquery/jquery.ui.selectmenu.css" rel="stylesheet" type="text/css" />

    <!--Predefined behavior-->
		<%WriteHead();%>

    <script language="javascript" type="text/javascript" src= "../../js/Analysis/jquery/jquery.js"></script>
    <script language="javascript" type="text/javascript" src= "../../js/Analysis/jquery/jquery-ui.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery.ui.selectmenu.js"></script>  
    <script language="javascript" type="text/javascript" src="../../js/Analysis/json2.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/AdminProcess.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    
        <script type="text/javascript" language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("AdminProcesses") %>");
		</script>

        <div class="diagramPanel">
            
            <fieldset class=" ui-widget ui-widget-content ui-corner-all">

                <div class="diagramTitle ui-widget ui-widget-header">
                    <asp:Label ID="lblWorkflowSelectTitle" runat="server" Text="Process:"></asp:Label>
                    <asp:DropDownList runat="server" ID="ProcessCombo" class ="ProcessCombo"></asp:DropDownList>
                </div>
                <div>
                    <iframe id="iframeSilverlight" frameborder="0" src="../cockpit/SLContainer.aspx" width="100%" scrolling="no" marginwidth="0" marginheight="0"></iframe>
                </div>
            
            </fieldset>
            
        </div>
        
        
        <table class="propertiesContainerTable">
        <tr>
            <td style="width:50%">
                <div class="processValuesPanel"> 
                    <!-- Process read -->
                    <div id="processPropertiesRead">
                        <fieldset class="ui-widget ui-widget-content ui-corner-all">
                            
                            <!--Title-->
                            <div class="propertiesTitle ui-widget ui-widget-header ">
                                <asp:Label ID="lblProcessPropertiesRead" runat="server" Text="Proceso"></asp:Label>
                            </div>

                            <!--Props table -->
                            <table class = "propertiesTable">                                               
                                <tr>
                                    <th><asp:Label ID="lblProcessNameRead" runat="server" Text="Nombre"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtProcessNameRead">Nombre del proceso</div></td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblProcessDescriptionRead" runat="server" Text="Description"></asp:Label></th>                          
                                    <td colspan="2"><div id="txtProcessDescriptionRead"> 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789</div></td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblProcessDurationRead" runat="server" Text="SLA"></asp:Label></th> 
                                    <td><div id="txtProcessDurationRead">xx d / xx h / xx m</div></td>
                                    <td>
                                        <!-- Buttons -->
                                        <div class="propertiesFooter">
                                            <input runat= "server" type= "button" id="btnProcessEdit" value= "Editar" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            
                            


                        </fieldset>                
                    </div>
                    
                    
                    <!-- Process edit -->
                    <div id="processPropertiesEdit" style="display:none">
                        <fieldset class="ui-widget ui-widget-content ui-corner-all">
                        
                            <!--Title-->
                            <div class="propertiesTitle ui-widget ui-widget-header ">
                                <asp:Label ID="lblProcessPropertiesEdit" runat="server" Text="Proceso"></asp:Label>
                            </div>
                            
                            <!--Props table -->
                            <table class = "propertiesTable">                                               
                                <tr>
                                    <th><asp:Label ID="lblProcessNameEdit" runat="server" Text="Nombre"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtProcessNameEdit">Nombre del Proceso</div> </td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblProcessDescriptionEdit" runat="server" Text="Descripción"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtProcessDescriptionEdit">xxxxxxxwwwwwwwwwwwwwww</div> </td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblProcessDurationEdit" runat="server" Text="SLA"></asp:Label></th>          
                                    <td>
                                        <!--Duration table -->
                                        <table class="durationTable">
                                            <tr>
                                                <td><input id="txtProcessDurationEditDays" type="text" class="daysInput" /></td><td>d , </td>
                                                <td><input id="txtProcessDurationEditHours" type="text" class="hoursInput"/></td><td>h , </td>
                                                <td><input id="txtProcessDurationEditMinutes" type="text" class="minutesInput"/></td><td>m  </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td>
                                        <!-- Buttons -->
                                        <div class="propertiesFooter">
                                            <input runat="server" type="button" id="btnProcessApply" value= "Aplicar" />
                                            <input runat="server" type="button" id="btnProcessCancel" value= "Cancelar" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            

                        </fieldset>                
                    </div>
                </div>

            </td>
            <td style="width:50%">                
                <div class="taskValuesPanel" >
    
                    <!-- Task read -->
                    <div id="taskPropertiesRead">
                        <fieldset class="ui-widget ui-widget-content ui-corner-all">
                            
                            <!--Title-->
                            <div class="propertiesTitle ui-widget ui-widget-header ">
                                <asp:Label ID="lblTaskPropertiesRead" runat="server" Text="Tarea"></asp:Label>
                            </div>

                            <!--Props table -->
                            <table class = "propertiesTable">                                               
                                <tr>
                                    <th><asp:Label ID="lblTaskNameRead" runat="server" Text="Nombre"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtTaskNameRead">Nombre de la tarea</div></td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblTaskDescriptionRead" runat="server" Text="Descripción"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtTaskDescriptionRead">xxxxxxxwwwwwwwwwwwwwww</div> </td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblTaskDurationRead" runat="server" Text="SLA"></asp:Label></th>          
                                    <td colspan="2"><div id="txtTaskDurationRead">0d / 5h /30m</div></td>
                                    <td>
                                        <!-- Buttons -->
                                        <div class="propertiesFooter">
                                            <input runat= "server" type= "button" id="btnTaskEdit" value= "Editar" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>                
                    </div>
                    
                    
                    <!-- Task edit -->
                    <div id="taskPropertiesEdit" style="display:none">
                        <fieldset class="ui-widget ui-widget-content ui-corner-all">
                        
                            <!--Title-->
                            <div class="propertiesTitle ui-widget ui-widget-header ">
                                <asp:Label ID="lblTaskPropertiesEdit" runat="server" Text="Tarea"></asp:Label>
                            </div>
                            
                            <!--Props table -->
                            <table class = "propertiesTable">                                               
                                <tr>
                                    <th><asp:Label ID="lblTaskNameEdit" runat="server" Text="Nombre"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtTaskNameEdit">Nombre de la tarea</div> </td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblTaskDescriptionEdit" runat="server" Text="Descripción"></asp:Label></th>                  
                                    <td colspan="2"><div id="txtTaskDescriptionEdit">xxxxxxxwwwwwwwwwwwwwww</div> </td>
                                </tr>
                                <tr>
                                    <th><asp:Label ID="lblTaskDurationEdit" runat="server" Text="SLA"></asp:Label></th>          
                                    <td colspan="2">
                                        <!--Duration table -->
                                        <table class="durationTable">
                                            <tr>
                                                <td><input id="txtTaskDurationEditDays" type="text" class="daysInput" /></td><td>d , </td>
                                                <td><input id="txtTaskDurationEditHours" type="text" class="hoursInput" /></td><td>h , </td>
                                                <td><input id="txtTaskDurationEditMinutes" type="text" class="minutesInput" /></td><td>m  </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td >
                                        <!-- Buttons -->
                                        <div class="propertiesFooter">
                                            <input runat="server" type="button" id="btnTaskApply" value= "Aplicar" />
                                            <input runat="server" type="button" id="btnTaskCancel" value= "Cancelar" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            

                        </fieldset>                
                    </div>
                </div>

            </td>

        </tr>
        </table>
        <input runat="server" type="hidden" id="hidHoursDay" />
        <input runat="server" type="hidden" id="hidMinutesDay" />
    
    </form>
</body>
</html>
