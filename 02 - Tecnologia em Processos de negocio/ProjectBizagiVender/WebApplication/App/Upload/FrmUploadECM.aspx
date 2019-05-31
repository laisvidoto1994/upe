<%@ Page Language="C#" AutoEventWireup="true" Codebehind="FrmUploadECM.aspx.cs" Inherits="BizAgiBPM.App.Upload.FrmUploadECM" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>
        <% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppUploadFormaUpload_UploadFile")); %>
    </title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet">
    <%WriteHead();%>

    <script type="text/javascript" language="javascript">
		/**
		 * Performs submit actions
		 */
		function submitUploadForm(){
		   document.getElementById("disableScreen").style.display="block";
		   doSubmit(true);
		}         
            
        function btnClose_onclick(){
             if(parent) {
                 parent.CloseCurrentWindow(null);
             }
        }           
		String.prototype.format = function()
			{
				var str = this;
				for(var i=0;i<arguments.length;i++)
				{
					var re = new RegExp('\\{' + (i) + '\\}','gm');
					str = str.replace(re, arguments[i]);
				}
				return str;
			}                                         
    </script>

    <script language="javascript">
		var BA_VAL_REQUIRED = "<% Response.Write(CResourceManager.RM.GetString("ECMTextRequired")); %>";
		function doSubmit(validate) {
			if (validate && (!BAvalidateAllFields() || !BAValidateFileExtension())) {
				document.getElementById("disableScreen").style.display="none";
			    return;
		     }
		     executeSubmit(true);
		}

		function submitValidation() {
		    if (bOnSubmit) {
			    alert('Procesando ... Por favor espere.'); 
			    return false;
		    }
		    bOnSubmit = true;
		    document.body.style.cursor='wait'; 
		    return true; 	
		}

		function executeSubmit(action,validate) {
		    if (validate == null) 
		        validate = true;
		    
		    BAonUnload();
		    
		    if (validate && (!submitValidation())) 
		        return false;
		    
		    document.forms['bizagiform'].submit();
		}
		    
		function BAvalidateAllFields(){
			var ok = true;
			
			if(typeof(BArequiredFields) == "undefined")
			    return ok;
			
			for (var i=0; i< BArequiredFields.length; i++){
			    var BARequiredFieldName = BArequiredFields[i];
			    var BAValue = GetValue(BARequiredFieldName);
				var BAControl = GetObject(BARequiredFieldName);
				
				if(BAControl.type != "text" && BAControl.type != "file" && BAControl.type != "textarea")
				{
				    var BAControlYes = GetObject(BARequiredFieldName + "_Yes");
			        var BAControlNo = GetObject(BARequiredFieldName + "_No");
			        
				    if(BAValue.length == 0 || (BAControlYes.checked == false && BAControlNo.checked == false))
				    {
				        var displayNameC = BAControlYes.getAttribute("displayName");
			            alert (displayNameC + ": " + BA_VAL_REQUIRED.format(displayName));
				        ok = false;
				        break;
				    }
				}
				else
				{
				    var displayName = BAControl.getAttribute("displayName");
    						
				    if (BAValue == null ||BAValue == ''){
					    alert (displayName + ": " + BA_VAL_REQUIRED.format(displayName));
					    ok = false;
					    break;
				    }
				}
			}
			return ok;
		}
		
		function BAValidateFileExtension()
{
                var sValidExtensions = BAValidExtensions;
        var fileControl = GetObject("fileUpload");
        if (fileControl == null){
            //The file control is not in the form. It does not need
            //the validation
            return true;
        }
        
        var sFileName = fileControl.value;
                
                //No extension validation required
                if (sValidExtensions == null || sValidExtensions.length == 0)
                                return true;

                var arrExtensions = sValidExtensions.split(";");
                var sExtension = "";
                var i;
                var arrFileName = sFileName.split(".");
                if (arrFileName.length > 1)
                                sExtension = arrFileName[arrFileName.length -1];

                for (i=0; i< arrExtensions.length ; i++)
                {
            if (sExtension == arrExtensions[i])
                return true;
                }
        //Show invalid error:
        alert("<% Response.Write(CResourceManager.RM.GetString("ECMAppFormaUpload_ExtValidationMessage")); %>" + " ("+sValidExtensions+")");
                return false;
}

		
    </script>

    <script language='JavaScript'>
        <% DrawValidationFields(); %>
    </script>
    
    <script language='JavaScript'>
        <% GetValidExtensions(); %>
    </script>

    <script language='JavaScript'>
        var DefaultTab = 0;
        var CurrentTab = DefaultTab;
        var TabNames = new Array();
        var BAUseDefaultBizagiTab = true;
        TabNames[0]=' ';
    </script>

