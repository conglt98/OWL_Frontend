import { WordCloud } from '@antv/g2plot';
import React, { useEffect } from 'react';
import uuid from 'react-uuid'

function getDataList(data) {
  const list = [];
  // change data type
  data.forEach((d) => {
    list.push({
      word: d.name,
      weight: d.value,
      id: list.length,
    });
  });
  
  return list;
}

function getWordCloudConfig(data) {
  return {
    width: 480,
    height: 480,
    data: getDataList(data),
    forceFit:true,
    wordStyle: {
      rotation: [-Math.PI / 2, Math.PI / 2],
      rotateRatio: 0.5,
      rotationSteps: 4,
      fontSize: [10, 200],
      color: (word, weight) => {
        return getRandomColor();
      },
      active: {
        shadowColor: '#333333',
        shadowBlur: 10,
      },
      gridSize: 8,
    },
    shape: 'cardioid',
    shuffle: false,
    backgroundColor: '#fff',
    tooltip: {
      visible: true,
    },
    selected: -2,

    onWordCloudHover: hoverAction,
  };
}

function getRandomColor() {
  const arr = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ];
  return arr[Math.floor(Math.random() * (arr.length - 1))];
}

function hoverAction(item, dimension, evt, start) {
  // console.log('hover action', item && item.word);
}

const dataMock = [
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
]

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
   
    const wordCloudPlot = new WordCloud(document.getElementById(id), getWordCloudConfig(data));
    wordCloudPlot.render();
  }, [])
  return (
    <>
    <div id={id}>
    </div>
    </>
  );
}

export default ColChart