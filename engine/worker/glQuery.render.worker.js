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
self.onmessage =function(event){
    if(event.data == "addedObject" && i == 0){
        i++;
        self.postMessage(true);
    }
}
