import React from 'react'
import BasicPieChart from './basicpiechart'
import BasicColChart from './colchart'
import ColSlider from './colslider'
function getChart(type, data){
    if (type === 'BasicPieChart'){
        return <BasicPieChart data={data}/>
    }else if (type === 'ColSlider'){
        return <ColSlider data={data}/>
    }
    else{
        return <BasicColChart data={data}/>
    }
}

export default getChart