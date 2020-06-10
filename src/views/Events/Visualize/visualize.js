import React, { useEffect } from 'react';
import G6 from '@antv/g6';
import { mockData } from './data';
import './registerShape';

const decisionCode = {
  '-1':'REJECT',
  '0':'CHALLENGE',
  '1':'APPROVE',
  '2':'BYPASS'
}

const convertEventToData = (event)=>{
  let data = [{
    id:"event"+event.id,
    name:event.name,
    label:'Event',
    rate:0,
    status:'S',
    childList:[],
  }]
  if (event){
    event.data.map((domain,indexDomain)=>{
      data[0].childList.push({
        id:"domain"+domain.id,
        name:domain.name,
        label:'Domain',
        rate:0,
        status:'S',
        childList:[]
      })
      domain.listProfiles.map((profile,indexProfile)=>{
        data[0].childList[indexDomain].childList.push({
          id:"profile"+profile.id,
          name:profile.name,
          label:'Profile',
          rate:0,
          status:'S',
          conditions:profile.conditions,
          filter:`Filter ${profile.filter} - Conditions: `,
          childList:[]
        })
        profile.listTiers.map((tier,indexTier)=>{
          data[0].childList[indexDomain].childList[indexProfile].childList.push({
            id:"tier"+tier.id,
            name:tier.name,
            label:'Tier',
            rate:0,
            status:'S',
            tierCode:decisionCode[String(tier.code)],
            priority:tier.priority,
            decisionType:tier.decisionType,
            conditions:tier.conditions,
            filter:`Filter ${profile.filter} - Conditions: `,
            childList:[]
          })
          tier.listRules.map((rule,indexRule)=>{
            data[0].childList[indexDomain].childList[indexProfile].childList[indexTier].childList.push({
              id:"rule"+rule.id,
              name:rule.name,
              label:'Rule',
              rate:0,
              status:'S',
              conditions:rule.ruleConditions,
              filter:`Filter ${profile.filter} - Conditions: `,
              childList:[{
                id:"Response"+rule.infoCode.id,
                name:'Code: '+rule.infoCode.id+'\nMessage: '+rule.infoCode.message+"\nDescription: "+rule.infoCode.description+"\nAction: "+rule.infoCode.action,
                label:'Response',
                rate:0,
                status:'S',
                childList:[]
              }]
            })
          })
        })
      })
    })
  }

  return data
}

