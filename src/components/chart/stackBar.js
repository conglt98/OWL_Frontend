import { StackedBar } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'


const dataMock = [
  {
    channel: 'channel1',
    type: 'type2',
    value: 1454715.807999998,
  },
  {
    channel: 'channel1',
    type: 'type3',
    value: 2287358.261999998,
  },
  {
    channel: 'channel1',
    type: 'type1',
    value: 942432.3720000006,
  },
  {
    channel: 'channel2',
    type: 'type2',
    value: 1335665.3239999984,
  },
  {
    channel: 'channel2',
    type: 'type3',
    value: 2057936.7620000008,
  },
  {
    channel: 'channel2',
    type: 'type1',
    value: 743813.0069999992,
  },
  {
    channel: 'channel3',
    type: 'type2',
    value: 834842.827,
  },
  {
    channel: 'channel3',
    type: 'type3',
    value: 1323985.6069999991,
  },
  {
    channel: 'channel3',
    type: 'type1',
    value: 522739.0349999995,
  },
  {
    channel: 'channel4',
    type: 'type2',
    value: 804769.4689999995,
  },
  {
    channel: 'channel4',
    type: 'type3',
    value: 1220430.5610000012,
  },
  {
    channel: 'channel4',
    type: 'type1',
    value: 422100.9870000001,
  },
  {
    channel: 'channel5',
    type: 'type2',
    value: 469341.684,
  },
  {
    channel: 'channel5',
    type: 'type3',
    value: 677302.8919999995,
  },
  {
    channel: 'channel5',
    type: 'type1',
    value: 156479.9319999999,
  },
  {
    channel: 'channel6',
    type: 'type2',
    value: 253458.1840000001,
  },
  {
    channel: 'channel6',
    type: 'type3',
    value: 458058.1039999998,
  },
  {
    channel: 'channel6',
    type: 'type1',
    value: 103523.308,
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
   
    const stackBarPlot = new StackedBar(document.getElementById(id), {
        // forceFit: true,
        title: {
        visible: true,
        text: title,
        },
        description: {
        visible: true,
        text: des,
        },
        data,
        width:480,
        height:480,
        renderer:'svg',
        legend: {
            position: 'top',
        },
        yField: Object.keys(data[0])[0],
        xField: Object.keys(data[0])[2],
        stackField: Object.keys(data[0])[1],
        label: {
        visible: false,
        position: 'middle',
        // formatter: (v) => Math.round(v / 100000),
        },
    }
    );
    stackBarPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart