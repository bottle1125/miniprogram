<script>
wx.cloud.init();
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
/* this rule will be remove */
* {
  padding: 0;
  margin: 0;
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
view,
input,
label {
  box-sizing: border-box;
}
button {
  margin: 0;
  padding: 0;
}

page {
  width: 100%;
  height: 100%;
}
</style>
