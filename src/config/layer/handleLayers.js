/**
 * @module 图层操作图层配置
 */

const handleLayers = {
  target: [
    {
      name: "目标 NTI",
      render: {
        sourceID: "nti",
        filterField: "是否目标站",
        filterValue: true
      },
      visible: true
    },
    {
      name: "目标社会站",
      render: {
        sourceID: "xyyz",
        filterField: "是否目标站",
        filterValue: true
      },
      visible: true
    },
    {
      name: "非目标NTI",
      render: {
        sourceID: "nti",
        filterField: "是否目标站",
        filterValue: false
      },
      visible: false
    },
    {
      name: "非目标社会站",
      render: {
        sourceID: "xyyz",
        filterField: "是否目标站",
        filterValue: false
      },
      visible: false
    },
    {
      name: "仅CRT NTI",
      render: {
        sourceID: "nti",
        filterField: "是否目标+是否CRT",
        filterValue: "非目标油站+CRT"
      },
      visible: false
    },
    {
      name: "仅CRT NTS",
      render: {
        sourceID: "xyyz",
        filterField: "是否CRT油站",
        filterValue: false
      },
      visible: false
    }
  ]
};

export default handleLayers;
