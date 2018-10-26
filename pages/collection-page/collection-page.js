const newsdata = require('../../libraries/newsdata.js');
const eventsdata = require('../../libraries/eventsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');

const app = getApp();
Page({
  data: {
    swiper: {},
    special: {},
    news: {},
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
    let detailStorage = wx.getStorageSync('isCollected')
    console.log(detailStorage)
    //console.log(detailStorage);

    //如果没有收藏
    if (!detailStorage) {
      //初始化一个空的对象
      wx.setStorageSync('isCollected', {});
    }
    console.log(detailStorage);
    var m = {_embedded: []};
    for(var key in detailStorage){
      if (detailStorage[key]){
      var str = '"' + key + '"';

      newsdata.findUM({keyword: str})
        .then(d=> {
          d._embedded.forEach((obj, index) => {
            if (obj.details[0])
              delete obj.details[0].content;
            if (obj.details[1])
              delete obj.details[1].content;
            if (obj.details[2])
              delete obj.details[2].content;
          })
          m._embedded.push(d._embedded[0]);
          this.setData({news: m})
        })
      }
      this.setData({ news: m });
      
    }
    let detailStorage2 = wx.getStorageSync('is')
    //console.log(detailStorage);

    //如果没有收藏
    if (!detailStorage2) {
      //初始化一个空的对象
      wx.setStorageSync('is', {});
    }
    console.log(wx.getStorageSync('is'));
    var mm = { _embedded: [] };
    for (var key in detailStorage2) {
      if (detailStorage2[key]) {
        eventsdata.findUM({ item_id: key })
          .then(d => {
            mm._embedded.push(d._embedded[0]);
            this.setData({ events: mm })
          })
      }
      this.setData({ events: mm });
      
    }
    this.hideLoading();
  },
  navToArticle(event) {
    console.log(event);
    let str = dealUrl.getUrlTypeId(event);
    wx.navigateTo({
      url: '../article-page/article-page' + str,
      success: (res) => { },
      fail: (err) => {
        console.log(err)
      }
    });
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
  scroll(event) {
    this.setData({
      showSearch: true,
    });
  },
  /**
   * [onLoad 载入页面时执行的生命周期初始函数]
   * @return {[type]} [description]
   */
  onShow: function(){
    this.showLoading();
    
    this.nowdate = newsdata.NOWDATE;
    var swiNow = newsdata.getNowFormatDate(this.nowdate);
    this.nowdate = new Date(this.nowdate - 2 * 24 * 3600 * 1000)
    var swiBefore = newsdata.getNowFormatDate(this.nowdate);
    var now = newsdata.getNowFormatDate(this.nowdate);
    var before = newsdata.get2weekbefore(this.nowdate);
    this.nowdate = new Date(this.nowdate - 2 * 7 * 24 * 3600 * 1000);

    
    let detailStorage = wx.getStorageSync('isCollected')
    console.log(detailStorage)
    //console.log(detailStorage);

    //如果没有收藏
    if (!detailStorage) {
      //初始化一个空的对象
      wx.setStorageSync('isCollected', {});
    }
    console.log(detailStorage);
    var m = { _embedded: [] };
    for (var key in detailStorage) {
      if (detailStorage[key]) {
        var str = '"' + key + '"';

        newsdata.findUM({ keyword: str })
          .then(d => {
            d._embedded.forEach((obj, index) => {
              if (obj.details[0])
                delete obj.details[0].content;
              if (obj.details[1])
                delete obj.details[1].content;
              if (obj.details[2])
                delete obj.details[2].content;
            })
            m._embedded.push(d._embedded[0]);
            this.setData({ news: m })
          })
      }
      this.setData({ news: m });
      this.hideLoading();
    }

    let detailStorage2 = wx.getStorageSync('is')
    //console.log(detailStorage);

    //如果没有收藏
    if (!detailStorage2) {
      //初始化一个空的对象
      wx.setStorageSync('is', {});
    }
    console.log(wx.getStorageSync('is'));
    var mm = { _embedded: [] };
    for (var key in detailStorage2) {
      if (detailStorage2[key]) {
        eventsdata.findUM({ item_id: key })
          .then(d => {
            mm._embedded.push(d._embedded[0]);
            this.setData({ events: mm })
          })
      }
      this.setData({ events: mm });

    }
    this.hideLoading();

    this.hideLoading();
  },
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
  // onReachBottom() {
  //   this.loadMore();
  // }
})