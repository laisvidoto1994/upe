<%@ Page language="c#" Codebehind="WPCustomFolders.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.WPCustomFolders" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPCustomFolders</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    	<script language=javascript src="../../js/WorkPortal/WPTree.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language=javascript src="../../js/scripts.js"></script>
		<script language=javascript src="../../js/BizAgiAJAX.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPDDPositionElement.js"></script>
		<script language=javascript src="../../js/WorkPortal/WPFolders.js"></script>
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPContextMenu.css" type="text/css">
		<link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">
		<script language='javascript'>
		function CreateCustomFolder(){	
			if (idCM != null){
				LoadMainPage("../WorkPortal/ConfigureCustomFolder.aspx?idWPParentQuery="+idCM);
			}
		}
		
		function DeleteCustomFolderCallBack(strData){
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
		function DeleteCustomFolder(){		
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
					var DeleteCustomFolderUrl= "App/Ajax/AJAXGateway.aspx?action=5&idCustomFolder="+idCM;
					DeleteCustomFolderUrl = "../../"+DeleteCustomFolderUrl;
					callAjaxURL(DeleteCustomFolderUrl,DeleteCustomFolderCallBack);

				}
				else{
					BAShowFolderWait(false);
				}
			}
		}
		function EditCustomFolder(){
			if (idCM != null){
				LoadMainPage("../WorkPortal/ConfigureCustomFolder.aspx?idWPQuery="+idCM);
			}
		}
		var dropPointX = null;
		var dropPointY = null;
		function BAGetTopPoint(){
			dropPointX = null;
			dropPointY = null;
			var el = parent.frames["ifrBACustomFolders"].frameElement.offsetParent;
			var x = 0, y = 0;
			while (el)
			{
				x += el.offsetLeft;
				y += el.offsetTop;
				el = el.offsetParent;
			}
			if (y > 0 ){
				dropPointX = x;
				dropPointY = y+50+20;//50 is the menu height,20 is the header height			
			}
		}
		//Container element object that knows if a point is inside it							
		
		
		function BADropCase(idCase,x,y){
			BAGetItemContainers();	
			BAGetTopPoint();
			if (dropPointY&& x<200){
				y = y-dropPointY;
				//Find the container:
				for (var i=0; i<itemContainers.length;i++){
					if (itemContainers[i].validate(-1,y)){
						document.getElementById("BAWait").style.top = itemContainers[i].posY0+2;
						BAShowFolderWait(true);
						var CustomFolderUrl= "App/Ajax/AJAXGateway.aspx?action=4&idCase="+idCase+"&idCustomFolder="+itemContainers[i].idFolder;
						if (soporta.IE4){
							CustomFolderUrl = "../../"+CustomFolderUrl;
						}
						callAjaxURL(CustomFolderUrl,returnData);
						break;
					}
				}
			}
		}
		
		function BASetDDEvents(){			
			initContextMenu();
			parent.parent.parent.onDropCase = BADropCase;
		}
		
		</script>
		<script language='javascript'>
		function returnData(strData){
			var rData = eval("("+strData+")");
			if (rData.message != ""){			
				alert (rData.message);
			}
			else{
				if (document.getElementById("CFCounter"+rData.id)){
					document.getElementById("CFCounter"+rData.id).innerHTML = rData.counter;
				}
			}
			BAShowFolderWait(false);
		}
		

		</script>
  </head>
  <body MS_POSITIONING="FlowLayout" onLoad="BASetDDEvents()" class="BAMnColor LeftTabBg">
	
    <form id="Form1" method="post" runat="server">
    	<%=TreePageHTML%>
		<%=TreePageContextMenu%>
    <br>
	<a href="javascript: void(0)" onclick="idCM=-1;CreateCustomFolder();" class="WPSmartFolderNodeL1" style="margin-left: 16px;"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPNewCustomFolder") %></a>
		
	<img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
	<img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
	<img src="../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
	<div id="BAWait" style="display:none;position:absolute;left:2px" ><img src="../../img/WorkPortal/WPLoading.gif" />
	</div>
     </form>
	
  </body>
</html>
