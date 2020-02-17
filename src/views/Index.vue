<template>
  <div class="container">
    <!-- 导航 -->
    <Header />
    <!-- <div class="header">
     
    </div>-->
    <div class="main">
      <div class="box">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
// import Header from "@/components/Header.vue"
import Header from "@/components/Header2.vue"

export default {
  name: "index",
  components: {
    Header,
  },
  mounted() {
    // this.$store.dispatch("replace", { path: 'layerlist' });
    // setTimeout(() => this.$store.dispatch("clear", { position: 'right' }), 5000)
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/public.scss";

.container {
  width: 100%;
  height: 100%;
  .header {
    background-color: $theme-header;
    width: 100%;
    overflow: hidden;
    min-width: 1000px;
    height: $header-height;
  }
  .main {
    background: $theme-bg-color;
    position: absolute;
    bottom: 0;
    width: 100%;
    top: $header-height;
    overflow: hidden;
    .box {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
