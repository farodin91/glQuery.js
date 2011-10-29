var i = 0;
self.onmessage =function(event){
    if(event.data == "addedObject" && i == 0){
        i++;
        self.postMessage(true);
    }
}