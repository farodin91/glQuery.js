'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('grunt-sample.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    copy: {
      dev:{
        files: [
          {
            expand: true,
            cwd: './src',
            src: ['**/*.js'],
            dest: '.tmp/public'
          }
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['.tmp/public/**/*.js'],
        dest: '.tmp/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    //qunit: {
    //  files: ['test/**/*.html']
    //},
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      worker: {
        options: {
          jshintrc: 'src/worker/.jshintrc'
        },
        src: ['src/worker/**/*.js']
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js', '!src/worker/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      worker: {
        files: '<%= jshint.worker.src %>',
        tasks: ['jshint:worker', 'copy:dev','concat']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src','copy:dev', 'concat']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['jshint','copy:dev', 'concat', 'uglify']);
  // Default task.
  grunt.registerTask('test', ['jshint','copy:dev', 'concat','watch']);

};
