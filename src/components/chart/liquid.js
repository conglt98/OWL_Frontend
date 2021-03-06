import { Liquid } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = 5000000

function findNear(num){
  let tmp = num
  while(tmp % 100000 != 0){
    tmp = tmp +1
  }
  return tmp
}

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
   
    const liquidPlot = new Liquid(document.getElementById(id), {
        title: {
          visible: true,
          text: title,
        },
        min: 0,
        max: findNear(data),
        value: data,
        width:480,
        height:480,
        forceFit: true,
        renderer:'svg',
      });
      liquidPlot.render();
      
      
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart