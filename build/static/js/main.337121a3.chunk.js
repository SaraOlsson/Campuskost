(this.webpackJsonpcampuskostreact=this.webpackJsonpcampuskostreact||[]).push([[0],{65:function(e,t,n){e.exports=n(86)},74:function(e,t,n){},75:function(e,t,n){},81:function(e,t,n){},86:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(21),c=n.n(o),i=n(11),l=n(27),s=n(14);function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(n,!0).forEach((function(t){Object(s.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var m=Object(l.b)({testReducers:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{num:0},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"INCREMENT":return d({},e,{num:e.num+t.step});case"DECREMENT":return d({},e,{num:e.num-t.step});default:return e}},uploadReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{title:"title"},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SETTITLE":return d({},e,{title:t.title});default:return e}},userReducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{signedIn:!1};switch((arguments.length>1?arguments[1]:void 0).type){case"SIGNIN":return d({},e,{signedIn:!0});case"SIGNOUT":return d({},e,{signedIn:!1});default:return e}}}),p=(n(74),n(9)),f=n(28),g=n(22),b=(n(75),n(15)),h=n.n(b),v=(n(38),n(50),n(42),n(54),n(116));function E(e){var t=O();return r.a.createElement(f.a,{to:"/recipe/"+e.data.title},r.a.createElement("div",null,r.a.createElement("div",{className:t.foodImg}),e.data.title))}var O=Object(v.a)({imageContainer:{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",marginBottom:50},foodImg:{backgroundColor:"pink",height:100,width:100,margin:5,borderRadius:20}}),j=function(e){var t=Object(a.useState)(function(){for(var e=[],t=0;t<3;t++)e.push(r.a.createElement(E,{key:t,listId:t,data:{title:"Pannkaka",user:"Sara"}}));return e}()),n=Object(p.a)(t,2),o=n[0],c=(n[1],Object(a.useState)(void 0)),i=Object(p.a)(c,2),l=(i[0],i[1],Object(a.useState)(void 0)),s=Object(p.a)(l,2);s[0],s[1],Object(a.useEffect)((function(){}),[]);var u=O();return e.db.collection("recipes"),r.a.createElement("div",null,r.a.createElement("h1",null,"Nya recept!"),r.a.createElement("div",{className:u.imageContainer},o))},y=Object(v.a)({body:{padding:15}});var w=function(e){var t=r.a.useState(!1),n=Object(p.a)(t,2),a=(n[0],n[1],r.a.useState(!1)),o=Object(p.a)(a,2),c=(o[0],o[1],y(),Object(i.c)((function(e){return e.userReducer})));return console.log(c),r.a.createElement("div",null,c.signedIn?null:r.a.createElement(g.a,{to:"/"}),r.a.createElement("h1",null,"Hey you"),!1===c.signedIn&&r.a.createElement("p",null," Hey you're not signed in. Things won't work here (redirect back) "),r.a.createElement("button",{onClick:function(){return h.a.auth().signOut()},name:"signout"}," Logga ut "))},k=Object(v.a)({body:{padding:15}});var S=function(e){return k(),r.a.createElement("div",null,r.a.createElement("h1",null,"Dina notiser"))},I=Object(v.a)({body:{padding:15}});var C=function(e){return I(),r.a.createElement("div",null,r.a.createElement("h1",null,"Dina listor"))},N=(n(81),n(124)),x=n(125),P=n(123),R=n(126),A=n(122),D=n(119),U=n(118),L=n(56),T=n.n(L);function W(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function B(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?W(n,!0).forEach((function(t){Object(s.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):W(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function G(e){var t=H();return r.a.createElement(U.a,{item:!0,xs:e.xs},r.a.createElement(R.a,{disabled:!0,control:r.a.createElement(A.a,{checked:e.checked,color:"primary",className:t.nomargin})}))}var H=Object(v.a)({body:{padding:15},buttontext:{textTransform:"unset"},nomargin:{margin:0}}),M=function(e){var t=r.a.useState(""),n=Object(p.a)(t,2),a=n[0],o=n[1],c=r.a.useState(0),i=Object(p.a)(c,2),l=i[0],u=i[1],d=r.a.useRef(null),m=r.a.useState({title:!1,ingredients:!1,desc:!1}),f=Object(p.a)(m,2),g=f[0],b=f[1],h=H();return r.a.useEffect((function(){u(d.current.offsetWidth)}),[]),r.a.createElement("div",null,r.a.createElement("h2",null,"Ladda upp recept"),r.a.createElement("form",null,r.a.createElement(U.a,{container:!0,spacing:1,justify:"center",alignItems:"center"},r.a.createElement(G,{checked:g.title,xs:2}),r.a.createElement(U.a,{item:!0,xs:9},r.a.createElement(N.a,{variant:"outlined"},r.a.createElement(x.a,{ref:d,htmlFor:"component-outlined"}," Rubrik "),r.a.createElement(P.a,{value:a,onChange:function(e){var t=e.target.value;o(t),b(B({},g,Object(s.a)({},"title",t.length>2)))},labelWidth:l}))),r.a.createElement(G,{checked:g.ingredients,xs:2}),r.a.createElement(U.a,{item:!0,xs:9}," ",r.a.createElement(D.a,{onClick:function(){b(B({},g,Object(s.a)({},"ingredients",!0)))},variant:"contained",color:"primary",className:h.buttontext},"L\xe4gg till ingredienser")," "),r.a.createElement(G,{checked:g.desc,xs:2}),r.a.createElement(U.a,{item:!0,xs:9}," ",r.a.createElement(D.a,{onClick:function(){b(B({},g,Object(s.a)({},"desc",!0)))},variant:"contained",color:"primary",className:h.buttontext},"L\xe4gg till beskrivning")," "),r.a.createElement(U.a,{item:!0,xs:5},r.a.createElement(D.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(T.a,null)},"Upload")))))};var J=function(e){return r.a.createElement("div",null,r.a.createElement("h1",null,"Recept: ",e.match.params.recipe))};var V=function(e){var t=Object(a.useState)(""),n=Object(p.a)(t,2),o=n[0],c=n[1],l=Object(a.useState)(""),s=Object(p.a)(l,2),u=s[0],d=s[1],m=Object(a.useState)("Ej inloggad"),f=Object(p.a)(m,2),g=f[0],b=f[1],v=Object(a.useState)("Logga in"),E=Object(p.a)(v,2),O=E[0],j=E[1],y=Object(i.b)();return Object(a.useEffect)((function(){console.log("initApp"),h.a.auth().onAuthStateChanged((function(e){e?(e.displayName,e.email,e.emailVerified,e.photoURL,e.isAnonymous,e.uid,e.providerData,b("Inloggad"),j("Logga ut"),y({type:"SIGNIN",signedIn:""})):(b("Ej inloggad"),j("Logga in"),y({type:"SIGNOUT",signedIn:""}))}))}),[]),r.a.createElement("div",null,r.a.createElement("p",null,"Ange email and l\xf6senord f\xf6r att logga in eller skapa ett konto"),r.a.createElement("input",{type:"text",name:"email",placeholder:"Email",onChange:function(e){return c(e.target.value)}}),"\xa0\xa0\xa0",r.a.createElement("input",{type:"password",name:"password",placeholder:"Password",onChange:function(e){return d(e.target.value)}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("button",{onClick:function(){if(console.log("toggleSignIn"),h.a.auth().currentUser)h.a.auth().signOut();else{if(o.length<4)return void alert("Ogiltig mailadress, m\xe5ste inneh\xe5lla mer \xe4n 4 tecken.");if(u.length<4)return void alert("Ogiltigt l\xf6senord, m\xe5ste inneh\xe5lla mer \xe4n 4 tecken.");h.a.auth().signInWithEmailAndPassword(o,u).catch((function(e){var t=e.code,n=e.message;"auth/wrong-password"===t?alert("fel l\xf6senord."):alert(n),console.log(e)}))}},name:"signin"}," ",O," "),"\xa0\xa0\xa0",r.a.createElement("button",{onClick:function(){console.log("handleSignUp"),o.length<4?alert("Ogiltig mailadress, m\xe5ste inneh\xe5lla mer \xe4n 4 tecken"):u.length<4?alert("Ogiltigt l\xf6senord, m\xe5ste inneh\xe5lla mer \xe4n 4 tecken"):h.a.auth().createUserWithEmailAndPassword(o,u).catch((function(e){var t=e.code,n=e.message;"auth/weak-password"==t?alert("L\xf6senordet \xe4r f\xf6r svagt."):alert(n),console.log(e)}))},name:"signup"},"Skapa konto"),"\xa0\xa0\xa0",r.a.createElement("button",{onClick:function(){h.a.auth().currentUser.sendEmailVerification().then((function(){alert("Email Verification Sent!")}))},name:"verify"},"Verifiera konto"),r.a.createElement("span",{id:"quickstart-sign-in-status"}," \xa0 ",g," "))},F=n(120),q=n(121),z=n(59),K=n.n(z),Z=n(60),_=n.n(Z),Y=n(61),$=n.n(Y),Q=n(58),X=n.n(Q),ee=n(57),te=n.n(ee);n(83).config();var ne,ae="AIzaSyAq0vTBf0o5MckjHcCOJiJ_DRK8v_UZY88";window.addEventListener("beforeinstallprompt",(function(e){(ne=e).prompt(),ne.userChoice.then((function(e){"accepted"===e.outcome?console.log("User accepted the A2HS prompt"):console.log("User dismissed the A2HS prompt"),ne=null}))}));var re=void 0;function oe(e){var t=ce();console.log(e);var n=!0===e.signedIn?"profile":"login",a=r.a.createElement("div",{className:t.profileBtn},r.a.createElement("button",{value:n,onClick:function(t){return e.handleChange(t)}},n)),o=e.signedIn?r.a.createElement(f.b,{to:"/profile"},r.a.createElement(te.a,null)):a;return r.a.createElement("div",null,o," ")}var ce=Object(v.a)({body:{padding:15},footer:{position:"fixed",left:0,bottom:0,width:"100%",display:"flex",justifyContent:"center"},headerrow:{display:"flex",justifyContent:"flex-end"},profileBtn:{color:"green"},bottomMenu:{width:500}}),ie=function(){var e=r.a.useState(""),t=Object(p.a)(e,2),n=t[0],o=t[1],c=r.a.useState(!1),l=Object(p.a)(c,2),s=l[0],u=l[1],d=ce(),m=Object(i.b)(),b=Object(i.c)((function(e){return e.userReducer}));console.log(b),Object(a.useEffect)((function(){h.a.auth().onAuthStateChanged((function(e){m({type:e?"SIGNIN":"SIGNOUT"})}))}),[]),void 0===re&&(re=function(){console.log("run initFirebase");var e={apiKey:ae,authDomain:"campuskost-firebase.firebaseapp.com",databaseURL:"https://campuskost-firebase.firebaseio.com",projectId:"campuskost-firebase",storageBucket:"campuskost-firebase.appspot.com",messagingSenderId:"477692438735",appId:"1:477692438735:web:2e6dce163d7f7ce8baafba",measurementId:"G-MDB52ZHJER"};return h.a.initializeApp(e),h.a.firestore()}());var v=function(e,t){u(!0);var n=e.target.value;o(void 0!=n?n:t)};return r.a.createElement("div",{className:d.body},r.a.createElement(f.a,null,s?r.a.createElement(g.a,{to:"/"+n}):null,r.a.createElement("div",{className:d.mainContainer},r.a.createElement("div",{className:d.headerrow},r.a.createElement(oe,{signedIn:b.signedIn,handleChange:v})),r.a.createElement(g.d,null,r.a.createElement(g.b,{exact:!0,path:"/"},r.a.createElement(j,{db:re})),r.a.createElement(g.b,{path:"/login",component:V}),r.a.createElement(g.b,{path:"/profile",component:w}),r.a.createElement(g.b,{path:"/upload",component:M}),r.a.createElement(g.b,{path:"/notices",component:S}),r.a.createElement(g.b,{path:"/saved",component:C}),r.a.createElement(g.b,{path:"/recipe/:recipe",component:J}))),r.a.createElement("div",{className:d.footer},r.a.createElement(F.a,{value:n,onChange:v,className:d.bottomMenu},r.a.createElement(q.a,{label:"Fl\xf6de",value:"",icon:r.a.createElement(X.a,null)}),r.a.createElement(q.a,{label:"Ladda up",value:"upload",icon:r.a.createElement(K.a,null)}),r.a.createElement(q.a,{label:"Notiser",value:"notices",icon:r.a.createElement(_.a,null)}),r.a.createElement(q.a,{label:"Sparat",value:"saved",icon:r.a.createElement($.a,null)})))))},le=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function se(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var ue=Object(l.c)(m),de=document.getElementById("root");c.a.render(r.a.createElement(i.a,{store:ue},r.a.createElement(ie,null)),de),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");le?(!function(e,t){fetch(e).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):se(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):se(t,e)}))}}()}},[[65,1,2]]]);
//# sourceMappingURL=main.337121a3.chunk.js.map