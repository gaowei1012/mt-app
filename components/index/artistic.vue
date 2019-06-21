<template>
  <section class="m-istyle">
    <dl>
      <dt>有格调</dt>
      <dd :class="{active:kind==='all'}">全部</dd>
      <dd :class="{active:kind==='part'}">丽人SPA</dd>
      <dd :class="{active:kind==='spa'}" >丽人SPA</dd>
      <dd :class="{active:kind==='movie'}">电影演出</dd>
      <dd :class="{active:kind==='travel'}" >品质出游</dd>
    </dl>
    <ul class="ibody">
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
      <li>我是内容站位区域</li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      kind: "fall"
    };
  },
  computed: {}
};
</script>

<style lang="scss">
@import "@/assets/css/index/artistic.scss";
</style>
