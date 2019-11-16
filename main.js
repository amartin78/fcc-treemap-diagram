
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
        let elems = ['svg', 'title', 'description', 'tooltip']
        elems.forEach(function(e) {
            document.getElementById(e).remove()
        })
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

    let color = d3.scaleOrdinal().domain(root['children'])
                .range(["rgb(69,63,188)", "rgb(88,181,225)", "rgb(179,228,103)", "rgb(73,139,163)", "rgb(176,164,216)", "rgb(226,109,248)", "rgb(99,161,34)", "rgb(207,75,34)", "rgb(124,219,116)", "rgb(202,98,133)", "rgb(231,173,121)", "rgb(33,122,41)", "rgb(250,33,127)", "rgb(244,212,3)", "rgb(123,39,80)", "rgb(86,47,255)", "rgb(161,19,178)", "rgb(168,104,40)", "rgb(114,229,239)", "rgb(45,89,90)", "rgb(17,160,170)", "rgb(154,232,113)", "rgb(35,137,16)", "rgb(177,191,129)", "rgb(106,127,47)", "rgb(0,214,24)", "rgb(51,74,171)", "rgb(184,138,230)", "rgb(105,27,158)", "rgb(177,200,235)", "rgb(104,55,79)", "rgb(167,45,112)", "rgb(207,96,243)", "rgb(251,9,152)", "rgb(254,22,244)", "rgb(63,22,249)"])

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
        .attr('id', d => (d.clipUid = DOM.uid('clip')).id)
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

    let legend = svg.append('g')
                    .attr('id', 'legend')

    legend.selectAll('rect')
            .data(root['children'])
            .enter()
            .append('rect')
                .attr('class', 'legend-item')
                .attr('x', (d, i) => {return 200 + i * 20})
                // .attr('y', (d, i) => {return 420 + i * 20})
                .attr('y', 420)
                .attr('width', '1rem')
                .attr('height', '1rem')
                .attr('fill', (d, i) => {
                    return color(d['data']['name'])
                })

    legend.selectAll('text')
            .data(root['children'].slice(0, 6))
            .enter()
            .append('text')
                .attr('x', (d, i) => { return 200 })
                .attr('y', (d, i) => { return 460 + i * 20 })
                .text(d => d['data']['name'])

    legend.selectAll('text')
            .data(root['children'].slice(6, 12))
            .enter()
            .append('text')
                .attr('x', (d, i) => { 
                    console.log(i)
                    return 300 
                })
                .attr('y', (d, i) => { return 460 + i * 20 })
                .text(d => d['data']['name'])

    let t = root['children']

    // console.log(t.slice(0,6))
    // console.log(t.slice(6,12))
            





}






