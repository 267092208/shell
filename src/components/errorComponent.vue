<template>
  <div class="error">
    <el-alert title="加载组件超时或失败" type="error" center show-icon></el-alert>
  </div>
</template>

<style lang="scss" scoped>
.error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>