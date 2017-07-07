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

//Set inputs to match initial opts
for (let key in opts) {
  dom(`[name="${key}"]`).forEach(el => el.value = opts[key])
}

const graphSvg = dom('#graph-svg')[0]
//const opts = Object.assign(defaults, getOpts(document))
let data = calcData(opts)

const main = e => {
  if (e) {
    //sanitizeInputs(e.target)
    syncInputs(e.target)
    Object.assign(opts, getOpt(e.target))
  }
  data = calcData(opts)
  drawGraph(data, graphSvg, opts)
  setLabels(data, opts)
}

document.addEventListener('input', main)
document.addEventListener('change', main)
main()


