    /*
    @title: Editor changelayout
    @authors: Rhony Pedraza
    @date: 31-oct-12
    */
    bizagi.editor.component.editor(
        "bizagi.editor.component.editor.changelayout", {
            init : function(canvas, model, controller) {
                var self = this;
                self._super(canvas, model, controller);
            },
            renderEditor : function(container, data) {
                var self = this, elEditor;
                
                self.data = data;
                self.boxes = [];
                self.values = [];
                self.total = 0;
                self.fixedWidth = 0;
                
                elEditor = $.tmpl(self.getTemplate("frame"), data);
                self.renderColumnsWidths(elEditor.find(".changelayout-fields"), data.value.elements);
                
                elEditor.appendTo(container);
                
                self.createDialogEditor(data);
            },
            renderColumnsWidths : function(container, elements) {
                var self = this, i, columns, dataText;
                dataText = '';
                
                for(i=0; i<elements.length; i++) {
                    dataText += elements[i].width;
                    if(elements.length > 1 && i != (elements.length - 1)){
                        dataText += ', ';
                    }
                }

                columns = $.tmpl(self.getTemplate("columns"), {width:dataText});
                columns.appendTo(container);
            },
            renderFieldsWidths : function(container, elements) {
                var self = this, i, field;
                for(i=0; i<elements.length; i++) {
                    field = $.tmpl(self.getTemplate("field"), elements[i]);
                    field.appendTo(container);
                }
            },
            refreshColumnsWidths: function(dataText){
                var self = this;
                $('.changelayout-concat-value',self.element).text(dataText);
            },
            createDialogEditor : function(data) {
                var self = this, elPopupContent, elPopupActions, i, elements, sliders, slidersWidth, elWrap, elSlider, elOkButton, elCancelButton;
                
                elPopupContent = $.tmpl(self.getTemplate("popup-content"), {});
                elPopupContentWrapper = $('.changelayout-wrapper-container',elPopupContent);
                elPopupContentSlider = $('.changelayout-slider-container',elPopupContent);
                
                elements = data.value.elements;
                for(i=0; i<elements.length; i++) {
                    elWrap = $.tmpl(self.getTemplate("popup-wrapper"), elements[i]);
                    elWrap.appendTo(elPopupContentWrapper);
                }

                elSlider = $.tmpl(self.getTemplate("popup-slider"), elements[0]);
                elSlider.css('width', slidersWidth + '%');
                elSlider.appendTo(elPopupContentSlider);
                
                elPopupActions = $.tmpl(self.getTemplate("popup-actions"), {});
                
                elOkButton = $($("span", elPopupActions).get(0));
                elOkButton.click(function() {
                    var boxes = $(".changelayout-box", elPopupContent);
                    var editorValues = $('.changelayout-field-value', self.element);
                    var values = [];
                    $.each(boxes, function(index, box) {
                        box = $(box).parent();
                        values.push({
                            index : index,
                            width : parseInt(box.attr("data-value")) + "%"
                        });
                        $(editorValues[index]).text(parseInt(box.attr("data-value")) + "%");
                    });
                    
                    var options = {
                        typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_LAYOUT,
                        values : values,
                        id : self.element.closest(".bizagi_editor_component_properties").data("id")
                    };
                    self.controller.publish("propertyEditorChanged", options);
                    
                    self.hideDialog();

                    var dataText = '';
                    for(var i=0; i<self.boxes.length;i++){
                        dataText += parseInt($(self.boxes[i]).attr('data-value')) + '%';

                        self.data.value.elements[i].width = parseInt($(self.boxes[i]).attr('data-value')) + '%';
                        if(self.boxes.length > 1 && i != (self.boxes.length - 1)){
                            dataText += ', ';
                        }
                    }

                    self.refreshColumnsWidths(dataText);
                    
                }).text(bizagi.localization.getResource("formmodeler-component-editor-changelayout-ok"));
                
                elCancelButton = $($("span", elPopupActions).get(1));
                elCancelButton.click(function() {
                    self.hideDialog();
                }).text(bizagi.localization.getResource("formmodeler-component-editor-changelayout-cancel"));;
                
                self.modalReference = self.createDialog(elPopupContent, elPopupActions);
                
                var slider = $(".changelayout-slider", elPopupContent);

                var options = {
                        slide : function(event, ui) {

                            var handles = $('.ui-slider-handle');
                            var index = $(ui.handle).siblings('a').andSelf().index(ui.handle);
                            var values = $(this).slider('value');
                            if(handles.length > 1){
                                values = $(this).slider('values');
                            }
                            
                            self.redrawWidthBoxes(index, values);

                            if(handles.length > 1){
                                return (index == 0 || ui.value > values[index - 1]) &&
                                (index == values.length - 1 || ui.value < values[index + 1]);
                            }


                        }
                    }

                var boxes = $(".changelayout-box", elPopupContent);
                if(boxes.length > 2){

                    var optValues = [];

                    for(var i=0; i<boxes.length; i++){
                        var prevValue = (parseFloat(optValues[i-1]))? parseFloat(optValues[i-1]) : 0;
                        var newValue = parseFloat($(boxes[i]).parent().attr('data-value')) + prevValue;
                        if(newValue < 100 && newValue > 0){
                            optValues.push(newValue);
                        }
                    }

                   $.extend(options, {
                        min: 0,
                        max: 100,
                        values: optValues
                    });

                }else{
                    $.extend(options, {
                        value: $(boxes[0]).parent().attr('data-value')
                    });
                }

                slider.slider(options);
                
            },
            redrawWidthBoxes:function(index, values){ 
                var self = this, prevPosition, valueIndex, valueNextIndex, actualBox, actualBoxWidth, nextBox, nextBoxWidth, totalRange; 

                prevPosition = (values[index-1])? parseInt(values[index-1]) : 0;
                valueIndex = (values[index])? parseFloat(values[index]) - prevPosition : parseFloat(values) - prevPosition;


                actualBox = $(self.boxes[index]);
                nextBox = $(self.boxes[index+1]);


                actualBoxWidth = parseFloat(actualBox.attr('data-value'));
                nextBoxWidth = parseFloat(nextBox.attr('data-value'));
                totalRange = actualBoxWidth + nextBoxWidth;

                actualBox.css("width",valueIndex + "%");
                $('.changelayout-value',actualBox).text(valueIndex + "%");
                actualBox.attr('data-value',valueIndex);

                if(typeof values != 'number'){

                    valueNextIndex =  parseInt(totalRange - parseInt(values[index] - prevPosition));
                    nextBox.css("width",valueNextIndex + "%");
                    $('.changelayout-value',nextBox).text(valueNextIndex + "%");
                    nextBox.attr('data-value',valueNextIndex);
                }else{

                    valueNextIndex = totalRange - values;
                    nextBox.css("width",valueNextIndex + "%");
                    $('.changelayout-value',nextBox).text(valueNextIndex + "%");
                    nextBox.attr('data-value',valueNextIndex);

                }

            },

            loadTemplates : function() {
                var self = this, deferred = $.Deferred();
                $.when(
                    self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-frame")),
                    self.loadTemplate("field", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-field")),
                    self.loadTemplate("columns", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-columns")),
                    self.loadTemplate("popup-content", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-popupcontent")),
                    self.loadTemplate("popup-wrapper", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-wrapper")),
                    self.loadTemplate("popup-slider", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-slider")),
                    self.loadTemplate("popup-actions", bizagi.getTemplate("bizagi.editor.component.editor.changelayout").concat("#changelayout-popupactions"))
                ).done(function() {
                    deferred.resolve();
                });
                return deferred.promise();
            },
            
            ".biz-ico.changelayout-image-small-popup click" : function(el) {
                var self = this, i;
                self.showDialog(el).done(function() {
                    var wrappers = $(".changelayout-box-wrapper", self.modalReference);
                    self.boxes = [];
                    $.each(wrappers, function(index, wrapper) {
                        wrapper = $(wrapper);
                        self.boxes.push(wrapper);
                        self.values.push(parseInt(self.boxes[index].attr("data-value")));
                        self.total += self.values[index];
                    });
                    
                    for(i=0; i<self.boxes.length; i++) {
                        self.boxes[i].css("width", self.boxes[i].attr('data-value') + '%' );
                    }
                });
            }
        }
    );