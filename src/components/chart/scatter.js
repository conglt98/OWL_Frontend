import { Scatter } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = [
    {
        Channel: "Guardians of the Galaxy", 
        Topic: "Action", 
        Subscriber: 333, 
        Videos: 10
    },
    {
        Channel: "Foody", 
        Topic: "Food", 
        Subscriber: 33, 
        Videos: 40
    }
]
const Chart = (propsMaster) => {
  const ref = React.useRef(null)
  let id = uuid()
  let data = dataMock
  if (propsMaster.data){
    data = propsMaster.data
  }
  let title = propsMaster.title?propsMaster.title:"Reaction chart"
  let des = propsMaster.description?propsMaster.description:""

  useEffect(() => {
    const scatterPlot = new Scatter(document.getElementById(id), {
        title: {
            visible: true,
            text: title,
          },
          description: {
            visible: true,
            text:
             des,
          },
        data,
        xField: Object.keys(data[0])[2],
        yField: Object.keys(data[0])[3],
        colorField: Object.keys(data[0])[1],
        color: ['#d62728', '#2ca02c', '#000000', '#9467bd', '#ffd500', '#1f77b4', '#00518a', '#ffbc69', '#9bd646'],
        width:480,
        height:480,
        renderer:'svg',
        forceFit:true,
        pointStyle: {
          fillOpacity: 1,
        },
        xAxis: {
          visible: true,
          min: 0,
        },
      });
      scatterPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default Chart