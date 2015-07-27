prerender-compressed-file-cache
====================
Prerender plugin for caching in file system, to be used with the prerender node application from https://github.com/prerender/prerender.

Heavily inspired in suhanovv's rerender-file-cache (https://github.com/suhanovv/prerender-file-cache/) code.


#How it works

This plugin will store all prerendered pages into a filesystem hierarchy.
For example: 

url http://domain.lo/?_escaped_fragment_=/en/about - will be saved in CACHE_ROOT_DIR/en/about/___  
url http://domain.lo/?_escaped_fragment_=/en/main/path/blah - will be saved in CACHE_ROOT_DIR/en/main/path/blah/___

and etc

#How to use

In your local prerender project run:

$ npm install prerender-compressed-file-cache --save
Then in the server.js that initializes the prerender:

server.use(require('prerender-compressed-file-cache'));

##Configuration

export CACHE_ROOT_DIR=/you/directory/for/cache  
export CACHE_LIVE_TIME=10000 (in seconds)

