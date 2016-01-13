/**
 * Created by lirui on 16-1-8.
 */

var d3 = require("d3");

d3.select("body")
    .append('div')
    .style('border', '1px black solid')
    .html('hello, world');


var loadJson = function () {
    var colorMap = d3.scale.linear().interpolate(d3.interpolateHsl).domain([2, 20]).range(['darkgreen', 'red']);
    var radioMap = d3.scale.linear().domain([2, 20]).range([10, 20]);
    var opacityMap = d3.scale.linear().domain([2, 20]).range([.25, .75]);
    d3.json('/data.json', function (data) {
        var xExtent = d3.extent(data, function (d) {
            return d.x;
        });
        var yExtent = d3.extent(data, function (d) {
            return d.y;
        });
        var xScale = d3.scale.linear().domain(xExtent).range([50, 850]);
        var yScale = d3.scale.linear().domain(yExtent).range([50, 450]);

        var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
        var yAxis = d3.svg.axis().scale(yScale).orient("right");

        d3.select('svg').append('g').attr('id', 'xAxisG').call(xAxis);
        d3.select('svg').append('g').attr('id', 'yAxisG').call(yAxis);

        d3.selectAll('path.domain').style('fill', 'none').style('stroke', 'black');
        d3.selectAll('line').style('stroke', 'black');

        var g = d3.select('svg')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'dataG')
            .attr('transform', function (d) {
                return 'translate(' + xScale(d.x) + ',' + yScale(d.y) + ')';
            })
            .on('mouseover', function (d) {
                d3.select(this).select('circle').style('stroke-width', "3px")
            })
            .on('mouseout', function () {
                d3.select(this).select('circle').style('stroke-width', '1px')
            });
        g.append('circle')
            .style('fill', 'white')
            .style('stroke', 'black')
            .style('stroke-width', '1px')
            .attr('r', 5)
            .transition()
            .duration(1000)
            .style('fill', function (d) {
                return colorMap(d.count);
            })
            .attr('r', function (d) {
                return radioMap(d.count);
            });
        g.append('text')
            .style('text-anchor', 'middle')
            .attr('y', function (d) {
                return 5;
            })
            .style('opacity', 0)
            .text(function (d) {
                return d.index;
            })
            .transition()
            .duration(1000)
            .style('opacity', 1);
        var tr = d3.select('div.table')
            .append('table')
            .selectAll('tr')
            .data(data)
            .enter()
            .append('tr');
        tr.append('th')
            .html(function (d) {
                return d.name;
            });
        tr.append('td')
            .html(function (d) {
                return d.count
            });
        //d3.select('svg')
        //    .selectAll('circle')
        //    .data(data)
        //    .enter()
        //    .append('rect')
        //    .attr('width', 5)
        //    .attr('height', 0)
        //    .style('fill', function (d) {
        //        return colorMap(d.count)
        //    })
        //    .attr('x', function (d) {
        //        return d.index * 6;
        //    })
        //    .attr('y', 500)
        //    .transition()
        //    .duration(500)
        //    .attr('y', function (d) {
        //        return 500 - d.count * 20;
        //    })
        //    .attr('height', function (d) {
        //        return d.count * 20;
        //    });
        //.append('circle')
        //.attr('r', function (d) {
        //    return d.count
        //})
        //.attr('cx', function (d) {
        //    return d.index * 40;
        //})
        //.attr('cy', function (d) {
        //    return d.index * 40;
        //})
        //.style('opacity', function (d) {
        //    return opacityMap(d.count)
        //})
        //.transition()
        //.duration(3000)
        //.attr('cx', 200)
        //.transition()
        //.duration(3000)
        //.attr('cy', 200);
    });
};

