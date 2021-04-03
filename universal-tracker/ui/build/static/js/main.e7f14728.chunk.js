(this["webpackJsonpuniversal-tracker-ui"]=this["webpackJsonpuniversal-tracker-ui"]||[]).push([[0],{118:function(t,e,n){},149:function(t,e,n){"use strict";n.r(e);var i=n(0),a=n.n(i),r=n(12),s=n.n(r),o=(n(118),n(119),n(120),n(100)),c=n(18),l=n(21),u=n(41),y=n(40),h=n(8),d=n(61),g=n(179),f=n(182),p=n(190),m=n(192),j=n(184),v=n(186),b=n(187),O=n(183),x=n(188),S=n(150),E=n(189),k=n(185),C=n(25),N=n(20),T=n(93),w=n(16),P=n(62),A=function(){function t(){Object(c.a)(this,t),this.entityName="",this.entityKey="",this.version=0,this.stateDiff=[],this.isEntityDestructed=!1}return Object(l.a)(t,null,[{key:"GetEntityId",value:function(e){return t.FormatEntityId(e.entityName,e.entityKey)}},{key:"FormatEntityId",value:function(t,e){return"@".concat(t,"@").concat(e)}}]),t}(),D=n(63),R=n(27),I="/a/p/i",M=function(t){Object(u.a)(n,t);var e=Object(y.a)(n);function n(t){var i;return Object(c.a)(this,n),(i=e.call(this,w.d.instance))._configFabric=t,i}return Object(l.a)(n,[{key:"send",value:function(t){var e=this;if(t.url.includes(I)){var i=this._configFabric();if(i.accessTokenFactory)return i.accessTokenFactory().then((function(i){return t.headers={},t.headers.Authorization="Bearer "+i,Object(D.a)(Object(R.a)(n.prototype),"send",e).call(e,t)}));if(i.fakeUserNamePromise)return i.fakeUserNamePromise.then((function(i){return i&&(t.headers={},t.headers["x-ms-client-principal-name"]=i),Object(D.a)(Object(R.a)(n.prototype),"send",e).call(e,t)}))}return Object(D.a)(Object(R.a)(n.prototype),"send",this).call(this,t)}}]),n}(w.a),K=function(){function t(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];Object(c.a)(this,t),this._entityName=e,this.items=[],this._entityName=this._entityName.toLowerCase(),Object(h.n)(this,{items:h.o}),n&&this.attachAllEntities()}return Object(l.a)(t,[{key:"attachAllEntities",value:function(){t.initSignalR(),t.EntitySets[this._entityName]=this.items,t.fetchAndApplyAllEntityStates(this._entityName)}},{key:"attachEntity",value:function(e){var n=A.FormatEntityId(this._entityName,e);t.EntityStates[n]||(t.EntitySets[n]=this.items,t.attachEntity(this._entityName,e,void 0))}},{key:"createEntity",value:function(e){t.createEntity(this._entityName,e,void 0)}},{key:"signalEntity",value:function(e,n,i){return t.signalEntity(this._entityName,e,n,i)}},{key:"callEntity",value:function(e,n,i){return t.callEntity(this._entityName,e,n,i)}},{key:"updateEntityMetadata",value:function(e,n){return t.updateEntityMetadata(this._entityName,e,n)}}],[{key:"attachEntity",value:function(e,n,i){t.initSignalR(),e=e.toLowerCase();var a=A.FormatEntityId(e,n);return this.EntityStates[a]?this.EntityStates[a].state:(i&&Object(h.m)(i),this.fetchAndApplyEntityState(e,n,0,0,i),i)}},{key:"createEntity",value:function(t,e,n){return this.updateEntityMetadata(t,e,{}),this.attachEntity(t,e,n)}},{key:"signalEntity",value:function(t,e,n,i){t=t.toLowerCase();var a="".concat(I,"/entities/").concat(t,"/").concat(e,"/").concat(n);return this.HttpClient.post(a,{content:JSON.stringify(i)}).then()}},{key:"callEntity",value:function(t,e,n,i){var a=this;t=t.toLowerCase();var r="".concat(I,"/entities/").concat(t,"/").concat(e,"/").concat(n);return new Promise((function(t,e){a.HttpClient.post(r,{content:JSON.stringify(i)}).then((function(n){var i=JSON.parse(n.content).correlationId;a.SignalResultPromises[i]={resolve:t,reject:e}}),e)}))}},{key:"updateEntityMetadata",value:function(t,e,n){return this.signalEntity(t,e,"$update-entity-internal-metadata",n)}},{key:"setup",value:function(t){this.Config=t,this.Config.logger||(this.Config.logger=w.d.instance)}},{key:"entityAdded",value:function(t,e,n){var i=A.FormatEntityId(t,e),a=this.EntitySets[i];a?delete this.EntitySets[i]:a=this.EntitySets[t],a&&(n.entityKey=e,a.push(n))}},{key:"entityDeleted",value:function(t,e){var n=this.EntitySets[t];if(n)for(var i=0;i<n.length;i++)if(n[i].entityKey===e){n.splice(i,1);break}}},{key:"fetchAndApplyEntityState",value:function(t,e,n,i){var a=this,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,s="".concat(I,"/entities/").concat(t,"/").concat(e);this.HttpClient.get(s).then((function(i){var s=JSON.parse(i.content),o=A.FormatEntityId(t,e);if(n&&s.version<n)throw new Error("Expected ".concat(o," of version ").concat(n,", but got version ").concat(s.version));if(r){s.state.entityKey=r.entityKey;var c=P.createPatch(r,s.state);P.applyPatch(r,c)}else r=s.state,Object(h.m)(r);a.EntityStates[o]||a.entityAdded(t,e,r),a.EntityStates[o]={state:r,version:s.version}})).catch((function(s){i<a.MaxRetryCount?(i++,setTimeout((function(){a.fetchAndApplyEntityState(t,e,n,i,r)}),i*a.RetryBaseIntervalMs)):a.Config.logger.log(w.c.Error,"DurableEntitySet: failed to fetch entity state: ".concat(s))}))}},{key:"fetchAndApplyAllEntityStates",value:function(t){var e=this,n="".concat(I,"/entities/").concat(t);this.HttpClient.get(n).then((function(n){var i,a=Object(T.a)(JSON.parse(n.content));try{for(a.s();!(i=a.n()).done;){var r=i.value,s=r.entityKey,o=A.FormatEntityId(t,s),c=r;Object(h.m)(c.state),e.EntityStates[o]=c,e.entityAdded(t,s,c.state)}}catch(l){a.e(l)}finally{a.f()}})).catch((function(t){e.Config.logger.log(w.c.Error,"DurableEntitySet: failed to fetch entity states: ".concat(t))}))}},{key:"entityStateChangedMessageHandler",value:function(t){var e=this,n=A.GetEntityId(t);if(this.Config.logger.log(w.c.Trace,"DurableEntitySet: ".concat(n," changed to version ").concat(t.version)),t.isEntityDestructed)delete this.EntityStates[n],this.entityDeleted(t.entityName,t.entityKey);else if(this.EntityStates[n]){var i=this.EntityStates[n].version+1;t.version>i?this.fetchAndApplyEntityState(t.entityName,t.entityKey,t.version,0,this.EntityStates[n].state):t.version===i&&(P.applyPatch(this.EntityStates[n].state,t.stateDiff),this.EntityStates[n].version=t.version)}else(this.EntitySets[n]||this.EntitySets[t.entityName])&&setTimeout((function(){return e.fetchAndApplyEntityState(t.entityName,t.entityKey,t.version,0)}),this.RetryBaseIntervalMs)}},{key:"entitySignalResponseHandler",value:function(t){var e=this.SignalResultPromises[t.correlationId];e&&(t.errorMessage?e.reject(new Error(t.errorMessage)):e.resolve(t.result),delete this.SignalResultPromises[t.correlationId])}},{key:"initSignalR",value:function(){var t=this;this.SignalRConn||(this.SignalRConn=(new w.b).withUrl("".concat(I),{httpClient:this.HttpClient,logger:this.Config.logger}).build(),this.SignalRConn.on("entity-state-changed",(function(e){return t.entityStateChangedMessageHandler(e)})),this.SignalRConn.on("entity-signal-response",(function(e){return t.entitySignalResponseHandler(e)})),this.SignalRConn.onclose((function(){!function e(){t.Config.logger.log(w.c.Information,"DurableEntitySet: reconnecting to SignalR..."),t.SignalRConn.start().then((function(){t.Config.logger.log(w.c.Information,"DurableEntitySet: reconnected to SignalR")}),(function(){setTimeout(e,t.SignalRReconnectIntervalInMs)}))}()})),this.SignalRConn.start().then((function(){t.Config.logger.log(w.c.Information,"DurableEntitySet: successfully connected to SignalR")}),(function(e){t.Config.logger.log(w.c.Error,"DurableEntitySet: failed to connect to SignalR: ".concat(e))})))}}]),t}();K.Config={logger:w.d.instance},K.HttpClient=new M((function(){return K.Config})),K.EntitySets={},K.EntityStates={},K.SignalResultPromises={},K.SignalRConn=void 0,K.SignalRReconnectIntervalInMs=5e3,K.MaxRetryCount=6,K.RetryBaseIntervalMs=500;var F=n(6),z=Object(d.a)(function(t){Object(u.a)(n,t);var e=Object(y.a)(n);function n(){return Object(c.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var t=this,e=new N.Map(this.props.entityKey,{style:"road_shaded_relief",language:"en-US",authOptions:{authType:N.AuthenticationType.subscriptionKey,subscriptionKey:this.props.azureMapSubscriptionKey}});e.events.add("ready",(function(){e.controls.add([new N.control.ZoomControl],{position:N.ControlPosition.BottomRight}),e.sources.add(t.props.dataSource);var n=new N.layer.LineLayer(t.props.dataSource,void 0,{strokeColor:"DarkOrchid",strokeWidth:3});e.layers.add(n)})),Object(h.f)((function(){e.setCamera({bounds:t.props.bounds,padding:40})}))}},{key:"render",value:function(){return Object(F.jsx)("div",{id:this.props.entityKey,className:"map-div"})}}]),n}(i.Component));K.setup({logger:{log:function(t,e){return console.log(e)}},fakeUserNamePromise:new Promise((function(t){fetch("/.auth/me").then((function(t){return t.json()})).then((function(e){if(!e||!e.length)throw new Error("EasyAuth seems to be not configured. Falling back to a fake user name");_.userName=e[0].user_id,t(null)})).catch((function(){_.userName=prompt("Enter your name:","Anonymous"),t(_.userName)}))}))});var _=Object(h.m)({entities:new K("TrackerEntity"),userName:"",nameText:"",urlText:"",jsonPathText:"",inProgress:!1,mapDataSources:{}}),L=Object(d.a)(function(t){Object(u.a)(n,t);var e=Object(y.a)(n);function n(){return Object(c.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t=this,e=_.entities.items.filter((function(t){return!!t.points.length})).map((function(t){return new Date(t.points[0].time).getTime()})),n=Math.min.apply(Math,Object(o.a)(e));return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(g.a,{position:"static",color:"default",className:"app-bar",children:Object(F.jsxs)(f.a,{children:[Object(F.jsx)(p.a,{className:"name-text",label:"Name",placeholder:"e.g. 'Temperature in Oslo'",InputLabelProps:{shrink:!0},variant:"outlined",size:"small",value:_.nameText,disabled:_.inProgress,onChange:function(t){return _.nameText=t.target.value}}),Object(F.jsx)(m.a,{width:30}),Object(F.jsx)(p.a,{fullWidth:!0,label:"URL to track",placeholder:"e.g. 'https://api.openweathermap.org/data/2.5/weather?q=Oslo&appid={api-key}'",InputLabelProps:{shrink:!0},variant:"outlined",size:"small",value:_.urlText,disabled:_.inProgress,onChange:function(t){return _.urlText=t.target.value}}),Object(F.jsx)(m.a,{width:30}),Object(F.jsx)(p.a,{className:"json-query-text",label:"(optional) JSON Query or Regular Expression",placeholder:"e.g. '$.main.temp'",InputLabelProps:{shrink:!0},variant:"outlined",size:"small",value:_.jsonPathText,disabled:_.inProgress,onChange:function(t){return _.jsonPathText=t.target.value}}),Object(F.jsx)(m.a,{width:30}),Object(F.jsx)(j.a,{variant:"contained",color:"default",size:"large",className:"new-entity-button",disabled:!_.nameText||!_.urlText||_.inProgress,onClick:function(){return t.createNewEntity()},children:"Track"}),Object(F.jsx)(m.a,{width:40}),Object(F.jsx)(k.a,{}),Object(F.jsx)(m.a,{width:5}),Object(F.jsx)(v.a,{children:_.userName})]})}),_.inProgress?Object(F.jsx)(b.a,{}):Object(F.jsx)(m.a,{height:4}),Object(F.jsxs)(O.a,{children:[0===_.entities.items.length&&Object(F.jsx)(v.a,{variant:"h5",className:"empty-list-placeholder",children:"Nothing is tracked yet"}),_.entities.items.map((function(e){return Object(F.jsx)(x.a,{children:Object(F.jsx)(S.a,{className:"entity-paper",children:Object(F.jsxs)(E.a,{container:!0,spacing:2,children:[Object(F.jsx)(E.a,{item:!0,xs:2,children:Object(F.jsxs)(E.a,{container:!0,spacing:2,children:[Object(F.jsx)(E.a,{item:!0,xs:12,children:Object(F.jsx)(v.a,{variant:"h6",children:e.name})}),e.error?Object(F.jsx)(F.Fragment,{children:Object(F.jsx)(E.a,{item:!0,xs:12,children:Object(F.jsxs)(v.a,{color:"secondary",variant:"caption",children:["Error: ",e.error]})})}):Object(F.jsx)(F.Fragment,{}),Object(F.jsx)(E.a,{item:!0,xs:6,children:Object(F.jsx)(j.a,{className:"item-btn",variant:"contained",color:"default",size:"small",disabled:_.inProgress,onClick:function(){_.inProgress=!0,_.entities.callEntity(e.entityKey,"reset").catch((function(t){return alert(t.message)})).finally((function(){_.inProgress=!1}))},children:"Reset"})}),Object(F.jsx)(E.a,{item:!0,xs:6,children:Object(F.jsx)(j.a,{className:"item-btn",variant:"contained",color:"default",size:"small",disabled:_.inProgress,onClick:function(){_.inProgress=!0,_.entities.callEntity(e.entityKey,"delete").catch((function(t){return alert(t.message)})).finally((function(){_.inProgress=!1}))},children:"Delete"})})]})}),Object(F.jsx)(E.a,{item:!0,xs:10,children:t.renderGraph(e.entityKey,e,n)})]})})},e.entityKey)}))]})]})}},{key:"createNewEntity",value:function(){var t=(_.nameText+"-"+_.urlText+"-"+_.jsonPathText).replaceAll('"',"-").replaceAll("'","-").replaceAll("/","-").replaceAll("\\","-").replaceAll("#","-").replaceAll("?","-"),e={name:_.nameText,url:_.urlText,query:_.jsonPathText};_.inProgress=!0,_.entities.callEntity(t,"init",e).catch((function(t){return alert(t.message)})).finally((function(){_.inProgress=!1})),_.nameText="",_.urlText="",_.jsonPathText=""}},{key:"renderGraph",value:function(t,e,n){var i=e.points.length?e.points[0].value:void 0;return isNaN(i)?AzureMapSubscriptionKey&&Array.isArray(i)&&2===i.length&&!isNaN(i[0])&&!isNaN(i[1])?this.renderMap(t,e):this.renderHorizontalBars(e,n):this.renderLineGraph(e,n)}},{key:"renderLineGraph",value:function(t,e){var n=t.points.map((function(t){return{x:new Date(t.time).getTime(),y:Number(t.value)}})),i=new Date,a=i.getTime()+6e4*i.getTimezoneOffset();return t.points.length>0&&n.push({x:a,y:Number(t.points[t.points.length-1].value)}),Object(F.jsxs)(C.e,{width:window.innerWidth-300,height:200,stackBy:"y",xType:"time",xDomain:[e,a],margin:{left:80},children:[Object(F.jsx)(C.d,{tickTotal:7}),Object(F.jsx)(C.f,{}),Object(F.jsx)(C.c,{data:n,color:this.stringToColorCode(t.name)})]})}},{key:"renderHorizontalBars",value:function(t,e){var n=this,i=t.points.length?new Date(t.points[0].time).getTime():e,a=new Date,r=a.getTime()+6e4*a.getTimezoneOffset(),s=t.points.map((function(e,i){var a=new Date(e.time).getTime(),s=i<t.points.length-1?new Date(t.points[i+1].time).getTime():r;return{stringValue:n.valueToString(e.value),timeDiff:s-a}}));return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsxs)(C.e,{width:window.innerWidth-300,height:100,stackBy:"x",xType:"time",xDomain:[e,r],margin:{left:80,top:30},children:[Object(F.jsx)(C.d,{tickTotal:7}),Object(F.jsx)(C.b,{opacity:0,barWidth:1,data:[{y:0,x:i}]}),s.map((function(t){return Object(F.jsx)(C.b,{color:n.stringToColorCode(t.stringValue),barWidth:1,data:[{y:0,x:t.timeDiff}]},t.stringValue)}))]}),Object(F.jsx)(C.a,{className:"histogram-legend",items:s.map((function(t){return{title:t.stringValue.substr(0,100),color:n.stringToColorCode(t.stringValue)}})),orientation:"horizontal"})]})}},{key:"renderMap",value:function(t,e){var n=e.points.map((function(t){return t.value}));_.mapDataSources[t]||(_.mapDataSources[t]=new N.source.DataSource),_.mapDataSources[t].clear(),_.mapDataSources[t].add(new N.data.Feature(new N.data.LineString(n)));var i=N.data.BoundingBox.fromPositions(n);return Object(F.jsx)(z,{entityKey:t,dataSource:_.mapDataSources[t],bounds:i,azureMapSubscriptionKey:AzureMapSubscriptionKey})}},{key:"valueToString",value:function(t){return"string"===typeof t?t:t?JSON.stringify(t):"null"}},{key:"stringToColorCode",value:function(t){for(var e=0,n=t.length-1;n>=0;n--)e=(e<<5)-e+t.charCodeAt(n),e&=2147483647;return e|=1048576,"#"+(e&=16777199).toString(16)}}]),n}(a.a.Component));s.a.render(Object(F.jsx)(L,{}),document.getElementById("root"))}},[[149,1,2]]]);
//# sourceMappingURL=main.e7f14728.chunk.js.map