const TreeGraphReact = (propsMaster) => {
  const ref = React.useRef(null)
  let graph = null
  const data = convertEventToData(propsMaster.event)
  let backUpData = {};
  let maxMatrixY = 0;
  let isAnimating = false;

  console.log(data)
  const props = {
    data: data,
    config: {
      padding: [20, 50],
      defaultLevel: 5,
      defaultZoom: 0.8,
      modes: { default: ['zoom-canvas', 'drag-canvas'] },
    },
    nodeClick: (item) => {
      console.log(item);
    },
  };

  const defaultConfig = {
    width: 1110,
    height: 800,
    pixelRatio: 1,
    modes: {
      default: ['zoom-canvas', 'drag-canvas'],
    },
    fitView: false,
    animate: true,
    defaultEdge: {
      style: {
        stroke: '#1890FF',
      },
    },
  };

  const getKeys = (data, keys) => {
    if (!data || !data.length) {
      return;
    }
    data.forEach(item => {
      const { id } = item;
      const children = get(item, 'childList', []);
      keys.push(id);
      if (children.length) {
        getKeys(children, keys);
      }
    });
  };

  const get = (object, path, defaultValue) => {
    return object[path] || defaultValue;
  };

  // number to string
  const toString = (id) => id + '';

  const sleep = (duration = 500) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('done');
      }, duration);
    });
  };

  const transformData = (data, parentIndex) => {
    if (!data || !data.length) {
      return;
    }
    const {
      config: { defaultLevel = 10, padding = [20, 20] },
    } = props;
    data.forEach((item, index) => {
      const { status, rate, label } = item;
      const children = get(item, 'childList', []);
      const recordIndex = parentIndex !== undefined ? parentIndex + '-' + index : index + '';
      maxMatrixY = index === 0 ? maxMatrixY : maxMatrixY + 1;
      const recordLength = recordIndex.split('-').length;
      const childrenKeys = [];
      if (children.length) {
        getKeys(children, childrenKeys);
      }
      let lightColor;
      if (label === 'Event') {
        lightColor = 'green';
      } else if (label === 'Domain'){
        lightColor = 'red'
      } else if (label === 'Profile'){
        lightColor = 'blue'
      }else if (label === 'Tier'){
        lightColor = 'grey'
      }else if (label === 'Rule'){
        lightColor = 'purple'
      }else if (label === 'Response'){
        lightColor = 'black'
      }

      item = {
        ...item,
        lightColor,
        id: toString(item.id),
        x: padding[0],
        y: padding[1],
        recordIndex,
        collapsed: recordLength >= defaultLevel,
        hasChildren: children.length,
        childrenKeys,
      };
      data[index] = item;
      if (children.length) {
        transformData(get(item, 'childList', []), recordIndex);
      }
    });
  };
  const recursion = (
    data,
    parentMatrixX,
    graphData,
    parentId,
    parentX,
    parentY,
    parentAnimate,
  ) => {
    if (!data || !data.length) {
      return;
    }
    const {
      config: { padding = [20, 20], nodesMargin = [250, 100], coefficient = [0.2, -0.1] },
    } = props;
    data.forEach((item, index) => {
      const matrixX = parentMatrixX || 0;
      const children = get(item, 'childList', []);
      const animate = get(item, 'animate', false);
      const afterDrawHidden = get(item, 'afterDrawHidden', false);
      const collapsed = get(item, 'collapsed');
      maxMatrixY = index === 0 || afterDrawHidden ? maxMatrixY : maxMatrixY + 1;
  
      const currentX =
        afterDrawHidden || parentAnimate === 'expand'
          ? parentX
          : matrixX * nodesMargin[0] + padding[0];
      const currentY =
        afterDrawHidden || parentAnimate === 'expand'
          ? parentY
          : maxMatrixY * nodesMargin[1] + padding[1];
  
      item = {
        ...item,
        id: toString(item.id),
        matrixX,
        matrixY: maxMatrixY,
        x: currentX,
        y: currentY,
        type: 'flow-rect',
        coefficientX: coefficient[0],
        coefficientY: coefficient[1],
        hasChildren: children.length,
        collapsed: item.collapsed || false,
      };
      data[index] = item;
      const { childList, ...model } = item;
      graphData.nodes.push(model);

      if (parentId) {
        graphData.edges.push({
          source: parentId,
          target: toString(item.id),
          targetAnchor: 0,
          sourceAnchor: 1,
          type: index === 0 ? 'line' : 'flow-cubic',
        });
      }
  
      if ((children.length && animate) || (children.length && !collapsed)) {
        recursion(
          children,
          afterDrawHidden ? matrixX : matrixX + 1,
          graphData,
          toString(item.id),
          currentX,
          currentY,
          animate,
        );
      }
    });
  };

  const initAnimateData = (data, graphData) => {
    if (!data || !data.length) {
      return;
    }
    data.forEach(item => {
      const children = get(item, 'childList', []);
      const collapsed = get(item, 'collapsed');
      const { childList, ...model } = item;
      graphData.nodes.push(model);
      if (children.length && !collapsed) {
        initAnimateData(get(item, 'childList', []), graphData);
      }
    });
  };

  const getPosition = (data, init) => {
    maxMatrixY = 0;
    const graphData = {
      nodes: [],
      edges: [],
    };
  
    if (!data) {
      return graphData;
    }
  
    if (init) {
      initAnimateData(data, graphData);
    } else {
      recursion(data, 0, graphData);
    }
    return graphData;
  };

  const recursionExpand = (
    data,
    parentMatrixX,
    graphData,
    parentX,
    parentY,
    parentAnimate,
  ) => {
    if (!data || !data.length) {
      return;
    }
    data.forEach((item, index) => {
      const matrixX = parentMatrixX || 0;
      const children = get(item, 'childList', []);
      const animate = get(item, 'animate', false);
      const afterDrawHidden = get(item, 'afterDrawHidden', false);
      const collapsed = get(item, 'collapsed');
      const currentX = parentAnimate === 'expand' ? parentX : item.x;
      const currentY = parentAnimate === 'expand' ? parentY : item.y;

      item = {
        ...item,
        id: toString(item.id),
        x: currentX,
        y: currentY,
        hasChildren: children.length,
      };
      data[index] = item;
      const { childList, ...model } = item;
      graphData.nodes.push(model);

      if ((children.length && animate) || (children.length && !collapsed)) {
        recursionExpand(
          children,
          afterDrawHidden ? matrixX : matrixX + 1,
          graphData,
          currentX,
          currentY,
          animate,
        );
      }
    });
  };

  const removeTooltip = (id) => {
    const removeNode = document.getElementById(id);
    if (removeNode) {
      document.body.removeChild(removeNode);
    }
  };

  const createTooltip = (position, name, id) => {
    const offsetTop = id.includes('Response')?-150:-60;
    const existTooltip = document.getElementById(id);
    const x = position.x + 'px';
    const y = position.y + offsetTop + 'px';
    if (existTooltip) {
      existTooltip.style.left = x;
      existTooltip.style.top = y;
    } else {
      // content
      const tooltip = document.createElement('div');
      const span = document.createElement('span');
      const names = name.split("\n")
      console.log(names)
      for(let i =0;i<names.length;i++){
        const txt = document.createElement('div')
        txt.textContent = names[i]
        span.appendChild(txt)
      }
      tooltip.style.padding = '10px';
      tooltip.style.background = 'rgba(0,0,0, 0.65)';
      tooltip.style.color = '#fff';
      tooltip.style.borderRadius = '4px';
      tooltip.appendChild(span);
      // box
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.zIndex = '100000';
      div.id = id;
      div.style.left = x;
      div.style.top = y;
      div.appendChild(tooltip);
      document.body.appendChild(div);
    }
  };

  const getExpandPosition = (data) => {
    maxMatrixY = 0;
    const graphData = {
      nodes: [],
      edges: [],
    };
  
    if (!data) {
      return graphData;
    }
  
    recursionExpand(data, 0, graphData);
  
    return graphData;
  };

  const updateCollapseStatus = (
    id,
    recordIndex,
    collapsed,
    animate,
  ) => {
    let currentList = backUpData;
    try {
      let currentRecord;
      const indexs = recordIndex.split('-');
      for (let i = 0; i < indexs.length; i += 1) {
        currentRecord = currentList[indexs[i]];
        currentList = currentList[indexs[i]].childList;
      }
      currentRecord.collapsed = !collapsed;
      currentRecord.animate = animate;
  
      const setHidden = (data) => {
        if (!data || !data.length) {
          return;
        }
        data.forEach((item, index) => {
          const children = get(item, 'childList', []);
          data[index] = {
            ...item,
            afterDrawHidden: !collapsed,
          };
          if (children.length && !item.collapsed) {
            setHidden(children);
          }
        });
      };
      setHidden(currentList);
    } catch (err) {
      console.error(err, id, currentList);
    }
  };

  const initEvent = () => {
    graph.on('node:click', async (evt) => {
      if (isAnimating) {
        return;
      }
      const { item, target } = evt;
      const {
        attrs: { isCollapseShape },
      } = target;
      if (isCollapseShape) {
        isAnimating = true;
        const model = item.getModel();
        graph.setItemState(item, 'click', true);
        const { childrenKeys, id, collapsed, recordIndex } = model;
        // 更新状态
        if (collapsed) {
          updateCollapseStatus(id, recordIndex, collapsed, 'expand');
          graph.changeData(getExpandPosition(backUpData));
          graph.stopAnimate();
          childrenKeys.forEach(async (key) => {
            const childrenItem = graph.findById(key);
            if (childrenItem) {
              childrenItem.toBack();
            }
          });
          updateCollapseStatus(id, recordIndex, collapsed);
          graph.changeData(getPosition(backUpData));
          await sleep(500);
          graph.setItemState(item, 'click', false);
          isAnimating = false;
        } else {
          updateCollapseStatus(id, recordIndex, collapsed, 'collapsed');
          graph.changeData(getPosition(backUpData));
          childrenKeys.forEach(async (key) => {
            const childrenItem = graph.findById(key);
            if (childrenItem) {
              childrenItem.toBack();
            }
          });
          await sleep(500);
          updateCollapseStatus(id, recordIndex, collapsed);
          childrenKeys.forEach(async (key) => {
            const childrenItem = graph.findById(key);
            if (childrenItem) {
              graph.remove(childrenItem);
            }
          });
          graph.setItemState(item, 'click', false);
          isAnimating = false;
        }
      } else {
        const { nodeClick } = props;
        if (typeof nodeClick === 'function') {
          nodeClick(item.getModel());
        }
      }
    });
  
    graph.on('node:mouseenter', (evt) => {
      const node = evt.item;
      graph.setItemState(node, 'hover', true);
      graph.updateItem(node, {
        style: {
          ...node._cfg.originStyle,
          shadowColor: '#bbb',
          shadowBlur: 6,
        },
      });
    });
  
    graph.on('node:mousemove', (evt) => {
      if (isAnimating) {
        return;
      }
      const { item, target, x, y } = evt;
      const {
        attrs: { isTitleShape },
      } = target;
      const model = item.getModel();
      const { name, id } = model;
      if (isTitleShape) {
        const postion = graph.getClientByPoint(x, y);
        createTooltip(postion, name, id);
      } else {
        removeTooltip(id);
      }
    });

    graph.on('node:mouseout', (evt) => {
      if (isAnimating) {
        return;
      }
      const { item, target } = evt;
      const {
        attrs: { isTitleShape },
      } = target;
      const model = item.getModel();
      const { id } = model;
      if (isTitleShape) {
        removeTooltip(id);
      }
    });

    graph.on('node:mouseleave', (evt) => {
      const node = evt.item;
      graph.setItemState(node, 'hover', false);
      graph.updateItem(node, {
        style: {
          ...node._cfg.originStyle,
          shadowColor: 'transparent',
          shadowBlur: 0,
        },
      });
    });
  };

  useEffect(() => {
    transformData(data);
    const { onInit, config } = props;
    if(!graph) {
      graph = new G6.Graph({
        container: ref.current,
        ...defaultConfig,
        ...config,
      });
    }
    const graphData = getPosition(data, true)
    console.log(graphData)
    initEvent();

    backUpData = JSON.parse(JSON.stringify(data));

    graph.data(graphData);
    graph.render();
    graph.zoom(config.defaultZoom || 1);
    if (data?.length) {
      graph.changeData(getPosition(backUpData));
    }
  }, [])
  return (
    <>
    <div ref={ref}>
    </div>
    </>
  );
}

export default TreeGraphReact