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
            src: ['src/**/*.js', '!src/worker/**/*.js'],
            dest: '.tmp/public'
          },
          {
            expand: true,
            flatten: true,
            cwd: './libs',
            src: ['**/*.js'],
            dest: '.tmp/public/libs'
          },
          {
            expand: true,
            flatten: true,
            cwd: './src',
            src: ['**/*.css'],
            dest: '.tmp/public/css'
          },
          {
            expand: true,
            flatten: true,
            cwd: './demo',
            src: ['**/*.dae'],
            dest: '.tmp/public/obj'
          },
          {
            expand: true,
            flatten: true,
            cwd: './src/worker',
            src: ['**/*.js'],
            dest: '.tmp/public/worker'
          }
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      src:{
        src: ['.tmp/public/src/**/*.js', '!src/worker/**/*.js'],
        dest: 'dist/<%= pkg.name %>.src.js'
      },
      libs:{
        src: ['.tmp/public/libs/**/*.js'],
        dest: 'dist/<%= pkg.name %>.libs.js'
      }
    },
    uglify: {
        options: {
          banner: '<%= banner %>'
        },
      src:{
          src: '<%= concat.src.dest %>',
          dest: 'dist/<%= pkg.name %>.src.min.js'
        
      },
      libs:{
        
          src: '<%= concat.libs.dest %>',
          dest: 'dist/<%= pkg.name %>.libs.min.js'
      }
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
        tasks: ['jshint:worker', 'copy:dev']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src','copy:dev']
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
  grunt.registerTask('default', ['jshint','copy:dev', 'concat','uglify' ]);
  // Default task.
  grunt.registerTask('test', ['jshint','copy:dev', 'concat','watch']);

};
