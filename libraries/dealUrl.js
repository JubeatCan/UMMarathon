const newsdata = require('newsdata.js');

module.exports = {
  getUrlTypeId(option) {
        let url = option.currentTarget.dataset.id;//注意这里是小写
        return '?keyword="' + url + '"';
    },
    getUrlEvents(option){
      let url = option.currentTarget.dataset.id;
      return '?item_id='+ url;
    }
}