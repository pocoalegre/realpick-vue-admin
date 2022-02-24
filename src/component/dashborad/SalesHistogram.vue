<template>
  <div id="sales-histogram"></div>
</template>

<script>
export default {
  name: "SalesHistogram",
  mounted() {
    this.draw()
  },
  data() {
    return {
      dataAxis: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 330, 310],
      yMax: 500,
      dataShadow: [],
    }
  },
  methods: {
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
              ])
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
            data: this.data
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