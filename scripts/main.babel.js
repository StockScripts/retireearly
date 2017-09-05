

//Defaults
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


//Cache graph node
const graphSvg = dom('#graph-svg')[0]


//Get opts from localStorage, but use default if not set
//Set inputs to match opts
for (let key in opts) {
  opts[key] = localStorage.getItem(key) || opts[key]
  dom(`[name="${key}"]`).forEach(el => el.value = opts[key])
}



const main = e => {
  if (e) {
    const name = e.target.name
    const opt = getOpt(e.target)
    syncInputs(e.target)
    Object.assign(opts, opt) //Update opts
    localStorage.setItem(name, opt[name]) //Save changed opt to localStorage
  }
  const data = calcData(opts)
  drawGraph(data, graphSvg, opts)
  setLabels(data, opts)
}


//TODO: some way to reset localStorage
const reset = () => {
  for (let key in opts) {
    localStorage.removeItem(key)
  }
  window.location.reload() //TODO: should wrap this file as an init method instead and reinit the app instead of reload, but whatever
}


document.addEventListener('input', main)
document.addEventListener('change', main)
main()


