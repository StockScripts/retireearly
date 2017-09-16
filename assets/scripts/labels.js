const setLabels = (data, nodes, opts) => {

  // const lowSum = domOne('.low_sum')
  // const midSum = domOne('.mid_sum')
  // const highSum = domOne('.high_sum')
  // lowSum.innerText = ''
  // midSum.innerText = roundAbout(opts.max_sum * 0.5)
  // highSum.innerText = roundAbout(opts.max_sum * 0.9)

  const startArea = nodes.labels.startArea
  const startYear = nodes.labels.startYear
  const startSum = nodes.labels.startSum
  const endArea = nodes.labels.endArea
  const endYear = nodes.labels.endYear
  const endSum = nodes.labels.endSum
  const doneArea = nodes.labels.doneArea
  const doneYear = nodes.labels.doneYear
  const monthlyUsage = nodes.labels.monthlyUsage

  startYear.forEach(el => el.innerText = opts.start_year)
  startSum.forEach(el => el.innerText = opts.start_sum)
  endYear.forEach(el => el.innerText = opts.end_year)
  endSum.forEach(el => el.innerText = roundAbout(lastItemOf(data.profit).value, 0))
  monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)


  const endPoint = lastItemOf(data.profit)
  const donePoint = lastItemOf(data.usage)
  let doneYearText
  //Money lasts indefinitely?
  if (donePoint.value > endPoint.value) {
    doneYearText = '∞'
  } else if (donePoint.year === opts.max_year) {
    doneYearText = donePoint.year + '+'
  } else {
    doneYearText = donePoint.year
  }
  doneYear.forEach(el => el.innerText = doneYearText)

  //Classes for styling
  if (opts.start_year < 20) {
    startArea.classList.add('near-start')
  } else {
    startArea.classList.remove('near-start')
  }
  if (donePoint.year > 100) {
    doneArea.classList.add('near-end')
  } else {
    doneArea.classList.remove('near-end')
  }



  const zeroToStart = year(opts.start_year) + '%'
  const startToEnd = year(opts.end_year - opts.start_year) + '%'
  const endHeight = 100 - value(lastItemOf(data.profit).value) + '%'
  const endToDone = year(donePoint.year - opts.end_year) + '%'

  startArea.style.width = `calc(${zeroToStart} + 1px)`
  endArea.style.width = `calc(${startToEnd} + 1px)`
  endArea.style.height = endHeight
  doneArea.style.width = endToDone


  //Scale years so scale matches 0..100%
  function year (val) {
    return val / (opts.max_year / 100)
  }

  function value (val) {
    return val  / opts.max_sum * 100
  }

}
