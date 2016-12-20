var strophe = require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js')
var WebIM = WebIM.default

//app.js   
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("kkkkkkk")
      },
      onPresence: function(message) {
        console.log('onPresence',message)
        var pages = getCurrentPages()
        if(message.type == "unsubscribe") {
            pages[1].moveFriend(message)
        }
        if(message.type === "subscribe") {
            pages[1].handleFriendMsg(message)
        }
      },
      onRoster: function(message) {
			    console.log('onRoster',message) 
          var pages = getCurrentPages()
          if(pages[1]) {
            pages[1].onShow()
          }
			},
      onTextMessage: function (message) {
          console.log('onTextMessage',message)
          var pages = getCurrentPages()
          console.log(pages)
          if(message) {
              if(pages[2]) {
                 pages[2].receiveMsg(message,'txt')
            } else {
                var chatMsg = that.globalData.chatMsg || []
                var date = new Date()
                var Hours = date.getHours(); 
                var Minutes = date.getMinutes(); 
                var Seconds = date.getSeconds(); 
                var time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' 
                + (Hours < 10 ? "0" + Hours : Hours) + ':' + (Minutes < 10 ? "0" + Minutes : Minutes) + ':' + (Seconds < 10 ? "0" + Seconds : Seconds)
                var msgData = {
                  info: {
                    from: message.from,
                    to: message.to
                  },
                  username: '',
                  msg: {
                    type: message.type,
                    data: message.data
                  },
                  style:'',
                  time: time
                }
                msgData.style = ''
                msgData.username = message.from
                chatMsg.push(msgData)
                wx.setStorage({
                  key: msgData.username,
                  data: chatMsg,
                  success: function() {
                    console.log('success')
                  }
                })
              }
          }
        },
        onEmojiMessage: function(message) {
          console.log('onEmojiMessage',message)
        }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    chatMsg: []
  }
})