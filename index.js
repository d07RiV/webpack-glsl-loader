'use strict';

var fs = require('fs');
var path = require('path');

function parse(loader, source, context, ext, cb) {
    var imports = [];
    var importPattern = /^[ \t]*#[ \t]*include[ \t]+(['"])(.*)\1[ \t]*$/gmi;
    var match = importPattern.exec(source);

    while (match != null) {
        imports.push({
            key: match[2],
            target: match[0],
            content: ''
        });
        match = importPattern.exec(source);
    }

    processImports(loader, source, context, ext, imports, cb);
}

function processImports(loader, source, context, ext, imports, cb) {
    if (imports.length === 0) {
        return cb(null, source);
    }

    var imp = imports.pop();
    
    var name = "./" + imp.key;
    if (!path.extname(name)) {
        name += ext;
    }

    loader.resolve(context, name, function(err, resolved) {
        if (err) {
            return cb(Error(err.message + "wtf"));
        }

        loader.addDependency(resolved);
        fs.readFile(resolved, 'utf-8', function(err, src) {
            if (err) {
                return cb(err);
            }

            parse(loader, src, path.dirname(resolved), path.extname(resolved), function(err, bld) {
                if (err) {
                    return cb(err);
                }

                source = source.replace(imp.target, bld);
                processImports(loader, source, context, ext, imports, cb);
            });
        });
    });
}

module.exports = function(source) {
    this.cacheable();
    var cb = this.async();
    parse(this, source, this.context, path.extname(this.resourcePath), function(err, bld) {
        if (err) {
            return cb(err);
        }

        cb(null, 'module.exports = ' + JSON.stringify(bld));
    });
};
