<template>
    <div class="component-question-list-mask" @click="onClose">
        <div class="content-box">
            <header class="question-menu">
                <span class="down-arrow" @click="onClose"></span>
                <div class="right">
                    <span class="total-count">共{{ model.length }}题</span>
                    对：<span class="correct-count">{{ correctCount }}</span>
                    错：<span class="false-count">{{ falseCount }}</span>
                </div>
            </header>
            <ul>
                <li 
                    v-for="(item, index) in model" 
                    :key="index"
                    @click="toggleIndex(index)"
                >
                    <span 
                        :class="{
                            'correct': resultMap[index] && resultMap[index].answer,
                            'false': resultMap[index] && !resultMap[index].answer
                        }">{{ index+1 }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ['model', 'currentIndex', 'resultMap'],
    data() {
        return {
            datas: [],
            correctCount: 0,
            falseCount: 0
        }
    },
    computed: {
        _currentIndex() {
            return this.currentIndex + 1;
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
        toggleIndex(index) {
            this.$emit('update:currentIndex', index);
        }
    },
    created() {
        let correctCount = 0;
        let falseCount = 0;
        Object.values(this.resultMap).forEach(item => {
            if(item.answer) {
                correctCount++;
            }
            else {
                falseCount++;
            }
        });

        this.correctCount = correctCount;
        this.falseCount = falseCount;
    }
}
</script>
<style lang="less">
.component-question-list-mask {
    position:fixed;
    width:100%;
    height:100%;
    left: 0;
    top: 0;
}
.content-box {
    position: absolute;;
    width:100%;
    height:800rpx;
    bottom:0;
    padding-bottom: 23rpx;
    overflow-y:scroll;
    background: #fff;

    .question-menu {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        height: 100rpx;
        background: #fff;
        font-size: 30rpx;
        color: #333;

        .down-arrow {
            display :inline-block;
            position: absolute;
            top: 50%;
            left: 36rpx;
            transform: translateY(-50%);
            width: 35rpx;
            height: 30rpx;
            margin-right: 20rpx;
        }

        .down-arrow::after {
            display: inline-block;
            content: " ";
            height: 20rpx;
            width: 20rpx;
            border-width: 0 4rpx 4rpx 0;
            border-color: #7F8389;
            border-style: solid;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform-origin: center;
            transition: transform .3s;
            position: absolute;
            top: 50%;
            right: 10rpx;
            margin-top: -15rpx;
        }

        .right {
            position: absolute;
            top: 50%;
            right: 34rpx;
            transform: translateY(-50%);
            width: 300rpx;
            text-align: right;
            font-size: 28rpx;
            color: #333;
        }

        .false-count {
            color: #f00;
            margin-left: 8rpx;
        }

        .correct-count {
            color: #09BB07;
            margin-left: 8rpx;
        }
    }

    ul {
        li {
            float: left;
            width: 80rpx;
            height: 80rpx;
            margin-left: 40rpx;
            margin-top: 23rpx;
            
            span {
                direction: inline-block;
                width: 100%;
                height: 100%;
                border: 1px solid #eee;
                border-radius: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28rpx;
                color: #ccc;
            }

            .correct {
                border-color: #23b106;
            }
            .false {
                border-color: #DE0000;
            }
        }

        li:nth-child(7n),
        li:first-child {
            margin-left: 36rpx;
        }
    }
}
</style>


