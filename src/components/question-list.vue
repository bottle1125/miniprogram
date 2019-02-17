<template>
    <div class="component-question-list">
        <header>
            <span>正确数：</span>
            <span>错误数：</span>
            <span>{{ _currentIndex }} / {{ model.length }}</span>
        </header>
        <ul>
            <li v-for="(item, index) in model" :key="index">
                <span :class="{'correct': model.answer}">{{ index+1 }}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['model', 'currentIndex'],
    data() {
        return {
            datas: []
        }
    },
    computed: {
        _currentIndex() {
            return this.currentIndex + 1;
        }
    }
}
</script>
<style lang="less">
.component-question-list {
    position:fixed;
    width:100%;
    height:800rpx;
    bottom:0;
    overflow-y:scroll;
    border-top:1px solid #eee;
    background: #fff;

    ul {
        li {
            float: left;
            width: 80rpx;
            height: 80rpx;
            border: 1px solid #eee;
            border-radius: 100%;
            margin-left: 20rpx;
            margin-top: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>


