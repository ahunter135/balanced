"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[293],{3554:(U,y,o)=>{o.d(y,{e:()=>h});var i=o(6814),C=o(95),A=o(5548),P=o(6689);let h=(()=>{class s{}return s.\u0275fac=function(n){return new(n||s)},s.\u0275mod=P.oAB({type:s}),s.\u0275inj=P.cJS({imports:[i.ez,C.u5,A.Pc]}),s})()},8452:(U,y,o)=>{o.d(y,{q:()=>s});var i=o(5861),C=o(4092),A=o(182),P=o(15),h=o(6689);let s=(()=>{class T extends C.q{constructor(){super(A.lN)}get(u,g){var f=()=>super._get,_=this;return(0,i.Z)(function*(){const k=yield f().call(_,T.makeCollectionRef(u),g);return _.convertTimestampToDate(k)})()}getAll(){var u=()=>super._getAll,g=this;return(0,i.Z)(function*(){const f=yield u().call(g);return f.docs&&(f.docs=f.docs.map(_=>g.convertTimestampToDate(_))),f})()}getAllFromParent(u){var g=()=>super._getAllFromParent,f=this;return(0,i.Z)(function*(){const _=yield g().call(f,T.makeCollectionRef(u));return _.docs&&(_.docs=_.docs.map(k=>f.convertTimestampToDate(k))),_})()}getByQuery(u){var g=()=>super._getByQuery,f=this;return(0,i.Z)(function*(){const _=yield g().call(f,u);return _.docs&&(_.docs=_.docs.map(k=>f.convertTimestampToDate(k))),_})()}add(u,g,f){var _=()=>super._add,k=this;return(0,i.Z)(function*(){return _().call(k,T.makeCollectionRef(u),g,f)})()}update(u,g,f){var _=()=>super._update,k=this;return(0,i.Z)(function*(){return _().call(k,T.makeCollectionRef(u),g,f)})()}delete(u,g,f=!1){var _=()=>super._delete,k=this;return(0,i.Z)(function*(){return _().call(k,T.makeCollectionRef(u),g,f)})()}static makeCollectionRef(u){return(0,P.hJ)((0,P.ad)(),A.YP,u,A.lN)}convertTimestampToDate(u){if(!u)return u;const g=u.last_transaction_retrieval;return g&&(u.last_transaction_retrieval=g.toDate()),u}}return T.\u0275fac=function(u){return new(u||T)},T.\u0275prov=h.Yz7({token:T,factory:T.\u0275fac,providedIn:"root"}),T})()},1269:(U,y,o)=>{o.d(y,{O:()=>A});var i=o(6689),C=o(9862);let A=(()=>{class P{constructor(s){this.http=s}post(s,T){return this.http.post(s,T,{headers:this.getHeaders()})}getHeaders(){return{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}}}return P.\u0275fac=function(s){return new(s||P)(i.LFG(C.eN))},P.\u0275prov=i.Yz7({token:P,factory:P.\u0275fac,providedIn:"root"}),P})()},7087:(U,y,o)=>{o.d(y,{O:()=>K});var i=o(5861),C=o(6306),A=o(6973);function P(v,L){const r="object"==typeof L;return new Promise((a,l)=>{let b,p=!1;v.subscribe({next:Z=>{b=Z,p=!0},error:l,complete:()=>{p?a(b):r?a(L.defaultValue):l(new A.K)}})})}var h=o(553);const s=h.N.useFunctionsEmulator&&!h.N.production?"http://localhost:5001/balanced-budget-90f1f/us-central1/":"https://us-central1-balanced-budget-90f1f.cloudfunctions.net/",T=s+"getTransactionData",n=s+"createPlaidLinkToken",u=s+"relinkPlaidLinkToken",g=s+"exchangePublicToken",_=s+"removeLinkedAccount";function k(v){const L=v.datetime?new Date(v.datetime):new Date(v.date);return{id:v.transaction_id,amount:v.amount,subcategoryId:"",date:L,merchant_name:v.merchant_name,name:v.name,pending:v.pending}}var O=o(6689),D=o(1269),R=o(8452),S=o(7195),F=o(6635),Y=o(5548),J=o(3076);let K=(()=>{class v{get plaidAvailable(){return this.userService.isPremium}constructor(r,a,l,p,b,Z){this.http=r,this.linkedAccountsRepository=a,this.userRepository=l,this.transactionPublisher=p,this.loadingController=b,this.userService=Z}linkPlaidToUser(){var r=this;return(0,i.Z)(function*(){if(!r.plaidAvailable)return;const a=yield r.loadingController.create();yield a.present(),r.http.post(n,{user_id:r.userRepository.getCurrentUserId()}).pipe((0,C.K)(l=>(console.log(l),a.dismiss(),l))).subscribe(l=>{console.log(l);const p=r.createPlaidHandlerLink(l.link_token);a.dismiss(),p.open()})})()}syncPlaidTransactions(){var r=this;return(0,i.Z)(function*(){if(!r.plaidAvailable)return;const a=r.userRepository.getCurrentUserId();if(!a)throw new Error("User is not logged in");const l=(yield r.linkedAccountsRepository.getAllFromParent(a)).docs;if(0===l.length)return;const p=[];for(let E of l)(yield r.shouldSyncTransactions(E))&&p.push(P(r.http.post(T,{userId:a,linkedAccount:E,linkedAccountId:E.id})));const b=yield Promise.all(p);let Z=[],I=[],N=[];for(let E=0;E<b.length;E++){const M=b[E];Z=Z.concat(M.added),I=I.concat(M.removed),N=N.concat(M.modified)}r.plaidTransactionSyncHandler(Z,I,N,!0)})()}removePlaidLinkedAccount(r){var a=this;return(0,i.Z)(function*(){const l=a.userRepository.getCurrentUserId();if(!l)throw new Error("User is not logged in");a.http.post(_,{user_id:l,linked_account_id:r.id}).subscribe(p=>{console.log(p)})})()}relinkPlaidLinkedAccount(r){var a=this;return(0,i.Z)(function*(){if(!a.plaidAvailable)return;const l=yield a.loadingController.create();yield l.present(),a.http.post(u,{user_id:a.userRepository.getCurrentUserId(),linked_account_id:r.id}).pipe((0,C.K)(p=>(console.log(p),l.dismiss(),p))).subscribe(p=>{console.log(p);const b=a.createPlaidHandlerRelink(p.link_token);l.dismiss(),b.open()})})()}createPlaidHandlerLink(r){return Plaid.create({token:r,onSuccess:this.plaidHandlerOnSuccessCallback.bind(this),onExit:this.plaidHandlerOnExitCallback.bind(this),onLoad:this.plaidHandlerOnLoadCallback.bind(this),onEvent:this.plaidHandlerOnEventCallback.bind(this),receivedRedirectUri:null})}createPlaidHandlerRelink(r){return Plaid.create({token:r,onSuccess:(a,l)=>{},onExit:this.plaidHandlerOnExitCallback.bind(this),onLoad:this.plaidHandlerOnLoadCallback.bind(this),onEvent:this.plaidHandlerOnEventCallback.bind(this),receivedRedirectUri:null})}plaidHandlerOnSuccessCallback(r,a){this.http.post(g,{publicToken:r,institutionName:a.institution.name,userId:this.userRepository.getCurrentUserId()}).subscribe(l=>{console.log(l);const{added:p,removed:b,modified:Z}=l;this.plaidTransactionSyncHandler(p,b,Z,!0)})}plaidHandlerOnExitCallback(r,a){return(0,i.Z)(function*(){console.log(r)})()}plaidHandlerOnLoadCallback(){return(0,i.Z)(function*(){})()}plaidHandlerOnEventCallback(r,a){return(0,i.Z)(function*(){})()}plaidTransactionSyncHandler(r,a,l,p=!0){var b=this;return(0,i.Z)(function*(){const E={from:"plaid",addedTransactions:r.map(k),removedTransactions:a.map(k),modifiedTransactions:l.map(k)};return p&&b.transactionPublisher.publishEvent(E),E})()}shouldSyncTransactions(r){return(0,i.Z)(function*(){if(!r.last_transaction_retrieval)return!0;const l=r.last_transaction_retrieval;return(new Date).getTime()-l.getTime()>3e5})()}}return v.\u0275fac=function(r){return new(r||v)(O.LFG(D.O),O.LFG(R.q),O.LFG(S.E),O.LFG(F.u),O.LFG(Y.HT),O.LFG(J.K))},v.\u0275prov=O.Yz7({token:v,factory:v.\u0275fac,providedIn:"root"}),v})()},6635:(U,y,o)=>{o.d(y,{u:()=>C});var i=o(6689);let C=(()=>{class A{constructor(){this.subscribers=new Set}publishEvent(h){console.log("Publishing event",h),this.subscribers.forEach(s=>{s.onTransactionEvent(h)})}subscribe(h){this.subscribers.add(h)}unsubscribe(h){this.subscribers.delete(h)}}return A.\u0275fac=function(h){return new(h||A)},A.\u0275prov=i.Yz7({token:A,factory:A.\u0275fac,providedIn:"root"}),A})()},293:(U,y,o)=>{o.r(y),o.d(y,{Tab3PageModule:()=>H});var i=o(5548),C=o(6814),A=o(95),P=o(3554),h=o(2607),s=o(5861),T=o(7826),n=o(6689),u=o(8452),g=o(7087);function f(e,m){if(1&e&&(n.TgZ(0,"ion-card-header")(1,"ion-card-title"),n._uU(2,"Linked Accounts"),n.qZA(),n.TgZ(3,"ion-card-subtitle"),n._uU(4),n.qZA()()),2&e){const t=n.oxw();n.xp6(4),n.hij(" ",t.linkedAccounts.length," Linked Accounts ")}}function _(e,m){1&e&&n._UZ(0,"ion-icon",14)}function k(e,m){1&e&&n._UZ(0,"ion-icon",15)}function O(e,m){1&e&&n._UZ(0,"ion-icon",16)}function D(e,m){1&e&&(n.TgZ(0,"p"),n._uU(1," Linked "),n.qZA())}function R(e,m){1&e&&(n.TgZ(0,"p"),n._uU(1," Almost Expired "),n.qZA())}function S(e,m){1&e&&(n.TgZ(0,"p"),n._uU(1," Needs Relink "),n.qZA())}function F(e,m){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item-option",17),n.NdJ("click",function(){n.CHM(t);const d=n.oxw().$implicit,x=n.oxw(2);return n.KtG(x.handleLinkedAccountAction(d))}),n._uU(1," Relink "),n.qZA()}}function Y(e,m){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item-sliding")(1,"ion-item",7),n.NdJ("click",function(){const x=n.CHM(t).$implicit,w=n.oxw(2);return n.KtG(w.handleLinkedAccountAction(x))}),n.YNc(2,_,1,0,"ion-icon",8),n.YNc(3,k,1,0,"ion-icon",9),n.YNc(4,O,1,0,"ion-icon",10),n.TgZ(5,"ion-label")(6,"h2"),n._uU(7),n.qZA(),n.YNc(8,D,2,0,"p",3),n.YNc(9,R,2,0,"p",3),n.YNc(10,S,2,0,"p",3),n.qZA()(),n.TgZ(11,"ion-item-options",11),n.YNc(12,F,2,0,"ion-item-option",12),n.TgZ(13,"ion-item-option",13),n.NdJ("click",function(){const x=n.CHM(t).$implicit,w=n.oxw(2);return n.KtG(w.removeLinkedAccount(x))}),n._uU(14," Delete "),n.qZA()()()}if(2&e){const t=m.$implicit;n.xp6(1),n.Q6J("button",t.link_status&&"NONE"!=t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(3),n.Oqu(t.institution_name),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(2),n.Q6J("ngIf",t.link_status&&"NONE"!=t.link_status.required_action)}}function J(e,m){if(1&e&&(n.TgZ(0,"ion-list"),n.YNc(1,Y,15,9,"ion-item-sliding",6),n.qZA()),2&e){const t=n.oxw();n.xp6(1),n.Q6J("ngForOf",t.linkedAccounts)}}let K=(()=>{class e{constructor(t,c,d){this.modalController=t,this.linkedAccountsRepository=c,this.plaidService=d,this.linkedAccounts=[],this.loading=!0}ngOnInit(){if(!this.user)throw new Error("ViewLinkedAccountsComponent: user is undefined");this.linkedAccountsRepository.getAllFromParent(this.user.id).then(t=>{this.loading=!1,this.linkedAccounts=t.docs})}removeLinkedAccount(t){var c=this;return(0,s.Z)(function*(){c.plaidService.removePlaidLinkedAccount(t),c.linkedAccounts=c.linkedAccounts.filter(d=>d.id!==t.id)})()}handleLinkedAccountAction(t){var c=this;return(0,s.Z)(function*(){if(t.link_status)switch(t.link_status.required_action){case"RELINK":case"NOTIFY_PENDING_EXPIRATION":c.relinkLinkedAccount(t);break;case"NONE":break;default:throw new Error("ViewLinkedAccountsComponent: unknown required_action")}})()}link(){var t=this;return(0,s.Z)(function*(){t.modalController.dismiss(),t.plaidService.linkPlaidToUser()})()}relinkLinkedAccount(t){var c=this;return(0,s.Z)(function*(){c.plaidService.relinkPlaidLinkedAccount(t)})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(i.IN),n.Y36(u.q),n.Y36(g.O))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-view-linked-accounts"]],decls:15,vars:2,consts:[["color","primary"],["slot","start"],[3,"click"],[4,"ngIf"],["color","primary","fill","clear",3,"click"],["name","add"],[4,"ngFor","ngForOf"],["lines","full",3,"button","click"],["name","checkmark-circle-outline","style","color: var(--ion-color-success)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-warning)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-danger)","slot","start",4,"ngIf"],["side","end"],["color","primary",3,"click",4,"ngIf"],["color","danger",3,"click"],["name","checkmark-circle-outline","slot","start",2,"color","var(--ion-color-success)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-warning)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-danger)"],["color","primary",3,"click"]],template:function(t,c){1&t&&(n.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),n.NdJ("click",function(){return c.modalController.dismiss()}),n._uU(4,"Close"),n.qZA()(),n.TgZ(5,"ion-title"),n._uU(6,"Linked Accounts"),n.qZA()()(),n.TgZ(7,"ion-content")(8,"ion-card"),n.YNc(9,f,5,1,"ion-card-header",3),n.TgZ(10,"ion-card-content"),n.YNc(11,J,2,1,"ion-list",3),n.qZA(),n.TgZ(12,"ion-button",4),n.NdJ("click",function(){return c.link()}),n._UZ(13,"ion-icon",5),n._uU(14," Link Account "),n.qZA()()()),2&t&&(n.xp6(9),n.Q6J("ngIf",!c.loading),n.xp6(2),n.Q6J("ngIf",!c.loading&&c.linkedAccounts.length>0))},dependencies:[C.sg,C.O5,i.YG,i.Sm,i.PM,i.FN,i.Zi,i.tO,i.Dq,i.W2,i.Gu,i.gu,i.Ie,i.u8,i.IK,i.td,i.Q$,i.q_,i.wd,i.sr]}),e})();var v=o(3076),L=o(36),r=o(1776),a=o(3251),l=o(7195);function p(e,m){if(1&e&&(n.TgZ(0,"p",19),n._uU(1),n.qZA()),2&e){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[0].raw.price,"/month ")}}function b(e,m){if(1&e&&(n.TgZ(0,"p",19),n._uU(1),n.qZA()),2&e){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[1].raw.price,"/year ")}}function Z(e,m){if(1&e){const t=n.EpF();n.TgZ(0,"ion-card")(1,"ion-card-content")(2,"div",8)(3,"header"),n._UZ(4,"lottie-player",9),n.qZA(),n.TgZ(5,"section",10)(6,"h2"),n._uU(7,"Why Go Pro?"),n.qZA(),n.TgZ(8,"ul")(9,"li"),n._uU(10,"\u{1f680} Automatic Transaction Imports"),n.qZA(),n.TgZ(11,"li"),n._uU(12,"\u{1f552} Save Time with No More Manual Entries"),n.qZA(),n.TgZ(13,"li"),n._uU(14,"\u{1f3a8} Change the app's overall theme"),n.qZA()()(),n.TgZ(15,"section",11)(16,"h2"),n._uU(17,"Choose Your Plan"),n.qZA(),n.TgZ(18,"span",12)(19,"div",13)(20,"h3"),n._uU(21,"Monthly Plan"),n.qZA(),n.YNc(22,p,2,1,"p",14),n.TgZ(23,"p"),n._uU(24,"After 7-day Free Trial"),n.qZA(),n.TgZ(25,"button",15),n.NdJ("click",function(){n.CHM(t);const d=n.oxw();return n.KtG(d.purchase("premium_sub"))}),n._uU(26,"Go Monthly"),n.qZA()(),n.TgZ(27,"div",16)(28,"h3"),n._uU(29,"Yearly Plan"),n.qZA(),n.YNc(30,b,2,1,"p",14),n.TgZ(31,"p"),n._uU(32,"After 7-day Free Trial"),n.qZA(),n.TgZ(33,"button",15),n.NdJ("click",function(){n.CHM(t);const d=n.oxw();return n.KtG(d.purchase("premium_yearly"))}),n._uU(34,"Go Yearly"),n.qZA()()(),n.TgZ(35,"div")(36,"p")(37,"a",17),n._uU(38,"Privacy Policy"),n.qZA()(),n.TgZ(39,"p")(40,"a",18),n._uU(41,"Terms & Conditions"),n.qZA()()()()()()()}if(2&e){const t=n.oxw();n.xp6(22),n.Q6J("ngIf",t.inapp.products.length>0),n.xp6(8),n.Q6J("ngIf",t.inapp.products.length>0)}}function I(e,m){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item",7),n.NdJ("click",function(){n.CHM(t);const d=n.oxw();return n.KtG(d.viewLinkedAccounts())}),n.TgZ(1,"ion-label"),n._uU(2,"View Linked Accounts"),n.qZA()()}}const E=[{path:"",component:(()=>{class e{constructor(t,c,d,x,w,G,V,B,Q){this.modalController=t,this.userService=c,this.inapp=d,this.authService=x,this.router=w,this.alertService=G,this.plaidService=V,this.alertCtrl=B,this.userRepository=Q}ngOnInit(){}link(){var t=this;return(0,s.Z)(function*(){t.plaidService.linkPlaidToUser()})()}signOut(){var t=this;return(0,s.Z)(function*(){(yield t.authService.logout())?t.router.navigateByUrl("login"):t.alertService.createAndShowToast("There was an error logging out")})()}purchase(t){this.inapp.startPurchase(t)}goToThemes(){this.router.navigateByUrl("tabs/tab3/themes")}deleteAccount(){var t=this;return(0,s.Z)(function*(){var d;(yield t.alertCtrl.create({header:"Are you sure you want to delete your account?",buttons:[{text:"Yes",role:"destructive",handler:(d=(0,s.Z)(function*(){const x=yield t.authService.getCurrentAuthUser();(0,T.h8)(x).then(()=>window.location.reload())}),function(){return d.apply(this,arguments)})},{text:"No",handler:function(){var d=(0,s.Z)(function*(){});return function(){return d.apply(this,arguments)}}()}]})).present()})()}viewLinkedAccounts(){var t=this;return(0,s.Z)(function*(){const c=yield t.userRepository.getCurrentFirestoreUser();if(!c)throw new Error("Tab3: user is undefined");(yield t.modalController.create({component:K,componentProps:{user:c}})).present()})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(i.IN),n.Y36(v.K),n.Y36(L.y),n.Y36(r.e),n.Y36(h.F0),n.Y36(a.c),n.Y36(g.O),n.Y36(i.Br),n.Y36(l.E))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-tab3"]],decls:26,vars:6,consts:[[3,"translucent"],[3,"fullscreen"],["collapse","condense"],["size","large"],[4,"ngIf"],["button","",3,"disabled","click"],["button","",3,"click",4,"ngIf"],["button","",3,"click"],[1,"container"],["slot","end","autoplay","","loop","","src","https://lottie.host/1a9b80ea-1cb9-4b02-929a-0a9d8e7fcee2/bdrGIZRYXV.json"],[1,"benefits"],[1,"pricing"],[1,"row"],["id","monthly",1,"plan"],["class","price",4,"ngIf"],[3,"click"],["id","yearly",1,"plan"],["href","https://elcodev.com/privacy-policy"],["href","https://elcodev.com/terms-conditions"],[1,"price"]],template:function(t,c){1&t&&(n.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),n._uU(3," Accounts "),n.qZA()()(),n.TgZ(4,"ion-content",1)(5,"ion-header",2)(6,"ion-toolbar")(7,"ion-title",3),n._uU(8,"Accounts"),n.qZA()()(),n.YNc(9,Z,42,2,"ion-card",4),n.TgZ(10,"ion-card")(11,"ion-card-content")(12,"ion-list")(13,"ion-item",5),n.NdJ("click",function(){return c.link()}),n.TgZ(14,"ion-label"),n._uU(15,"Link Account"),n.qZA()(),n.YNc(16,I,3,0,"ion-item",6),n.TgZ(17,"ion-item",5),n.NdJ("click",function(){return c.goToThemes()}),n.TgZ(18,"ion-label"),n._uU(19,"Change App Theme"),n.qZA()(),n.TgZ(20,"ion-item",7),n.NdJ("click",function(){return c.deleteAccount()}),n.TgZ(21,"ion-label"),n._uU(22,"Delete Account"),n.qZA()(),n.TgZ(23,"ion-item",7),n.NdJ("click",function(){return c.signOut()}),n.TgZ(24,"ion-label"),n._uU(25,"Sign Out"),n.qZA()()()()()()),2&t&&(n.Q6J("translucent",!0),n.xp6(4),n.Q6J("fullscreen",!0),n.xp6(5),n.Q6J("ngIf",!c.userService.isPremium),n.xp6(4),n.Q6J("disabled",!c.userService.isPremium),n.xp6(3),n.Q6J("ngIf",c.userService.isPremium),n.xp6(1),n.Q6J("disabled",!c.userService.isPremium))},dependencies:[i.PM,i.FN,i.W2,i.Gu,i.Ie,i.Q$,i.q_,i.wd,i.sr,C.O5],styles:["ion-title[_ngcontent-%COMP%]{background:#f3f3f3}ion-toolbar[_ngcontent-%COMP%]{padding:0!important}.container[_ngcontent-%COMP%]{max-width:800px;margin:20px auto;padding:20px;border-radius:8px}header[_ngcontent-%COMP%]{text-align:center;display:flex;flex-direction:row;justify-content:center}header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#00eabb}.benefits[_ngcontent-%COMP%]{margin:20px 0}.benefits[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .pricing[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;color:#2980b9}.benefits[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none;padding:0}.benefits[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:10px 0;font-size:18px}.pricing[_ngcontent-%COMP%]{text-align:center}.pricing[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;flex-wrap:nowrap}.plan[_ngcontent-%COMP%]{display:flex;min-width:50%;max-width:50%;margin:10px;padding:20px;background:#f9f9f9;border:1px solid #ddd;border-radius:8px;flex-direction:column;flex-wrap:nowrap;align-items:center;justify-content:center}.plan[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#2980b9}.price[_ngcontent-%COMP%]{font-size:20px;color:#000}button[_ngcontent-%COMP%]{width:100%;padding:10px;border:none;border-radius:5px;background-color:#00eabb;color:#fff;font-size:18px;cursor:pointer;margin-top:10px}button[_ngcontent-%COMP%]:hover{background-color:#00cea5}lottie-player[_ngcontent-%COMP%]{width:225px;margin-top:-90px;text-align:center}"]}),e})()},{path:"themes",loadChildren:()=>o.e(6344).then(o.bind(o,6344)).then(e=>e.ThemesPageModule)}];let M=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[h.Bz.forChild(E),h.Bz]}),e})(),H=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[i.Pc,C.ez,A.u5,P.e,M]}),e})()}}]);