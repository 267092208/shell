const searchSources = [
    {
        source: {
            type: 'layer',
            layerids: ['xyyz', 'gsyz', 'shellyz']
        },
        name: '油站搜索',
        placeholder: '油站编号或站名(Esc清除结果)',
        format: feature => {
            return {
                "编号": feature.properties['油站编号'],
                "站名": feature.properties['站名']
            };
        },
        getPopupHtml: feature => {
            return `
          <div>
              <b style="color:#cc5522;">${feature.properties['油站编号']} ${feature.properties['站名']}</b>
          </div>`;
        }
    },
    {
        source: {
            type: 'baidu'
        },
        name: '百度搜索',
        placeholder: '视野内搜索(Esc清除结果)',
        format: feature => {
            return {
                "名称": feature.properties.title,
                "地址": feature.properties.address
            };
        },
        getPopupHtml: feature => {
            return `
          <div>
              <div>
                  <span style="width:185px;color:#cc5522;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;display: inline-block;">
                      ${feature.properties.title} 
                  </span>
                  <a target="_blank" href="${feature.properties.url}" style="margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;position: relative;top: -7px;">详情</a>
              </div>
              <div><b>地址:</b>${feature.properties.address || ''}</div>
              <div><b>电话:</b>${feature.properties.phoneNumber || ''}</div>
          </div>`;
        }
    },
];
export default searchSources