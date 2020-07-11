import { StackedColumn } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = [
  {
    country: 'Asia',
    year: '1750',
    value: 502,
  },
  {
    country: 'Asia',
    year: '1800',
    value: 635,
  },
  {
    country: 'Asia',
    year: '1850',
    value: 809,
  },
  {
    country: 'Asia',
    year: '1900',
    value: 947,
  },
  {
    country: 'Asia',
    year: '1950',
    value: 1402,
  },
  {
    country: 'Asia',
    year: '1999',
    value: 3634,
  },
  {
    country: 'Asia',
    year: '2050',
    value: 5268,
  },
  {
    country: 'Africa',
    year: '1750',
    value: 106,
  },
  {
    country: 'Africa',
    year: '1800',
    value: 107,
  },
  {
    country: 'Africa',
    year: '1850',
    value: 111,
  },
  {
    country: 'Africa',
    year: '1900',
    value: 133,
  },
  {
    country: 'Africa',
    year: '1950',
    value: 221,
  },
  {
    country: 'Africa',
    year: '1999',
    value: 767,
  },
  {
    country: 'Africa',
    year: '2050',
    value: 1766,
  },
  {
    country: 'Europe',
    year: '1750',
    value: 163,
  },
  {
    country: 'Europe',
    year: '1800',
    value: 203,
  },
  {
    country: 'Europe',
    year: '1850',
    value: 276,
  },
  {
    country: 'Europe',
    year: '1900',
    value: 408,
  },
  {
    country: 'Europe',
    year: '1950',
    value: 547,
  },
  {
    country: 'Europe',
    year: '1999',
    value: 729,
  },
  {
    country: 'Europe',
    year: '2050',
    value: 628,
  },
];
const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let id = uuid()
  let data = dataMock
  if (propsMaster.data){
    data = propsMaster.data
  }
  let title = propsMaster.title?propsMaster.title:"Reaction chart"
  let des = propsMaster.description?propsMaster.description:""

  useEffect(() => {
    const areaPlot = new StackedColumn(document.getElementById(id), {
        title: {
          visible: true,
          text: title,
        },
        data,
        meta: {
          year: {
            range: [0, 1],
          },
        },
        width:480,
        height:480,
        renderer:'svg',
        forceFit:true,
        legend: {
            position: 'top',
        },
        xField: Object.keys(data[0])[1],
        yField: Object.keys(data[0])[2],
        stackField: Object.keys(data[0])[0],
        xAxis: {
          type: 'dateTime',
          tickCount: 3,
        },
        color: ['#ae331b', '#f27957', '#ae331b', '#609db7', '#1a6179'],
        // color: ['#82d1de', '#cb302d', '#e3ca8c'],
        areaStyle: {
          fillOpacity: 0.7,
        },
      });
      areaPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart