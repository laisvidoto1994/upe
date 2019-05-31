<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DimensionEdit.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.DimensionEdit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Dimension Edit</title>
    
    <link href="../../css/Analysis/jquery/jquery.ui.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" rel="stylesheet" type="text/css"/>
    <link href="../../css/Analysis/DimensionEdit.css" rel="stylesheet" type="text/css" /> 
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
       
    <%WriteHead();%>

	<script type="text/javascript" language="JavaScript" src="../../js/Analysis/jquery/jquery.js"></script>
	<script type="text/javascript" language="JavaScript" src="../../js/Analysis/jquery/jquery-ui.js"></script>
    <script type="text/javascript" language="JavaScript" src="../../js/Analysis/jquery/jquery.iframe.js"></script>
	<script type="text/javascript" language="JavaScript" src="../../js/Analysis/Reports.js"></script>
	<script type="text/javascript" language="JavaScript" src="../../js/Analysis/EditDimensions.js"></script>

</head>
<body>
    <form id="form1" runat="server">
        
        
        <script language="javascript">
			BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GRAdminDim_DimensionAdmin") %>");
		</script>

        <!-- Left panel: dimension list -->
        
        <div id= "divLeftPanel" class="ui-layout-west">
            <div id="mainLeftContainer">

                <fieldset class="ui-widget ui-widget-content ui-corner-all">
                    <div class="titleDimensionType"><asp:Label ID="lblFixedDimensions" runat="server" Text="***Fixed Dimensions***"></asp:Label></div>
                    <table class = "dimensionTypeTable">
                        <tr>
                            <td>
                                <div id="divFixedDimensionList" class="divDimensionGroup">
                                    <table >
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                </fieldset>

                <br />
                    
                <fieldset class="ui-widget ui-widget-content ui-corner-all">
                    <div class="titleDimensionType"><asp:Label ID="lblAdministrableDimensions" runat="server" Text="***Administrable Dimensions***"></asp:Label></div>
                    <table class = "dimensionTypeTable">    
                        <tr>
                            <td>
                                <div id="divUserDimensionList" class="divDimensionGroup">
                                    <table >
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="button" runat="server" id="btnNewDimension" value= "New Dimension..." /></td>
                        </tr>
                    </table>
                </fieldset>
            </div>
        </div>
        
        
        
        <!-- Right panel: dimension edit/show -->

        <div id="divRightPanel" class="ui-layout-center" >
                
                <div id="divDimensionReadPanel" class="dimensionPropsPanel" style="display:none">                
                    <fieldset class="ui-widget ui-widget-content ui-corner-all">

                        <div class="titleDimensionReadProperties ui-widget ui-widget-header ui-corner-all">
                            <asp:Label ID="lblDimPropertiesRead" runat="server" Text="***Dimension Properties***"></asp:Label>
                        </div>
                        <table class = "dimensionPropertiesTable">                           
                            
                            <tr><th><asp:Label ID="lblNameRead" runat="server" Text="***Name***"></asp:Label></th>                  <td><div id="txtNameRead">xxxxxxx</div></td></tr>
                            <tr><th><asp:Label ID="lblDisplayNameRead" runat="server" Text="***Display Name***"></asp:Label></th>   <td><div id="txtDisplayNameRead">xxxxxxx</div></td></tr>
                            <tr><th><asp:Label ID="lblDescriptionRead" runat="server" Text="***Description***"></asp:Label></th>    <td><div id="txtDescriptionRead">xxxxxxx</div></td></tr>
                            <tr><th><asp:Label ID="lblProcessRead" runat="server" Text="***Process ***"></asp:Label></th>           <td><div id="txtProcessRead">xxxxxxx</div></td></tr>
                            <tr><th><asp:Label ID="lblEntityPathRead" runat="server" Text="***Entity Path ***"></asp:Label></th>    <td><div id="txtDisplayEntityPathRead">xxxxxxx</div></td></tr>
                            
                        </table>                

                        <div class="dimensionPropertiesFooter">
                            <input runat="server" type="button" id="btnEdit" value= "Edit" />
                            <input runat="server" type="button" id="btnDelete" value= "Delete" />
                        </div>
                    </fieldset>
                </div>

                <div id="divDimensionEditPanel" class="dimensionPropsPanel" style="display:none">
                    <fieldset class="ui-widget ui-widget-content ui-corner-all">

                        <div class="titleDimensionReadProperties ui-widget ui-widget-header ui-corner-all">
                            <asp:Label ID="lblDimPropertiesEdit" runat="server" Text="***Edit Dimension Properties ***"></asp:Label>
                        </div>

                        <table class = "dimensionPropertiesTable">
                            
                            <tr><th><div id="lblNameEdit"><asp:Label ID="lblNameEdit1" runat="server" Text="***Name***"></asp:Label></div> </th>                        <td> <input type="text" id="txtNameEdit" maxlength="50" /> </td></tr>
                            <tr><th><div id="lblDisplayNameEdit"><asp:Label ID="lblDisplayNameEdit1" runat="server" Text="***DisplayName***"></asp:Label></div></th>    <td> <input type="text" id="txtDisplayNameEdit" maxlength="50"/></td></tr>
                            <tr><th><div id="lblDescriptionEdit"><asp:Label ID="lblDescriptionEdit1" runat="server" Text="***Description***"></asp:Label></div> </th>   <td> <input type="text" id="txtDescriptionEdit" maxlength="100"/></td></tr>
                            <tr><th><div id="lblProcessEdit"><asp:Label ID="lblProcessEdit1" runat="server" Text="***Process***"></asp:Label></div></th>                <td> <asp:DropDownList runat="server" ID="ddlProcess"></asp:DropDownList></td></tr>
                            <tr><th><div id="lblEntityPathEdit"><asp:Label ID="lblEntityPathEdit1" runat="server" Text="***Entity Path***"></asp:Label></div> </th>     <td> <input type="text" readonly="readonly" id="txtDisplayEntityPath" /> <img alt="x" id="imgSelectPath" src="../../img/analysis/view_next.png" /></td></tr>
                        </table>                
                        <input type ="hidden" id= "txtIdEdit" />
                        <input type ="hidden" id= "hidEntityPath" />

                        <div class="dimensionPropertiesFooter">
                            <input runat="server" type="button" id="btnApply" value= "Apply" />
                            <input runat="server" type="button" id="btnCancel" value= "Cancel" />
                        </div>
                    </fieldset>
                </div>

            
            
        </div>
        
        <!-- Localized messages -->        
        <input type="hidden" runat="server" id="hidMsgNoChangesToSave" />
        <input type="hidden" runat="server" id="hidMsgIgnoreChanges"  />
        <input type="hidden" runat="server" id="hidMsgConfirmDelete" />
        <input type="hidden" runat="server" id="hidMsgConfirmEdit" />
        <input type="hidden" runat="server" id="hidMsgFillAllFields" />        
        <input type="hidden" runat="server" id="hidMsgNoProcessEntity" />        
        <input type="hidden" runat="server" id="hidMsgEntityPathTooLong" />        
        <input type="hidden" runat="server" id="hidMsgMasterEntitiesNotAllowed" />        
        
        <input type="hidden"    id="hidMsgOK" runat="server" />
        <input type="hidden"    id="hidMsgCancel" runat="server" />

    </form>
</body>
</html>
