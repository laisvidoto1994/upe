<%@ Page language="c#" Codebehind="WPLocationFrame.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.WorkPortal.WPLocationFrame" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPLocationFrame</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <link href="../css/estilos.css" type="text/css" rel="stylesheet">
    <link href="../css/WorkPortal/WPLocationFrame.css" type="text/css" rel="stylesheet">
    <link href="../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
    <script language='javascript'>
    var oLocationLabel = null;
    var oHelpTextLabel = null;
    var oLocation = "";
    var oHelpText = "";
    var m_caseArray = null;
    var m_iCurrentIndex = null;
    var m_sMainQuery = null;
    var m_sFullKey = null;
        
    function WriteLocation(sLocation){
		if (oLocationLabel == null){
			oLocationLabel = document.getElementById("locationLabel");
		}
		oLocation = sLocation;	
		sLocation = sLocation.replace(/ - /g,"<span class='BAHlColor'> - </span>");
		sLocation = sLocation.replace(/ \/ /g,"<span class='BAHlColor'> / </span>");
		oLocationLabel.innerHTML = sLocation;	
		
    }
    
    function BAWriteHelpText(sHelpText){
		if (oHelpTextLabel == null){
			oHelpTextLabel = document.getElementById("helpTextLabel");
		}
		oHelpText = sHelpText;	
		sLocation = sHelpText.replace(/ - /g,"<span class='BAHlColor'> - </span>");
		sLocation = sHelpText.replace(/ \/ /g,"<span class='BAHlColor'> / </span>");
		oHelpTextLabel.innerHTML = "<a href=\"javascript:BASetHelpText('" + sHelpText + "')\"  onmouseover=\"javascript:BASetHelpText('" + sHelpText + "')\"><img src=\"../img/wizard/open.gif\"  width=\"12\" /></a>";	
    }
    function BAWriteLocation(sLocation,useCurrentList){
		if (!useCurrentList){
			m_caseArray = null;
			m_iCurrentIndex = null;
			ShowNavBarButtons();
		}
		WriteLocation (sLocation);	
    }
    
    function LoadMainPage(sRef){
		parent.BAMainFrame.location.href = sRef;
	}

    function BAAddLocation(sLocation){
		if(oLocation.indexOf(" - " + sLocation) < 0) {
			oLastLocationElement = sLocation;
			WriteLocation (oLocation + " - " + sLocation);
		}		
    }
    function BARemoveLocation(sLocation){
		var sNewLocation = oLocation.replace(" - " + sLocation, "");
		WriteLocation(sNewLocation);
    }
    function BASetNavigationBarData(sName, oCaseArray, sFullKey){
		m_caseArray = oCaseArray;
		m_sFullKey = sFullKey;
		getCurrentURL();
    }
    function ShowNavBar(sDisplay){
		if (document.getElementById("LFNavBar") != null)
			document.getElementById("LFNavBar").style.display = sDisplay;
		
    }
    function ShowNavBarButtons(){
		if (m_caseArray == null || m_iCurrentIndex < 0 || m_iCurrentIndex >= m_caseArray.length){
			ShowNavBar("none");
		}
		else{
			document.getElementById("imgPrevious").style.visibility="visible";
			document.getElementById("imgNext").style.visibility="visible";
		
			ShowNavBar("");
		}
    }
    function showSearchList(){
		if (m_sMainQuery == null || m_sMainQuery == ""){		
			m_sMainQuery = "../App/ListaDetalle/listaitems.aspx?h_Location=Pending&I_processState=Running";
		}
		parent.BAMainFrame.location.href = m_sMainQuery;
    }
    function doAction(){
		if (!m_caseArray){
			return;
		}
		var newIdCase = -1;
		if (m_caseArray){
			if (m_iCurrentIndex >= 0 && m_iCurrentIndex <= m_caseArray.length -1 ){
				newIdCase = m_caseArray[m_iCurrentIndex];				
			}							
		}
		if (newIdCase != -1){
			parent.BAMainFrame.location.href = "../App/ListaDetalle/Detalle.aspx?idCase="+newIdCase;
			ShowNavBarButtons();
		}
		else{
			showSearchList();
		}
    }
    function doRefresh(){
		doAction();
    }
    function doGoToSearchResults(){
		m_iCurrentIndex = -1;
		doAction();
    }
    function doPrevious(){
		if (m_caseArray){
			m_iCurrentIndex--;			
			doAction();
		}
    }
    function doNext(){
		if (m_caseArray){
			m_iCurrentIndex++;			
			doAction();
		}		
    }
    function setCurrentCase(idCase){
		var index = -1;		
		if (m_caseArray != null){
			for(var i=0; i< m_caseArray.length; i++){
				if (m_caseArray[i] == idCase){
					index  = i;
					break;
				}
			}
		}
		if (index == -1){
			//m_caseArray = null;
			//m_iCurrentIndex = null;
		}
		else{
			m_iCurrentIndex  = index;
		}
		getCurrentURL();
		ShowNavBarButtons();	
		
    }
    
    function getCurrentURL() {
		m_sMainQuery = parent.BAMainFrame.location.href;
		if(m_sMainQuery.indexOf("?") < 0)
		{
			m_sMainQuery += "?" + m_sFullKey;
		}
    }    
    
    function BASetHelpText(sText){
	    parent.BAMainFrame.setHelp('Form', sText, 1);
    }

    
    </script>
    
		<script language="JavaScript" src="../js/Hashtable.js"></script>
		<script language="JavaScript" src="../js/cache.js"></script>
		
		<script language="JavaScript">
			var localCache = null;
			function RegisterCache(){
				if (localCache == null){
					localCache = new Cache();
				}
			}
			RegisterCache();
		</script>
  </head>
  <body class="LocationFrameBody">
	<div class="BAMnColor">
		<div id="LFLeftImage">
			&nbsp;
		</div>
		
		<div id="LFRightImage">
			&nbsp;
		</div>
		<div id="LFNavBar" style="display:none">
			<img id="imgPrevious" src="../img/WorkPortal/LocationFrame/BarPrev.gif" width="16" height="16" hspace="0" vspace="0" class="iconImg" border="0" onclick="doPrevious()" style="cursor:hand">
			<img id="imgRefresh" src="../img/WorkPortal/LocationFrame/BarRefresh.gif" width="16" height="16" hspace="0" vspace="0" class="iconImg" border="0" onclick="doRefresh()" style="cursor:hand">
			<img id="imgToResults" src="../img/WorkPortal/LocationFrame/BarList.gif" width="16" height="16" hspace="0" vspace="0" class="iconImg" border="0" onclick="doGoToSearchResults()" style="cursor:hand">
			<img id="imgNext" src="../img/WorkPortal/LocationFrame/BarNext.gif" width="16" height="16" hspace="0" vspace="0" class="iconImg" border="0" onclick="doNext()" style="cursor:hand">
		</div>
		
		<div id="LFIcons">
			<img src="../img/WorkPortal/LocationFrame/TopBorder.jpg" width="44" height="7" hspace="0" vspace="0" class="iconImg" border="0">
			<img src="../img/WorkPortal/Menu/RedLittleArrow.gif" width="16" height="16" hspace="0" vspace="0"  class="iconImg" style="clear:left; ">
			<!--img src="../img/WorkPortal/LocationFrame/LFImage.png" width="16" height="16" hspace="0" vspace="0" class="iconImg"-->
		</div>
		<div id="LFText">				
				<span id="locationLabel">
				
				</span>
				&nbsp;
				&nbsp;
				&nbsp;
				<span id="helpTextLabel">
				
				</span>
		</div>
		
	</div>      
	
  </body>
</html>
