(function(window){
  var baseMimeTypes = {
    ".gif":"image/gif",
    ".jpg":"image/jpeg",
    ".png":"image/png",
    ".bmp":"image/bmp",
    ".webp":"image/webp",

    ".txt":"text/plain",

    ".pdf":"application/pdf",

    ".doc":"application/msword",
    ".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls":"application/vnd.ms-excel",
    ".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt":"application/vnd.ms-powerpoint",
    ".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  var baseMime = {
    getMimeType:function(fileExtension){
      var findType = Object.keys(baseMimeTypes).find(function(item){
        return fileExtension.toLowerCase() === item.toLowerCase();
      });
      if(findType){
        return findType[fileExtension];
      }else{
        console.log(new Error('not find mime-type of "'+fileExtension+'"'));
        return '';
      }
    },
    getExtension(mimeType){
      var findExtension = '';
      var findType = Object.keys(baseMimeTypes).find(function(item){
        if(mimeType.toLowerCase() === baseMimeTypes[item].toLowerCase()){
          findExtension = item;
          return true;
        }
      });
      if(findExtension){
        return findExtension;
      }else{
        console.log(new Error('not find file-extension of "'+mimeType+'"'));
        return '';
      }
    }
  }
  if(window && window.window === window){
    window.baseMime = baseMime
  }
})(this);