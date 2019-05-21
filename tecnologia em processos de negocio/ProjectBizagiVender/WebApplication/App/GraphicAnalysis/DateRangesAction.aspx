<%@ Page language="c#" Codebehind="DateRangesAction.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.DateRangesAction" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 
<html>
  <head>
    <title>DateRangesAction</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    
    <script language="javascript">
		function ReturnToMainWindow(){
			//alert(window.parent.frames["header"].Filter_Tree.txtSelectionMade.value + " - " + window.parent.frames["header"].Filter_Tree.txtSelectedMember.value);
			window.parent.frames["header"].Filter_Tree.submit();
		}
	</script>
  </head>
  <body>	
    <form id="Form1" method="post" runat="server" >
			<table cellpadding="0" cellspacing="0" align="center" border="0">
				<tr valign="top">
					<td><INPUT type="button" onclick="ReturnToMainWindow()" style="FONT-WEIGHT: bold; FONT-SIZE: xx-small; WIDTH: 60px; FONT-FAMILY: Tahoma; HEIGHT: 19px" value="OK">&nbsp;&nbsp;<td>
					<td><INPUT type="button" onclick="javascript:window.close()" value="Cancel" style="FONT-WEIGHT: bold; FONT-SIZE: xx-small; WIDTH: 60px; FONT-FAMILY: Tahoma"></td>
				</tr>
				<tr style="display:none">
					<td>
						<asp:TextBox id="txtparameter" runat="server"></asp:TextBox>
					</td>
				</tr>
			</table>
     </form>	
  </body>
</html>
