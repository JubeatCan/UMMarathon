const API_URL = 'https://api.iclient.ifeng.com';
const API_URL2 = 'https://api.3g.ifeng.com';
const API_LIVE = 'https://sports.live.ifeng.com/API';
const API_UM = 'https://api.data.umac.mo/service/media/news/v1.0.0/all';
const Promise = require('./bluebird')
const NOWDATE = new Date()

function fetchApi (type, params, flag) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${flag == true ? API_LIVE : API_URL}/${type}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

function fetchApiUM (params){
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_UM}`,
      data: Object.assign({},params),
      header: { 'Authorization': 'Bearer 5db70af1-3cbe-3200-8a42-8740879d7e71' },
      success:resolve,
      fail:reject
    })
  })
}

module.exports = {
  API_URL: API_URL,
  API_URL2: API_URL2,
  API_UM: API_UM,
  NOWDATE: NOWDATE,
  find(type, params) {
    return fetchApi(type, params, null)
      .then(res => res.data)
  }, 
  findLive(type, params) {
    return fetchApi(type, params, true)
      .then(res => res.data)
  },
  findOne (id) {
    return fetchApi('subject/' + id)
      .then(res => res.data)
  },
  findUM (params) {
    return fetchApiUM(params)
      .then(res => res.data)
  },
  getNowFormatDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
      strHours = "0" + strHours;
    }
    if (strMin >= 0 && strMin <= 9) {
      strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
      strSec = "0" + strSec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + "T" + strHours + seperator2 + strMin
      + seperator2 + strSec;
    return currentdate;
  },
  get2weekbefore(ddd) {
    var date = new Date(ddd - 2*7*24*3600*1000);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
      strHours = "0" + strHours;
    }
    if (strMin >= 0 && strMin <= 9) {
      strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
      strSec = "0" + strSec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + "T" + strHours + seperator2 + strMin
      + seperator2 + strSec;
    return currentdate;
  }
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var strHours = date.getHours();
  var strMin = date.getMinutes();
  var strSec = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strHours >= 0 && strHours <= 9) {
    strHours = "0" + strHours;
  }
  if (strMin >= 0 && strMin <= 9) {
    strMin = "0" + strMin;
  }
  if (strSec >= 0 && strSec <= 9) {
    strSec = "0" + strSec;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + "T" + strHours + seperator2 +strMin
    + seperator2 + strSec;
  return currentdate;
}