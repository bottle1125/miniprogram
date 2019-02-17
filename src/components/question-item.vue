<template>
    <div class="component-question-item">
        <div class="question-content">
            <p>{{_index}}.{{ model.content }}</p>
        </div>

        <p>技巧讲解</p>
        <ul class="answer">
            <li 
                v-for="(opt, inx) in options" 
                :key="inx"
                @click="selectAnswer(itemTrue === opt.index)">
                <span class="label">{{ opt.label }}</span>
                <span class="value">{{ opt.value }}</span>
            </li>
        </ul>

        <footer class="fixed-footer">
            <span @click="goToPrevious">上一题</span>
            <span @click="showList">{{_index}} / {{total}}</span>
            <span>技巧讲解</span>
            <span @click="showInstruction">帮助</span>
            <span @click="goToNext">下一题</span>
        </footer>
    </div>
</template>
<script>
const selectionOpt = [{
    index: '1',
    label: 'A',
    value: '正确'
}, {
    index: '2',
    label: 'B',
    value: '错误'
}];
export default {
    props: ['model', 'index', 'total'],
    data() {
        return {
            options: [],
            itemTrue: '0'
        };
    },
    computed: {
        _index() {
            return this.index + 1;
        }
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
            }
            this.$emit('update:index', this._index + 1);
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
            }
            this.$emit('update:index', this._index - 1);
        },
        setOptions() {
            const model = this.model;
            // 选择题
            if(model.type === '1') {
                this.options = selectionOpt;
            }

            if(model.type === '0') {
                this.options = [{
                    index: '1',
                    label: 'A',
                    value: model.item1
                }, {
                    index: '2',
                    label: 'B',
                    value: model.item2
                }, {
                    index: '3',
                    label: 'C',
                    value: model.item3
                }, {
                    index: '4',
                    label: 'D',
                    value: model.item4
                }]
            }

            this.itemTrue = model.item_true;
        },
        selectAnswer(res) {
            if(res) {
                wx.showToast({
                    icon: 'none',
                    title: '正确'
                });
                this.model.answer = true;
                this.goToNext();
            }else {
                wx.showToast({
                    icon: 'none',
                    title: '错误'
                });
                this.model.answer = false;
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
.fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
