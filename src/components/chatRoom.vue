<template>
    <div>
        <p class="room-title"><img :src="user.portrait"><span v-text="user.name"></span>的聊天室</p>
        <div class="chatroom">
            <div class="header">
                <ul class="points">
                    <li></li>
                    <li></li>
                    <li></li>
                    <div v-if="chatNow.id" style="margin: auto">
                        <p v-if="chatNow.id == 'group'" v-text="chatNow.name"></p>
                        <p v-else  v-text="chatNow.name"></p>
                    </div>
                </ul>
            </div>
            <div class="slider">
                <input class="query" placeholder="搜索" v-model="query">
                <ul class="chat-list">
                    <li v-if="chatList" v-for="chat in chatList | filterBy query in 'name'"
                        class="{{ chat.id == chatNow.id ? 'on':'' }}" @click="chatListSelect(chat)">
                        <i class="point" v-if="chat.point"></i>
                        <img :src="chat.portrait" class="portrait">
                        <div class="info">
                            <p class="time" v-text="chat.time | getTime"></p>
                            <p class="name" v-text="chat.name | strLen"></p>
                            <p class="text" v-text="chat.msg | strLen"></p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="main" v-if="chatNow.id">
                <div class="chat-box">
                    <ol v-for="($key,chat) in chatData" v-if="chatNow.id == $key">
                        <li class="{{ data.from.id == user.id ? 'self':'' }}" v-for="data in chat">
                            <img :src="data.from.portrait" class="portrait" @click="toPerson($index)">
                            <div class="text" v-text="data.msg"></div>
                        </li>
                    </ol>
                </div>
                <div class="chat-input">
                    <textarea placeholder="按Enter发送" v-model="msgInput" @keydown.enter.prevent="chat"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                user: {},
                chatList: [],
                chatData: null,
                chatNow: {},
                msgInput: null,
                query: ""
            }
        },
        sockets: {
            newChat(data){
                this.chatList = this.chatList.concat(data)
            },
            user(data){
                this.user = data
            },
            newMsg(msg){
                let id
                if (msg.to.id == 'group') {
                    id = 'group'
                } else {
                    id = msg.from.id
//                    this.chatNow = {
//                        id: msg.from.id,
//                        name: msg.from.name,
//                        portrait: msg.from.portrait
//                    }
                }
                this.insertMsg(id, msg)
            },
            newGroupMsg(msg){
                let id = msg.to.id
                this.insertMsg(id, msg)
                this.chatNow = {
                    id: msg.from.id,
                    name: msg.from.name,
                    portrait: msg.from.portrait
                }
            },
            userLeave(data){

                let id = data['id']
                for (let i = 0; i < this.chatList.length; i++) {
                    if (this.chatList[i]['id'] == id) {
                        this.chatList.splice(i, 1)
                        break
                    }
                }

                if (id == this.chatNow.id) {
                    this.chatNow = {}
                }

                //是否要删除聊天记录?
            }
        },
        methods: {
            addNewMsg(data){

                let msg = JSON.parse(JSON.stringify(data))
                this.insertMsg(msg)

            },
            chat: function () {

                if (!this.chatNow.id || this.msgInput == "") {
                    return false
                }

                let msg = {
                    from: this.user,
                    to: this.chatNow,
                    msg: this.msgInput,
                    time: +new Date()
                }

                if (this.chatNow.id == 'group') {
                    this.$socket.emit('groupMsg', msg);
                } else {
                    this.$socket.emit('privateMsg', msg);
                }

                this.insertMsg(this.chatNow.id, msg)
                this.msgInput = ''
            },
            insertMsg(id, msg){
                let data = {}
                if (this.chatData === null) {
                    data[id] = []
                } else {
                    data = this.chatData
                    if (!data[id]) {
                        data[id] = []
                    }
                }
                data[id].push(msg)
                this.$set('chatData', JSON.parse(JSON.stringify(data)))

                let list = JSON.parse(JSON.stringify(this.chatList))
                for(let i=0;i<list.length;i++){
                    if(list[i].id == id){
                        let newDate = list[i]
                        newDate.time = +new Date()
                        newDate.msg = msg.msg

                        if(this.chatNow.id !== id){
                            newDate.point = 1
                        }
                        this.chatList.$set(i, newDate)
                        break
                    }
                }

                this.scrollDown()
            },
            chatListSelect(chat){

                this.chatNow = chat

                let list = JSON.parse(JSON.stringify(this.chatList))
                for(let i=0;i<list.length;i++){
                    if(list[i].id == this.chatNow.id){
                        let newDate = list[i]
                        newDate.point = 0
                        this.chatList.$set(i, newDate)
                        break
                    }
                }
                this.scrollDown()
            },
            toPerson(i){
                this.chatNow = this.chatData[this.chatNow.id][i].from
            },
            scrollDown(){

                this.$nextTick(function () {
                    let chatBox = document.querySelector('.chat-box')
                    if (chatBox) {
                        chatBox.scrollTop = chatBox.scrollHeight
                    }
                })
            }
        }
    }
</script>
