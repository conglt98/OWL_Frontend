import G6 from '@antv/g6'
import { mix, isString } from '@antv/util';

const updateLinkPoints=(cfg, group)=> {
    const { linkPoints: defaultLinkPoints } = {
        size: [185, 90],
        style: {
          radius: 5,
          stroke: '#69c0ff',
          fill: '#ffffff',
          fillOpacity: 1,
        },
        // 文本样式配置
        labelCfg: {
          style: {
            fill: '#595959',
            fontSize: 14,
          },
          offset: 30, // 距离左侧的 offset，没有设置 y 轴上移动的配置
        },
        descriptionCfg: {
          style: {
            fontSize: 12,
            fill: '#bfbfbf',
          },
          paddingTop: 0,
        },
        preRect: {
          show: true,
          width: 4,
          fill: '#40a9ff',
          radius: 2,
        },
        // 节点上左右上下四个方向上的链接circle配置
        linkPoints: {
          top: false,
          right: false,
          bottom: false,
          left: false,
          // circle的大小
          size: 3,
          lineWidth: 1,
          fill: '#72CC4A',
          stroke: '#72CC4A',
        },
        // 节点中icon配置
        logoIcon: {
          // 是否显示icon，值为 false 则不渲染icon
          show: true,
          x: 0,
          y: 0,
          // icon的地址，字符串类型
          img:
            'https://gw.alipayobjects.com/zos/basement_prod/4f81893c-1906-4de4-aff3-9a6b266bc8a2.svg',
          width: 16,
          height: 16,
          // 用于调整图标的左右位置
          offset: 0,
        },
        // 节点中表示状态的icon配置
        stateIcon: {
          // 是否显示icon，值为 false 则不渲染icon
          show: true,
          x: 0,
          y: 0,
          // icon的地址，字符串类型
          img:
            'https://gw.alipayobjects.com/zos/basement_prod/300a2523-67e0-4cbf-9d4a-67c077b40395.svg',
          width: 16,
          height: 16,
          // 用于调整图标的左右位置
          offset: -5,
        },
        // 连接点，默认为左右
        // anchorPoints: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }]
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      }

    const markLeft = group.find(element => element.get('className') === 'link-point-left');
    const markRight = group.find(element => element.get('className') === 'link-point-right');
    const markTop = group.find(element => element.get('className') === 'link-point-top');
    const markBottom = group.find(element => element.get('className') === 'link-point-bottom');

    let currentLinkPoints;
    if (markLeft) {
      currentLinkPoints = markLeft.attr();
    }
    if (markRight && !currentLinkPoints) {
      currentLinkPoints = markRight.attr();
    }
    if (markTop && !currentLinkPoints) {
      currentLinkPoints = markTop.attr();
    }
    if (markBottom && !currentLinkPoints) {
      currentLinkPoints = markBottom.attr();
    }
    if (!currentLinkPoints) currentLinkPoints = defaultLinkPoints;

    const linkPoints = mix({}, currentLinkPoints, cfg.linkPoints);

    const { fill: markFill, stroke: markStroke, lineWidth: borderWidth } = linkPoints;
    let markSize = linkPoints.size / 2;
    if (!markSize) markSize = linkPoints.r;
    const { left, right, top, bottom } = cfg.linkPoints
      ? cfg.linkPoints
      : { left: undefined, right: undefined, top: undefined, bottom: undefined };

    const size = [185, 90]
    const width = size[0];
    const height = size[1];
    const styles = {
      r: markSize,
      fill: markFill,
      stroke: markStroke,
      lineWidth: borderWidth,
    };

    if (markLeft) {
      if (!left && left !== undefined) {
        markLeft.remove();
      } else {
        markLeft.attr({
          ...styles,
          x: -width / 2,
          y: 0,
        });
      }
    } else if (left) {
      group.addShape('circle', {
        attrs: {
          ...styles,
          x: -width / 2,
          y: 0,
        },
        className: 'link-point-left',
        name: 'link-point-left',
        isAnchorPoint: true,
      });
    }

    if (markRight) {
      if (!right && right !== undefined) {
        markRight.remove();
      }
      markRight.attr({
        ...styles,
        x: width / 2,
        y: 0,
      });
    } else if (right) {
      group.addShape('circle', {
        attrs: {
          ...styles,
          x: width / 2,
          y: 0,
        },
        className: 'link-point-right',
        name: 'link-point-right',
        isAnchorPoint: true,
      });
    }

    if (markTop) {
      if (!top && top !== undefined) {
        markTop.remove();
      }
      markTop.attr({
        ...styles,
        x: 0,
        y: -height / 2,
      });
    } else if (top) {
      group.addShape('circle', {
        attrs: {
          ...styles,
          x: 0,
          y: -height / 2,
        },
        className: 'link-point-top',
        name: 'link-point-top',
        isAnchorPoint: true,
      });
    }

    if (markBottom) {
      if (!bottom && bottom !== undefined) {
        markBottom.remove();
      } else {
        markBottom.attr({
          ...styles,
          x: 0,
          y: height / 2,
        });
      }
    } else if (bottom) {
      group.addShape('circle', {
        attrs: {
          ...styles,
          x: 0,
          y: height / 2,
        },
        className: 'link-point-bottom',
        name: 'link-point-bottom',
        isAnchorPoint: true,
      });
    }
  }

