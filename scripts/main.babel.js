const opts = {
  start_year: 30,
  end_year: 60,
  initial_investment: 0,
  monthly_investment: 500,
  monthly_usage: 2200,
  entry_charge: 0,
  interest_rate: 5.6,
  total_expense_ratio: 0.5,
  exit_charge: 0
}


//Set inputs to match opts
for (let key in opts) {
  const opt = opts[key]
  //TODO: Read opt from localStorage and merge to opts
  dom(`[name="${key}"]`).forEach(el => el.value = opt)
}


const graphSvg = dom('#graph-svg')[0]

const main = e => {
  if (e) {
    const opt = getOpt(e.target)
    syncInputs(e.target)
    Object.assign(opts, opt)
    //TODO: Save opt to localStorage
  }
  const data = calcData(opts)
  drawGraph(data, graphSvg, opts)
  setLabels(data, opts)
}


//TODO: some way to reset localStorage
const reset = () => {
  for (let key in opts) {
    //Remove from localStorage
  }
}


document.addEventListener('input', main)
document.addEventListener('change', main)
main()


