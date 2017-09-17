//TODO: integrate labels to graph drawing
function drawGraph (data, nodes, opts) {

  //TODO: read boundinglientrect instead of clientWidth that causes reflow

  const x = {
    min: 0,
    max: nodes.graph.clientWidth,
    scale: opts.max_year, //x axis is years, from 0..120
  }
  x.range = x.max - x.min

  const y = {
    min: 0,
    max: nodes.graph.clientHeight,
    scale: opts.max_sum, //Values may go as high as the sky, but one million is the limit for now.
  }
  y.range = y.max - y.min


  const paths = dataToPaths(data, opts, x, y)
  paths.viewBox = [x.min, y.min, x.range, y.range].join(' ')

  renderGraph(nodes, paths, x, y)
}


function dataToPaths (data, opts, x, y) {
  const savings = data.savings.map(point => convertPoint(point, x, y)).join(' ')
  const profit = data.profit.map(point => convertPoint(point, x, y)).join(' ')
  const trajectory = data.trajectory.map(point => convertPoint(point, x, y)).join(' ')
  const usage = data.usage.map(point => convertPoint(point, x, y)).join(' ')
  const divider = [{
    year: data.usage[0].year,
    value: 0
  }, {
    year: data.usage[0].year,
    value: opts.max_sum
  }].map(point => convertPoint(point, x, y)).join(' ')

  return {savings, profit, trajectory, usage, divider}
}


function convertPoint (point, x, y) {
  //Scale year & value to match svg viewbox by dividing with max desired value and multiplying by max desired pixel width of canvas
  const year = point.year / x.scale * x.range
  const value = point.value / y.scale * y.range

  //Convert data point to svg path point
  return `${year},${value}`
}


function renderGraph (nodes, paths, x, y) {
  nodes.graph.setAttribute('viewBox', paths.viewBox)
  nodes.lines.setAttributeNS(null, 'transform', 'translate(0, '+y.range+') scale(1,-1)') //transform coordinate system to start from bottom left
  nodes.savings.setAttributeNS(null, 'points', paths.savings)
  nodes.profit.setAttributeNS(null, 'points', paths.profit)
  nodes.trajectory.setAttributeNS(null, 'points', paths.trajectory)
  nodes.usage.setAttributeNS(null, 'points', paths.usage)
  nodes.divider.setAttributeNS(null, 'points', paths.divider)
}
