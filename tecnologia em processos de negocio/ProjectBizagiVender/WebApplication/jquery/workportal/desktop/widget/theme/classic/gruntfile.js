module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            css: {
                files: ['./**/*.css', './**/*.less', '!./node_modules/**/*.*'],
                tasks: ['less', 'generate-theme'],
                options: {
                    spawn: false,
                },
            },
            others: {
                files: ['./**/*.js', './**/*.html', './**/*.htm', '!./node_modules/**/*.*'],
                tasks: ['generate-theme'],
                options: {
                    spawn: false,
                },
            }
        },
        less: {
            components: {
                options: {
                    paths: ["./ui"]
                },
                files: [{
                      expand: true,
                      src:['./**/*.less', '!./node_modules/**/*.less'],
                      dest: 'css/',
                      ext: '.css'
                    }]
                
            }
        },
        theme: {
            name: 'theme1',
            module: 'homeModule'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('generate-theme', 'Generate theme file.', function () {
        console.log("arguments", grunt.config.get('theme'))
        var config = grunt.config.get('theme');
        var js = grunt.file.expand('./**/*Module.js', './**/*.js', '!./node_modules/**/*.js', '!./**/gruntfile.js');
        var css = grunt.file.expand('./**/*.css', '!./node_modules/**/*.css');
        var html = grunt.file.expand('./**/*.html', './**/*.htm', '!./node_modules/**/*.html', '!./node_modules/**/*.htm');

        var jsFiles = [];
        var cssFiles = [];
        var htmlFiles = [];

        for (var i = 0; i < js.length; i++) {
            jsFiles.push({
                name: js[i],
                content: grunt.file.read(js[i])
            });
        }

        for (var i = 0; i < css.length; i++) {
            cssFiles.push({
                name: css[i],
                content: grunt.file.read(css[i])
            });
        }

        for (var i = 0; i < html.length; i++) {
            htmlFiles.push({
                name: html[i],
                content: grunt.file.read(html[i])
            });
        }

        var theme = {
            "name": config.name,
            "module": config.module,
            "files": {
                "html": htmlFiles,
                "css":cssFiles,
                "js": jsFiles
            }
        };

        grunt.file.write('../../../../test/data/dummy.'+config.name+'.txt', JSON.stringify(theme));

        grunt.log.writeln('The theme is available');
    });
};