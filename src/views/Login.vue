<template>
  <div class="login">
    <el-carousel
      indicator-position="none"
      height="100%"
      arrow="never"
      ref="carousel"
      :interval="3000"
      :initial-index="iniIndex"
      :autoplay="isAutoPlay"
    >
      <el-carousel-item v-for="(item,index) in bgImgList" :key="index">
        <!-- <img :src="item" class="bg-image"  /> -->
        <el-image style="width:100%;height:100%" @load="imgLoad()" :src="item" fit="cover" v-if="index==iniIndex||index==(item.length-1)"></el-image>
        <el-image style="width:100%;height:100%"  :src="item" fit="cover" v-if="isLoad"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div class="form-container">
      <div class="form-header">
        <img src="~@/assets/images/login-logo.png" alt class="login-logo" />
      </div>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="form-content"
      >
        <div class="content-header">欢迎使用电子地图系统</div>

        <el-form-item prop="username" class="form-item">
          <el-input
            type="text"
            placeholder="请输入账号"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
            auto-complete="off"
            clearable
            class="form-input"
            autofocus="autofocus"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-s-goods"
            v-model="loginForm.password"
            auto-complete="off"
            show-password
            class="form-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            ref="loginBtn"
            @click="submitForm('ruleForm')"
            class="login-btn"
            @keyup.enter.native="loginEnter"
            v-loading="loading"
            element-loading-text="正在登录中"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="icongroup">
      <div class="icon arrow" @click="prevClick" @mouseover="btnOver" @mouseout="btnOut">
        <span class="el-icon-arrow-left"></span>
      </div>
      <div class="icon arrow" @click="nextClick" @mouseover="btnOver" @mouseout="btnOut">
        <span class="el-icon-arrow-right"></span>
      </div>
      <div class="icon">
        <span class="iconfont icon-ico"></span>
        <div class="code-info">
          <!-- <div class="line"></div> -->
          <h4>扫码安装APP</h4>
          <img src="~@/assets/images/install.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatepassword, trigger: "blur" }]
      },
      loading: false,
      bgImgList: [1, 2, 3, 4, 5, 6].map(t =>
        "./images/login/login-bg{index}.png".replace("{index}", t)
      ),
      //  [
      
      // require("../assets/images/login-bg1.jpg"),
      // require("../assets/images/login-bg2.jpg"),
      // require("../assets/images/login-bg3.jpg"),
      // require("../assets/images/login-bg4.jpg"),
      // require("../assets/images/login-bg5.jpg"),
      // require("../assets/images/login-bg6.jpg")
      // require("../assets/images/login-bg1.png"),
      // require("../assets/images/login-bg2.png"),
      // require("../assets/images/login-bg3.png"),
      // require("../assets/images/login-bg4.png"),
      // require("../assets/images/login-bg5.png"),
      // require("../assets/images/login-bg6.png")
      // ],
      isAutoPlay: true,
      isLoad:false
    };
  },
  computed: {
    iniIndex() {
      return Math.floor(Math.random() * this.bgImgList.length);
    }


  },
  
  created() {
    document.onkeydown = e => {
      if (window.event === undefined) {
        var key = e.keyCode;
      } else {
        var key = window.event.keyCode;
      }

      if (key === 13) {
        this.loginEnter();
      }
    };
  },
  destroyed() {
    document.onkeydown = undefined;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login", {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            .then(res => {
              this.$router.push("/");
              this.loading = false;
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err
              });
              this.loading = false;
            });
        } else {
          this.$message({
            type: "error",
            message: "请输入正确的用户名密码"
          });
          return false;
        }
      });
    },

    loginEnter() {
      this.submitForm("ruleForm");
    },

    prevClick() {
      this.$refs.carousel.prev();
     
    },
    nextClick() {
      this.$refs.carousel.next();
    
    },

    btnOver() {
      this.isAutoPlay = false;
    },

    btnOut() {
      this.isAutoPlay = true;
    },


    imgLoad(index){
     this.isLoad = true
    }
  }
};
</script>
<style lang="scss" >
@import "element-ui/lib/theme-chalk/display";
@import "@/assets/css/public.scss";

.login {
  width: 100%;
  height: 100%;

  .bg-image {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .el-carousel {
    height: 100%;
    width: 100%;

    .el-carousel__arrow--left {
      left: 93%;
    }
  }

  .form-container {
    width: 30rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: all 0.5s ease 0s;

    @media (min-width: 1920px) {
      transform: translate(-50%, -50%) scale(1.1);
    }
    @media (min-width: 1366px) {
      transform: translate(-50%, -50%) scale(1);
    }
    @media (max-width: 1366px) {
      transform: translate(-50%, -50%) scale(0.9);
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .form-content {
      background-color: #fff;
      padding: 35px 50px;

      .content-header {
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;
        letter-spacing: 0.1em;
        color: #242424;
      }

      .form-item {
        .form-input {
          font-size: 16px;
        }
        input {
          border-color: #909399;

          &:focus {
            border-color: #409eff;
          }
        }

        input::placeholder {
          color: #606266;
        }
        span {
          font-size: 22px;
          color: #606266;

          i {
            font-size: 20px;
            color: #606266;
          }
        }
      }

      .login-btn {
        width: 100%;
      }
    }
  }

  .icongroup {
    width: 300px;
    position: fixed;
    bottom: 5%;
    right: 7%;
    z-index: 9999;
    display: flex;
    justify-content: space-around;

    .icon {
      position: relative;
      width: 45px;
      height: 45px;
      border: 1px solid #fff;
      border-radius: 50%;
      text-align: center;

      span {
        font-size: 26px;
        color: #fff;
        line-height: 45px;
      }

      .code-info {
        position: absolute;
        top: -215px;
        left: -70px;
        width: 160px;
        height: 185px;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid #fff;
        display: none;

        // .line {
        //   position: absolute;
        //   top: 140px;
        //   left: 50%;
        //   width: 1px;
        //   height: 50px;
        //   background-color: #fff;
        // }

        h4 {
          font-weight: normal;
          font-size: 14px;
          color: #fff;
          margin: 0 0 10px;
        }

        img {
          width: 150px;
        }
      }

      &:hover {
        background-color: #fff;
        cursor: pointer;

        span {
          color: #606266;
        }

        .code-info {
          display: block;
        }
      }
    }
  }
}
</style>
