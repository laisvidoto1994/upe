/**
Plugin to create WorkPortal RadioButtons...

    var options = {
        data: {},
        css:'customCSS'
    };

    $('selector').uiradio(options);

    $(document).on("radioChange", function(obj){
        console.log(obj.message, obj.ui, obj.ui.val());
    });

@class $.fn.uiradio 
@constructor uiradio
**/
(function ( $ ) {
    "use strict";

    

    $.fn.uiradio = function(options, params) {

        var plg = this;

        plg.config = {
            namespace:$.bizagi.ui.controls.uiradio.namespace,
            cssComponent:$.bizagi.ui.controls.uiradio.css
        };

        plg.settings = {
            /**
            DataSource to create a uiradio Control

                var data = [
                            {   
                                value:value,
                                text:'radio'
                            }
                        ];

            @property data 
            @type Object
            @default "{}"
            **/
            data:{},
            nameTemplate: $.bizagi.ui.controls.uiradio.tmpl,
            /**
            Function to modify values

            @property itemValue 
            @type Function
            @param {Object} Object with value

                {value:xxx}

            @default "null"
            **/
            itemValue: null,
            /**
            Function to modify output text

            @property itemText 
            @type Function
            @param {Object} Object with text

                {text:xxx}
            
            @default "null"
            **/
            itemText: null,
            /**
            Function to modify output text

            @property css 
            @type String
            @default ""
            **/
            css:'',
            getTemplate: function(name){
                return bizagi.getTemplate(name);
            },
            /**
            Function exceute when is ready

            @property onComplete 
            @type Function
            @default "function(){}"
            **/
            onComplete: function(){},
            /**
            Function execute when controls is change

            @property onChange 
            @type Function
            @default "function(){}"
            **/
            onChange: function(){}
        };

        plg.methods = {
            init:function(op){

                var self = $(this);
                var template = op.getTemplate(op.nameTemplate);

                self.attr('role', op.namespace);
                self.addClass(op.cssComponent);
                self.addClass(op.css);

                $.when($.get(template)).done(function(a){

                    var nData = op.data;

                    op.data.radioGroup = (op.radioGroup) ? op.radioGroup : plg.methods.generateNameRadioGroup();

                    var tmp = $.tmpl(a, nData, {
                        itemValue: (op.itemValue) ? op.itemValue : plg.methods.itemValue,
                        itemText: (op.itemText) ? op.itemText : plg.methods.itemText
                    });

                    self.append(tmp);


                    tmp.find('.biz-wp-option-radio').each(function(index, value){
                         if(op.data.radio[index].data){
                            $.extend($(value).data(), op.data.radio[index].data);
                         }
                    });

                    plg.settings.onComplete.apply(self, []);

                    $('input[type="radio"]',tmp).on('change', function(){
                        var control = $(this);
                        plg.settings.onChange(control);
                        

                        /**
                        Fired when a radio change

                        @event radioChange 
                        @param {String} type radioChange ...
                        @param {String} message
                        @param {Date} time
                        @param {Object} Jquery Object HTML
                        **/
                        $.event.trigger({
                            type: "radioChange",
                            message: "radio change",
                            time: new Date(),
                            ui:control
                        });
                    });

                    /**
                    Fired when a radio is created

                    @event radioCompleted 
                    @param {String} type radioCompleted
                    @param {String} message
                    @param {Date} time
                    @param {Object} Jquery Object HTML 
                    **/
                    $.event.trigger({
                        type: "radioCompleted",
                        message: "radio is Completed",
                        time: new Date(),
                        ui:self
                    });

                }).fail(function(){
                    $.error('No se pudo cargar el template para generar las tablas');
                });

            },
            generateNameRadioGroup:function(){
                var self = this;

                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
                });
                return uuid;
            },


            itemValue : function(obj){
                var val = '';
                if(obj.itemValue){
                    val = obj.itemValue(obj);
                }else{
                    if(typeof obj.value === 'string' || typeof obj.value === 'number'){
                        val = obj.value;
                    }
                }
                return val;
            },
            itemText : function(obj){
                var val = '';
                if(obj.itemValue){
                    val = obj.itemText(obj);
                }else{
                    if(typeof obj.text === 'string'){
                        val = obj.text;
                    }
                }
                return val;
            },
            /**
            * Destroy Radio Buttons
            *
            *   $('selector').uiradio('destroy');
            *
            * @method destroy
            * @return {Object} Jquery Empty Object
            */
            destroy:function(op){
                var self = $(this);
                if(self.attr('role') === op.namespace){
                    self.empty();
                }else{
                    $.error('No es posible eliminar un control con un namespace diferente: [role: ' + op.namespace+']');
                }
            }
        };


        
        if(typeof options != 'object' && options) {

                $.extend(plg.settings, params, plg.config);
                return plg.methods[options].apply(this, [plg.settings]);

        } else if( typeof options === 'object' || !options || options === undefined) {

                $.extend(plg.settings, options, plg.config);
                return this.each(function() {
                    plg.methods.init.apply(this, [plg.settings]);
                });

        } else {

                $.error('Method ' + options + ' does not exist on jQuery.radio');

        }

    };

    $.bizagi.ui.controls.uiradio.plugin = $.fn.uiradio;

}( jQuery ));