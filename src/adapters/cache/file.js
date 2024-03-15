
let Promise     = require('bluebird');
let fs          = require('fs');
let path        = require('path');
let sanitize    = require('sanitize-filename');

module.exports = function(version) {
    let sanitized = sanitize(version, {
        replacement: '~'
    });
    return new Promise((resolve, reject) => {
        let cacheDir = this.cacheDirs.filter(dir => {
            return fs.existsSync(path.join(dir, sanitized));
        });

        if (cacheDir.length === 0) {
            throw 'not found in any cache';
        }

        const installPath = path.join(cacheDir[0], sanitized)
        const buildDir = path.join(installPath, 'build/dist')
        resolve({ [version]: { installPath, sanitizedVersion: sanitized, version, buildDir } })
    })
    .catch(err => {
        console.log(`Cache miss for version ${version}`);
        return null;
    });
};