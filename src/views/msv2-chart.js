import * as d3 from 'd3';
//dataset1
import originData from './data/dataset1/28_all28_diffChart_100.json';
import metrixOriginData from './data/dataset1/28_all28_oriGraph_100.json';
import metrixDiffData from './data/dataset1/28_all28_diffGraph_100.json';
import highMatrix from './data/dataset1/28_all28_high_m_100.json'
//dataset2
// import originData from './data/dataset2/diffChart_5.json';
// import metrixOriginData from './data/dataset2/oriGraph_5.json';
// import metrixDiffData from './data/dataset2/diffGraph_5.json';
// import highMatrix from './data/dataset2/high_m_5.json'
//dataset3
// import originData from './data/dataset3/diffChart_day.json';
// import metrixOriginData from './data/dataset3/oriGraph_day.json';
// import metrixDiffData from './data/dataset3/diffGraph_day.json';
// import highMatrix from './data/dataset3/high_m_day.json'

import {updateUnfoldDay,updateNodeOrder, updateUnfoldDiff } from '../store/actions';
import * as reorder from 'reorder.js';

class chart {
    // 画布的宽高
    width = 0;
    height = 0;
    // 外边距
    margin = {
        top: 10,
        left: 30,
        bottom: 20,
        right: 10
    };

    svg = null;
    // tooltip
    tooltip = null;
    topK = 10;
    // 比例尺
    // x = d3.scaleUtc()
    x = d3.scaleLinear()
    y = d3.scaleLinear()
    color = d3.scaleLinear()
    xAxis = null;
    yAxis = null;
    scaleUnit = d3.scaleLinear() //单元大小

    //阈值
    degreeThreshold = 0
        //线生成器
    line = d3.line()
        .defined(d => !isNaN(d.sum))
        .x(d => this.x(d.date))
        .y(d => this.y(d.sum));
    //刷选初始化
    brush = d3.brushX();
    //时间转换器
    parseDate = d3.timeParse('%Y-%m-%d');
    //msv

    //dataset
    dataset = 1

        //dataset1
            nodes = ['801010','801020','801030','801040','801050','801080','801110','801120','801130','801140','801150','801160',
        '801170','801180','801200','801210','801230','801710','801720','801730','801740','801750','801760','801770','801780','801790'
        ,'801880','801890'];

        node_index = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
        originNodeIndex =  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
    industry_index = {'801010':'农林牧渔','801020':'采掘','801030':'化工','801040':'钢铁','801050':'有色金属','801080':'电子',
                       '801110':'家用电器','801120':'食品饮料','801130':'纺织服装','801140':'轻工制造','801150':'医药生物','801160':'公共事业',
                        '801170':'交通运输','801180':'房地产' ,'801200':'商业贸易','801210':'休闲服务','801230':'综合','801710':'建筑材料',
                        '801720':'建筑装饰','801730':'电气设备','801740':'国防军工','801750':'计算机','801760':'传媒','801770':'通信',
                        '801780':'银行','801790':'非银金融','801880':'汽车','801890':'机械设备'}
    industry_index2 = {'801010':'Ag','801020':'Mi','801030':'Ch','801040':'FM','801050':'NM','801080':'El',
                       '801110':'HA','801120':'FB','801130':'TA','801140':'LM','801150':'HC','801160':'Ut',
                        '801170':'Tr','801180':'RE' ,'801200':'Co','801210':'LS','801230':'Cl','801710':'CM',
                        '801720':'CD','801730':'EE','801740':'De','801750':'Cp','801760':'Me','801770':'Te',
                        '801780':'Ba','801790':'Fi','801880':'Car','801890':'ME'}

    industry_index3 = {'801010':'Agriculture','801020':'Mining','801030':'Chemicals','801040':'Ferrous Metal','801050':'Nonferrous Metal','801080':'Electronics',
                       '801110':'Household Appliances','801120':'Food & Beverage','801130':'Textile & Apparel','801140':'Light-industry Manufacturing','801150':'Health Care','801160':'Utilities',
                        '801170':'Transportation','801180':'Real Estate' ,'801200':'Commerce','801210':'Leisure Service','801230':'Conglomerate','801710':'Construction Materials',
                        '801720':'Construction Decoration','801730':'Electrical Equipment','801740':'Defense','801750':'Computer','801760':'Media','801770':'Telecommunication',
                        '801780':'Bank','801790':'Financials','801880':'Car','801890':'Machinery Equipment'}

    // //dataset2
    // nodes = ["600", "601", "602", "603", "605", "606", "607", "609", "610", "611", "612", "613", "614", "615", "616", "617", "618", "619", "620", "621", "622", "623", "624", "626", "627", "628", "629", "633", "634", "635", "636", "638", "641", "643", "644", "646", "647", "648", "649", "650", "651", "652", "654", "655", "656", "658", "660", "661", "662", "663", "664", "665", "666", "667", "668", "669", "674", "676", "677", "678", "681", "682", "683", "684", "685", "686", "687", "689", "690", "691", "692", "694", "695", "696", "698", "699", "802", "803", "804", "806", "807", "809", "810", "812", "813", "814", "815", "817", "819", "821", "822", "823", "824", "825", "826", "827", "828", "829", "830", "831", "832", "833", "834", "836", "838", "841", "843", "845", "847", "848", "849", "851", "852", "853", "854", "855", "856", "857", "858", "860", "862", "863", "864", "865", "866", "867", "868", "869", "871", "873", "875", "880", "881", "882", "883", "884", "886", "887", "888", "889", "890", "891", "892", "893", "894", "895", "896", "897", "898", "1108", "1144", "1148", "1164", "1170", "1181", "1190", "1492", "1601", "1613", "1618", "1622", "1628", "1629", "1632", "1644", "1645", "1649", "1651", "1657", "1658", "1660", "1662", "1667", "1671", "1672", "1674", "1678", "1679", "1686", "1856"];
    // node_index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179];
    // originNodeIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179];
    // industry_index = { "600": "600", "601": "601", "602": "602", "603": "603", "605": "605", "606": "606", "607": "607", "609": "609", "610": "610", "611": "611", "612": "612", "613": "613", "614": "614", "615": "615", "616": "616", "617": "617", "618": "618", "619": "619", "620": "620", "621": "621", "622": "622", "623": "623", "624": "624", "626": "626", "627": "627", "628": "628", "629": "629", "633": "633", "634": "634", "635": "635", "636": "636", "638": "638", "641": "641", "643": "643", "644": "644", "646": "646", "647": "647", "648": "648", "649": "649", "650": "650", "651": "651", "652": "652", "654": "654", "655": "655", "656": "656", "658": "658", "660": "660", "661": "661", "662": "662", "663": "663", "664": "664", "665": "665", "666": "666", "667": "667", "668": "668", "669": "669", "674": "674", "676": "676", "677": "677", "678": "678", "681": "681", "682": "682", "683": "683", "684": "684", "685": "685", "686": "686", "687": "687", "689": "689", "690": "690", "691": "691", "692": "692", "694": "694", "695": "695", "696": "696", "698": "698", "699": "699", "802": "802", "803": "803", "804": "804", "806": "806", "807": "807", "809": "809", "810": "810", "812": "812", "813": "813", "814": "814", "815": "815", "817": "817", "819": "819", "821": "821", "822": "822", "823": "823", "824": "824", "825": "825", "826": "826", "827": "827", "828": "828", "829": "829", "830": "830", "831": "831", "832": "832", "833": "833", "834": "834", "836": "836", "838": "838", "841": "841", "843": "843", "845": "845", "847": "847", "848": "848", "849": "849", "851": "851", "852": "852", "853": "853", "854": "854", "855": "855", "856": "856", "857": "857", "858": "858", "860": "860", "862": "862", "863": "863", "864": "864", "865": "865", "866": "866", "867": "867", "868": "868", "869": "869", "871": "871", "873": "873", "875": "875", "880": "880", "881": "881", "882": "882", "883": "883", "884": "884", "886": "886", "887": "887", "888": "888", "889": "889", "890": "890", "891": "891", "892": "892", "893": "893", "894": "894", "895": "895", "896": "896", "897": "897", "898": "898", "1108": "1108", "1144": "1144", "1148": "1148", "1164": "1164", "1170": "1170", "1181": "1181", "1190": "1190", "1492": "1492", "1601": "1601", "1613": "1613", "1618": "1618", "1622": "1622", "1628": "1628", "1629": "1629", "1632": "1632", "1644": "1644", "1645": "1645", "1649": "1649", "1651": "1651", "1657": "1657", "1658": "1658", "1660": "1660", "1662": "1662", "1667": "1667", "1671": "1671", "1672": "1672", "1674": "1674", "1678": "1678", "1679": "1679", "1686": "1686", "1856": "1856" };

    // //dataset3
    // nodes = ["benettonrugby", "cardiff_blues", "connachtrugby", "dragonsrugby", "edinburghrugby", "glasgowwarriors", "leinsterrugby", "munsterrugby", "ospreys", "scarlets_rugby", "ulsterrugby", "zebrerugby"];

