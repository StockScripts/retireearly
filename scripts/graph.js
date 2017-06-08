const drawGraph = (data, svg, opts) => {
  const poly = dom('.plot')[0]
  const star = dom('.star')[0]

  const xmin = 0
  const xmax = 200
  const ymin = 0
  const max = Math.max(...(data.map(point => parseFloat(point.value))))
  const ymax = 60
  const xrange = xmax - xmin
  const yrange = ymax - ymin
  const viewBox = [xmin, ymin, xrange, yrange].join(' ')
  //transform coordinate system to start from bottom left
  const transform = 'translate(0, '+(ymin * 2 + yrange)+') scale(1,-1)'

  //Scale years & values to match svg viewbox
  let points = data.map(point => {
    const year = point.year / 120 * xrange //Years are from 0..120
    const value = point.value / 1000000 * yrange //Values may go as high as the sky, but one million is the limit now.
    return {year, value}
  })

  svg.setAttribute('viewBox', viewBox)
  poly.setAttributeNS(null, 'points', points.map(p => `${p.year},${p.value}`).join(' '))
  poly.setAttributeNS(null, 'transform', transform)
}




const setLabels = (data, opts) => {

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
    startLabel.classList.add('at-limit')
  } else {
    startLabel.classList.remove('at-limit')
  }
  if (doneData.year > 110) {
    doneLabel.classList.add('at-limit')
  } else {
    doneLabel.classList.remove('at-limit')
  }

  startLabel.style.width = `${zeroToStart}%`
  endLabel.style.width = `${startToEnd}%`
  doneLabel.style.width = `${endToStop}%`

}
