function graph (data, nodes, opts) {

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
    renderGraph(nodes, paths, coords)
    renderLabels(nodes, texts, coords, opts)
  })
}





function dataToPaths (data, opts, x, y) {
  const viewBox = [x.min, y.min, x.range, y.range].join(' ')
  const savings = data.savings.map(point => convertPoint(point, x, y)).join(' ')
  const profit = data.profit.map(point => convertPoint(point, x, y)).join(' ')
  const growth = data.growth.map(point => convertPoint(point, x, y)).join(' ')
  const usage = data.usage.map(point => convertPoint(point, x, y)).join(' ')

  const endYear = lastItemOf(data.savings).year
  const endYearLine = convertPoint({year: endYear, value: 0}, x, y) + ' ' + convertPoint({year: endYear, value: opts.max_sum}, x, y)

  const topYear = lastItemOf(data.growth).year
  const topYearLine = convertPoint({year: topYear, value: 0}, x, y) + ' ' + convertPoint({year: topYear, value: opts.max_sum}, x, y)

  return {savings, profit, growth, usage, endYearLine, topYearLine, viewBox, x, y}
}


function convertPoint (point, x, y) {
  //Scale year & value to match svg viewbox by dividing with max desired value and multiplying by max desired pixel width of canvas
  const year = point.year / x.scale * x.range
  const value = point.value / y.scale * y.range

  //Convert data point to svg path point
  return `${year},${value}`
}


function renderGraph (nodes, paths) {
  nodes.graph.setAttribute('viewBox', paths.viewBox)
  nodes.lines.setAttributeNS(null, 'transform', 'translate(0, '+paths.y.range+') scale(1,-1)') //transform coordinate system to start from bottom left
  nodes.savings.setAttributeNS(null, 'points', paths.savings)
  nodes.profit.setAttributeNS(null, 'points', paths.profit)
  nodes.growth.setAttributeNS(null, 'points', paths.growth)
  nodes.usage.setAttributeNS(null, 'points', paths.usage)
  nodes.endYearLine.setAttributeNS(null, 'points', paths.endYearLine)
  nodes.topYearLine.setAttributeNS(null, 'points', paths.topYearLine)
}





function getLabelTexts(data, opts) {
  //TODO: maybe take all values from data, then it's up to the calculator to make sure the data is sane, so there's no need to check for opts this and that is bigger than that stuff here

  let saved_sum = roundAbout(lastItemOf(data.savings).value, 0)
  let top_sum = roundAbout(lastItemOf(data.growth).value, 0)

  let done_year
  const endPoint = lastItemOf(data.profit)
  const donePoint = lastItemOf(data.usage)
  //Money lasts indefinitely?
  if (donePoint.value > endPoint.value) {
    done_year = ''
  } else if (donePoint.year === opts.max_year) {
    done_year = 'yli ' + donePoint.year
  } else {
    done_year = donePoint.year
  }

  return {saved_sum, top_sum, done_year}
}


function getLabelCoords (data, opts) {
  const startX = yearPercentage(opts.start_year, opts)
  const endX = yearPercentage(opts.end_year, opts)
  const savedX = endX
  const savedY = valuePercentage(lastItemOf(data.savings).value, opts)
  const topX = yearPercentage(Math.max(opts.end_year, opts.usage_year), opts) //Top sum can't go left from the saving end year
  const topY = valuePercentage(lastItemOf(data.growth).value, opts)
  const doneX = yearPercentage(Math.min(lastItemOf(data.usage).year, opts.max_year), opts)

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
  nodes.topYear.forEach(el => el.innerText = opts.usage_year)
  nodes.doneYear.forEach(el => el.innerText = texts.done_year)
  nodes.savedSum.forEach(el => el.innerText = texts.saved_sum)
  nodes.topSum.forEach(el => el.innerText = texts.top_sum)
  nodes.monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)

  nodes.startYearLabel.hidden = opts.start_year == 0
  nodes.endYearLabel.hidden = opts.end_year <= opts.start_year
  nodes.topYearLabel.hidden = opts.usage_year <= opts.end_year
  nodes.doneYearLabel.hidden = texts.done_year <= opts.end_year

  nodes.startYearLabel.style.left = coords.startX
  nodes.endYearLabel.style.left = coords.endX
  nodes.topYearLabel.style.left = coords.topX
  nodes.doneYearLabel.style.left = coords.doneX

  nodes.savedSumLabel.hidden = (texts.saved_sum == 0 || texts.saved_sum == texts.top_sum)
  nodes.topSumLabel.hidden = texts.top_sum == 0

  nodes.savedSumLabel.style.left = coords.savedX
  nodes.savedSumLabel.style.bottom = coords.savedY
  nodes.topSumLabel.style.left = coords.topX
  nodes.topSumLabel.style.bottom = coords.topY

}
