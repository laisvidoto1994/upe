<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PhaseDefinition.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.PhaseDefinition" %>



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Phase definition</title>
	<LINK href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/Analysis/GraphicReports.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/Analysis/PhaseDefinition.css" type="text/css" rel="stylesheet">
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
		<%WriteHead();%>

	<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
	<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
	<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
	<script language="JavaScript" src="../../js/Analysis/PhaseDefinition.js"></script>

    <script language="javascript" type="text/javascript">
        
    </script>
    
</head>
<body>
    <form id="form1" runat="server">

        <script language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Analytics_Rep_Phases") %>");
		</script>
        <br />
        
        <table style="width:100%; padding:0px; border-spacing:0px;" >
            
            <tr>
                <td id="columnLeftPanel" >
                    <iframe id="iframePhaseList" frameborder="0" src="PhaseList.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
                </td>
                
                <td id="columnRightPanel" style="display:none">
                    <table id="tablePhaseDetail">
                        
                        <!-- View / edit path details  -->
                        <tr> <td>
                             
                             <!-- Edit -->
                             <div id="divDetailEdit" style="display:none">                                                                
                                <table style="width:100%" cellpadding="0" cellspacing="0">
                                    <tr style="height:34px">
                                        <td>
                                            <table class="TableReadOnly_Body" style="width:100%;height:100%;border-bottom:0px" >
                                                <tr>
                                                    <td style="width:80px"><b><asp:Label ID="lblPhaseName" runat="server" Text="Nombre: "></asp:Label>:</b></td>
                                                    <td><asp:TextBox ID="txtPhaseName" runat="server" MaxLength="50" Width="200px"></asp:TextBox></td>
                                                    <td style="width:0px; text-align:right"><UI:CWPHtmlInputButton runat="server" type="button" value="BtnSave" name="btnSave" ID="btnSave" onclick="buttonSave_onclick();" /></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr style="height:34px">
                                        <td>
                                            <table class="TableReadOnly_Body" style="width:100%;height:100%;">
                                                <tr>
                                                    <td style="width:80px"><b><asp:Label ID="lblPhaseDescription" runat="server" Text="Descripción:"></asp:Label>:</b></td>
                                                    <td> <asp:TextBox Width="300px" ID="txtPhaseDescription" runat="server" MaxLength="200"></asp:TextBox></td>
                                                    <td style="text-align:right"><b><asp:Label ID="lblProcess" runat="server" Text="Proceso: "></asp:Label>:</b></td>
                                                    <td style="width:10px;text-align:right" ><asp:DropDownList runat="server" ID="ddlWorkflows" Width="230px"  onchange="WorkflowCombo_Changed();" ></asp:DropDownList></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>    
                                </table>
                             </div>
                             
                             <!-- Show -->
                             <div id="divDetailShow" >
                                <table style="width:100%" cellpadding="0" cellspacing="0">
                                    <tr style="height:34px">
                                        <td >
                                            <table class="TableReadOnly_Body" style="width:100%;height:100%; border-bottom:0px" >
                                                <tr >
                                                    
                                                    <td style="width:100%"><b><asp:Label ID="txtPhaseNameShow" runat="server" Text="XXX" ></asp:Label></b></td>
                                                    <td style="vertical-align:top; "><UI:CWPHtmlInputButton runat="server" type="button" value="BtnEdit" name="btnEdit" ID="btnEdit" onclick="buttonEdit_onclick();" /></td>
                                                    <td style="vertical-align:top; "><UI:CWPHtmlInputButton runat="server" type="button" value="BtnDelete" name="btnDelete" ID="btnDeleteShow" onclick="buttonDelete_onclick();" /></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr style="height:34px">
                                        <td>
                                            <table class="TableReadOnly_Body" style="width:100%;height:100%;">
                                                <tr>
                                                    <td><asp:Label ID="txtPhaseDescriptionShow" runat="server" ></asp:Label></td>                                        
                                                </tr>
                                            </table>
                                        </td>                                           
                                    </tr>
                                </table>
                             </div>
                             
                        </td></tr>
                        
                        <!-- Silverlight view of the selected path -->
                        <tr>
                            <td>
                                <div id="divSilverlight">
                                    <iframe id="iframeSilverlight" frameborder="0" src="SLContainer.aspx" width="100%" height="560" scrolling="no" marginwidth="0" marginheight="0"></iframe>
                                </div>
                            </td>
                        </tr>
                    </table>                
	            </td>
	        </tr>
        </table>

    <input id="hidMsg_FillAllFields" type="hidden" value="xxx" runat="server" />        
    <input id="hidMsg_ConfirmDelete" type="hidden" value="xxx?" runat="server" />        
        
        
    </form>
</body>
</html>
