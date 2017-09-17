domready(() => {

  //Defaults
  const defaults = {
    start_year: 33,
    end_year: 65,
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
    graph: domOne('#graph-svg'),
    lines: domOne('.lines'),
    savings: domOne('svg .savings'),
    profit: domOne('svg .profit'),
    trajectory: domOne('svg .trajectory'),
    usage: domOne('svg .usage'),
    divider: domOne('svg .divider'),
    startYear: dom('.start_year'),
    startYearLabel: domOne('.start_year_label'),
    startSum: dom('.start_sum'),
    endYear: dom('.end_year'),
    endYearLabel: domOne('.end_year_label'),
    endSum: dom('.end_sum'),
    endSumLabel: domOne('.end_sum_label'),
    doneYear: dom('.done_year'),
    doneYearLabel: domOne('.done_year_label'),
    monthlyUsage: dom('.monthly_usage'),
    numberInputs: dom('[type=number]'),
    rangeInputs: dom('[type=range]'),
  }



  const main = e => {
    if (e) {
      const name = e.target.name
      const opt = getOpt(e.target)
      syncInputs(e.target)
      Object.assign(opts, opt) //Update opts
      localStorage.setItem(name, opt[name]) //Save changed opt to localStorage
    }
    data = calculator(opts)
    graph(data, nodes, opts)
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

    window.addEventListener('load', () => nodes.numberInputs.forEach(el => autowidth(el)))
    window.addEventListener('resize', () => requestAnimationFrame(() => {
      nodes.numberInputs.forEach(el => autowidth(el))
      main()
    }))

    nodes.numberInputs.forEach(el => autowidth(el))
    main()
  }



  const reset = (e) => {
    if (e) e.preventDefault()
    for (let key in opts) localStorage.removeItem(key)
    //window.location.reload() //TODO: should wrap this file as an init method instead and reinit the app instead of reload, but whatever
    init()
    domOne('#start_year_num').focus()
  }


  init()


})
