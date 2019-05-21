(function(n){"use strict";n.fn.uicombo=function(t,i){var r=this;if(r.config={namespace:n.bizagi.ui.controls.uicombo.namespace,cssComponent:n.bizagi.ui.controls.uicombo.css,internalData:{}},r.settings={data:{},ascombo:!0,disabled:!1,isSearchable:!1,isEditable:!1,nameTemplate:n.bizagi.ui.controls.uicombo.tmpl,nameSubTemplate:n.bizagi.ui.controls.uicombo.tmpl2,initValue:null,itemValue:null,itemText:null,css:"",orientation:"biz-o-left",getTemplate:function(n){return bizagi.getTemplate(n)},initializeTemplates:function(){var t=this,u=n.Deferred(),i=t.nameTemplate,r=t.nameSubTemplate;return{combo:bizagi.getTemplate(i),list:bizagi.getTemplate(r)}},onComplete:function(){},onChange:function(){}},r.methods={init:function(t){var i=n(this),o=t.getTemplate(t.nameTemplate),s=t.getTemplate(t.nameSubTemplate),u,f=function(){return navigator.appName.indexOf("Internet Explorer")>0},e=function(){return!!navigator.userAgent.match(/Trident\/7.0/)&&!navigator.userAgent.match(/MSIE/i)};t.IE=f()?!0:e()?!0:undefined;i.attr("role",t.namespace);i.addClass(t.cssComponent);i.addClass(t.css);i.loader=new bizagi.ui.controls.tmplloader;n.when(i.loader.loadTemplates(t.initializeTemplates())).done(function(){var s=i.loader.getTemplate("combo"),h=i.loader.getTemplate("list"),e,o,f;r.config.internalData=u=t.data;u.isEditable=t.isEditable;u.disabled=t.disabled;r.config.subTemplateHTML=h;e=n.tmpl(s,t.data,{itemValue:t.itemValue?t.itemValue:r.methods.itemValue,itemText:t.itemText?t.itemText:r.methods.itemText});i.append(e);r.config.inputCombo=n(".biz-wp-combo-input",i);e.find(".biz-wp-combo-option").each(function(i,r){t.data.combo[i].data&&n.extend(n(r).data(),t.data.combo[i].data)});r.settings.onComplete.apply(i,[]);i.methods=r.methods;i.config=r.config;i.settings=r.settings;i.methods.configureHandlers.apply(i,[]);n.event.trigger({type:"comboCompleted",message:"combo is Completed",time:new Date,ui:i});r.settings.initValue&&(o="",f="",f=r.settings.itemText?r.settings.itemText(r.settings.initValue):r.settings.initValue.text,o=r.settings.itemValue?r.settings.itemValue(r.settings.initValue):r.settings.initValue.value,f===""?i.config.inputCombo.val(""):i.config.inputCombo.val(f),r.config.inputCombo.data("value",o))})},getControl:function(){var t=this;return n(".biz-wp-combo",t)},getData:function(){return r.config.internalData},findDataByValue:function(t){var r=this;if(t!==undefined&&t!==null)var i=typeof t=="object"?t.join(" - "):typeof t=="boolean"?t.toString():t,u=n.trim(i).substring(0,i.length).toLowerCase(),f=r.getData();return-1},configureHandlers:function(){var t=this,i=t.methods.getControl.apply(t,[]);t.config.inputCombo.focus(function(){});t.config.inputCombo.blur(function(){t.settings.isSearchable&&t.methods.validateValueInDatasource()});t.config.inputCombo.click(function(){var r="dd-"+t.config.inputCombo.attr("id");n("#"+r,i).length===0?t.methods.comboDropDown.apply(t,[]):t.methods.dropDownDestroy.apply(t,[n(r)]);t.config.inputCombo.select()});n(".biz-wp-combo-btn",i).bind("click.combo",function(){t.config.inputCombo.trigger("click").focus()});t.config.inputCombo.keyup(function(n){t.methods.keyUpFunction.apply(t,[n])});t.config.inputCombo.keydown(function(n){t.methods.keyDownFunction.apply(t,[n])})},comboDropDown:function(){var t=this;n.when(t.methods.getData()).done(function(n){t.methods.internalComboDropDown.apply(t,[n])})},internalComboDropDown:function(t){var v,e,u;n(".ui-select-dropdown.open").detach();var i=this,h,o={},c=n("<div class='ui-select-dropdown open'><\/div>"),f=i.config.inputCombo.closest(".biz-wp-combo-data-container"),s=f.closest(".biz-wp-combo"),y="dd-"+i.config.inputCombo.attr("id"),l=i.methods.findDataByValue(i.config.inputCombo.val()),a=0;t=t||i.properties.data;i.repositionInterval;v=s.css("height");e=i.methods.getControl.apply(i,[]);s.addClass("ac-is-visible");s.css("height",v);f.addClass("ac-is-visible ac-clear-floats");c.attr("id",y);h=n.tmpl(r.config.subTemplateHTML,t,{itemValue:i.settings.itemValue?i.settings.itemValue:i.methods.itemValue,itemText:i.settings.itemText?i.settings.itemText:i.methods.itemText});u=c.append(h);f.append(u);u.position({my:"left top",at:"left bottom",of:n(".biz-wp-combo-input",e),collision:"none"}).hide();u.fadeIn();u.width(e.width());i.methods.recalculateComboOffset(u,e);u.data("formWidth",f.width());u.data("parentCombo",e);u.addClass(i.settings.orientation);l!==-1&&(o=n("li[data-value='"+l.id+"']",u),o.addClass("ui-selected"),o.addClass("active"),a=parseInt(o.position().top),u.scrollTop(a));u.on("mouseup","li",function(t){t.stopPropagation();var r=n(this).data("value").toString(),f=r?n(this).data("value"):"",e={value:f,text:n(this).text()};i.methods.onComboItemSelected.apply(i,[e]);i.config.inputCombo.focus();u.fadeOut("slow",function(){i.methods.dropDownDestroy.apply(i,[u])});n(document).unbind("click.closecombo")});n.makeArray(u,i.methods.getControl.apply(i,[])).bind("click",function(n){return n.preventDefault(),!1});u.bind("mousedown.closecombo",function(){u.attr("md",!0)});n(document).bind("mousedown.resizecombo",function(t){n(t.target).hasClass("ui-resizable-handle")&&(i.repositionInterval&&clearInterval(i.repositionInterval),i.repositionInterval=setInterval(function(){i.methods.dropDownReposition.apply(i,[u,f])},10))});n(document).bind("mouseup.resizecombo",function(t){clearInterval(i.repositionInterval);var r=n(t.target);u.attr("md")?u.removeAttr("md"):r.hasClass("ui-select-dropdown")||i.methods.dropDownValidClose.apply(i,[r,u])});n(document).on("mouseup.closecombo",function(t){var f,r;f=i.settings.IE&&t.currentTarget.activeElement?t.currentTarget.activeElement:t.target;r=n(f);u.attr("md")?u.removeAttr("md"):r.hasClass("ui-select-dropdown")||i.methods.dropDownValidClose.apply(i,[r,u])});n(window).bind("resize.resizecombo",function(){i.repositionInterval&&clearInterval(i.repositionInterval);i.methods.dropDownReposition.apply(i,[u,f])});n(document).one("click.closecombo",function(t){var r=n(t.target);u.attr("md")?u.removeAttr("md"):i.methods.dropDownValidClose.apply(i,[r,u])})},dropDownValidClose:function(t,i){var r=this;i.fadeOut("slow",function(){r.methods.dropDownDestroy.apply(r,[i])});n(document).unbind("click.closecombo")},dropDownReposition:function(t,i){var u=this,r=u.methods.getControl.apply(u,[]);i.width()!=t.data("formWidth")&&(t.width(r.width()<100?100:r.width()),t.position({my:"left top",at:"left bottom",of:n(".biz-wp-combo-input",r),collision:"none"}),t.data("formWidth",i.width()))},dropDownDestroy:function(t){var r=this,i=r.config.inputCombo.closest(".ui-bizagi-control"),u=i.closest(".ui-bizagi-render");i.hasClass("ac-is-visible")&&i.removeClass("ac-is-visible");i.hasClass("ac-clear-floats")&&i.removeClass("ac-clear-floats");u.css("height","auto");u.hasClass("ac-is-visible")&&u.removeClass("ac-is-visible");t.remove();n(document).unbind("mousedown.closecombo");n(document).unbind("mouseup.resizecombo");n(window).unbind("resize.resizecombo");n(window).unbind("mouseup.closecombo");r.repositionInterval;clearInterval(r.repositionInterval)},validateValueInDatasource:function(){var n=this,i=r.config.inputCombo.val(),t=n.findDataByValue(i);n.value||(n.value={id:""});t.id>0?(n.setValue({id:t.id},!1),n.setDisplayValue(t)):t.id==""?(n.value.id!=t.id&&n.setValue(t,!1),n.setDisplayValue(t)):n.setDisplayValue(n.selectedValue)},keyDownFunction:function(t){var i=this,e="dd-"+r.config.inputCombo.attr("id"),u=n("#"+e),f=n("li.active",u);return(t=t?t:window.event,t.altKey||t.ctrlKey||t.metaKey)?1:(u.length===0&&(i.methods.comboDropDown.apply(i,[]),u=n("#"+e)),t.shiftKey&&t.keyCode)?(u.remove(),0):(27==t.keyCode&&(i.methods.setDisplayValue.apply(i,[i.selectedValue]),u.remove()),9==t.keyCode||13==t.keyCode)?(f.length>0&&i.config.inputCombo.val(f.text()),i.settings.isSearchable?i.methods.validateValueInDatasource():i.methods.setValue.apply(i,[f.data("value")]),u.remove(),1):t.keyCode=="38"||t.keyCode=="37"?(i.methods.selectPreviousElement.apply(i,[u]),0):t.keyCode=="40"||t.keyCode=="39"?(i.methods.selectNextElement.apply(i,[u]),0):t.keyCode==36?(i.methods.selectFirstElement.apply(i,[u]),0):t.keyCode==35?(i.methods.selectLastElement.apply(i,[u]),0):1},keyUpFunction:function(t){var i=this,u="dd-"+r.config.inputCombo.attr("id"),f=n("#"+u);return(t=t?t:window.event,t.altKey||t.ctrlKey||t.metaKey||50==t.keyCode||13==t.keyCode||9==t.keyCode||27==t.keyCode||t.keyCode=="38"||t.keyCode=="40"||t.shiftKey&&t.keyCode||t.keyCode==36||t.keyCode==35||t.keyCode==33||t.keyCode==34)?0:(f.length===0&&(i.methods.comboDropDown.apply(i,[]),f=n("#"+u)),i.methods.selectItemByKeyUp.apply(i,[]),1)},selectItemByKeyUp:function(){var t=this,i,e="dd-"+r.config.inputCombo.attr("id"),u=n("#"+e),f;n(".active",u).removeClass("active");f=t.settings.isSearchable?t.methods.findDataByValue(r.config.inputCombo.val()):-1;f!==-1?(i=n("li[data-value='"+f.id+"']",u),i.addClass("active")):i=n("li.ui-selected",u);u.length>0&&i.length>0?(scrollPosition=parseInt(i.position().top),u.scrollTop(scrollPosition)):t.methods.setValue.apply(t,[t.selectedValue])},selectFirstElement:function(t){var u=this,i=n("li:first",t);n("li",t).removeClass("active");i.addClass("active");scrollPosition=i.position().top;t.scrollTop(scrollPosition);r.config.inputCombo.val(n(i).text())},selectLastElement:function(t){var u=this,i=n("li:last",t);n("li",t).removeClass("active");i.addClass("active");scrollPosition=i.position().top;t.scrollTop(scrollPosition);r.config.inputCombo.val(n(i).text())},selectPreviousElement:function(t){var e=this,f=0,u=n("li.active",t),i;u.length===0&&(u=n("li:first",t));i=u.prev();i.length!=0&&(u.removeClass("active"),n(i).addClass("active"),f=n(i).position().top,t.scrollTop(f),r.config.inputCombo.val(n(i).text()))},selectNextElement:function(t){var e=this,f=0,u=n("li.active",t),i;u.length===0&&(u=n("li:first",t));i=u.next();i.length!=0&&(u.removeClass("active"),n(i).addClass("active"),f=n(i).position().top,t.scrollTop(f),r.config.inputCombo.val(n(i).text()))},onComboItemSelected:function(n){var t=this,i=n.value.toString(),r=n.text||"";i===""?t.config.inputCombo.val(r):t.config.inputCombo.val(r);t.methods.setValue.apply(t,[i])},setValue:function(t){var u=this,f,i;u.config.inputCombo.data("value",t);f=u.config.inputCombo;i={type:"comboChange",message:"combo change",time:new Date,ui:f};r.settings.onChange(i);n.event.trigger(i)},setDisplayValue:function(n){var i=this,t="";n=r.settings.itemValue?r.settings.itemValue:r.methods.itemValue;n!==null?r.config.inputCombo.val(t):n===null&&r.config.inputCombo.val(t)},clearDisplayValue:function(){var n=this;r.config.inputCombo.val("");n.value=n.properties.value=n.selectedValue},getSelectedValue:function(){var n=this;return n.selectedValue},recalculateComboOffset:function(n,t){if(bizagi.util.isIE()&&bizagi.util.getInternetExplorerVersion()==9&&n.width()!==t.width()){var i=t.width()-n.width();n.width(t.width()+i)}},itemValue:function(n){var t="";return n.itemValue?t=n.itemValue(n):(typeof n.value=="string"||typeof n.value=="number")&&(t=n.value),t},itemText:function(n){var t="";return n.itemValue?t=n.itemText(n):typeof n.text=="string"&&(t=n.text),t},destroy:function(t){var i=n(this);i.attr("role")===t.namespace?i.empty():n.error("No es posible eliminar un control con un namespace diferente: [role: "+t.namespace+"]")},selectItem:function(t){var r=this,i=n(".biz-wp-combo-input",r);i.val(t.text);i.data("value",t.value)}},typeof t!="object"&&t)return n.extend(r.settings,i,r.config),r.methods[t].apply(this,[r.settings]);if(typeof t!="object"&&t&&t!==undefined)n.error("Method "+t+" does not exist on jQuery.combo");else return n.extend(r.settings,t,r.config),this.each(function(){r.methods.init.apply(this,[r.settings])})};n.bizagi.ui.controls.uicombo.plugin=n.fn.uicombo})(jQuery);
