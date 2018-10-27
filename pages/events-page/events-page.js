const eventsdata = require('../../libraries/eventsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
  data: {
    swiper: {},
    special: {},
    events: {},
    loading: true,
    hasMore: true,
    subtitle: '',
    scrollTop: 0,
    showGoTop: false,
    showSearch: true,
    inputValue: '',
    nowdate: ''
  },

  showLoading() {
    wx.showNavigationBarLoading();
    this.setData({
      subtitle: '加载中...',
      loading: true,
    });
  },
  hideLoading() {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.setData({
      loading: false
    });
  },
  /**
   * [initLoad 初始化加载数据]
   * @return {[type]} [description]
   */
  initLoad() {
    this.showLoading();
    
    this.nowdate = eventsdata.NOWDATE;
    this.nowdate = new Date(this.nowdate.getFullYear() + 0, this.nowdate.getMonth() + 1, this.nowdate.getDay()+2);
    console.log(this.nowdate);
    var swiNow = eventsdata.getNowFormatDate(this.nowdate);
    console.log(swiNow);
    this.nowdate = new Date(this.nowdate - 3 * 24 * 3600 * 1000);
    var swiBefore = eventsdata.getNowFormatDate(this.nowdate);
    console.log(swiBefore);
    var now = eventsdata.getNowFormatDate(this.nowdate);
    console.log(now);
    var before = eventsdata.get3daybefore(this.nowdate);
    console.log(before);
    this.nowdate = new Date(this.nowdate - 3 * 24 * 3600 * 1000);
    console.log(this.nowdate);

    eventsdata.findUM({ date_from: swiBefore, date_to: swiNow })
      .then(d => {
        // console.log(d);
        d._embedded.forEach((obj, index) => {
          if (obj.details[0])
            delete obj.details[0].content;
          if (obj.details[1])
            delete obj.details[1].content;
          if (obj.details[2])
            delete obj.details[2].content;
        })
        this.setData({ swiper: d });
        console.log(d);
      });

    eventsdata.findUM({ date_from: before, date_to: now })
      .then(d => {
        //console.log(d);
        d._embedded.forEach((obj, index) => {
          if (obj.details[0])
            delete obj.details[0].content;
          if (obj.details[1])
            delete obj.details[1].content;
          if (obj.details[2])
            delete obj.details[2].content;

        })
        //console.log(d);
        this.setData({ events: d });
        console.log(d);
        // d["_embedded"].forEach((obj, index) =>{
        //   console.log(obj);
        // } )
        //console.log(d);
        //console.log(d._embedded);
        this.hideLoading();
      });

  },
  

  /**
   * [loadMore 加载更多数据]
   * @return {[type]} [description]
   */
  loadMore() {

    this.showLoading();

   
    var now = eventsdata.getNowFormatDate(this.nowdate);
    var before = eventsdata.getNowFormatDate(new Date(this.nowdate - 1 * 7 * 24 * 3600 * 1000));
    this.nowdate = new Date(this.nowdate - 1 * 7 * 24 * 3600 * 1000);
    eventsdata.findUM({ date_from: before, date_to: now })
      .then(d => {
        d._embedded.forEach((obj, index) => {
          if (obj.details[0])
            delete obj.details[0].content;
          if (obj.details[1])
            delete obj.details[1].content;
          if (obj.details[2])
            delete obj.details[2].content;

        })
        let newevents = d;

        let olditem = this.data.events._embedded;
        newevents._embedded = olditem.concat(newevents._embedded);
        this.setData({
          events: newevents,
        });
        this.hideLoading();
      })
      .catch(e => {
        this.setData({
          subtitle: '获取数据异常',
        })
        console.error(e);
        this.hideLoading();
      })

  },
  navToArticleeve(event) {
    console.log(event);
    let str = dealUrl.getUrlEvents(event);
    wx.navigateTo({
      url: '../eventsArticle/eventsArticle' + str,
      success: (res) => { },
      fail: (err) => {
        console.log(err)
      }
    });
  },
  toTop() {
    console.log(111)
  },
  searchIcon() {
    // wx.navigateTo({ url: '../logs/logs' });
    this.setData({
      showSearch: false,
      inputValue: '',
    });
  },
  bindKeyInput: function (event) {//获取输入的数据
    this.setData({
      inputValue: event.detail.value
    })
  },
  bindSearch() {//输入框点击完成事件
    let searchValue = this.data.inputValue;
    if (searchValue != '') {
      console.log(this.data.inputValue)
    }
    wx.showModal({
      title: '提示',
      content: `你输入的数据：${this.data.inputValue != '' ? this.data.inputValue : '是空的'} ,但是没用，我没做这个功能。`,
      success: () => { },
      fail: () => { }
    });
  },
  ensureBtn(event) {//确定按钮事件
    this.bindSearch();
  },
  scroll(event) {
    this.setData({
      showSearch: true,
    });
  },
  /**
   * [onLoad 载入页面时执行的生命周期初始函数]
   * @return {[type]} [description]
   */
  onLoad() {
    this.initLoad();
  },

  /**
   * [onPullDownRefresh 下拉刷新数据]
   * @return {[type]} [description]
   */
  onPullDownRefresh() {
    this.initLoad();
  },

  /**
   * [onReachBottom 上拉加载更多]
   * @return {[type]} [description]
   */
  onReachBottom() {
    this.loadMore();
  }
})