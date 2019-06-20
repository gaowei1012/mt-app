<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item, idx) in menu" :key="idx" @mouseenter="enter">
        <i :class="item.type"/>
        {{ item.name }}
        <span class="arrow"/>
      </dd>
    </dl>
    <div class="detail" v-if="kind" @mouseenter="svoer" @mouseleave="sout">
      <template v-for="(item, idx) in curdetail.child">
        <h4 :key="idx">{{item.title}}</h4>
        <span v-for="v in item.child" :key="v">{{v}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: "",
      menu: [
        {
          type: "food",
          name: "食物",
          child: [
            {
              title: "美食",
              child: ["甜点", "火锅", "咖啡", "自助餐"]
            }
          ]
        },
        {
          type: "takeout",
          name: "外卖",
          child: [
            {
              title: "外卖",
              child: ["美团外卖"]
            }
          ]
        },
        {
          type: "hotel",
          name: "酒店",
          child: [
            {
              title: "酒店",
              child: ["速8快捷酒店", "如家快捷酒店"]
            }
          ]
        }
      ]
    };
  },
  computed: {
    curdetail: function() {
      return this.menu.filter(item => item.type === this.kind)[0]
    }
  },
  methods: {
    mouseleave: function() {
      let self = this
      self._timer = setTimeout(() => {
        self.kind = ''
      }, 150)
    },
    enter: function(e) {
      this.kind = e.target.querySelector('i').className
    },
    svoer: function() {
      clearTimeout(this._timer)
    },
    sout: function() {
      this.kind = ''
    }
  }
};
</script>

<style lang="scss">
</style>
