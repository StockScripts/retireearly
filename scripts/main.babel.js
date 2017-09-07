

//Defaults
let defaults = {
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
let globalOpts = {}
let globalData = []


//Cache nodes
const graphSvg = dom('#graph-svg')[0]
const numberInputs = dom('[type=number]')
const rangeInputs = dom('[type=range]')



const main = e => {
  if (e) {
    const name = e.target.name
    const opt = getOpt(e.target)
    syncInputs(e.target)
    Object.assign(globalOpts, opt) //Update globalOpts
    localStorage.setItem(name, opt[name]) //Save changed opt to localStorage
  }
  globalData = calcData(globalOpts)
  drawGraph(globalData, graphSvg, globalOpts)
  setLabels(globalData, globalOpts)
}



const init = () => {

  for (let key in defaults) {

    //Get globalOpts from localStorage, but use default if not set
    globalOpts[key] = parseFloat(localStorage.getItem(key)) || defaults[key]

    //Set inputs to match globalOpts
    dom(`[name="${key}"]`).forEach(el => {
      el.value = globalOpts[key]
      if (el.type === 'number') autosize(el)
    })

  }

  document.addEventListener('input', main)
  document.addEventListener('change', main)
  window.addEventListener('resize', () => requestAnimationFrame(() => {
    numberInputs.forEach(el => autosize(el))
    drawGraph(globalData, graphSvg, globalOpts)
  }))
  domOne('#reset').addEventListener('click', reset)

  numberInputs.forEach(el => autosize(el))
  main()
}



const reset = (e) => {
  if (e) e.preventDefault()
  for (let key in globalOpts) localStorage.removeItem(key)
  //window.location.reload() //TODO: should wrap this file as an init method instead and reinit the app instead of reload, but whatever
  init()
}


init()


