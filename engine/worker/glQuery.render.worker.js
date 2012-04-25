/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.image.worker.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 */
var i = 0;
var k = 0;
self.onmessage =function(event){
    switch(event.data){
        case "objects":
            k = 1;
            if(i == 1 && k == 1)
                self.postMessage(true);
            break;
        case "fullscreen":
            i = 1;
            if(i == 1 && k == 1)
                self.postMessage(true);
            break;
        case "loadedTextures":
            break;
    }
}
