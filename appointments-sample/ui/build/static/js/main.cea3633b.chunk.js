(this["webpackJsonpappointments-sample-ui"]=this["webpackJsonpappointments-sample-ui"]||[]).push([[0],{81:function(t,e,n){},92:function(t,e,n){"use strict";n.r(e);var i,a=n(0),s=n.n(a),c=n(13),r=n.n(c),o=(n(81),n(19)),l=n(24),u=n(46),y=n(45),h=n(7),p=n(65),d=n(121),f=n(124),m=n(131),g=n(133),j=n(126),v=n(128),b=n(125),E=n(129),O=n(93),S=n(130),x=n(136),C=n(127),N=n(66),k=n(16),A=n(47),w=function(){function t(){Object(o.a)(this,t),this.entityName="",this.entityKey="",this.version=0,this.stateDiff=[],this.isEntityDestructed=!1}return Object(l.a)(t,null,[{key:"GetEntityId",value:function(e){return t.FormatEntityId(e.entityName,e.entityKey)}},{key:"FormatEntityId",value:function(t,e){return"@".concat(t,"@").concat(e)}}]),t}(),R=n(48),I=n(22),D="/a/p/i",P=function(t){Object(u.a)(n,t);var e=Object(y.a)(n);function n(t){var i;return Object(o.a)(this,n),(i=e.call(this,k.d.instance))._configFabric=t,i}return Object(l.a)(n,[{key:"send",value:function(t){var e=this,i=t.url;if(i.startsWith("http")&&(i="/"+i.split("/").slice(3).join("/")),i.includes(D)){var a=this._configFabric();if(a.accessTokenFactory)return a.accessTokenFactory().then((function(i){return t.headers={},t.headers.Authorization="Bearer "+i,Object(R.a)(Object(I.a)(n.prototype),"send",e).call(e,t)}));if(a.fakeUserNamePromise)return a.fakeUserNamePromise.then((function(i){return i&&(t.headers={},t.headers["x-ms-client-principal-name"]=i),Object(R.a)(Object(I.a)(n.prototype),"send",e).call(e,t)}))}return Object(R.a)(Object(I.a)(n.prototype),"send",this).call(this,t)}}]),n}(k.a),K=function(){function t(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];Object(o.a)(this,t),this._entityName=e,this.items=[],this._entityName=this._entityName.toLowerCase(),Object(h.m)(this,{items:h.n}),n&&this.attachAllEntities()}return Object(l.a)(t,[{key:"attachAllEntities",value:function(){t.initSignalR(),t.EntitySets[this._entityName]=this.items,t.fetchAndApplyAllEntityStates(this._entityName)}},{key:"attachEntity",value:function(e){var n=w.FormatEntityId(this._entityName,e);t.EntityStates[n]||(t.EntitySets[n]=this.items,t.attachEntity(this._entityName,e,void 0))}},{key:"createEntity",value:function(e){t.createEntity(this._entityName,e,void 0)}},{key:"signalEntity",value:function(e,n,i){return t.signalEntity(this._entityName,e,n,i)}},{key:"updateEntityMetadata",value:function(e,n){return t.updateEntityMetadata(this._entityName,e,n)}}],[{key:"attachEntity",value:function(e,n,i){t.initSignalR(),e=e.toLowerCase();var a=w.FormatEntityId(e,n);return this.EntityStates[a]?this.EntityStates[a].state:(i&&Object(h.l)(i),this.fetchAndApplyEntityState(e,n,0,0,i),i)}},{key:"createEntity",value:function(t,e,n){return this.updateEntityMetadata(t,e,{}),this.attachEntity(t,e,n)}},{key:"signalEntity",value:function(t,e,n,i){t=t.toLowerCase();var a="".concat(D,"/entities/").concat(t,"/").concat(e,"/").concat(n);return this.HttpClient.post(a,{content:JSON.stringify(i)}).then()}},{key:"updateEntityMetadata",value:function(t,e,n){return this.signalEntity(t,e,"$update-entity-internal-metadata",n)}},{key:"setup",value:function(t){this.Config=t,this.Config.logger||(this.Config.logger=k.d.instance)}},{key:"entityAdded",value:function(t,e,n){var i=w.FormatEntityId(t,e),a=this.EntitySets[i];a?delete this.EntitySets[i]:a=this.EntitySets[t],a&&(n.entityKey=e,a.push(n))}},{key:"entityDeleted",value:function(t,e){var n=this.EntitySets[t];if(n)for(var i=0;i<n.length;i++)if(n[i].entityKey===e){n.splice(i,1);break}}},{key:"fetchAndApplyEntityState",value:function(t,e,n,i){var a=this,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,c="".concat(D,"/entities/").concat(t,"/").concat(e);this.HttpClient.get(c).then((function(i){var c=JSON.parse(i.content),r=w.FormatEntityId(t,e);if(n&&c.version<n)throw new Error("Expected ".concat(r," of version ").concat(n,", but got version ").concat(c.version));if(s){c.state.entityKey=s.entityKey;var o=A.createPatch(s,c.state);A.applyPatch(s,o)}else s=c.state,Object(h.l)(s);a.EntityStates[r]||a.entityAdded(t,e,s),a.EntityStates[r]={state:s,version:c.version}})).catch((function(c){i<a.MaxRetryCount?(i++,setTimeout((function(){a.fetchAndApplyEntityState(t,e,n,i,s)}),i*a.RetryBaseIntervalMs)):a.Config.logger.log(k.c.Error,"DurableEntitySet: failed to fetch entity state: ".concat(c))}))}},{key:"fetchAndApplyAllEntityStates",value:function(t){var e=this,n="".concat(D,"/entities/").concat(t);this.HttpClient.get(n).then((function(n){var i,a=Object(N.a)(JSON.parse(n.content));try{for(a.s();!(i=a.n()).done;){var s=i.value,c=s.entityKey,r=w.FormatEntityId(t,c),o=s;Object(h.l)(o.state),e.EntityStates[r]=o,e.entityAdded(t,c,o.state)}}catch(l){a.e(l)}finally{a.f()}})).catch((function(t){e.Config.logger.log(k.c.Error,"DurableEntitySet: failed to fetch entity states: ".concat(t))}))}},{key:"entityStateChangedMessageHandler",value:function(t){var e=this,n=w.GetEntityId(t);if(this.Config.logger.log(k.c.Trace,"DurableEntitySet: ".concat(n," changed to version ").concat(t.version)),t.isEntityDestructed)delete this.EntityStates[n],this.entityDeleted(t.entityName,t.entityKey);else if(this.EntityStates[n]){var i=this.EntityStates[n].version+1;t.version>i?this.fetchAndApplyEntityState(t.entityName,t.entityKey,t.version,0,this.EntityStates[n].state):t.version===i&&(A.applyPatch(this.EntityStates[n].state,t.stateDiff),this.EntityStates[n].version=t.version)}else(this.EntitySets[n]||this.EntitySets[t.entityName])&&setTimeout((function(){return e.fetchAndApplyEntityState(t.entityName,t.entityKey,t.version,0)}),this.RetryBaseIntervalMs)}},{key:"initSignalR",value:function(){var t=this;this.SignalRConn||(this.SignalRConn=(new k.b).withUrl("".concat(D),{httpClient:this.HttpClient,logger:this.Config.logger}).build(),this.SignalRConn.on("entity-state-changed",(function(e){return t.entityStateChangedMessageHandler(e)})),this.SignalRConn.onclose((function(){!function e(){t.Config.logger.log(k.c.Information,"DurableEntitySet: reconnecting to SignalR..."),t.SignalRConn.start().then((function(){t.Config.logger.log(k.c.Information,"DurableEntitySet: reconnected to SignalR")}),(function(){setTimeout(e,t.SignalRReconnectIntervalInMs)}))}()})),this.SignalRConn.start().then((function(){t.Config.logger.log(k.c.Information,"DurableEntitySet: successfully connected to SignalR")}),(function(e){t.Config.logger.log(k.c.Error,"DurableEntitySet: failed to connect to SignalR: ".concat(e))})))}}]),t}();K.Config={logger:k.d.instance},K.HttpClient=new P((function(){return K.Config})),K.EntitySets={},K.EntityStates={},K.SignalRConn=void 0,K.SignalRReconnectIntervalInMs=5e3,K.MaxRetryCount=6,K.RetryBaseIntervalMs=500,function(t){t[t.Pending=0]="Pending",t[t.Accepted=1]="Accepted",t[t.Declined=2]="Declined"}(i||(i={}));var F=n(10);K.setup({logger:{log:function(t,e){return console.log(e)}},fakeUserNamePromise:new Promise((function(t){fetch("/.auth/me").then((function(t){return t.json()})).then((function(e){if(!e||!e.length)throw new Error("EasyAuth seems to be not configured. Falling back to a fake user name");M.userName=e[0].user_id,t(null)})).catch((function(){M.userName=prompt("Enter your name:","Anonymous"),t(M.userName)}))}))});var M=Object(h.l)({userName:"",participantsText:"",appointments:new K("AppointmentEntity",!0)}),_=Object(p.a)(function(t){Object(u.a)(n,t);var e=Object(y.a)(n);function n(){return Object(o.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"createNewAppointment",value:function(){var t=M.participantsText.split(",").map((function(t){return t.trim()})).filter((function(t){return!!t})),e="APP-"+(new Date).toISOString();M.appointments.signalEntity(e,"init",t),M.participantsText=""}},{key:"render",value:function(){var t=this;return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(d.a,{position:"static",color:"default",className:"app-bar",children:Object(F.jsxs)(f.a,{children:[Object(F.jsx)(m.a,{fullWidth:!0,label:"Comma-separated list of participants (or empty string to create appointment with yourself)",placeholder:"Alice, Bob, Charlie...",InputLabelProps:{shrink:!0},variant:"outlined",size:"small",value:M.participantsText,onChange:function(t){return M.participantsText=t.target.value},onKeyPress:function(e){"Enter"===e.key&&(e.preventDefault(),t.createNewAppointment())}}),Object(F.jsx)(g.a,{width:20}),Object(F.jsx)(j.a,{variant:"contained",color:"default",size:"large",className:"new-appointment-button",onClick:function(){return t.createNewAppointment()},children:"Create new appointment"}),Object(F.jsx)(g.a,{width:40}),Object(F.jsx)(C.a,{}),Object(F.jsx)(g.a,{width:5}),Object(F.jsx)(v.a,{children:M.userName})]})}),Object(F.jsxs)(b.a,{children:[0===M.appointments.items.length&&Object(F.jsx)(v.a,{variant:"h5",className:"empty-list-placeholder",children:"No appointments created yet"}),M.appointments.items.map((function(t){return Object(F.jsx)(E.a,{children:Object(F.jsx)(O.a,{className:"appointment-paper",children:Object(F.jsxs)(S.a,{container:!0,spacing:2,children:[Object(F.jsxs)(S.a,{item:!0,xs:2,children:[t.status===i.Pending&&Object(F.jsx)(x.a,{label:"Pending",color:"default",variant:"outlined",className:"appointment-status-chip"}),t.status===i.Accepted&&Object(F.jsx)(x.a,{label:"Everybody accepted",color:"primary",variant:"outlined",className:"appointment-status-chip"}),t.status===i.Declined&&Object(F.jsx)(x.a,{label:"Someone declined",color:"secondary",variant:"outlined",className:"appointment-status-chip"})]}),Object(F.jsx)(S.a,{item:!0,xs:2,children:Object(F.jsx)(v.a,{className:"participants-text",children:"Participants:"})}),Object(F.jsx)(S.a,{item:!0,xs:5,className:"appointment-grid-cell",children:Object.keys(t.participants).map((function(e){return Object(F.jsx)(x.a,{label:e,color:t.participants[e]===i.Accepted?"primary":t.participants[e]===i.Declined?"secondary":"default",className:"participant-chip"})}))}),Object(F.jsx)(S.a,{item:!0,xs:1,children:Object(F.jsx)(j.a,{fullWidth:!0,variant:"contained",color:"primary",disabled:t.status!==i.Pending,onClick:function(){return M.appointments.signalEntity(t.entityKey,"respond",!0)},children:"Accept"})}),Object(F.jsx)(S.a,{item:!0,xs:1,children:Object(F.jsx)(j.a,{fullWidth:!0,variant:"contained",color:"secondary",disabled:t.status!==i.Pending,onClick:function(){return M.appointments.signalEntity(t.entityKey,"respond",!1)},children:"Decline"})}),Object(F.jsx)(S.a,{item:!0,xs:1,children:Object(F.jsx)(j.a,{fullWidth:!0,variant:"contained",color:"default",disabled:t.status===i.Pending,onClick:function(){return M.appointments.signalEntity(t.entityKey,"delete")},children:"Delete"})})]})})})}))]})]})}}]),n}(s.a.Component));r.a.render(Object(F.jsx)(_,{}),document.getElementById("root"))}},[[92,1,2]]]);
//# sourceMappingURL=main.cea3633b.chunk.js.map