module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sourceDir: "src/",

        source: {
            less: "<%= sourceDir %>less/",
            js: "<%= sourceDir %>js/"
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'public/javascript/<%= pkg.name %>.min.js'
            }
        },

        less: {
            development: {
                options: {
                    paths: ['assets/css']
                },
                files: {
                    "public/stylesheets/style.css": [
                        "src/less/global.less"
                    ]
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    plugins: [
                        new(require('less-plugin-autoprefix'))({
                            browsers: ["last 2 versions"]
                        })
                    ]
                },
                files: {
                    "public/stylesheets/style.css": [
                        "src/less/global.less"
                    ]
                }
            }
        },
        watch: {
            options: {
                livereload: 35729
            },
            grunt: {
                files: ["Gruntfile.js"],
                tasks: ["default"]
            },
            js: {
                files: ["<%= source.js %>**/*.js"],
                tasks: ["js"]
            },
            less: {
                options: {
                    livereload: false
                },
                files: ["<%= source.less %>**/*.less"],
                tasks: ["less"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less']);

    grunt.registerTask("js", ["uglify:build"]);

};
