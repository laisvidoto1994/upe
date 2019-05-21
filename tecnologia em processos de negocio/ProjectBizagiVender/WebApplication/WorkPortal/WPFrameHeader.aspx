<%@ Page language="c#" Codebehind="WPFrameHeader.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.WorkPortal.WPFrameHeader" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>WPFrameHeader</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<script language="JavaScript" src="../js/WorkPortal/WPFrames.js"></script>		
		    <link href="../css/estilos.css" type="text/css" rel="stylesheet">
		    <link href="../css/WorkPortal/WPFrameHeader.css" type="text/css" rel="stylesheet">
			<link href="../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
			<script language="JavaScript">
		

		function BAToogleParentFrame(oImgHeader){
		  var imgDown = document.getElementById("imgHeaderDown");
		  var imgUp = document.getElementById("imgHeaderUp");
		  if(parent.document.getElementById('HorizontalToggle').rows == "33,*,45%"){				
				parent.document.getElementById('HorizontalToggle').rows = "33,0,*";
				oImgHeader.src = imgDown.src; 
		   }
		   else{
				parent.document.getElementById('HorizontalToggle').rows = "33,*,45%";
				oImgHeader.src = imgUp.src;		    
		   }
		}

		
		</script>
	</HEAD>
	<body class="BAMnColor WPMainBGColor WPFrameHeaderBody"  topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0">
	<div class="WPFrameHeaderBG">
		<div class="WPFrameHeaderLeftCorner">&nbsp;</div>
		<div class="WPFrameHeaderRightCorner">&nbsp;</div>
		<div class="WPFrameHeaderButtons">
			<a href="javascript:void(0)" id="WPHeaderRefresh" class="WPFrameHeaderButton"  style="position:relative " onclick="BARefreshSummaryFrame()">&nbsp;&nbsp;&nbsp;</a>
			<a href="javascript:void(0)" id="WPHeaderClose" class="WPFrameHeaderButton" style="position:relative " onclick="BACloseSummaryFrame();">&nbsp;</a>
		</div>
		<div class="WPFrameObject">
			<img src="../img/WorkPortal/Frames/HeaderUp.gif" width="16" height="16" align="top" style="CURSOR : pointer;position:relative;" onclick="BAToogleParentFrame(this);">
			<b class="BAHlColor"><%= sFrameName %></b>
		</div>
	</div>
	<img src="../img/WorkPortal/Frames/HeaderUp.gif" id=imgHeaderUp name=imgHeaderUp style="display:none"/>
	<img src="../img/WorkPortal/Frames/HeaderDown.gif" id=imgHeaderDown name=imgHeaderDown style="display:none"/>

   
	
  </body>
</HTML>
