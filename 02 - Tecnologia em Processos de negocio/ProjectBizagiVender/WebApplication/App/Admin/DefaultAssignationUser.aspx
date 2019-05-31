<%@ Page Language="c#" CodeBehind="DefaultAssignationUser.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.DefaultAssignationUser" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="uc1" TagName="SelectCategoryItem" Src="../WorkPortal/SelectCategoryItem.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Default Assignation User</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/BizAgiAJAX.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAwindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript"> 
        //Hide or show the combo organization, when position is selected.
        function HideShowOrganization()
        {
            var selOrg = document.getElementById("I_ORGANIZATION");
            if(selOrg.options.length>1)
            {
                document.getElementById('divOrg1').style.display ="block";
                document.getElementById('divOrg2').style.display ="block";
                document.getElementById('divOrg3').style.display ="block";
            }
            else
            {
                document.getElementById('divOrg1').style.display ="none";
                document.getElementById('divOrg2').style.display ="none";
                document.getElementById('divOrg3').style.display ="none";
            }
        }
        function verifyForm() 
        {
            //verificar que se seleccione un proceso para la busqueda de casos
            if(document.getElementById("I_idWFClass").value=="")
            {
                alert("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ClientValidationMessage7") %>");
                //document.getElementById("I_idApplication").value=document.getElementById("h_idApp").value;
                return false;
            }
            if((document.getElementById("hdnBossUserId").value=="" || document.getElementById("txtBossUserName").value=="") 
            &&  (document.getElementById("hdnOldBossUserId").value==""))
            {
                alert("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ClientValidationMessage8") %>");
                //document.getElementById("I_idApplication").value=document.getElementById("h_idApp").value;
                return false;
            }
            bOnSubmit = true;
            document.frm.submit(); 
            document.body.style.cursor="wait";
            return true;
        }
        function AddUser() {
            document.getElementById("hdnBossUserId").value = '';
            document.getElementById("hdnOldBossUserId").value = '';
            document.getElementById("txtBossUserName").value = '';
            var usersWfclass = document.getElementById("h_idUserForWfclass").value;
            var selOrg = document.getElementById("I_ORGANIZATION");
            var idOrg = selOrg.options[selOrg.selectedIndex].value;
            //si existe al menos un registr
            if (usersWfclass.length > 0) {
                //crear arreglo donde cada posición será la configuración de un wfclass
                var usersArray = usersWfclass.split("@");
                var aux;
                //recorrer el arreglo buscando el idwfclass seleccionado
                for (var i = 0; i < usersArray.length; i++) {
                    aux = usersArray[i].split(","); //crear un subarreglo los datos de id user, id wfclass, fullname en cada posicion
                    //comparar el aux con el idwfclasss seleccionado
                    if (aux[0] == document.getElementById("I_idWFClass").value && aux[3] == idOrg) //si es encontrado mostrar el usuario configurado
                    {
                        //alert('usuario por defecto del wfclass:' + aux[0] + 'id user :' + aux[1] + ' nombre: ' + aux[2]);
                        document.getElementById("hdnBossUserId").value = aux[1]; //id user 
                        document.getElementById("hdnOldBossUserId").value = aux[1]; //id user 
                        document.getElementById("txtBossUserName").value = aux[2]; //full name
                        return;
                    }
                }
            }
        }
    </script>
</head>
<body onload="BAonload();HideShowOrganization()">
    <form name="frm" method="post" runat="server">
    <span id="SpanHeader" runat="server"></span>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td colspan="3" class="Header">
                <strong>
                    <UI:CLabel runat="server" Text="UserDafultAssignationManager" ID="Clabel1" />
                </strong>
            </td>
            <script language="javascript" type="text/javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("UserDafultAssignationManager") %>");
            </script>
        </tr>
        <tr>
            <td colspan="3">
                <img src="../../img/WorkPortal/WPDefaulUserAssig48.gif" width="48" height="48" alt=""
                    border="0" align="top" style="float: right">
                <UI:CLabel runat="server" Text="CDefaultAsssingUser_Help" ID="lblHelp" />
            </td>
        </tr>
        <tr>
            <td valign="Top" class="Header" colspan="3">
                <strong>
                    <UI:CLabel runat="server" Text="SelectProcess" ID="lblSelectProcess" />
                </strong>
            </td>
        </tr>
        <tr>
            <td colspan="3" valign="top" class="Header">
                <uc1:SelectCategoryItem ID="selectCategoryControl" runat="server"></uc1:SelectCategoryItem>
            </td>
        </tr>
        <tr>
            <td valign="Top" class="Header" colspan="3">
                <div id="divOrg3">
                    <strong>
                        <UI:CLabel runat="server" Text="Organization" ID="lblOrganization" />
                    </strong>
                </div>
            </td>
        </tr>
        <tr>
            <td width="30%">
                <div id="divOrg1">
                    <b>
                        <UI:CLabel runat="server" Text="CProfile_Organization" ID="ClabelOrganization" />
                    </b>
                </div>
            </td>
            <td valign="top">
                <div id="divOrg2">
                    <asp:DropDownList ID="I_ORGANIZATION" runat="server" onChange="AddUser();" Style="width: 200px" />
                </div>
            </td>
            <td>
            </td>
        </tr>
        <tr>
            <td valign="top" class="Header" colspan="3">
                <strong>
                    <br />
                    <br />
                    <UI:CLabel runat="server" Text="GetUser" ID="lblSelectUser" />
                </strong>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <b>
                    <UI:CLabel runat="server" Text="ColHeader_CURRENTUSER" ID="Clabel5" />
                </b>
            </td>
            <td colspan="2">
                <table cellpadding="0" cellspacing="2" border="0" height="21px">
                    <tr>
                        <td valign="top">
                            <input type="text" name="txtBossUserName" id="txtBossUserName" maxlength="50" size="30"
                                   style="width: 200px" />
                        </td>
                        <td valign="top">
                            <UI:CButton ID="BtnNewUser" runat="server" Text="BtnNewUser" class="sbttn" />
                        </td>
                        <td valign="top">
                            <UI:CButton ID="BtnClearUser" runat="server" Text="BtnClearUser" class="sbttn" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="left">
                <table>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <UI:CButton ID="BtnSave" runat="server" Text="BtnSave" class="sbttn" />
                        </td>
                    </tr>
                </table>
            </td>
            <td align="right" width="15%">
                &nbsp;
            </td>
        </tr>
    </table>
    <div style="display: none">
        <asp:TextBox ID="hdnBossUserId" name="hdnBossUserId" runat="server" />
        <asp:TextBox ID="hdnOldBossUserId" name="hdnOldBossUserId" runat="server" />
        <asp:TextBox ID="h_idWFClassUserDefault" name="h_idWFClassUserDefault" runat="server" />
        <input type="hidden" name="h_idUserForWfclass" id="h_idUserForWfclass" value="<%= GetDefaultUserAssignedToWfClass()%>" />
    </div>
    </form>
</body>
</html>
