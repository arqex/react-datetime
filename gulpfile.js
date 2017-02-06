const babel = require('gulp-babel'),
	gulp = require('gulp'),
	insert = require('gulp-insert'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	through = require('through2'),
	uglify = require('gulp-uglify'),
	webpack = require('webpack-stream')
	;

const pack = require( './package.json' );

gulp.task( 'sub', () => {
	// Reason behind having sub as separate task:
	// https://github.com/shama/webpack-stream/issues/114
	return gulp.src( './Datetime.js' )
		.pipe( webpack( getWebpackConfig() ) )
		.pipe( gulp.dest( 'tmp/' ) );
});

gulp.task( 'build', ['sub'], () => {
	return gulp.src( ['tmp/react-datetime.js'] )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
			.pipe( through.obj( function( file, enc, cb ) {
				// Dont pipe through any source map files as
				// it will be handled by gulp-sourcemaps
				const isSourceMap = /\.map$/.test( file.path );
				if ( !isSourceMap ) this.push( file );
				cb();
			}))
			.pipe( plumber() )
			// .pipe( babel( { presets: [ 'es2015'] } ) )
			.pipe( insert.prepend( setHeader ) )
			.pipe( gulp.dest( 'dist/' ) ) // Save .js
			.pipe( uglify() )
			.pipe( insert.prepend( setHeader ) )
			.pipe( rename( { extname: '.min.js' } ) )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( 'dist/' ) ); // Save .min.js
	// TODO: Remove tmp folder
});

gulp.task( 'default', ['build'] );

/*
 * Utility functions
 */

const getWebpackConfig = () => {
	return {
		devtool: '#cheap-module-source-map',
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			moment: 'moment'
		},
		output: {
			library: 'Datetime',
			libraryTarget: 'umd',
			filename: 'react-datetime.js'
		}
	};
};

const setHeader = ( '/*\n%%name%% v%%version%%\n%%homepage%%\n%%license%%: https://github.com/YouCanBookMe/react-datetime/raw/master/LICENSE\n*/\n' )
		.replace( '%%name%%', pack.name)
		.replace( '%%version%%', pack.version)
		.replace( '%%license%%', pack.license)
		.replace( '%%homepage%%', pack.homepage)
	;
