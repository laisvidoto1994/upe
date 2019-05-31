<%@ Page language="c#" Codebehind="default.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM._default" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<%@ Register TagPrefix="WPUserControls" TagName="WPMenuButton" Src="WorkPortal/WPMenuButton.ascx" %>
<%@ Register TagPrefix="WPUserControls" TagName="WPMainMenu" Src="WorkPortal/WPMainMenu.ascx" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<link REL="SHORTCUT ICON" HREF="favicon.ico">
<LINK rel="STYLESHEET" href="css/WorkPortal/WPMenu.css" type="text/css">
<LINK rel="STYLESHEET" href="css/WorkPortal/WPContextMenu.css" type="text/css">
<LINK rel="STYLESHEET" href="css/WorkPortal/WPCustomStyles.css" type="text/css">
<LINK rel="STYLESHEET" href="css/estilos.css" type="text/css">
<script language="JavaScript" src="Localization/LocalizationEN.js"></script>
<script language="JavaScript" src="js/WorkPortal/WPToolBarMenu.js"></script>
<script language="JavaScript" src="js/scripts.js"></script>
<script language="JavaScript" src="js/BizAgiAjax.js"></script>
<title>BizAgi</title>
<style>

#DaDContainer{
		position:absolute;
		width:400px;
		left:400px;
		height:400px;
		z-index:200;	
		display:none;
		filter:alpha(opacity=0.1);	/* 50% opacity , i.e. transparency */
		opacity:0.001;	/* 50% opacity , i.e. transparency */
		cursor:pointer;

}
#DaDData{
		position:absolute;
		width:260px;
		left:25px;
		z-index:199;	
		display:none;
		cursor:pointer;
		width:260px;
		height: 16px;
		background-color:#FDFDFD;
		background-image: url(img/WorkPortal/DragBg.gif);
		background-position: top;
		padding: 5px;
		border: 1px solid #CCCCCC;
		filter:alpha(opacity=75);	/* 50% opacity , i.e. transparency */
		opacity:0.75;	/* 50% opacity , i.e. transparency */
}
* html #DaDData{
	background-image: none;
}
</style>
<script language='javascript'>

//drag and drop cases
/*HELPER CLASS*/
function DragHelper(){
	this.idCase = -1;
	this.dragedCaseCont = document.getElementById("DaDContainer");
	this.dragedCaseData = document.getElementById("DaDData");
	this.Image =  document.getElementById("DaDImage");
	this.dragedCaseText= document.getElementById("DaDText");
	this.StartDrag = StartDrag;
	this.MouseMove = BADragMouseMove;
	this.EndDrag = BADragMouseUp;
	this.dragging = false;
	this.setText = BASetDragText;
	this.setPosition = BASetDDPosition;
}
function BASetDDPosition(x,y){
		this.dragedCaseCont.style.left = x-200;
		this.dragedCaseCont.style.top = y-200;
		this.dragedCaseData.style.left = x-10;
		this.dragedCaseData.style.top = y-10;
}
function StartDrag(x,y){
	//Set the position to the absolute screen:
	x = x+210;
	y = y+80;
	this.x0 = x;
	this.y0 = y;
	this.dragging = true;
	this.setPosition(x,y);
	this.dragedCaseCont.style.display="block";
	this.dragedCaseData.style.display="block";
	
}
function  BADragMouseUp(point){		
    if (this.dragging && point!= null){
		this.dragging = false;
		this.dragedCaseCont.style.display = "none";
		this.dragedCaseData.style.display="none";
		if (onDropCase){
			onDropCase(this.idCase,point.x,point.y);
		}
		//Call the drag and drop in the main page:
		if (soporta.IE4){
    			if (mainFrame.frames["BAMainFrame"].window.onDropCase){
    				mainFrame.frames["BAMainFrame"].window.onDropCase(this.idCase,point.x,point.y);
    			}
    	}
    	else{
    		if (mainFrame.contentDocument.all["BAMainFrame"].contentWindow.onDropCase){
    			mainFrame.contentDocument.all["BAMainFrame"].contentWindow.onDropCase(this.idCase,point.x,point.y);
    		}
    	}
	}
	this.idCase = -1;
}
function BASetDragText(text){
	this.dragedCaseText.innerHTML=text;
}
function BADragMouseMove(x,y){	
	if (this.dragging){
		this.setPosition(x,y);
	}
	
}
	/*END: HELPER CLASS*/
	
