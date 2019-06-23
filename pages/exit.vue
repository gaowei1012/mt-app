<template>
  <div></div>
</template>

<script>
export default {
  layout: 'blank',
  // 使用中间件实现退出
  middleware:  async () => {
    let { status, data } = await this.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
