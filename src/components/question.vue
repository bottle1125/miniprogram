<template>
    <div style="height: 100%;">
        <QuestionItem
            :model="contents[currentIndex]" 
            :index.sync="currentIndex"
            :total="contents.length"
            :result-map="resultMap"
            @openResultList="openResultList"
        />
        
        <QuestionList 
            v-if="showList"
            :model="contents" 
            :current-index.sync="currentIndex"
            :result-map="resultMap"
            @close="closeResultMap"
        />
    </div>
</template>
<script>
import QuestionItem from '@/components/question-item';
import QuestionList from '@/components/question-list';
export default {
    props: ['id'],
    data() {
        return {
            classId: '',
            contents: [{}],
            currentIndex: 0,
            showList: false,
            resultMap: {}
        };
    },
    components: {
        QuestionItem,
        QuestionList
    },
    methods: {
        closeResultMap() {
            this.showList = false;
        },
        openResultList() {
            this.showList = true;
        },
        loadQuestions() {
            this.show = true;
            wx.showLoading({
                title: '题目准备中'
            });
            wx.cloud.init();
            wx.cloud.callFunction({
                name: 'getCources',
                data: {
                    classId: this.id
                }
            })
            .then(res => {
                this.contents = JSON.parse(res.result[0].data).datas;
                wx.hideLoading();
            })
            .catch(console.error)
        }
    },
    onLoad() {
        this.loadQuestions();
    }
};
</script>
