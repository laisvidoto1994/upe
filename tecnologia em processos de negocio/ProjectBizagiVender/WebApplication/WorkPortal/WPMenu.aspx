<%@ Page CodeBehind="WPMenu.aspx.cs" Language="c#" AutoEventWireup="false" Inherits="BizAgiBPM.WorkPortal.WPMenu" %>
<%@ Register TagPrefix="uc1" TagName="WPMenuButton" Src="WPMenuButton.ascx" %>
<HTML>
	<HEAD>
		<TITLE>Ejemplo de la barra de menús desplegables, tercera versión</TITLE>
		<LINK rel="STYLESHEET" href="../css/WPMenu.css" type="text/css">
			<LINK rel="STYLESHEET" href="../css/Menu.css" type="text/css">
				<script language="JavaScript" src="../js/WorkPortal/WPToolBarMenu.js"></script>
				<script language="JavaScript" src="../js/scripts.js"></script>
				<SCRIPT language="javascript">				
	
var soporta = new DetectorNavegador();

var menu = new Array();
var menuActivo = null;
var wref = parent.BAMainFrame;

// Objeto Menu
function activarMenu() {
  if (soporta.DHTML && menuActivo != this) {
    if (menuActivo) menuActivo.ocultar();
    menuActivo = this;
    this.mostrar();
  }  
}
function BAGetPanelOffset(){
		if (parent.top.document.getElementById('ToggleSidePane').cols == "250,9,*"){
	       return 0;
	    }
	    else{
    		return 250;
	    }	    
	}
function mostrarMenu() {
  if (!eval(this.capaRefStr)) return;
  this.cambiarPosicion();
  //Para la opacidad
  top.BAMainFrame.initFade(this.capaID);
  //eval(this.capaRefStr + this.estiloRefStr + '.visibility = "visible"');
  
  if (soporta.DOM)
	this.domRef.style.display = "block";
}

function ocultarMenu() {
  if (!eval(this.capaRefStr)) return;
  if (!eval(this.iFrameStr)) return; 
  
  eval(this.capaRefStr + this.estiloRefStr + '.visibility = "hidden"');
  if (soporta.IE4){
	eval(this.iFrameStr + this.estiloRefStr + '.display = "none"');
  }
  
}

function cambiarPosicionMenu() {
  var bPos = BAGetPanelOffset(); 
  eval(this.capaRefStr + this.estiloRefStr + this.topRefStr + ' = this.top + ' + this.topOffsetStr);
  eval(this.capaRefStr + this.estiloRefStr + this.leftRefStr + ' = this.left + ' + this.leftOffsetStr+'+'+bPos);
}
// Manejo de eventos
function ocultarMenuActivo(e) {
  if (menuActivo) {
    menuActivo.ocultar();
    menuActivo = null;
  }
}

function moverMenuActivo(e) {
  if (menuActivo)
    menuActivo.cambiarPosicion();
}

// Inicializacion
function BAinitializeMenu() {
  if (soporta.DHTML) {
    if (soporta.NS4)
      document.captureEvents(Event.MOUSEUP);
    document.onmouseup = ocultarMenuActivo;
  }
  var iLeftMargin = 180;
  if (wref.document.getElementById("MenuCases")){
	menu["Cases"] = new Menu("MenuCases", 0, 193-iLeftMargin, 100);
  }
  if (wref.document.getElementById("MenuAnalyzer")){
	menu["Analyzer"] = new Menu("MenuAnalyzer", 0, 289-iLeftMargin, 100);
  }
  else{
	iLeftMargin = iLeftMargin+100;
  }
  if (wref.document.getElementById("MenuCookPit")){
	menu["CookPit"] = new Menu("MenuCookPit", 0, 390-iLeftMargin, 100);
  }
  else{
	iLeftMargin = iLeftMargin+113;
  }
  if (wref.document.getElementById("MenuAdmin")){
	menu["Admin"] = new Menu("MenuAdmin", 0, 490-iLeftMargin, 100);
  }
  
}

