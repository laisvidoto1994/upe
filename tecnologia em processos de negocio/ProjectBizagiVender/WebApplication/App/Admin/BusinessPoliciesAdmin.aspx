<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="BusinessPoliciesAdmin.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.BusinessPoliciesAdmin" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>Business Policies</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
	<!--#include file="../../include/BizAgiMeta.inc"-->
	<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/BusinessPolicies.css" type="text/css" rel="stylesheet">
	<%WriteHead();%>
	<script language="JavaScript" src="../../js/implementation.js"></script>
	<script language="JavaScript" src="../../js/CatMenu.js"></script>
	<script language=javascript src="../../js/BizAgiAJAX.js"></script>
	<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyUtil.js"></script>
	<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPoliciesAdminObjects.js"></script>
	<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPoliciesAdmin.js"></script>
	<style>
		A{
		text-decoration:none;			
		}
		A:hover{
		text-decoration:none;			
		}
	</style>
  </head>
  <body MS_POSITIONING="FlowLayout" onclick="BAonclick(event)" onload="BAonload()">
	<%=GetHeader()%>
    <form id="Form1" method="post" runat="server">
    	<TABLE cellSpacing="2" cellPadding="2"  border="0">
			<!-- Header -->
			<TR>
				<TD valign="top"> 
					<TABLE cellpadding="0" cellspacing="10" border="0">
						<TR>
							<TD width="1px">
								<!-- Up arrow link-->
								<A id="lnkUp" href="javascript:void(0);" onclick="loadApplications()">
									<IMG id="imgArrowUp" src="../../img/WorkPortal/Menu/RedLittleArrowUp.gif" hspace="2" vspace="2" border="0" align="absmiddle">
								</A>
							</TD>
							<TD id="topContainerCell">  <!-- Here the links must be added -->
								<SPAN id="topContainer" className="innerContainer" >
								</SPAN>
							</TD>
						</TR>
					</TABLE>
				</TD>
			</TR>
			<TR>
				<!-- Main  Container -->
				<TD valign="top" style="padding-left: 50px;">
					<TABLE id="mainContainerTable"  cellpadding="0" cellspacing="0"
							border="0" height="50px">
						<TR>
							<!-- Top-Left corner -->
							<TD height="10px" valign="top" style="background-image: url(../../img/WorkPortal/Category/Left.gif); background-repeat: repeat-y;">
								<DIV style="height:10px;width:10px;overflow:hidden;display:block">
									<IMG src="../../img/WorkPortal/Category/TopLeft.gif" width="10" height="10" border="0"
										align="top">
								</DIV>
							</TD>
							<TD id="Cat5Data" rowspan="3" style="background-image: url(../../img/WorkPortal/Category/Bg.jpg); background-repeat: repeat-y;background-color:white"	valign="top">
								<!-- Top -->
								<TABLE cellpadding="0" cellspacing="0" border="0" height="100%">
									<TR>
										<TD height="10px" style="background-image: url(../../img/WorkPortal/Category/Top.gif); background-repeat: repeat-x"></TD>
									</TR>
									<TR>
										<TD id="leftContainer" class="bpaContainer">
											<!-- Here is the dinamic rendering -->
										</TD>
									</TR>
									<TR>
										<TD height="100%"></TD>
									</TR>
								</TABLE>
							</TD>
							<!-- Right Container -->
							<TD rowspan="3" style="background-image: url(../../img/WorkPortal/Category/Bg.jpg); background-repeat: repeat-y;background-color:white" valign="top">
								<TABLE id="rightContainerTable" cellpadding="0" cellspacing="0" border="0" height="100%">
									<TR>
										<TD height="10px" style="background-image: url(../../img/WorkPortal/Category/Top.gif); background-repeat: repeat-x"></TD>
									</TR>
									<TR>
										<TD valign="top" id="rightContainer" class="bpaContainer" style="display:none" >
											<!-- Here is the dinamic rendering -->
										</TD>
									</TR>
									<TR>
									</TR>
								</TABLE>
							</TD>
							<!--  Top-right corner -->
							<TD height="10px" valign="top" style="background-image: url(../../img/WorkPortal/Category/Right.gif); background-repeat: repeat-y;">
								<DIV style="height:10px;width:10px;overflow:hidden;display:block">
									<IMG src="../../img/WorkPortal/Category/TopRight.gif" width="10" height="10" border="0"
										align="top">
								</DIV>
							</TD>
						</TR>
						<!-- Left and right pics -->
						<TR>
							<TD style="background-image: url(../../img/WorkPortal/Category/Left.gif); background-repeat: repeat-y;">&nbsp;</TD>
							<TD style="background-image: url(../../img/WorkPortal/Category/Right.gif); background-repeat: repeat-y;">&nbsp;</TD>
						</TR>
						<!--- bottom pics -->
						<TR>
							<TD height="10px" valign="bottom" style="background-image: url(../../img/WorkPortal/Category/Left.gif); background-repeat: repeat-y;">
								<DIV style="height:10px;width:10px;overflow:hidden;display:block">
									<IMG src="../../img/WorkPortal/Category/BottomLeft.gif" width="10" height="10" border="0"
										align="top">
								</DIV>
							</TD>
							<TD height="10px" valign="bottom" style="background-image: url(../../img/WorkPortal/Category/Right.gif); background-repeat: repeat-y;">
								<DIV style="height:10px;width:10px;overflow:hidden;display:block">
									<IMG src="../../img/WorkPortal/Category/BottomRight.gif" width="10" height="10" border="0"
										align="top">
								</DIV>
							</TD>
						</TR>
					</TABLE>
				</TD>
		</TABLE>
     <DIV id="divConstantDefinition" style="WIDTH: 350px; HEIGHT: 150px;VISIBILITY: hidden" class="editDefinitionDiv"  ms_positioning="FlowLayout">
		<TABLE height="100%" width="100%">
			<TR height="10%">
				<TD>
					<STRONG>
						<UI:CLabel runat="server" Text="BusinessPoliciesAdmin_EditDefinition" id="lblEditDefinition" />
					</STRONG>
				</TD>
			</TR>
			<TR height="10%">
				<TD>	
					<UI:CLabel runat="server" Text="BusinessPoliciesAdmin_EditDefinitionDescription" id="lblEditDefinitionDescription" />
				</TD>
			</TR>
			<TR height="80%">
				<TD>
     				<!-- Text Editor --->
					<span id="textControl" style="DISPLAY: none">
						<input id="textEditor" type="text"  preset="text" CLASS="mask BgInput" style="WIDTH: 100%" align="right">
					</span>
					<!-- Datetime Editor -->
					<span id="dateTimeControl" style="DISPLAY: none">
						<FORM id="frmDatetimeTemplate" >
							<INPUT class="mask BgInput" id="dateTimeEditor" name="dateTimeEditor" preset="shortdate" style="WIDTH: 100%" align="right">
							<A class="so-BtnLink" onclick="showCalendar('frmDatetime','dateTimeEditor','BTN_date',false, event, null, null, null, null, null, null);return false;" tabIndex="-1" href="javascript:void(0);">
								<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date"></A>
						</FORM>													
					</span>
					<!-- Numeric Editor -->
					<span id="numericControl" style="DISPLAY:none">
						<input type="text" id="numericEditor" preset="number" CLASS="mask BgInput" style="WIDTH: 100%" align="right">
					</span>
					<!-- Boolean Editor -->
					<span id="booleanControl" style="DISPLAY:none" align="right">True &nbsp;<input type="radio" name="booleanEditor" value="true">
						&nbsp;&nbsp; False &nbsp;<input type="radio" name="booleanEditor" value="false">
					</span>
				</TD>
			</TR>
			<TR>
				<TD align="right" valign="bottom">
					<TABLE>
						<TR>
							<TD>
								<UI:CWPHtmlInputButton id="btnCancel" runat="server" Value="BtnCancel" onclick="cancelEditDefinition(); "/>
							</TD>
							<TD>
								<UI:CWPHtmlInputButton id="btnUpdate" runat="server" Value="BtnUpdate" onclick="saveDefinition(getParentDiv(this, 'divConstantDefinition'));"/>
							</TD>
						</TR>
					</TABLE>
				</TD>
			</TR>
		</TABLE>
	 </DIV>
	 <DIV style="display:none" id="linkTopHTML">
		<A href="javascript:void(0);" id="linkTop">
			<IMG id="imgArrowRight" src="../../img/WorkPortal/Menu/RedLittleArrow.gif" hspace="2" vspace="2" border="0" align="absmiddle">
		</A>
	 </DIV>
	 </form>
  </body>
</html>
<script languaje="javascript">
	applicationsHTML = '<%=RenderApplications()%>';
	
	// Fill main container
	loadApplications();
		
	function loadApplications()
	{
		document.getElementById('leftContainer').innerHTML = applicationsHTML;
		document.getElementById('topContainer').innerHTML = '';
		
		// New inner Container
		var topContainerCell = document.getElementById('topContainerCell');
		topContainerCell.innerHTML = '';
		var innerSpan = document.createElement('SPAN');
		innerSpan.id = "topContainer";
		innerSpan.className = 'innerContainer';
		topContainerCell.appendChild(innerSpan);
	}
</script>
