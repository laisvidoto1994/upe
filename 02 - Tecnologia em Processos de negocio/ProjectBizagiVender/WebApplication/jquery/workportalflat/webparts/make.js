var FS = require('fs');
var PATH = require('path');
var term = require( 'terminal-kit' ).terminal;
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');
var Cheerio = require('cheerio');
var Entities = require("entities");

function readJSON( fileName ) {
  var content = '';
  try {
    content = JSON.parse(( FS.readFileSync(fileName) + "" ).trim());
  }
  catch( e ) {
    term.red('  ERROR: File "%s" could not be parsed!\n', fileName);
    throw e;
  }

  return content;
}

function writeFile( dir, fileName, content ) {
  var path = dir + '/' + fileName;
  var buffer = new Buffer( content );

  FS.open(path, 'w+', function(err, fd) {
    if (err) {
      term.red(' ERROR Opening ').brightRed( fileName ).red('.');
      throw new Error( 'Error opening file: ' + err );
    }

    FS.write(fd, buffer, 0, buffer.length, null, function(err) {
      if (err) {
        term.red(' ERROR Writing ').brightRed( fileName ).red('.');
        throw new Error( 'Error opening file: ' + err );
      }
      FS.close(fd, function() {
        term.green('[%s] Writing ', String.fromCharCode(0x2713)).brightGreen( fileName ).green('.\n');
      })
    });
  });
}

function findDefinitionFiles(dir) {
  var files = [];
  dir = ( dir || "." ).replace(/[\\]+/g, '/') + '/';

  if( FS.existsSync(dir) ) {
    var haystacks = FS.readdirSync(dir),
      path = '',
      stats = null,
      haystack = '';

    for( var c = 0; c < haystacks.length; c++ ) {
      haystack = haystacks[c];
      path = dir + haystack;
      stats = FS.statSync(path);
      if(!stats.isDirectory() && /\.definition\.json\.txt$/.test(haystack) ) {
        files.push( haystack );
      }
    }
  }
  else {
    term.yellow('Directory "%s" does not exist.', dir);
  }

  return files;
}

function compileJSFiles( definitionFile, outputDir ) {

  term.cyan(' - Compiling: ').white('JS').brightBlack('@%s ...\n', definitionFile );

  var dir = ( outputDir || "." ).replace(/[\\]+/g, '/') + '/';
  var fileName = definitionFile.replace(/\.definition\.json\.txt$/, '.production.js');
  var definition = readJSON( definitionFile );

  var js = UglifyJS.minify(definition.js, {
    outSourceMap: fileName + '.map',
    outFileName: fileName
  });

  var addWebpartNames = 'if(bizagi.loader.registerMobileWebpart){bizagi.loader.registerMobileWebpart(' + JSON.stringify(definition.names) + ')};';
  writeFile( dir, fileName, addWebpartNames + js.code );
  writeFile( dir, fileName + '.map', js.map );

}

function compileCSSFiles( definitionFile, outputDir ) {

  term.cyan(' - Compiling: ').white('CSS').brightBlack('@%s ...\n', definitionFile );

  var dir = ( outputDir || '.' ).replace(/[\\]+/g, '/') + '/';
  var fileName = definitionFile.replace(/\.definition\.json\.txt$/, '.production.css');

  var definition = readJSON(definitionFile);

  var css = new CleanCSS({
    sourceMap: true,
    relativeTo: PATH.normalize( outputDir )
  }).minify(definition.css);

  /**
   * @todo Fix relative paths:
   * ON: url(...), url('...'), url("...")
   * NOT: url(/...), url('/...'), url("/..."), url('data:...')
   */

  writeFile( dir, fileName, css.styles );
  writeFile( dir, fileName + '.map', css.sourceMap + '' );

}

function compileTMPLFiles( definitionFile, outputDir ) {

  term.cyan(' - Compiling: ').white('TMPL').brightBlack('@%s ...\n', definitionFile );

  var dir = ( outputDir || '.' ).replace(/[\\]+/g, '/') + '/';
  var fileName = definitionFile.replace(/\.definition\.json\.txt$/, '.production.tmpl.html');

  var definition = readJSON(definitionFile);
  var keys = Object.keys( definition.tmpl );
  keys.map(function( key ){

    var parts = definition.tmpl[key].match(/^(.*)\.tmpl\.html(.*)$/);
    if( !parts ) {
      term.red('  ERROR: File "%s" does not match for a tmpl.!\n', fileName);
    }
    else {
      var tmplFileName = parts[1] + '.tmpl.html';
      var selector = parts[2];
      var path = definition.basePath + '/' + tmplFileName;
      var content = FS.readFileSync( path ) + '';
      var $tmpl = Cheerio.load(content);

      var html = ( selector ? $tmpl(selector).text() + '' : $tmpl.text() );
      html = html
          .replace(/([\r\n]+[ \t]+|[\n]+|[\r]+)/g, '')
          .replace(/([>< ])([ ]{2,})/g, '$1');

      /**
       * @todo what about special or encoded
       */
      definition.tmpl[key] = Entities.decodeHTML(html);
    }
  });

  var code = JSON.stringify( definition.tmpl )
    .replace(/([\r\n]+[ \t]+|[\n]+|[\r]+)/g, '');

  writeFile( dir, fileName, code );
}


term.bold.white( '\nCompiling definitions ...\n' ) ;

var targetDir = ( process.argv[2] ? process.argv[2] : '../production' );
if( !targetDir || targetDir === 'test' )
    targetDir = __dirname;
targetDir = targetDir.replace(/[\\]+/g, '/') + '/';

if( !FS.existsSync(targetDir) ) {
  FS.mkdirSync(targetDir);
}

try {
  var definitionFiles = findDefinitionFiles( __dirname );

  term.bold.white( '\nWritting to: %s\n', targetDir ) ;
  definitionFiles.map(function( definition ){
    compileJSFiles( definition, targetDir );
    compileCSSFiles( definition, targetDir );
    compileTMPLFiles( definition, targetDir );
  });

  term.bold.green('\nAll Done [%s]\n', String.fromCharCode(0x2713));
}
catch( e ) {
  term.bold.red('\n  ERROR: ').red('%s. \n', ( e && e.getMessage ? e.getMessage() : e + "" ).replace(/^ERROR: /i, '') );
  term.bold.red('\nDone with errors [%s]\n', String.fromCharCode(0x2717));
  console.log( e );
}

term.defaultColor('\n');

