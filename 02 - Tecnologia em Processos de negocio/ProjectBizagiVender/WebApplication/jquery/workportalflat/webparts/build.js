var FS = require('fs');
var PATH = require('path');
var term = require( 'terminal-kit' ).terminal;

var webparts = {};

function readJSON( fileName ) {
  var content = '';
  try {
    content = JSON.parse(( FS.readFileSync(fileName) + '' ).trim());
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
      });
    });
  });
}

function addWebpart( dir, name, data, device ) {
  device = device || 'all';
  term.cyan(' - Adding: ').white('%s', dir.split('/').pop()).brightBlack('@%s\n', device );
  if( webparts[device] === undefined ) {
    webparts[device] = {
      names: [],
      js: [],
      css: [],
      tmpl: {}
    };
  }

  webparts[device].names.push( name );

  data.js.map(function( js ){
    webparts[device].js.push( dir + '/' + js.src );
  });

  data.css.map(function( css ){
    webparts[device].css.push( dir + '/' + css.src );
  });

  data.tmpl.map(function( tmpl ){
    webparts[device].tmpl[tmpl.alias] = dir + '/' + tmpl.src;
  });

}

function parseWebpartDefinition( definitionFile ) {
  var dir = PATH.dirname(definitionFile);
  var definition = readJSON(definitionFile);

  if( !definition.devices ) {
    addWebpart( dir, definition.name, definition );
  }
  else {
    var devices = Object.keys( definition.devices );
    devices.map(function( device ){
      addWebpart(dir, definition.name, definition.devices[device], device);
    });
  }
}

function parseWebpartDirectory( dir ) {
  dir = dir.replace(/\/+$/, '');
  var dirName = dir.split('/').pop();

  if( FS.existsSync(dir) ) {
    var data = {
      js: [],
      css: [],
      tmpl: []
    };

    var haystacks = FS.readdirSync(dir),
      path = '',
      stats = null,
      haystack = '';

    for( var c = 0; c < haystacks.length; c++ ) {
      haystack = haystacks[c];
      path = dir + '/' + haystack;
      stats = FS.statSync(path);
      if(!stats.isDirectory()) {
        if (/\.js$/.test(haystack)) {
          data.js.push({
            src: haystack
          });
        }
        else if (/\.css$/.test(haystack)) {
          data.css.push({
            src: haystack
          });
        }
        else if (/\.tmpl\.html$/.test(haystack)) {
          data.css.push({
            alias: dirName + '-tmpl',
            src: haystack
          });
        }
      }

      addWebpart( dir, dirName, data );

      if(stats.isDirectory()) {
        parseWebpartDirectory( path );
      }
    }
  }
}

function findFile(dir, needle, recursive) {
  if( FS.existsSync(dir) ) {
    var haystacks = FS.readdirSync(dir),
      path = '',
      stats = null,
      found = null,
      haystack = '';

    for( var c = 0; c < haystacks.length; c++ ) {
      haystack = haystacks[c];
      path = dir + haystack;
      stats = FS.statSync(path);
      if(recursive && stats.isDirectory()) {
        found = findFile(path, needle, recursive);
        if( found ) {
          return found;
        }
      }
      else if(haystack.indexOf(needle) >= 0) {
        return path;
      }
    }
  }
  else {
    term.yellow('Directory "%s" does not exist.', dir);
  }

  return null;
}

function scanFiles( dir ) {

  if(!FS.existsSync(dir)) {
    term.red( ' Directory "%s" does not exist.\n', dir );
    return;
  }

  var directories = FS.readdirSync(dir);

  directories.map(function( webpartName ){
    var basePath = dir + '/' + webpartName + '/';
    var definitionFile = findFile(basePath, 'webpart.definition.json.txt');

    if( definitionFile ) {
      parseWebpartDefinition( definitionFile );
    }
    else {
      parseWebpartDirectory( basePath );
    }
  });

}

function createDefinitions() {
  var all = webparts.all;
  delete(webparts.all);
  var devices = Object.keys( webparts );

  term('\n');
  devices.map(function( device ){

    var definition = webparts[device];
    term.brightCyan(' - Creating ').white( device ).brightBlack(' definition\n' );

    (all.names || []).map(function( name ){
      if( definition.names.indexOf( name ) === -1 ) {
        definition.names.unshift(name);
      }
    });

    (all.js || []).map(function( js ){
      if( definition.js.indexOf( js ) === -1 ) {
        definition.js.unshift(js);
      }
    });
    term.white('    JS (%s) [%s]\n', definition.js.length, String.fromCharCode(0x2713) );

    (all.css || []).map(function( css ){
      if( definition.css.indexOf( css ) === -1 ) {
        definition.css.unshift(css);
      }
    });
    term.white('    CSS (%s) [%s]\n', definition.css.length, String.fromCharCode(0x2713) );

    var tmpls = Object.keys( all.tmpl );
    tmpls.map(function( tmpl ){
      if( !definition.tmpl[tmpl] ) {
        definition.tmpl[tmpl] = all.tmpl[tmpl];
      }
    });
    term.white('    TMPL (%s) [%s]\n', Object.keys( definition.tmpl ).length, String.fromCharCode(0x2713) );
  });
}

function writeDefinitionFiles( basePath ) {
  var devices = Object.keys( webparts );

  term('\n');
  devices.map(function( device ){
    var definition = webparts[device];
    definition.basePath = basePath;

    writeFile( basePath, 'webpart.' + device.toLowerCase().replace(/[^a-z0-9]/g, '') + '.definition.json.txt', JSON.stringify( definition ) );
  });
}


term.bold.white( '\nCompiling webparts ...\n' ) ;

var targetDir = __dirname.replace(/[\\]+/g, '/') + '/';
try {
  scanFiles('common');
  createDefinitions();

  term.bold.white( '\nWritting to: %s\n', targetDir ) ;
  writeDefinitionFiles( targetDir );

  term.bold.green('\nAll Done [%s]\n', String.fromCharCode(0x2713));
}
catch( e ) {
  term.bold.red('\n  ERROR: ').red('%s. \n', ( e && e.getMessage ? e.getMessage() : e + '' ).replace(/^ERROR: /i, '') );
  term.bold.red('\nDone with errors [%s]\n', String.fromCharCode(0x2717));
}

term.defaultColor('\n');

