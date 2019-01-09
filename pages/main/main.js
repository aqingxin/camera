// pages/main/main.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tmpImg:'',
    imgWidth:'',
    imgHeight:'',
    originalWidth:'',   //图片真实宽度
    originalHeight:'',   //图片真实高度
    arrowPosition:'0%',
    arrowRotate:'0deg',
    imgArr:[
      { src: '1.png', rotate: 0, flip: '0deg', scale: '1' },
      { src: '2.png', rotate: 0, flip: '0deg', scale: '1' },
      { src: '3.png', rotate: 0, flip: '0deg', scale: '1' },
    ],
    choseImg:[],
    imgIndex:null,
    startX: null,
    startY: null,
    moveX: null,
    moveY: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({    //设置图片路径
      tmpImg:options.img
    })
  },

  mainImgLoad(e){    //图片加载完执行该函数
    var query=wx.createSelectorQuery();
    var tmpWidth = e.detail.width;
    var tmpHeight = e.detail.height;
    var _this=this;
    query.select('.main-content').boundingClientRect().exec(function(ev){
      // console.log(ev)
      _this.setData({
        originalHeight: e.detail.height,    //设置图片原大小
        originalWidth: e.detail.width,
        imgWidth:ev[0].width,      //设置图片的显示大小，使其自适应
        imgHeight: tmpHeight * ev[0].width/tmpWidth
      })
    })
  },
  changeArrow(){  //贴纸素材容器的样式
    if (this.data.arrowPosition==='0%'){
      this.setData({
        arrowPosition:'80%',
        arrowRotate:'180deg'
      })
    }else{
      this.setData({
        arrowPosition: '0%',
        arrowRotate: '0deg'
      })
    }
  },
  selectImg(e){  //从素材中选择贴纸，在显示到主要区域中
    console.log(e)
    let tmpArr = this.data.choseImg;
    let tmpImg = JSON.parse(JSON.stringify(this.data.imgArr));   //深拷贝的一种技巧，防止修改数据时把源数据也一起修改了
    tmpArr.push(tmpImg[e.target.dataset.index]);
    this.setData({
      choseImg: tmpArr,
    })
  },
  choseImgLoad(e){
    // console.log(e)
    this.setData({
      imgIndex: e.target.dataset.index
    })
  },
  closeChoseImg() {   //删除已选择的头像贴纸
    let tmpArr=this.data.choseImg;
    tmpArr.splice(this.data.imgIndex,1);
    this.setData({
      choseImg:tmpArr,
      imgIndex: this.data.imgIndex-1
    })
  },
  flipChoseImg(){    //水平翻转头像贴纸
    var query = wx.createSelectorQuery();
    var _this=this;
    query.select(`#choseImg${this.data.imgIndex}`).boundingClientRect().exec(function(ev){
      // console.log(ev[0].dataset.index)
      let tmp = _this.data.choseImg;
      if (tmp[ev[0].dataset.index].flip === '180deg'){
        tmp[ev[0].dataset.index].flip = '0deg';
      }else{
        tmp[ev[0].dataset.index].flip = '180deg'
      }
      _this.setData({
        choseImg:tmp
      })
    })
  },
  rotateChoseImg() {

  },
  rotateStart(e) {  
    console.log(e)
    this.setData({
      startX: e.changedTouches[0].pageX,
      startY: e.changedTouches[0].pageY,
    })
  },
  rotateImgMove(e) {   //旋转时手指的滑动
    var query = wx.createSelectorQuery();
    var _this = this;
    let pageX=e.changedTouches[0].pageX;
    let pageY = e.changedTouches[0].pageY;
    query.select(`#choseImg${this.data.imgIndex}`).boundingClientRect().exec(function (ev) {
      // console.log(ev)
      
      let tmp = _this.data.choseImg;
      tmp[ev[0].dataset.index].rotate = Math.atan2(pageY - _this.data.startY, pageX  - _this.data.startX  ) / Math.PI * 180
      _this.setData({
        choseImg: tmp,
        moveX:pageX,
        moveY:pageY
      })
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
  onShareAppMessage: function () {

  }
})