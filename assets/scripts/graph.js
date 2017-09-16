const drawGraph = (data, nodes, opts) => {
  const svg = nodes.graph.root
  const savings = nodes.graph.savings
  const profit = nodes.graph.profit
  const trajectory = nodes.graph.trajectory
  const usage = nodes.graph.usage

  const x = {
    min: 0,
    max: svg.clientWidth,
    scale: opts.max_year, //x axis is years, from 0..120
  }
  x.range = x.max - x.min

  const y = {
    min: 0,
    max: svg.clientHeight,
    scale: opts.max_sum, //Values may go as high as the sky, but one million is the limit for now.
  }
  y.range = y.max - y.min

  const viewBox = [x.min, y.min, x.range, y.range].join(' ')
  //transform coordinate system to start from bottom left
  const transform = 'translate(0, '+(y.min * 2 + y.range)+') scale(1,-1)'

  const savingsPoints = data.savings.map(point => convertPoint(point, x, y)).join(' ')
  const profitPoints = data.profit.map(point => convertPoint(point, x, y)).join(' ')
  const trajectoryPoints = data.trajectory.map(point => convertPoint(point, x, y)).join(' ')
  const usagePoints = data.usage.map(point => convertPoint(point, x, y)).join(' ')


  svg.setAttribute('viewBox', viewBox)

  savings.setAttributeNS(null, 'points', savingsPoints)
  savings.setAttributeNS(null, 'transform', transform)

  profit.setAttributeNS(null, 'points', profitPoints)
  profit.setAttributeNS(null, 'transform', transform)

  trajectory.setAttributeNS(null, 'points', trajectoryPoints)
  trajectory.setAttributeNS(null, 'transform', transform)

  usage.setAttributeNS(null, 'points', usagePoints)
  usage.setAttributeNS(null, 'transform', transform)
}


const convertPoint = (point, x, y) => {
  //Scale year & value to match svg viewbox by dividing with max desired value and multiplying by max desired pixel width of canvas
  const year = point.year / x.scale * x.range
  const value = point.value / y.scale * y.range

  //Convert data point to svg path point
  return `${year},${value}`
}
