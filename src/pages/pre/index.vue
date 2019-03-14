<template>
    <div></div>
</template>

<script>
const app = getApp()
export default {
    methods: {
        async checkCode() {
            wx.cloud.callFunction({
                name: 'checkUserCode',
                data: {}
            })
            .then(async res => {
                console.log(res);
                // 已绑定激活码，激活码有效
                if(res.result.status === 200) {
                    // 获取用户信息
                    wx.cloud.init({ env: 'drive' })
                    const db = wx.cloud.database()
                    const res = await db.collection('users')
                    .where({
                        _openid: app.globalData.openid
                    })
                    .get()
                    
                    const userInfo = res.data[0];
                    wx.setStorageSync('user_info', userInfo);
                
                    wx.reLaunch({
                        url: '/pages/index/index'
                    });

                    return;
                }

                wx.showToast({
                    title: res.result.errMsg,
                    icon: 'none'
                });

                setTimeout(() => {
                    wx.reLaunch({
                        url: '/pages/login/index'
                    });
                }, 2000);
            })
        }
    },
    onShow() {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                app.globalData.openid = res.result.openid;

                // 检查是否有权限
                this.checkCode();
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
            }
        })
    }
}
</script>
