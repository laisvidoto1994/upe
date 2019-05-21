<%@ Page Language="c#" CodeBehind="EditarCarta.aspx.cs" AutoEventWireup="false" Inherits="BizAgi.App.Cartas.EditarCarta" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html>
<head>
    <style>
        BODY
        {
            font-family: Tahoma;
            font-size: 12px;
            background-color: #F1E8D1;
            scrollbar-face-color: "threedface";
        }
        SELECT
        {
            border-left: #990033 1px solid;
            border-right: #990033 1px solid;
            border-top: #990033 1px solid;
            border-bottom: #990033 1px solid;
            font-size: 9pt;
            background: #FFFFFF;
            color: #990033;
            font-family: tahoma,sans-serif;
        }
    </style>
    <object id="WebBrowser1" width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"
        viewastext>
    </object>
    <script language="javascript">
	<!--

        var oDoc, sDefTxt;

        function initDoc() {
            oDoc = document.getElementById("editable");
            sDefTxt = oDoc.innerHTML;

            if (document.addEventListener) {

                document.getElementById("colorpalette").addEventListener("blur", dismisscolorpalette, true);

            } else if (document.attachEvent) {
                document.getElementById("colorpalette").attachEvent("blur", dismisscolorpalette, true);
            }
        }


        var command = "";

        function getOffsetTop(elm) {

            var mOffsetTop = elm.offsetTop;
            var mOffsetParent = elm.offsetParent;

            while (mOffsetParent) {
                mOffsetTop += mOffsetParent.offsetTop;
                mOffsetParent = mOffsetParent.offsetParent;
            }

            return mOffsetTop;
        }

        function getOffsetLeft(elm) {

            var mOffsetLeft = elm.offsetLeft;
            var mOffsetParent = elm.offsetParent;

            while (mOffsetParent) {
                mOffsetLeft += mOffsetParent.offsetLeft;
                mOffsetParent = mOffsetParent.offsetParent;
            }

            return mOffsetLeft;
        }

        function Select(selectname) {
            var cursel = document.getElementById(selectname).selectedIndex;
            /* First one is always a label */
            if (cursel != 0) {
                var selected = document.getElementById(selectname).options[cursel].value;
                document.getElementById('edit').contentWindow.document.execCommand(selectname, false, selected);
                document.getElementById(selectname).selectedIndex = 0;
            }
            document.getElementById("edit").contentWindow.focus();
        }

        function dismisscolorpalette() {
            document.getElementById("colorpalette").style.visibility = "hidden";
        }

        function formatDoc(sCmd, sValue) {
            if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
        }

        function over(element) {
            element.style.borderStyle = "solid";
            element.style.borderWidth = "1px";
            element.style.borderColor = "#000000";
            element.style.backgroundColor = "#B5BDD6";
            element.style.cursor = "hand";
        }

        function out(element) {
            element.style.borderColor = "threedface";
            element.style.backgroundColor = "threedface";
            element.style.cursor = "default";
        }

        function cmdExec(cmd, opt) {
            document.execCommand(cmd, false, opt);
            oDoc.focus();
        }

        function getOffsetTop(elm) {

            var mOffsetTop = elm.offsetTop;
            var mOffsetParent = elm.offsetParent;

            while (mOffsetParent) {
                mOffsetTop += mOffsetParent.offsetTop;
                mOffsetParent = mOffsetParent.offsetParent;
            }

            return mOffsetTop;
        }

        function getOffsetLeft(elm) {

            var mOffsetLeft = elm.offsetLeft;
            var mOffsetParent = elm.offsetParent;

            while (mOffsetParent) {
                mOffsetLeft += mOffsetParent.offsetLeft;
                mOffsetParent = mOffsetParent.offsetParent;
            }

            return mOffsetLeft;
        }

        var win = null;

        function NewWindow(mypage, myname, w, h, scroll) {
            LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
            TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
            settings =
			'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',resizable'
            win = window.open(mypage, myname, settings)
            win.title = "Vista Preliminar";
        }

        function printDoc() {

            var oPrntWin = window.open("", "_blank", "width=760px,height=470px,left=400,top=100,menubar=yes,resizable=no,toolbar=no,location=no,scrollbars=yes");
            oPrntWin.document.open();
            oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body>" + oDoc.innerHTML + "<\/body><\/html>");
            oPrntWin.document.close();
            oPrntWin.print();
            oPrntWin.close();
        }

        function PreviewDoc() {
            var PrvWin = window.open("", "_blank", "width=760px,height=470px,left=400,top=100,menubar=yes,resizable=no,toolbar=no,location=no,scrollbars=yes");
            PrvWin.document.open();
            PrvWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body>" + oDoc.innerHTML + "<\/body><\/html>");
            PrvWin.document.close();
        }

        function div2hidden(objForm) {

            var oElems = document.getElementById("editable");

            objForm.pageHTML.value = oElems.innerHTML;
        }

        function color(element) {

            parent.command = element.id;
            buttonElement = document.getElementById(element.id);
            var palette = document.getElementById("colorpalette");
            palette.style.left = getOffsetLeft(buttonElement);
            palette.style.top = getOffsetTop(buttonElement) + buttonElement.offsetHeight;
            palette.style.visibility = "visible";
            palette.focus();

        }

	//-->
    </script>
