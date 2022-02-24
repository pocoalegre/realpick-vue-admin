<template>
  <div id="pie-chart"></div>
</template>

<script>
export default {
  name: "PieChart",
  mounted() {
    this.draw()
  },
  data() {
    return {
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' }
      ]
    }
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(document.getElementById('pie-chart'));
      myChart.setOption({
        title: {
          text: '2021年类型销售前五展示',
        },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            restore: { show: true },
          }
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