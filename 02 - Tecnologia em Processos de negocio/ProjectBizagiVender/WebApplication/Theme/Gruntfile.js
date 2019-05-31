
var now = new Date();
var today = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

var modules = require("./test/scripts/reporter/csslint-html");
var cssLintHTML = modules.bizagiReport.CSSLintHTML || {};


module.exports = function(grunt) {

    var resources = grunt.file.readJSON('map.resources.json');

    var getThemeBuilderFiles = function(){

        grunt.log.writeln('ThemeBuilder Modules ');

        var files = [];
        for(var prop in resources.js){
            if(prop.indexOf('Module') !== -1) {
                grunt.log.ok(['Module: ' + prop]);
                files = files.concat(resources.js[prop]);
            }
        }

        return files;

    };

    var themeBuilderFiles = getThemeBuilderFiles();

    var uglifyFiles = {
        'build/js/conf.min.js': resources.js.config,
        'build/js/angular.min.js': resources.js.angular,
        'build/js/ng.angular.min.js': resources.js.ngAngular,
        'build/js/libs.min.js': resources.js.libraries,
        'build/js/theme.builder.min.js': themeBuilderFiles
    };

    var cssmin = {
        'build/css/app.min.css': resources.css.debug
    };





    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodestatic: {
            server: {
                options: {
                    port: 8001,
                    base: "./../../",
                    verbose: true,
                    keepalive: true
                }
            }
        },

        bgShell: {          
            runWebServerBg: {
                cmd: "node test/scripts/web-server.js -p 8001 -chroot ../../",
                bg: true
            }
        },

        karma: {           
            unitThemeBuilderCommon: {
                configFile: "test/config/karma/theme.builder.common.conf.js"
            },
            unitThemeBuilderMobile: {
                configFile: "test/config/karma/theme.builder.mobile.conf.js"
            },
            unitThemeBuilderDesktop: {
                configFile: "test/config/karma/theme.builder.desktop.conf.js"
            }
        },
        clean: {
            build: {
                src: ["build/"]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false
            },
            build: {
                files: uglifyFiles
            }
        },
        replace: {
            build: {
                src: ['app-build/index.build.html'],             // source files array (supports minimatch)
                dest: 'build/index.html',             // destination directory or file
                replacements: [
                    {
                        from: '{{scripts}}',
                        to: function () {   // callback replacement
                            var src = '';
                            for(var prop in uglifyFiles){
                                src += '<script src="'+prop+'"></script>\n\t\t';
                            }

                            return src;
                        }
                    },
                    {
                        from: '{{css}}',
                        to: function () {   // callback replacement
                            var src = '';
                            for(var prop in cssmin){
                                src += '<link href="'+prop+'" rel="stylesheet">\n\t\t';
                            }

                            return src;
                        }
                    },
                    {
                        from: 'build/',
                        to: ''
                    },
                    {
                        from: 'app/views',
                        to: 'views'
                    },
                    {
                        from: 'app/',
                        to: ''
                    },
                    {
                        from: '{{version}}',
                        to: '<%= pkg.version %>'
                    }
                ]
            },
            ThemeBuilderJs:{
                src: ['build/js/theme.builder.min.js'],             // source files array (supports minimatch)
                overwrite: true,
                replacements:[
                    {
                        from: /(app\/modules\/\w+\/views\/)/gi,
                        to: 'views/'
                    }
                ]
            },
            confJs:{
                src: ['build/js/conf.min.js'],            // source files array (supports minimatch)
                overwrite: true,
                replacements:[
                    {
                        from:'debug:{web:!0}',
                        to:'debug:{web:0}'
                    }
                ]
            },
            debug:{
                src: ['app-build/index.build.html'],             // source files array (supports minimatch)
                dest: 'index.html',             // destination directory or file
                replacements: [
                    {
                        from: '{{scripts}}',
                        to: function () {   // callback replacement
                            var src = '';
                            for(var prop in resources.js){
                                for(var i= 0,l = resources.js[prop].length; i < l; i++){

                                        src += '<script src="' + resources.js[prop][i] + '"></script>\n\t\t';

                                }
                            }
                            return src;
                        }
                    },
                    {
                        from: '{{css}}',
                        to: function () {   // callback replacement
                            var src = '';
                            for(var i= 0,l = resources.css.debug.length; i < l; i++){
                                src += '<link href="'+resources.css.debug[i]+'" rel="stylesheet">\n\t\t';
                            }
                            return src;
                        }
                    },
                    {
                        from: '{{version}}',
                        to: '<%= pkg.version %>'
                    }]
            }
        },
        copy: {
            build: {
                files: [
                    // flattens results to a single level
                    {expand: true, flatten: true, src: ['services.json'], dest: 'build/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/css/fonts/**'], dest: 'build/DocumentViewer/css/fonts/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/css/images/**'], dest: 'build/DocumentViewer/css/images/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/views/**'], dest: 'build/DocumentViewer/views/', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['app/modules/*/views/**'], dest: 'build/DocumentViewer/views/', filter: 'isFile'}
                ]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            build: {
                files: cssmin
            }
        },
        less: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            development: {
                files: {
                    "app/ui/app.css": "app/ui/less/app.less"
                }
            }
        },
        csslint: {
            options: {
                csslintrc: ".csslintrc",
                force: true
            },

            themebuilder: {
                options: {
                    formatters: [
                        {
                            id: "checkstyle-xml",
                            dest: "test/logs/static-code/" + today + "/theme/csslint-theme-builder.xml"
                        },
                        {
                            id: cssLintHTML,
                            dest: "test/logs/static-code/" + today + "/theme/csslint-theme-builder.html"
                        }
                    ]
                },
                exclude: [],
                src: [
                    "app/ui/app.css"
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-karma");

    // Force grunt
    var previousForceState = grunt.option("force");
    grunt.registerTask("force", function(set) {
        if (set === "on") {
            grunt.option("force", true);
        } else if (set === "off") {
            grunt.option("force", false);
        } else if (set === "restore") {
            grunt.option("force", previousForceState);
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['clean','uglify','less','replace','copy', 'cssmin']);
    grunt.registerTask('debug', ['less','replace']);
    grunt.registerTask('dist', ['clean:build','uglify:build','less','replace:build','replace:buildAspx','replace:ThemeBuilderJs','replace:confJs','copy:build','cssmin:build']);
    
    grunt.registerTask("unitThemeBuilderCommon", ["karma:unitThemeBuilderCommon"]);
    grunt.registerTask("unitThemeBuilderMobile", ["karma:unitThemeBuilderMobile"]);
    grunt.registerTask("unitThemeBuilderDesktop", ["karma:unitThemeBuilderDesktop"]);
    grunt.registerTask("unitThemeBuilder", ["unitThemeBuilderCommon","unitThemeBuilderMobile", "unitThemeBuilderDesktop"]);

    // Run Static code
    grunt.registerTask("cssLintThemeBuilder", ["force:on", "less","csslint:themebuilder"]);
};