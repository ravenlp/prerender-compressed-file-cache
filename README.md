#prerender-compressed-file-cache

Prerender plugin for caching in file system, to be used with the prerender node application from https://github.com/prerender/prerender.

Heavily inspired in suhanovv's rerender-file-cache (https://github.com/suhanovv/prerender-file-cache/) code, but this one compress the files so they take *a lot* less disk space.

##How it works

This plugin will store all prerendered pages into a filesystem hierarchy but it can be configured to store the files in a custom way.

##How to use

In your local prerender project run:

    $ npm install prerender-compressed-file-cache --save
Then in the server.js that initializes the prerender:

```js
// Default behavior 
server.use(require('prerender-compressed-file-cache')());

// Example: 
// http://domain.com/?\_escaped\_fragment\_=/en/about - will be saved in **CACHE_ROOT_DIR**/en/about/\_\_\_
// http://domain.com/?\_escaped\_fragment\_=/en/main/path/blah - will be saved in **CACHE_ROOT_DIR**/en/main/path/blah/\_\_\_

// If  your cache strategy needs a different folder hierarchy use a custom path builder
var cache_config = {
    /**
     * Example of custom path builder
     * @param key String the url of the resource being processed
     * @return path String folder path like '../', 'f1/f2/f3/.../'
     */
    pathBuilder: function(key) {
        var now = new Date();
        return process.env.CACHE_ROOT_DIR + '/' + [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
    },
    // Custom file name
    fileName: '.cache'
}
server.use(require('prerender-compressed-file-cache')(cache_config));

// Example assuming today is 03/03/2015
// http://domain.com/?\_escaped\_fragment\_=/en/about - will be saved in **CACHE_ROOT_DIR**/2005-03-03/.cache
```

###External Configuration
export **CACHE_ROOT_DIR**=/root/directory/for/cache  
export **CACHE_LIVE_TIME**=10000 (in seconds)

