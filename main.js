
const links = ['Games', 'Movies', 'Data']

d3.select('body')
    .append('ul')
    .attr('id', 'links')
    .selectAll('li')
    .data(links)
    .enter()
        .append('li')
        .append('button')
        .attr('onclick', d => d[0].toLowerCase() === 'g' ? 'init(\'g\')' : d[0].toLowerCase() === 'm' ? 'init(\'m\')' : 'init(\'d\')')
        .text(d => d)

init('g');

function init(l) {

    if (document.getElementById('svg') !== null) {
        document.getElementById('svg').remove()
        document.getElementById('title').remove()
        document.getElementById('description').remove()
        document.getElementById('tooltip').remove()
    }

    let link = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/';
    if (l === 'g') {
        let title = 'Game Sales'
        let description = 'Most Sold Games Grouped By Platform'
        link += 'video-game-sales-data.json';
        getData(link, title, description)
    } else if (l === 'm') {
        let title = 'Movie Sales'
        let description = 'Most Sold Movies Grouped By Category'
        link += 'movie-data.json';
        getData(link, title, description)
    } else {
        let title = 'Data Set'
        let description = 'Most Sold Data Set'
        link += 'kickstarter-funding-data.json';
        getData(link, title, description)
    }
}

function getData(l, t, d) {
    d3.json(l)
    .then(result => {
        tDiagram(result, t, d);
    });
}

function tDiagram(dataset, title, description) {

    d3.select('body')
        .append('h2')
        .attr('id', 'title')
        .text(title)

    d3.select('body')
        .append('h3')
        .attr('id', 'description')
        .text(description)

    const width = 1050
    const height = 600
    const padding = 200
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const treemap = dataset => d3.treemap()
        .size([width - padding, height - padding])
        .padding(1)
        (d3.hierarchy(dataset)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value))

    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .attr('width', d => 100)
        .attr('height', 200)
        .style('visibility', 'hidden')
    
    const root = treemap(dataset);

    const { DOM } = new observablehq.Library

    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width - padding)
        .attr('height', height)

    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)

    leaf.append('rect')
        .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
        .attr('class', 'tile')
        .attr('fill', d => {
            while (d.depth > 1) {
                d = d.parent;
            }
            return color(d['data']['name'])
        })
        .style('position', 'relative')
        .attr('data-name', d => d['data']['name'])
        .attr('data-category', d => d['data']['category'])
        .attr('data-value', d => d['data']['value'])
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .on('mouseover', d => {
            tooltip.style('visibility', 'visible')
            tooltip.attr('data-value', d['data']['value'])
            tooltip.html(`Name: ${d['data']['name']} <br> 
                          Category: ${d['data']['category']} <br>
                          Value: ${d['data']['value']}`)
                   .style('top', d3.event['screenY'] - 120)
                   .style('left', d3.event['screenX'] + 20)
        })
        .on('mouseout', d => tooltip.style('visibility', 'hidden'))

    leaf.append('clipPath')
        .attr('id', d => (d.clipUid = DOM.uid('leaf')).id)
        .append('use')
        .attr('xlink:href', d => d.leafUid.href)

    leaf.append('text')
            .attr('clip-path', d => d.clipUid)
        .selectAll('tspan')
        .data(d => d['data']['name'].split(/(?=[A-Z][^A-Z])/g))
        .join('tspan')
            .attr('x', 3.5)
            .attr('y', (d, i, nodes) => `${0.5 + (i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .style('font-size', '0.6rem')
            .style('font-family', 'verdana')
            .text(d => d)

    const colors = ['blue', 'green']

    // d3.select('body')
    svg.append('g')
            .attr('id', 'legend')
        .selectAll('rect')
        .data(['blue', 'orange'])
        .enter()
        .append('rect')
            .attr('class', 'legend-item')
            .attr('x', 400)
            .attr('y', (d, i) => {return i * 20})
            .attr('width', '1rem')
            .attr('height', '1rem')
            // .attr('y', 10)
            .attr('fill', d => d)



}