const drawLinkPoints = (cfg, group)=> {
    const { linkPoints: defaultLinkPoints } = {
        size: [185, 90],
        style: {
          radius: 5,
          stroke: '#69c0ff',
          fill: '#ffffff',
          fillOpacity: 1,
        },
        // 文本样式配置
        labelCfg: {
          style: {
            fill: '#595959',
            fontSize: 14,
          },
          offset: 30, // 距离左侧的 offset，没有设置 y 轴上移动的配置
        },
        descriptionCfg: {
          style: {
            fontSize: 12,
            fill: '#bfbfbf',
          },
          paddingTop: 0,
        },
        preRect: {
          show: true,
          width: 4,
          fill: '#40a9ff',
          radius: 2,
        },
        // 节点上左右上下四个方向上的链接circle配置
        linkPoints: {
          top: false,
          right: false,
          bottom: false,
          left: false,
          // circle的大小
          size: 3,
          lineWidth: 1,
          fill: '#72CC4A',
          stroke: '#72CC4A',
        },
        // 节点中icon配置
        logoIcon: {
          // 是否显示icon，值为 false 则不渲染icon
          show: true,
          x: 0,
          y: 0,
          // icon的地址，字符串类型
          img:
            'https://gw.alipayobjects.com/zos/basement_prod/4f81893c-1906-4de4-aff3-9a6b266bc8a2.svg',
          width: 16,
          height: 16,
          // 用于调整图标的左右位置
          offset: 0,
        },
        // 节点中表示状态的icon配置
        stateIcon: {
          // 是否显示icon，值为 false 则不渲染icon
          show: true,
          x: 0,
          y: 0,
          // icon的地址，字符串类型
          img:
            'https://gw.alipayobjects.com/zos/basement_prod/300a2523-67e0-4cbf-9d4a-67c077b40395.svg',
          width: 16,
          height: 16,
          // 用于调整图标的左右位置
          offset: -5,
        },
        // 连接点，默认为左右
        // anchorPoints: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }]
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      }
    const linkPoints = mix({}, defaultLinkPoints, cfg.linkPoints);

    const { top, left, right, bottom, size: markSize, ...markStyle } = linkPoints;
    const size =  [185, 90]
    const width = size[0];
    const height = size[1];

    if (left) {
      // left circle
      group.addShape('circle', {
        attrs: {
          ...markStyle,
          x: -width / 2,
          y: 0,
          r: markSize,
        },
        className: 'link-point-left',
        name: 'link-point-left',
        isAnchorPoint: true,
      });
    }

    if (right) {
      // right circle
      group.addShape('circle', {
        attrs: {
          ...markStyle,
          x: width / 2,
          y: 0,
          r: markSize,
        },
        className: 'link-point-right',
        name: 'link-point-right',
        isAnchorPoint: true,
      });
    }

    if (top) {
      // top circle
      group.addShape('circle', {
        attrs: {
          ...markStyle,
          x: 0,
          y: -height / 2,
          r: markSize,
        },
        className: 'link-point-top',
        name: 'link-point-top',
        isAnchorPoint: true,
      });
    }

    if (bottom) {
      // bottom circle
      group.addShape('circle', {
        attrs: {
          ...markStyle,
          x: 0,
          y: height / 2,
          r: markSize,
        },
        className: 'link-point-bottom',
        name: 'link-point-bottom',
        isAnchorPoint: true,
      });
    }
  }

