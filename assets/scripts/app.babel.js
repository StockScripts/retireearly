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


  //Cache nodes to easy to access objects. (In general, don't do this. Code & html get very tightly coupled.)
  const els = domAll('[id]').reduce((obj, el) => obj[el.id] = el, {})
  const vals = domAll('[name]').reduce((obj, el) => obj[el.name] = el, {})
  const slots = domAll('[data-slot]').reduce((obj, el) => obj[el.dataset.slot] = el, {})


  const main = e => {
    if (e) {
      const el =
      syncInputs(e.target)
    }

    //Read all inputs on each update
    for (name in vals) {
      opts[name] = parseFloat(vals.value)
    }
    const data = calculator(opts)
    graph(data, els, slots, opts)
  }


  const update = (opts, el) => {

    //constrainYears(el) //TODO: if i do constraints, I need to get all values on each event instad of reading just the user changed value, or update opts while constraining values
    const name = el.name
    const opt = getOpt(el)
    localStorage.setItem(name, opt[name]) //Save changed opt to localStorage //TODO: namespace or some such, this may not always be on its own domain
    opts = Object.assign(opts, opt) //Update global opts
    return opts
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


  const share = () => {
    //TODO: generate shareable link with values encoded after #
    //When loading the page, gulp the # params and delete from the url, data should not persist in the url, it should be for sharing only.
  }


  init()


})
