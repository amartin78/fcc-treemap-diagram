
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
    .then(result => {
        tDiagram(result);
    });


function tDiagram(dataset) {

    // console.log(dataset)

    d3.select('body')
        .append('h2')
        .attr('id', 'title')
        .text('Title')

    d3.select('body')
        .append('h3')
        .attr('id', 'description')
        .text('Description')

    const treemap = dataset => d3.treemap()
        .tile(d => d)
        .size([100, 200])
        .padding(1)
        .round(true)
        (d3.hierarchy(dataset)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))

    console.log(treemap)

    const root = treemap(dataset);

    const svg = d3.create('svg')
        .attr('viewBox', [0, 0, 100, 200])

    const leaf = d3.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `transform($(d.x0),$(d.y0)`)

    leaf.append('rect')
        // .attr('id', d => (d.leafUID = window.uid('leaf').id))
        .attr('class', 'tile')
        .attr('fill', 'blue')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)

    d3.select('body')
        .append('div')
        .attr('id', 'legend')

    




    





    

}

