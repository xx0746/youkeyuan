import jschardet from 'jschardet'//文件编码格式
import XLSX from 'xlsx'
export default function readFile(file) {
  return new Promise((resolve, reject) => {
    var forControl = 10;
    var resultStr = ""
    var filename = file.name;
    var fileType = filename.substr(filename.lastIndexOf('.')+1,filename.length);
    let testmsg = /\.(xls|xlsx|csv|txt)(\?.*)?$/.test(file.name)
    // 判断是否是规定的格式
    if(testmsg) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        var data = e.target.result;
        if (fileType == 'txt' || fileType == 'csv') { //txt或csv文件直接读取
          var str = null;
          var viewBuf = null;
          viewBuf = new Uint8Array(data); //此时data为ArrayBuffer
          for (var index in viewBuf) {
            str += String.fromCharCode(viewBuf[index]);
            if (index >= 100) { //考虑到效率，只取前100个用于判断字符集
              break;
            }
          }
          var codepage = jschardet.detect(str.substring(0, 1000)).encoding;
          if (codepage == 'GB2312' || codepage == 'GB18030') {
              codepage = 'GB18030';
          } else if (codepage == 'ascii' || codepage == 'UTF-8' || codepage == 'UTF-16BE' || codepage == 'UTF-16LE') {
    
          } else {
            return reject({msg: '系统不支持编码格式为:' + codepage + '的文件;请选择UTF-8或GB18030(GB2320,GBK)编码格式的文件'});
          }
          resultStr = new TextDecoder(codepage).decode(viewBuf);
          let arr = resultStr.split("\n")
          let head = clear_trim(arr[0]);
          let arrItems = [];
          if(fileType == 'txt') {
            arr.forEach((item, index) => { 
              let obj = {}, temparr = [];
              temparr = clear_trim(item);
              console.log(temparr)
              if(temparr.length != head.length) {
                return reject({msg: '文件内容格式无法识别，请重新上传!'})
              }
              for (let i = 0; i < head.length; i++) {
                obj[head[i]] = temparr[i];
              }
              if(index != 0) {
                arrItems.push(obj)
              }
            })
          } else if(fileType == 'csv') {
            head = head[0].split(',');
            arr.forEach((item, index) => { 
              let obj = {}, temparr = [];
              temparr = item.split(',');
              for (let i = 0; i < head.length; i++) {
                obj[head[i]] = temparr[i];
              }
              if(index != 0) {
                arrItems.push(obj)
              }
            })
          }
          let resultObj = {
            data: arrItems,
            header: head,
            cellTypes: ['s']
          }
          return resolve(resultObj)
        } else if (fileType == 'xls' || fileType == 'xlsx') { //excle文件用js-xlsx解析
          function fixdata(data) {  //arrayBuffer转base64字符串
            var o = "", l = 0, w = 10240;
            for (; l < data.byteLength / w; ++l)
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
              o += String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
            return o;
          }
    
          var readtype = { type: 'base64', cellDates: true };
          var arr = fixdata(data);
          data = btoa(arr);
          try {
            var workbook = XLSX.read(data, readtype);   //workbook.SheetNames[0]是获取Sheets中第一个Sheet的名字,workbook.Sheets[Sheet名]获取第一个Sheet的数据
          } catch (e) {
            return reject({msg: '文件内容格式无法识别，请重新上传'});
          }
          workbook.SheetNames.forEach(function (sheetName) {
            let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true });
            if (roa.length <= 0) {
              return;
            }
            let columns = get_columns(workbook.Sheets[sheetName], fileType);  //获取本sheet的第一行，表头
            let data = get_cellType(workbook.Sheets[sheetName], forControl); //获取表格每列的数据格式，t：文本、n：数值、d：时间
            console.log(data)
            if(data.code == 1) {
              let resultObj = {
                data: roa,
                header: columns,
                cellTypes: data.data.split(',')
              }
              return resolve(resultObj)
            } else {
              return reject({msg: '文件数据格式不统一,请检查您的数据文件！'});
            }
          });
        }
        function get_columns(sheet, type) {   //获取head头(excel文件第一行)
          let val, range, columnHeaders, C;
          if (!sheet['!ref'] || sheet['!merges']) return [];
          range = XLSX.utils.decode_range(sheet["!ref"]);
          columnHeaders = [];
          for (C = range.s.c; C <= range.e.c; ++C) {
            val = sheet[XLSX.utils.encode_cell({ c: C, r: range.s.r })];
            if (!val) continue;
            columnHeaders[C] = type.toLowerCase() == 'xls' ? XLSX.utils.format_cell(val) : val.v;
          }
          return columnHeaders;
        }
        function get_cellType(sheet, forControl) {
          let val, range, C, R, Rmax;
          let cellTypeStr = '';
          let temp = true;
          if (!sheet['!ref']) return { name: filename, msg:'文件内容格式无法识别，请重新上传', code: 0 };
          range = XLSX.utils.decode_range(sheet["!ref"]);
          if(range.e.r < forControl) {
            Rmax = range.e.r;
          } else {
            Rmax = forControl;
          }
          for (R = range.s.r+1; R < Rmax; ++R) {
            var cellType = '';
            for (C = range.s.c; C <= range.e.c; ++C) {
              val = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
              if(val) {
                let cellObj = val.t;
                if(C == range.e.c) {
                  cellType += cellObj;
                } else {
                  cellType += cellObj + ',';
                }
              } else {
                continue;
              }
            }
            if(cellTypeStr == '') {
              cellTypeStr = cellType;
            } else {
              if(cellType != cellTypeStr) {
                temp = false;
              }
            }
          }
          if(temp) {
            return { data: cellTypeStr, name: filename, msg: '成功', code: 1 };
          } else {
            return { name: filename, msg:'文件内容格式无法识别，请重新上传', code: 0 }
          }
        }
        function clear_trim(string) {
          let sVal;
          sVal = string.replace(/\s+/g, ' ');
          sVal = sVal.replace(/(^\s*)|(\s*$)/g, '');
          return sVal.split(" ");
        }
        function clear_trim1(string) {
          let sVal;
          sVal = string.replace(/\s+/g, ' ');
          sVal = sVal.replace(/(^\s*)|(\s*$)/g, '');
          return sVal.split(" ");
        }
      }
    } else {
      return reject({msg: "不支持的文件格式"})
    }
  })
}
function f(){
  var i=0;
  if(typeof(i)=="number"){
    var f=Math.floor(i);
    if(f==i)
      alert("整型");
    else
      alert("浮点型");
  }
}