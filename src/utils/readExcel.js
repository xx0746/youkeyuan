
  // 读取表格xls|xlsx格式文件的内容
export default function readerData(itemFile) {
  let testmsg = /\.(xls|xlsx)(\?.*)?$/.test(itemFile.name)
  if (!testmsg) {
    let results = {
      code: 0,
      data: null,
      sheetName: null,
      msg: "不支持读取的文件格式"
    }
    return results
  } else {
    let reader = new FileReader()
    reader.onload = e => {
      let data = e.target.result
      let fixedData = fixdata(data)
      let workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
      let firstSheetName = workbook.SheetNames[0] // 第一张表 sheet1
      let worksheet = workbook.Sheets[firstSheetName] // 读取sheet1表中的数据
      // delete worksheet['!merges']let A_l = worksheet['!ref'].split(':')[1] //当excel存在标题行时, 删除标题
      let results = {
        code: 1,
        data: XLSX.utils.sheet_to_json(worksheet),
        sheetName: firstSheetName,
        msg: "读取成功！"
      }
      return results
    }
    reader.readAsArrayBuffer(itemFile)
  }
};
// 处理表格数据
function fixdata(data) {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l)
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}