    //   
    // node_index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];  
    // originNodeIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    // industry_index = { "benettonrugby": "be", "cardiff_blues": "ca", "connachtrugby": "co", "dragonsrugby": "dr", "edinburghrugby": "ed", "glasgowwarriors": "gl", "leinsterrugby": "le", "munsterrugby": "mu", "ospreys": "os", "scarlets_rugby": "sc", "ulsterrugby": "ul", "zebrerugby": "ze" }

    //配置
    index_scale = d3.scaleOrdinal()
    invert_index = d3.scaleOrdinal()
    edges = [];
    dayEdgeCount = {}; //每日边数，全联通的话边数相同；
    days = []; //全部日期集合
    unfoldDay = []; //展开的日期
    dayLocation = []; //每天在视图中呈现的位置；
    metrixUnit = 500; //每个矩阵的宽度占位
    unit = 0;

    slice_start = 2200;
    slice_end = 2210;


    nodelen = 0;
    brushWidth = 0;
    staTheight = 0;
    staNwidth = 0


    // 初始化
    init(container, timeSpan, nodeOrder, dispatch) {
        // this.node_index = nodeOrder;
        this.index_scale.domain(this.nodes).range(this.node_index)
        this.invert_index.domain(this.node_index).range(this.nodes)
        this.nodelen = this.nodes.length

        //长宽获取
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        //比例尺赋值
        // this.x.domain(d3.extent(data, d => d.date))
        //     .range([this.margin.left,this.width - this.margin.right])
        this.x.domain([0, this.edges.length])
            .range([this.margin.left, this.width - this.margin.right])
            //Y轴映射
        this.y.domain([-0.5 - (this.nodelen * 0.15), this.nodelen - 0.5])
            .range([this.margin.top, this.height - this.margin.bottom])
            // let min = d3.min(this.edges, d => d.value)
            // let max = d3.max(this.edges, d => d.value)
            // let extremum = Math.max(Math.abs(max),Math.abs(min))
            // this.color.domain([-extremum*0.9,0,extremum  ])
            //     .range([ '#d8b365','#f5f5f5', '#5ab4ac']);


        this.nodelen = this.nodes.length
        this.staTheight = this.y(-1) - this.y(-0.5 - this.nodelen * 0.1) //辅助视图宽度
        this.staNwidth = this.staTheight * 2

        // //坐标轴赋值
        this.yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.y).ticks(this.nodes.length))
            .call(g => g.select(".domain").remove())
        this.xAxis = g => g
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())


        //svg创建
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        //legend
        this.drawColorLegendOuter()

    }

    // 更新数据，重绘视图
    update(timeSpan, unfoldDay, unfoldDiff, nodeOrder, focusSpan, needOrder, threshold, maxmapping, orderweight, unfoldSwitch, msvSwitch, kelpSwitch, colorSwitch, dispatch) {
            nodeOrder.forEach((item, i) => {
                    this.node_index[item] = i
                })
                // this.node_index = nodeOrder;
            this.index_scale = d3.scaleOrdinal().domain(this.nodes).range(this.node_index)
            this.invert_index = d3.scaleOrdinal().domain(this.node_index).range(this.nodes)
            this.degreeThreshold = (this.nodes.length - 2) * threshold * 0.01
            let originInvertIndex = d3.scaleOrdinal().domain(this.originNodeIndex).range(this.nodes)
            let nodelen = this.nodes.length
            let maxmap = maxmapping * 0.01

            //删除原有svg
            d3.selectAll('rect.edge').remove();
            d3.selectAll('rect.small').remove();
            d3.selectAll('rect.metrix').remove();
            d3.selectAll('circle.start').remove();
            d3.selectAll('circle.end').remove();
            d3.selectAll('circle.light').remove();
            d3.selectAll('g.industry').remove();
            d3.selectAll('g.high-level').remove();
            d3.selectAll('.MSV').remove();
            d3.selectAll('g.matrix').remove();
            d3.selectAll('circle.origin').remove();
            d3.selectAll('.stream').remove();
            d3.selectAll('.kelp').remove();
            d3.selectAll('.matrix').remove();
            d3.selectAll('.staT').remove();
            d3.selectAll('.staN').remove();
            d3.selectAll('.brush').remove();
            d3.selectAll('.industry').remove();
            d3.selectAll('.timelabel').remove();


 

            //数据
            let data = JSON.parse(JSON.stringify(originData));
            let mdata = JSON.parse(JSON.stringify(metrixOriginData));
            let diffdata = JSON.parse(JSON.stringify(metrixDiffData));
            let hdata = JSON.parse(JSON.stringify(highMatrix));

            if (timeSpan[0] !== 'start') {
                this.slice_start = timeSpan[0]
                this.slice_end = timeSpan[1]
            }
            data = data.slice(this.slice_start, this.slice_end)
            hdata = hdata.slice(this.slice_start, this.slice_end)
            let highData = data //顶层数据
            let newData = {}
            this.days = []
            this.dayEdgeCount = {}
            let all_edges_count = 0
                //生成node info
            let node_info = {}
            this.nodes.forEach((node) => {
                //为每个node生成一个对象
                node_info[node] = {
                    'id': node,
                    'total_degree': 0,
                    'total_posdegree': 0,
                    'total_negdegree': 0,
                    'total_pos_value': 0,
                    'total_neg_value': 0,
                    'max_value': 0,
                    "min_value": 0,
                    'max_posdegree': 0,
                    "max_negdegree": 0,
                    'posdistribution': [],
                    "negdistribution": [],
                    "posfrequency": new Array(nodelen).fill(0),
                    "negfrequency": new Array(nodelen).fill(0),
                    "maxStrength2": 0,
                }
            })

            // let posfrequency = new Array(nodelen).fill(0)
            // let negfrequency = new Array(nodelen).fill(0)

            data.forEach(element => {
                let newLink = [];
                element.nodes.forEach((node) => {
                    //修改nodeinfo
                    node_info[node.id] = {
                        ...node_info[node.id],
                        'total_degree': node_info[node.id]['total_degree'] + node.degree,
                        'total_posdegree': node_info[node.id]['total_posdegree'] + node.posdegree,
                        'total_negdegree': node_info[node.id]['total_negdegree'] + node.negdegree,
                        'total_pos_value': node_info[node.id]['total_pos_value'] + node.posvalue,
                        'total_neg_value': node_info[node.id]['total_neg_value'] + node.negvalue,
                        'max_value': Math.max(node_info[node.id]['max_value'], node.posvalue),
                        "min_value": Math.min(node_info[node.id]['min_value'], node.negvalue),
                        'max_posdegree': Math.max(node_info[node.id]['max_posdegree'], node.posdegree),
                        "max_negdegree": Math.max(node_info[node.id]['max_negdegree'], node.negdegree),
                        'posdistribution': [...node_info[node.id]['posdistribution'], node.posdegree],
                        "negdistribution": [...node_info[node.id]['negdistribution'], node.negdegree],
                        "maxStrength2": Math.max(node_info[node.id]['maxStrength2'], node.strength2),
                    }
                    if (node.posdegree !== 0) {
                        node_info[node.id]['posfrequency'][node.posdegree] = node_info[node.id]['posfrequency'][node.posdegree] + 1;
                    }
                    if (node.negdegree !== 0) {
                        node_info[node.id]['negfrequency'][node.negdegree] = node_info[node.id]['negfrequency'][node.negdegree] + 1;
                    }

                })
                this.days.push(element.date)
            });

            //重新排序节点
            if (needOrder) {
                //矩阵转化
                let MatrixSet = []
                unfoldDay.forEach((item) => {
                        if (unfoldDiff.includes(item)) {
                            let matrix = diffdata.filter(({ date }) => date === item)[0].cell
                            MatrixSet.push(matrix)
                        } else {
                            let matrix = mdata.filter(({ date }) => date === item)[0].cell
                            MatrixSet.push(matrix)
                        }
                    })
                    //排序并修改顺序
                let WeightedOrder = this.reorder4Weight(hdata, nodelen, MatrixSet, orderweight)
                dispatch(updateNodeOrder(WeightedOrder))
            }


            //重新计算边位置

            //重新计算location
            //计算让矩阵方形的宽度
            let y = this.y

            let staTheight = y(-1) - y(-0.5 - nodelen * 0.15) //辅助视图宽度
            let staNwidth = staTheight

            let unit = ((this.width - this.margin.left - this.margin.right - staNwidth) - (unfoldDay.length * (y(nodelen) - y(0)))) / this.days.length
            let matrix_width = ((y(nodelen) - y(0)) / unit)
            this.dayLocation = []
            let location = {}
            let count = 0;
            this.days.forEach(day => {
                if (unfoldDay.includes(day)) {
                    this.dayLocation.push({
                        date: day,
                        location: count,
                    });
                    location[day] = count;
                    count = count + matrix_width + 1;
                } else {
                    this.dayLocation.push({
                        date: day,
                        location: count,
                        // edges:newData[day]
                    });
                    location[day] = count;
                    count = count + 1;
                }
            })



            //修改比例尺
            let degreeThreshold = this.degreeThreshold
            let max = Math.max(...Object.values(node_info).map(item => item.max_value))
            let min = Math.min(...Object.values(node_info).map(item => item.min_value))
            let weightmax = Math.max(...Object.values(node_info).map(item => item.maxStrength2))
            let weightThreshold = threshold * 0.01 * weightmax
            let color = d3.scaleLinear().domain([min, 0.3 * min, 0, max * 0.3, max])
                .range(['#5389c0', '#82a9d1', 'white', '#E09585', '#d2664f']);  
            let posgray = "#f5dcd6",
                   neggray = "#d4e2ef";   // #dfebec #f5dcd6
              
            let posrect = " #E09585",
                negrect = "#82a9d1";   // #B1CDD0 #E09585 #6b9ac9 #b6cde4       #82a9d1 #d4e2ef   #e3edee  #99bec2 #c9dcde
            let index_scale = this.index_scale;
            let length = nodelen;
            let T = this.days.length
                //绘制High level

            let highScale = d3.scaleLinear().domain([0, count]).range([this.margin.left + staNwidth, this.width - this.margin.right]);
            let nodeScale = d3.scaleLinear().domain([0, maxmap * length - 1]).range([0, (y(1) - y(0)) / 2])

            let mcolor = d3.scaleLinear()
            if (this.dataset === 1) {
                //dataset1 #3e403f #2e4c6d #fed9a6
                mcolor.domain([0.5, 1]).range(['white', '#3e403f'])
            } else if (this.dataset === 3) {

                //dataset3
                mcolor.domain([0, 10]).range(['white', '#3e403f'])
            }


            //绘制视图
            //绘制辅助线条纹背景
            let nodeline = new Array(this.nodes.length).fill(0).map((d, i) => i).filter(d => d % 2 === 0)
            this.svg.selectAll('reck.nodeline')
                .data(nodeline)
                .join('rect')
                .classed('nodeline', true)
                .attr('x', this.margin.left + staNwidth)
                .attr('y', (d, i) => this.y(d - 0.5))
                .attr('width', this.width - this.margin.right - this.margin.left - staNwidth)
                .attr('height', this.y(1) - this.y(0))
                .attr('fill', '#f1f3f5')
            this.svg.selectAll('reck.nodeline0')
                .data(nodeline)
                .join('rect')
                .classed('nodeline0', true)
                .attr('x', 0)
                .attr('y', (d, i) => this.y(d - 0.5))
                .attr('width', staNwidth)
                .attr('height', this.y(1) - this.y(0))
                .attr('fill', '#f1f3f5')
            this.svg.selectAll('reck.nodeline1')
                .data(nodeline)
                .join('rect')
                .classed('nodeline1', true)
                .attr('x', staNwidth+3)
                .attr('y', (d, i) => this.y(d - 0.5))
                .attr('width', this.margin.left-6)
                .attr('height', this.y(1) - this.y(0))
                .attr('fill', '#f1f3f5')

           //y轴 标签
            if (this.dataset === 1) {
                let industry = this.industry_index2
                this.svg.append('g').attr('class', 'industry')
                    .selectAll("text.industry")
                    .data(this.node_index)
                    .join("text").classed('industry',true)
                    .attr('y', (d, i) => (this.y(d+0.2)))
                    .attr('x', staNwidth + 5 )
                    .text((d,i)=> industry[originInvertIndex(i)])
                    // .text((d, i) => originInvertIndex(i))
                    .attr('font-size', 12)
            } else if (this.dataset === 3) {
                let industry = this.industry_index
                this.svg.append('g').attr('class', 'industry')
                    .selectAll("text.industry")
                    .data(this.node_index)
                    .join("text").classed('industry',true)
                    .attr('y', (d, i) => (this.y(d)))
                    .attr('x', staNwidth + 5)
                    .text((d, i) => industry[originInvertIndex(i)])
                    // .text((d,i)=> originInvertIndex(i))
                    .attr('font-size', 15)
            }
                //绘制时间
            let timelabels = [0, parseInt(T * 0.2), parseInt(T * 0.4), parseInt(T * 0.6), parseInt(T * 0.8)]
            this.svg.selectAll('text.timelabel').data(timelabels)
                .join('text').classed('timelabel', true)
                .attr('y', (d, i) => (this.y(-0.9)))
                .attr('x', d => {
                    return highScale(location[this.days[d]])
                })
                .text((d, i) => this.days[d])
                .attr('font-size', 13)

            //绘制辅助视图
            //横向直方图
            let staTscale = d3.scaleLinear().domain([maxmap * maxmap * nodelen * (nodelen - 1) / 2, 0]).range([y(-0.5 - nodelen * 0.15), y(-1.5)])
            this.svg.append('rect')
                        .classed('staT', true)
                        .attr('x', highScale(0))
                        .attr('y', y(-0.5 - nodelen * 0.15))
                        .attr('width', (highScale(count) - highScale(0)))
                        .attr('height', y(-1.5)-y(-0.5 - nodelen * 0.15))
                        .attr('fill', '#f1f3f5')
            this.svg.selectAll('g.staT')
                .data(highData)
                .join('g').classed('staT', true)
                .each(function(ddd, index) {

                    let day_index = location[ddd.date]
                        //背景表示稀疏程度
                    // d3.select(this).append('rect')
                    //     .classed('staT', true)
                    //     .attr('x', highScale(day_index))
                    //     .attr('y', staTscale(ddd.originEdge))
                    //     .attr('width', (highScale(1) - highScale(0)))
                    //     .attr('height', staTscale(0) - staTscale(ddd.originEdge))
                    //     .attr('fill', '#f1f3f5')
                        //正边数量
                    d3.select(this).append('rect')
                        .classed('staT', true)
                        .attr('x', highScale(day_index))
                        .attr('y', staTscale(ddd.totalPosEdge+ddd.totalNegEdge))
                        .attr('width', (highScale(1) - highScale(0)))
                        .attr('height', staTscale(0) - staTscale(ddd.totalPosEdge))
                        .attr('fill', posrect)
                        //负边数量
                    d3.select(this).append('rect')
                        .classed('staT', true)
                        .attr('x', highScale(day_index))
                        .attr('y', staTscale(ddd.totalNegEdge))
                        .attr('width', (highScale(1) - highScale(0)))
                        .attr('height', staTscale(0) - staTscale(ddd.totalNegEdge))
                        .attr('fill', negrect)
                })
                //分布图
            let staNscale1 = d3.scaleLinear().domain([0, (nodelen - 1)]).range([staNwidth * 0.5, staNwidth * 0.9])
            let staNscale2 = d3.scaleLinear().domain([(nodelen - 1), 0]).range([staNwidth * 0.1, staNwidth * 0.5])
            let staNdata = Object.values(node_info)
            let maxFre = 0
            staNdata.forEach(item => {
                maxFre = Math.max(maxFre, Math.max(...item.negfrequency), Math.max(...item.posfrequency))
            })
            this.svg.selectAll('g.staN')
                .data(staNdata)
                .join('g').classed('staN', true)
                .each(function(ddd, index) {
                    let localY = d3.scaleLinear().domain([0, maxFre]).range([y(index_scale(ddd.id) + 0.4), y(index_scale(ddd.id) - 0.7)])

                    // A area generator, for the dark stroke.
                    let area1 = d3.area()
                        .x(function(d, i) { return staNscale1(i); })
                        .y1(function(d, i) { return localY(d); })
                        .y0(localY(0))
                        .curve(d3.curveBasis)
                    let area2 = d3.area()
                        .x(function(d, i) { return staNscale2(i); })
                        .y1(function(d) { return localY(d); })
                        .y0(localY(0))
                        .curve(d3.curveBasis)

                    // Plot the area
                    d3.select(this).append("path")
                        .attr("class", "mypath")
                        .datum(ddd.posfrequency)
                        .attr("fill", posrect)
                        .attr("opacity", "1")
                        .attr("stroke-linejoin", "round")
                        .attr("d", area1)
                    d3.select(this).append("path")
                        .attr("class", "mypath")
                        .datum(ddd.negfrequency)
                        .attr("fill", negrect)
                        .attr("opacity", "1")
                        .attr("stroke-linejoin", "round")
                        .attr("d", area2)
                })


            //绘制kelp diagram
            let Vgap = y(1) - y(0),
                Hgap = highScale(1) - highScale(0);
            if (kelpSwitch) {
                let posline = [];
                let negline = [];
                let negPath = [];
                let posPath = [];
                if (colorSwitch) {
                    let kelpCenterData = highData.filter((item, index) => {
                        return item.nodes.filter(({ strength2 }) => strength2 > weightThreshold).length > 0;
                    })
                    kelpCenterData.forEach((item, index) => {
                            let set = item.nodes.filter(({ strength2 }) => strength2 > weightThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let posbridgeSet = set.filter((node) => node.type2 === "pos").sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            let bridgeSet = set.filter((node) => node.type2 === 'neg').sort((a, b) => index_scale(a.id) - index_scale(b.id));

                            //绘制posbridge
                            let posbridgeLen = posbridgeSet.length;
                            if (posbridgeLen > 0) {
                                // if(!msvSwitch){
                                posbridgeSet.forEach((node, i) => {
                                    posPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+0.9)},${y(index_scale(node.id)-0.4)} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date])},${y(index_scale(node.id)-0.4)} v${Vgap*0.8} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+0.9)},${y(index_scale(node.id)+0.4)} z`
                                    })
                                })
                                posPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date])},${y(index_scale(posbridgeSet[0].id))} h${Hgap*0.2} L ${highScale(location[item.date]+0.2)},${y(index_scale(posbridgeSet[posbridgeLen-1].id))} h${-Hgap*0.2} z`
                                    })
                                    // }

                            }

                            //绘制bridge
                            let bridgeLen = bridgeSet.length;
                            if (bridgeLen > 0) {
                                // if(!msvSwitch){
                                bridgeSet.forEach((node, i) => {
                                    negPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+1)},${y(index_scale(node.id)-0.4)} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+0.1)},${y(index_scale(node.id)-0.4)} v${Vgap*0.8} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+1)},${y(index_scale(node.id)+0.4)} z`
                                    })
                                })
                                negPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+0.8)},${y(index_scale(bridgeSet[0].id))} h${Hgap*0.2} L ${highScale(location[item.date]+1)},${y(index_scale(bridgeSet[bridgeLen-1].id))} h${-Hgap*0.2} z`
                                    })
                                    // }

                            }
                        })
                        //计算两天之间的连接
                    for (let i = 0; i < kelpCenterData.length - 1; i++) {
                        let distance = (location[kelpCenterData[i + 1].date] - location[kelpCenterData[i].date])
                        if (distance > 0 && distance < 10) {
                            let set1 = kelpCenterData[i].nodes.filter(({ strength2 }) => strength2 > weightThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let set2 = kelpCenterData[i + 1].nodes.filter(({ strength2 }) => strength2 > weightThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let posNodes1 = set1.filter((node) => node.type2 === 'pos') //左边绿的
                            let negNodes1 = set1.filter((node) => node.type2 === 'neg') //左边红的
                            let posNodes2 = set2.filter((node) => node.type2 === 'pos') //右边绿的
                            let negNodes2 = set2.filter((node) => node.type2 === 'neg') //右边红的


                            let ifOverlap = false //是否有重叠
                            let posEdge = [],
                                negEdge = []; //红边绿边
                            set1.forEach((a) => {
                                    let set2Has = set2.forEach((b) => {
                                        let Has = a.id === b.id;
                                        if (Has) { //如果重叠了
                                            ifOverlap = true;
                                            let active1 = a.type2 === 'pos' ? true : false;
                                            let active2 = b.type2 === 'pos' ? true : false;


                                            if (active1 && active2) { //都是绿的连粗的绿的
                                                posPath.push({
                                                    date1: kelpCenterData[i].date,
                                                    date2: kelpCenterData[i + 1].date,
                                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.5)},${y(index_scale(a.id)-0.3)} v${Vgap*0.6} L ${highScale(location[kelpCenterData[i+1].date]+0.5)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.6} z`
                                                })
                                                posEdge.push(a); //绿边放进来
                                            } else if (!active1 && !active2) { //都是红的连粗的红的
                                                negPath.push({
                                                    date1: kelpCenterData[i].date,
                                                    date2: kelpCenterData[i + 1].date,
                                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.5)},${y(index_scale(a.id)-0.3)} v${Vgap*0.6} L ${highScale(location[kelpCenterData[i+1].date]+0.5)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.6} z`
                                                })
                                                negEdge.push(a) //红边放进来

                                            } else { //左右颜色不一样
                                                if (posNodes1.length > 0 && posNodes2.length > 0) { //如果左右都有绿的
                                                    posPath.push({
                                                        date1: kelpCenterData[i].date,
                                                        date2: kelpCenterData[i + 1].date,
                                                        d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(a.id)-0.3)} v${Vgap*0.3} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(b.id))} v${-Vgap*0.3} z`
                                                    })
                                                    posEdge.push(a); //绿边放进来
                                                }
                                                if (negNodes1.length > 0 && negNodes2.length > 0) {
                                                    negPath.push({
                                                        date1: kelpCenterData[i].date,
                                                        date2: kelpCenterData[i + 1].date,
                                                        d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(a.id))} v${Vgap*0.3} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.3} z`
                                                    })
                                                    negEdge.push(a) //红边放进来
                                                }
                                            }


                                        }
                                    })
                                    return set2Has
                                })
                                //有重叠连线

                            let negMix = [...negEdge, ...negNodes1].sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            if (negEdge.length > 0) {
                                negPath.push({
                                    date: kelpCenterData[i].date,
                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(negMix[0].id))} h${Hgap*0.2} L ${highScale(location[kelpCenterData[i].date]+1)},${y(index_scale(negMix[negMix.length-1].id))} h${-Hgap*0.2} z`
                                })
                            }
                            let posMix = [...posEdge, ...posNodes2].sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            if (posEdge.length > 0) {
                                posPath.push({
                                    date: kelpCenterData[i + 1].date,
                                    d: `M ${highScale(location[kelpCenterData[i+1].date])},${y(index_scale(posMix[0].id))} h${Hgap*0.2} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(posMix[posMix.length-1].id))} h${-Hgap*0.2} z`
                                })
                            }



                            if (!ifOverlap) { //没有重叠
                                if (posNodes1.length > 0 && posNodes2.length > 0) { //左右都有绿色
                                    let initpos = [0, 0]
                                    let maxdist = nodelen - 1;
                                    for (let index1 = 0; index1 < posNodes1.length; index1++) {
                                        if (maxdist < 2) {
                                            break;
                                        }
                                        for (let index2 = 0; index2 < posNodes2.length; index2++) {
                                            let dist = Math.abs(index_scale(posNodes1[index1].id) - index_scale(posNodes2[index2].id))
                                            if (dist < 2) {
                                                maxdist = dist;
                                                initpos = [index1, index2];
                                                break;
                                            } else if (dist < maxdist) {
                                                maxdist = dist
                                                initpos = [index1, index2];
                                            }
                                        }
                                    }
                                    if (index_scale(posNodes1[initpos[0]].id) > index_scale(posNodes2[initpos[1]].id)) {
                                        posline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.7),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.1),
                                            y1: y(index_scale(posNodes1[initpos[0]].id) - 0.3),
                                            y2: y(index_scale(posNodes2[initpos[1]].id) + 0.3),
                                        })
                                    } else {
                                        posline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.7),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.1),
                                            y1: y(index_scale(posNodes1[initpos[0]].id) + 0.3),
                                            y2: y(index_scale(posNodes2[initpos[1]].id) - 0.3),
                                        })
                                    }

                                }

                                if (negNodes1.length > 0 && negNodes2.length > 0) { //左右都有红色
                                    let initpos = [0, 0]
                                    let maxdist = nodelen - 1;
                                    for (let index1 = 0; index1 < negNodes1.length; index1++) {
                                        if (maxdist < 2) {
                                            break;
                                        }
                                        for (let index2 = 0; index2 < negNodes2.length; index2++) {
                                            let dist = Math.abs(index_scale(negNodes1[index1].id) - index_scale(negNodes2[index2].id))
                                            if (dist < 2) {
                                                maxdist = dist;
                                                initpos = [index1, index2];
                                                break;
                                            } else if (dist < maxdist) {
                                                maxdist = dist
                                                initpos = [index1, index2];
                                            }
                                        }
                                    }

                                    if (index_scale(negNodes1[initpos[0]].id) > index_scale(negNodes2[initpos[1]].id)) {
                                        negline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.9),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.3),
                                            y1: y(index_scale(negNodes1[initpos[0]].id) - 0.3),
                                            y2: y(index_scale(negNodes2[initpos[1]].id) + 0.3),
                                        })
                                    } else {
                                        negline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.9),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.3),
                                            y1: y(index_scale(negNodes1[initpos[0]].id) + 0.3),
                                            y2: y(index_scale(negNodes2[initpos[1]].id) - 0.3),
                                        })
                                    }


                                }

                            }
                        }


                    }
                    let kelpOpacity = 1
                        //posline
                    this.svg.selectAll('line.posline')
                        .data(posline)
                        .join('line')
                        .classed('kelp', true)
                        .classed('posline', true)
                        .attr('x1', d => d.x1)
                        .attr('y1', d => d.y1)
                        .attr('x2', d => d.x2)
                        .attr('y2', d => d.y2)
                        .attr('stroke', msvSwitch ? posgray : posrect)
                        .attr('stroke-width', Math.min(Hgap, Vgap) * 0.2)
                        .attr('opacity', kelpOpacity)
                        //negline
                    this.svg.selectAll('line.negline')
                        .data(negline)
                        .join('line')
                        .classed('kelp', true)
                        .classed('negline', true)
                        .attr('x1', d => d.x1)
                        .attr('y1', d => d.y1)
                        .attr('x2', d => d.x2)
                        .attr('y2', d => d.y2)
                        .attr('stroke', msvSwitch ? neggray : negrect)
                        .attr('stroke-width', Math.min(Hgap, Vgap) * 0.2)
                        .attr('opacity', kelpOpacity)
                        //neg-path
                    this.svg.selectAll('path.kelpnp')
                        .data(negPath)
                        .join('path')
                        .classed('kelp', true)
                        .classed('kelpnp', true)
                        .attr('d', d => d.d)
                        .attr('fill', msvSwitch ? neggray : negrect)
                        .attr('opacity', kelpOpacity)
                        .attr("stroke-width", 1)
                        //pos-path
                    this.svg.selectAll('path.kelppp')
                        .data(posPath)
                        .join('path')
                        .classed('kelp', true)
                        .classed('kelppp', true)
                        .attr('d', d => d.d)
                        .attr('fill', msvSwitch ? posgray : posrect)
                        .attr('opacity', kelpOpacity)

                    //绘制光圈
                    if (!msvSwitch) {
                        let lightData = []
                        let lightStream = kelpCenterData
                        lightStream.forEach((item => {
                            item.nodes.filter(item => item.strength2 > weightThreshold).forEach((node) => {
                                lightData.push({
                                    id: node.id,
                                    color: node.totalposvalue - Math.abs(node.totalnegvalue) >= 0 ? '#d2664f' : '#5389c0',
                                    date: item.date,
                                })
                            })
                        }))
                        this.svg.selectAll('circle.light')
                            .data(lightData)
                            .join('circle')
                            .classed('light', true)
                            .attr('cx', d => highScale(location[d.date] + 0.5))
                            .attr('cy', d => (y(index_scale(d.id))))
                            .attr('r', Math.min(Hgap, Vgap) * 0.2)
                            .attr('fill', d => d.color)
                            .attr('opacity', kelpOpacity)
                    }
                } else {
                    let kelpCenterData = highData.filter((item, index) => {
                        return item.nodes.filter(({ strength }) => strength > degreeThreshold).length > 0;
                    })
                    kelpCenterData.forEach((item, index) => {
                            let set = item.nodes.filter(({ strength }) => strength > degreeThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let posbridgeSet = set.filter((node) => node.type === "pos").sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            let bridgeSet = set.filter((node) => node.type === 'neg').sort((a, b) => index_scale(a.id) - index_scale(b.id));

                            //绘制posbridge
                            let posbridgeLen = posbridgeSet.length;
                            if (posbridgeLen > 0) {
                                // if(!msvSwitch){
                                posbridgeSet.forEach((node, i) => {
                                    posPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+0.9)},${y(index_scale(node.id)-0.4)} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date])},${y(index_scale(node.id)-0.4)} v${Vgap*0.8} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+0.9)},${y(index_scale(node.id)+0.4)} z`
                                    })
                                })
                                posPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date])},${y(index_scale(posbridgeSet[0].id))} h${Hgap*0.2} L ${highScale(location[item.date]+0.2)},${y(index_scale(posbridgeSet[posbridgeLen-1].id))} h${-Hgap*0.2} z`
                                    })
                                    // }

                            }

                            //绘制bridge
                            let bridgeLen = bridgeSet.length;
                            if (bridgeLen > 0) {
                                // if(!msvSwitch){
                                bridgeSet.forEach((node, i) => {
                                    negPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+1)},${y(index_scale(node.id)-0.4)} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+0.1)},${y(index_scale(node.id)-0.4)} v${Vgap*0.8} A${Hgap*0.4},${Vgap*0.1} 0 0,0 ${highScale(location[item.date]+1)},${y(index_scale(node.id)+0.4)} z`
                                    })
                                })
                                negPath.push({
                                        date: item.date,
                                        d: `M ${highScale(location[item.date]+0.8)},${y(index_scale(bridgeSet[0].id))} h${Hgap*0.2} L ${highScale(location[item.date]+1)},${y(index_scale(bridgeSet[bridgeLen-1].id))} h${-Hgap*0.2} z`
                                    })
                                    // }

                            }
                        })
                        //计算两天之间的连接
                    for (let i = 0; i < kelpCenterData.length - 1; i++) {
                        let distance = (location[kelpCenterData[i + 1].date] - location[kelpCenterData[i].date])
                        if (distance > 0 && distance < 15) {
                            let set1 = kelpCenterData[i].nodes.filter(({ strength }) => strength > degreeThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let set2 = kelpCenterData[i + 1].nodes.filter(({ strength }) => strength > degreeThreshold).sort((a, b) => index_scale(a.id) - index_scale(b.id))
                            let posNodes1 = set1.filter((node) => node.type === 'pos') //左边绿的
                            let negNodes1 = set1.filter((node) => node.type === 'neg') //左边红的
                            let posNodes2 = set2.filter((node) => node.type === 'pos') //右边绿的
                            let negNodes2 = set2.filter((node) => node.type === 'neg') //右边红的

                            let ifOverlap = false //是否有重叠
                            let posEdge = [],
                                negEdge = []; //红边绿边
                            set1.forEach((a) => {
                                    let set2Has = set2.forEach((b) => {
                                        let Has = a.id === b.id;
                                        if (Has) { //如果重叠了
                                            ifOverlap = true;
                                            let active1 = a.type === 'pos' ? true : false;
                                            let active2 = b.type === 'pos' ? true : false;

                                            if (active1 && active2) { //都是绿的连粗的绿的
                                                posPath.push({
                                                    date1: kelpCenterData[i].date,
                                                    date2: kelpCenterData[i + 1].date,
                                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.5)},${y(index_scale(a.id)-0.3)} v${Vgap*0.6} L ${highScale(location[kelpCenterData[i+1].date]+0.5)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.6} z`
                                                })
                                                posEdge.push(a); //绿边放进来
                                            } else if (!active1 && !active2) { //都是红的连粗的红的
                                                negPath.push({
                                                    date1: kelpCenterData[i].date,
                                                    date2: kelpCenterData[i + 1].date,
                                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.5)},${y(index_scale(a.id)-0.3)} v${Vgap*0.6} L ${highScale(location[kelpCenterData[i+1].date]+0.5)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.6} z`
                                                })
                                                negEdge.push(a) //红边放进来

                                            } else { //左右颜色不一样
                                                if (posNodes1.length > 0 && posNodes2.length > 0) { //如果左右都有绿的
                                                    posPath.push({
                                                        date1: kelpCenterData[i].date,
                                                        date2: kelpCenterData[i + 1].date,
                                                        d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(a.id)-0.3)} v${Vgap*0.3} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(b.id))} v${-Vgap*0.3} z`
                                                    })
                                                    posEdge.push(a); //绿边放进来
                                                }
                                                if (negNodes1.length > 0 && negNodes2.length > 0) {
                                                    negPath.push({
                                                        date1: kelpCenterData[i].date,
                                                        date2: kelpCenterData[i + 1].date,
                                                        d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(a.id))} v${Vgap*0.3} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(b.id)+0.3)} v${-Vgap*0.3} z`
                                                    })
                                                    negEdge.push(a) //红边放进来
                                                }
                                            }


                                        }
                                    })
                                    return set2Has
                                })
                                //有重叠连线

                            let negMix = [...negEdge, ...negNodes1].sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            if (negEdge.length > 0) {
                                negPath.push({
                                    date: kelpCenterData[i].date,
                                    d: `M ${highScale(location[kelpCenterData[i].date]+0.8)},${y(index_scale(negMix[0].id))} h${Hgap*0.2} L ${highScale(location[kelpCenterData[i].date]+1)},${y(index_scale(negMix[negMix.length-1].id))} h${-Hgap*0.2} z`
                                })
                            }
                            let posMix = [...posEdge, ...posNodes2].sort((a, b) => index_scale(a.id) - index_scale(b.id));
                            if (posEdge.length > 0) {
                                posPath.push({
                                    date: kelpCenterData[i + 1].date,
                                    d: `M ${highScale(location[kelpCenterData[i+1].date])},${y(index_scale(posMix[0].id))} h${Hgap*0.2} L ${highScale(location[kelpCenterData[i+1].date]+0.2)},${y(index_scale(posMix[posMix.length-1].id))} h${-Hgap*0.2} z`
                                })
                            }



                            if (!ifOverlap) { //没有重叠
                                if (posNodes1.length > 0 && posNodes2.length > 0) { //左右都有绿色
                                    let initpos = [0, 0]
                                    let maxdist = nodelen - 1;
                                    for (let index1 = 0; index1 < posNodes1.length; index1++) {
                                        if (maxdist < 2) {
                                            break;
                                        }
                                        for (let index2 = 0; index2 < posNodes2.length; index2++) {
                                            let dist = Math.abs(index_scale(posNodes1[index1].id) - index_scale(posNodes2[index2].id))
                                            if (dist < 2) {
                                                maxdist = dist;
                                                initpos = [index1, index2];
                                                break;
                                            } else if (dist < maxdist) {
                                                maxdist = dist
                                                initpos = [index1, index2];
                                            }
                                        }
                                    }
                                    if (index_scale(posNodes1[initpos[0]].id) > index_scale(posNodes2[initpos[1]].id)) {
                                        posline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.7),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.1),
                                            y1: y(index_scale(posNodes1[initpos[0]].id) - 0.3),
                                            y2: y(index_scale(posNodes2[initpos[1]].id) + 0.3),
                                        })
                                    } else {
                                        posline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.7),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.1),
                                            y1: y(index_scale(posNodes1[initpos[0]].id) + 0.3),
                                            y2: y(index_scale(posNodes2[initpos[1]].id) - 0.3),
                                        })
                                    }

                                }

                                if (negNodes1.length > 0 && negNodes2.length > 0) { //左右都有红色
                                    let initpos = [0, 0]
                                    let maxdist = nodelen - 1;
                                    for (let index1 = 0; index1 < negNodes1.length; index1++) {
                                        if (maxdist < 2) {
                                            break;
                                        }
                                        for (let index2 = 0; index2 < negNodes2.length; index2++) {
                                            let dist = Math.abs(index_scale(negNodes1[index1].id) - index_scale(negNodes2[index2].id))
                                            if (dist < 2) {
                                                maxdist = dist;
                                                initpos = [index1, index2];
                                                break;
                                            } else if (dist < maxdist) {
                                                maxdist = dist
                                                initpos = [index1, index2];
                                            }
                                        }
                                    }

                                    if (index_scale(negNodes1[initpos[0]].id) > index_scale(negNodes2[initpos[1]].id)) {
                                        negline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.9),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.3),
                                            y1: y(index_scale(negNodes1[initpos[0]].id) - 0.3),
                                            y2: y(index_scale(negNodes2[initpos[1]].id) + 0.3),
                                        })
                                    } else {
                                        negline.push({
                                            date1: kelpCenterData[i].date,
                                            date2: kelpCenterData[i + 1].date,
                                            x1: highScale(location[kelpCenterData[i].date] + 0.9),
                                            x2: highScale(location[kelpCenterData[i + 1].date] + 0.3),
                                            y1: y(index_scale(negNodes1[initpos[0]].id) + 0.3),
                                            y2: y(index_scale(negNodes2[initpos[1]].id) - 0.3),
                                        })
                                    }


                                }

                            }
                        }


                    }
                    let kelpOpacity = 1
                        //posline
                    this.svg.selectAll('line.posline')
                        .data(posline)
                        .join('line')
                        .classed('kelp', true)
                        .classed('posline', true)
                        .attr('x1', d => d.x1)
                        .attr('y1', d => d.y1)
                        .attr('x2', d => d.x2)
                        .attr('y2', d => d.y2)
                        .attr('stroke', msvSwitch ? posgray : posrect)
                        .attr('stroke-width', Math.min(Hgap, Vgap) * 0.2)
                        .attr('opacity', kelpOpacity)
                        //negline
                    this.svg.selectAll('line.negline')
                        .data(negline)
                        .join('line')
                        .classed('kelp', true)
                        .classed('negline', true)
                        .attr('x1', d => d.x1)
                        .attr('y1', d => d.y1)
                        .attr('x2', d => d.x2)
                        .attr('y2', d => d.y2)
                        .attr('stroke', msvSwitch ? neggray : negrect)
                        .attr('stroke-width', Math.min(Hgap, Vgap) * 0.2)
                        .attr('opacity', kelpOpacity)
                        //neg-path
                    this.svg.selectAll('path.kelpnp')
                        .data(negPath)
                        .join('path')
                        .classed('kelp', true)
                        .classed('kelpnp', true)
                        .attr('d', d => d.d)
                        .attr('fill', msvSwitch ? neggray : negrect)
                        .attr('opacity', kelpOpacity)
                        .attr("stroke-width", 1)
                        //pos-path
                    this.svg.selectAll('path.kelppp')
                        .data(posPath)
                        .join('path')
                        .classed('kelp', true)
                        .classed('kelppp', true)
                        .attr('d', d => d.d)
                        .attr('fill', msvSwitch ? posgray : posrect)
                        .attr('opacity', kelpOpacity)

                    //绘制光圈
                    if (!msvSwitch) {
                        let lightData = []
                        let lightStream = kelpCenterData
                        lightStream.forEach((item => {
                            item.nodes.filter(item => item.strength > degreeThreshold).forEach((node) => {
                                lightData.push({
                                    id: node.id,
                                    color: node.posdegree - node.negdegree >= 0 ? '#d2664f' : '#5389c0',
                                    date: item.date,
                                })
                            })
                        }))
                        this.svg.selectAll('circle.light')
                            .data(lightData)
                            .join('circle')
                            .classed('light', true)
                            .attr('cx', d => highScale(location[d.date] + 0.5))
                            .attr('cy', d => (y(index_scale(d.id))))
                            .attr('r', Math.min(Hgap, Vgap) * 0.2)
                            .attr('fill', d => d.color)
                            .attr('opacity', kelpOpacity)
                    }
                }



            }
            if (msvSwitch) {
                //矩阵
                let matrices = mdata.filter(({ date }) => unfoldDay.includes(date));
                matrices.forEach(matrix => {
                    if (unfoldDiff.includes(matrix.date)) {
                        let diffRows = diffdata.filter(({ date }) => date === matrix.date)[0].cell
                        let diffData = [];
                        diffRows.forEach((row, rowindex) => {
                            row.forEach((cell, cellindex) => {
                                diffData.push({
                                    source: originInvertIndex(cellindex),
                                    target: originInvertIndex(rowindex),
                                    value: cell
                                })
                            })
                        })
                        this.svg.append('g').attr('class', 'matrix' + matrix.date).classed('matrix', true).selectAll('rect.diffmatrix')
                            .data(diffData)
                            .join('rect')
                            .attr("class", d => 'node' + d.target)
                            .classed('diffmatrix', true)
                            .classed('matrix', true)
                            .attr("y", d => y(index_scale(d.target) - 0.5))
                            .attr("x", d => highScale(location[matrix.date] + 1) + index_scale(d.source) * (y(1) - y(0)))
                            .attr("height", (y(1) - y(0)))
                            .attr("width", y(1) - y(0))
                            .attr('id', d => index_scale(d.source))
                            .attr('fill', d => color(d.value))
                            .attr("stroke", '#e1e3e6')
                            .attr('opacity', 1)
                            .on('click', function(event) {
                                d3.selectAll('rect.neg-node').attr("opacity", '0.1')
                                d3.selectAll('rect.pos-node').attr("opacity", '0.1')
                                d3.selectAll('rect.diffmatrix').attr("opacity", '0.1')
                                d3.selectAll('rect.matrix').attr("opacity", '0.1')
                                let celldata = d3.select(this).data()

                                d3.selectAll(".node" + celldata[0].source).attr("opacity", '1')
                                d3.selectAll(".node" + celldata[0].target).attr("opacity", '1')
                                    // d3.selectAll('rect.MSV-edge').attr('opacity','0')

                                // d3.selectAll('.kelp').attr("opacity",'0')


                            })
                            .on("mouseout", function(event) {
                                d3.selectAll('rect.neg-node').attr("opacity", '1')
                                d3.selectAll('rect.pos-node').attr("opacity", '1')
                                d3.selectAll('.arc').remove()
                                d3.selectAll('rect.MSV-edge').attr('opacity', '1')

                                d3.selectAll('rect.diffmatrix').attr("opacity", '1')
                                d3.selectAll('rect.matrix').attr("opacity", '1')

                                // d3.selectAll('.kelp').attr("opacity",'0.8')
                            })
                    } else {
                        //原图展开
                        let matrixData = [];
                        matrix.cell.forEach((row, rowindex) => {
                            row.forEach((cell, cellindex) => {
                                matrixData.push({
                                    source: originInvertIndex(cellindex),
                                    target: originInvertIndex(rowindex),
                                    value: cell
                                })
                            })
                        })
                        this.svg.append('g').attr('class', 'matrix' + matrix.date).classed('matrix', true).selectAll('rect.matrix')
                            .data(matrixData)
                            .join('rect')
                            .attr("class", d => 'node' + d.target)
                            .classed('matrix', true)
                            .attr("y", d => y(index_scale(d.target) - 0.5))
                            .attr("x", d => highScale(location[matrix.date] + 1) + index_scale(d.source) * (y(1) - y(0)))
                            .attr("height", (y(1) - y(0)))
                            .attr("width", y(1) - y(0))
                            .attr('id', d => index_scale(d.source))
                            .attr('fill', d => d.target === d.source ? 'white' : mcolor(d.value))
                            .attr("stroke", '#e1e3e6')
                            .attr('opacity', 1)
                            .on('click', function(event) {
                                d3.selectAll('rect.neg-node').attr("opacity", '0.1')
                                d3.selectAll('rect.pos-node').attr("opacity", '0.1')
                                d3.selectAll('rect.diffmatrix').attr("opacity", '0.1')
                                d3.selectAll('rect.matrix').attr("opacity", '0.1')
                                let celldata = d3.select(this).data()

                                d3.selectAll(".node" + celldata[0].source).attr("opacity", '1')
                                d3.selectAll(".node" + celldata[0].target).attr("opacity", '1')
                                    // d3.selectAll('rect.MSV-edge').attr('opacity','0')

                                // d3.selectAll('.kelp').attr("opacity",'0')


                            })
                            .on("mouseout", function(event) {
                                d3.selectAll('rect.neg-node').attr("opacity", '1')
                                d3.selectAll('rect.pos-node').attr("opacity", '1')
                                d3.selectAll('.arc').remove()
                                d3.selectAll('rect.MSV-edge').attr('opacity', '1')

                                d3.selectAll('rect.diffmatrix').attr("opacity", '1')
                                d3.selectAll('rect.matrix').attr("opacity", '1')

                                // d3.selectAll('.kelp').attr("opacity",'0.8')
                            })
                    }
                    //绘制辅助线
                    d3.select('g.matrix' + matrix.date).append('line')
                        .classed('matrixline', true)
                        .attr('x1', highScale(location[matrix.date] + 1))
                        .attr('y1', y(-0.5))
                        .attr('x2', highScale(location[matrix.date] + 1))
                        .attr('y2', y(nodelen - 0.5))
                        .attr('stroke', '#3c374a')
                    d3.select('g.matrix' + matrix.date).append('line')
                        .classed('matrixline', true)
                        .attr('x1', highScale(location[matrix.date] + matrix_width + 1))
                        .attr('y1', y(-0.5))
                        .attr('x2', highScale(location[matrix.date] + matrix_width + 1))
                        .attr('y2', y(nodelen - 0.5))
                        .attr('stroke', '#3c374a')

                })

                //绘制high视图

                this.svg.append('g')
                    .attr('class', 'high-level')
                    .selectAll('g.high')
                    .data(highData)
                    .join('g')
                    .attr('class', 'high')
                    .attr('id', d => d.date)
                    .each(function(ddd, index) {

                        let day_index = location[ddd.date]


                        if (focusSpan[0] !== 'start' && index > focusSpan[0] && index < focusSpan[1]) {

                        } else {

                            //绘制边
                            d3.select(this).selectAll('rect.high-edge')
                                .data([0])
                                .join('rect')
                                .attr('class', 'high-edge')
                                .classed('Edate' + ddd.date, true)
                                .attr('x', highScale(day_index))
                                .attr('y', y(0))
                                .attr('width', (highScale(1) - highScale(0)))
                                .attr('height', y(ddd.nodes.length - 1))
                                // .attr('fill',d=>d>0?edgeColor(50):edgeColor(d))
                                .attr('fill', 'white')
                                .attr('opacity', 0)
                                .on('mouseover', function(event) {
                                    //鼠标悬浮，高亮当天；
                                    d3.selectAll('rect.neg-node').attr("opacity", '0.1')
                                    d3.selectAll('rect.pos-node').attr("opacity", '0.1')
                                        // d3.selectAll('.kelp').attr("opacity",'0')
                                    let selector = ".date" + ddd.date;
                                    d3.selectAll(selector).attr("opacity", '1')
                                        //添加日期标签
                                    d3.select(this.parentNode).append('text')
                                        .classed('datetext', true)
                                        .attr('x', highScale(day_index + 1.5))
                                        .attr('y', y(0))
                                        .text(ddd.date)
                                        .attr('font-size', 15)
                                        .attr('stroke', 'balck')
                                })
                                .on("mouseout", function(event) {
                                    d3.selectAll('rect.neg-node').attr("opacity", '1')
                                    d3.selectAll('rect.pos-node').attr("opacity", '1')
                                        // d3.selectAll('.kelp').attr("opacity",0.8)
                                    d3.selectAll('.datetext').remove()
                                })
                                .on('dblclick', function(event) {
                                    if (unfoldSwitch) {
                                        dispatch(updateUnfoldDiff(ddd.date))
                                    } else {
                                        dispatch(updateUnfoldDay(ddd.date))
                                    }

                                })
                                //绘制节点
                            d3.select(this).selectAll('g.high-node')
                                .data(ddd.nodes)
                                .join('g')
                                .attr('class', 'high-node')
                                .each(function(node) {

                                    d3.select(this).append('rect')
                                        .attr('class', 'neg-node')
                                        .classed('date' + ddd.date, true)
                                        .classed('node' + node.id, true)
                                        .attr('x', highScale(day_index + 0.2))
                                        .attr('y', y(index_scale(node.id)))
                                        .attr('width', (highScale(1) - highScale(0)) * 0.6)
                                        .attr('height', d => nodeScale(d.negdegree))
                                        .attr('fill', d => colorSwitch ? color(d.negvalue) : negrect)
                                        .on('mouseover', function(event) {
                                            d3.selectAll('rect.neg-node').attr("opacity", '0.1')
                                            d3.selectAll('rect.pos-node').attr("opacity", '0.1')
                                            d3.selectAll('rect.diffmatrix').attr("opacity", '0.1')
                                            d3.selectAll('rect.matrix').attr("opacity", '0.1')
                                            let selector = ".node" + node.id;
                                            d3.selectAll(selector).attr("opacity", '1')

                                            d3.selectAll('rect.MSV-edge').attr('opacity', '0')
                                            d3.selectAll('.start' + node.id).attr('opacity', '1')
                                            d3.selectAll('.end' + node.id).attr('opacity', '1')

                                            // d3.selectAll('.kelp').attr("opacity",'0')


                                        })
                                        .on("mouseout", function(event) {
                                            d3.selectAll('rect.neg-node').attr("opacity", '1')
                                            d3.selectAll('rect.pos-node').attr("opacity", '1')
                                            d3.selectAll('.arc').remove()
                                            d3.selectAll('rect.MSV-edge').attr('opacity', '1')

                                            d3.selectAll('rect.diffmatrix').attr("opacity", '1')
                                            d3.selectAll('rect.matrix').attr("opacity", '1')

                                            // d3.selectAll('.kelp').attr("opacity",'0.8')
                                        })

                                    d3.select(this).append('rect')
                                        .attr('class', 'pos-node')
                                        .classed('date' + ddd.date, true)
                                        .classed('node' + node.id, true)
                                        .attr('x', highScale(day_index + 0.2))
                                        .attr('y', d => (y(index_scale(node.id)) - nodeScale(d.posdegree)))
                                        .attr('width', (highScale(1) - highScale(0)) * 0.6)
                                        .attr('height', d => nodeScale(d.posdegree))
                                        .attr('fill', d => colorSwitch ? color(d.posvalue) : posrect)
                                        .on('mouseover', function(event) {

                                            d3.selectAll('rect.neg-node').attr("opacity", '0.1')
                                            d3.selectAll('rect.pos-node').attr("opacity", '0.1')
                                            d3.selectAll('rect.diffmatrix').attr("opacity", '0.1')
                                            d3.selectAll('rect.matrix').attr("opacity", '0.1')

                                            d3.selectAll('rect.MSV-edge').attr('opacity', '0')
                                            let selector = ".node" + node.id;
                                            d3.selectAll(selector).attr("opacity", '1')
                                            d3.selectAll('.start' + node.id).attr('opacity', '1')
                                            d3.selectAll('.end' + node.id).attr('opacity', '1')

                                            // d3.selectAll('.kelp').attr("opacity",'0')

                                        })
                                        .on("mouseout", function(event) {
                                            d3.selectAll('rect.neg-node').attr("opacity", '1')
                                            d3.selectAll('rect.pos-node').attr("opacity", '1')
                                            d3.selectAll('.arc').remove()
                                            d3.selectAll('rect.MSV-edge').attr('opacity', '1')

                                            d3.selectAll('rect.diffmatrix').attr("opacity", '1')
                                            d3.selectAll('rect.matrix').attr("opacity", '1')

                                            // d3.selectAll('.kelp').attr("opacity",'0.8')
                                        })


                                })


                        }


                    })
            }
        }
        // Function to compute density
    kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    }
    kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    reorder4Weight(highMatrix, nodecount, MatrixSet, orderweight) {
        let dist = [] //距离矩阵 用于leaforder
        let weight = orderweight * 0.01
        let mweight = 1 - weight
        let n = nodecount; //节点数量
        let N = n ** 2; //矩阵cell数量，莫兰公式左上值
        let K = 2 * n * (n - 1) //总邻接数量，莫兰公式左下值
            //处理high矩阵
        let t = highMatrix.length
        highMatrix = reorder.transpose(highMatrix)
        for (let i = 0; i < n; i++) {
            let r = []
            for (let j = 0; j < n; j++) {

                let d = 0;
                if (i !== j) {
                    for (let k = 0; k < t; k++) {
                        d = d + Math.abs(highMatrix[i][k][0] - highMatrix[j][k][0]) + Math.abs(highMatrix[i][k][1] - highMatrix[j][k][1])
                    }
                    d = weight * 0.5 * d / (n - 1) / t
                }
                r.push(d)
            }
            dist.push(r);
        }
            //处理矩阵
        let Mlen = MatrixSet.length //矩阵数量
        if (Mlen > 0) {
            MatrixSet.forEach((matrix, mindex) => {
                let A = 0; //求矩阵权重的总和
                matrix.forEach((row, rowindex) => {
                    row.forEach((cell, cellindex) => {
                        A = A + cell
                    })
                })
                let a = A / N; //矩阵权重的平均值
                let B = 0; //求莫兰指数右下值
                matrix.forEach((row, rowindex) => {
                    row.forEach((cell, cellindex) => {
                        B = B + (cell - a) ** 2
                    })
                })
                for (let i = 0; i < n; i++) { //计算任意两行的距离
                    for (let j = 0; j < i; j++) {
                        let rowDist = 0;
                        for (let p = 0; p < n; p++) {
                            rowDist = rowDist + ((matrix[i][p] - a) * (matrix[j][p] - a))
                        }
                        rowDist = (N / K) * (2 * rowDist / B) //Is
                        dist[i][j] += (((1 + (1 - n) * rowDist) * 0.5) / Mlen) * mweight //调整到0-1区间，然后除以多个矩阵数量集合感知，再乘以1-权重
                        dist[j][i] += (((1 + (1 - n) * rowDist) * 0.5) / Mlen) * mweight
                    }
                }
            })
        }
        let order = reorder.optimal_leaf_order();
        let row_perm = order.distance_matrix(dist)(highMatrix)
        return row_perm;

    }
    MatrixMoran(matrix) {
        let n = matrix.length; //节点数量
        let N = n ** 2; //矩阵cell数量，莫兰公式左上值
        let K = 2 * n * (n - 1) //总邻接数量，莫兰公式左下值
        let A = 0; //求矩阵权重的总和
        matrix.forEach((row, rowindex) => {
            row.forEach((cell, cellindex) => {
                A = A + cell
            })
        })
        let a = A / N; //矩阵权重的平均值
        let B = 0; //求莫兰指数右下值
        matrix.forEach((row, rowindex) => {
            row.forEach((cell, cellindex) => {
                B = B + (cell - a) ** 2
            })
        })
        let D = 0; //莫兰公式右上项
        for (let i = 0; i < n - 1; i++) { //计算i和i+1行的距离
            for (let j = 0; j < n; j++) {
                D = D + (matrix[i][j] - a) * (matrix[i + 1][j] - a)
            }
        }
        let moran = (N / K) * (2 * D / B)
        console.log(n, a, A, N, K, D, B)
        return moran
    }
    weighted_value_rows(r1, r2, cells, m) {
        // console.log(r1,r2,cells,m)
        let result = 0;
        for (let i = 0; i < r1.length; i++) {
            // result += Math.abs(r1[i]-r2[i])
            // result += (r1[i]-r2[i])**2
            result += (r1[i] * cells - m) * (r2[i] * cells - m);
            if (r1[i] === 1 && r2[i] === 1) {
                result += 100;
            } else {
                result += 0
            }
        }
        return result;
    }
    reorderHigh(highData, nodecount, hugeMatrix) {
        let matrix = [];
        let m = 0,
            n = 0;
        for (let i = 0; i < highData.length; i++) {
            let row = []
            this.nodes.forEach((item, index) => {
                row.push(highData[i].nodes[index].posdegree)
            })
            let row1 = []
            this.nodes.forEach((item, index) => {
                    row1.push(highData[i].nodes[index].negdegree)
                })
                // for(let j=0;j<nodecount;j++){
                //     // console.log(highData[i].date,highData[i].nodes[j],j,i)
                //     // row.push(highData[i].nodes[j].degree)
                //     // if(highData[i].nodes[j].degree>this.degreeThreshold){
                //     //     row.push(1)
                //     //     m++;
                //     // }else{
                //     //     row.push(0);
                //     // }
                //     // n++;
                // }
            matrix.push(row)
            matrix.push(row1)
        }
        console.log(matrix)
        matrix = reorder.transpose(matrix)
        console.log(matrix)
        if (hugeMatrix.length > 0) {
            matrix.forEach((item, index) => {
                matrix[index] = matrix[index].concat(hugeMatrix[index])
            })
        }
        console.log(matrix)
        let dist = [];
        let square = false;
        for (let i = 0; i < matrix.length; i++) {
            let r = []
            for (let j = 0; j < matrix.length; j++) {

                let d = this.weighted_value_rows(matrix[i], matrix[j], n, m);
                if (square) {
                    if (d >= 0) {
                        r.push(-d * d);
                        // dist[i][j] += -d * d;
                    } else {
                        r.push(d * d);
                        // dist[i][j] += d * d;
                    }
                } else {
                    r.push(-d);
                    // dist[i][j] += -d;
                }
            }
            dist.push(r);
        }
        console.log('dist', dist)
        let order = reorder.optimal_leaf_order();
        let row_perm = order.distance_matrix(dist)(matrix)
        return row_perm;
    }
