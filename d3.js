var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  // Zoom feature
  // TODO: Figure out how to zoom separate groups
  var zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", zoomed);

  svg.call(zoom);

  function zoomed() {
    container.attr("transform", d3.event.transform);
  }

  // Container group that holds all visualized elements
  var container = svg.append("g");

  // Color scale for the nodes
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Code in charge of node and link simulation
  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody());

  // Lists that store the nodes and links information
  var nodes = [];
  var links = [];

  var link = container.append("g")
      .attr("class", "links")
    .selectAll("line");

  var node = container.append("g")
      .attr("class", "nodes")
    .selectAll("g");

  // Function that is run after updating any of the nodes or links lists
  function updateGraph() {
    // Update the links
    link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
    link.exit().remove();
    var linkEnter = link.enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); }) // width of the line (based on value)
        .attr("transform", "translate(250, 250)");                        // spawn coordinates (same as nodes)
    link = linkEnter.merge(link);

    // Update the nodes
    node = node.data(nodes, function(d) { return d.id; });
    node.exit().remove();
    var nodeEnter = node.enter().append("g")
    var circles = nodeEnter.append("circle")
        .attr("r", 15)                                        // radius of the circle
        .attr("fill", function(d) { return color(d.group); }) // fill color of the circle (based on color scale)
        .style("cursor", "pointer")                           // cursor style on hover
        .attr("transform", "translate(250, 250)");            // spawn coordinates (I think this is the center of the svg)

    // Allows the nodes to be dragged
    var drag_handler = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    drag_handler(nodeEnter);

    // Adding labels to the nodes
    var labels = nodeEnter.append("text")
        .text(function(d) { return d.id; })                   // Text value of the label
        .attr('x', 0)                                         // x position of the label (relative to the node)
        .attr('y', 3)                                         // y position of the label (relative to the node)
        .attr("text-anchor", "middle")                        // text anchor is in the middle so it's centered
        .style("fill", "white")                               // text color (white)
        .style("cursor", "pointer")                           // cursor style on hover
        .attr("transform", "translate(250, 250)");            // spawn coordinates (same as nodes)

    // No idea what this does
    nodeEnter.append("title")
        .text(function(d) { return d.id; });

    node = nodeEnter.merge(node);

    // Restart the simulation
    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links).strength(0.1);
    simulation.alpha(1).restart();
  }

  // Function that is run every tick of the simulation
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
  }

  // Functions that handle dragging of nodes
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Function to add a node
  function addNode(id, group) {
    nodes.push({id: id, group: group});
    updateGraph();
  }

  // Function to add a link
  function addLink(sourceId, targetId, value) {
    links.push({source: sourceId, target: targetId, value: value});
    updateGraph();
  }

  // Function to remove a node
  function removeNode(id) {
    nodes = nodes.filter(n => n.id !== id);
    links = links.filter(l => l.source.id !== id && l.target.id !== id);
    updateGraph();
  }

  // Function to remove a link
  function removeLink(sourceId, targetId) {
    links = links.filter(l => !(l.source.id === sourceId && l.target.id === targetId));
    updateGraph();
  }

  // Add button event listener
  document.getElementById("addNodeBtn").addEventListener("click", function() {
    var newNodeId = (nodes.length + 1);
    addNode(newNodeId, Math.floor(Math.random() * 10));
    addLink(nodes[Math.floor(Math.random() * nodes.length)].id, newNodeId, 1);
  });

  // List visualization
  // List of visualized lists
  var lists = [];

  // Function to add a list
  function addList(values, name) {

    // Initializing the list group
    var listGroup = container.append("g")
                              .attr("class", "list")
                              .attr("transform", "translate(" + 250 + ", " + 250 + ")");

    // Drag behavior for the list
    var dragList = d3.drag()
      .on("start", function() {
        d3.select(this).raise().classed("active", true);
      })
      .on("drag", function() {
        var dx = d3.event.dx;
        var dy = d3.event.dy;
        var currentTransform = d3.select(this).attr("transform");
        var translate = currentTransform.match(/translate\((.+),(.+)\)/);
        var x = parseFloat(translate[1]) + dx;
        var y = parseFloat(translate[2]) + dy;
        d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
      })
      .on("end", function() {
        d3.select(this).classed("active", false);
      });

    // Adding the list name label
    var listName = listGroup.append("text")
                            .attr("x", 0)
                            .attr("y", -5)
                            .attr("fill", "white")
                            .style("cursor", "pointer")
                            .text(name || "List");

    listGroup.call(dragList);

    // Adding the list values to the list
    updateList(listGroup, values);

    // Adding the list to the lists array
    lists.push(listGroup);
  }

  // Function to update a list
  function updateList(listGroup, listValues) {
    // Function to add rectangles for each value in the list
    var rects = listGroup.selectAll("rect")
                         .data(listValues);

    rects.exit().remove();

    var rectEnter = rects.enter().append("rect")
        .attr("x", function(d, i) { return i * 30; })         // x position is based on index
        .attr("y", 0)                                         // y position is always 0 relative to the list group
        .attr("width", 25)                                    // width of the rectangle (TODO: Make this dynamic)
        .attr("height", 25)                                   // height of the rectangle (Not dynamic for now)
        .attr("fill", "steelblue")                            // color of the rectangle
        .style("cursor", "pointer")                           // cursor style on hover
        .attr("class", "rect")                                // class for adding styles if needed
        .attr("rx", 3);                                       // rounded corners

    rects = rectEnter.merge(rects);

    rects.transition().duration(500)
        .attr("x", function(d, i) { return i * 30; });


    // Function to add the text values for each value in the list
    var values = listGroup.selectAll("text.value")
                          .data(listValues);

    values.exit().remove();

    var valueEnter = values.enter().append("text")
        .attr("class", "value")                               // class for adding styles if needed
        .attr("x", function(d, i) { return i * 30 + 12.5; })  // x position is based on index and a constant offset so it's on the right
        .attr("y", 16)                                        // y position is always 16 relative to the list group so it's at the top
        .attr("text-anchor", "middle")                        // text anchor is in the middle so it's centered
        .attr("fill", "white")                                // text color (white)
        .text(function(d) { return d; })                      // text value (what is seen)
        .style("cursor", "pointer");                          // cursor style on hover
    
    values = valueEnter.merge(values);

    values.transition().duration(500)
        .attr("x", function(d, i) { return i * 30 + 12.5; })
        .text(function(d) { return d; });

    // Function to add the index values for each value in the list
    var indices = listGroup.selectAll("text.index")
                          .data(listValues);

    indices.exit().remove();

    var indexEnter = indices.enter().append("text")
        .attr("class", "index")                               // class for adding styles if needed   
        .attr("x", function(d, i) { return i * 30 + 12.5; })  // x position is based on index (not sure why the constant offset is needed)
        .attr("y", 35)                                        // y position is always 35 relative to the list group so it's at the bottom
        .attr("text-anchor", "middle")                        // text anchor is in the middle so it's centered
        .attr("fill", "white")                                // text color (white)
        .style("font-size", "8px")                            // font size (8px)    
        .text(function(d, i) { return "[" + i + "]"; })       // text value (what is seen)
        .style("cursor", "pointer");                          // cursor style on hover

    indices = indexEnter.merge(indices);

    indices.transition().duration(500)
        .attr("x", function(d, i) { return i * 30 + 12.5; })
        .text(function(d, i) { return "[" + i + "]"; });
  }

  // Add button event listener for adding lists
  document.getElementById("addListBtn").addEventListener("click", function() {
    var newListValues = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
    addList(newListValues, "List " + (lists.length + 1));
  });

  document.getElementById("changeListBtn").addEventListener("click", function() {
    var newListValues = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
    changeList(0, newListValues);
  });

  function changeList(listIndex, values) {
    updateList(lists[listIndex], values);
  }

  // Test functions I made to familiarize myself with the library

  function logListContents() {
    lists.forEach((list, index) => {
      var values = list.selectAll("text.value");
      var valueArray = values.data().map(d => d);
      console.log(`List ${index + 1}: ${valueArray}`);
    });
  }

  function logListPositions() {
  lists.forEach((list, index) => {
    var transform = list.attr("transform");
    var translate = transform.substring(transform.indexOf("(")+1, transform.indexOf(")")).split(",");
    var x = parseFloat(translate[0]);
    var y = parseFloat(translate[1]);
    console.log(`List ${index + 1}: x = ${x}, y = ${y}`);
  });
  }
  function randomizeListPositions() {
    lists.forEach((list, index) => {
      var x = Math.floor(Math.random() * 500);
      var y = Math.floor(Math.random() * 500);
      list.attr("transform", "translate(" + x + ", " + y + ")");
    });
  }

  function randomizeNodePositions() {
    nodes.forEach(node => {
      node.x = Math.floor(Math.random() * 500);
      node.y = Math.floor(Math.random() * 500);
    });
    updateGraph();
  }

  function removeAllLinks() {
    links = [];
    updateGraph();
  }

  function removeAllNodes() {
    nodes = [];
    updateGraph();
  }

  function removeAllLists() {
    lists = [];
    container.selectAll(".list").remove();
  }

  function randomlyAddLinks() {
    var numLinks = nodes.length;
    for (var i = 0; i < numLinks; i++) {
      var sourceIndex = i;
      var targetIndex = Math.floor(Math.random() * nodes.length);
      addLink(nodes[sourceIndex].id, nodes[targetIndex].id, 1);
    }
  }

  function autoZoom() {
    var bounds = container.node().getBBox();
    var parent = container.node().parentElement;
    var fullWidth = parent.clientWidth, fullHeight = parent.clientHeight;
    var width = bounds.width, height = bounds.height;
    var midX = (1.25 * bounds.x + width) / 2, midY = bounds.y + height / 2;
    if (width === 0 || height === 0) return; // nothing to fit
    var scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    svg.transition()
        .duration(750)
        .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
  }

  // Creating a test list
  // addList([List Values], "List Name")
  addList([10, 20, 30, 40, 50], "List 1");

  // Creating a test graph
  // addNode(Node ID, Color ID)
  addNode('Daryl', 1);
  addNode('Matty', 2);
  addNode('Conner', 3);
  addNode('Jordan', 4);
  addNode('Mubashir', 5);
  addNode('Ethan', 6);
  addNode('Christian', 7);
  addNode('Rebecca', 8);

  // addLink(Source Node ID, Target Node ID, Line Width)
  addLink('Daryl', 'Matty', 1);
  addLink('Daryl', 'Conner', 1);
  addLink('Daryl', 'Jordan', 1);
  addLink('Daryl', 'Mubashir', 1);
  addLink('Daryl', 'Rebecca', 1);
  addLink('Matty', 'Conner', 1);
  addLink('Matty', 'Mubashir', 1);
  addLink('Matty', 'Ethan', 1);
  addLink('Matty', 'Christian', 1);
  addLink('Conner', 'Jordan', 1);
  addLink('Conner', 'Mubashir', 1);
  addLink('Conner', 'Rebecca', 1);
  addLink('Jordan', 'Mubashir', 1);