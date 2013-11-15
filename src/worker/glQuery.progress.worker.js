/*
 * Copyright 2013, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.progress.worker.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 */
var value = 0.0;
var step = "init";
var lockMouse = false;
//var laststep = "init";
//var timeout  = 0;
var stepLength = 1;
var val = 0.0;

self.onmessage = function(event){
    var data = event.data;
    if(data.step !== undefined){
        switch(data.step.type){
            case "init":
                value = 2;
                break;
            case "checkbrowser":
                value = 4;
                break;
            case "fullscreen":
                value = 12;
                break;
            case "lockmouse":
                value = 10;
                break;
            case "createwebgl":
                value = 12 + data.step.value;
                break;
            case "loadingmodels":
                value = data.step.value;
                break;
            case "loadinglights":
                break;
            case "connect":
                break;
        }
        
    }else if(data.options !== undefined){
        lockMouse = data.options.lockMouse;
        setInterval(function(){
            if(val < value){
                val += stepLength;
                if(val <= 2){
                    step = "init";
                }else if(val > 2 && val <= 4){
                    step = "checkbrowser";
                }else if(val > 4 && val <= 10 && lockMouse === true){
                    step = "lockmouse";
                }else if(val > 4 && val <= 10 && lockMouse === false){
                    step = "fullscreen";
                }else if(val > 10 && val <= 12){
                    step = "fullscreen";
                }else if(val > 12 && val <= 20){
                    step = "createwebgl";
                }else if(val > 20 && val <= 50){
                    step = "loadingmodels";
                }else if(val > 50 && val <= 70){
                    step = "loadinglights";
                }else if(val > 70 && val <= 90){
                    step = "creategui";
                }else if(val > 90){
                    step = "connect";
                }
                self.postMessage({//remove json
                    info:step,
                    value:val
                });
            }
        },70);
    }else{
        
    }
};