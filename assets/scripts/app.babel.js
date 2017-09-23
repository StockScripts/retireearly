domready(() => {

  const presets = {
    dev: {
      start_year: 10,
      end_year: 40,
      max_year: 120,
      start_sum: 10000,
      monthly_investment: 500,
      max_sum: 1000000,
      usage_year: 65,
      monthly_usage: 1500,
      interest_rate: 3,
      total_expense_ratio: 1,
    },
    zero: {
      start_year: 0,
      end_year: 0,
      max_year: 120,
      start_sum: 0,
      monthly_investment: 0,
      max_sum: 1000000,
      usage_year: 0,
      monthly_usage: 0,
      interest_rate: 0,
      total_expense_ratio: 0,
    },
    save_for_kid: {
      start_year: 0,
      end_year: 10,
      max_year: 120,
      start_sum: 0,
      monthly_investment: 50,
      max_sum: 1000000,
      usage_year: 65,
      monthly_usage: 0,
      interest_rate: 7,
      total_expense_ratio: 0.5,
    },
    invest_student_loan: {
      start_year: 18,
      end_year: 23,
      max_year: 120,
      start_sum: 0,
      monthly_investment: 200,
      max_sum: 1000000,
      usage_year: 65,
      monthly_usage: 0,
      interest_rate: 7,
      total_expense_ratio: 0.5,
    },
    save_for_retirement: {
      start_year: 30,
      end_year: 65,
      max_year: 120,
      start_sum: 0,
      monthly_investment: 500,
      max_sum: 1000000,
      usage_year: 65,
      monthly_usage: 4500,
      interest_rate: 7,
      total_expense_ratio: 0.5,
    }
  }
  let defaults = presets['zero']
  let opts = {}
  let data = []


  //Cache nodes
  const nodes = {
    graph: domOne('#graph-svg'),
    lines: domOne('.lines'),
    savings: domOne('svg .savings'),
    profit: domOne('svg .profit'),
    growth: domOne('svg .growth'),
    usage: domOne('svg .usage'),

    startYear: domAll('.start_year'),
    startYearLabel: domOne('.start_year_label'),
    startSum: domAll('.start_sum'),

    endYear: domAll('.end_year'),
    endYearLabel: domOne('.end_year_label'),

    savedSum: domAll('.saved_sum'),
    savedSumLabel: domOne('.saved_sum_label'),

    topYear: domAll('.top_year'), //Top year is not necessarily the biggest monetary value if the costs are high, but let's assume we're calculating positive growth. :)
    topYearLabel: domOne('.top_year_label'),
    topSum: domAll('.top_sum'),
    topSumLabel: domOne('.top_sum_label'),

    doneYear: domAll('.done_year'),
    doneYearLabel: domOne('.done_year_label'),

    monthlyUsage: domAll('.monthly_usage'),
    numberInputs: domAll('[type=number]'),
    rangeInputs: domAll('[type=range]'),

    start_year_num: domOne('#start_year_num'),
    start_year_range: domOne('#start_year_range'),
    end_year_num: domOne('#end_year_num'),
    end_year_range: domOne('#end_year_range'),
    usage_year_num: domOne('#usage_year_num'),
    usage_year_range: domOne('#usage_year_range'),
  }



  const main = e => {
    if (e) {
      const el = e.target
      constrainInputs(el)
      syncInputs(el)
      const name = el.name
      const opt = getOpt(e.target)
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
      domAll(`[name="${key}"]`).forEach(el => {
        el.value = value
      })

      opts[key] = parseFloat(value)
    }

    document.addEventListener('input', main)
    document.addEventListener('change', main)
    document.addEventListener('click', reset)

    window.addEventListener('load', () => nodes.numberInputs.forEach(el => autowidth(el)))
    window.addEventListener('resize', () => requestAnimationFrame(() => {
      nodes.numberInputs.forEach(el => autowidth(el))
      main()
    }))

    nodes.numberInputs.forEach(el => autowidth(el))
    main()
  }



  const reset = (event) => {
    const button = event.target
    if (button.type === 'reset') {
      console.log('reset', button.value)
      event.preventDefault()
      const preset = presets[button.value]
      for (let key in preset) localStorage.setItem(key, preset[key])
      init()
    }
  }


  init()


})
