<template>
  <div class="detail-info" ref="detailInfo">
    <ul class="detail-nav">
      <li
        v-for="(value,key,index) in infoDetail"
        :key="index"
        @click="scrollTo(index)"
        :class="{active:index==current}"
      >{{key}}</li>
    </ul>
    <div class="detail-content" ref="detailContent">
      <base-info-item v-for="(value,key,index) in infoDetail" :key="index" class="detail-item">
        <div slot="header" class="header-content">{{key}}</div>
        <div slot="content">
          <div v-for="(item,index) in value" :key="index" class="item-content">
            <div
              v-if="(item?item.length:0 + info[item]?info[item].length:0) >= 18 "
              class="item-more"
            >
              <div class="top">{{item}}</div>
              <div class="bottom">{{info[item]}}</div>
            </div>
            <div v-else class="item-little">
              <div class="left">{{item}}</div>
              <div class="right">{{info[item]}}</div>
            </div>
          </div>
        </div>
      </base-info-item>
      <!-- <div class="detail-blank" :style="{height:blankHeight+'px'}"></div> -->
    </div>
  </div>
</template>

<script>
import baseInfoItem from "@/components/infoPanel/baseInfoItem";

export default {
  name: "detailInfo",
  props: {
    infoDetail: {
      type: Object,
      default() {
        return {};
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    current: Number
  },
  data() {
    return {
      // current: 0
    };
  },
  components: {
    baseInfoItem
  },
  computed: {},
  activated() {
    // window.scrollTo(0, window.sessionStorage.getItem("detailScrollTop"));
    window.addEventListener("scroll", this.onScroll, true);
    // console.log( "激活详细属性"+window.sessionStorage.getItem("detailScrollTop"));
  },
  deactivated() {
    // let detailScroll = document.querySelector(".info-panel").scrollTop;
    // window.sessionStorage.setItem("detailScrollTop",detailScroll)

    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      const navContents = document.querySelectorAll(
        ".detail-content .detail-item"
      );
      const content = this.$refs.detailInfo;

      const offsetTopArr = [];
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop);
      });
      if (content) {
        const scrollTop = content.scrollTop;
        let navIndex = 0;
        for (let n = 0; n < offsetTopArr.length; n++) {
          if (scrollTop >= offsetTopArr[n]) {
            navIndex = n;
          }
        }

        this.$emit("setCurrent", navIndex);
      }

      // window.sessionStorage.setItem("detailScrollTop", content.scrollTop);
    },
    //点击标签跳转到对应的内容
    scrollTo(index) {
      this.$emit("setCurrent", index);
      const targetOffsetTop = document.querySelector(
        `.detail-item:nth-child(${index + 1})`
      ).offsetTop;
      let scrollTop = this.$refs.detailInfo.scrollTop;

      let dtop = Math.abs(targetOffsetTop - scrollTop);

      const STEP = dtop / 6 / 3;

      if (scrollTop > targetOffsetTop) {
        smoothUp();
      } else {
        smoothDown();
      }
      const _this = this;
      // 定义往下滑函数
      function smoothDown() {
        if (scrollTop < targetOffsetTop) {
          if (targetOffsetTop - scrollTop >= STEP) {
            scrollTop += STEP;
          } else {
            scrollTop = targetOffsetTop;
            _this.$emit("setCurrent", index);
          }
          document.querySelector(".detail-info").scrollTop = scrollTop;
          requestAnimationFrame(smoothDown);
        }
      }
      // 定义往上滑函数
      function smoothUp() {
        if (scrollTop > targetOffsetTop) {
          if (scrollTop - targetOffsetTop >= STEP) {
            scrollTop -= STEP;
          } else {
            scrollTop = targetOffsetTop;
            _this.$emit("setCurrent", index);
          }
          document.querySelector(".detail-info").scrollTop = scrollTop;
          requestAnimationFrame(smoothUp);
        }
      }
    }
  },
  watch: {
    current: function() {}
  }
};
</script>

<style lang="scss">
@import "@/assets/css/public.scss";

.detail-info {
  height: 100%;
  overflow:auto;
  background-color: $rightpanel-bgcolor;

  .detail-nav {
    position: absolute;
    top: 0;
    right: 0;
    // bottom: 39px;
    border-left: 1px solid $rightpanel-nav-bdcolor;
    background-color: $rightpanel-nav-bgcolor;
    font-size: 13px;
    height: calc(100% - 39px);
    overflow: auto;

    li {
      padding: 5px;
      border-bottom: 1px solid $theme-bg-color;
      background: $rightpanel-nav-unactive-bgcolor;
      border-color: $rightpanel-nav-unactive-bdcolor;
      font-size: 14px;
      color: $shallow-font-color;

      &:first-child {
        border-top: 1px solid $rightpanel-nav-active-bdcolor;
      }

      &:hover {
        color: $shallow-font-color;
        // border-bottom: 3px solid $theme-color;
        background-color: $rightpanel-nav-hover-bgcolor;
        cursor: pointer;
      }
    }

    .active {
      border-bottom: 1px solid $rightpanel-nav-active-bdcolor;
      background-color: $rightpanel-nav-active-bgcolor;
      color: $deep-font-color;

      &:hover {
        border-bottom: 1px solid $rightpanel-nav-active-bdcolor;
        background-color: $rightpanel-nav-active-bgcolor;
        color: $deep-font-color;
      }
    }
  }

  .detail-content {
    margin-right: 95px;
    background-color: $rightpanel-bgcolor;

    .detail-blank1 {
      width: 100%;
      // height: calc(100vh - 235px - 39px - 41px - 50px);
    }
    .baseinfo-item {
      width: calc(100% - 20px);
      margin-bottom: 10px;

      .header-content {
        border-bottom: 1px solid $infopanel-detail-bdcolor;
        padding: 10px 10px;
      }

      .item-content {
        margin: 10px;
        padding: 0 10px;

        .item-more {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .bottom {
            padding-left: 10px;
          }
        }

        .item-little {
          display: flex;
          justify-content: space-between;
        }
        .right,
        .bottom {
          font-weight: 600;
        }
      }
    }
  }
}
</style>