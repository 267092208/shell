import LoadingComponent from '@/components/LoadingComponent.vue';
import errorComponent from '@/components/errorComponent.vue';
const asyncComponent  = {
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: null,
  loading: LoadingComponent,
  error: errorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 400,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  // timeout: 7000
}

export default asyncComponent;