import { Gauge } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = 70

const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let id = uuid()
  let data = dataMock
  if (propsMaster.data){
    data = propsMaster.data
  }
  if (propsMaster.data == 0){
    data = propsMaster.data
  }
  let title = propsMaster.title?propsMaster.title:"Reaction chart"
  let des = propsMaster.description?propsMaster.description:""

  useEffect(() => {
   
    const gaugePlot = new Gauge(document.getElementById(id), {
        title: {
          visible: true,
          text: title,
        },
        width: 480,
        height: 480,
        renderer:'svg',
        value: data,
        min: 0,
        max: 100,
        range: [0, 100],
        color: ['l(0) 0:#e35767 1:#5d7cef'],
        axis: {
          offset: -15,
          tickLine: {
            visible: true,
            length: 10,
          },
          label: {
            visible: false,
          },
        },
        tooltip: {
          visible: true,
        },
        pivot: {
          visible: true,
          thickness: 10,
          pointer: {
            visible: true,
            style: {
              fill: '#e25869',
            },
          },
          pin: {
            visible: true,
            style: {
              fill: '#e8e6ea',
            },
          },
        },
        statistic: {
          visible: true,
          position: ['50%', '100%'],
          text: `${data.toFixed(2)}% positive comments`,
          color: '#2e3033',
          size: 20,
        },
      });
      gaugePlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart