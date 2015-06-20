var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	insert = require('gulp-insert'),
	webpack = require('gulp-webpack')
;

var packageName = 'react-datetime';
var pack = require( './package.json' );

var getWPConfig = function( filename ){
	return {
		externals: {
			react: {
				root: 'React',
			},
			moment: {
				root: 'moment'
			}
		},
		output: {
			libraryTarget: 'umd',
			library: 'Datetime',
			filename: filename + '.js'
		}
	};
};

var cr = ('/*\n%%name%% v%%version%%\n%%homepage%%\n%%license%%: https://github.com/arqex/' + packageName + '/raw/master/LICENSE\n*/\n')
	.replace( '%%name%%', pack.name)
	.replace( '%%version%%', pack.version)
	.replace( '%%license%%', pack.license)
	.replace( '%%homepage%%', pack.homepage)
;

function wp( config, minify ){
	var stream =  gulp.src('./Datetime.js')
		.pipe( webpack( config ) )
	;

	if( minify ){
		stream.pipe( uglify() );
	}

	return stream.pipe( insert.prepend( cr ) )
		.pipe( gulp.dest('dist/') )
	;
}

gulp.task("build", function( callback ) {
	var config = getWPConfig( 'react-datetime' );
	config.devtool = '#eval';
	wp( config );

	config = getWPConfig( 'react-datetime.min' );
	return wp( config, true );
});

gulp.task( 'default', ['build'] );
