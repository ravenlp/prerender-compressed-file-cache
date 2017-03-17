var cache_manager = require('cache-manager'),
    fs = require('node-fs'),
    zlib = require('zlib');

module.exports = function(config){
    var defaults = {
        /**
         * Builds the path where the file are going to be stored
         * uses the default function if no other is provided (config.pathBuilder)
         * @param key String the url of the resource being processed
         * @return path String folder path like '../', 'f1/f2/f3/.../'
         */
        pathBuilder: config.pathBuilder || function(key){
            var path = process.env.CACHE_ROOT_DIR,
                request_url = key.split('#!')[1],
                filename = defaults.fileName;
             
            return path + (request_url || '');
        },
        fileName: config.fileName || '___'
    }
    return{
        init: function() {
            this.cache = cache_manager.caching({
                store: file_cache(defaults)
            });
        },

        beforePhantomRequest: function(req, res, next) {
            if(req.method !== 'GET') {
                return next();
            }

            this.cache.get(req.prerender.url, function (err, result) {
                if (!err && result) {
                    var now = new Date();
                    console.log(now.toDateString() + ' ' + now.toTimeString() + ' cache hit');
                    zlib.inflate(result, function(error, result) {
                        if (!error) {
                            match = /<meta[^<>]*(?:name=['"]prerender-status-code['"][^<>]*content=['"]([0-9]{3})['"]|content=['"]([0-9]{3})['"][^<>]*name=['"]prerender-status-code['"])[^<>]*>/i.exec(String.fromCharCode.apply(null, result));
                            res.send(match[1] || match[2] || 200, result);
                        }
                    });
                } else {
                    next();
                }
            });
        },

        afterPhantomRequest: function(req, res, next) {
            if (req.prerender.statusCode == 200) {
                this.cache.set(req.prerender.url, req.prerender.documentHTML);
            }
            next();
        }
    }
};


var file_cache = function(defaults){
    return {
        get: function(key, callback) {
            var cache_live_time = process.env.CACHE_LIVE_TIME;

            var path = defaults.pathBuilder(key);

            fs.exists(path, function(exists){
                if (exists === false) {
                    return callback(null)
                }

                var date = new Date();
                if (date.getTime() - fs.statSync(path).mtime.getTime() > cache_live_time * 1000) {
                    return callback(null)
                }

                fs.readFile(path + '/' + defaults.fileName, callback);
            });

        },
        set: function(key, value, callback) {
            var path = defaults.pathBuilder(key);

            fs.exists(path, function(exists){
                if (exists === false) {
                    fs.mkdirSync(path, '0777',true);
                }
                zlib.deflate(value, function(error, result) {
                    if(error) {
                        throw error;
                    }
                    fs.writeFile(path + '/' + defaults.fileName, result, callback);
                })
            });
        }
    }
};


