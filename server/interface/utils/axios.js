import axios from 'axios'

const instance = axios.create({
  baseUrl: `http://${process.env.HOST || 'lcoalhost'}:${process.env.PORT || 3000}`,
  tiemout: 1000,
  headers: { }
})

export default instance
