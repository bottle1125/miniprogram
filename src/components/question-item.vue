<template>
    <div class="component-question-item">
        <div class="question-content">
            <p>{{_index}}.{{ model.content }}</p>
        </div>

        <p class="skill" @click="modalShow">
            <img src="../assets/audio.svg" alt="">
            技巧讲解
        </p>
        <ul class="checkbox-container">
            <li 
                class="checkbox"
                v-for="(opt, inx) in options" 
                :key="inx"
                @click="selectAnswer(opt.index)">
                <span class="label">{{ opt.label }}</span>
                <span class="value">{{ opt.value }}</span>
            </li>
        </ul>

        <footer class="fixed-footer" :class="{'is-iphone-x': isIPX}">
            <div @click="goToPrevious" class="menu-item">
                <span class="menu-icon">
                    <img src="../assets/last.svg" alt="">
                </span>
                <span class="menu-key last-one">上一题</span>
            </div>
            <div @click="showList" class="menu-item">
                <span class="menu-icon">
                    <img src="../assets/category.svg" alt="">
                </span>
                <span class="menu-key">{{_index}} / {{total}}</span>
            </div>
            <div @click="showInstruction" class="menu-item">
                <span class="menu-icon">
                    <img src="../assets/notice.svg" alt="">
                </span>
                <span class="menu-key">官方讲解</span>
            </div>
            <div @click="goToNext" class="menu-item">
                <span class="menu-icon">
                    <img src="../assets/next.svg" alt="">
                </span>
                <span class="menu-key">下一题</span>
            </div>
        </footer>

        <ModalComponent 
            :show.sync="modalVisible" 
            :text="model.explanation" 
            :key="model.key_topic"
            @confirm="rePlayVoice"
            @cancel="stopPlayVoice"
        />
    </div>
</template>
<script>
import ModalComponent from '@/components/modal';
const model = wx.getSystemInfoSync().model;
const isIPX = model.search('iPhone X') !== -1;
export default {
    props: ['model', 'index', 'total', 'resultMap'],
    data() {
        return {
            options: [],
            itemTrue: '0',
            isIPX: isIPX,
            modalVisible: false,
            innerAudioContext: wx.createInnerAudioContext()
        };
    },
    computed: {
        _index() {
            return this.index + 1;
        }
    },
    components: {
        ModalComponent
    },
    watch: {
        model: {
            handler(value) {
                console.log(value);
                this.setOptions();
            },
            deep: true
        }
    },
    methods: {
        modalShow() {
            this.modalVisible = true;
            this.showVoice();
        },
        modalCancel() {
            this.modalVisible = false;
        },
        modalConfirm() {
            this.showVoice();
        },
        showVoice() {
            this.innerAudioContext.src = 'cloud://te-3db4f8.7465-te-3db4f8/audios/' + this.model.audio;
            this.innerAudioContext.play();
        },
        rePlayVoice() {
            this.innerAudioContext.stop();
            this.showVoice();
        },
        stopPlayVoice() {
            this.innerAudioContext.stop();
        },
        showList() {
            this.$emit('openResultList');
        },
        goToNext() {
            if(this._index === this.total) {
                wx.showModal({
                    title: '提示',
                    content: '这是最后一题',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                        console.log('用户点击确定')
                        } else if (res.cancel) {
                        console.log('用户点击取消')
                        }
                    }
                })
                return;
            }
            this.$emit('update:index', this.index + 1);
        },
        goToPrevious() {
            if(this._index === 1) {
                wx.showModal({
                    title: '提示',
                    content: '这是第一题',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                        console.log('用户点击确定')
                        } else if (res.cancel) {
                        console.log('用户点击取消')
                        }
                    }
                })
                return;
            }
            this.$emit('update:index', this.index - 1);
        },
        setOptions() {
            const model = this.model;
            if(this.resultMap[this.index] !== undefined) {
                const res = this.resultMap[this.index];

                this.options[+res.selected - 1].checked = true;
                return;
            }
            // 选择题
            if(model.type === '1') {
                this.options = [{
                    index: '1',
                    label: 'A',
                    value: '正确',
                    checked: false
                }, {
                    index: '2',
                    label: 'B',
                    value: '错误',
                    checked: false
                }];
            }

            if(model.type === '0') {
                this.options = [{
                    index: '1',
                    label: 'A',
                    value: model.item1,
                    checked: false
                }, {
                    index: '2',
                    label: 'B',
                    value: model.item2,
                    checked: false
                }, {
                    index: '3',
                    label: 'C',
                    value: model.item3,
                    checked: false
                }, {
                    index: '4',
                    label: 'D',
                    value: model.item4,
                    checked: false
                }]
            }

            this.itemTrue = model.item_true;
        },
        selectAnswer(target) {
            this.options[+target - 1].checked = true;

            if(target === this.model.item_true) {
                wx.showToast({
                    icon: 'none',
                    title: '正确'
                });
                this.resultMap[this.index] = {
                    selected: target,
                    answer: true
                };
                this.goToNext();
            }else {
                wx.showToast({
                    icon: 'none',
                    title: '错误'
                });

                this.modalShow();
                this.resultMap[this.index] = {
                    selected: target,
                    answer: false
                };
            }
        },
        showInstruction() {
            const reg = /<\/?\w+\/?>/g;
            wx.showModal({
                title: '答案说明',
                content: this.model.explain.replace(reg, ''),
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    onLoad() {
        // this.setOptions();
    }
};
</script>
<style lang="less">
.component-question-item {
    .question-content {
        padding: 36rpx 40rpx;
        font-size: 32rpx;
    }
    .skill {
        padding-left: 40rpx;
        font-size: 32rpx;
        color: #E60000;
        margin-top: 42rpx;

        img {
            width: 30rpx;
            height: 42rpx;
            vertical-align: top;
            margin-right: 32rpx;
        }
    }
    .checkbox-container {
        padding-left: 40rpx;
        margin-top: 64rpx;
        .checkbox {
            margin-top: 52rpx;

            .label {
                display: inline-block;
                vertical-align: middle;
                margin-right: 24rpx;
                width: 48rpx;
                height: 48rpx;
                line-height: 48rpx;
                text-align: center;
                border: 1rpx solid #979797;
                border-radius: 50%;
                font-size: 28rpx;
            }

            .value {
                vertical-align: middle;
                font-size: 32rpx;
            }
        }
    }
    .fixed-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 98rpx;
        font-size: 20rpx;
        color: #7F8389;
        background: #F7F7FA;
        padding-top: 12rpx;

        .menu-item {
            display: inline-block;
            width: 25%;
            text-align: center;

            span, img {
                display: block;

            }

            .last-one {
                color: #09BB07;
            }
        }

        img {
            margin: 0 auto 4rpx;
            width: 48rpx;
            height: 48rpx;
        }
    }
    .is-iphone-x {
        bottom: 68rpx;
    }

    // // 隐藏样式
    // radio .wx-radio-input {
    //     display: none;
    // }
}
</style>