var complexObject = function () {
    d3.csv("/static/boxplots.csv", function (data) {
        var xScale = d3.scale.linear().domain([1, 8]).range([20, 470]);
        var yScale = d3.scale.linear().domain([0, 100]).range([480, 20]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .ticks(8)
            .tickSize(-470);
        d3.select('svg').append('g')
            .attr('transform', 'translate(470, 0)')
            .attr('id', 'yAxisG')
            .call(yAxis);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickSize(-470)
            .tickValues([1, 2, 3, 4, 5, 6, 7]);
        d3.select('svg').append('g')
            .attr('transform', 'translate(0, 480)')
            .attr('id', 'xAxisG')
            .call(xAxis);

        d3.select('#xAxisG > path.domain').style('display', 'none');

        d3.select('svg').selectAll('circle.median')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'tweets')
            .attr('r', 5)
            .attr('cx', function (d) {
                return xScale(d.day)
            })
            .attr('cy', function (d) {
                return yScale(d.median)
            })
            .style('fill', 'darkgray');

        var strokeWidth = '3px';
        d3.select('svg').selectAll('g.box')
            .data(data).enter()
            .append('g')
            .attr('class', 'box')
            .on('mouseover', function (d) {
                d3.select(this)
                    .selectAll('line')
                    .style('stroke-width', '4px')
                    .style('stroke', 'red');
                d3.select(this)
                    .selectAll('rect')
                    .style('stroke-width', '4px')
                    .style('stroke', 'red');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .selectAll('line')
                    .style('stroke-width', strokeWidth)
                    .style('stroke', 'black');
                d3.select(this)
                    .selectAll('rect')
                    .style('stroke-width', strokeWidth)
                    .style('stroke', 'black');
            })
            .attr('transform', function (d) {
                return 'translate(' + xScale(d.day) + "," + yScale(d.median) + ")";
            }).each(function (d, i) {
                d3.select(this)
                    .append('line')
                    .attr('class', 'range')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', yScale(d.max) - yScale(d.median))
                    .attr('y2', yScale(d.min) - yScale(d.median))
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);

                d3.select(this)
                    .append('line')
                    .attr('class', 'range')
                    .attr('x1', -10)
                    .attr('x2', 10)
                    .attr('y1', yScale(d.max) - yScale(d.median))
                    .attr('y2', yScale(d.max) - yScale(d.median))
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);

                d3.select(this)
                    .append('line')
                    .attr('class', 'range')
                    .attr('x1', -10)
                    .attr('x2', 10)
                    .attr('y1', yScale(d.min) - yScale(d.median))
                    .attr('y2', yScale(d.min) - yScale(d.median))
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);

                d3.select(this)
                    .append('rect')
                    .attr('x', -10)
                    .attr('y', yScale(d.q3) - yScale(d.median))
                    .attr('width', 20)
                    .attr('height', yScale(d.q1) - yScale(d.q3))
                    .style('fill', 'white')
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);

                d3.select(this)
                    .append('line')
                    .attr('class', 'range')
                    .attr('x1', -10)
                    .attr('x2', 10)
                    .attr('y1', 0)
                    .attr('y2', 0)
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);


            });

        var drawLine = function (y, interpolate) {
            var medianLine = d3.svg.line()
                .x(function (d) {
                    return xScale(d.day)
                })
                .y(function (d) {
                    return yScale(d[y])
                });
            if (interpolate) {
                medianLine = medianLine.interpolate(interpolate);
            }
            d3.select('svg')
                .append('path')
                .attr('d', medianLine(data))
                .attr('fill', 'none')
                .attr('stroke', 'darkred')
                .attr('stokewidth', strokeWidth);
        };

        drawLine("median");
        drawLine("max", 'basis');
        drawLine("min", 'cardinal');
        drawLine("q1", 'step');
        drawLine("q3");
    });
};

var drawMovies = function () {
    function simpleStacking(incomingData, incomingAttribute) {
        var newHeight = 0;
        for (var x in incomingData) {
            if (x == 'day') {
                continue;
            }

            newHeight += parseInt(incomingData[x]);
            if (x == incomingAttribute) {
                break;
            }
        }

        return newHeight;
    }

    d3.csv('/static/movies.csv', function (data) {
        var xScale = d3.scale.linear().domain([1, 10]).range([20, 470]);
        var yScale = d3.scale.linear().domain([-100, 100]).range([480, 20]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .ticks(8)
            .tickSize(-470);
        d3.select('svg').append('g')
            .attr('transform', 'translate(470, 0)')
            .attr('id', 'yAxisG')
            .call(yAxis);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickSize(-480)
            .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        d3.select('svg').append('g')
            .attr('transform', 'translate(0, 480)')
            .attr('id', 'xAxisG')
            .call(xAxis);

        var fillScale = d3.scale.linear()
            .domain([0, 5])
            .range(['lightgray', 'black']);

        var n = 0;
        for (var x in data[0]) {
            if (x == 'day') {
                continue;
            }

            var movieArea = d3.svg.area()
                .x(function (d) {
                    return xScale(d.day)
                })
                .y(function (d) {
                    return yScale(simpleStacking(d, x))
                })
                .y0(function (d) {
                    return yScale(simpleStacking(d, x) - d[x])
                })
                .interpolate('basis');
            d3.select('svg')
                .append('path')
                .style('id', x + 'Area')
                .attr('d', movieArea(data))
                .attr('fill', fillScale(n))
                .attr('stroke', 'none')
                .attr('stroke-width', 2)
                .style('opacity', .5);

            n++;
        }
    });
};

drawMovies();
