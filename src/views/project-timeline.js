import * as d3 from 'd3';
import originData from './data/dataset1/1D.json';
// import originData from './data/dataset2/1D_5.json';
// import originData from './data/dataset3/1D_day_MDS.json';
import { updateTimeSpan, updateSelectedDate } from '../store/actions';

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
    x = d3.scaleLinear()
    y = d3.scaleLinear()
    time = d3.scaleUtc()
    xAxis = null;
    yAxis = null;
    //线生成器
    line = d3.line()
        .defined(d => !isNaN(d.x))
        .x(d => this.x(d.date))
        .y(d => this.y(d.x));
    //刷选初始化
    brush = d3.brushX();
    //时间转换器
    parseDate = d3.timeParse('%Y-%m-%d');
    //symbols
    symbolSize = 60;
    symbol = d3.symbol().type(d3.symbolTriangle).size(this.symbolSize);

    // 初始化
    init(container, dispatch) {
        let data = JSON.parse(JSON.stringify(originData));
        // data = data.slice(2200,2300)
        data.forEach(element => {
            element.date = this.parseDate(element.date);
        });
        //长宽获取
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        //比例尺赋值
        this.time.domain(d3.extent(data, d => d.date))
            .range([this.margin.left, this.width - this.margin.right])
        this.x.domain([0, data.length - 1])
            .range([this.margin.left+5, this.width - this.margin.right])
        this.y.domain([d3.max(data, d => d.x), d3.min(data, d => d.x)]).nice()
            .range([this.margin.top, this.height - this.margin.bottom])
        let colorScale = d3.scaleLinear()
            .domain([0, data.length])
            .range(['#dbe4ff', '#396EB0'])
            //刷选初始化
        this.brush
            .extent([
                [this.margin.left, this.margin.top],
                [this.width - this.margin.right, this.height+4 - this.margin.bottom]
            ])
            .on('end', (event) => {
                let selection = event.selection;
                if (selection == null) {
                    return;
                }
                let dateRange = selection.map(d => this.x.invert(d));

                // let dateFormat = d3.timeFormat("%Y-%m-%d"); 

                let begin = dateRange[0];
                let end = dateRange[1];
                dispatch(updateTimeSpan([begin, end]))
            })
            .on("start", (event) => {
                dispatch(updateSelectedDate([]))
            })
            // //坐标轴赋值
        this.yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.y).ticks(5))
            .call(g => g.select(".domain").remove())
        this.xAxis = g => g
            .attr("transform", `translate(0,${this.height+4 - this.margin.bottom})`)
            .call(d3.axisBottom(this.time).ticks(this.width / 80).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())

        //svg创建
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        this.svg.append('g').call(this.xAxis);
        this.svg.append('g').call(this.yAxis);

        //绘制折线
        // this.svg.append('path')
        //         .datum(data)
        //         .attr("fill", "none")
        //         .attr("stroke", "#364fc7")
        //         .attr("stroke-width", 0.8)
        //         .attr("stroke-linejoin", "round")
        //         .attr("stroke-linecap", "round")


        //画散点
        this.scatter = this.svg.selectAll('circle.scatter')
            .data(data)
            .join('circle')
            // .join('circle')
            .classed('scatter', true)
            .attr('cx', (d, i) => this.x(i))
            .attr('cy', d => this.y(d.x))
            .attr('r', 3)
            .attr('id', (d, i) => d.date)
            // .attr('date',(d,i)=> d.date)
            .attr('stroke-width', 0.1)
            .attr('stroke', 'gray')
            // .attr('opacity',0.8)
            .attr('fill', (d, i) => colorScale(i))
            // .attr('fill',(d,i) => {
            // let date = new Date(d.date) 
            // return colorScale(date.getMonth())})
            //添加brush
        this.svg.append('g')
            .attr('class', 'timeline-brush')
            .call(this.brush);



        // this.update(dispatch);
    }

    // 更新数据，重绘视图
    update(selectedDate, dispatch) {
        //删除原有svg
        d3.select('g.timeline-selectedDate').remove();

        if (selectedDate.length > 0) {
            this.svg.append('g')
                .attr('class', 'timeline-selectedDate')
                .selectAll('path.selectedTick')
                .data(selectedDate)
                .join('path')
                .attr('d', this.symbol)
                .attr('class', 'selectedTick')
                .attr("transform", d => {
                    return `translate(${this.x(this.parseDate(d))},${0}) rotate(180) scale(1.5)`;
                })
                // .attr('fill', (d, i) => i==0?'black': 'none')
                .attr('opacity', 0.4)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
        }

    }

    drawPath(data, xScale, yScale) {

        let path = d3.path();
        path.moveTo(xScale(data[0].x), yScale(data[0].y));
        data.slice(1, data.length).forEach((value, index, array) => {
            path.lineTo(xScale(array[index].x), yScale(array[index].y))
        });
        return path;
    }



};

export default new chart();