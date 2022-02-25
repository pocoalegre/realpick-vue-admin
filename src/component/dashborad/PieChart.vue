<template>
  <div id="pie-chart"></div>
</template>

<script>
export default {
  name: "PieChart",
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
      data: []
    }
  },
  methods: {
    dataInit(){
      const that = this
      axios({
        method: 'get',
        url: '/order/salesFiveCount',
        headers: {
          token: this.$cookie.get("adminToken")
        }
      }).then(res => {
        if (res.data.code === 10000) {
          that.data = res.data.data
        } else if (res.data.code === 10001) {
          that.$message.error(res.data.msg)
        }
      })
    },
    draw() {
      let myChart = this.$echarts.init(document.getElementById('pie-chart'));
      myChart.setOption({
        title: {
          text: '2021年类型销售前五展示',
        },
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [30, 200],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.data
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
#pie-chart {
  height: 650px;
  width: 600px;
  margin-right: 50px;
  margin-bottom: 20px;
}
</style>