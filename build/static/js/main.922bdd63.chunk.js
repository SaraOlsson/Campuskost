(this.webpackJsonpcampuskostreact=this.webpackJsonpcampuskostreact||[]).push([[0],{43:function(e,t,n){e.exports=n(65)},48:function(e,t,n){},50:function(e,t,n){e.exports=n.p+"static/media/logo.25bf045c.svg"},51:function(e,t,n){},65:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(14),c=n.n(r),i=(n(48),n(27)),l=n.n(i),s=n(35),u=n(16),d=n(26),m=n(13),p=(n(50),n(51),n(28)),f=n.n(p),v=(n(52),n(54),n(85)),b=Object(v.a)({body:{padding:15}});var h=function(e){return b(),o.a.createElement("div",null,o.a.createElement("h1",null,"Hey you"))},g=Object(v.a)({body:{padding:15}});var E=function(e){return g(),o.a.createElement("div",null,o.a.createElement("h1",null,"Dina notiser"))},w=Object(v.a)({body:{padding:15}});var y=function(e){return w(),o.a.createElement("div",null,o.a.createElement("h1",null,"Dina listor"))},k=Object(v.a)({body:{padding:15}});var j=function(e){return k(),o.a.createElement("div",null,o.a.createElement("h1",null,"Upload"))},O=n(87),C=n(88),S=n(38),x=n.n(S),A=n(39),N=n.n(A),I=n(40),U=n.n(I),W=n(37),R=n.n(W);n(59).config();var B,D="AIzaSyAq0vTBf0o5MckjHcCOJiJ_DRK8v_UZY88";window.addEventListener("beforeinstallprompt",(function(e){B=e,console.log("beforeinstallprompt"),alert("Heello"),B.prompt(),B.userChoice.then((function(e){"accepted"===e.outcome?console.log("User accepted the A2HS prompt"):console.log("User dismissed the A2HS prompt"),B=null}))}));var H=Object(v.a)({body:{padding:15},footer:{position:"fixed",left:0,bottom:0,width:"100%",display:"flex",justifyContent:"center"},bottomMenu:{width:500},imageContainer:{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",marginBottom:50},foodImg:{backgroundColor:"pink",height:100,width:100,margin:5,borderRadius:20}});function J(e){var t=H();return console.log(e),o.a.createElement("div",null,o.a.createElement("div",{className:t.foodImg}),e.data.title)}function L(){var e=Object(a.useState)(void 0),t=Object(u.a)(e,2),n=t[0],r=t[1],c=Object(a.useState)(void 0),i=Object(u.a)(c,2),d=(i[0],i[1]),m=Object(a.useState)(void 0),p=Object(u.a)(m,2);p[0],p[1];Object(a.useEffect)((function(){h()}),[]);var f=H(),v=M.collection("recipes"),b=function(e){console.log("remove "+e+" from parent component ")},h=function(){var e=Object(s.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:v.get().then((function(e){var t=[],n=[];e.forEach((function(e){t.push(o.a.createElement(J,{key:e.id,listId:e.id,data:e.data(),removeFunction:b})),n.push(e.data())})),r(t),d(n)})).catch((function(e){console.log("Error getting documents",e)}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return o.a.createElement("div",null,o.a.createElement("h1",null,"Nya recept"),o.a.createElement("div",{className:f.imageContainer},n))}var M=void 0;var F=function(){var e=o.a.useState(""),t=Object(u.a)(e,2),n=t[0],a=t[1],r=o.a.useState(!1),c=Object(u.a)(r,2),i=c[0],l=c[1];void 0===M&&(M=function(){console.log("run initFirebase");var e={apiKey:D,authDomain:"campuskost-firebase.firebaseapp.com",databaseURL:"https://campuskost-firebase.firebaseio.com",projectId:"campuskost-firebase",storageBucket:"campuskost-firebase.appspot.com",messagingSenderId:"477692438735",appId:"1:477692438735:web:2e6dce163d7f7ce8baafba",measurementId:"G-MDB52ZHJER"};return f.a.initializeApp(e),f.a.firestore()}());var s=H(),p=function(e,t){a(t),l(!0)};return o.a.createElement("div",{className:s.body},o.a.createElement(d.a,null,i?o.a.createElement(m.a,{to:"/"+n}):null,o.a.createElement("div",{className:s.mainContainer},o.a.createElement("button",{value:"profile",onClick:p},"Profil"),o.a.createElement(m.d,null,o.a.createElement(m.b,{exact:!0,path:"/"},o.a.createElement(L,null)),o.a.createElement(m.b,{path:"/profile",component:h}),o.a.createElement(m.b,{path:"/upload",component:j}),o.a.createElement(m.b,{path:"/notices",component:E}),o.a.createElement(m.b,{path:"/saved",component:y}))),o.a.createElement("div",{className:s.footer},o.a.createElement(O.a,{value:n,onChange:p,className:s.bottomMenu},o.a.createElement(C.a,{label:"Fl\xf6de",value:"",icon:o.a.createElement(R.a,null)}),o.a.createElement(C.a,{label:"Ladda up",value:"upload",icon:o.a.createElement(x.a,null)}),o.a.createElement(C.a,{label:"Notiser",value:"notices",icon:o.a.createElement(N.a,null)}),o.a.createElement(C.a,{label:"Sparat",value:"saved",icon:o.a.createElement(U.a,null)})))))},P=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function T(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}c.a.render(o.a.createElement(F,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");P?(!function(e,t){fetch(e).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):T(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):T(t,e)}))}}()}},[[43,1,2]]]);
//# sourceMappingURL=main.922bdd63.chunk.js.map