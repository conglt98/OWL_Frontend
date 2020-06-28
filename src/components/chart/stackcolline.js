import { StackedColumnLine } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const uvBillData = [
  { time: '2019-03', value: 350, type: 'uv' },
  { time: '2019-04', value: 900, type: 'uv' },
  { time: '2019-05', value: 300, type: 'uv' },
  { time: '2019-06', value: 450, type: 'uv' },
  { time: '2019-07', value: 470, type: 'uv' },
  { time: '2019-03', value: 220, type: 'bill' },
  { time: '2019-04', value: 300, type: 'bill' },
  { time: '2019-05', value: 250, type: 'bill' },
  { time: '2019-06', value: 220, type: 'bill' },
  { time: '2019-07', value: 362, type: 'bill' },
];

const transformData = [
  { time: '2019-03', count: 800 },
  { time: '2019-04', count: 600 },
  { time: '2019-05', count: 400 },
  { time: '2019-06', count: 380 },
  { time: '2019-07', count: 220 },
];

const dataMock = [uvBillData, transformData]

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
   
    const columnLine = new StackedColumnLine(document.getElementById(id), {
        title: {
          visible: true,
          text: title,
          // alignTo: 'middle',
        },
        description: {
          visible: true,
          text: des,
          // alignTo: 'middle',
        },
        data: data,
        width:480,
        height:480,
        forceFit: true,
        renderer:'svg',
        xField: 'time',
        yField: [Object.keys(data[0][0])[1], Object.keys(data[1][0])[1]],
        xAxis: {
            type: 'dateTime',
            tickCount: 5,
        },
        columnStackField: Object.keys(data[0][0])[2],
      });
      columnLine.render();
      
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart