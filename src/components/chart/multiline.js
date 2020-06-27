import React, { useEffect } from 'react';
import { Line } from '@antv/g2plot';
import uuid from 'react-uuid'
const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let id = uuid()
  let data = [
    {
      date: '2018/8/1',
      type: 'line1',
      value: 4623,
    },
    {
      date: '2018/8/1',
      type: 'line2',
      value: 2208,
    },
    {
      date: '2018/8/1',
      type: 'line3',
      value: 182,
    },
    {
      date: '2018/8/2',
      type: 'line1',
      value: 6145,
    },
    {
      date: '2018/8/2',
      type: 'line2',
      value: 2016,
    },
    {
      date: '2018/8/2',
      type: 'line3',
      value: 257,
    },
    {
      date: '2018/8/3',
      type: 'line1',
      value: 508,
    },
    {
      date: '2018/8/3',
      type: 'line2',
      value: 2916,
    },
    {
      date: '2018/8/3',
      type: 'line3',
      value: 289,
    },
    {
      date: '2018/8/4',
      type: 'line1',
      value: 6268,
    },
    {
      date: '2018/8/4',
      type: 'line2',
      value: 4512,
    },
    {
      date: '2018/8/4',
      type: 'line3',
      value: 428,
    },
    {
      date: '2018/8/5',
      type: 'line1',
      value: 6411,
    },
    {
      date: '2018/8/5',
      type: 'line2',
      value: 8281,
    },
    {
      date: '2018/8/5',
      type: 'line3',
      value: 619,
    },
    {
      date: '2018/8/6',
      type: 'line1',
      value: 1890,
    },
    {
      date: '2018/8/6',
      type: 'line2',
      value: 2008,
    },
    {
      date: '2018/8/6',
      type: 'line3',
      value: 87,
    },
    {
      date: '2018/8/7',
      type: 'line1',
      value: 4251,
    },
    {
      date: '2018/8/7',
      type: 'line2',
      value: 1963,
    },
    {
      date: '2018/8/7',
      type: 'line3',
      value: 706,
    },
    {
      date: '2018/8/8',
      type: 'line1',
      value: 2978,
    },
    {
      date: '2018/8/8',
      type: 'line2',
      value: 2367,
    },
    {
      date: '2018/8/8',
      type: 'line3',
      value: 387,
    },
    {
      date: '2018/8/9',
      type: 'line1',
      value: 3880,
    },
    {
      date: '2018/8/9',
      type: 'line2',
      value: 2956,
    },
    {
      date: '2018/8/9',
      type: 'line3',
      value: 488,
    },
    {
      date: '2018/8/10',
      type: 'line1',
      value: 3606,
    },
    {
      date: '2018/8/10',
      type: 'line2',
      value: 678,
    },
    {
      date: '2018/8/10',
      type: 'line3',
      value: 507,
    },
    {
      date: '2018/8/11',
      type: 'line1',
      value: 4311,
    },
    {
      date: '2018/8/11',
      type: 'line2',
      value: 3188,
    },
    {
      date: '2018/8/11',
      type: 'line3',
      value: 548,
    },
    {
      date: '2018/8/12',
      type: 'line1',
      value: 4116,
    },
    {
      date: '2018/8/12',
      type: 'line2',
      value: 3491,
    },
    {
      date: '2018/8/12',
      type: 'line3',
      value: 456,
    },
    {
      date: '2018/8/13',
      type: 'line1',
      value: 6419,
    },
    {
      date: '2018/8/13',
      type: 'line2',
      value: 2852,
    },
    {
      date: '2018/8/13',
      type: 'line3',
      value: 689,
    },
    {
      date: '2018/8/14',
      type: 'line1',
      value: 1643,
    },
    {
      date: '2018/8/14',
      type: 'line2',
      value: 4788,
    },
    {
      date: '2018/8/14',
      type: 'line3',
      value: 280,
    },
    {
      date: '2018/8/15',
      type: 'line1',
      value: 445,
    },
    {
      date: '2018/8/15',
      type: 'line2',
      value: 4319,
    },
    {
      date: '2018/8/15',
      type: 'line3',
      value: 176,
    },
  ];
  if (propsMaster.data){
    data = propsMaster.data
  }
  let title = propsMaster.title?propsMaster.title:"Reaction chart"
  let des = propsMaster.description?propsMaster.description:""

  useEffect(() => {
  

const linePlot = new Line(document.getElementById(id), {
  title: {
    visible: true,
    text: title,
  },
  description: {
    visible: true,
    text: des,
  },
  padding: 'auto',
  width:480,
  height:480,
  forceFit: true,
  renderer:'svg',
  data,
  xField: Object.keys(data[0])[0],
  yField:  Object.keys(data[0])[2],
  xAxis: {
    type: 'dateTime',
    tickCount: 5,
  },
  yAxis: {
    label: {
      formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    },
  },
  legend: {
    position: 'top',
  },
  seriesField: 'type',
//   color: (d) => {
//     return d === 'line2' ? '#93D072' : '#2D71E7';
//   },
  responsive: true,
});

linePlot.render();

  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart