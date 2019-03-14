<template>
    <div class="page-login">
        <h1>登录</h1>
        <input v-model="value" type="text" placeholder="请输入邀请码登录" placeholder-style="color: #aaa;" />
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userInfo: null,
            value: ''
        };
    },
    methods: {
        getUserInfo () {
            if(!this.value) {
                wx.showToast({
                    title: '请填写激活码',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }

            wx.showLoading({
                title: ''
            });
            // 调用登录接口
            wx.login({
                success: () => {
                    wx.getUserInfo({
                        success: (res) => {
                            this.userInfo = res.userInfo
                            this.checkCode();
                        }
                    })
                }
            });
        },
        async checkCode() {
            const res = await wx.cloud.callFunction({
                name: 'checkCode',
                data: {
                    code: this.value
                }
            })

            // 激活码有效
            if(res.result.status === 200) {
                const res3 = await wx.cloud.callFunction({
                    name: 'getDate',
                    data: {}
                });

                const nowTime = res3.result.time;
                let endTime = nowTime + 30 * 24 * 3600;

                if(res.result.code.master) {
                    endTime = nowTime + 10000 * 24 * 3600;
                }

                wx.cloud.init({ env: 'drive' })
                const db = wx.cloud.database()

                // 绑定激活码
                await db.collection('user_code')
                .add({
                    data: {
                        start_time: nowTime,
                        end_time: endTime,
                        code: this.value
                    }
                });

                this.userInfo.master = res.result.code.master || false

                // 绑定用户
                await db.collection('users')
                .add({
                    data: {
                        ...this.userInfo
                    }
                });

                wx.setStorageSync('user_info', this.userInfo);

                wx.hideLoading();

                wx.navigateTo({
                    url: '/pages/index/index'
                })
            }
            else {
                wx.hideLoading();

                wx.showToast({
                    title: res.result.errMsg,
                    icon: 'none'
                });
            }

        }
    },
    onShareAppMessage(res) {
        return {
            title: '苏锦成教练为你特别奉献',
            path: '/pages/pre/index',
            imageUrl: 'https://6472-drive-223675-1258743257.tcb.qcloud.la/poster.png'
        }
    }
}
</script>
<style lang="less" scoped>
.page-login {
    padding: 0 40rpx;
    h1 {
        margin-top: 200rpx;
        font-size: 56rpx;
        font-weight: bold;
    }
    input {
        width: 100%;
        height: 104rpx;
        background: #F9F9F9;
        font-size: 32rpx;
        padding-left: 30rpx;
        margin-top: 56rpx;
    }
    button {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        background: #42CD8C;
        color: #fff;
        font-size: 32rpx;
        margin-top: 144rpx;
    }
}
</style>

