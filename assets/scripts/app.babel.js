domready(() => {

  //Defaults
  const defaults = {
    start_year: 30,
    end_year: 60,
    max_year: 120,
    start_sum: 0,
    monthly_investment: 500,
    max_sum: 1000000,
    monthly_usage: 3000,
    entry_charge: 0,
    interest_rate: 7,
    total_expense_ratio: 0.5,
    exit_charge: 0
  }
  let opts = {}
  let data = []


  //Cache nodes
  const nodes = {
    graph: {
      root: domOne('#graph-svg'),
      savings: domOne('svg .savings'),
      profit: domOne('svg .profit'),
      trajectory: domOne('svg .trajectory'),
      usage: domOne('svg .usage'),
    },
    labels: {
      startArea: domOne('.start_area'),
      startYear: dom('.start_year'),
      startSum: dom('.start_sum'),
      endArea: domOne('.end_area'),
      endYear: dom('.end_year'),
      endSum: dom('.end_sum'),
      doneArea: domOne('.done_area'),
      doneYear: dom('.done_year'),
      monthlyUsage: dom('.monthly_usage'),
    },
    inputs: {
      number: dom('[type=number]'),
      range: dom('[type=range]'),
    },
  }
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
    data = calculator(opts)
    drawGraph(data, nodes, opts)
    setLabels(data, nodes, opts)
  }



  const init = () => {

    for (let key in defaults) {
      //Get opts from localStorage, but use default if not set
      let value = localStorage.getItem(key)
      if (value === null) value = defaults[key]

      //Set inputs to match opts
      dom(`[name="${key}"]`).forEach(el => {
        el.value = value
      })

      opts[key] = parseFloat(value)
    }

    document.addEventListener('input', main)
    document.addEventListener('change', main)
    domOne('#reset').addEventListener('click', reset)

    window.addEventListener('load', () => numberInputs.forEach(el => autowidth(el)))
    window.addEventListener('resize', () => requestAnimationFrame(() => {
      numberInputs.forEach(el => autowidth(el))
      drawGraph(data, nodes, opts)
      //setLabels(data, nodes, opts) // No need to redraw label because they're positioned with percentages
    }))

    numberInputs.forEach(el => autowidth(el))
    main()
  }



  const reset = (e) => {
    if (e) e.preventDefault()
    for (let key in opts) localStorage.removeItem(key)
    //window.location.reload() //TODO: should wrap this file as an init method instead and reinit the app instead of reload, but whatever
    domOne('#start_year_num').focus()
    init()
  }


  init()


})
