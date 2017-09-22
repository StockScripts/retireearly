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
  const texts = getLabelTexts(data, opts)
  const coords = getLabelCoords(data, opts)

  requestAnimationFrame(() => {
    renderGraph(nodes, paths, x, y)
    renderLabels(nodes, texts, coords, opts)
  })
}





function dataToPaths (data, opts, x, y) {
  const viewBox = [x.min, y.min, x.range, y.range].join(' ')
  const savings = data.savings.map(point => convertPoint(point, x, y)).join(' ')
  const profit = data.profit.map(point => convertPoint(point, x, y)).join(' ')
  const growth = data.growth.map(point => convertPoint(point, x, y)).join(' ')
  const usage = data.usage.map(point => convertPoint(point, x, y)).join(' ')

  return {savings, profit, growth, usage, viewBox}
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
  nodes.growth.setAttributeNS(null, 'points', paths.growth)
  nodes.usage.setAttributeNS(null, 'points', paths.usage)
}





function getLabelTexts(data, opts) {

  let saved_sum = roundAbout(lastItemOf(data.savings).value, 0)
  let top_sum = roundAbout(lastItemOf(data.growth).value, 0)
  let top_year = lastItemOf(data.growth).year

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

  return {saved_sum, top_sum, top_year, done_year}
}


function getLabelCoords (data, opts) {
  const startX = yearPercentage(opts.start_year, opts)
  const endX = yearPercentage(opts.end_year + 1, opts)
  const savedX = endX
  const savedY = valuePercentage(lastItemOf(data.savings).value, opts)
  const topX = yearPercentage(opts.usage_year + 1, opts)
  const topY = valuePercentage(lastItemOf(data.growth).value, opts)
  const doneX = yearPercentage(lastItemOf(data.usage).year + 1, opts)

  return {startX, endX, savedX, savedY, topX, topY, doneX}
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
  nodes.endYear.forEach(el => el.innerText = opts.end_year)
  nodes.topYear.forEach(el => el.innerText = texts.top_year)
  nodes.doneYear.forEach(el => el.innerText = texts.done_year)

  nodes.savedSum.forEach(el => el.innerText = texts.saved_sum)
  nodes.topSum.forEach(el => el.innerText = texts.top_sum)

  nodes.startYearLabel.style.left = coords.startX
  nodes.endYearLabel.style.left = coords.endX
  nodes.topYearLabel.style.left = coords.topX
  nodes.doneYearLabel.style.left = coords.doneX

  nodes.savedSumLabel.style.left = coords.savedX
  nodes.savedSumLabel.style.bottom = coords.savedY

  nodes.topSumLabel.style.left = coords.topX
  nodes.topSumLabel.style.bottom = coords.topY

  nodes.monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)

  //TODO: better conditions for hiding label
  // nodes.startYearLabel.hidden = opts.start_year === 0
  // nodes.endYearLabel.hidden = opts.end_year === 0
  // nodes.endSumLabel.hidden = texts.end_sum === 0
  // nodes.doneYearLabel.hidden = texts.done_year === 'tosi vanha' || texts.done_year === 0
}
