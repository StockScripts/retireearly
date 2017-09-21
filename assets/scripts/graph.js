//TODO: integrate labels to graph drawing
function graph (data, nodes, opts) {

  //TODO: read boundinglientrect instead of clientWidth that causes reflow

  const graphRect = nodes.graph.getBoundingClientRect()

  const x = {
    min: 0,
    max: graphRect.width,
    scale: opts.max_year, //x axis is years, from 0..120
  }
  x.range = x.max - x.min

  const y = {
    min: 0,
    max: graphRect.height,
    scale: opts.max_sum, //Values may go as high as the sky, but one million is the limit for now.
  }
  y.range = y.max - y.min


  const paths = dataToPaths(data, opts, x, y)
  paths.viewBox = [x.min, y.min, x.range, y.range].join(' ')

  const texts = getLabelTexts(data, opts)
  const coords = getLabelCoords(data, opts)

  requestAnimationFrame(() => {
    renderGraph(nodes, paths, x, y)
    renderLabels(nodes, texts, coords, opts)
  })
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





function getLabelTexts(data, opts) {

  let done_year
  const endPoint = lastItemOf(data.profit)
  const donePoint = lastItemOf(data.usage)
  //Money lasts indefinitely?
  if (donePoint.value > endPoint.value) {
    done_year = 'tosi vanha'
  } else if (donePoint.year === opts.max_year) {
    done_year = 'yli ' + donePoint.year
  } else {
    done_year = donePoint.year
  }

  let end_sum = roundAbout(lastItemOf(data.profit).value, 0)

  return {done_year, end_sum}
}


function getLabelCoords (data, opts) {
  const startX = yearPercentage(opts.start_year, opts)
  const endX = yearPercentage(opts.end_year + 1, opts)
  const endY = valuePercentage(lastItemOf(data.profit).value, opts)
  const doneX = yearPercentage(lastItemOf(data.usage).year + 1, opts)

  return {startX, endX, endY, doneX}
}


//Scale years so scale matches 0..100%
function yearPercentage (val, opts) {
  return val / (opts.max_year / 100) + '%'
}


//Scale value so scale matches 0..100%
function valuePercentage (val, opts) {
  return Math.min(100, val  / opts.max_sum * 100) + '%'
}


//Updates labels outside the graph too, if nodes contain such nodes, up to config.
function renderLabels (nodes, texts, coords, opts) {
  nodes.startYear.forEach(el => el.innerText = opts.start_year)
  nodes.startSum.forEach(el => el.innerText = opts.start_sum)
  nodes.endYear.forEach(el => el.innerText = opts.end_year)
  nodes.endSum.forEach(el => el.innerText = texts.end_sum)
  nodes.monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)
  nodes.doneYear.forEach(el => el.innerText = texts.done_year)

  nodes.startYearLabel.style.left = coords.startX
  nodes.endYearLabel.style.left = coords.endX
  nodes.endSumLabel.style.left = coords.endX
  nodes.endSumLabel.style.bottom = coords.endY
  nodes.doneYearLabel.style.left = coords.doneX
  if (texts.done_year === 'tosi vanha') {
    nodes.doneYearLabel.hidden = true
  } else {
    nodes.doneYearLabel.hidden = false
  }
}
