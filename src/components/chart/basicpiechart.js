import React, { useEffect } from 'react';
import {Chart} from '@antv/g2';

const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let data = [
    { item: '1', count: 40, percent: 0.4 },
    { item: '2', count: 21, percent: 0.21 },
    { item: '3', count: 17, percent: 0.17 },
    { item: '4', count: 13, percent: 0.13 },
    { item: '5', count: 9, percent: 0.09 },
  ];
  if (propsMaster.data){
    data = propsMaster.data
  }
  useEffect(() => {

      
    const chart = new Chart({
        container: ref.current,
        autoFit:true,
        height: 500,
        width:500,
        renderer:'svg'
      });
      
      chart.coordinate('theta', {
        radius: 0.75,
      });
      
      chart.data(data);
      
      chart.scale('percent', {
        formatter: (val) => {
          val = val * 100 + '%';
          return val;
        },
      });
      
      chart.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      
      chart
        .interval()
        .position('percent')
        .color('item')
        .label('percent', {
          content: (data) => {
            return `${data.item}: ${data.percent * 100}%`;
          },
        })
        .adjust('stack');
      
      chart.interaction('element-active');
      
      chart.render();
  }, [])
  return (
    <>
    <div ref={ref}>
    </div>
    </>
  );
}

export default ColChart