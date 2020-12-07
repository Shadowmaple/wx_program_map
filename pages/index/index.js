// 微信小程序查看附近的餐厅

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
  width: 40,
  height: 40,
}

Page({
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    mapw: '100%',
    maph: '0',
    scale: '16',
    markers: [centerMarker],
  },
  mapCtx: null,
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: key
    })
    this.mapCtx = wx.createMapContext('map', this)
    wx.getSystemInfo({
      success: res => {
        var mapw = res.windowWidth
        var maph = res.windowHeight
        console.log(maph)
        this.setData({
          maph: maph + 'px',
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
      page_size: 20,
      success: res => {
        console.log('search from map successfully', res);
        var marks = []
        for (let i in res.data) {
          marks.push({
            iconPath: '../../images/restaurant.png',
            id: Number(i + 1),
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            width: 30,
            height: 30,
          })
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
    })
  },
  bindControlTap: function (e) {
    console.log("move to center")
    this.mapCtx.moveToLocation()
  },
  bindReginChange: function (e) {
    console.log("e")
    if (e.type == 'end') {
      this.mapCtx.getCenterLocation({
        success: res => {
          this.getFood(res.longitude, res.latitude)
        }
      })
    }
  },
})