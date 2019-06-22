module.exports =  {
  dbs: 'mongodb://localhost:27017/mt',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '717503359@qq.com'
    },
    get pass() {
      return 'ifisntifltawbcbi'
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    get expire() {
      return () => {
        return new Date().getTime()*60*60*1000
      }
    }
  }
}