<template>
  <div class="container">
    <header class="header">
      <div class="user-info">
        <span class="avatar">
          <img :src="userInfo.avatarUrl" alt="">
        </span>
        <span class="name">{{ userInfo.nickName }}</span>
        <span class="generate-code" @click="createCode">生成激活码</span>
      </div>
    </header>
    <div class="bottom">
      <div class="tip">所有题目来自车管所官方最新题库，请放心使用</div>
      <ul class="question-list">
        <li class="list-item" v-for="(item,inx) in classes" :key="item.classId">
          <navigator
            :url="'/pages/question/q' + pageMap[inx]"
            hover-class="none"
          >
            <span class="icon">
              <img :src="item.icon" alt="" />
            </span>
            <span class="title">{{ item.title }}</span>
          </navigator>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const pageMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']
export default {
  data () {
    return {
      pageMap: pageMap,
      userInfo: null,
      classes: [{
        classId: '11',
        icon: require('../../assets/search-text1.svg'),
        title: '题目找字1'
      }, {
        classId: '12',
        icon: require('../../assets/search-text2.svg'),
        title: '题目找字2'
      }, {
        classId: '13',
        icon: require('../../assets/search-text3.svg'),
        title: '题目找字3'
      }, {
        classId: '21',
        icon: require('../../assets/answer-text.svg'),
        title: '答案找字'
      }, {
        classId: '22',
        icon: require('../../assets/light.svg'),
        title: '信号灯'
      }, {
        classId: '23',
        icon: require('../../assets/remember.svg'),
        title: '记忆题'
      }, {
        classId: '31',
        icon: require('../../assets/traffic.svg'),
        title: '交通标志'
      }, {
        classId: '32',
        icon: require('../../assets/indicator.svg'),
        title: '指示仪'
      }, {
        classId: '33',
        icon: require('../../assets/ground.svg'),
        title: '地面标线'
      }, {
        classId: '41',
        icon: require('../../assets/picture.svg'),
        title: '看图讲解'
      }, {
        classId: '42',
        icon: require('../../assets/common-sense.svg'),
        title: '常识题'
      }, {
        classId: '43',
        icon: require('../../assets/other.svg'),
        title: '其他'
      }]
    }
  },

  methods: {
    createCode() {
      wx.cloud.callFunction({
          name: 'createCode',
          data: {}
      })
      .then(res => {
        const code = res.result.code;
        wx.cloud.init({ env: 'test' })
        const db = wx.cloud.database()
        db.collection('codes')
        .add({
            data: {
              code
            }
        })
        .then(res => {
          wx.navigateTo({
            url: '/pages/index/code?code=' + code
          })
        })
      })
    }
  },
  onShow() {
    this.userInfo = wx.getStorageSync('user_info') || null;
  }
}
</script>

<style lang="less" scoped>
.container {
  .header {
    width: 100%;
    height: 186rpx;
    background: #42CD8C;
    padding-top: 10rpx;
    padding-left: 40rpx;

    button {
      width: 160rpx;
      height: 64rpx;
      background: #fff;
      font-size: 30rpx;
      line-height: 64rpx;
    }

    .user-info {
      position: relative;
      .avatar {
        display: inline-block;
        width: 112rpx;
        height: 112rpx;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .name {
        visibility: middle;
        font-size: 40rpx;
        color: #fff;
        margin-left: 24rpx;
      }
      .generate-code {
        position: absolute;
        right: 30rpx;
        top: 20rpx;
        display: inline-block;
        width: 194rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        border: 2rpx solid #fff;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #fff;
      }
    }
  }

  .bottom {
    position: absolute;
    top: 165rpx;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    background: #fff;
  }
  .tip {
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: bold;
  }

  .question-list {
    .list-item {
      display: inline-block;
      text-align: center;
      padding-top: 50rpx;
      width: 250rpx;
      height: 250rpx;
      border: 1rpx solid #eee;

      .icon {
        display: block;
        margin: 0 auto;
        width: 80rpx;
        height: 80rpx;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        font-size: 24rpx;
        color: #000;
      }
    }
  }
}

</style>
