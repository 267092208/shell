function parseDom(arg) {
  var objE = document.createElement("div");
  objE.innerHTML = arg;
  return objE.childNodes;
}
const domString = `<div class="ol-popup">
 <style>
  .ol-popup {
	min-width: 150px;
	min-height: 20px;
	position: absolute;
	background-color: white;
	padding: 15px;
	border-radius: 10px;
	border: 1px solid #cccccc;
	bottom: 12px;
	left: -50px;
  }
  .ol-popup .ol-popup-content {
	white-space: nowrap;
	width: inherit;
	display: block;
	min-width: 66px;
	padding: 0 3px;
	text-align: left;
  }
  .ol-popup:after,
  .ol-popup:before {
	top: 100%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
  }
  .ol-popup:after {
	border-top-color: white;
	border-width: 10px;
	left: 48px;
	margin-left: -10px;
  }
  .ol-popup:before {
	border-top-color: #cccccc;
	border-width: 11px;
	left: 48px;
	margin-left: -11px;
  }
  .ol-popup-closer {
	text-decoration: none;
	position: absolute;
	top: 2px;
	right: 8px;
	
  }
  .ol-popup-closer:hover {
	cursor: pointer;
	color: rgb(3, 1, 51);
  }
  .ol-popup-closer:after {
	content: "✖";
  }
  </style>
<a class="ol-popup-closer"></a>
<div class="ol-popup-content" ></div>
</div>
`;

export default function getDom() {
  const dom = parseDom(domString)[0];
  const closerDom = dom.getElementsByClassName("ol-popup-closer")[0];
  const contentDom = dom.getElementsByClassName("ol-popup-content")[0];
  const popup = {
    div: dom,
    closerDom: closerDom,
    contentDom
  };
  return popup;
}
