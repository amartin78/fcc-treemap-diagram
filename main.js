
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
    .then(result => {
        tDiagram(result);
    });


function tDiagram(dataset) {

    // console.log(dataset)

    d3.select('body')
        .append('h2')
        .attr('id', 'title')
        .text('Movie Sales')

    d3.select('body')
        .append('h3')
        .attr('id', 'description')
        .text('Most Sold Movies Grouped By Category')

    const width = 800
    const height = 400

    const treemap = dataset => d3.treemap()
        // .tile(d => {console.log(d)})
        .size([width, height])
        .padding(1)
        // .round(true)
        (d3.hierarchy(dataset)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value))

    // console.log(treemap)

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
        .attr('width', width)
        .attr('height', height)

    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)

    leaf.append('rect')
        // .attr('id', d => (d.leafUID = window.uid('leaf').id))
        .attr('class', 'tile')
        .style('position', 'relative')
        .attr('fill', 'blue')
        .attr('data-name', d => d['data']['name'])
        .attr('data-category', d => d['data']['category'])
        .attr('data-value', d => {
            console.log(d)
            return d['data']['value']
        })
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .on('mouseover', d => {
            tooltip.style('visibility', 'visible')
            // console.log(d['value'])
            tooltip.attr('data-value', d['data']['value'])
        })
        .on('mouseout', d => tooltip.style('visibility', 'hidden'))

    // d3.select('body')
        svg.append('div')
            .attr('id', 'legend')
            .append('rect')
            .attr('class', 'legend-item')


    
        

    




    





    

}

