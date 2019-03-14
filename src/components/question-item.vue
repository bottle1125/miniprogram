<template>
    <div class="component-question-item">
        <div class="question-content">
            <p>{{_index}}.{{ model.content }}</p>
        </div>

        <p class="skill" @click="modalShow">
            <img src="../assets/audio.svg" alt="">
            技巧讲解
        </p>
        <div class="image-box" v-if="model.content_img">
            <img mode="aspectFit" :src="contentImage" alt="">
        </div>

        <ul class="checkbox-container">
            <li 
                class="checkbox"
                v-for="(opt, inx) in options" 
                :key="inx"
                @click="selectAnswer(inx)">
                <span class="label" v-if="!opt.checked">{{ opt.label }}</span>
                <img v-else-if="inx === rightInx" class="right-answer" src="../assets/right.svg"/>
                <img v-else class="false-answer" src="../assets/false.svg" />
                <span class="value">{{ opt.value }}</span>
            </li>
        </ul>

        <footer class="fixed-footer" :class="{'is-iphone-x': isIPX}">
            <div @click="goToPrevious" class="menu-item">
                <span class="menu-icon">
                    <img v-if="_index > 1" src="../assets/last.svg" alt="">
                    <img v-else src="../assets/previous-invalid.png" alt="">
                </span>
                <span class="menu-key" :class="{'valid-one': _index > 1}">上一题</span>
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
                    <img v-if="_index < total" src="../assets/next.png" alt="">
                    <img v-else src="../assets/next.svg" alt="">
                </span>
                <span class="menu-key" :class="{'valid-one': _index < total}">下一题</span>
            </div>
        </footer>

        <ModalComponent 
            v-if="modalVisible" 
            :text="model.explanation" 
            :keyword="model.key_topic"
            :key-answer="model.key_answer"
            @confirm="rePlayVoice"
            @cancel="stopPlayVoice"
            @close="closeModal"
        />
    </div>
</template>
<script>
import ModalComponent from '@/components/modal';
import { setTimeout } from 'timers';
const model = wx.getSystemInfoSync().model;
const isIPX = model.search('iPhone X') !== -1;
export default {
    props: ['model', 'index', 'total', 'resultMap'],
    data() {
        return {
            options: [],
            isIPX: isIPX,
            modalVisible: false,
            innerAudioContext: null
        };
    },
    computed: {
        _index() {
            return this.index + 1;
        },
        contentImage() {
            // return 'cloud://drive-223675.6472-drive-223675' + this.model.content_img;
            // return 'http://img.jx885.com/lrjk' + this.model.content_img;
            return 'https://6472-drive-223675-1258743257.tcb.qcloud.la' + this.model.content_img;
        },
        rightInx() {
            if(+this.model.type === 1) {
                console.log(Number(this.model.item_true) - 1);
                return Number(this.model.item_true) - 1;
            } else {
                let rInx = 0; 
                this.options.some((item, inx) => {
                    if(item.value === this.model.key_words) {
                        rInx = inx;
                        return true;
                    }
                });

                return rInx;
            }
        }
    },
    components: {
        ModalComponent
    },
    watch: {
        model: {
            handler(value) {
                console.log(value);
                this.initAudioContext();
                this.setOptions();

                // this.setContentImage();
                // this.modalShow();
            },
            deep: true
        }
    },
    methods: {
        closeModal() {
            this.stopPlayVoice();
            this.modalVisible = false;
        },
        setContentImage() {
            const vm = this;
            if(this.model.content_img) {
                const model = this.model;
                // let basePath = 'cloud://drive-223675.6472-drive-223675';
                // const image = basePath + this.model.content_img;
                // this.contentImage = basePath + this.model.content_img;
                let basePath = 'http://img.jx885.com/lrjk';
                // 下载图片
                wx.downloadFile({
                    url: basePath + model.content_img,
                    success(res) {
                        if(res.statusCode === 200) {
                            let tempFilePath = res.tempFilePath;

                            wx.compressImage({
                                src: tempFilePath,
                                quality: 45,
                                success(res) {
                                    let image = res.tempFilePath;
                                    wx.cloud.uploadFile({
                                        cloudPath: model.content_img.replace('/', ''),
                                        filePath: image,
                                        success(res) {
                                            console.log('上传成功', res);
                                            vm.goToNext();
                                        },
                                        fail(res) {
                                            console.log(res);
                                        }
                                    });
                                }
                            })
                        }
                    }
                });
            } else {
                this.goToNext();
            }
        },
        initAudioContext() {
            this.innerAudioContext = wx.createInnerAudioContext();
            this.innerAudioContext.autoplay = true;
        },
        async modalShow() {
            this.modalVisible = true;
            // let path = this.model.audio;
            // if(this.model.audio.indexOf('/') === -1) {
            //     path = 'content/audio/vixf/km1/' + this.model.audio
            // } else {
            //     path = path.replace('/', '');
            // }
            
            // wx.cloud.callFunction({
            //     name: 'getAudio',
            //     data: {
            //         text: this.model.explanation,
            //         path: path
            //     },
            //     success: res => {
            //         this.goToNext();
            //     },
            //     fail: err => {
            //         console.error('[云函数] [login] 调用失败', err)
            //     }
            // })
            this.showVoice();
        },
        modalCancel() {
            this.modalVisible = false;
        },
        modalConfirm() {
            this.showVoice();
        },
        showVoice() {
            let classify = this.model.classify;
            let basePath = 'cloud://drive-223675.6472-drive-223675';
            let src = (classify === '11' || classify === '12')
                ? basePath + '/content/audio/vixf/km1/' + this.model.audio
                : basePath + this.model.audio;

            this.innerAudioContext.src = src;
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
            // this.contentImage = '';
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
            // this.contentImage = '';
            this.$emit('update:index', this.index - 1);
        },
        setOptions() {
            const model = this.model;
            // 正确错误题
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

            if(this.resultMap[this.index] !== undefined) {
                const res = this.resultMap[this.index];

                this.options[+res.selected].checked = true;

                if(parseInt(res.selected) !== this.rightInx) {
                    this.options[this.rightInx].checked = true;
                }
            }
        },
        selectAnswer(target) {
            this.options[+target].checked = true;

            // 选正确错误的题看item_true,其他的看key_words
            if(target === this.rightInx) {
                this.resultMap[this.index] = {
                    selected: target,
                    answer: true
                };
                setTimeout(() => {
                    this.goToNext();
                }, 500);
            }else {
                this.resultMap[this.index] = {
                    selected: target,
                    answer: false
                };
                this.modalShow();
                this.options[this.rightInx].checked = true;
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
    }
};
</script>
<style lang="less">
.component-question-item {
    height: 100%;
    background: #ebeff2;
    .question-content {
        padding: 36rpx 40rpx;
        font-size: 32rpx;
    }
    .skill {
        padding-left: 40rpx;
        font-size: 32rpx;
        color: #E60000;
        // margin-top: 42rpx;

        img {
            width: 30rpx;
            height: 42rpx;
            vertical-align: top;
            margin-right: 32rpx;
        }
    }
    .image-box {
        padding-top: 36rpx;
        width: 100%;
        height: 444rpx;
        img {
            width: 100%;
            height: 100%;
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

            .right-answer,
            .false-answer {
                width: 48rpx;
                height: 48rpx;
                display: inline-block;
                vertical-align: middle;
                margin-right: 24rpx;
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

            .valid-one {
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
        height: 166rpx;
    }

    // // 隐藏样式
    // radio .wx-radio-input {
    //     display: none;
    // }
}
</style>
