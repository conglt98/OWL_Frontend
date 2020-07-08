import { Radar } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = [
  {
    item: 'Design',
    user: 'a',
    score: 70,
  },
  {
    item: 'Design',
    user: 'b',
    score: 30,
  },
  {
    item: 'Development',
    user: 'a',
    score: 60,
  },
  {
    item: 'Development',
    user: 'b',
    score: 70,
  },
  {
    item: 'Marketing',
    user: 'a',
    score: 60,
  },
  {
    item: 'Marketing',
    user: 'b',
    score: 50,
  },
  {
    item: 'Users',
    user: 'a',
    score: 40,
  },
  {
    item: 'Users',
    user: 'b',
    score: 50,
  },
  {
    item: 'Test',
    user: 'a',
    score: 60,
  },
  {
    item: 'Test',
    user: 'b',
    score: 70,
  },
  {
    item: 'Language',
    user: 'a',
    score: 70,
  },
  {
    item: 'Language',
    user: 'b',
    score: 50,
  },
  {
    item: 'Technology',
    user: 'a',
    score: 50,
  },
  {
    item: 'Technology',
    user: 'b',
    score: 40,
  },
  {
    item: 'Support',
    user: 'a',
    score: 30,
  },
  {
    item: 'Support',
    user: 'b',
    score: 40,
  },
  {
    item: 'Sales',
    user: 'a',
    score: 60,
  },
  {
    item: 'Sales',
    user: 'b',
    score: 40,
  },
  {
    item: 'UX',
    user: 'a',
    score: 50,
  },
  {
    item: 'UX',
    user: 'b',
    score: 60,
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
   
    const radarPlot = new Radar(document.getElementById(id), {
        title: {
          visible: true,
          text: title,
        },
        data,
        angleField: 'type',
        radiusField: 'value',
        seriesField: Object.keys(data[0])[1],
        radiusAxis: {
          grid: {
            line: {
              type: 'line',
            },
          },
        },
        width:480,
        height:480,
        renderer:'svg',
        forceFit:true,
        line: {
          visible: true,
        },
        point: {
          visible: true,
          shape: 'circle',
        },
        legend: {
          visible: true,
          position: 'bottom-center',
        },
      });
      
      radarPlot.render();
      
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart