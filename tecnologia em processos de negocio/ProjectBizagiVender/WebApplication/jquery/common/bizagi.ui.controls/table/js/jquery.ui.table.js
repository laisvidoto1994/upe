/**
Plugin to create WorkPortal Tables...

    var options = {
        data: {},
        css:'customCSS'
    };

    $('selector').uitable(options);

    $(document).on("tableCompleted", function(obj){
        //console.log(obj.message, obj.ui);
    });
    
    $(document).on("headerClicked", function(obj){
        //console.log(obj.message, obj.ui);
    });

@class $.fn.uitable 
@constructor uitable
**/
(function ( $ ) {
    "use strict";

    $.fn.uitable = function(options, params) {

        var plg = this;
        plg.config = {
            namespace:$.bizagi.ui.controls.uitable.namespace,
            cssComponent:$.bizagi.ui.controls.uitable.css,
            availableComponents:$.bizagi.ui.controls.uitable.availableComponents
        };

        plg.settings = {
            /**
            DataSource to create a checkbox Control

                var data = [
                            {
                                headers:[
                                            {value:'header1'}
                                        ],
                                rows:   [
                                            {value:'header1'},
                                            {value:{component:'uicombo', data:dataforComponent}
                                        ]
                            }
                        ];

            @property data 
            @type Object
            @default "{}"
            **/
            data:{},
            asTable: true,
            nameTemplate: $.bizagi.ui.controls.uitable.tmpl,
            rowTemplate: $.bizagi.ui.controls.uitable.tmpl2,
            /**
            Function to modify cell values

            @property cellValue 
            @type Function
            @default "null"
            **/
            cellValue: null,
            /**
            Function to add class in odd rows

            @property oddClass 
            @type String
            @default "null"
            **/
            oddClass: null,
            /**
            Function to add a custon CSS Class

            @property css 
            @type String
            @default ""
            **/
            css:'',
            getTemplate: function(name){
                return bizagi.getTemplate(name);
            },
            /**
            Function exceute when table is ready

            @property onComplete 
            @type Function
            @default "function(){}"
            **/
            onComplete: function(){},
            /**
            Function exceute when each header is clicked

            @property headerClick 
            @type Function
            @default "function(){}"
            **/
            headerClick: function(){}
        };

        plg.util = {
            clone:function(arr){
                var arr2  = [];
                for (var i = 0; i < arr.length; i++) {
                    arr2.push(arr[i]);
                }
                return arr2;
            }
        };

        plg.methods = {
            init:function(op){
                var self = $(this);
                var template = op.getTemplate(op.nameTemplate);
                var rowTemplate = op.getTemplate(op.rowTemplate);

                self.attr('role', op.namespace);
                self.addClass(op.cssComponent);
                self.addClass(op.css);

                $.when($.get(template), $.get(rowTemplate)).done(function(a, b){
                    var nData = op.data;

                    nData = plg.methods.recursiveRows.apply(this, [op]);

                    var fValue = (op.cellValue) ? op.cellValue : plg.methods.cellValue;

                    var tmp = $.tmpl(a[0], nData,{
                        testValue: fValue
                    });

                    op.rowTemplate = b[0];


                    self.data('cellValue', fValue);
                    
                    if(op.onComplete){
                        self.data('onComplete', op.onComplete);
                    }

                    if(plg.settings.oddClass){
                        tmp.find('.biz-wp-table-row:odd').addClass(plg.settings.oddClass);
                    }

                    self.append(tmp);
                    plg.methods.addHandlers.apply(self, [tmp]);

                }).fail(function(){
                    $.error('No se pudo cargar el template para generar las tablas');
                });

            },
            addHandlers: function(tmp){
                var self = $(this);

                tmp.on('click.table', 'th' ,function(event){
                    plg.settings.headerClick();

                    /**
                    Fired when header is clicked

                    @event headerClicked 
                    @param {String} type headerClicked
                    @param {String} message
                    @param {Date} time
                    @param {Object} Jquery Object HTML
                    **/
                    $.event.trigger({
                        type: "headerClicked",
                        message: "Header is Clicked",
                        time: new Date(),
                        ui:$(event.target)
                    });
                });

                plg.settings.onComplete.apply(self, []);


                /**
                Fired when table is ready

                @event tableCompleted 
                @param {String} type tableCompleted
                @param {String} message
                @param {Date} time
                @param {Object} Jquery Object HTML
                **/
                $.event.trigger({
                    type: "tableCompleted",
                    message: "Table is Completed",
                    time: new Date(),
                    ui:self
                });

                var components = $('[role^="component:"]');

                if(components.length > 0){
                    plg.methods.createComponents.apply(self, [components]);
                }

                self.data('plg', plg);

            },
            createComponents: function(comps){
                var self = $(this);

                for(var i=0; i<comps.length; i++){
                    var dataComp, el = $(comps[i]);
                    var type = el.attr('role').toLowerCase().replace('component:', '');

                    if(plg.methods.validateComponent(type)){

                        if(plg.settings.data.datasource[el.data('position')]){
                            dataComp = plg.settings.data.datasource[el.data('position')];
                        }else{
                            dataComp = self.data().plg.settings.data.datasource[el.data('position')];
                        }


                        el[type]({data:dataComp});
                    }else{
                        $.error('No es un componente valido para tablas');
                    }
                }

            },
            recursiveRows: function(op){
                var self = this;
                for(var i=0; i<op.data.rows.length; i++){
                   for(var j=0; j<op.data.rows[i].length; j++){
                        op.data.rows[i][j].indexCol = j;
                        op.data.rows[i][j].indexRow = i;
                    }
                }

                return op.data;
            },
            cellValue : function(obj){
                var val = '';
                if(!this.data.datasource){
                    this.data.datasource = [];
                }
                if(obj.cellValue){
                    val = obj.cellValue(obj);
                    if(typeof val === 'object' && val.jquery){
                        val = val[0].outerHTML;
                    }
                }else{
                    if(typeof obj.value === 'string' || typeof obj.value === 'number'){
                        val = obj.value;
                    } else if(typeof obj.value === 'object' && obj.value.hasOwnProperty('component')){
                        val = '<div role="component:'+obj.value.component+'" data-position="'+obj.indexCol+'-'+obj.indexRow+'"></div>';
                        if(obj.value.data){
                            this.data.datasource[obj.indexCol+'-'+obj.indexRow] = obj.value.data;
                        }else{
                            this.data.datasource[obj.indexCol+'-'+obj.indexRow] = {};
                        }
                    }
                }

                return val;
            },
            validateComponent: function(comp){
                var self = this;
                var rValue = false;
                for(var i=0; i<plg.config.availableComponents.length; i++){
                    if(comp === plg.config.availableComponents[i]){
                        rValue = true;
                    }
                }

                return rValue;

            },
            addRow:function(row, position){
                var self = $(this);
                var plugin = self.data('plg');

                if(self.attr('role') === plugin.settings.namespace){
                    var nPosition = parseFloat(position) - 1;
                    var elPos = $('.biz-wp-table-body tr:eq( '+nPosition+' )',self);
                    var posLength = $('[data-pos^="added-"]', self).length;

                    var nPosRow = position + posLength;
                    var tmplRow = self.data('plg').settings.rowTemplate;
                    var countCols = $('td',elPos).length;

                    if(countCols < row.length){
                        row = row.slice(0, countCols);

                    }else if(countCols > row.length){

                        var addCols = countCols - row.length;
                        for(var i=0; i<addCols;i++){
                            row.push({value:''});
                        }
                    }

                    for(var j=0; j<row.length; j++){
                        row[j].indexCol = j;
                        row[j].indexRow = 'added-' + nPosRow;
                    }

                    var data = {cols:row, nPosRow:nPosRow};
                    var tmp = $.tmpl(tmplRow, data,{
                            testValue: (self.data('cellValue')) ? self.data('cellValue') : plg.methods.cellValue
                        });
                    var responseTmp = $(tmp);


                    responseTmp.insertAfter(elPos);

                    var completeTask = self.data('onComplete');
                    completeTask.apply(self,[]);

                                        
                    for(var prop in data.datasource){
                        plugin.settings.data.datasource[prop + ''] =  data.datasource[prop];
                    }


                    var components = $('[role^="component:"]', self);

                    if(components.length > 0){
                        plugin.methods.createComponents.apply(self, [components]);
                    }
                }

            },
            addColumn:function(){
                var self = this;
            },
            /**
            * Destroy Table
            *
            *   $('selector').uitable('destroy');
            *
            * @method destroy
            * @return {Object} Jquery Empty Object
            */
            destroy:function(op){
                var self = $(this);
                if(self.attr('role') === self.data().plg.settings.namespace){
                    self.attr('role','');
                    self.empty();

                }else{
                    $.error('No es posible eliminar un control con un namespace diferente: [role: ' + op.namespace+']');
                }
            }
        };


        
        if(typeof options != 'object' && options) {

                var _self = $(this);
                if(_self.attr('role') === $.bizagi.ui.controls.uitable.namespace){

                    $.extend(plg.settings, params, plg.config);
                    var args = plg.util.clone(arguments);
                    args = args.slice(1,args.length);
                    return plg.methods[arguments[0]].apply(this, args);

                }else{
                    return false;
                }

        } else if( typeof options === 'object' || !options || options === undefined) {

                $.extend(plg.settings, options, plg.config);
                return this.each(function() {
                    plg.methods.init.apply(this, [plg.settings]);
                });

        } else {

                $.error('Method ' + options + ' does not exist on jQuery.table');

        }

    };

    $.bizagi.ui.controls.uitable.plugin = $.fn.uitable;

}( jQuery ));