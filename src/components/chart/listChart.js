import React from 'react'
import BasicPieChart from './basicpiechart'
import BasicColChart from './colchart'
import ColSlider from './colslider'
function getChart(type, data, title){
    if (type === 'BasicPieChart'){
        return <BasicPieChart data={data} title={'Reaction pie'}/>
    }else if (type === 'ColSlider'){
        return <ColSlider data={data} title={'Reaction col slider'}/>
    }
    else{
        return <BasicColChart data={data} title={'Reaction col'}/>
    }
}

export default getChart