/**
 * @module 图层渲染器配置
 */

const renders = {
  xyyz: [
    {
      name: "按品牌显示",
      type: "unique-value",
      field: "品牌-是否停业",
      defaultSymbol: {
        type: "picture-marker",
        url: "/sysPages/styleHandlers/Icons/yz.png",
        width: 24,
        height: 24,
        anchor: "center"
      },
      uniqueValueInfos: [
        // SP
        {
          value: "SP-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165835936941250.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "SP-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165835936941250.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // PC
        {
          value: "PC-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165835991316250.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "PC-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165835991316250.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // BPPC
        {
          value: "BPPC-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836054441250.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "BPPC-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836054441250.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // IND
        {
          value: "IND-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836104128750.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "IND-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836104128750.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // CNOOC
        {
          value: "CNOOC-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276804919539.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "CNOOC-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276804919539.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // SC
        {
          value: "SC-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276872418675.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "SC-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276872418675.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // Caltex
        {
          value: "Caltex-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276919605571.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "Caltex-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635168276919605571.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // YC Shell
        {
          value: "YC Shell-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836217410000.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "YC Shell-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635165836217410000.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // 停车场
        {
          value: "停车场-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/636202504781415330.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "停车场-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/636202504781415330.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // TOPE
        {
          value: "TOPE-false",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/TOPE.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "TOPE-true",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/TOPE.png-gray.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        }
      ]
    }
  ],
  ma: [
    {
      name: "按自定义颜色",
      type: "simple",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: function(feature) {
          return feature.get("颜色");
        },
        fillOpacity: 0.2,
        strokeColor: "#000000",
        strokeOpacity: "1",
        strokeStyle: "",
        strokeWeight: "1"
      }
    },
    {
      name: "按Ranking等级",
      type: "unique-value",
      field: "rankingLv",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: "#1000A3",
        fillOpacity: 0.5,
        strokeColor: "#000000",
        strokeOpacity: "1",
        strokeStyle: "",
        strokeWeight: "1"
      },
      uniqueValueInfos: [
        {
          value: "Primary",
          symbol: {
            type: "simple-fill",
            fillColor: "#00FC0C",
            fillOpacity: 0.2,
            strokeColor: "#000000",
            strokeOpacity: "1",
            strokeStyle: "",
            strokeWeight: "1"
          }
        },
        {
          value: "Secondary",
          symbol: {
            type: "simple-fill",
            fillColor: "#FC8F00",
            fillOpacity: 0.2,
            strokeColor: "#000000",
            strokeOpacity: "1",
            strokeStyle: "",
            strokeWeight: "1"
          }
        },
        {
          value: "Secondary次优先",
          symbol: {
            type: "simple-fill",
            fillColor: "#FF8205",
            fillOpacity: 0.2,
            strokeColor: "#000000",
            strokeOpacity: "1",
            strokeStyle: "",
            strokeWeight: "1"
          }
        },
        {
          value: "Tertiary",
          symbol: {
            type: "simple-fill",
            fillColor: "#F23400",
            fillOpacity: 0.25,
            strokeColor: "#000000",
            strokeOpacity: "1",
            strokeStyle: "",
            strokeWeight: "1"
          }
        },
        {
          value: "其他",
          symbol: {
            type: "simple-fill",
            fillColor: "#1000A3",
            fillOpacity: 0.5,
            strokeColor: "#000000",
            strokeOpacity: "1",
            strokeStyle: "",
            strokeWeight: "1"
          }
        }
      ]
    }
  ],
  nti: [
    {
      name: "按crt显示",
      type: "unique-value",
      field: "是否目标+是否CRT",
      defaultSymbol: {
        type: "picture-marker",
        url: "/sysPages/styleHandlers/Icons/635165835936941250.png-gray.png",
        width: 24,
        height: 24,
        anchor: "center"
      },
      uniqueValueInfos: [
        {
          value: "目标油站+CRT",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/NTI_CRT2.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "非目标油站+CRT",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/NTI_CRT1.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        // PC
        {
          value: "非目标油站",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "目标油站",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923222406700.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        }
      ]
    }
  ],
  xzqh: [
    {
      name: "按行政区划",
      type: "simple",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: "#67C23A",
        fillOpacity: 0.2,
        strokeColor: "#000000",
        strokeOpacity: 0,
        strokeStyle: "",
        strokeWeight: "1"
      }
    }
  ],
  sq: [
    {
      name: "按商圈类型",
      type: "unique-value",
      field: "类型",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: "#FFDC2D",
        fillOpacity: 0.6,
        strokeColor: "#2F0DBA",
        strokeOpacity: "5",
        strokeStyle: "虚线",
        strokeWeight: "2"
      },
      uniqueValueInfos: [
        {
          value: "商住区",
          symbol: {
            type: "simple-fill",
            fillColor: "#FFDC2D",
            fillOpacity: 0.6,
            strokeColor: "#2F0DBA",
            strokeOpacity: 0.5,
            strokeStyle: "虚线",
            strokeWeight: "2"
          }
        },
        {
          value: "工业区",
          symbol: {
            type: "simple-fill",
            fillColor: "#C4013C",
            fillOpacity: 0.5,
            strokeColor: "#55A04E",
            strokeOpacity: 0.7,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "农林区",
          symbol: {
            type: "simple-fill",
            fillColor: "#37C617",
            fillOpacity: 0.5,
            strokeColor: "#6D96E0",
            strokeOpacity: 0.2,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "商贸区",
          symbol: {
            type: "simple-fill",
            fillColor: "#0F64E2",
            fillOpacity: 0.5,
            strokeColor: "#F4E400",
            strokeOpacity: 0,
            strokeStyle: "虚线",
            strokeWeight: "2"
          }
        },
        {
          value: "物流园区",
          symbol: {
            type: "simple-fill",
            fillColor: "#B215AA",
            fillOpacity: 0.5,
            strokeColor: "#D91AF2",
            strokeOpacity: 0.2,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "特色产业",
          symbol: {
            type: "simple-fill",
            fillColor: "#F700CE",
            fillOpacity: 0.5,
            strokeColor: "#9B0D88",
            strokeOpacity: 0.5,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "类型7",
          symbol: {
            type: "simple-fill",
            fillColor: "#F700CE",
            fillOpacity: 0.5,
            strokeColor: "#9B0D88",
            strokeOpacity: 0.5,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        }
      ]
    }
  ],
  corridor: [
    {
      name: "按道路类型",
      type: "unique-value",
      field: "道路类型",
      defaultSymbol: {
        type: "simple-Line",
        strokeColor: "#F94027",
        strokeOpacity: 0,
        strokeStyle: "实线",
        strokeWeight: "3"
      },
      uniqueValueInfos: [
        {
          value: "国道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#F94027",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "3"
          }
        },
        {
          value: "省道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#261FF4",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "高速公路",
          symbol: {
            type: "simple-Line",
            strokeColor: "#278C33",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "3"
          }
        },
        {
          value: "城市主干道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#F433EE",
            strokeOpacity: 0.8,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        },
        {
          value: "城市快速干线",
          symbol: {
            type: "simple-Line",
            strokeColor: "#90DB20",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "3"
          }
        },
        {
          value: "城际主要连接线",
          symbol: {
            type: "simple-Line",
            strokeColor: "#A8FF26",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "2"
          }
        }
      ]
    },
    {
      name: "按道路重要性",
      type: "unique-value",
      field: "道路重要性",
      defaultSymbol: {
        type: "simple-Line",
        strokeColor: "#00FFFF",
        strokeOpacity: 0.5,
        strokeStyle: "虚线",
        strokeWeight: "3"
      },
      uniqueValueInfos: [
        {
          value: "一级",
          symbol: {
            type: "simple-Line",
            strokeColor: "#1FF42A",
            strokeOpacity: 0.5,
            strokeStyle: "虚线",
            strokeWeight: "3"
          }
        },
        {
          value: "二级",
          symbol: {
            type: "simple-Line",
            strokeColor: "#EFF925",
            strokeOpacity: 0.5,
            strokeStyle: "虚线",
            strokeWeight: "2"
          }
        },
        {
          value: "三级",
          symbol: {
            type: "simple-Line",
            strokeColor: "#F90911",
            strokeOpacity: 0.5,
            strokeStyle: "虚线",
            strokeWeight: "2"
          }
        }
      ]
    }
  ],
  roadnetwork: [
    {
      name: "柴油车车流",
      type: "class-break",
      field: "柴油车车流",
      defaultSymbol: {
        type: "simple-Line",
        strokeColor: "#F3F71B",
        strokeWeight: 4,
        strokeOpacity: 1
      },
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 1000,
          symbol: {
            type: "simple-Line",
            strokeColor: "#F3F71B",
            strokeWeight: 4,
            strokeOpacity: 1
          }
        },
        {
          minValue: 1000,
          maxValue: 2000,
          symbol: {
            type: "simple-Line",
            strokeColor: "#E07000",
            strokeWeight: 3,
            strokeOpacity: 1
          }
        },
        {
          minValue: 2000,
          maxValue: 3000,
          symbol: {
            type: "simple-Line",
            strokeColor: "#DD200F",
            strokeWeight: 3,
            strokeOpacity: 1
          }
        },
        {
          minValue: 3000,
          maxValue: 10000,
          symbol: {
            type: "simple-Line",
            strokeColor: "#4F0E00",
            strokeWeight: 3,
            strokeOpacity: 1
          }
        }
      ]
    }
  ],
  ///TODO:零售点的图标地址不对，暂时先随便用一个替代
  lsd: [
    {
      name: "按类型",
      type: "unique-value",
      field: "类型",
      defaultSymbol: {
        type: "picture-marker",
        url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
        width: 24,
        height: 24,
        anchor: "center"
      },
      uniqueValueInfos: [
        {
          value: "类型1",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "类型2",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "类型3",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        },
        {
          value: "类型4",
          symbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
            width: 24,
            height: 24,
            anchor: "center"
          }
        }
      ]
    }
  ],
  scyk: [
    {
      name: "按品牌",
      type: "simple",
      defaultSymbol: {
        type: "picture-marker",
        url: "/sysPages/styleHandlers/Icons/scyk.png",
        width: 24,
        height: 24,
        anchor: "center"
      }
    }
    // {
    //   name: "按品牌",
    //   type: "unique-value",
    //   field: "品牌",
    //   defaultSymbol: {
    //     type: "picture-marker",
    //     url: "/sysPages/styleHandlers/Icons/636172486047515241.gif",
    //     width: 24,
    //     height: 24,
    //     anchor: "center"
    //   },
    //   uniqueValueInfos: [
    //     {
    //       value: "SP",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486047515241.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "PC",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636462713263154181.png",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "BPPC",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486262366724.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "IND",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486462086694.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "CNOOC",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486511041589.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "SC",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486547755260.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "Caltex",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486581948679.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     },
    //     {
    //       value: "Shell",
    //       symbol: {
    //         type: "picture-marker",
    //         url: "/sysPages/styleHandlers/Icons/636172486617522236.gif",
    //         width: 24,
    //         height: 24,
    //         anchor: "center"
    //       }
    //     }
    //   ]
    // }
  ],
  lpglng: [
    {
      name: "按类型",
      type: "simple",
      defaultSymbol: {
        type: "picture-marker",
        url: "/images/search.png",
        width: 32,
        height: 32,
        anchor: "center"
      }
    }
  ],
  xl: [
    {
      name: "按道路级别",
      type: "unique-value",
      field: "PathLevel",
      defaultSymbol: {
        type: "simple-Line",
        strokeColor: "#59CC59",
        strokeOpacity: 1,
        strokeStyle: "实线",
        strokeWeight: "6"
      },
      uniqueValueInfos: [
        {
          value: "国道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#59CC59",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "6"
          }
        },
        {
          value: "省道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#447016",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "5"
          }
        },
        {
          value: "在建",
          symbol: {
            type: "simple-Line",
            strokeColor: "#F4AB00",
            strokeOpacity: 1,
            strokeStyle: "虚线",
            strokeWeight: "4"
          }
        },
        {
          value: "即将通车",
          symbol: {
            type: "simple-Line",
            strokeColor: "#00C410",
            strokeOpacity: 1,
            strokeStyle: "虚线",
            strokeWeight: "3"
          }
        },
        {
          value: "规划高速",
          symbol: {
            type: "simple-Line",
            strokeColor: "#15BA0D",
            strokeOpacity: 0.7,
            strokeStyle: "虚线",
            strokeWeight: "6"
          }
        },
        {
          value: "城市主干道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#036D00",
            strokeOpacity: 0.5,
            strokeStyle: "实线",
            strokeWeight: "3"
          }
        },
        {
          value: "规划主干道",
          symbol: {
            type: "simple-Line",
            strokeColor: "#ED7600",
            strokeOpacity: 0.75,
            strokeStyle: "虚线",
            strokeWeight: "3"
          }
        },
        {
          value: "级别4",
          symbol: {
            type: "simple-Line",
            strokeColor: "#F8F",
            strokeOpacity: 1,
            strokeStyle: "实线",
            strokeWeight: "4"
          }
        }
      ]
    }
  ],
  poi: [
    [
      {
        name: "按POI级别",
        type: "unique-value",
        field: "POI级别",
        defaultSymbol: {
          type: "simple-Marker",
          fillColor: "#00ff00",
          fillOpacity: 0.1,
          strokeColor: "#0000ff",
          strokeOpacity: 0,
          strokeStyle: "实线",
          strokeWeight: "1",
          radius: 200,
          shape: "circle"
        },
        uniqueValueInfos: [
          {
            value: "高",
            symbol: {
              type: "simple-Marker",
              fillColor: "#ff0000",
              fillOpacity: 0.1,
              strokeColor: "#0000ff",
              strokeOpacity: 0,
              strokeStyle: "实线",
              strokeWeight: "1",
              radius: 1000,
              shape: "circle"
            }
          },
          {
            value: "中",
            symbol: {
              type: "simple-Marker",
              fillColor: "#ff0000",
              fillOpacity: 0.1,
              strokeColor: "#0000ff",
              strokeOpacity: 0,
              strokeStyle: "实线",
              strokeWeight: "1",
              radius: 500,
              shape: "circle"
            }
          },
          {
            value: "低",
            symbol: {
              type: "simple-Marker",
              fillColor: "#ff0000",
              fillOpacity: 0.1,
              strokeColor: "#0000ff",
              strokeOpacity: 0,
              strokeStyle: "实线",
              strokeWeight: "1",
              radius: 200,
              shape: "circle"
            }
          }
        ]
      },
      {
        name: "按POI类型",
        type: "unique-value",
        field: "POI类型",
        defaultSymbol: {
          type: "picture-marker",
          url: "/sysPages/styleHandlers/Icons/POI1.png",
          width: 24,
          height: 24,
          anchor: "center"
        },
        uniqueValueInfos: [
          {
            value: "机场",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI1.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "客运站",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI2.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "火车站",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI3.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "港口",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI4.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "物流园",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI5.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "产业园",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI6.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "工业园",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/POI7.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          }
        ]
      }
    ]
  ],
  poigroups: [
    {
      name: "按组团评级",
      type: "unique-value",
      field: "组团评级",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: "#7D79DB",
        fillOpacity: 0.5,
        strokeColor: "#0A0301",
        strokeOpacity: 0,
        strokeStyle: "实线",
        strokeWeight: "1"
      },
      uniqueValueInfos: [
        {
          value: "高",
          symbol: {
            type: "simple-fill",
            fillColor: "#0600C6",
            fillOpacity: 0.5,
            strokeColor: "#000000",
            strokeOpacity: 0,
            strokeStyle: "实线",
            strokeWeight: "1"
          }
        },
        {
          value: "中",
          symbol: {
            type: "simple-fill",
            fillColor: "#1010D3",
            fillOpacity: 0.5,
            strokeColor: "#000000",
            strokeOpacity: 0,
            strokeStyle: "实线",
            strokeWeight: "1"
          }
        },
        {
          value: "低",
          symbol: {
            type: "simple-fill",
            fillColor: "#8332BC",
            fillOpacity: 0.5,
            strokeColor: "#0A0301",
            strokeOpacity: 0,
            strokeStyle: "实线",
            strokeWeight: "1"
          }
        }
      ]
    },
    {
      name: "按自定义颜色",
      type: "simple",
      defaultSymbol: {
        type: "simple-fill",
        fillColor: function(feature) {
          return feature.get("fillColor");
        },
        fillOpacity: 0.5,
        strokeColor: function(feature) {
          return feature.get("strokeColor");
        },
        strokeOpacity: 0,
        strokeStyle: function(feature) {
          return feature.get("strokeColor");
        },
        strokeWeight: "1"
      }
    }
  ],
  target: [
    {
      layerType: "Composite",
      nti: {
        name: "按crt显示",
        type: "unique-value",
        field: "是否目标+是否CRT",
        defaultSymbol: {
          type: "picture-marker",
          url: "/sysPages/styleHandlers/Icons/635165835936941250.png-gray.png",
          width: 24,
          height: 24,
          anchor: "center"
        },
        uniqueValueInfos: [
          {
            value: "目标油站+CRT",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/NTI_CRT2.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "非目标油站+CRT",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/NTI_CRT1.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          // PC
          {
            value: "非目标油站",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/635185923345684794.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          },
          {
            value: "目标油站",
            symbol: {
              type: "picture-marker",
              url: "/sysPages/styleHandlers/Icons/635185923222406700.png",
              width: 24,
              height: 24,
              anchor: "center"
            }
          }
        ]
      },
      xyyz: [
        {
          name: "按品牌显示",
          type: "unique-value",
          field: "品牌",
          defaultSymbol: {
            type: "picture-marker",
            url: "/sysPages/styleHandlers/Icons/yz.png",
            width: 24,
            height: 24,
            anchor: "center"
          },
          uniqueValueInfos: [
            {
              value: "SP",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635165835936941250.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#FA02FF",
                TextColor: "#3D2727"
              }
            },
            {
              value: "PC",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635165835991316250.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#FC7B19",
                TextColor: "#AD4E05"
              }
            },
            {
              value: "BPPC",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635165836054441250.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#16E000",
                TextColor: "#045E13"
              }
            },

            {
              value: "IND",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635165836104128750.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#2C25F7",
                TextColor: "#A000A3"
              }
            },
            {
              value: "CNOOC",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635168276804919539.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#0CC0D1",
                TextColor: "#AF0F1F"
              }
            },

            {
              value: "SC",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635168276872418675.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#02484F",
                TextColor: "#200F6D"
              }
            },
            {
              value: "Caltex",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635168276919605571.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#145607",
                TextColor: "#072107"
              }
            },
            {
              value: "YC Shell",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/635165836217410000.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#FF0F0F",
                TextColor: "#B59A07"
              }
            },

            {
              value: "停车场",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/636202504781415330.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#FF0F0F",
                TextColor: "#DD5858"
              }
            },

            {
              value: "TOPE-false",
              symbol: {
                type: "picture-marker",
                url: "/sysPages/styleHandlers/Icons/TOPE.png",
                width: 24,
                height: 24,
                anchor: "center",
                MinIcon: "#EF4F4F",
                TextColor: "#593DF7"
              }
            }
          ]
        },
        {
          name: "按是否目标站",
          type: "unique-value",
          field: "target-是否目标站",
          defaultSymbol: {
            type: "picture-marker",
            url: "/images/tgz.png", //url不能为空
            width: 0,
            height: 0,
            anchor: "center"
          },
          uniqueValueInfos: [
            {
              value: "true",
              symbol: {
                type: "picture-marker",
                url: "/images/tgz.png",
                width: 20,
                height: 20,
                anchor: "center",
                xoffset: 10,
                yoffset: 10
              }
            },
            {
              value: "false",
              symbol: {
                type: "picture-marker",
                url: "/images/tgz.png",
                width: 0,
                height: 0,
                anchor: "center",
                xoffset: 10,
                yoffset: 10
              }
            }
          ]
        },
        {
          name: "按是否CRT",
          type: "unique-value",
          field: "是否CRT油站",
          defaultSymbol: {
            type: "picture-marker",
            url: "/images/CRT.png",
            width: 0,
            height: 0,
            anchor: "center"
          },
          uniqueValueInfos: [
            {
              value: "true",
              symbol: {
                type: "picture-marker",
                url: "/images/CRT.png",
                width: 24,
                height: 24,
                xoffset: 0,
                yoffset: 16
              }
            },
            {
              value: "false",
              symbol: {
                type: "picture-marker",
                url: "/images/CRT.png",
                width: 0,
                height: 0,
                anchor: "center",
                xoffset: 0,
                yoffset: 16
              }
            }
          ]
        }
      ],
      render: function(id) {
        return this[id];
      }
    }
  ]
};

renders["shellyz"] = renders["gsyz"] = renders["xyyz"];
renders["gsnti"] = renders["nti"];
export default renders;
