const drawGraph = (data, svg, opts) => {
  const savings = svg.querySelector('.savings')
  const profit = svg.querySelector('.profit')
  const usage = svg.querySelector('.usage')

  // const maxValue = Math.max(...(data.map(point => point.value)))
  const xmin = 0
  const xmax = svg.clientWidth
  const xValueCrop = 120 //x axis is years, from 0..120
  const ymin = 0
  const ymax = svg.clientHeight
  const yValueCrop = opts.max_visible_sum //Values may go as high as the sky, but one million is the limit for now.
  const xrange = xmax - xmin
  const yrange = ymax - ymin
  const viewBox = [xmin, ymin, xrange, yrange].join(' ')
  //transform coordinate system to start from bottom left
  const transform = 'translate(0, '+(ymin * 2 + yrange)+') scale(1,-1)'


  //Scale years & values to match svg viewbox by dividing with max desired value and multiplying by max desired pixel width of canvas


  //Filter out values that are after end year, they would be just a straigh horizontal line in the graph
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
