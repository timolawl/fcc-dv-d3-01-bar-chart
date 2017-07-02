
//cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js

// FCC: Visualize Data with a Bar Chart
// User Story: I can see US Gross Domestic Product by quarter, over time.
// User Story: I can mouse over a bar and see a tooltip with the GDP amount and exact year and month that bar represents.

var Chart = (function(window, d3) {

  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

  var margin, width, height;
  var GDPdata, x, y, xAxis, yAxis, svg, chartWrapper, bars, div, dateRange;
  var dateFormat = d3.time.format('%Y-%m-%d');

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  d3.json(url, init);

  function init(json) {
    GDPdata = json.data;

    var dates = GDPdata.map(function(dataPoint) { return dataPoint[0]; });
    var GDP = GDPdata.map(function(dataPoint) { return dataPoint[1]; });

    var startYear = dateFormat.parse(dates[0]).getFullYear();
    var endYear = dateFormat.parse(dates[dates.length - 1]).getFullYear();
    dateRange = endYear - startYear;

    x = d3.time.scale()
      .domain([dateFormat.parse(dates[0]), d3.time.year.offset(dateFormat.parse(dates[dates.length - 1]), 1)]);

    y = d3.scale.linear()
      .domain([0, d3.max(GDP)]);


    xAxis = d3.svg.axis()  
      .orient('bottom');
        

    yAxis = d3.svg.axis()      
      .orient('left');

    svg = d3.select('.chart').append('svg');

    chartWrapper = svg.append('g');

    div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    chartWrapper.append('g')
      .attr('class', 'axis axis--x');

    chartWrapper.append('text')
      .attr('class', 'label label--title')  
      .style('text-anchor', 'middle')
      .text('Gross Domestic Product');

    chartWrapper.append('text')
      .attr('class', 'label label--full')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Units: Billions of Dollars Seasonal Adjustment: Seasonally Adjusted Annual Rate Notes: A Guide to the National Income and Product Accounts of the United States (NIPA)');
    
    chartWrapper.append('text')
      .attr('class', 'label label--part1')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Units: Billions of Dollars Seasonal Adjustment: Seasonally Adjusted');

    chartWrapper.append('text')
      .attr('class', 'label label--part2')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Annual Rate Notes: A Guide to the National Income and Product Accounts of the United States (NIPA)');
    
    chartWrapper.append('text')
      .attr('class', 'label label--link')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .append('a')
      .attr('xlink:href', '//bea.gov/national/pdf/nipaguid.pdf')
      .text('(http://www.bea.gov/national/pdf/nipaguid.pdf)');

    chartWrapper.append('g')
      .attr('class', 'axis axis--y');
    
    chartWrapper.append('text')
      .attr('class', 'label label--gdp')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Gross Domestic Product, USA');
    
    chartWrapper.append('text')
      .attr('class', 'label label--gdpacronym')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('GDP, USA');
    
    bars = chartWrapper.selectAll('.bar')
      .data(GDPdata)
      .enter().append('rect')
      .attr('class', 'bar')
    
      .on('mouseover', function(d) {
        d3.select(this).attr('class', 'bar active');
        div.transition()
          .duration(200)
          .style('opacity', 0.9);
        div.html('<span class="GDP GDP--amount">$' + d[1].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion</span><br><span class="GDP GDP--date">' + dateFormat.parse(d[0]).getFullYear() + ' - ' + monthNames[dateFormat.parse(d[0]).getMonth()] + '</span>')
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY - 56) + 'px');
      })

      .on('mouseout', function(d) {
        d3.select(this).attr('class', 'bar');
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });

      render();
  }

  function render() {
    updateDimensions();

    x.range([0, width]);
    y.range([height, 0]);

    svg.attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom);

    chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    xAxis.scale(x)
      .ticks(Math.ceil(Number(dateRange) / 5));
    if (window.innerWidth < 800) {
      xAxis.ticks(Math.ceil(Number(dateRange) / 10));
    }
    yAxis.scale(y);
    if (window.innerHeight < 450) {
      yAxis.ticks(3);
    }
    else yAxis.ticks(10);

    svg.select('.axis.axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.select('.axis.axis--y')
      .call(yAxis);

    svg.select('.label.label--title')
      .attr('x', width/2)
      .attr('y', -40);

    svg.select('.label.label--full')
      .attr('x', width/2)
      .attr('y', height + 40);

    svg.select('.label.label--part1')
      .attr('x', width/2)
      .attr('y', height + 40);

    svg.select('.label.label--part2')
      .attr('x', width/2)
      .attr('y', height + 55);
   
    
    if(window.innerWidth > 1100) {
      svg.select('.label.label--link')
        .attr('x', width/2)
        .attr('y', height + 55);
    }
    else {
      svg.select('.label.label--link')
        .attr('x', width/2)
        .attr('y', height + 70);
    }
    

    bars.attr('width', width/GDPdata.length + 1)
        .attr('height', function(d) { return height - y(d[1]); })
        .attr('x', function(d) { return x(new Date(d[0])); })
        .attr('y', function(d) { return y(d[1]); });
    
  }

  function updateDimensions() {
    margin = {top: 100, right: 40, bottom: 80, left: 80};
    
    if(window.innerWidth < 1100) {
      margin.bottom = 100;
    }
    
    width = window.innerWidth * 0.8 - margin.left - margin.right;
    height = window.innerHeight * 0.8 - margin.top - margin.bottom;
    
  }

  return {
    render: render
  }
  
})(window, d3);

window.addEventListener('resize', Chart.render);



