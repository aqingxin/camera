// pages/main/main.js
var itemList=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainImg:{   //主图的信息
      imgPath:'',
      width:0,
      height:0,
      top:0,
      left:0,
      originWidth:0,
      originHeight: 0
    },
    windowW:0,   //屏幕宽高
    windowH:0,
    arrowRotate:0,
    stickerArr:[
      { path: '1.png' },
      { path: '2.png' },
      { path: '3.png' }
    ],
    mainImgArr:[]   //主要区域操作的贴纸
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let tmpImgObj=this.data.mainImg;
    tmpImgObj.imgPath=options.img;
    this.setData({
      mainImg:tmpImgObj
    })
    wx.getSystemInfo({   
      success: res=> {
        this.setData({
          windowH:res.windowHeight,
          windowW:res.windowWidth
        })
        this.setMainImg()
      },
    })

  },

  //获取主图信息
  setMainImg() {
    let tmpImgObj=this.data.mainImg;
    wx.getImageInfo({
      src: tmpImgObj.imgPath,
      success:res=>{
        console.log(res)
        tmpImgObj.originWidth=res.width;
        tmpImgObj.originHeight = res.height;

        tmpImgObj.width=this.data.windowW;   //自适应宽
        //自适应高
        tmpImgObj.height = tmpImgObj.originHeight * this.data.windowW / tmpImgObj.originWidth;   
        //自适应top值
        tmpImgObj.top=(this.data.windowH-tmpImgObj.originHeight*this.data.windowW/tmpImgObj.originWidth)/2;
        this.setData({
          mainImg:tmpImgObj
        })
      }
    })
  },
  
  changeArrow(){   //贴纸素材的样式改变
    if(this.data.arrowRotate==='180deg'){
      this.setData({
        arrowRotate:'0deg'
      })
    }else{
      this.setData({
        arrowRotate: '180deg'
      })
    }
  },

  selectSticker(e){   //从底部的贴纸素材选择贴纸添加到主要区域中
    var index=e.target.dataset.index;
    itemList.push({
      path: this.data.stickerArr[index].path,
      top: this.data.windowH/2-50,
      left: this.data.windowW/2-50,
      x: this.data.windowW / 2,
      y: this.data.windowH / 2,
      scale: 1,   //缩放比例
      angle: 0,   //旋转角度
      rotate: 1,  //旋转值
      active:false,   
      width: 100,
      height: 100,
    })
    console.log(itemList)
    this.setData({
      mainImgArr:itemList
    })
  },
  WraptouchStart(e){   //点击图片   记录此时的x,y值
    var index = e.target.dataset.index;
    for(let i=0;i<itemList.length;i++){
      itemList[i].active=false;
      if(index===i){
        itemList[index].active=true;   //开启可操作状态
      }
    }
    itemList[index].lx = e.touches[0].clientX;   //记录x,y值
    itemList[index].ly = e.touches[0].clientY;

    this.setData({
      mainImgArr:itemList
    })
  },
  WraptouchMove(e){  //图片开始移动
    var index = e.target.dataset.index;

    //图片移动时的坐标页写在属性里面
    itemList[index]._lx = e.touches[0].clientX;
    itemList[index]._ly = e.touches[0].clientY;

    itemList[index].left += itemList[index]._lx - itemList[index].lx;
    itemList[index].top += itemList[index]._ly - itemList[index].ly;
    itemList[index].x += itemList[index]._lx - itemList[index].lx;
    itemList[index].y += itemList[index]._ly - itemList[index].ly;


    itemList[index].lx = e.touches[0].clientX;
    itemList[index].ly = e.touches[0].clientY;

    this.setData({
      mainImgArr:itemList
    })
  },
  WraptouchEnd(e) {
    //console.log('end',items)
  },

  deleteItem(e){  //删除主要区域的头像素材贴纸
    var index = e.target.dataset.index;
    itemList.splice(index,1);
    this.setData({
      mainImgArr:itemList
    })
  },

  touchStart(e){
    var index=e.target.dataset.index;
    itemList[index].active=true;

    //获取作为移动前角度的坐标 
    itemList[index].tx = e.touches[0].clientX;
    itemList[index].ty = e.touches[0].clientY;

    itemList[index].anglePre = this.countDeg(itemList[index].x, itemList[index].y, itemList[index].tx, itemList[index].ty)
    itemList[index].r = this.getDistancs(itemList[index].x, itemList[index].y, itemList[index].left, itemList[index].top)
  },
  touchMove(e){

    var index = e.target.dataset.index;
    itemList[index]._tx = e.touches[0].clientX;
    itemList[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离  
    itemList[index].disPtoO = this.getDistancs(itemList[index].x, itemList[index].y, itemList[index]._tx - this.data.windowW * 0.125, itemList[index]._ty - 10)
    // console.log(itemList[index].rotate)

    //手指滑动的点到圆心的距离与半径的比值作为图片的放大比例  
    itemList[index].scale = itemList[index].disPtoO / itemList[index].r;
    // console.log(itemList[index].disPtoO / itemList[index].r)
    if (Math.abs(itemList[index].scale) > 2) { //设置最大缩放为2倍
      itemList[index].scale = 2;
    }
    if (Math.abs(itemList[index].scale) < 0.5) { //设置最小缩放为0.5倍
      itemList[index].scale = 0.5;
    }
    //图片放大响应的右下角按钮同比缩小  
    itemList[index].oScale = 1 / itemList[index].scale;

    //移动后位置的角度  
    itemList[index].angleNext = this.countDeg(itemList[index].x, itemList[index].y, itemList[index]._tx, itemList[index]._ty)
    //角度差  
    itemList[index].new_rotate = itemList[index].angleNext - itemList[index].anglePre;
    //叠加的角度差  
    // console.log(itemList[index].new_rotate, itemList[index].rotate)
    itemList[index].rotate += itemList[index].new_rotate;
    itemList[index].angle = itemList[index].rotate; //赋值  

    //用过移动后的坐标赋值为移动前坐标  
    itemList[index].tx = e.touches[0].clientX;
    itemList[index].ty = e.touches[0].clientY;
    itemList[index].anglePre = this.countDeg(itemList[index].x, itemList[index].y, itemList[index].tx, itemList[index].ty)

    //赋值setData渲染  
    this.setData({
      mainImgArr: itemList
    })
  },
  touchEnd: function (e) { },
  /*  
     *参数1和2为图片圆心坐标  
     *参数3和4为手点击的坐标  
     *返回值为手点击的坐标到圆心的角度  
     */
  countDeg: function (cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    //鼠标相对于旋转中心的角度  
    var angle = Math.atan(to) / (2 * Math.PI) * 360;
    //console.log("ox.oy:", ox, oy, angle)
    if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系    
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0)//左下角,3象限    
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0)//右上角，1象限    
    {
      angle = angle;
    } else if (ox > 0 && oy > 0)//右下角，2象限    
    {
      angle = 180 - angle;
    }

    return angle;
  },
  //计算触摸点到圆心的距离
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
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