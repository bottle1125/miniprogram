<template>
    <div>
        <QuestionItem
            :model="contents[currentIndex]" 
            :index.sync="currentIndex"
            :total="contents.length"
            @openResultList="openResultList"
        />
        
        <QuestionList 
            v-if="showList"
            :model="contents" 
            :current-index.sync="currentIndex"
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
            showList: false
        };
    },
    components: {
        QuestionItem,
        QuestionList
    },
    methods: {
        openResultList() {
            this.showList = true;
        },
        loadQuestions() {
            this.show = true;
            wx.cloud.init();
            wx.cloud.callFunction({
                name: 'getCources',
                data: {
                    classId: this.id
                }
            })
            .then(res => {
                this.contents = JSON.parse(res.result[0].data).datas;
            })
            .catch(console.error)
        }
    },
    onLoad() {
        this.loadQuestions();
    }
};
</script>
