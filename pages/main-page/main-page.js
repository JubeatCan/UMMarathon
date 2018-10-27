const newsdata = require('../../libraries/newsdata.js');
const dealUrl = require('../../libraries/dealUrl.js');
const app = getApp();
Page({
    data: {
        swiper: {},
        special: {},
        news: {},
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
      this.nowdate = newsdata.NOWDATE;
      var swiNow = newsdata.getNowFormatDate(this.nowdate);
      this.nowdate = new Date(this.nowdate - 2 * 24 * 3600 * 1000)
      var swiBefore = newsdata.getNowFormatDate(this.nowdate);
        var now = newsdata.getNowFormatDate(this.nowdate);
        var before = newsdata.get2weekbefore(this.nowdate);
      this.nowdate = new Date(this.nowdate - 2 * 7 * 24 * 3600 * 1000);

        newsdata.findUM({date_from: swiBefore, date_to: swiNow})
          .then(d => {
            console.log(d);
            d._embedded.forEach((obj, index) => {
              if (obj.details[0])
                delete obj.details[0].content;
              if (obj.details[1])
                delete obj.details[1].content;
              if (obj.details[2])
                delete obj.details[2].content;
            })
            this.setData({swiper: d});
          });
      
        newsdata.findUM({ date_from: before, date_to: now })
          .then(d => {
            //console.log(d);
            d._embedded.forEach((obj,index) => {
              if (obj.details[0])
                delete obj.details[0].content;
              if (obj.details[1])
                delete obj.details[1].content;
              if (obj.details[2])
                delete obj.details[2].content;

            })
            //console.log(d);
            this.setData({ news:d });
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
        
        var now = newsdata.getNowFormatDate(this.nowdate);
      var before = newsdata.getNowFormatDate(new Date(this.nowdate - 1 * 7 * 24 * 3600 * 1000));
      this.nowdate = new Date(this.nowdate - 1 * 7 * 24 * 3600 * 1000);
        newsdata.findUM({ date_from: before, date_to: now })
            .then(d => {
              d._embedded.forEach((obj, index) => {
                if (obj.details[0])
                  delete obj.details[0].content;
                if (obj.details[1])
                  delete obj.details[1].content;
                if (obj.details[2])
                  delete obj.details[2].content;

              })
                let newnews = d;

                let olditem = this.data.news._embedded;
                newnews._embedded = olditem.concat(newnews._embedded);
                this.setData({
                    news: newnews,
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
    navToArticle(event) {
      console.log(event);
        let str = dealUrl.getUrlTypeId(event);
        wx.navigateTo({
            url: '../article-page/article-page' + str,
            success: (res) => {},
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
    bindKeyInput: function(event) {//获取输入的数据
        this.setData({
          inputValue: event.detail.value
        })
    },
    bindSearch() {//输入框点击完成事件
        let searchValue = this.data.inputValue;
        if(searchValue != '') {
            console.log(this.data.inputValue)
        }
        var str = dealUrl.getUrlTitle(searchValue);
        console.log(str);
        wx.navigateTo({
          url: '../search-page/search-page' + str,
          success: (res) => { },
          fail: (err) => {
          console.log(err)
        }
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