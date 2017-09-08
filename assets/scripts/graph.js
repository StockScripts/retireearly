const drawGraph = (data, svg, opts) => {
  const savings = dom('.savings')[0]
  const profit = dom('.profit')[0]
  const usage = dom('.usage')[0]

  // const maxValue = Math.max(...(data.map(point => point.value)))
  const xmin = 0
  const xmax = svg.clientWidth
  const xValueCrop = 120 //x axis is years, from 0..120
  const ymin = 0
  const ymax = svg.clientHeight
  const yValueCrop = 1000000 //Values may go as high as the sky, but one million is the limit now.
  const xrange = xmax - xmin
  const yrange = ymax - ymin
  const viewBox = [xmin, ymin, xrange, yrange].join(' ')
  //transform coordinate system to start from bottom left
  const transform = 'translate(0, '+(ymin * 2 + yrange)+') scale(1,-1)'



  //Scale years & values to match svg viewbox by dividing with max desired value and multiplying by max desired pixel width of canvas

  let savingsPoints = data.filter(point => point.year <= opts.end_year)
  savingsPoints = savingsPoints.map(point => {
    const year = point.year / xValueCrop * xrange
    const value = point.input / yValueCrop * yrange
    return {year, value}
  })

  //Filter out values that are after end year, they would be just a straigh horizontal line in the graph




  let profitPoints = data.filter(point => point.year <= opts.end_year)
  profitPoints = profitPoints.map(point => {
    const year = point.year / xValueCrop * xrange
    const value = point.value / yValueCrop * yrange
    return {year, value}
  })


  let usagePoints = data.filter(point => point.year >= opts.end_year)
  usagePoints = usagePoints.map(point => {
    const year = point.year / xValueCrop * xrange
    const value = point.value / yValueCrop * yrange
    return {year, value}
  })

  svg.setAttribute('viewBox', viewBox)
  savings.setAttributeNS(null, 'points', savingsPoints.map(p => `${p.year},${p.value}`).join(' '))
  savings.setAttributeNS(null, 'transform', transform)
  profit.setAttributeNS(null, 'points', profitPoints.map(p => `${p.year},${p.value}`).join(' '))
  profit.setAttributeNS(null, 'transform', transform)
  usage.setAttributeNS(null, 'points', usagePoints.map(p => `${p.year},${p.value}`).join(' '))
  usage.setAttributeNS(null, 'transform', transform)
}




const setLabels = (data, opts) => {
  // console.log('setLabels()', data, opts)

  zeroToStart = opts.start_year / 1.2
  startToEnd = (opts.end_year - opts.start_year) / 1.2
  doneData = data[data.findIndex(item => item.value < 0) - 1] || data[data.length - 1]
  endToStop = (doneData.year - opts.end_year) / 1.2

  startLabel = dom('.start_year')[0]
  endLabel = dom('.end_year')[0]
  doneLabel = dom('.done_year')[0]

  startLabel.firstElementChild.innerText = opts.start_year
  endLabel.firstElementChild.innerText = opts.end_year
  doneLabel.firstElementChild.innerText = doneData.year

  //If money lasts indefinitely, use infinity symbol
  if (doneData.value > data.find(it => it.year === opts.end_year).value) {
    doneLabel.firstElementChild.innerText = '∞'
  } else if (data[data.length - 1].value > 0) {
    doneLabel.firstElementChild.innerText = doneData.year + '+'
  }

  if (opts.start_year < 10) {
    startLabel.classList.add('near-start')
  } else {
    startLabel.classList.remove('near-start')
  }
  if (doneData.year > 110) {
    doneLabel.classList.add('near-end')
  } else {
    doneLabel.classList.remove('near-end')
  }

  startLabel.style.width = `${zeroToStart}%`
  endLabel.style.width = `${startToEnd}%`
  doneLabel.style.width = `${endToStop}%`

}
