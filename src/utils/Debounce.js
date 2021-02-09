/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
let timeout = null
export const debounce = (fn, t) => {
 if(timeout !== null) clearTimeout(timeout)
 timeout = setTimeout(fn, t)
}
/**
* 函数节流 (一定时间内点击多次只执行一次)
* @param fn
* @param interval
* @returns {Function}
* @constructor
*/
let lastTime;
let timer;
export const throttle = (fn, t) => {
  let now = +new Date();
  if(lastTime && lastTime - now < 2000){
      clearTimeout(timer)
  }
  timer = setTimeout(function () {
    fn();
    lastTime = +new Date()
  },t)
};
// 节流方法2
// export const Throttle = (fn, t) => {
//   let last;
//   let timer;
//   let interval = t || 500;
//   return function () {
//       let args = arguments;
//       let now = +new Date();
//       if (last && now - last < interval) {
//           clearTimeout(timer);
//           timer = setTimeout(() => {
//               last = now;
//               fn.apply(this, args);
//           }, interval);
//       } else {
//           last = now;
//           fn.apply(this, args);
//       }
//   }
// };