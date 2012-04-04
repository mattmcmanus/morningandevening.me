module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', '*.js', 'lib/**/*.js', 'test/**/*.js'],
      aftermin: ['<config:min.dist.dest']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    },
    concat: {
      dist: {
        src: ['public/js/libs/jquery-1.7.1.js', 'public/js/plugins.js', 'public/js/script.js'],
        dest: 'public/js/scripts.js'
      }
    },
    min: {
      dist: {
        src: ['public/js/scripts.js'],
        dest: 'public/js/scripts.min.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint:files test');
  grunt.registerTask('prep', 'concat min lint:aftermin');
};