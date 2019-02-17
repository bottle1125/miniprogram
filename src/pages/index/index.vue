<template>
  <div class="container">
    <ul>
      <li v-for="(item,inx) in classes" :key="item.classId">
        <navigator
          :url="'/pages/question/q' + pageMap[inx]"
          hover-class="navigator-hover"
        >
          {{ item.title }}
        </navigator>
      </li>
    </ul>
  </div>
</template>

<script>
const pageMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']
export default {
  data () {
    return {
      pageMap: pageMap,
      classes: [{
        classId: '11',
        title: '题目找字1'
      }, {
        classId: '12',
        title: '题目找字2'
      }, {
        classId: '13',
        title: '题目找字3'
      }, {
        classId: '21',
        title: '答案找字'
      }, {
        classId: '22',
        title: '信号灯'
      }, {
        classId: '23',
        title: '记忆题'
      }, {
        classId: '31',
        title: '交通标志'
      }, {
        classId: '32',
        title: '指示仪表'
      }, {
        classId: '33',
        title: '地面标线'
      }, {
        classId: '41',
        title: '看图讲解'
      }, {
        classId: '42',
        title: '常识题'
      }, {
        classId: '43',
        title: '其他'
      }]
    }
  },

  components: {
    
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      // console.log('clickHandle:', msg, ev)
    },
    onUpdate() {
      this.show = true;
    },
    clickMethod() {
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'getCources',
        data: {
          classId: "41"
        }
      })
      .then(res => {
        console.log(JSON.parse(res.result[0].data));
      })
      .catch(console.error)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
