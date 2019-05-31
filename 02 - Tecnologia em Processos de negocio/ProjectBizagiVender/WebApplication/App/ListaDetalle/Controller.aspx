<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Controller.aspx.cs" Inherits="BizAgiBPM.App.ListaDetalle.Controller" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Prueba de integracion</title>
<!--[if IE 7]>
<link href="../../css/ie7.css" rel="stylesheet" type="text/css" />
<![endif]-->

<!-- UNCOMMENT TO DEBUG !-->
    <link rel="stylesheet" href="../../css/reset.css" type="text/css" />

    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.tooltip.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.spinner.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.check.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.option.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.tokenlist.css" type="text/css" />
    <link rel="stylesheet" href="../../css/jquery.ui/jquery.ui.tree.css" type="text/css" />
    
    <link rel="stylesheet" href="../../css/jqgrid/jquery.jqgrid.css" type="text/css" />
    
    <link rel="stylesheet" href="../../css/other/jquery.timeEntry.css" type="text/css" />
    <link rel="stylesheet" href="../../css/other/nicEditSmiles.css" type="text/css" />
    <link rel="stylesheet" href="../../css/other/jquery.uploadify.css" type="text/css" />
    <link rel="stylesheet" href="../../css/other/jquery.lightbox.css" type="text/css" />
    
    <link rel="stylesheet" href="../../css/bizagi/bizagi.ui.css" type="text/css" />
    <link rel="stylesheet" href="../../css/bizagi/bizagi.ui.layout.css" type="text/css" />
    <link rel="stylesheet" href="../../css/bizagi/bizagi.ui.rendering.css" type="text/css" />
    <!--<link rel="stylesheet" href="cssmin/rendering.all.min.css" type="text/css" />-->
    
    <!-- UNCOMMENT TO DEBUG -->
    
    <script src="../../js/json2.js" type="text/javascript"></script>
    <script src="../../js/jquery.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.custom.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.check.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.option.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.tooltip.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.spinner.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.mask.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.combobox.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.selectable.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.tokenlist.js" type="text/javascript"></script>
    <script src="../../js/jquery.ui/jquery.ui.tree.js" type="text/javascript"></script>

    <script src="../../js/jqgrid/i18n/grid.locale-es.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/grid.base.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/grid.common.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/jquery.fmatter.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/grid.grouping.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/grid.formEdit.js" type="text/javascript"></script>
    <script src="../../js/jqgrid/grid.jqueryui.js" type="text/javascript"></script>

    <script src="../../js/styling/cufon-yui.js" type="text/javascript"></script>
    <script src="../../js/styling/AllerLight.js" type="text/javascript"></script>
    <script src="../../js/styling/AllerRegular.js" type="text/javascript"></script>
    <script src="../../js/styling/fonts.js"></script>
    
    <script src="../../js/other/jquery.metadata.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.elastic.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.formatCurrency.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.numeric.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.timeEntry.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.form.js" type="text/javascript"></script>
    <script src="../../js/other/swfobject.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.uploadify.js" type="text/javascript"></script>
    <script src="../../js/other/jquery.lightbox.js" type="text/javascript"></script>
    <script src="../../js/other/nicEdit.js" type="text/javascript"></script>
    <script src="../../js/other/i18n/jquery.formatCurrency.all.js" type="text/javascript"></script>
    
    <script src="../../js/bizagi/bizagi.util.js" type="text/javascript"></script>
    <script src="../../js/bizagi/i18n/bizagi.ui.i18n.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.base.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.text.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.text.extended.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.numeric.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.spinner.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.slider.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.date.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.button.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.yesno.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.check.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.label.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.link.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.hidden.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.combo.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.cascadingCombo.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.list.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.radio.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.search.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.multisearch.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.tree.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.multitree.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.combotree.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.letter.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.richText.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.grid.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.repeater.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.association.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.upload.js" type="text/javascript"></script>
    <script src="../../js/bizagi/render/bizagi.ui.render.factory.js" type="text/javascript"></script>
    <script src="../../js/bizagi/bizagi.ui.command.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.base.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.form.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.tab.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.tab.item.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.panel.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.group.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.accordion.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.accordion.item.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.horizontal.js" type="text/javascript"></script>
    <script src="../../js/bizagi/container/bizagi.ui.container.factory.js" type="text/javascript"></script>
    
    <script src="../../js/bizagi/bizagi.ui.js" type="text/javascript"></script>
    <!--<script src="jsmin/rendering.all.min.js" type="text/javascript"></script>-->
</head>
<body>
    <form class="ui-bizagi-container" action="#" method="POST" properties="{title: 'Prueba general'}">
        <h1>Bizagi - forms layout</h1>k
        <div class="clear"></div>
        <h2>Layout elements</h2>

        <div class="ui-bizagi-container ui-bizagi-container-tabContainer">
            <div class="ui-bizagi-container ui-bizagi-container-tab" properties="{id:10001, title:'Bizagi render layout'}">
                <div class="ui-bizagi-container ui-bizagi-container-panel" properties="{id:10001, title: 'Display Types'}">
        <%
            base.ProcessRequest();
         %>
                </div>
            </div>
         </div>
    </form>
</body>
</html>