var dragHelper = null;
function doBADragMouseMove(e){
	if(document.all) {
		e = event;
	}	
	mouseCoord = BAGetMouseCoords(e);
	dragHelper.MouseMove(mouseCoord.x,mouseCoord.y);
}
function doBADragMouseUp(e){	
	if(document.all) {
		e = event;
	}	
	dragHelper.EndDrag(BAGetMouseCoords(e));
}
function doBADragMouseOut(){
	dragHelper.EndDrag(null);
}
function getDragHelper(){
	if (dragHelper == null){
		dragHelper = new DragHelper();
	}				
	return dragHelper;
}
	
function BAInitCaseDaD(radNumber,idCase,x,y){
	dragHelper.setText(radNumber);
	dragHelper.idCase = idCase;
	dragHelper.StartDrag(x,y);
}
function BAPrepareDD(imageName){
	dragHelper.Image.src = imageName;
}
function doInitDragAndDropPage(){
		ChangeMainFrameURL();
		getDragHelper();
		onResize();
}
var onDropCase = null;
</script>
<script language=javascript>
    function SearchByRadNumber(){
		var oRadNumberControl = document.getElementById("BARadNumber");
    	if (oRadNumberControl != null && oRadNumberControl.value != ""){
    		var sRadNumber = oRadNumberControl.value.toString().replace("&", "%26");
    		var searchPage = "App/ListaDetalle/listaitems.aspx?h_Location=<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Menu_Search") %>&I_processState=ALL&I_Users=ALL&I_radNumber=" + sRadNumber;    		
    		if (soporta.IE4){
    			mainFrame.frames["BAMainFrame"].location.href = searchPage;
    		}
    		else{
    			searchPage = "../"+searchPage;
    			mainFrame.contentDocument.getElementsByName("BAMainFrame").namedItem("BAMainFrame", null).src = searchPage ;
    		}
			
		}
    }   
    function ChangeMainFrameURL(sURL){
		if ('<%=sFrameURL%>' != ""){
			var page= '<%=sFrameURL%>';
			if (soporta.IE4){
    			mainFrame.frames["BAMainFrame"].location.href = page;
    		}
    		else{
    			page = "../"+page;
    			mainFrame.contentDocument.getElementsByName("BAMainFrame").namedItem("BAMainFrame", null).src = page;
    		}
		}
    }
   
   function searchKeyDown(e)
   {   
     var keyCode = (e.keyCode!=null)?e.keyCode:e.which;
     if(keyCode == 13)
     {
        SearchByRadNumber();
     }
   }

