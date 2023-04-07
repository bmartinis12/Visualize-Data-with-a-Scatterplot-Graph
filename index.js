d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then((response, error) => {
	if (error) throw error;
	render(response);
});

const height = 500;
const width = 960;

const margin = {
	top: 60,
	right: 60,
	bottom: 60,
	left: 60
}

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.right - margin.left;

const svg = d3.select('svg') 
.attr('width', width)
.attr('height', height)

const g = svg.append('g')
.attr('transform', `translate(${margin.right}, ${margin.top})`);


const render = data => {

	//tooltip
	let tooltip = d3.select('body')
	.append('div')
	.attr('class', 'tool-tip')
	.attr('id', 'tooltip')
	.style('color', '#2f3542');

	let parseTime = d3.timeParse('%M:%S');

	// time data for y-axis
	const timeData = data.map(item => parseTime(item.Time)); 
	console.log(timeData);

	const startTime = d3.min(timeData);
	const endTime = d3.max(timeData);

	const yScale = d3.scaleTime()
	.domain([startTime, endTime])
	.range([0, innerHeight])

	// years data for x-axis
	const yearsData = data.map(item => item.Year).sort();       

	// d3 axis omits the starting value(-2) and ending value(+2)
	const startDate = d3.min(yearsData) - 2;
	const endDate = d3.max(yearsData) + 2;

	const xScale = d3.scaleTime()
	.domain([new Date(startDate, 1, 1), new Date(endDate, 1, 1)])
	.range([0, innerWidth])

	// creating axex
	const xAxis = d3.axisBottom()
	.ticks(d3.timeYear.every(2))
	.scale(xScale);       

	const yAxis = d3.axisLeft()
	.ticks(d3.timeSecond.every(15))
	.tickFormat(d => d3.timeFormat('%M:%S')(d))
	.scale(yScale);

	svg.append('g')
		.attr('transform', `translate(${margin.right}, ${innerHeight + margin.top})`)
		.attr('id', 'x-axis')
		.call(xAxis);

	svg.append('g')
		.attr('transform', `translate(${margin.right}, ${margin.top})`)
		.attr('id', 'y-axis')
		.call(yAxis);

	// adding legends
	const legend = svg.append('g')
	.attr('transform', `translate(${innerWidth + 40}, 130)`)
	.attr('id', 'legend')

	legend.append('rect')
		.attr('height', 20)
		.attr('width', 20)
		.style('fill', 'steelblue')

	legend.append('text')
		.text('With Doping Allegations')
		.attr('x', -160)
		.attr('y', 14)

	legend.append('text')
		.text('With No Doping Allegations')
		.attr('x', -182)
		.attr('y', 40)

	legend.append('rect')
		.attr('height', 20)
		.attr('width', 20)
		.attr('y', 25)
		.style('fill', 'tomato')

	g.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(new Date(d.Year, 1, 1)))
		.attr('cy', d => yScale(parseTime(d.Time)))
		.attr('r', 7)
		.attr('data-xvalue', d => new Date(d.Year, 1, 1))
		.attr('data-yvalue', d => parseTime(d.Time))
		.attr('class', 'dot')
		.attr('stroke', 'black')
		.style('fill', d => d.Doping !== '' ? 'steelblue' : 'tomato')
		.on('mouseover', d => {
		// tooltip.text('text')
		// .text('asdf')
		tooltip.attr('data-year', new Date(d.Year, 1, 1))
			.style('visibility', 'visible')
			.style('top', `${d3.event.pageY - 50}px`)
			.style('left', `${d3.event.pageX + 10}px`)
			.append('tspan')
			.attr('x', 0)
			.attr('dy', '1.6em')
			.text(d.Name)

		tooltip.append('tspan')
			.attr('x', 0)
			.attr('dy', '1.6em')
			.text(`Time: ${d.Time}, Year ${d.Year}`)

		tooltip.append('tspan')
			.attr('x', 0)
			.attr('dy', '1.6em')
			.text(`${d.Doping}`)

	})  
		.on('mouseout', d => {
		tooltip.style('visibility', 'hidden');
		d3.selectAll('tspan').remove();
	})
}
