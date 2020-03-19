<template>
  <div class="baseinfo-item">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "baseInfoItem"
};
</script>

<style scoped lang='scss'>
@import "@/assets/css/public.scss";

.baseinfo-item {
  // width: 100%;

  .header {
    width: 100%;
    text-align: center;
    background-color: #fff;
    // border-bottom: 1px solid #DCDFE6;
    padding:  5px 10px;
    font-size: 14px;
    color: $shallow-font-color;
  }

  .content {
    width: 100%;
    min-height: 100px;
    font-size: 13px;
    color: $shallow-font-color;
    padding: 10px;
    background-color: #fff;
  }

  .footer {
    width: 100%;
    text-align: right;
    font-size: 14px;
    background-color: #fff;
    padding: 10px;
  }
}
</style>