// -->
				</SCRIPT>
	</HEAD>
	<BODY leftmargin="0" topmargin="0">
		<BASE target="_top">
		<TABLE width="100%" border="0" cellspacing="0" cellpadding="0">
			<TR class="MenuBackgroundImage" height="1">
				<TD align="right"><img src="../img/WorkPortal/BanerBackColor.jpg" border="0" height="9" width="100%"></TD>
			</TR>
			<TR class="MenuBackgroundImage" height="23">
				<TD background="../img/img/barra/Background.gif">
					<Table border="0" cellspacing="0" cellpadding="0" width="100%" height="23">
						<tr>
							<td colspan="5" height="4">
							</td>
						</tr>
						<tr>
							<TD width="20"></TD>
							<TD nowrap width="100" align="left">
								<table border="0" bordercolor="red" cellpadding="0" cellspacing="0" width="100">
									<tr class="WPMenuButton" onmousemove="DrawButton(this,'bottom')" onMouseOut="DrawButton(this,'top')"
										style="HEIGHT:26px" valign="bottom">
										<td width="3" height="26"></td>
										<td align="center">
											<A style="VERTICAL-ALIGN: bottom" href="javascript:void(null)" onclick="javascript:BAOpenWPMenu('Cases');"
												class="BATBButton" name="cbButton" onMouseDown="this.className = 'BATBButtonDown';"
												onMouseUp="this.className = 'BATBButton';" onMouseOut="this.className = 'BATBButton';">
												<IMG border ="0" src="<%= Request.ApplicationPath %>/img/WPMenu/toolCases.gif" align="bottom" style="WIDTH: 22px;HEIGHT: 16px">&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPMenuCases") %>&nbsp;<img border ="0" align="bottom" style="WIDTH: 13px;HEIGHT: 13px" src="<%= Request.ApplicationPath %>/img/WPMenu/MenuDownArrow.gif" ></A>
										</td>
										<td width="3" height="26"></td>
									</tr>
								</table>
							</TD>
							<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,BizAgi.Defs.EAuthorizationPages.ProcessAnalyzer)){%>
							<td nowrap width="100" align="left">
								<table border="0" bordercolor="red" cellpadding="0" cellspacing="0" width="100">
									<tr class="WPMenuButton" onmousemove="DrawButton(this,'bottom')" onMouseOut="DrawButton(this,'top')"
										style="HEIGHT:26px" valign="bottom">
										<td width="3" height="26"></td>
										<td align="center">
											<A style="VERTICAL-ALIGN: bottom" href="javascript:void(null)" onclick="javascript:BAOpenWPMenu('Analyzer');"
												class="BATBButton" name="cbButton" onMouseDown="this.className = 'BATBButtonDown';"
												onMouseUp="this.className = 'BATBButton';" onMouseOut="this.className = 'BATBButton';">
												<IMG border ="0" src="<%= Request.ApplicationPath %>/img/WPMenu/ToolAnalyzer.gif" align="bottom" style="WIDTH: 22px;HEIGHT: 16px">&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPMenuAnalyzer") %>&nbsp;<img border ="0" align="bottom" style="WIDTH: 13px;HEIGHT: 13px" src="<%= Request.ApplicationPath %>/img/WPMenu/MenuDownArrow.gif" ></A>
										</td>
										<td width="3" height="26"></td>
									</tr>
								</table>
							</td>
							<%}%>
							<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,BizAgi.Defs.EAuthorizationPages.CockPit)){%>
							<td nowrap width="100" align="left">
								<table border="0" bordercolor="red" cellpadding="0" cellspacing="0" width="100">
									<tr class="WPMenuButton" onmousemove="DrawButton(this,'bottom')" onMouseOut="DrawButton(this,'top')"
										style="HEIGHT:26px" valign="bottom">
										<td width="3" height="26"></td>
										<td align="center">
											<A style="VERTICAL-ALIGN: bottom" href="javascript:void(null)" onclick="javascript:BAOpenWPMenu('CookPit');"
												class="BATBButton" name="cbButton" onMouseDown="this.className = 'BATBButtonDown';"
												onMouseUp="this.className = 'BATBButton';" onMouseOut="this.className = 'BATBButton';">
												<IMG border ="0" src="<%= Request.ApplicationPath %>/img/WPMenu/ToolCockpit.gif" align="bottom" style="WIDTH: 22px;HEIGHT: 16px">&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPMenuCookPit") %>&nbsp;<img border ="0" align="bottom" style="WIDTH: 13px;HEIGHT: 13px" src="<%= Request.ApplicationPath %>/img/WPMenu/MenuDownArrow.gif" ></A>
										</td>
										<td width="3" height="26"></td>
									</tr>
								</table>
							</td>
							<%}%>
							<%if (this.oBLAuthorization.HasAccessToPage(UserCredential,BizAgi.Defs.EAuthorizationPages.Admin)){%>
							<td nowrap width="100" align="left">
								<table border="0" bordercolor="red" cellpadding="0" cellspacing="0" width="100">
									<tr class="WPMenuButton" onmousemove="DrawButton(this,'bottom')" onMouseOut="DrawButton(this,'top')"
										style="HEIGHT:26px" valign="bottom">
										<td width="3" height="26"></td>
										<td align="center">
											<A style="VERTICAL-ALIGN: bottom" href="javascript:void(null)" onclick="javascript:BAOpenWPMenu('Admin');"
												class="BATBButton" name="cbButton" onMouseDown="this.className = 'BATBButtonDown';"
												onMouseUp="this.className = 'BATBButton';" onMouseOut="this.className = 'BATBButton';">
												<IMG border ="0" src="<%= Request.ApplicationPath %>/img/WPMenu/ToolAdmin.gif" align="bottom" style="WIDTH: 22px;HEIGHT: 16px">&nbsp;<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPMenuAdmin") %>&nbsp;<img border ="0" align="bottom" style="WIDTH: 13px;HEIGHT: 13px" src="<%= Request.ApplicationPath %>/img/WPMenu/MenuDownArrow.gif" ></A>
										</td>
										<td width="3" height="26"></td>
									</tr>
								</table>
							</td>
							<%}%>
							<TD width="*">&nbsp;
							</TD>
						</tr>
						<tr>
							<td colspan="5">&nbsp;
							</td>
						</tr>
					</Table>
				</TD>
			</TR>
		</TABLE>
		AQUI AQUI
		<uc1:WPMenuButton id="WPMenuButton1" runat="server"></uc1:WPMenuButton>
	</BODY>
</HTML>