drawColorLegend4Diff(container, width, height, start_point, axis_label) {
    // 选择绘制容器
    var svg = d3.select(container);
    svg.attr("width", width+start_point[0]*2).attr("height", height * 3);

    // 构建渐变色实例 #5389c0 #d2664f #E09585 #82a9d1
    var linearGradient = svg.append("g").append("linearGradient").attr("id", "colorGradientDiff"); 
    linearGradient.append("stop").attr("offset", "0%") .attr("stop-color", "#5389c0"); 
    linearGradient.append("stop").attr("offset", "49%").attr("stop-color", "#ecf2f8");
    linearGradient.append("stop").attr("offset", "50%").attr("stop-color", "white");
    linearGradient.append("stop").attr("offset", "51%").attr("stop-color", "#faedeb");
    linearGradient.append("stop").attr("offset", "100%").attr("stop-color", "#d2664f");

    //用linearGradient填充矩形
    svg.append("g").attr("transform", "translate(" + start_point[0] + ", " + start_point[1] + ")")
      .append("rect").attr("width", width).attr("height", height).style("fill", "url('#colorGradientDiff')"); 

    // 构建刻度比例尺
    var axis_scale = d3.scaleLinear().domain([0, 10]).range([0.7, width-0.3]);

    // 绘制刻度：上面
    var axis_top = svg.append("g")
      .attr("transform", "translate(" + start_point[0] + ", " + start_point[1] + ")")
      .call(d3.axisTop(axis_scale).ticks(2).tickSize(2).tickFormat(() => ""));
    axis_top.append("text").text("Negtive").attr("x", axis_scale(2.5)).attr("y", -7).attr("font-size", 8).attr("fill", "#82a9d1");
    axis_top.append("text").text("Positive").attr("x", axis_scale(7.5)).attr("y", -7).attr("font-size", 8).attr("fill", "#E09585");    
    // 刻度+线:调整不透明度
    axis_top.select(".domain").attr("opacity", 0.5);
    axis_top.selectAll(".tick").select("line").attr("opacity", 0.6);

    // 绘制刻度:下面
    var axis_bottom = svg.append("g")
      .attr("transform", "translate(" + start_point[0] + ", " + (start_point[1] + height) + ")")
      .call(d3.axisBottom(axis_scale).ticks(2).tickSize(2).tickFormat(() => ""));
    axis_bottom.append("text").text(axis_label[0]).attr("x", axis_scale(0)).attr("y", 12).attr("font-size", 8).attr("fill", "black");
    axis_bottom.append("text").text(axis_label[1]).attr("x", axis_scale(5)).attr("y", 12).attr("font-size", 8).attr("fill", "black");
    axis_bottom.append("text").text(axis_label[2]).attr("x", axis_scale(10)).attr("y", 12).attr("font-size", 8).attr("fill", "black");    
    // 刻度+线:调整不透明度
    axis_bottom.select(".domain").attr("opacity", 0.5);
    axis_bottom.selectAll(".tick").select("line").attr("opacity", 0.6);
  }

  drawColorLegend4Org(container, width, height, start_point, axis_label) {
    // 选择绘制容器
    var svg = d3.select(container);
    svg.attr("width", width+start_point[0]*2).attr("height", height * 2);

    // 构建渐变色实例
    var linearGradient = svg.append("g").append("linearGradient").attr("id", "colorGradientOrg"); 
    linearGradient.append("stop").attr("offset", "0%").attr("stop-color", "white");
    linearGradient.append("stop").attr("offset", "100%").attr("stop-color", "#3e403f");

    //用linearGradient填充矩形
    svg.append("g").attr("transform", "translate(" + start_point[0] + ", " + start_point[1] + ")")
      .append("rect").attr("width", width).attr("height", height).style("fill", "url('#colorGradientOrg')"); 

    // 构建刻度比例尺
    var axis_scale = d3.scaleLinear().domain([0, 10]).range([0.7, width-0.3]);

    // 绘制刻度:下面
    var axis_bottom = svg.append("g")
      .attr("transform", "translate(" + start_point[0] + ", " + (start_point[1] + height) + ")")
      .call(d3.axisBottom(axis_scale).ticks(1).tickSize(2).tickFormat(() => ""));
    axis_bottom.append("text").text(axis_label[0]).attr("x", axis_scale(0)).attr("y", 12).attr("font-size", 8).attr("fill", "black");
    axis_bottom.append("text").text(axis_label[1]).attr("x", axis_scale(10)).attr("y", 12).attr("font-size", 8).attr("fill", "black");    
    // 刻度+线:调整不透明度
    axis_bottom.select(".domain").attr("opacity", 0.5);
    axis_bottom.selectAll(".tick").select("line").attr("opacity", 0.6);
  }

  drawColorLegendOuter() { 
    this.drawColorLegend4Diff("#scale-diff", 90, 15, [25, 15], [-1, 0, 1]);
    this.drawColorLegend4Org("#scale-org", 90, 15, [5, 0], [0, 1]);
  }

};

export default new chart();