<template>
    <div class="page-code">
        <div class="code-area">
            {{ code }}
        </div>

        <div class="copy" @click="copyCode">
            <button>复制激活码</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            code: ''
        };
    },
    methods: {
        copyCode() {
            wx.setClipboardData({
                data: this.code,
                success(res) {
                    console.log(res);
                }
            })
        }
    },
    onLoad(options) {
        this.code = options.code;
    }
}
</script>
<style lang="less">
.page-code {
    .code-area {
        height: 584rpx;
        line-height: 584rpx;
        font-size: 56rpx;
        font-weight: bold;
        text-align: center;
    }

    .copy button {
        width: 670rpx;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 32rpx;
        margin: 0 auto;
        color: #fff;
        background: #42CD8C;
    }
}
</style>


