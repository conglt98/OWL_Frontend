import { Treemap } from '@antv/g2plot';
import { each } from '@antv/util';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

const dataMock = {
  name: 'root',
  children: [
    { name: 'name 1', value: 560 },
    { name: 'name 2', value: 500 },
    { name: 'name 3', value: 150 },
    { name: 'name 4', value: 140 },
    { name: 'name 5', value: 115 },
    { name: 'name 6', value: 95 },
    { name: 'name 7', value: 90 },
    { name: 'name 8', value: 75 },
    { name: 'name 9', value: 98 },
    { name: 'name 10', value: 60 },
    { name: 'name 11', value: 45 },
    { name: 'name 12', value: 40 },
    { name: 'name 13', value: 40 },
    { name: 'name 14', value: 35 },
    { name: 'name 15', value: 40 },
    { name: 'name 16', value: 40 },
    { name: 'name 17', value: 40 },
    { name: 'name 18', value: 30 },
    { name: 'name 19', value: 28 },
    { name: 'name 20', value: 16 },
  ],
};

function processData(data) {
  let sumValue = 0;
  each(data.children, (d) => {
    sumValue += d.value;
  });
  data.value = sumValue;
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
   
    processData(data);

    const treemapPlot = new Treemap(document.getElementById(id), {
    data,
    colorField: 'name',
    width:480,
    height:480,
    renderer:'svg',
    tooltip: {
        visible: true,
      },
    });
    treemapPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart