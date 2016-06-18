# vue-chatroom

![preview](https://github.com/oct16/vue-chatroom/blob/master/preview.jpg)

公司最近计划接入云信开发Web版聊天和app打通，因为云信也是基于socket的，所以在此之前先研究一下webSocket的特性。


嗯，然后就做了一个demo，实现了单聊和群聊的功能

  [github: vue-chatroom](https://github.com/oct16/vue-chatroom)


  [demo: vue-chatroom](https://oct16im.duapp.com)

 额，代码是work的，但由于是部署在BAE并上不支持直接走ws导致握手失败了，不过好在socket.io会在失败后自动降级为http请求，有钱还是换成阿里云，百度这种真是便宜没好货。
 
# Usage

```
cd vue-chatroom
npm install 
npm run start
open http://localhost:3003

````
