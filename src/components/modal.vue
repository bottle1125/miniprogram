<template>
    <div class='mask' v-if="show" @click="clickMask">
        <div 
            class='modal-content' 
        >
            <header class="modal-title">技巧讲解(打开声音)</header>
            <div class='main-content'>
                <div>{{ text }}</div>
            </div>
            <div class='modal-btn-wrapper'>
                <div class='cancel-btn' style='color:rgba(7,17,27,0.6)' @click.stop="cancel">关闭</div>
                <div class='confirm-btn' style='color:#42CD8C' @click.stop="confirm">重播</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['show', 'text'],
    data() {
        return {};
    },
    methods: {
        clickMask() {
            this.$emit('update:show', false);
            this.$emit('cancel');
        },

        cancel() {
            this.$emit('update:show', false);
            this.$emit('cancel');
        },

        confirm() {
            this.$emit('confirm');
        }
    }
}
</script>
<style lang="less">
.mask{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.4);
  z-index: 9999;
}

.modal-content{
  display: flex;
  flex-direction: column;
  width: 90%;
  /* height: 80%; */
  background-color: #fff;
  border-radius: 10rpx;
}

.modal-title {
    text-align: center;
    height:88rpx;
    line-height:88rpx;
    font-size:32rpx;
}
.main-content {
    padding: 0 30rpx 30rpx 30rpx;
    font-size: 32rpx;
}

.modal-btn-wrapper{
  display: flex;
  flex-direction: row;
  height: 100rpx;
  line-height: 100rpx;
  border-top: 2rpx solid rgba(7,17,27,0.1);
}

.cancel-btn, .confirm-btn{
  flex: 1;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 32rpx;
}

.cancel-btn{
  border-right: 2rpx solid rgba(7,17,27,0.1);
}

.main-content{
  flex: 1;
  height: 100%;
  overflow-y: hidden; 
}
</style>