</head>
<body bgcolor="#FFFFFF" onload="initDoc();">
    <form name="frmedit" method="post" onsubmit="return div2hidden(this);" action="EditarCarta.aspx?Template=<%= m_sTemplate %>&PathOutputFile=<%= m_sOutputPath %>&OutputFile=<%= m_sOutputFile %>&totalpath=<%= m_sFullOutputFileName + HTMLExtension %>&isScopeEnabled=<%= Request["isScopeEnabled"] %>&idScope=<%= Request["idScope"] %>">
    <input type="hidden" name="idCase" value="<%= m_letterRequestInfo.IdCase %>">
    <input type="hidden" name="pageHTML" value="">
    <input type="hidden" name="update" value="1">
    <input type="hidden" name="xPath" value="<%= Request["xPath"] %>">
    <input type="hidden" name="file" value="<%= m_sFullOutputFileName + HTMLExtension %>">
    <table width="100%" cellspacing="" align="center" style="border-style: solid; border-width: 1px;
        border-color: #000000; background-color: threedface;">
        <tr>
            <td width="100%" align="center">
                <input type="submit" value="Salvar" name="salvar" style="visibility: hidden;">&nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="1" bordercolor="threedface">
                    <tr>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="oDoc.blur(); frmedit.salvar.click();">
                                <img src="../../img/carta/salvar.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Save")); %>'>
                            </div>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="PreviewDoc();">
                                <img src="../../img/carta/preview.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_PrintPreview")); %>'>
                            </div>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="printDoc();">
                                <img src="../../img/carta/imprimir.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Print")); %>'>
                            </div>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="cmdExec('undo');">
                                <img src="../../img/carta/undo.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Undo")); %>'>
                            </div>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="cmdExec('redo')">
                                <img src="../../img/carta/redo.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Redo")); %>'>
                            </div>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="cmdExec('bold')">
                                <img src="../../img/carta/bold.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Bold")); %>'>
                            </div>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('italic')">
                                    <img src="../../img/carta/italic.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Italic")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('underline')">
                                    <img src="../../img/carta/underline.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Underline")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('justifyleft')">
                                    <img src="../../img/carta/left.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_LeftJust")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20" >
                                <div onclick="cmdExec('justifycenter')">
                                    <img src="../../img/carta/center.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_CenterJust")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('justifyright')">
                                    <img src="../../img/carta/right.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_RightJust")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('insertOrderedList')">
                                    <img hspace="2" vspace="1" src="../../img/carta/numlist.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Numbers")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('insertUnorderedList')">
                                    <img hspace="2" vspace="1" src="../../img/carta/bullist.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_Bullets")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('outdent')">
                                    <img hspace="2" vspace="1" src="../../img/carta/unindent.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_LeftIndent")); %>'>
                                </div>
                            </td>
                            <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                                width="20" height="20">
                                <div onclick="cmdExec('indent')">
                                    <img hspace="2" vspace="1" src="../../img/carta/indent.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_RightIndent")); %>'>
                                </div>
                            </td>
                        </td>
                        <td valign="center" align="center" onmouseover="over(this);" onmouseout="out(this);"
                            width="20" height="20">
                            <div onclick="color(this);" id="forecolor">
                                <img src="../../img/carta/fgcolor.gif" alt='<% Response.Write(CResourceManager.RM.GetString("AppEditarCartas_FontColor")); %>'>
                            </div>
                        </td>
                        <td colspan="16" width="100%">
                            <select onchange="cmdExec('fontname',this[this.selectedIndex].value);" name="fuentes">
                                <option selected value="Arial">Arial</option>
                                <option value="Arial Black">Arial Black</option>
                                <option value="Arial Narrow">Arial Narrow</option>
                                <option value="Comic Sans MS">Comic Sans</option>
                                <option value="Courier New">Courier</option>
                                <option value="System">System</option>
                                <option value="Tahoma">Tahoma</option>
                                <option value="Times New Roman">Times News Roman</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Wingdings">Wingdings</option>
                            </select>
                            <select onchange="cmdExec('fontsize',this[this.selectedIndex].value);" id="select1"
                                name="select1">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3" selected>3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="10">10</option>
                                <option value="12">12</option>
                                <option value="14">14</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <div contenteditable="true" id="editable" style="border-style: solid; border-width: 1px;
                    border-color: #000000; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;
                    padding-top: 3px; padding-bottom: 3px; width: 100%; height: 100%; overflow: scroll">
                    <%= m_sFileHTMLContents  %>
                </div>
                <iframe width="250" height="170" id="colorpalette" src="selcolor.html" style="visibility: hidden;
                    position: absolute; left: 438px; top: 172px;"></iframe>
            </td>
        </tr>
    </table>
    </form>
</body>
</html>