
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['js/*.js'],
      options: {
          ignores: ['js/raphael.js','js/raphael.min.js', 'js/jquery.processviewer.definition.js']
      }
    },
    watch: {
      js: {
        files: ['js/jquery.processviewer.js', 'js/jquery.processviewer.queries.js'],
        tasks: ['jshint', 'uglify']
      }
    },
    copy: {
      main: {
        files: [
          {src: ['js/jquery.processviewer.js'], dest: '<%= pkg.exportProject %>'} // includes files in path and its subdirs
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('dp-grunt-contrib-copy');


  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('check', ['watch']);


};