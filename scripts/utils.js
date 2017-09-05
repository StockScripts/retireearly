const dom = q => [...document.querySelectorAll(q)]


//http://www.jacklmoore.com/notes/rounding-in-javascript/
function round (value, decimals) {
  decimals = decimals === undefined ? 2 : decimals
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals).toFixed(decimals);
}

const currency = (value, decimals) => round(value, decimals)


const getOpt = input => {
  let value
  if (input.dataset.parse === 'int') {
    value = parseInt(input.value)
  }
  if (input.dataset.parse === 'float') {
    value = parseFloat(input.value)
  }
  if (!value) {
    value = 0
  }
  return {[input.name]: value}
}


//In case we want to read opts from the dom instead of providing defaults, not used and probably should not be used
// const getOpts = el => {
//   let opts = {}
//   dom('input').forEach(input => Object.assign(opts, getOpt(input)))
//   return opts
// }



const syncInputs = el => {
  const targets = dom(`[name="${el.name}"]`)
  if (targets.length) {
    targets.forEach(target => {
      if (target !== el) {
        target.value = el.value
      }
    })
  }
}




//Keeps start_year below end_year and end_year above start_year, not used, let the user crap out the values if they want, the graph will show nothing as it should if start is after end.
// const sanitizeInputs = el => {
//   if (el.name === 'start_year') {
//     dom('[name="end_year"]').forEach(target => {
//       const max = parseInt(el.max)
//       const val = parseInt(el.value)
//       const min = Math.min(val + 1, max)
//       const tgv = parseInt(target.value)
//       target.value = Math.max(min, tgv)
//     })
//   }
//   if (el.name === 'end_year') {
//     dom('[name="start_year"]').forEach(target => {
//       const min = parseInt(el.min)
//       const val = parseInt(el.value)
//       const max = Math.max(val - 1, min)
//       const tgv = parseInt(target.value)
//       target.value = Math.min(max, tgv)
//     })
//   }
// }
