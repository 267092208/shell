/**
 * @module 图层扩展层配置（两种方式来实现：通过扩展图层和扩展样式）
 */
const emptyMarkerSymbol = {
  type: "picture-marker",
  url: "/sysPages/styleHandlers/Icons/empty.png",
  width: 0,
  height: 0
};
/**
 * @type {{
 * [layerId:string]:{type:'extStyle'|'extLayer',renderer:Object[]}[],
 * }}
 */
const extLayerStyle = {
  xyyz: [
    {
      type: "extLayer",
      name: "显示销量",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "年销量",
          color: "#f00"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示编号",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        }
      },
      visible: false
    },
    {
      type: "extStyle",
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "是否目标+是否CRT",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            //做偏移
            value: "目标油站+CRT",
            symbol: {
              type: "picture-marker",
              url: "/images/tgz.png",
              width: 20,
              height: 20,
              scale: 0.7,
              anchor: [0.8, 0.5]
            }
          },
          {
            //不偏移
            value: "目标油站",
            symbol: {
              type: "picture-marker",
              url: "/images/tgz.png",
              width: 20,
              height: 20,
              anchor: [0.5, 0.5],
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示站名",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "站名"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        emptyMarkerSymbol,
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        },
        "unique-value": [
          {
            value: true,
            symbol: {
              type: "text",
              field: "油站编号",
              color: "#000",
              backgroundFillColor: "#FFFF00",
              strokeColor: "#FF0000",
              padding: [0, 0.5, 0, 0.5]
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extStyle",
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否目标+是否CRT",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: "目标油站+CRT",
            symbol: {
              type: "picture-marker",
              url: "/images/CRT.png",
              width: 20,
              height: 20,
              anchor: [0.1, 0.5],
              scale: 0.7
            }
          },
          {
            value: "非目标油站+CRT",
            symbol: {
              type: "picture-marker",
              url: "/images/CRT.png",
              width: 20,
              height: 20,
              anchor: [0.5, 0.5],
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    }
  ],
  gsyz: [
    {
      type: "extLayer",
      name: "显示销量",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "年销量",
          color: "#f00"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示编号",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        }
      },
      visible: false
    },
    {
      type: "extStyle",
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "目标",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: false,
            symbol: emptyMarkerSymbol
          },
          {
            value: true,
            symbol: {
              type: "picture-marker",
              url: "/images/tgz.png",
              width: 23,
              height: 22,
              xoffset: 10,
              yoffset: 10,
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extLayer",
      name: "显示站名",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "站名"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        emptyMarkerSymbol,
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        },
        "unique-value": [
          {
            value: true,
            symbol: {
              type: "text",
              field: "油站编号",
              color: "#000",
              backgroundFillColor: "#FFFF00",
              strokeColor: "#FF0000",
              padding: [0, 0.5, 0, 0.5]
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extStyle",
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否CRT油站",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: false,
            symbol: emptyMarkerSymbol
          },
          {
            value: true,
            symbol: {
              type: "picture-marker",
              url: "/images/CRT.png",
              width: 24,
              height: 24,
              xoffset: 0,
              yoffset: 16,
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    }
  ],
  shellyz: [
    {
      type: "extLayer",
      name: "显示销量",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "年销量",
          color: "#f00"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示编号",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        }
      },
      visible: false
    },
    {
      type: "extStyle",
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "目标",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: false,
            symbol: emptyMarkerSymbol
          },
          {
            value: true,
            symbol: {
              type: "picture-marker",
              url: "/images/tgz.png",
              width: 23,
              height: 22,
              xoffset: 10,
              yoffset: 10,
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extLayer",
      name: "显示站名",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "站名"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        emptyMarkerSymbol,
        defaultSymbol: {
          type: "text",
          field: "油站编号",
          color: "#00f"
        },
        "unique-value": [
          {
            value: true,
            symbol: {
              type: "text",
              field: "油站编号",
              color: "#000",
              backgroundFillColor: "#FFFF00",
              strokeColor: "#FF0000",
              padding: [0, 0.5, 0, 0.5]
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extStyle",
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否CRT油站",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: false,
            symbol: emptyMarkerSymbol
          },
          {
            value: true,
            symbol: {
              type: "picture-marker",
              url: "/images/CRT.png",
              width: 24,
              height: 24,
              xoffset: 0,
              yoffset: 16,
              scale: 0.7
            }
          }
        ]
      },
      visible: false
    },

    {
      type: "extStyle",
      name: "VA油站",
      renderer: {
        type: "unique-value",
        field: "是否VA油站",
        defaultSymbol: emptyMarkerSymbol,
        "unique-value": [
          {
            value: false,
            symbol: emptyMarkerSymbol
          },
          {
            value: true,
            symbol: {
              type: "picture-marker",
              url: "/images/VA.png",
              width: 24,
              height: 24,
              xoffset: 0,
              yoffset: 5
            }
          }
        ]
      },
      visible: false
    }
  ],
  nti: [
    {
      type: "extLayer",
      name: "显示十三五规划编号",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "十三五规划编号",
          color: "#f00"
        }
      },
      visible: false
    }
  ],
  target: [
    {
      type: "extLayer",
      name: "显示站名",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "站名"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示编号",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "编号"
        }
      },
      visible: false
    }
  ],
  poigroups: [
    {
      type: "extLayer",
      name: "显示柴油销量",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "柴油总日销量k",
          color: "#f00"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示汽油销量",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "汽油总日销量k",
          color: "#f00"
        }
      },
      visible: false
    },
    {
      type: "extLayer",
      name: "显示名称",
      renderer: {
        type: "simple",
        defaultSymbol: {
          type: "text",
          field: "名称",
          color: "#f00"
        }
      },
      visible: false
    }
  ]
};
extLayerStyle["gsnti"] = extLayerStyle["nti"];
export default extLayerStyle;
