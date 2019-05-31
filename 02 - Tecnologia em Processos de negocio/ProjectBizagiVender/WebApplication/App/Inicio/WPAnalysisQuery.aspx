<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WPAnalysisQuery.aspx.cs" Inherits="BizAgiBPM.App.Inicio.WPAnalysisQuery" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html >
    <head >
        <title>WPAnalysisQuery</title>
        <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
        <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
        <script language="JavaScript" src="../../js/WorkPortal/WPToolBarMenu.js"></script>	
	    <script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
        <script language="JavaScript" src="../../js/scripts.js"></script>	
	    <script language=javascript src="../../js/WorkPortal/WPTree.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPFolders.js"></script>
	    <script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
	    <script language="JavaScript" src="../../js/BizAgiAJAX.js"></script>
    	
	    <link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">
	    <link rel="stylesheet" href="../../css/WorkPortal/WPContextMenu.css" type="text/css">
	    
	    
	    
		<script type="text/javascript" language='javascript'>
		function EditUserQuery(){	
			if (idCM != null){
				LoadMainPage("../Cockpit/SaveQuery.aspx?QueryId="+idCM);
			}
		}

		function DeleteQueryCallBack(strData){
			var rData = eval("("+strData+")");
			if (rData.done != "1"){			
				alert (rData.message);
			}
			else{
				var folderContainer = BAGetFoldercontainer(rData.id);
				if (folderContainer){
					folderContainer.style.display = "none";
				}
				
			}
		}
		
		function DeleteUserQuery(){
			if (idCM != null){
				if(confirm('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPAnalysisQueryConfirmation") %>')){
					var DeleteQueryUrl= "App/Ajax/AJAXGateway.aspx?action=1612&QueryId="+idCM;
					DeleteQueryUrl = "../../"+DeleteQueryUrl;
					callAjaxURL(DeleteQueryUrl,DeleteQueryCallBack);
				}
			}
		}
		
		</script>
	    
    </head>

    <body class="BAMnColor LeftTabBg"  onload="initContextMenu(); expandTree();" > 

        <%=TreePageHTML%>
		<%=TreePageContextMenu%>
        <img src="../../img/separador/empty.gif" id=imgPlus name=imgPlus style="display:none"/>
        <img src="../../img/separador/empty.gif" id=imgPlusE name=imgPlusE style="display:none"/>
	    <img src="../../img/separador/empty.gif" id=imgMinus name=imgMinus style="display:none"/>

    </body>

</html>
