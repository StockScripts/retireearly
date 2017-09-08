const setLabels = (data, opts) => {
  // console.log('setLabels()', data, opts)

  zeroToStart = opts.start_year / 1.2 //Scale years so 120 years matches 100%
  startToEnd = (opts.end_year - opts.start_year) / 1.2
  endHeight = 100 - data.find(item => item.year === opts.end_year).value / opts.max_visible_sum * 100
  doneData = data[data.findIndex(item => item.value < 0) - 1] || data[data.length - 1]
  endToStop = (doneData.year - opts.end_year) / 1.2

  startArea = domOne('.start_year')
  startAge = domOne('.start_age')
  startSum = domOne('.start_sum')
  endArea = domOne('.end_year')
  endAge = domOne('.end_age')
  endSum = domOne('.end_sum')
  doneArea = domOne('.done_year')
  doneAge = domOne('.done_age')

  startAge.innerText = opts.start_year
  startSum.innerText = opts.initial_investment
  endAge.innerText = opts.end_year
  endSum.innerText = round(data.find(item => item.year === opts.end_year).value, 0)
  doneAge.innerText = doneData.year

  //Money lasts indefinitely?
  if (doneData.value > data.find(item => item.year === opts.end_year).value) {
    doneAge.innerText = 'Infinitum'
  } else if (data[data.length - 1].value > 0) {
    doneAge.innerText = doneData.year + '+'
  }

  if (opts.start_year < 10) {
    startArea.classList.add('near-start')
  } else {
    startArea.classList.remove('near-start')
  }
  if (doneData.year > 110) {
    doneArea.classList.add('near-end')
  } else {
    doneArea.classList.remove('near-end')
  }

  startArea.style.width = `calc(${zeroToStart}% + 1px)`
  endArea.style.width = `calc(${startToEnd}% + 1px)`
  endArea.style.height = `calc(${endHeight}%)`
  doneArea.style.width = `${endToStop}%`

}
