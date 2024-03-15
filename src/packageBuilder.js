
let _       = require('lodash'),
    fs      = require('fs'),
    shell   = require('shelljs'),
    exec    = require('child_process').exec,
    path    = require('path');


function write(dir, manifestsObj) {
    return Promise.all(
        Object.keys(manifestsObj).map(filename => new Promise((resolve, reject) => {
            let manifest = manifestsObj[filename];
            let filePath = path.join(dir, filename);

            let parsed = path.parse(filePath)

            shell.mkdir('-p', parsed.dir);


            if (path.extname(filename) === '.json') {
                fs.writeFile(
                    filePath,
                    JSON.stringify(manifest, null, 2),
                    err => err ? reject(err) : resolve(filePath)
                );
            } else if (path.extname(filename) === '.js') {
                buildFromManifest(dir, manifest, filename).then(build => {
                   fs.writeFile(
                       filePath,
                       build,
                       err => err ? reject(err) : resolve(filePath)
                   );
                });
            }
        }))
    );
}

function getDependenciesFile(depPath) {
    try {
        return JSON.parse(fs.readFileSync(depPath));
    } catch (error) {
        console.log(`No Dependencies File found at ${depPath}`);
        
    }
}

function generatePackageManifests(config, prebidManifest, codeManifest, relativeTo = '.', globalVarName = 'pbjs') {
    return _.reduce(config, (manifests, config) => {
        config.packages.forEach(pkg => {
            let manifest = manifests[pkg.filename] = {
                installPath: prebidManifest[pkg.version || config.version].installPath,
                buildDir: prebidManifest[pkg.version || config.version].buildDir,
                modules: []
            };

            if (pkg.code) {
                manifest.code = Array.isArray(pkg.code) ?
                    _.map(pkg.code, codePath => path.relative(relativeTo, codeManifest[codePath])) :
                    _.mapValues(
                        pkg.code,
                        codePath => path.relative(relativeTo, codeManifest[codePath])
                    );
            }

            if (Array.isArray(pkg.modules)) {
                manifest.modules = pkg.modules
            }
        });
        return manifests;
    }, {});
}

function buildFromManifest(cwd, manifest, filename) {
    cwd = path.resolve(cwd);

    return new Promise((resolve, reject) => {
        exec(
            `npm run bundle -- --modules=${manifest.modules.join(',')} --bundleName=${filename}`,
            {cwd: manifest.installPath},
            (err, stdout) => {
                if (err) return reject(err)

                fs.readFile(path.resolve(manifest.buildDir, filename), (err, data) => err ? reject(err) : resolve(data))
            }
        );
    })
}

module.exports = {
    write,
    generatePackageManifests,
    buildFromManifest
};