const setLabels = (data, opts) => {

  zeroToStart = opts.start_year / 1.2 //Scale years so 120 years matches 100%
  startToEnd = (opts.end_year - opts.start_year) / 1.2
  endHeight = 100 - (data.find(item => item.year === opts.end_year).value / opts.max_visible_sum) * 100
  donePoint = data[data.findIndex(item => item.value < 0) - 1] || data[data.length - 1]
  endToStop = (donePoint.year - opts.end_year) / 1.2

  lowSum = domOne('.low_sum')
  midSum = domOne('.mid_sum')
  highSum = domOne('.high_sum')
  lowSum.innerText = ''
  midSum.innerText = roundAbout(opts.max_visible_sum * 0.5)
  highSum.innerText = roundAbout(opts.max_visible_sum * 0.9)

  startArea = domOne('.start_area')
  startAge = dom('.start_year')
  startSum = dom('.start_sum')
  endArea = domOne('.end_area')
  endAge = dom('.end_year')
  endSum = dom('.end_sum')
  doneArea = domOne('.done_area')
  doneAge = dom('.done_year')
  monthlyUsage = dom('.monthly_usage')

  startAge.forEach(el => el.innerText = opts.start_year)
  startSum.forEach(el => el.innerText = opts.initial_investment)
  endAge.forEach(el => el.innerText = opts.end_year)
  endSum.forEach(el => el.innerText = roundAbout(data.find(item => item.year === opts.end_year).value, 0))
  monthlyUsage.forEach(el => el.innerText = opts.monthly_usage)

  //Money lasts indefinitely?
  if (donePoint.value > data.find(item => item.year === opts.end_year).value) {
    doneAge.forEach(el => el.innerText = 'Infinite')
  } else if (data[data.length - 1].value > 0) {
    doneAge.forEach(el => el.innerText = donePoint.year + '+')
  } else {
    doneAge.forEach(el => el.innerText = donePoint.year)
  }

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

  startArea.style.width = `calc(${zeroToStart}% + 1px)`
  endArea.style.width = `calc(${startToEnd}% + 1px)`
  endArea.style.height = `calc(${endHeight}%)`
  doneArea.style.width = `${endToStop}%`

}
