<template>
    <Question :id="classId" />
</template>
<script>
import Question from '@/components/Question';
export default {
    data() {
        return {
            classId: '11'
        }
    },
    components: {
        Question
    }
}
</script>

