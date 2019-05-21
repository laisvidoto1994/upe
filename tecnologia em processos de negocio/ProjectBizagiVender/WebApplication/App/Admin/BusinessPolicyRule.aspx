<%@ Page language="c#" Codebehind="BusinessPolicyRule.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.BusinessPolicyRule" %>
<%@ Import namespace="BizAgi.Defs.BusinessPolicies"%>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Business Policy Rule</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/BusinessPolicies.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" src="../../js/CatMenu.js"></script>
		<script language="javascript" src="../../js/BizAgiAJAX.js"></script>
		<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyUtil.js"></script>
		<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyObjects.js"></script>
		<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyRule.js"></script>
		<STYLE>
		body {
			margin: 10px;
			color:#666666;
			font: 10px Verdana, Arial, Helvetica, sans-serif;
			text-decoration: none;
		}
		</STYLE>
	</HEAD>
	<body onclick="BAonclick(event)" onload="BAonload()">
		<DIV class="text" id="popupcalendar"></DIV>
		<style>.mask { BEHAVIOR: url(WMask.htc) }
		</style>
		<form id="frmPolicyRule" method="post" runat="server">
			<input type="hidden" name="policyRuleXml" id="policyRuleXml"> 
			<input type="hidden" name="saveRule" id="saveRule" value="false">
			<!-- Main table -->
			<TABLE cellSpacing="2" cellPadding="2" width="100%" border="0">
				<TR>
					<TD align="center">
						<!-- Main div -->
						<DIV class="BAXPTab">
							<TABLE class='BAXPTabTable' style='BORDER-TOP: 1px solid;' cellSpacing="2" cellPadding="2" width="90%" bordercolor="#CCCCCC">
								<TR>
									<TD colspan="2">
										<!-- General properties panel header-->
										<TABLE cellspacing="0" cellpadding="0" width="100%" border="0">
											<TR id="generalPropertiesTab">
												<TD valign="top"><IMG src="../../img/WorkPortal/LeftGroup.jpg" border="0"></TD>
												<TD align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middleGroup.jpg">
													<UI:CLabel runat="server" Text="BusinessPolicyRule_PolicyRuleGeneralProperties" id="lblPolicyRuleGeneralProperties" />
												</TD>
												<TD valign="top"><IMG src="../../img/WorkPortal/GroupBorder.jpg" border="0"></TD>
												<TD align="right" class="GroupHeaderRight" onmouseover="setBorder('generalProperties',true);" onmouseout="setBorder('generalProperties',false);" onclick="showHideContent('generalProperties', event);"><IMG id="generalPropertiesTab1" alt="" src="../../img/WorkPortal/RightGroupExp.jpg" border="0"></TD>
											</TR>
										</TABLE>
										<!-- /General properties panel header-->
										<!-- General properties panel content-->
										<DIV id="generalPropertiesContent">
											<TABLE cellspacing="2" cellpadding="2" width="100%" border="0">
												<TR>
													<TD class="label">
														<UI:CLabel runat="server" Text="BusinessPolicyRule_PolicyName" id="lblName" />
													</TD>
													<TD>
														<INPUT type="text" class="mask BgInput" preset="texto" id="policyRuleName" name="policyRuleName" value="<%=GetPolicyRuleVO().Name%>" maxlength="26"/>
													</TD>
														<TD class="label">
															<UI:CLabel runat="server" Text="BusinessPolicyRule_PolicyDisplayName" id="lblDisplayName" />
														</TD>
													</TD>
													<TD>
														<INPUT type="text" class="mask BgInput" preset="texto" id="policyRuleDisplayName" name="policyRuleDisplayName" value="<%=GetPolicyRuleVO().DisplayName%>" maxlength="40" />
													</TD>
												</TR>
												<TR>
													<TD class="label">
														<UI:CLabel runat="server" Text="BusinessPolicyRule_PolicyDescription" id="lblDescription" />
													</TD>
													<TD>
														<INPUT id="policyRuleDescription" class="mask BgInput" preset="texto" name="policyRuleDescription" value="<%=GetPolicyRuleVO().Description%>" maxlength="100" />
													</TD>
													<TD class="label">
														<UI:CLabel runat="server" Text="BusinessPolicyRule_EnabledFrom" id="lblEnabledFrom" />
													</TD>
													<TD>
														<INPUT class="mask BgInput" id="policyRuleEnabledFromDate" name="policyRuleEnabledFromDate" preset="shortdate" value="<%=GetPolicyRuleVO().EnabledFromDate.ToShortDateString()%>">
														<A id="policyRuleEnabledFromDateLink" name="policyRuleEnabledFromDateLink" class="so-BtnLink" onclick="showCalendar('frmPolicyRule','policyRuleEnabledFromDate','BTN_date',false, event, null, null, null, null, null, null);return false;"	tabindex="-1" href="javascript:void(0);">
														<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date"></A>
													</TD>
												</TR>
												<TR>
													<TD class="label">
														<UI:CLabel runat="server" Text="BusinessPolicyRule_Priority" id="lblPriority" />
													</TD>
													<TD>
														<INPUT type="text" id="policyRulePriority" name="policyRulePriority" preset="int" retype="false" class="mask BgInput" value="<%=GetPolicyRuleVO().Priority.ToString()%>">
													</TD>
													<TD class="label">
														<UI:CLabel runat="server" Text="BusinessPolicyRule_EnabledTo" id="lblEnabledTo" />
													</TD>
													<TD>
														<INPUT class="mask BgInput" id="policyRuleEnabledToDate" name="policyRuleEnabledToDate" preset="shortdate" value="<%=GetPolicyRuleVO().EnabledToDate.ToShortDateString()%>">
														<A id="policyRuleEnabledToDateLink" name="policyRuleEnabledToDateLink" class="so-BtnLink" onclick="showCalendar('frmPolicyRule','policyRuleEnabledToDate','BTN_date',false, event, null, null, null, null, null, null);return false;"	tabindex="-1" href="javascript:void(0);">
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
														<UI:CLabel runat="server" Text="BusinessPolicyRule_Enabled" id="lblEnabled" />
													</TD>
													<TD>
														<UI:CLabel runat="server" Text="BusinessPolicies_True" id="lblEnabledTrue" /> &nbsp;<INPUT type="radio" name="policyRuleEnabled" value="true" <%= (GetPolicyRuleVO().Enabled == true) ? "CHECKED" : "" %> > &nbsp;&nbsp; 
														<UI:CLabel runat="server" Text="BusinessPolicies_False" id="lblEnabledFalse" /> &nbsp;<INPUT type="radio" name="policyRuleEnabled" value="false" <%= (GetPolicyRuleVO().Enabled == false) ? "CHECKED" : "" %> >
													</TD>
												</TR>
											</TABLE>
										</DIV>
										<!-- /General properties panel content-->
									</TD>
								</TR>
								<TR>
									<TD colspan="2">
										<!-- rule panel header-->
										<TABLE cellspacing="0" cellpadding="0" width="100%" border="0">
											<TR id="ruleDesignTab">
												<TD valign="top"><IMG src="../../img/WorkPortal/LeftGroup.jpg" border="0"></TD>
												<TD align="right" class="GroupHeader" width="100%" background="../../img/WorkPortal/middleGroup.jpg">
													<UI:CLabel runat="server" Text="BusinessPolicyRule_PolicyRuleEditor" id="lblPolicyRuleEditor" />
												</TD>
												<TD valign="top"><IMG src="../../img/WorkPortal/GroupBorder.jpg" border="0"></TD>
												<TD align="right" class="GroupHeaderRight" onmouseover="setBorder('ruleDesign',true);" onmouseout="setBorder('ruleDesign',false);" onclick="showHideContent('ruleDesign', event);"><IMG id="ruleDesignTab1" alt="" src="../../img/WorkPortal/RightGroupExp.jpg" border="0"></TD>
											</TR>
										</TABLE>
										<!-- /rule panel header-->
										<!-- rule panel content-->
										<DIV id="ruleDesignContent" >
											<!-- rule full container -->
											<TABLE class="policyRule" height="100%" cellspacing="1" cellpadding="1" width="100%" border="0">
												<!-- if container -->
												<TR height="50">
													<TD align="left" valign="top" colspan="3">
														<TABLE width="100%" height="50"  border="0" cellpadding="0" cellspacing="0">
															<TR>
																<TD width="46">
																	<SPAN class="ifThenLabel">
																		<UI:CLabel runat="server" Text="BusinessPolicies_If" id="lblIf" />
																	</SPAN>
																	<!--<IMG src=../../img/BusinessPolicies/If.gif width="26" height="30" hspace="10" vspace="10">-->
																</TD>
																<TD width="*">
																	<P>
																		<LABEL>
																			<INPUT type="radio" class="conditionType" name="conditionTypeOption" onclick="changeConditionType(this.value)" value="1" checked>
																			<UI:CLabel runat="server" Text="BusinessPolicyRule_AndLabel" id="lblAndOption" />
																		</LABEL>
																		<BR>
																		<LABEL>
																			<INPUT type="radio" class="conditionType" name="conditionTypeOption" onclick="changeConditionType(this.value)" value="2">
																			<UI:CLabel runat="server" Text="BusinessPolicyRule_OrLabel" id="lblOrOption" />
																		</LABEL>
																		<BR>
																	</P>
																</TD>
															</TR>
														</TABLE>
													</TD>
												</TR>
												<TR>
													<TD colspan="3">
														<TABLE height="90%" width="100%">
															<TR align="left" valign="top">
																<TD width="81">
																	<SPAN id="conditionType">
																		<SPAN class="fondAndOrLabel">
																			<b id="andLabel"  class="andOrLabel">
																				<UI:CLabel runat="server" Text="BusinessPolicies_And" id="lblAnd" />																				
																			</b>
																			<b id="orLabel" class="andOrLabel" style="display:none">
																				<UI:CLabel runat="server" Text="BusinessPolicies_Or" id="lblOr" />
																			</b>
																		</SPAN>
																		<INPUT type="hidden" id="conditionType_value" name="conditionType_value" value="1">
																	</SPAN>
																</TD>
																<TD width="95%">
																	<DIV id="divIf" class="ifThenBox" ms_positioning="FlowLayout"><BR>
																		
																	</DIV>
																</TD>
															</TR>
														</TABLE>
													</TD>
												</TR>
												<!-- /if container -->
												<!-- then container -->
												<TR>
													<TD>
														<TABLE height="100%" cellspacing="1" cellpadding="1" width="100%" border="0">
															<TR>
																<TD align="left" valign="top" colspan="2">
																	<SPAN class="ifThenLabel">
																		<UI:CLabel runat="server" Text="BusinessPolicies_Then" id="lblThen" />
																	</SPAN>
																	<!--<IMG src=../../img/BusinessPolicies/Then.gif width="81" height="30">-->
																</TD>
															</TR>
															<TR>
																<TD width="81"  height="148">&nbsp;</TD>
																<TD >
																	<DIV id="divThen" class="ifThenBox" ms_positioning="FlowLayout"><BR>
																	</DIV>
																</TD>
															</TR>
														</TABLE>
													</TD>	
												</TR>
												<!-- /then container -->
											</TABLE>
											<!-- /rule full container -->
										</DIV>								
										<!-- /rule panel content-->
									</TD>
								</TR>
								<!-- Buttons row -->
								<TR>
									<TD width="50%">	
										
									</TD>
									<TD align="right">
										<TABLE>
											<TR>
												<TD>
													<UI:CWPHtmlInputButton id="btnReloadRule" runat="server" Value="BusinessPolicyRule_BtnReload" onclick="reloadPolicyRule(); "/>
												</TD>
												<TD>
													<UI:CWPHtmlInputButton id="btnSaveRule" runat="server" Value="BusinessPolicyRule_BtnSave" onclick="savePolicyRule(); "/>
												</TD>
											</TR>
										</TABLE>
									</TD>							
								</TR>
								<!-- /Buttons row -->
							</TABLE>
						</DIV>
						<!-- /Main div -->
					</TD>
				</TR>
				<!-- Set all invisible stuff here -->
				<TR style="DISPLAY: none" height="0%">
					<TD colspan="2">
						<!-- hidden operator control -->
						<DIV id="argumentHtml" style="VISIBILITY: hidden">
							<SPAN id="argument" onmouseover="hoverElement(this)" class="argument" onclick="editArgument(this)"
								onmouseout="unhoverElement(this)">
								<SPAN id="argument_value" class="argumentValue">
								</SPAN>
							</SPAN>
						</DIV>
						<!-- hidden operator control -->
						<DIV id="operatorHtml" style="VISIBILITY: hidden">
							<SPAN id="operator" onmouseover="hoverElement(this)" class="operator" onclick="editOperator(this)"
								onmouseout="unhoverElement(this)">
								<SPAN id="operator_value" class="operatorValue"></SPAN> 
							</SPAN>
						</DIV>
						<!-- hidden set definition control -->
						<DIV id="setDefinitionHtml" style="VISIBILITY: hidden">
							<SPAN id="setDefinition" onmouseover="hoverElement(this)" class="setDefinition" onclick="editSetDefinition(this)"
								onmouseout="unhoverElement(this)">
								<SPAN id="setDefinition_value" class="setDefinitionValue"></SPAN>
							</SPAN>
						</DIV>
						<!-- hidden condition control -->
						<DIV id="conditionHtml" style="VISIBILITY: hidden">
							<DIV id="condition" class="condition" class="condition">
								<IMG class="rowArrow" src="../../img/BusinessPolicies/arrowindicator.gif" width="16" height="16" align="absmiddle">
								<A href="javascript:void(0);" onclick="deleteCondition(this.parentNode)" id="imgDeleteCondition"  class="deleteRow">&nbsp;</A>
							</DIV>
						</DIV>
						<DIV id="addConditionHtml" style="VISIBILITY: hidden">
							<BR>
							<a d="btnAddCondition" href="javascript:void(0);" onclick="addCondition();" class="addbtn">
								<span>
									<img src="../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absmiddle">
									&nbsp;<UI:CLabel runat="server" Text="BusinessPolicyRule_AddCondition" id="lblAddCondition" />&nbsp;
									<img src="../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absmiddle">
								</span>
							</a>
						</DIV>
						<!-- hidden execution statement control -->
						<DIV id="executionStatementHtml" style="VISIBILITY: hidden">
							<DIV id="executionStatement" class="executionStatement" class="executionStatement" >
								<IMG class="rowArrow" src="../../img/BusinessPolicies/arrowindicator.gif" width="16" height="16" align="absmiddle">
								<A href="javascript:void(0);" onclick="deleteExecutionStatement(this.parentNode)" id="imgDeleteExecutionStatement"  class="deleteRow">&nbsp;</A>
							</DIV>
						</DIV>
						<DIV id="addExecutionStatementHtml" style="VISIBILITY: hidden">
							<BR>
							<a d="btnAddExecutionStatement" href="javascript:void(0);" onclick="addExecutionStatement();" class="addbtn">
								<span style="height:20px">
									<img src="../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absmiddle">
									&nbsp;<UI:CLabel runat="server" Text="BusinessPolicyRule_AddExecutionStatement" id="lblAddExecutionStatement" />&nbsp;
									<img src="../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absmiddle">
								</span>
							</a>
						</DIV>
						<!-- Select operator window -->
						<DIV id="divEditOperator">
							<DIV class="popupDiv" style="WIDTH: 250px; HEIGHT: 150px" ms_positioning="FlowLayout">
								<TABLE style="WIDTH: 100%; HEIGHT: 100%" cellspacing="0" cellpadding="0" border="0">
									<TR>
										<TD colspan="2" class="label" valign="bottom">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectOperator" id="lblSelectOperator" />
										</TD>
									</TR>
									<TR>
										<TD align="right">
											<SELECT id="editOperatorCombo" style="WIDTH: 70%">
												<OPTION value="0" selected>---------------</OPTION>
											</SELECT>
										</TD>
									</TR>
									<TR>
										<TD align="right" valign="bottom">
											<TABLE>
												<TR>
													<TD>
														<UI:CWPHtmlInputButton id="btnCancelOperator" runat="server" Value="BtnCancel" onclick="cancelPopup(getParentDiv(this, 'divEditOperator')); "/>
													</TD>
													<TD>
														<UI:CWPHtmlInputButton id="btnOKOperator" runat="server" Value="BusinessPolicyRule_BtnOK" onclick="selectOperator(getParentDiv(this, 'divEditOperator'));"/>
													</TD>
												</TR>
											</TABLE>
										</TD>
									</TR>
								</TABLE>
							</DIV>
						</DIV>
						<!-- Select definition window -->
						<DIV id="divEditDefinition">
							<DIV style="WIDTH:350px; HEIGHT:150px" class="popupDiv" ms_positioning="FlowLayout">
								<TABLE style="WIDTH: 100%; HEIGHT: 100%" cellspacing="0" cellpadding="0" border="0">
									<TR>
										<TD colspan="2" class="label" valign="bottom">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectDefinition" id="lblSelectDefinition" />
										</TD>
									</TR>
									<TR>
										<TD  align="right">
											<SELECT id="setDefinitionCombo" style="WIDTH: 70%">
												<OPTION value="0" selected>---------------</OPTION>
											</SELECT>
										</TD>
									</TR>
									<TR>
										<TD align="right" valign="bottom">
											<TABLE>
												<TR>
													<TD>
														<UI:CWPHtmlInputButton id="btnCancelDefinition" runat="server" Value="BtnCancel" onclick="cancelPopup(getParentDiv(this, 'divEditDefinition')); "/>
													</TD>
													<TD>
														<UI:CWPHtmlInputButton id="btnOKDefinition" runat="server" Value="BusinessPolicyRule_BtnOK" onclick="selectDefinition(getParentDiv(this, 'divEditDefinition'));"/>
													</TD>
												</TR>
											</TABLE>
										</TD>
									</TR>
								</TABLE>
							</DIV>
						</DIV>
						<!-- Select argument window -->
						<DIV id="divEditArgument">
							<DIV style="WIDTH: 500px; HEIGHT: 150px" class="popupDiv" ms_positioning="FlowLayout">
								<!-- datatype 1=text, 2=datetime, 3=numero, 4= boolean--><INPUT id="dataType" type="hidden" value="1">
								<TABLE style="WIDTH: 100%; HEIGHT: 100%" cellspacing="0" cellpadding="0" border="0">
									<TR>
										<TD width="40%" class="label">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectArgumentType" id="lblSelectArgumentType" />
										</TD>
										<TD width="60%" align="right">
											<SELECT id="argumentTypeCombo" style="WIDTH: 70%" onchange="selectArgumentType(this)">
												<OPTION value="0" selected>---------------</OPTION>
												<OPTION value="1"><UI:CLabel runat="server" Text="BusinessPolicyRule_ConstantValue" id="lblConstantValue" /></OPTION>
												<OPTION value="2"><UI:CLabel runat="server" Text="BusinessPolicyRule_Definition" id="lblDefinition" /></OPTION>
												<OPTION value="3"><UI:CLabel runat="server" Text="BusinessPolicyRule_Function" id="lblFunction" /></OPTION>
											</SELECT>
										</TD>
									</TR>
									<TR id="emptyRow" class="visibleRow">
										<TD colspan="2">&nbsp;</TD>
									</TR>
									<TR id="constantRow" class="hiddenRow">
										<TD width="40%" class="label">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectConstant" id="lblSelectConstant" />
										</TD>
										<TD width="60%" align="right">
											<!-- Text Editor --->
											<SPAN id="textControl" style="DISPLAY: none">
											<INPUT id="textEditor" type="text" class="mask BgInput" preset="texto" style="WIDTH: 70%">
											</SPAN>
											<!-- Datetime Editor -->
											<SPAN id="dateTimeControl" style="DISPLAY: none">
												<FORM id="frmDatetimeTemplate" >
													<INPUT class="mask BgInput" id="dateTimeEditor" name="dateTimeEditor" preset="shortdate" style="WIDTH: 63%">
													<A class="so-BtnLink" onclick="showCalendar('frmDatetime','dateTimeEditor','BTN_date',false, event, null, null, null, null, null, null);return false;" tabindex="-1" href="javascript:void(0);">
														<IMG height="16" src="../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date"></A>
												</FORM>													
											</SPAN>
											<!-- Numeric Editor -->
											<SPAN id="numericControl" style="DISPLAY:none"><INPUT type="text" id="numericEditor" preset="number" class="mask BgInput" style="WIDTH: 70%" >
											</SPAN>
											<!-- Boolean Editor -->
											<SPAN id="booleanControl" style="DISPLAY:none" >
											<UI:CLabel runat="server" Text="BusinessPolicies_True" id="lblConstantTrue" /> &nbsp;<INPUT type="radio" name="booleanEditor" value="true">
												&nbsp;&nbsp; 
												<UI:CLabel runat="server" Text="BusinessPolicies_False" id="lblConstantFalse" /> &nbsp;<INPUT type="radio" name="booleanEditor" value="false">
											</SPAN>
											<!-- Combo Editor -->
											<SPAN id="comboControl" style="DISPLAY:none" >
												<SELECT id="comboEditor" class="comboEditor" style="WIDTH: 70%" >
													<OPTION value="0" selected>---------------</OPTION>
												</SELECT>
											</SPAN>
										</TD>
									</TR>
									<TR id="definitionRow" class="hiddenRow">
										<TD width="40%" class="label">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectDefinition" id="lblSelectDefinitionFromCombo" />
										</TD>
										<TD width="60%" align="right">
											<SELECT id="getDefinitionCombo" style="WIDTH: 70%" >
												<OPTION value="0" selected>---------------</OPTION>
											</SELECT>
										</TD>
									</TR>
									<TR id="functionRow" class="hiddenRow">
										<TD width="40%" class="label">
											<UI:CLabel runat="server" Text="BusinessPolicyRule_SelectFunction" id="lblSelectFunction" />
										</TD>
										<TD width="60%" align="right">
											<SELECT id="selectFunctionCombo" style="WIDTH: 70%" onchange="selectFunction(this)">
												<OPTION value="0" selected>---------------</OPTION>
											</SELECT>
										</TD>
									</TR>
									<TR height="10%" id="functionDrawingRow" class="hiddenRow">
										<TD colspan="2" align="center">
											<DIV id="function" class="functionRow" align="center" ms_positioning="FlowLayout"></DIV>
										</TD>
									<TR>
										<TD>&nbsp;</TD>
										<TD align="right" valign="bottom">
											<TABLE>
												<TR>
													<TD>
														<UI:CWPHtmlInputButton id="btnCancelArgument" runat="server" Value="BtnCancel" onclick="cancelEditArgument(getParentDiv(this, 'divEditArgument')); "/>
													</TD>
													<TD>
														<UI:CWPHtmlInputButton id="btnOKArgument" runat="server" Value="BusinessPolicyRule_BtnOK" onclick="selectArgument(getParentDiv(this, 'divEditArgument'));"/>
													</TD>
												</TR>
											</TABLE>
										</TD>
									</TR>
								</TABLE>
							</DIV>
						</DIV>
					</TD>
				</TR>
				<!-- /Set all invisible stuff here -->
			</TABLE>
			<!-- Main table -->
		</form>
		<script>
		// Load combos
		<%=GetDefinitionComboScript("getDefinitionCombo", EDestinationUse.Get)%>
		<%=GetDefinitionComboScript("setDefinitionCombo", EDestinationUse.Set)%>
		<%=GetOperatorComboScript("editOperatorCombo")%>
		<%=GetFunctionComboScript("selectFunctionCombo")%>		
		
		// Lock controls on read only mode
		<% if (GetPolicyRuleVO().Editable == false) { %>
			lockPageControls();
		<% } %>
		
		// onload()
		loadPageVariables();
		
		// load rule code
		loadPolicyRule('<%=GetPolicyRuleXML()%>');
		
		</script>
	</body>
</HTML>
