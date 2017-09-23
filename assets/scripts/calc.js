function calculator (opts) {

  const yearly_investment = opts.monthly_investment * 12
  const yearly_usage = opts.monthly_usage * 12
  const interest = (opts.interest_rate - opts.total_expense_ratio)

  let savings = [{year: opts.start_year, value: opts.start_sum}]
  let profit = [{year: opts.start_year, value: opts.start_sum}]
  for (let year = opts.start_year; year < opts.end_year; year++) {
    savings.push(
      addYear(lastItemOf(savings), yearly_investment, 0)
    )
    profit.push(
      addYear(lastItemOf(profit), yearly_investment, interest)
    )
  }

  //TODO: guard against nonsensical calculations, like end_year that's before start_year

  let growth = profit.slice(-1)
  for (let year = opts.end_year; year < opts.usage_year; year++) {
    growth.push(
      addYear(lastItemOf(growth), 0, interest)
    )
  }

  let usage = growth.slice(-1)
  for (let year = opts.usage_year; year < opts.max_year; year++) {
    usage.push(
      addYear(lastItemOf(usage), -1 * yearly_usage, interest)
    )
  }


  // Filter usage so last point is the year where it goes below zero
  usage = usage.filter(point => point.value > 0)
  if (!usage.length) usage = [{year: opts.end_year, value: 0}]

  return {savings, profit, growth, usage}
}


function addYear (point, sum, percentage) {
  return {
    year: point.year + 1,
    value: (point.value + sum) * (1 + percentage / 100)
  }
}
