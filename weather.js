// 绑定 log 函数，方便使用
const log = console.log.bind(console)

// 封装装备 ajax
const ajax = function(request) {
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {

    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

// 基于准备好的 dom，初始化 echarts 实例
let element = document.querySelector('#main')
let myChart = echarts.init(element)

const optionData = (city, day, weatherMax, weatherMin, location) => {
    option = {
        title: {
            text: '未来三天气温变化',
            subtext: `${city}`
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: day
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                name:'最高气温',
                type:'line',
                data:weatherMax,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                data:weatherMin,
                markPoint: {
                    data: [
                        {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                normal: {
                                    position: 'start',
                                    formatter: '最大值'
                                }
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    };

    return option
}

const optionMake = (weathers, city) => {
    let valueOfHeweather = weathers['HeWeather6']
    log('textvalueOfHeweather=', valueOfHeweather)
    let valueOfArray = valueOfHeweather[0]
    let dailyForecast = valueOfArray['daily_forecast']
    let day = []
    let weatherMax = []
    let weatherMin = []
    for (let n of dailyForecast) {
        day.push(n['date'])
        weatherMax.push(n['tmp_max'])
        weatherMin.push(n['tmp_min'])
    }
    let option = optionData(city, day, weatherMax, weatherMin)
    log('test option=', option)
    return option
}

// 主要函数
const apiOption = function(city) {
    let request = {
        method: 'GET',
        url:`https://free-api.heweather.com/s6/weather/forecast?location=${city}&key=35d2020e229d4e3ea03e7b18b6cf1004`,
        contentType: 'application/json',
        callback: function(response) {
            log('响应')
            let weathers = JSON.parse(response)
            // 指定图表的配置项和数据
            let option = optionMake(weathers, city)
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    }
    ajax(request)
}

const getCity = () => {
    let input = document.querySelector('.city')
    let city = input.value
    log(city)
    return city
}

const removeMap = () => {
    let map = document.querySelector('#map')
    map.remove()
}

// 主要函数
const bindEventButton = () => {
    let button = document.querySelector('#check')
    button.addEventListener('click', function(event) {
        // 1.点击按钮，移除地图
        removeMap()
        // 2.得到城市信息和相应的天气数据
        // 用 Echarts 表现出来
        let city = getCity()
        apiOption(city)

    })
}

bindEventButton()