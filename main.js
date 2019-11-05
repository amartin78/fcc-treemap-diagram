
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
    .then(result => {
        tDiagram(result);
    });


function tDiagram(dataset) {

    console.log(dataset)

    d3.select('body')
        .append('h2')
        .attr('id', 'title')
        .text('Title')

    d3.select('body')
        .append('h3')
        .attr('id', 'description')
        .text('Description')



    

}

