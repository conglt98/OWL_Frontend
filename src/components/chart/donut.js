import { Donut } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = [
  {
    type: 'type1',
    value: 27,
  },
  {
    type: 'type2',
    value: 25,
  },
  {
    type: 'type3',
    value: 18,
  },
  {
    type: 'type4',
    value: 15,
  },
  {
    type: 'type5',
    value: 10,
  },
  {
    type: 'type6',
    value: 5,
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
   
    const donutPlot = new Donut(document.getElementById(id), {
        forceFit: true,
        title: {
          visible: true,
          text:title,
        },
        description: {
          visible: true,
          text: des,
        },
        width:480,
        height:480,
        renderer:'svg',
        radius: 0.8,
        padding: 'auto',
        data,
        angleField: 'value',
        colorField: 'type',
        statistic: {
          visible: true,
          content: {
            name: 'Total',
            value: '100'
          },
        },
      });
      
      donutPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart