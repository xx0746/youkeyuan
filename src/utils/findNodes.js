// var zNodes=[
//   {menuId:0,label:"Aaaa"},
//   {menuId:1,menuPmenuId:0,label:"A"},
//   {menuId:11,menuPmenuId:1,label:"A1"},
//   {menuId:12,menuPmenuId:1,label:"A2"},
//   {menuId:13,menuPmenuId:1,label:"A3"},
//   {menuId:2,menuPmenuId:0,label:"B"},
//   {menuId:21,menuPmenuId:2,label:"B1"},
//   {menuId:22,menuPmenuId:2,label:"B2"},
//   {menuId:23,menuPmenuId:2,label:"B3"},
//   {menuId:3,menuPmenuId:0,label:"C"},
//   {menuId:31,menuPmenuId:3,label:"C1"},
//   {menuId:32,menuPmenuId:3,label:"C2"},
//   {menuId:33,menuPmenuId:3,label:"C3"},
//   {menuId:34,menuPmenuId:31,label:"x"},
//   {menuId:35,menuPmenuId:31,label:"y"},  
//   {menuId:36,menuPmenuId:31,label:"z"},
//   {menuId:37,menuPmenuId:36,label:"z1123"} ,
//   {menuId:38,menuPmenuId:37,label:"z123123123"}   
// ];
// var tree = zNodes.reduce((o, x) => {
//   let menuId = x.menuId
//   let menuPmenuId = x.menuPmenuId
//   o[menuId] = o[menuId] || {children: []}
//   o[menuId].node = x
//   if (menuPmenuId) {
//     o[menuPmenuId] = o[menuPmenuId] || {children: []}
//     o[menuPmenuId].children.push(x)
//   }
//   return o
// }, {})
// 以上结构转化为树结构,如何已经是树结构，则省去
/* 
 * 反向遍历tree树结构数据，获得子树所属的所有父级id
 */
export function findListParents(tree, node) {
  if (!node.menuPmenuId) {
    return []
  }
  return _list(tree, tree[node.menuPmenuId].node)
  function _list (tree, node) {
    if (node.menuPmenuId === 0) {
      return [node]
    } else {
      return _list(tree, tree[node.menuPmenuId].node).concat([node])
    }
  }
}

export function findListFirstChildren(tree, node) {
  if (tree[node.menuId].children.length <= 0) {
    return []
  }
  return _list(tree, tree[node.menuId].children[0])
  function _list (tree, node) {
    if (tree[node.menuId].children.length <= 0) {
      return [node]
    } else {
      return [node].concat(_list(tree, tree[node.menuId].children[0]))
    }
  }
}

// var node = {menuId:36,menuPmenuId:31,label:"z"}
console.log(findListParents(tree, node).map(x => x.label).join(' -> '))
console.log(findListFirstChildren(tree, node).map(x => x.label).join(' -> '))