//index.js
//获取应用实例
const app = getApp()
const ctx = wx.createCanvasContext('firstCanvas', this);
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imageUrl:'',
    imgW:'',
    imgH:'',
    cW:'',
    cH:'',
    newW:'',
    newH:'',
    imgT:'',
    boxW:50,
    boxH:50,
    targetX:'',
    targetY:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  imgLoad(e){
    console.log(e)
  },
  selectImg:function(){
    // var query=wx.createSelectorQuery();
    // wx.chooseImage({
    //   count:1,
    //   sourceType:['album','cameta'],
    //   success:(res)=>{
    //     this.setData({
    //       imageUrl:res.tempFilePaths[0]
    //     })
    //     var _this=this;
    //     setTimeout(()=>{
    //       query.select('.picture').boundingClientRect((e)=>{
    //         console.log(e.width,e.height,e)
    //         _this.setData({
    //           imgH:e.height,
    //           imgW:e.width
    //         })
    //       }).exec();

    //       query.select('.canvas').boundingClientRect((e) => {
    //         console.log(e.width, e.height, e)
    //         _this.setData({
    //           cH: e.height,
    //           cW: e.width
    //         })
    //       }).exec();

    //     },100)
    //     console.log(res)
    //     setTimeout(()=>{
    //       var canvasY=(this.data.cH-this.data.imgH*this.data.cW/this.data.imgW)/2;
    //       this.setData({
    //         newW:this.data.cW,
    //         newH: this.data.imgH * this.data.cW / this.data.imgW,
    //         imgT:canvasY
    //       })
    //       ctx.drawImage(res.tempFilePaths[0], 0, canvasY, this.data.cW,this.data.imgH*this.data.cW/this.data.imgW);
    //       ctx.draw();
          
    //       // })
    //     },200)
    //   }
    // })
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res.tempFilePaths[0])
        wx.navigateTo({
          url: '../main/main?img='+res.tempFilePaths[0],
        })
      },
    })
  },
  boxStart(e){
    // console.log(e)
    this.setData({
      targetX:e.touches[0].clientX,
      targetY: e.touches[0].clientY
    })
    // targetX: '',
    // targetY: ''
  },
  saveImg(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 667,
      destWidth: 375 * 2,
      destHeight: 667 * 2,
      canvasId: 'firstCanvas',
      success: res => {
        console.log('data:');
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
      }
    })
  },
  boxChange(e){
    var parseTop='';
    var parseLeft='';
    var parseW='';
    var parseH='';
    wx.createSelectorQuery().select('.box').boundingClientRect().exec(function(ev){
      parseLeft=ev[0].left;
      parseTop = ev[0].top;
      parseW = ev[0].width;
      parseH = ev[0].height;
      // console.log(ev)
    })
    
    // setTimeout(()=>{
      this.setData({
        boxW: e.touches[0].clientX - this.data.targetX + parseW,
        boxH: e.touches[0].clientY - this.data.targetY + parseH,
      })
  }
})
