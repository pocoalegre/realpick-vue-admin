<template>
  <div id="sales-histogram"></div>
</template>

<script>
export default {
  name: "SalesHistogram",
  created() {
    this.dataInit()
  },
  mounted() {
    const that = this
    setTimeout(function () {
      that.draw()
    }, 200)
  },
  data() {
    return {
      dataAxis: [],
      data: [],
      yMax: 500,
      dataShadow: [],
    }
  },
  methods: {
    dataInit(){
      const that = this
      axios({
        method: 'get',
        url: '/dashborad/monthSalesCount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.dataAxis = res.data.data[0]
          that.data = res.data.data[1]
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    draw() {
      let myChart = this.$echarts.init(document.getElementById('sales-histogram'));
      for (let i = 0; i < this.data.length; i++) {
        this.dataShadow.push(this.yMax);
      }
      myChart.setOption({
        title: {
          text: '2021年月度销量展示',
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            inside: true,
            color: '#fff'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            type: 'bar',
            showBackground: true,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#83bff6'},
                {offset: 0.5, color: '#188df0'},
                {offset: 1, color: '#188df0'}
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#2378f7'},
                  {offset: 0.7, color: '#2378f7'},
                  {offset: 1, color: '#83bff6'}
                ])
              }
            },
            data: this.data,
          }
        ]
      })
      let zoomSize = 6;
      const that = this
      myChart.on('click', function (params) {
        myChart.dispatchAction({
          type: 'dataZoom',
          startValue: that.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
              that.dataAxis[Math.min(params.dataIndex + zoomSize / 2, that.data.length - 1)]
        });
      });
    },
  }
}
</script>

<style scoped>
#sales-histogram {
  height: 600px;
  width: 900px;
  margin-top: 30px;
  margin-left: 30px;
  margin-bottom: 20px;
}
</style>