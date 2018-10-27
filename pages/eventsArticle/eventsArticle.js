const eventsdata = require('../../libraries/eventsdata.js');
const htmlToWxml = require('../../libraries/htmlToWxml.js');
import WeParser from '../../libraries/weParser/weparser.js';
Page({
	data: {
		title: '',
    loading: true,
		body: {},
		disclaimer: '',
		wxml: {},
    index: null,
    is:false
	},
  handleCollection() {
    let is = !this.data.is;

    this.setData({
      
      is : is
    })
    //提示用户
    console.log(this.data.is);
    wx.showToast({
      title: is ? '收藏成功' : '取消收藏',
      icon: 'success'
    })
    wx.getStorage({
      key: 'is',
      success: (data) => {
        let obj = data.data;
        console.log(obj);
        console.log(this.index);
        obj[this.data.index] = is;
        console.log(obj);
        wx.setStorage({
          key: 'is',
          data: obj,
          success: () => {},
        })
      },
    })
    console.log(wx.getStorageSync('is'));
  },
	onLoad(option) {
      var indexs;
      let params = option;
      console.log(option);
      eventsdata.findUM(params)
        .then((res) => {
          console.log(res);
          var html = res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].content : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].content : res._embedded[0].details[2].content);
          var wxml = [];
          var fimg = {
            type: "img", attr: {
              src: res._embedded[0].common.posterUrl
            }
          }
          wxml.unshift(fimg);
          console.log(wxml);
          console.log(wxml);
          if(res._embedded[0].details[1].dataString){
            wxml.push({ type: 'view', child: [{ type: 'text', text: '活動時間: ' + res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].dataString : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].dataString : res._embedded[0].details[2].dataString)}] });
          }
          else{
            wxml.push({ type: 'view', child: [{ type: 'text', text: '活動時間: ' + res._embedded[0].common.dateFrom[0] + res._embedded[0].common.dateFrom[1] + res._embedded[0].common.dateFrom[2] + res._embedded[0].common.dateFrom[3] + res._embedded[0].common.dateFrom[4] + res._embedded[0].common.dateFrom[5] + res._embedded[0].common.dateFrom[6] + res._embedded[0].common.dateFrom[7] + res._embedded[0].common.dateFrom[8] + res._embedded[0].common.dateFrom[9]}] });
          }
          wxml.push({ type: 'view', child: [{ type: 'text', text: '地點: ' + res._embedded[0].details[1].venues[0]}]});
          wxml.push({ type: 'view', child: [{ type: 'text', text: '組織者: ' + res._embedded[0].details[1].organizedBys }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '郵箱: ' + res._embedded[0].details[1].contactEmail }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '傳真: ' + res._embedded[0].details[1].contactFax }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '聯繫人: ' + res._embedded[0].details[1].contactName }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '郵箱: ' + res._embedded[0].details[1].contactEmail }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '電話: ' + res._embedded[0].details[1].contactPhone }] });
          wxml.push({ type: 'view', child: [{ type: 'text', text: '--------------------------------------------------------------------------' }] });
          this.setData({ wxml: wxml });
          console.log(wxml[0].type);

          this.setData({
            title: res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].title : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].title : res._embedded[0].details[2].title),
            loading: false,
            body: {
              title: res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].title : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].title : res._embedded[0].details[2].title),
              editTime: "Publish Time: " + res._embedded[0].common.publishDate[0] + res._embedded[0].common.publishDate[1] + res._embedded[0].common.publishDate[2] + res._embedded[0].common.publishDate[3] + res._embedded[0].common.publishDate[4] + res._embedded[0].common.publishDate[5] + res._embedded[0].common.publishDate[6] + res._embedded[0].common.publishDate[7] + res._embedded[0].common.publishDate[8] + res._embedded[0].common.publishDate[9] + ' ' + res._embedded[0].common.publishDate[11] + res._embedded[0].common.publishDate[12] + res._embedded[0].common.publishDate[13] + res._embedded[0].common.publishDate[14] + res._embedded[0].common.publishDate[15]
            },
            disclaimer: '',
            index: res._embedded[0].itemId

          });
          indexs = res._embedded[0].itemId;
          //console.log(indexs);
          let detailStorage = wx.getStorageSync('is')
          //console.log(detailStorage);

          //如果没有收藏
          if (!detailStorage) {
            //初始化一个空的对象
            wx.setStorageSync('is', {});
          }
          console.log(wx.getStorageSync('is'));

          console.log(indexs);
          //console.log(detailStorage(this.data.index));
          //如果收藏了
          if (detailStorage[indexs]) {
            this.setData({
              is: true
            })
          }
          console.log(detailStorage);
        })
        .catch(err => {
          this.setData({ title: '获取数据异常', loading: false })
          console.log(err);
        })
      //根据本地缓存的数据判读用户是否收藏当前文章

    },
  onPullDownRefresh() {
      wx.stopPullDownRefresh();
  },
})