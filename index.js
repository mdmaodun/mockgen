;((window) => {
  Mock.Random.extend({
    'date.now': () => Date.now(),
    phone: () => Mock.mock(/^1[35678]\d{9}$/),
    tel: () => Mock.mock(/^0\d{2,3}-[1-9]\d{6,7}$/)
  })

  window.vm = new Vue({
    data: {
      jsonStr: '{}',
      jsonStrOfMock: '{}',
      errMsg: ''
    },
    methods: {
      onBlur() {
        try {
          this.errMsg = ''
          const jsonObj = eval('false || ' + this.jsonStr)

          this.jsonStr = JSON.stringify(
            jsonObj,
            (k, v) => {
              if (k) {
                if (v instanceof Function) {
                  return `__remove_double_quote_mark__${v
                    .toString()
                    .replace(/\n/g, '__/n__')
                    .replace(/\t/g, '__/t__')}__remove_double_quote_mark__`
                }
                if (v instanceof RegExp) {
                  return `__remove_double_quote_mark__${v
                    .toString()
                    .replace(/\\/g, '__/__')}__remove_double_quote_mark__`
                }
              }
              return v
            },
            2
          )
            .replace(/\"?__remove_double_quote_mark__\"?/g, '')
            .replace(/__\/__/g, '\\')
            .replace(/__\/n__/g, '\n')
            .replace(/__\/t__/g, '\t')

          const jsonObjOfMock = Mock.mock(jsonObj)
          this.jsonStrOfMock = JSON.stringify(jsonObjOfMock, null, 2)
        } catch (err) {
          console.log(err)
          this.errMsg = err.message
        }
      }
    }
  }).$mount('#app')
})(window)
