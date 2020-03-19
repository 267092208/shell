/**
 * @module 图层扩展层配置
 */

const emptyMarkerSymbol = {
  type: "picture-marker",
  url: "/sysPages/styleHandlers/Icons/empty.png",
  width: 0,
  height: 0
};

const extLayers = {
  xyyz: [
    {
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
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "目标",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 10
            }
          }
        ]
      },
      visible: false
    },

    {
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
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
          {
            value: false,
            symbol:emptyMarkerSymbol
          },
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
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否CRT油站",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 16
            }
          }
        ]
      },
      visible: false
    }
  ],
  gsyz: [
    {
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
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "目标",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 10
            }
          }
        ]
      },
      visible: false
    },

    {
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
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
          {
            value: false,
            symbol:emptyMarkerSymbol
          },
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
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否CRT油站",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 16
            }
          }
        ]
      },
      visible: false
    }
  ],
  shellyz: [
    {
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
      name: "目标站点",
      renderer: {
        type: "unique-value",
        field: "目标",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 10
            }
          }
        ]
      },
      visible: false
    },

    {
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
      name: "目标编号",
      renderer: {
        type: "unique-value",
        field: "目标",
        linkLayerIndex: 1,
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
          {
            value: false,
            symbol:emptyMarkerSymbol
          },
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
      name: "显示CRT",
      renderer: {
        type: "unique-value",
        field: "是否CRT油站",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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
              yoffset: 16
            }
          }
        ]
      },
      visible: false
    },

    {
      name: "VA油站",
      renderer: {
        type: "unique-value",
        field: "是否VA油站",
        defaultSymbol: emptyMarkerSymbol,
        uniqueValueInfos: [
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

extLayers["gsnti"] = extLayers["nti"];

export default extLayers;
