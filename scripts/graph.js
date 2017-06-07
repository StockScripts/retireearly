const drawGraph = (data, svg, opts) => {
  const poly = dom('.plot')[0];
  const star = dom('.star')[0];

  const xmin = 0;
  const xmax = 200;
  const ymin = 0;
  const max = Math.max(...(data.map(point => parseFloat(point.value))))
  const ymax = 60
  const xrange = xmax - xmin;
  const yrange = ymax - ymin;
  const viewBox = [xmin, ymin, xrange, yrange].join(' ');
  //transform coordinate system to start from bottom left
  const transform = 'translate(0, '+(ymin * 2 + yrange)+') scale(1,-1)'

  //Scale years & values to match svg viewbox
  let points = data.map(point => {
    const year = point.year / 120 * xrange
    //Scale y values from 0..max to 0..yrange so the svg doesn't do any funky scaling on its own
    const value = point.value / 1000000 * yrange
    //TODO: that `- 10` should be based on the scale of max value somehow, it's a percentage of how much from the top do we bring down the tip of the sharks fin. Should be based on how big the value at the top of the graph is. Probably logarithmically, so with small values you get a decent looking graph, but as you approach a million or so, the graph stops climbing.
    return {year, value}
  })

  svg.setAttribute('viewBox', viewBox);
  poly.setAttributeNS(null, 'points', points.map(p => `${p.year},${p.value}`).join(' '));
  poly.setAttributeNS(null, 'transform', transform);

  // const ypoints = points.map(p => p.value)
  // const maxypoint = points.find(p => p.year === opts.end_year).year
  // const maxxpoint = opts.end_year * 2 - 3
  //star.setAttribute('transform', transform + ` translate(${maxxpoint}, ${maxypoint})`);

}
