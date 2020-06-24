import React, { useEffect } from 'react';
import {Chart} from '@antv/g2';

const ColChart = (propsMaster) => {
  const ref = React.useRef(null)
  let data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ];
  if (propsMaster.data){
    data = propsMaster.data
  }
  useEffect(() => {

      
      // Step 1: 创建 Chart 对象
      const chart = new Chart({
        container: ref.current, // 指定图表容器 ID
        width: 500, // 指定图表宽度
        height: 300, // 指定图表高度
        renderer:'svg'
      });
      
      // Step 2: 载入数据源
      chart.data(data);
      
      // Step 3: 创建图形语法，绘制柱状图
      chart.interval().position('genre*sold');
      
      // Step 4: 渲染图表
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