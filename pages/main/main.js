// pages/main/main.js
var ctx = wx.createCanvasContext('main-canvas',this)
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
      { src: '1.png', rotate: 0, flip: '0deg', scale: 1, top: 0, left: 0},
      { src: '2.png', rotate: 0, flip: '0deg', scale: 1, top: 0, left: 0},
      { src: '3.png', rotate: 0, flip: '0deg', scale: 1, top: 0, left: 0},
    ],
    choseImg:[],
    imgIndex:null,
    startX: null,
    startY: null,
    moveX: null,
    moveY: null,
    boxShow:false,  //操作头像贴纸的盒子 显示与否  
    boxStyle: { top: 0, left: 0 },    //操作头像贴纸的盒子  样式
    choseStartX:null,
    choseStartY: null,
    canvasW:0,
    canvasH:0,
    successImg:'',
    successShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({    //设置图片路径
      tmpImg:options.img
    })
    wx.createSelectorQuery().select('.main').boundingClientRect().exec(ev=>{
      // console.log(ev)
      let tmpArr=this.data.imgArr;
      tmpArr.map(item=>{
        item.top = ev[0].height / 2;
        item.left = ev[0].width / 2;
      })
      this.setData({
        imgArr:tmpArr
      })
    })
  },

  mainImgLoad(e){    //图片加载完执行该函数
    var query=wx.createSelectorQuery();
    var tmpWidth = e.detail.width;
    var tmpHeight = e.detail.height;
    console.log(e.detail)
    var _this=this;

    query.select('.main-content').boundingClientRect().exec(ev=>{
      // console.log(ev)
      this.setData({
        originalHeight: e.detail.height,    //设置图片原大小
        originalWidth: e.detail.width,

        imgWidth:ev[0].width,      //设置图片的显示大小，使其自适应
        // 变量分别为：图片原高度，外层view宽度即屏幕宽度，图片原宽度
        imgHeight: tmpHeight * ev[0].width/tmpWidth

      })
    })


    this.drawMain(this.data.tmpImg, e.detail.width, e.detail.height)
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
    // console.log(e)
    let tmpArr = this.data.choseImg;

    let tmpImg = JSON.parse(JSON.stringify(this.data.imgArr));   //拷贝数组的一种技巧，防止修改数据时把源数据也一起修改了
    tmpArr.push(tmpImg[e.target.dataset.index]);
    this.setData({
      choseImg: tmpArr,
      boxShow:true
    })
    if(this.data.choseImg.length>0){
      this.setData({
        imgIndex:this.data.choseImg.length-1,
      })
      wx.createSelectorQuery().select(`#choseImg${this.data.imgIndex}`).boundingClientRect().exec(ev=>{
        // console.log(ev)
        let tmpObj={
          top:ev[0].top-6,
          left: ev[0].left-5,
        }
        this.setData({
          boxStyle:tmpObj  
        })
      })
    }
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
    // let tmpArr = this.data.choseImg;
    if(this.data.imgIndex>=0){
      let tmpObj = {
        top: tmpArr[this.data.imgIndex].top - 50,
        left: tmpArr[this.data.imgIndex].left - 50,
      }
      this.setData({
        boxStyle: tmpObj
      })
    }

    if (this.data.choseImg.length===0){   //当主要的区域的头像贴纸数为0时，操作贴纸的盒子不显示
      this.setData({
        boxShow:false
      })
    }
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
      let tmp = _this.data.choseImg;
      tmp[ev[0].dataset.index].rotate = Math.atan2(pageY - _this.data.startY, pageX  - _this.data.startX  ) / Math.PI * 180
      _this.setData({
        choseImg: tmp,
        moveX:pageX,
        moveY:pageY
      })
    })
  },
  scaleChoseImg(e){   //放大头像贴纸
    var query = wx.createSelectorQuery();
    let tmp=this.data.choseImg;
    var _this = this;
    query.select(`#choseImg${this.data.imgIndex}`).boundingClientRect().exec(function (ev) {
      let tmp = _this.data.choseImg;
      if (e.touches[0].pageX>_this.data.moveX && e.touches[0].pageY>_this.data.moveY){
        // console.log('dd')
        tmp[ev[0].dataset.index].scale += 0.01
      }else{
        tmp[ev[0].dataset.index].scale -= 0.01 
      }
      _this.setData({
        choseImg: tmp,
        moveX: e.touches[0].pageX,
        moveY: e.touches[0].pageY
      })
    })
    return false;
  },
  choseImgStart(e) {
    // console.log(e)
    this.setData({
      choseStartX: e.touches[0].pageX,
      choseStartY: e.touches[0].pageY,
    })
  },
  choseImgMove(e) {   //头像贴纸移动，所在的白色框的盒子也一起移动
    // console.log(e)
    let tmpObj={
      top: e.touches[0].pageY-45,
      left: e.touches[0].pageX-45
    }
    let tmpArr=this.data.choseImg;
    tmpArr[this.data.imgIndex].top = e.touches[0].pageY+6;
    tmpArr[this.data.imgIndex].left = e.touches[0].pageX+5;
    this.setData({
      boxStyle:tmpObj,
      choseImg:tmpArr
    })
    return false;
  },
  selectChoseImg(e){   //点击已选择头像贴纸，让白色框的盒子的位置等于所点击的头像贴纸的位置
    let tmpArr=this.data.choseImg;
    let tmpObj={
      top: tmpArr[e.target.dataset.index].top-50,
      left: tmpArr[e.target.dataset.index].left-50,
    }
    this.setData({
      boxShow:true,
      imgIndex:e.target.dataset.index,
      boxStyle:tmpObj
    })
  },
  hideBox() {   //点击主图时 隐藏白色框的盒子
    this.setData({
      boxShow:false
    })
  },
  drawMain(imgSrc,imgWidth,imgHeight){   //画主图
    let canvasW = 0;
    let canvasH = 0;
    wx.createSelectorQuery().select('.canvas').boundingClientRect().exec(ev=>{
      this.setData({
        canvasW: ev[0].width,
        canvasH: ev[0].height
      })
      // ctx.drawImage(imgSrc, 0, (ev[0].height-imgHeight*ev[0].width/imgWidth)/2,ev[0].width,imgHeight*ev[0].width/imgWidth);
      ctx.drawImage(imgSrc, 0, 0, imgWidth, imgHeight);

      ctx.draw();
    })
  },
  success(){
    // ctx.clearRect();
    // this.dw
    wx.showLoading({
      title: '生成图片中',
    })
    let tmpArr = this.data.choseImg;
    for (let i = 0; i < tmpArr.length; i++) {
      wx.getImageInfo({
        src: `../../static/images/${tmpArr[i].src}`,
        success: res => {
          ctx.save();
          ctx.translate(this.data.canvasW / 2, this.data.canvasH / 2);
          ctx.rotate(45 * Math.PI / 180);
          // ctx.scale(-1,1);

          ctx.drawImage(`../../static/images/${tmpArr[i].src}`, (tmpArr[i].left - 45)*5.12, (tmpArr[i].top - 45), 90*5.12, 90*5.12);
          ctx.translate(-this.data.canvasW / 2, -this.data.canvasH / 2);
          
          ctx.draw(true);
          ctx.restore();
          setTimeout(()=>{
            console.log(this.data.originalHeight)
            wx.canvasToTempFilePath({    //微信官方API，将canvas保存为图片并且存到相册
              x:0,
              y:0,
              width: this.data.originalWidth,
              height: 1080,  //测试数据，暂时定死
              destWidth: this.data.originalWidth,
              desHeight: 1080, //测试数据，暂时定死
              canvasId: 'main-canvas',
              success: res => {
                wx.hideLoading();
                console.log(res)
                this.setData({
                  successImg: res.tempFilePath,
                  successShow: true
                })
                wx.navigateTo({
                  url: '../success/success?imgPath='+res.tempFilePath,
                })
              }
            }, this)
          },1000)
        },
        fail: err => {
          console.log(err)
        }
      })
    }
    
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