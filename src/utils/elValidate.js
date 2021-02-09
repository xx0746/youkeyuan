// 正整数数字校验，数据管理添加模板用到
export function elNumberSize(rule, value, callback) {
  let reg = /^[0-9]+.?[0-9]*$/
  if (!reg.test(value)) {
    return callback(new Error("请填写正整数"));
  }
  if (value === null) {
    return callback();
  }
  return callback();
}
// 验证是否整数
export function isInteger (rule, value, callback) {
  if (value!== null && value!=='') {
    setTimeout(() => {
      if (!Number(value)) {
        callback(new Error("请输入正整数"));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    }, 100);
  }else{
    callback();
  }
};
// 输入不能为空或者空格校验
export function typeNamenbsp (rule, value, callback) {
  if (!value) {
    return callback(new Error("输入不可以为空"));
  }
  setTimeout(() => {
    const reg =/\s/;
    // const rsCheck = re.test(value);
    if (reg.test(value)) {
      callback(new Error("不能含有空格"));
    } else {
      callback();
    }
  }, 100);
}
// 输入密码不能少于6位
export function typePasswordLength (rule, value, callback) {
  if (value!== null && value!=='') {
    setTimeout(() => {
      if(value.length <6){
        callback(new Error("密码不得小于六位"));
      }else{
        callback();
      }
    }, 100);
  }
}
// 输入不能为纯空格
export function typePureSpace (rule, value, callback) {
  if (!value) {
    return callback(new Error("输入不可以为空"));
  }
  setTimeout(() => {
    const reg =/^\s+$/gi;
    // const rsCheck = re.test(value);
    if (reg.test(value)) {
      callback(new Error("输入不可以为纯空格"));
    } else {
      callback();
    }
  }, 100);
}

