<%@ Page language="c#" Codebehind="DecisionTable.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.DecisionTable" %>
<%@ Import namespace="BizAgi.Defs.BusinessPolicies"%>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 
<html>
  <head>
    <title>Decision Table</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
   	<!--#include file="../../include/BizAgiMeta.inc"-->
	<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
	<LINK href="../../css/BusinessPolicies.css" type="text/css" rel="stylesheet">
	<link href="../../css/calendar.css" type="text/css" rel="stylesheet">
	<link href="../../css/WorkPortal/WPContextMenu.css" type="text/css" rel="stylesheet" >	
	<%WriteHead();%>
	<SCRIPT language="JavaScript" src="../../js/implementation.js"></SCRIPT>
	<script language="javascript" src="../../js/BizAgiAJAX.js"></script>
	<script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
	<SCRIPT language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyUtil.js"></SCRIPT>
	<SCRIPT language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyObjects.js"></SCRIPT>
	<SCRIPT language="JavaScript" src="../../js/BusinessPolicies/DecisionTableObjects.js"></SCRIPT>
	<SCRIPT language="JavaScript" src="../../js/BusinessPolicies/DecisionTableMisc.js"></SCRIPT>
	<SCRIPT language="JavaScript" src="../../js/BusinessPolicies/DecisionTablePage.js"></SCRIPT>
	<STYLE>
		body {
			margin: 10px;
			color:#666666;
			font: 10px Verdana, Arial, Helvetica, sans-serif;
			text-decoration: none;
		}
	</STYLE>
  </head>
	<BODY style="FONT-FAMILY: Tahoma" ms_positioning="GridLayout" >
		<DIV class="text" id="popupcalendar"></DIV>
		<style>.mask { BEHAVIOR: url(WMask.htc) }
		</style>
		<FORM id="frmDecisionTable" method="post" runat="server">
		<input type="hidden" name="decisionTableXml" id="decisionTableXml"> 
		<input type="hidden" name="rulesCodeXml" id="rulesCodeXml"> 
		<input type="hidden" name="saveTable" id="saveTable" value="false">
		<!-- Main table -->
		<TABLE cellSpacing="2" cellPadding="2" width="100%" height="95%" border="0">
			<TR>
				<TD align="center">
					<!-- Main div -->
					<DIV class="BAXPTab" style="height:100%;width:100%">
						<TABLE class='BAXPTabTable' style='BORDER-TOP: 1px solid;' cellSpacing="2" cellPadding="2" width="90%" height="100%" bordercolor="#CCCCCC">
							<TR height="120px">
								<TD colspan="2">
									<!-- General properties panel header-->
									<TABLE cellspacing="0" cellpadding="0" width="100%" border="0">
										<TR id="generalPropertiesTab">
											<TD valign="top"><IMG src="../../img/WorkPortal/LeftGroup.jpg" border="0"></TD>
											<TD align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middleGroup.jpg"><UI:CLabel runat="server" Text="DecisionTable_GeneralInformation" id="lblGeneralInformation" /></TD>
											<TD valign="top"><IMG src="../../img/WorkPortal/GroupBorder.jpg" border="0"></TD>
											<TD align="right" class="GroupHeaderRight" onmouseover="setBorder('generalProperties',true);" onmouseout="setBorder('generalProperties',false);" onclick="showHideContent('generalProperties', event);"><IMG id="generalPropertiesTab1" alt="" src="../../img/WorkPortal/RightGroupExp.jpg" border="0"></TD>
										</TR>
									</TABLE>
									<!-- /General properties panel header-->
									<!-- General properties panel content-->
									<DIV id="generalPropertiesContent">
										<TABLE cellspacing="2" cellpadding="2" width="100%" border="0">
											<TR>
												<TD class="label" style="WIDTH: 25%;">
													<UI:CLabel runat="server" Text="DecisionTable_Name" id="lblName" />
												</TD>
												<TD style="WIDTH: 25%;">
													<input type="text" id="decisionTableName" name="decisionTableName" value="<%=GetDecisionTableVO().Name%>" class="mask BgInput" preset="texto" maxlength="26"  />
												</TD>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_DisplayName" id="lblDisplayName" />
												</TD>
												<TD>
													<INPUT type="text" class="mask BgInput" preset="texto" id="decisionTableDisplayName" name="decisionTableDisplayName" value="<%=GetDecisionTableVO().DisplayName%>" maxlength="40"/>
												</TD>
											</TR>
											<TR>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_Description" id="lblDescription" />
												</TD>
												<TD>
													<input type="text" id="decisionTableDescription" name="decisionTableDescription" value="<%=GetDecisionTableVO().Description%>" class="mask BgInput" preset="texto" maxlength="100"/>
												</TD>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_EnabledFrom" id="lblEnabledFrom" />
												</TD>
												<TD>
													<input class="mask BgInput" id="decisionTableEnabledFromDate" name="decisionTableEnabledFromDate" preset="shortdate" value="<%=GetDecisionTableVO().EnabledFromDate.ToShortDateString()%>">
													<A id="decisionTableEnabledFromDateLink" class="so-BtnLink" onclick="showCalendar('frmDecisionTable','decisionTableEnabledFromDate','BTN_date',false, event, null, null, null, null, null, null);return false;"	tabIndex="-1" href="javascript:void(0);">
													<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date"></A>
												</TD>
											</TR>
											<TR>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_EnabledTo" id="lblEnabledTo" />
												</TD>
												<TD>
													<input type="text" id="decisionTablePriority" name="decisionTablePriority" preset="int" CLASS="mask BgInput" value="<%=GetDecisionTableVO().Priority.ToString()%>">
												</TD>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_Priority" id="lblPriority" />
												</TD>
												<TD>
													<input class="mask BgInput" id="decisionTableEnabledToDate" name="decisionTableEnabledToDate" preset="shortdate" value="<%=GetDecisionTableVO().EnabledToDate.ToShortDateString()%>">
													<A id="decisionTableEnabledToDateLink" class="so-BtnLink" onclick="showCalendar('frmDecisionTable','decisionTableEnabledToDate','BTN_date',false, event, null, null, null, null, null, null);return false;"	tabIndex="-1" href="javascript:void(0);">
													<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date"></A>
												</TD>
											</TR>
											<TR>
												<TD class="label">&nbsp;
												</TD>
												<TD>
													&nbsp;
												</TD>
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_Enabled" id="lblEnabled" />
												</TD>
												<TD>
													<UI:CLabel runat="server" Text="BusinessPolicies_True" id="lblEnabledTrue" /> &nbsp;<INPUT type="radio" name="decisionTableEnabled" value="true" <%= (GetDecisionTableVO().Enabled == true) ? "CHECKED" : "" %> > &nbsp;&nbsp; 
													<UI:CLabel runat="server" Text="BusinessPolicies_False" id="lblEnabledFalse" /> &nbsp;<INPUT type="radio" name="decisionTableEnabled" value="false" <%= (GetDecisionTableVO().Enabled == false) ? "CHECKED" : "" %> >
												</TD>
											</TR>
										</TABLE>
									</DIV>
									<!-- /General properties panel content-->
								</TD>
							</TR>
							<TR>
								<TD colspan="2">
									<!-- decision table panel header-->
									<TABLE cellspacing="0" cellpadding="0" width="100%" border="0">
										<TR id="decisionTableTab">
											<TD valign="top"><IMG src="../../img/WorkPortal/LeftGroup.jpg" border="0"></TD>
											<TD align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middleGroup.jpg"><UI:CLabel runat="server" Text="DecisionTable_Editor" id="lblEditor" /></TD>
											<TD valign="top"><IMG src="../../img/WorkPortal/GroupBorder.jpg" border="0"></TD>
											<TD align="right" class="GroupHeaderRight" onmouseover="setBorder('decisionTable',true);" onmouseout="setBorder('decisionTable',false);" onclick="showHideContent('decisionTable', event);"><IMG id="ruleDesignTab1" alt="" src="../../img/WorkPortal/RightGroupExp.jpg" border="0"></TD>
										</TR>
									</TABLE>
									<!-- /decision table panel header-->
									<!-- decision table panel content-->
									<DIV id="decisionTableContent" style="height:95%">
										<TABLE class="decisionTable" cellspacing="1" cellpadding="1" width="100%" height="100%" border="0">
											<TR height="25px">
												<TD class="label" style="WIDTH: 25%;">
													<UI:CLabel runat="server" Text="DecisionTable_DefinitionsGet" id="lblDefinitionsGet" />
												</TD>
												<TD style="WIDTH: 25%;">
													<SELECT id="getDefinitionCombo" style="WIDTH: 90%">
														<OPTION value="0" selected>---------------</OPTION>
													</SELECT>
												</TD>
												<TD style="WIDTH: 25%;">
													<a id="addGetColumnLink" href="javascript:void(0);" onclick="addGetColumn();" class="addbtn">
														<span>
															<img src="../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absmiddle">
															&nbsp;<UI:CLabel runat="server" Text="DecisionTable_AddColumn" id="lblAddGetColumn" />&nbsp;
															<img src="../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absmiddle">
														</span>
													</a>
												</TD>
												<TD style="WIDTH: 25%;">
													&nbsp;
												</TD>
											</TR>
											<TR height="25px">
												<TD class="label">
													<UI:CLabel runat="server" Text="DecisionTable_DefinitionsSet" id="lblDefinitionsSet" />
												</TD>
												<TD>
													<SELECT id="setDefinitionCombo" style="WIDTH: 90%">
														<OPTION value="0" selected>---------------</OPTION>
													</SELECT>
												</TD>
												<TD>
													<a id="addSetColumnLink" href="javascript:void(0);" onclick="addSetColumn();" class="addbtn">
														<span>
															<img src="../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absmiddle">
															&nbsp;<UI:CLabel runat="server" Text="DecisionTable_AddColumn" id="lblAddSetColumn" />&nbsp;
															<img src="../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absmiddle">
														</span>
													</a>
												</TD>
											</TR>
											<TR height="25px" id="line">
												<TD colspan="4">
													<TABLE cellspacing="0" cellpadding="0" width="100%" border="0">
														<TR>
															<TD valign="top"><IMG src="../../img/WorkPortal/LeftGroup.jpg" border="0"></TD>
															<TD align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middleGroup.jpg"></TD>
															<TD valign="top"><IMG src="../../img/WorkPortal/GroupBorder.jpg" border="0"></TD>
															<TD align="right" class="GroupHeaderRight"><IMG id="ruleDesignTab1" alt="" src="../../img/WorkPortal/RightGroupExp.jpg" border="0"></TD>
														</TR>
													</TABLE>
												</TD>
											</TR>
											<TR>
												<TD colspan="4" >
													<DIV id="decisionTableOuterDiv"class="decisionTablePanel" ms_positioning="GridLayout">
														<DIV id="decisionTableDiv" style="position:relative;height:100%;width:100%"></DIV>
													</DIV>
													<DIV id="rulePreviewDiv" class="rulePreviewPanel" ms_positioning="FlowLayout">
													</DIV>
												</TD>
											</TR>
											<TR height="25px">
												<TD colspan="3">
												</TD>
												<TD align="right" valign="top">
													<TABLE>
														<TR>
															<TD>
																<UI:CWPHtmlInputButton id="btnReloadDT" runat="server" Value="DecisionTable_BtnReload" onclick="reloadDecisionTable(); "/>
															</TD>
															<TD>
																<UI:CWPHtmlInputButton id="btnSaveDT" runat="server" Value="DecisionTable_BtnSave" onclick="saveDecisionTable(); "/>
															</TD>
														</TR>
													</TABLE>
												</TD>
											</TR>
										</TABLE>
									</DIV>
									<!-- /decision table panel content-->
								</TD>
							</TR>

						</TABLE>
					</DIV>
					<!-- /Main div -->
				</TD>
			</TR>
				
			<!-- HIDDEN STUFF-->
			<TR style="DISPLAY: none; WIDTH: 100%; HEIGHT: 0%">
				<TD>
					<DIV id="hiddenDiv" style="VISIBILITY: hidden">
						<DIV id="addRowHtml" style="VISIBILITY: hidden">
							<a id="addNewRowLink" href="javascript:void(0);" onclick="addNewRow();" class="addbtn">
								<span>
									<img src="../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absmiddle">
									&nbsp;<UI:CLabel runat="server" Text="DecisionTable_AddRow" id="lblAddRow" />&nbsp;
									<img src="../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absmiddle">
								</span>
							</a>
						</DIV>													
						<DIV id="columnHtml">
							<DIV id="column" class="column" ms_positioning="GridLayout" >
								<DIV id="columnBox" class="columnBox"
									 oncontextmenu="return BAShowContextMenu(event,'popupMenuColumn',this);" 
									 idCM="columnBox">
								</DIV>
								<DIV id="columnDivision" class="columnDivision" onmousedown="beginResize(event);"></DIV>
							</DIV>
						</DIV>
						<DIV id="cellHtml">
							<DIV id="cell" class="cell" >
								<DIV id="cellOperatorBox" class="cellOperatorBox"
									 onmouseover="showOperatorEditor(this.parentNode);">
								</DIV>
								<DIV id="cellBox"  class="cellBox"
									oncontextmenu="return BAShowContextMenu(event, getPopupMenu(this),this);" 
									idCM="cellBox"
									ondblclick="editCell(this.parentNode)"
									onmouseover="hideOperator(this.parentNode);" 
									onclick="selectRow(this.parentNode);">
								</DIV>
								<DIV id="cellDeleteBox" class="cellDeleteBox" onclick="deleteCellByButton(this.parentNode)">
								</DIV>
							</DIV>
						</DIV>
						<DIV id="datetimeEditorHtml">
								<INPUT class="mask BgInput" id="dateTimeEditor" name="dateTimeEditor" preset="shortdate">
								<A	class="so-BtnLink" 
									onclick="showCalendar('frmDatetime','dateTimeEditor','BTN_date',false, event, null, null, null, null, null, null, 'focusDatetimeEditor(\'dateTimeEditor\');');return false;"
									tabIndex="-1" 
									href="javascript:void(0);">
									<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date">
								</A>
						</DIV>
						<DIV id="textEditorHtml">
							<input id="textEditor" preset="text" CLASS="mask BgInput" type="text" style="height:100%; width:100%">
						</DIV>
						<DIV id="numericEditorHtml">
							<input type="text" id="numericEditor" preset="number" CLASS="mask BgInput" style="height:100%; width:100%">
						</DIV>
						<DIV id="booleanEditorHtml">
							<UI:CLabel runat="server" Text="BusinessPolicies_True" id="lblConstantTrue" /> &nbsp;<input type="radio" id="booleanEditor" name="booleanEditor" value="True">
							&nbsp;&nbsp; 
							<UI:CLabel runat="server" Text="BusinessPolicies_False" id="lblConstantFalse" /> &nbsp;<input type="radio" id="booleanEditor" name="booleanEditor" value="False">
						</DIV>
						<DIV id="comboEditorHtml">
							<SELECT id="comboEditor" class="comboEditor">
									<OPTION value="0" selected>---------------</OPTION>
							</SELECT>							
						</DIV>
						<DIV id="operatorComboHtml">
							<SELECT id="operatorCombo" style="WIDTH: 48px; HEIGHT:100%">
							</SELECT>
						</DIV>
					</DIV>
				</TD>
			</TR>
		</TABLE>
		<!-- Main table -->
		<!-- Context menus -->
		<%=GetColumnContextMenu()%>
		<%=GetCellContextMenu()%>
		<%=GetDuplicableCellContextMenu()%>
		</FORM>
		<SCRIPT>
		
		// Lock controls on read only mode
		<% if (GetDecisionTableVO().Editable == false) { %>
			lockPageControls();
		<% } %>
		
		// Load decision table
		loadDecisionTable('<%=GetDecisionTableXML()%>');
		
		// Load combos
		<%=GetDefinitionComboScript("getDefinitionCombo", EDestinationUse.Get)%>
		<%=GetDefinitionComboScript("setDefinitionCombo", EDestinationUse.Set)%>
		<%=GetOperatorComboScript("operatorCombo")%>
		
		initContextMenu();
		</SCRIPT>
	</BODY>			
</html>
