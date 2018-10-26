const newsdata = require('../../libraries/newsdata.js');
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
    isCollected: false
  },
  handleCollection() {
    let isCollected = !this.data.isCollected;

    this.setData({
      // 下面本来是这样子的:isCollected=isCollected,可以简写
      isCollected: isCollected
    })
    //提示用户
    console.log(this.data.isCollected);
    wx.showToast({
      title: isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    })
    wx.getStorage({
      key: 'isCollected',
      success: (data) => {
        let obj = data.data;
        console.log(obj);
        console.log(this.index);
        obj[this.data.index] = isCollected;
        console.log(obj);
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: () => { },
        })
      },
    })
    console.log(wx.getStorageSync('isCollected'));
  },
  onLoad(option) {
    var indexs;
    let params = option;
    console.log(option);
    newsdata.findUM(params)
      .then((res) => {
        console.log(res);
        var html = res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].content : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].content : res._embedded[0].details[2].content);
        html = html.replace(/<\/span>/g, "");
        html = html.replace(/<\/sup>/g, "");
        html = html.replace(/<sup>/g, "");
        html = html.replace(/<span([\s\S]*?)>/g, "");

        html = html.replace(/<\/a>/g, "");
        html = html.replace(/<a([\s\S]*?)>/g, "");
        html = html.replace(/\/&nbsp;/, "");
        html = html.replace(/&nbsp;/g, "");
        let wxml = htmlToWxml.html2json(html);
        var fimg = {
          type: "img", attr: {
            src: res._embedded[0].common.imageUrls[0]
          }
        }
        wxml.unshift(fimg);
        var count = 1;
        if (res._embedded[0].common.imageUrls[count]) {
          var fimg = {
            type: "img", attr: {
              src: res._embedded[0].common.imageUrls[count]
            }
          }
          wxml.push(fimg);
          count++;
        }
        console.log(wxml);
        this.setData({ wxml: wxml });

        this.setData({
          title: res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].title : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].title : res._embedded[0].details[2].title),
          loading: false,
          body: {
            title: res._embedded[0].details[0].locale == "zh_TW" ? res._embedded[0].details[0].title : (res._embedded[0].details[1].locale == "zh_TW" ? res._embedded[0].details[1].title : res._embedded[0].details[2].title),
            editTime: res._embedded[0].common.publishDate[0] + res._embedded[0].common.publishDate[1] + res._embedded[0].common.publishDate[2] + res._embedded[0].common.publishDate[3] + res._embedded[0].common.publishDate[4] + res._embedded[0].common.publishDate[5] + res._embedded[0].common.publishDate[6] + res._embedded[0].common.publishDate[7] + res._embedded[0].common.publishDate[8] + res._embedded[0].common.publishDate[9] + ' ' + res._embedded[0].common.publishDate[11] + res._embedded[0].common.publishDate[12] + res._embedded[0].common.publishDate[13] + res._embedded[0].common.publishDate[14] + res._embedded[0].common.publishDate[15]
          },
          disclaimer: '',
          index: res._embedded[0].details[1].title

        });
        indexs = res._embedded[0].details[1].title;
        //console.log(indexs);
        let detailStorage = wx.getStorageSync('isCollected')
        //console.log(detailStorage);

        //如果没有收藏
        if (!detailStorage) {
          //初始化一个空的对象
          wx.setStorageSync('isCollected', {});
        }
        console.log(wx.getStorageSync('isCollected'));

        console.log(indexs);
        //console.log(detailStorage(this.data.index));
        //如果收藏了
        if (detailStorage[indexs]) {
          this.setData({
            isCollected: true
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