</script>
</head>
<body class="BAMnColor" onLoad="doInitDragAndDropPage();">
<DIV style="OVERFLOW-Y:hidden;WIDTH:100%;HEIGHT:50px">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td>
			<div id="WPMenuContainer" class="WPMainBGColor">
				<div id="WPMainMenu">
					<span class="BAMark">
						<img src="img/img/barra/Logo.gif" width="155" height="40">
					</span>		
					<div style="float:left">
						<img src="img/WorkPortal/Menu/leftmenu.jpg" width="11" height="50" alt="" border="1" >
					</div>														
					<img class="WPBizagiLogo" src="img/WorkPortal/Menu/BizAgiLogo.jpg" width="30" height="50" alt="">
					
					<div style="FLOAT:right">
						<img src="img/WorkPortal/Menu/rightmenu.jpg" width="8" height="50"  alt="">
					</div>
					
					<span class="WPMenuBar" >
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Cases)){%>
						<WPUserControls:WPMenuButton menuItem="Cases" menuImage="toolCases.gif" menuDisplayNameResource="WPMenuCases" runat="server"/>
					<%}%>	

					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.AnalysisReports)){%>
						<WPUserControls:WPMenuButton ID="BAM" menuItem="BAM" menuImage="ToolAnalyzer.gif" menuDisplayNameResource="WPMenuBAM" runat="server"/>
					<%}%>	

					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Admin)){%>
						<WPUserControls:WPMenuButton menuItem="Admin" menuImage="ToolAdmin.gif" menuDisplayNameResource="WPMenuAdmin" runat="server"/>
					<%}%>	
					
					<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.CurrentUserAdministration)){%>
						<WPUserControls:WPMenuButton menuItem="Tools" menuImage="ToolAdmin.gif" menuDisplayNameResource="WPMenuTools" runat="server"/>
					<%}%>	
					
					<% if (this.AuthenticationService.GetCurrentAuthenticationType() != BizAgi.Defs.EAuthenticationType.IntegratedWindowsAuthentication) {%>
					<a href="<%= Request.ApplicationPath %>/App/Inicio/LogOff.aspx" ><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Menu_LogOut") %></a>
					<%}%>	
					
						<span class="BASearchBar">
						<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,AuthorizationPages.Search)){%>
							<table border="0" cellpadding="0" cellspacing="0">
									<tr>
									<td>
											<img src="img/WorkPortal/Menu/icon_search.jpg" width="20" height="24" alt=""/>
									</td>
										<td align="left" valign="middle" id="BASearchBg"><span><input style="position:relative;z-index:1" type="text" class="BASearchField" id="BARadNumber" onkeydown="searchKeyDown(event)"></span></td>
										<td width="20" align="center" valign="middle" id="BASearchRight">
										<a href="#" onclick="SearchByRadNumber();" style="padding-top: 0px;height: 16px;padding-left: 0px;padding-right: 0px;">
											<img name="RedLittleArrow" src="img/WorkPortal/Menu/RedLittleArrow.gif" width="16" height="16" border="0" alt=""/>
										</td>
									</tr>
							</table>
						<%}%>	
						</span>
						
					</span>	
					
				</div>
			</div>
		</td>
	</tr>
	<tr>
		<td>
			<div style="width:520px;height:1px;">
		</td>
	</tr>	
</table>
</div>
<!-- BEGIN: Menu Containers -->
<WPUserControls:WPMainMenu  id="WPMenuItems" runat="server"/>
<iframe	
  id="MenuIFrame"
  src="" 
  scrolling="no"
  frameborder="0"
  marginwidth="0" marginheight="0"
  style="position:absolute; top:0px; left:0px; display:visible;visibility:hidden;width:100px;height:100px">  
 </iframe>
<!-- END: Menu Containers -->
<!-- BEGIN: Main Container -->
<iframe   onMouseOver="SetHideBAMenuTime()" id="mainFrame" src="WorkPortal/WPMainPanel.htm" width="100%" height="50px" top="0px" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" z-index="-100" class="IMainFrame2" style="position:absolute;left:0px;top:50px;z-index:2;">
</iframe>
<!-- END: Main Container -->
<!--BEGIN:Cases drag and drop container-->
	<div id ="DaDContainer" onmousemove="doBADragMouseMove(event)" onmouseup="doBADragMouseUp(event)" onmouseout="doBADragMouseOut(event)" class="WPMainBGColor">
	</div>
	<div id = "DaDData">
		<img id = "DaDImage" src = "img/lista/BombilloAmarillot.gif" border="0" align="top">
		<span class="BAMnColor">
				<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPDragAndDropRadNumber") %>: 
		</span>
		<strong class="BAMnColor" id="DaDText">
			X
		</strong>
		
		
	</div>
<!--END:Cases drag and drop container-->
 <script languaje='javascript'>
	this.HideBAMenu = ocultarMenuActivo;
	BAinitializeMenu();	
	
    function onResize(){
		var iHeight = document.body.clientHeight-50;
		oMainFrame = document.getElementById("mainFrame");
		oMainFrame.height = iHeight+"px";

    }    
	onResize();
	window.onresize = onResize; 
	BACloseWaitFrame(); 
	
	
	
	window.onbeforeunload = closeBizagi;
	
	
 </script>


</body>


