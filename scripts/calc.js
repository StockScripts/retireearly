function calcData (opts) {

  const yearly_investment = opts.monthly_investment * 12
  const yearly_expense = opts.monthly_expense * 12
  let value = opts.initial_investment

  //TODO: clone opts and return data as something like data.plot, data.opts and so on, so the calculator returns the data and the options that generated that data, so after calculating there doesn't need to be any references to any old stuff, just the data

  let data = [
    {
      year: opts.start_year,
      value: value
    }
  ]

  for (let year = opts.start_year + 1; year < 121; year++ ) {

    if (year >= opts.start_year && year <= opts.end_year) {
      //add yearly investments minus entry charge
      value = value + yearly_investment * (1 - opts.entry_charge / 100)
    }

    if (year > opts.end_year) {
      //substract yearly expenses & exit charge
      value = value - yearly_expense * (1 - opts.exit_charge / 100)
    }

    //remove ongoing charges from whole sum
    value = value * (1 - opts.total_expense_ratio / 100)

    //add interest to whole value
    value = value * (1 + opts.interest_rate / 100)

    if (year >= opts.start_year) {
      data = [...data, {year, value}]
    }
    if (year > opts.end_year && value < 0) {
      return data
    }
  }

  return data
}
