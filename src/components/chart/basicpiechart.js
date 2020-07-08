import React, { useEffect } from 'react';
import { Pie, DensityHeatmap } from '@antv/g2plot';
import uuid from 'react-uuid'
const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let data = [
    {
      type: 'Like',
      value: 27,
    },
    {
      type: 'Share',
      value: 25,
    },
    {
      type: 'Comments',
      value: 18,
    },
    {
      type: 'Haha',
      value: 15,
    },
    {
      type: 'Sad',
      value: 10,
    },
    {
      type: 'Heart',
      value: 5,
    },
  ]
  if (propsMaster.data){
    data = propsMaster.data
  }
  let title = propsMaster.title?propsMaster.title:"Reaction chart"
  let des = propsMaster.description?propsMaster.description:""


  const id = uuid()
  useEffect(() => {

      
    const piePlot = new Pie(document.getElementById(id), {
      forceFit: true,
      title: {
        visible: true,
        text: title,
      },
      description: {
        visible: true,
        text:
          des,
      },
      radius: 0.7,
      renderer:'svg',
      width:480,
      height:480,
      data,
      angleField: 'value',
      colorField: 'type',
      color: ['#1979C9', '#D62A0D', '#FAA219','green'],
      label: {
        visible: true,
        type: 'spider',
      },
    });
    
    piePlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart