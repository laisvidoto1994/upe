<%@ Page language="c#" Codebehind="WPSmartFolders.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.WPSmartFolders" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>WPSmartFolders</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<script language=javascript src="../../js/WorkPortal/WPTree.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPFolders.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPDDPositionElement.js"></script>
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language=javascript src="../../js/scripts.js"></script>
		<script language=javascript src="../../js/BizAgiAJAX.js"></script>
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPContextMenu.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">
		<script language='javascript'>
		function CreateSmartFolder(){	
			if (idCM != null){
				LoadMainPage("../WorkPortal/ConfigureFilteredFolder.aspx?ParentQueryId="+idCM);
			}
		}
		function EditSmartFolder(){
			if (idCM != null){
				LoadMainPage("../WorkPortal/ConfigureFilteredFolder.aspx?iQueryFormId="+idCM);
			}
		}
		function DeleteSmartFolderCallBack(strData){
			var rData = eval("("+strData+")");
			if (rData.done != "1"){			
				alert (rData.message);
			}
			else{
				var folderContainer = BAGetFoldercontainer(rData.id);
				if (folderContainer){
					folderContainer.style.display = "none";
					folderContainer.nextSibling.style.display = "none"; // Remove the childs
				}
				
			}
			BAShowFolderWait(false);
		}
		function DeleteSmartFolder(){		
			if (idCM != null){
				BAGetItemContainers();
				for (var i=0; i<itemContainers.length;i++){
					if (itemContainers[i].container.getAttribute("idFolder") == idCM){
						document.getElementById("BAWait").style.top = itemContainers[i].posY0+2;
						break;
					}
				}				
				BAShowFolderWait(true);
				if(confirm('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPFolderDeleteConfirmation") %>')){
					var DeleteSmartFolderUrl= "App/Ajax/AJAXGateway.aspx?action=6&idSmartFolder="+idCM+"&idUser=<%= oUser.idUser %>";
					DeleteSmartFolderUrl = "../../"+DeleteSmartFolderUrl;
					callAjaxURL(DeleteSmartFolderUrl,DeleteSmartFolderCallBack);

				}
				else{
					BAShowFolderWait(false);
				}
			}
		}
		</script>
	</HEAD>
	<body class="BAMnColor LeftTabBg" onload="initContextMenu()">
		<%=TreePageHTML%>
		<%=TreePageContextMenu%>
		<br>
		<a href="javascript: void(0)" onclick="idCM=-1;CreateSmartFolder();" class="WPSmartFolderNodeL1" style="margin-left: 16px;"><img src="../../img/WorkPortal/Frames/NewSmartFolder.gif" aling="top">&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPNewSmartFolder") %></a>
		
		  <img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
		  <img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
		  <img src="../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
		<div id="BAWait" style="display:none;position:absolute;left:2px" ><img src="../../img/WorkPortal/WPLoading.gif" />
		</div>
	</body>
</HTML>
