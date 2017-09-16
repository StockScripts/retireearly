function calculator (opts) {

  const yearly_investment = opts.monthly_investment * 12
  const yearly_usage = opts.monthly_usage * 12
  const profit_percentage = (opts.interest_rate - opts.total_expense_ratio)

  let savings = [{year: opts.start_year, value: opts.start_sum}]
  let profit = [{year: opts.start_year, value: opts.start_sum}]

  for (let year = opts.start_year; year <= opts.end_year; year++) {
    savings.push(
      interest(lastItemOf(savings), yearly_investment, 0)
    )
    profit.push(
      interest(lastItemOf(profit), yearly_investment, profit_percentage)
    )
  }

  let trajectory = profit.slice(-1)
  let usage = profit.slice(-1)

  for (let year = opts.end_year + 1; year < opts.max_year; year++) {
    trajectory.push(
      interest(lastItemOf(trajectory), yearly_investment, profit_percentage)
    )
    usage.push(
      interest(lastItemOf(usage), -1 * yearly_usage, profit_percentage)
    )
  }

  // Filter usage so last point is the year where it goes below zero
  usage = usage.filter(point => point.value > 0)

  return {savings, profit, trajectory, usage}
}


function interest (point, sum, percentage) {
  return {
    year: point.year + 1,
    value: (point.value + sum) * (1 + percentage / 100)
  }
}
