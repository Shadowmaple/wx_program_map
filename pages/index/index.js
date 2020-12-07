// 微信小程序查看附近的餐厅
//index.js
//获取应用实例
// const app = getApp()

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
// QQMap key
var key = ''

var centerMarker = {
  iconPath: '../../images/map.png',
  id: 0,
  latitude: 23.096994,
  longitude: 113.324520,
  width: 30,
  height: 50,
}

var foodMarker = {
  iconPath: '../../images/restaurant.png',
  id: 0,
  latitude: 23.096994,
  longitude: 113.324520,
}

Page({
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    mapw: '100%',
    maph: '0',
    scale: '16',
    markers: [centerMarker],
    // markers: [{
    //   iconPath: '../../images/map.png',
    //   id: 0,
    //   latitude: 23.096994,
    //   longitude: 113.324520,   
    // }]
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: key
    })
    wx.getSystemInfo({
      success: res => {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        var mapw = res.windowWidth
        var maph = res.windowHeight
        this.setData({
          maph: maph + 'px'
        })
      }
    })
  },
  onReady: function () {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
        this.getFood(res.longitude, res.latitude)
      }
    })
  },
  getFood: function (longitude, latitude) {
    qqmapsdk.search({
      keyword: '餐厅',
      location: {
        longitude: longitude,
        latitude: latitude,
      },    
      success: res => {
        console.log('search from map successfully', res);
        var marks = []
        for (let i in res.data) {
          foodMarker.id = i + 1
          foodMarker.longitude = res.data[i].location.lng,
            foodMarker.latitude = res.data[i].location.lat,
            marks.push(foodMarker)
        }
        centerMarker.longitude = longitude
        centerMarker.latitude = latitude
        marks.push(centerMarker)

        this.setData({
          markers: marks,
        })
      },
      fail: function (res) {
        console.log(res);
      },
      // complete: function (res) {
      //   console.log('complete', res);
      // }
    })
  },
  onShow: function () {
    // 调用接口
    // qqmapsdk.search({})
  },
})

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })