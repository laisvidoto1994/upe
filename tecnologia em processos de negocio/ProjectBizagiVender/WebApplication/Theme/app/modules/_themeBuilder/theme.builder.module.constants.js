/**
 * _themeBuilder Constants Definition
 * @author: Ramiro Gómez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder')
    .constant('APP', {
        TEMPLATES:{
            INIT: 'app/modules/views/theme.builder.init.tmpl.html',
            DESKTOP: 'app/modules/views/theme.builder.for.desktop.tmpl.html',
            MOBILE: 'app/modules/views/theme.builder.for.mobile.tmpl.html',
            SIDES:{
                BOTH:'app/modules/views/sides/theme.builder.for.both.tmpl.html',
                MOBILE:'app/modules/views/sides/theme.builder.for.mobile.tmpl.html',
                DESKTOP:'app/modules/views/sides/theme.builder.for.desktop.tmpl.html'

            }
        },
        MODULES:{

        },
        EVENTS:{
            "":""
        }
    });