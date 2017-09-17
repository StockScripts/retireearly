function setLabels (data, nodes, opts) {
  const texts = getLabelTexts(data, opts)
  const coords = getLabelCoords(data, opts)
  renderLabels(nodes, texts, coords, opts)
}

function getLabelTexts(data, opts) {

  let done_year
  const endPoint = lastItemOf(data.profit)
  const donePoint = lastItemOf(data.usage)
  //Money lasts indefinitely?
  if (donePoint.value > endPoint.value) {
    done_year = '∞'
  } else if (donePoint.year === opts.max_year) {
    done_year = donePoint.year + '+'
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
  const doneX = yearPercentage(lastItemOf(data.usage).year, opts)

  return {startX, endX, endY, doneX}
}

//Scale years so scale matches 0..100%
function yearPercentage (val, opts) {
  return val / (opts.max_year / 100) + '%'
}

//Scale value so scale matches 0..100%
function valuePercentage (val, opts) {
  return val  / opts.max_sum * 100 + '%'
}

function renderLabels (nodes, texts, coords, opts) {
  nodes.startYear.forEach(el => el.innerText = opts.start_year)
  nodes.startSum.forEach(el => el.innerText = opts.start_sum)
  nodes.endYear.forEach(el => el.innerText = opts.end_year)
  nodes.endSum.forEach(el => el.innerText = texts.end_sum)
  nodes.monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)
  nodes.doneYear.forEach(el => el.innerText = texts.done_year)

  nodes.startLabel.style.left = coords.startX
  nodes.endLabel.style.left = coords.endX
  nodes.endLabel.style.bottom = coords.endY
  nodes.doneLabel.style.left = coords.doneX
}
