# obj-builder  
一个用于从别的对象构建新的对象的工具，可以用于接口的数据转换，提交表单前数据转换。  

## 用法  
```js
import build from 'obj-build'
const source = {
  id: 1,
  name: 'Lucy',
  height: 160,
  weight: 49,
  gender: 'female',
  birthday: ['2001', '07', '16'],
  status: 2,
  time: 1594900830757
}

const result = build({
  status: 1
})
.from(source)
.pick([
  'id',
  'name',
  ['gender', 'unknown'] // [fieldName, defaultValue]
])
.pickIf(source.status === 2, [
  'time' 
])
.map({
  h: 'height',
  w: ['weight', -1] // [fieldName, defaultValue]
})
// .mapIf(boolVal, {...})
.compute('birthday', (source) => {
  return source.birthday.join('-')
})
// .computeIf(boolVal, {...})
.assign({
  hobbies: ['sketching']
})
.custom(targetObj => {
  targetObj.test = 1
})
.val()

console.log(result)

/*
{ status: 1,
  id: 1,
  name: 'Lucy',
  gender: 'female',
  time: 1594900830757,
  h: 160,
  w: 49,
  birthday: '2001-07-16',
  hobbies: [ 'sketching' ],
  test: 1 }
*/

```
