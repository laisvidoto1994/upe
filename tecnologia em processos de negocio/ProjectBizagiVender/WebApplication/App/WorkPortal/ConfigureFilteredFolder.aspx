<%@ Page language="c#" Codebehind="ConfigureFilteredFolder.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.WorkPortal.ConfigureFilteredFolder" %>

<HTML>
	<HEAD>
		<title>ConfigureFilteredFolder</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">		
		
		<%WriteHead();%>
		
		<script language="javascript">
		var idCurrentWfClass = <%= idCurrentWFClass%>;
		var idCurrentVariable = null;
		
		function RemoveSpecialCharacters(){
			GetObject('txtName').value = GetObject('txtName').value.replace(/#/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/"/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/&/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/'/g,"");
		}
		
		function SubmitForm() {
			var theform;
			GetObject("h_Tab").value = CurrentTab;
			if (window.navigator.appName.toLowerCase().indexOf("netscape") > -1) {
				theform = document.forms["Form1"];
			}
			else {
				theform = document.Form1;
			}
			theform.submit();
		}
		function OnAllCasesClick(){
		   if(!GetObject('rblCasesToDisplay_0').checked){
		       GetObject('linkAdvancedOptions').style.visibility="visible";
		   }
		   else{
				GetObject('linkAdvancedOptions').style.visibility="hidden";
				ShowAdvanceOptions(false);
		   }
		   
		}
		function ShowAdvanceOptions(bshow){
		   if (bshow){
			GetObject('trCaseDateLabel').style.display = "inline";
			GetObject('trCaseDate').style.display = "inline";
		   }
		   else{
			GetObject('trCaseDateLabel').style.display = "none";
			GetObject('trCaseDate').style.display = "none";
		   }
		}
		function EditProcessConditionCallBack(oValue){
			var bEdit = true;			
			if (idCurrentVariable == 'IDWFCLASS' &&
		    idCurrentWfClass != -1){		    		    
				if (!confirm("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersProcessWarning") %>")){
					bEdit = false;
				}
		    } 
			if (bEdit && oValue != null && typeof(oValue) != 'undefined'){
		       GetObject('h_Button').value = "btnEditProcess";
		       GetObject('h_Filter').value = oValue;
		       SubmitForm();
		   }
		}
		function EditProcessCondition(sData,currentVar){
			idCurrentVariable = currentVar;
		   var idApplication = GetObject("cmbApplication").value;
   		   ShowBAWindowModal('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationProcessData") %>',400,400,'FolderProcessFilter.aspx?idApp='+idApplication+'&'+sData,EditProcessConditionCallBack);		  
		 

		}
		function EditBusinessConditionCallBAck(oValue){		
		 if (oValue != null && typeof(oValue) != 'undefined'){
		       GetObject('h_Button').value = "btnEditBusiness";
		       GetObject('h_Filter').value = oValue;
		       SubmitForm();
		   }
		}
		function EditBusinessCondition(sData,currentVar){
		   var idApplication = GetObject("cmbApplication").value;
		   idCurrentVariable = null;
		   
  		  ShowBAWindowModal('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBusinessData") %>',400,400,'FolderBusinessFilter.aspx?idApp='+idApplication+"&idWfClass="+idCurrentWfClass+'&'+sData,EditBusinessConditionCallBAck);		  

		}
		function RemoveBusinessCondition(sVariableId,currentVar){
		       GetObject('h_Button').value = "btnRemoveBusiness";
		       GetObject('h_Filter').value = sVariableId;
		       SubmitForm();
		}
		function RemoveProcessCondition(sInternal,currentVar){
				var bEdit = true;			
				if (currentVar == 'IDWFCLASS' &&
				idCurrentWfClass != -1){		    		    
					if (!confirm("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersProcessWarning") %>")){
						bEdit = false;
					}
				} 
				if (bEdit){
					GetObject('h_Button').value = "btnRemoveProcess";
					GetObject('h_Filter').value = sInternal;
					SubmitForm();
				}
		}
		function AddProcessConditionCallBack(oValue){
			if (oValue != null && typeof(oValue) != 'undefined'){
		       GetObject('h_Button').value = "btnNewProcess";
		       GetObject('h_Filter').value = oValue;
		       SubmitForm();
		   }
		}
		function AddProcessCondition(){
		   var idApplication = GetObject("cmbApplication").value;		   
   		   ShowBAWindowModal('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationProcessData") %>',400,400,'FolderProcessFilter.aspx?idApp='+idApplication,AddProcessConditionCallBack);
		   
		}
		function AddBusinessConditionCallBack(oValue){
			if (oValue != null && typeof(oValue) != 'undefined'){
		       GetObject('h_Button').value = "btnNewBusiness";
		       GetObject('h_Filter').value = oValue;
		       SubmitForm();
		   }
		}
		function AddBusinessCondition(){
		   var idApplication = GetObject("cmbApplication").value;		   
		   ShowBAWindowModal('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBusinessData") %>',400,400,'FolderBusinessFilter.aspx?idApp='+idApplication+"&idWfClass="+idCurrentWfClass,AddBusinessConditionCallBack);
		  
		}
		function SaveWPQuery(){
		       if (GetObject('txtName').value == ""){
				    setHelp(document.sDefHelpTitle, '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersNameWarning") %>', document.iDefHelpType);			
		       }
		       else{							
				GetObject('h_Button').value = "btnSave";		
				SubmitForm();
		       }
		}
		function RefreshSmartFolders(){
			parent.BALeftPanel.BARefreshData('BASmartFolders');
		}
		function ValidateApplication(){
			var cmbApp = document.getElementById("cmbApplication");
			if(cmbApp.value == "-1"){
				document.getElementById("MessageWithApp").style.display="none";
				document.getElementById("MessageWithoutApp").style.display="block";
				document.getElementById("AddBusinessRule").style.display="none";
				
			}
			else{
				document.getElementById("MessageWithApp").style.display="block";
				document.getElementById("MessageWithoutApp").style.display="none";
				document.getElementById("AddBusinessRule").style.display="block";

			}
		}
		</script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
		<LINK href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">
		


	</HEAD>
	<body onload="BAonload();ValidateApplication();" MS_POSITIONING="FlowLayout">
		<form id="Form1" method="post" runat="server">
			<table width="100%" border="0">
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationHeader") %></td>
				</tr>
				<tr>
					<td colSpan="2">
						<table width="100%" border="0">
							<tr>
								<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationDescription") %><br>
								</td>
								<td><IMG src="../../img/WorkPortal/Folders/FolderConfigure.png"></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationFolderInfo") %>
					</td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationFolderName") %></b>
					</td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationFolderNameDesc") %>
					</td>
				</tr>
				<tr>
					<td></td>
					<td><asp:textbox id="txtName" MaxLength="50" runat="server"></asp:textbox></td>
				</tr>
				<tr>
					<td colSpan="2"><br>
					</td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBasicContent") %></b>
					</td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBasicContentInclude") %>
					</td>
				</tr>
				<tr>
					<td></td>
					<td onclick="OnAllCasesClick();">
					<asp:radiobuttonlist id="rblCasesToDisplay" runat="server">
						</asp:radiobuttonlist></td>
				</tr>
				<tr id="trCaseDateLabel" style="DISPLAY: none">
					<td></td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationShowCasesCreatedIn") %>
					</td>
				</tr>
				<tr id="trCaseDate" style="DISPLAY: none">
					<td></td>
					<td><asp:textbox id="txtMonths" runat="server" Width="40px" MaxLength="2">0</asp:textbox>&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationMonths") %> 
					    <asp:textbox id="txtDays" runat="server" Width="40px" MaxLength="2">0</asp:textbox>&nbsp;days
						&nbsp;&nbsp;<A href="javascript:ShowAdvanceOptions(false);"> (<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationHideDetails") %>)</A>
                        <asp:RangeValidator ID="valMonths" runat="server" ControlToValidate="txtMonths" ErrorMessage="Incorrect months number"
                            MinimumValue="0" Type="Integer" MaximumValue="10000"></asp:RangeValidator>
                        <asp:RangeValidator ID="valDays" runat="server" ControlToValidate="txtDays" ErrorMessage="Incorrect days number"
                            MaximumValue="30" MinimumValue="0" Type="Integer"></asp:RangeValidator></td>
				</tr>
				<tr>
					<td></td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationIncludeApp") %></td>
				</tr>
				<tr>
					<td></td>
					<td><asp:dropdownlist id="cmbApplication" runat="server" Width="183px"></asp:dropdownlist>&nbsp;&nbsp;
						<asp:linkbutton id="lnkClearFilters" runat="server" ></asp:linkbutton></td>
				</tr>
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationRules") %></td>
				</tr>
				<tr>
					<td colSpan="2">
						<TABLE cellSpacing="0" cellPadding="0" width="100%" border="0">
							<TR>
								<TD><SPAN id="TabHTML"></SPAN></TD>
							</TR>
							<SCRIPT language="JavaScript">var DefaultTab = 0;
							var CurrentTab = 0;
							var TabNames = new Array();
							TabNames[0]='<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBusinessData") %>';
							TabNames[1]='<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationProcessData") %> ';
							</SCRIPT>
							<TR>
								<TD bgColor="#ffffff"> <!--T1-->
									<DIV id="xpTab1">
										<TABLE style="BORDER-RIGHT: #d8d2bd 1px solid; BORDER-LEFT: #d8d2bd 1px solid; BORDER-BOTTOM: #d8d2bd 1px solid"
											cellSpacing="0" cellPadding="4" width="100%" border="0" valign="top">
											<tr>
												<td colSpan="2">
												<span id="MessageWithApp">
												<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationBusinessDataToInclude") %>
												</span>
												<span id="MessageWithoutApp">
												<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationAppWarning") %>
												</span>
												</td>
											</tr>
											<tr>
												<td colSpan="2"><asp:datagrid id="dgBusinessFilter" runat="server" AutoGenerateColumns="False">
														<AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
														<ItemStyle CssClass="gridline1"></ItemStyle>
														<HeaderStyle CssClass="header"></HeaderStyle>
														<Columns>
															<asp:BoundColumn DataField="VariableName" HeaderText=""></asp:BoundColumn>
															<asp:BoundColumn DataField="VariableDisplayValues" HeaderText=""></asp:BoundColumn>
															<asp:BoundColumn DataField="EditLink"></asp:BoundColumn>
															<asp:BoundColumn DataField="RemoveLink"></asp:BoundColumn>
														</Columns>
													</asp:datagrid><br>
													<A id="AddBusinessRule" href="javascript:AddBusinessCondition()"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationAddBusinessRule") %></A>
												</td>
											</tr>
										</TABLE>
									</DIV> <!--T1--> <!--T3-->
									<DIV id="xpTab2">
										<TABLE style="BORDER-RIGHT: #d8d2bd 1px solid; BORDER-LEFT: #d8d2bd 1px solid; BORDER-BOTTOM: #d8d2bd 1px solid"
											cellSpacing="0" cellPadding="4" width="100%" border="0" valign="top">
											<tr>
												<td colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationProcessDataToInclude") %>
												</td>
											</tr>
											<tr>
												<td colSpan="2"><asp:datagrid id="dgProcessFilter" runat="server" AutoGenerateColumns="False">
														<AlternatingItemStyle CssClass="gridline2"></AlternatingItemStyle>
														<ItemStyle CssClass="gridline1"></ItemStyle>
														<HeaderStyle CssClass="header"></HeaderStyle>
														<Columns>
															<asp:BoundColumn DataField="VariableName" HeaderText="Data"></asp:BoundColumn>
															<asp:BoundColumn DataField="VariableDisplayValues" HeaderText="Values"></asp:BoundColumn>
															<asp:BoundColumn DataField="EditLink"></asp:BoundColumn>
															<asp:BoundColumn DataField="RemoveLink"></asp:BoundColumn>
														</Columns>
													</asp:datagrid><br>
													<A href="javascript:AddProcessCondition()"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationAddProcessRule") %></A><INPUT id="h_Button" type="hidden" value="test" runat="server"><INPUT id="h_Filter" type="hidden" value="test" name="h_Filter" runat="server">
													<asp:textbox id="h_Tab" runat="server"></asp:textbox></td>
											</tr>
										</TABLE>
									</DIV> <!--T3--></TD>
							</TR>
						</TABLE>
					</td>
				</tr>
				<tr>
					<td colSpan="2">
						<%
				H.WPButton("button","btnSave",BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationSave"),"Save","sbttn","onclick='SaveWPQuery();'");
				%>
					</td>
				</tr>
			</table>
			<script languaje='javscript'>
			OnAllCasesClick();
			DefaultTab = GetObject("h_Tab").value;
			var oHelp = '<%=FolderConfigurationHelp%>';
			document.sDefHelpTitle='<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigHelpHeader") %>';
			document.sDefHelpText=oHelp;
			document.iDefHelpType=1;
			printWizardMagic("merlin1.gif");
			if (oHelp != ''){			    
			    setHelp(document.sDefHelpTitle, document.sDefHelpText, document.iDefHelpType);			
			}
			else{
				setHelp(document.sDefHelpTitle,"", document.iDefHelpType);			
			}

			<%=AditionalJavacriptCode%>
			</script>
			<script language="javascript">
					BASetLocationFromMain('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigHelpHeader") %>');
			</script>
		</form>
	</body>
</HTML>
