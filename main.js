
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
        d3.json(link)
            .then(result => {
                tDiagram(result, title, description);
            });
    } else if (l === 'm') {
        let title = 'Movie Sales'
        let description = 'Most Sold Movies Grouped By Category'
        link += 'movie-data.json';
        d3.json(link)
            .then(result => {
                tDiagram(result, title, description);
            });
    } else {
        let title = 'Data Set'
        let description = 'Most Sold Data Set'
        link += 'kickstarter-funding-data.json';
        d3.json(link)
            .then(result => {
                tDiagram(result, title, description);
            });
    }
}


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


function tDiagram(dataset, title, description) {

    d3.select('body')
        .append('h2')
        .attr('id', 'title')
        .text(title)

    d3.select('body')
        .append('h3')
        .attr('id', 'description')
        .text(description)

    const width = 800
    const height = 400
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const treemap = dataset => d3.treemap()
        .size([width, height])
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

    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', width)
        .attr('height', height)

    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)

    leaf.append('rect')
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
        })
        .on('mouseout', d => tooltip.style('visibility', 'hidden'))

        const colors = ['blue', 'green']

        d3.select('body')
            .append('div')
            .attr('id', 'legend')
            .selectAll('rect')
            .data(colors)
            .enter()
                .append('rect')
                .attr('width', '1rem')
                .attr('height', '1rem')
                .attr('x', 400)
                .attr('y', 200)
                .attr('class', 'legend-item')
                .attr('fill', d => d)


}






