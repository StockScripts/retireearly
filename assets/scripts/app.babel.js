domready(() => {

  //Defaults
  let defaults = {
    start_year: 30,
    end_year: 60,
    initial_investment: 0,
    monthly_investment: 500,
    max_visible_sum: 1000000,
    monthly_usage: 2200,
    entry_charge: 0,
    interest_rate: 7,
    total_expense_ratio: 0.5,
    exit_charge: 0
  }
  let opts = {}
  let data = []


  //Cache nodes
  const graphSvg = dom('#graph-svg')[0]
  const numberInputs = dom('[type=number]')
  const rangeInputs = dom('[type=range]')



  const main = e => {
    if (e) {
      const name = e.target.name
      const opt = getOpt(e.target)
      syncInputs(e.target)
      Object.assign(opts, opt) //Update opts
      localStorage.setItem(name, opt[name]) //Save changed opt to localStorage
    }
    data = calcData(opts)
    drawGraph(data, graphSvg, opts)
    setLabels(data, opts)
  }



  const init = () => {

    for (let key in defaults) {
      //Get opts from localStorage, but use default if not set
      opts[key] = parseFloat(localStorage.getItem(key)) || defaults[key]

      //Set inputs to match opts
      dom(`[name="${key}"]`).forEach(el => {
        el.value = opts[key]
      })
    }

    document.addEventListener('input', main)
    document.addEventListener('change', main)
    domOne('#reset').addEventListener('click', reset)

    window.addEventListener('load', () => numberInputs.forEach(el => autowidth(el)))
    window.addEventListener('resize', () => requestAnimationFrame(() => {
      numberInputs.forEach(el => autowidth(el))
      drawGraph(data, graphSvg, opts)
    }))


    main()
  }



  const reset = (e) => {
    if (e) e.preventDefault()
    for (let key in opts) localStorage.removeItem(key)
    //window.location.reload() //TODO: should wrap this file as an init method instead and reinit the app instead of reload, but whatever
    init()
  }


  init()


})
