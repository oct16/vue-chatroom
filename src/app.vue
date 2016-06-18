<template>
    <div id="app">
        <chat-room></chat-room>
    </div>
</template>

<script>
    export default {
        data(){
            return {}
        },
        components: {
            "chatRoom": require('./components/chatRoom.vue')
        }
    }
</script>
