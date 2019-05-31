<%@ Control Language="c#" AutoEventWireup="false" Codebehind="WPLeftPanelHeaderBar.ascx.cs" Inherits="BizAgiBPM.WorkPortal.WPLeftPanelHeaderBar" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>

<tr style="HEIGHT:1px;cursor:pointer" BARef="<%=HRef%>" BAName="<%=BAName%>" onClick="BAShowData('<%=BAName%>')" valign="top">
	<td  <% if (! IsFirstImage){%>	
	 <%}%>>	
	<% if (! IsFirstImage){%>
		<div class="generalTab" >			
	<%}%>
	<% if (IsFirstImage){%>
		<div class="generalTab" style="background-image: url(../img/WorkPortal/Frames/LeftTabBg1.jpg);">			
	<%}%>
		
			<img id="BAImg<%=BAName%>" src="../img/WorkPortal/Frames/HeaderUp.gif" width="0" height="0" alt="Click for close this tab" class="iconImg" border="0"/>
			<IMG src='../img/WorkPortal/Frames/<%=BAImageName%>' width="16" height="16" class="iconImg" alt="Look for this cases" idCM="" border="0">
			<SPAN class="TabDisplayName BAHlColor">
				<%=BADisplayName%>
			</SPAN>
			<a href="javascript:void(0);" class="TabRefresh" onclick="BARefreshParentFrame('ifr<%=BAName%>');">
			&nbsp;
			</a>

		</div>		
		<iframe style="WIDTH:100%;display:none" name="ifr<%=BAName%>" id="ifr<%=BAName%>" frameborder="0">
		</iframe>
	</td>
</tr>