G6.registerNode(
    'flow-rect', {
        shapeType: 'flow-rect',
        draw: (cfg, group) => {
            const {
                name = '', lightColor, hasChildren,priority, label, filter, collapsed, conditions,tierCode, decisionType
            } = cfg;
            let conStr = ''
            if (conditions){
              for (let i=0;i<conditions.length;i++){
                conStr = conStr+ " + " +conditions[i].field+" "+conditions[i].operator+" "+conditions[i].value+"\n"
              }
            }
            // 逻辑不应该在这里判断
            const rectConfig = {
                width: label!=='Response'?210:300,
                height: (label!=='Response'?84:94)+(conditions?conditions.length*10:0) +(decisionType?1:0),
                lineWidth: 1,
                fontSize: 12,
                fill: '#fff',
                radius: 4,
                stroke: lightColor,
                opacity: 1,
            };

            const textConfig = {
                textAlign: 'left',
                textBaseline: 'top',
            };

            const rect = group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    ...rectConfig,
                },
            });

            // label returnCode
            group.addShape('text', {
              attrs: {
                  ...textConfig,
                  x: 12,
                  y: 10,
                  text: tierCode?tierCode:'',
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign:'left',
                  isTitleShape: true,
                  fill:tierCode==='BYPASS'?'green':tierCode==='APPROVE'?'green':tierCode==='REJECT'?'red':'blue'
              },
            });
            // label title
            group.addShape('text', {
                attrs: {
                    ...textConfig,
                    x: 12,
                    y: 30,
                    text: label!=='Response'?name.length>25?name.substr(0,25)+'...':name:name,
                    fontSize: label!=='Response'?14:12,
                    fontWeight: label!=='Response'?'bold':'',
                    fill: '#000',
                    cursor: 'pointer',
                    textAlign:'left',
                    isTitleShape: true,
                },
            });

            // title condition filter
            group.addShape('text', {
              attrs: {
                  ...textConfig,
                  x: 12,
                  y: 50,
                  text: filter?filter:'',
                  fontSize: 10,
                  fontStyle:'italic',
                  fill: '#000',
              },
          });

          // title decision type
          group.addShape('text', {
            attrs: {
                ...textConfig,
                x: 12,
                y: rectConfig.height-20,
                text: decisionType?'Decision type: '+decisionType:'',
                fontSize: 10,
                fontStyle:'italic',
                fill: '#000',
            },
        });

            // label condition
            group.addShape('text', {
                attrs: {
                    ...textConfig,
                    x: 12,
                    y: 62,
                    text: conStr,
                    fontSize: 10,
                    fill: '#000'
                },
            });

            // label percentage
            group.addShape('text', {
                attrs: {
                    ...textConfig,
                    x: rectConfig.width - 10,
                    y: 10,
                    text: label+(priority?"["+priority+"]":''),
                    fontWeight:'bold',
                    fontSize: 14,
                    textAlign: 'right',
                    fill: lightColor,
                },
            });

            // bottom line
            group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: rectConfig.height-4,
                    width: rectConfig.width,
                    height: 4,
                    radius: [0, 0, rectConfig.radius, rectConfig.radius],
                    fill: '#DCDFE5',
                },
            });

            // bottom percent
            group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: rectConfig.height-4,
                    width: rectConfig.width,
                    height: 4,
                    radius: [0, 0, rectConfig.radius, rectConfig.radius],
                    fill: lightColor,
                },
            });

            if (hasChildren) {
                // collapse circle
                group.addShape('circle', {
                    attrs: {
                        x: rectConfig.width,
                        y: rectConfig.height / 2,
                        r: 8,
                        stroke: lightColor,
                        fill: collapsed ? lightColor : '#fff',
                        isCollapseShape: true,
                    },
                });

                // collapse text
                group.addShape('text', {
                    attrs: {
                        x: rectConfig.width,
                        y: rectConfig.height / 2,
                        width: 16,
                        height: 16,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        text: collapsed ? '+' : '-',
                        fontSize: 16,
                        fill: collapsed ? '#fff' : lightColor,
                        cursor: 'pointer',
                        isCollapseShape: true,
                    },
                });
            }

            drawLinkPoints(cfg, group);
            return rect;
        },
        update: (cfg, item) => {
            const group = item.getContainer();
            updateLinkPoints(cfg, group);
        },
        setState: (name, value, item) => {
            if (name === 'click' && value) {
                const group = item.getContainer();
                const {
                    collapsed
                } = item.getModel();
                const [, , , , , , CircleShape, TextShape] = group.get('children');
                if (TextShape) {
                    const {
                        attrs: {
                            stroke
                        },
                    } = CircleShape;
                    if (!collapsed) {
                        TextShape.attr({
                            text: '-',
                            fill: stroke,
                        });
                        CircleShape.attr({
                            fill: '#fff',
                        });
                    } else {
                        TextShape.attr({
                            text: '+',
                            fill: '#fff',
                        });
                        CircleShape.attr({
                            fill: stroke,
                        });
                    }
                }
            }
        },
        getAnchorPoints() {
            return [
                [0, 0.5],
                [1, 0.5],
            ];
        },
    },
    // 注意这里继承了 'single-shape'
    'rect',
);

G6.registerEdge(
    'flow-cubic', {
        getControlPoints: (cfg) => {
            let controlPoints = cfg.controlPoints; // 指定controlPoints
            if (!controlPoints || !controlPoints.length) {
                const {
                    startPoint,
                    endPoint,
                    sourceNode,
                    targetNode
                } = cfg;
                const {
                    x: startX,
                    y: startY,
                    coefficientX,
                    coefficientY
                } = sourceNode
                    ?
                    sourceNode.getModel() :
                    startPoint;
                const {
                    x: endX,
                    y: endY
                } = targetNode ? targetNode.getModel() : endPoint;
                let curveStart = (endX - startX) * coefficientX;
                let curveEnd = (endY - startY) * coefficientY;
                curveStart = curveStart > 10 ? 10 : curveStart;
                curveEnd = curveEnd < -10 ? curveEnd : -10;
                controlPoints = [{
                        x: startPoint.x + curveStart,
                        y: startPoint.y
                    },
                    {
                        x: endPoint.x + curveEnd,
                        y: endPoint.y
                    },
                ];
            }
            return controlPoints;
        },
        getPath: (points) => {
            const path = [];
            path.push(['M', points[0].x, points[0].y]);
            path.push([
                'C',
                points[1].x,
                points[1].y,
                points[2].x,
                points[2].y,
                points[3].x,
                points[3].y,
            ]);
            return path;
        },
    },
    'single-line',
);