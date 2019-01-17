// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath:'',
    imgInfo:{
      imgPath: '',
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      originWidth: 0,
      originHeight: 0
    },
    windowH:0,
    windowW:0,
    pageType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let tmpImgObj = this.data.imgInfo;
    tmpImgObj.imgPath = options.imgPath;
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowH: res.windowHeight,
          windowW: res.windowWidth,
          imgInfo: tmpImgObj,
          imgPath: options.imgPath,
          pageType: options.type
        })
        this.setMainImg()
      },
    })
    
  },
  setMainImg() {
    let tmpImgObj = this.data.imgInfo;
    wx.getImageInfo({
      src: tmpImgObj.imgPath,
      success: res => {
        console.log(res)
        tmpImgObj.originWidth = res.width;
        tmpImgObj.originHeight = res.height;

        tmpImgObj.width = this.data.windowW;   //自适应宽
        //自适应高
        tmpImgObj.height = tmpImgObj.originHeight * this.data.windowW / tmpImgObj.originWidth;
        //自适应top值
        tmpImgObj.top = (this.data.windowH - tmpImgObj.originHeight * this.data.windowW / tmpImgObj.originWidth) / 2;
        this.setData({
          imgInfo: tmpImgObj
        })
      }
    })
  },
  save(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imgPath,
      success: res => {
        // console.log(res)
        wx.showToast({
          title:'保存成功',
          icon:'none'
        })
      },
      fail:err=>{
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
    
  },
  toIndex(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // let users = wx.getStorageSync('user');
    if (res.from === 'button') { }
    return {
      title: '创作炫酷无比的动漫照片',
      path: '/pages/success/success?imgPath='+this.data.imgPath+'&type=share',
      success: function (res) { 
        wx.showToast({
          title: '分享成功',
          icon:'none'
        })
      }
    }
  }
})