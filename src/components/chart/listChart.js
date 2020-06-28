import React from 'react'
import BasicPieChart from './basicpiechart'
import BasicColChart from './colchart'
import ColSlider from './colslider'
import Multiline from './multiline'
import PercentArea from './percentarea'
import GroupCol from './groupcol'
import StackBar from './stackBar'
import Donut from './donut'
import Rose from './rose'
import Scatter from './scatter'
import Radar from './radar'
import Gauge from './gauge'
import TreeMap from './treemap'
import WorldCloud from './wordcloud'
import Liquid from './liquid'
import StackColLine from './stackcolline'

function getChart(type, title, data){
    if (type === 'BasicPieChart'){
        return <BasicPieChart data={data} title={title}/>
    }else if (type === 'ColSlider'){
        return <ColSlider data={data} title={title}/>
    } else if (type === 'Multiline'){
        return <Multiline data={data} title={title}/>
    } else if (type === 'PercentArea'){
        return <PercentArea data={data} title={title}/>
    }else if (type === 'GroupCol'){
        return <GroupCol data={data} title={title}/>
    }else if (type === 'Donut'){
        return <Donut data={data} title={title}/>
    }
    else if (type === 'StackBar'){
        return <StackBar data={data} title={title}/>
    }else if (type === 'Rose'){
        return <Rose data={data} title={title}/>
    }else if (type === 'Scatter'){
        return <Scatter data={data} title={title}/>
    }else if (type === 'Radar'){
        return <Radar data={data} title={title}/>
    }else if (type === 'Gauge'){
        return <Gauge data={data} title={title}/>
    }else if (type === 'TreeMap'){
        return <TreeMap data={data} title={title}/>
    }else if (type === 'WorldCloud'){
        return <WorldCloud data={data} title={title}/>
    }else if (type === 'Liquid'){
        return <Liquid data={data} title={title}/>
    }else if (type === 'StackColLine'){
        return <StackColLine data={data} title={title}/>
    }
    else{
        return <BasicColChart data={data} title={title}/>
    }
}

export default getChart