</head>
<body onload="BAonload()">
    <div class="text" id="popupcalendar">
    </div>
    <div id="oBAContextMenu" class="BAContextMenu">
    </div>
    <div id='disableScreen' style='display: none' class='BABlocker'>
    </div>
    <form id="bizagiform" enctype="multipart/form-data" runat="server">
        <div runat="server" id="divUploadForm" style="display: none">
            <div id='xpTab1' class='BAXPTab'>
                <table class='BAXPTabTable' style='border-top: 1px solid;' cellspacing='0' cellpadding='4'
                    width='100%' border='0' valign='top'>
                    <tr runat="server" name="RR_fileuploadControl" id="RR_fileuploadControl">
                        <td name="RR_fileuploadControl" id="Td1" width='30%' align=''>
                            <asp:Label runat="server" ID="lblUploadTitle"></asp:Label>
                        </td>
                        <td name="RR_fileuploadControl" id="Td2" align='' width=''>
                            <input id="fileUpload" type="file" size="40" name="File1" runat="server" class='mask BgInput'
                                req="1" displayname='Upload' preset='texto' />
                        </td>
                    </tr>
                    <tr>
                        <td colspan='2'>
                            <table id="FMContent" runat="server" cellspacing="0" cellpadding="0" width="100%" color='red' border='0'>
                                <tr id="Tab1">
                                    <td valign="top">
                                        <img src="../../img/WorkPortal/leftgroup.jpg" border="0"></td>
                                    <td align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middlegroup.jpg">
                                        <asp:Label runat="server" ID="lblMetadataTitle"></asp:Label></td>
                                    <td valign="top">
                                        <img src="../../img/WorkPortal/groupborder.jpg" border="0"></td>
                                    <td align="right" class="GroupHeaderRight" onmouseover="setBorder('1',true);" onmouseout="setBorder('1',false);"
                                        onclick="showHideContent('1', event);">
                                        <img id="1Tab1" alt="" src="../../img/WorkPortal/rightgroupexp.jpg" border="0"></td>
                                </tr>
                            </table>
                            <div id="1Content" displayname="<% Response.Write(CResourceManager.RM.GetString("AppFormaUpload_MetadataTitle")); %>" helptext="" width="100%">
                                <% DrawMetadata(); %>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <br />
            <div runat="server" id="divResult">
            </div>
        </div>
    </form>
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td>
                <table id="tblBtn" runat="server" cellpadding="0" cellspacing="0" border="0" height="21px">
                    <tr>
                        <td width="2px" valign="top">
                            <img src="../../img/WorkPortal/WPLeftButton.gif" border="0" width="2" height="21">
                        </td>
                        <td nowrap>
                            <a class="WPButton">
                                <input onclick='submitUploadForm(this);' type="button" name="btnGuardar" value="<% GetLocalizedButton(); %>" title="" class="WPButtonI BAMnColor" />
                            </a>
                        </td>
                        <td width="2px" valign="top">
                            <img src="../../img/WorkPortal/WPRightButton.gif" border="0" width="2" height="21" />
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 10px">
                &nbsp;</td>
            <td>
                <table cellpadding="0" cellspacing="0" border="0" height="21px">
                    <tr>
                        <td width="2px" valign="top">
                            <img src="../../img/WorkPortal/WPLeftButton.gif" border="0" width="2" height="21">
                        </td>
                        <td nowrap>
                            <a class="WPButton">
                                <input onclick='btnClose_onclick();' type="button" name="btnCerrar" value="<% Response.Write(CResourceManager.RM.GetString("BtnClose")); %>" title="" class="WPButtonI BAMnColor"/>
                            </a>
                        </td>
                        <td width="2px" valign="top">
                            <img src="../../img/WorkPortal/WPRightButton.gif" border="0" width="2" height="21" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
