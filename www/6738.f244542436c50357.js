"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[6738],{1695:(x,v,r)=>{r.d(v,{m:()=>m});var p=r(5861),t=r(6689),e=r(6814),T=r(95),_=r(5548);const g=["nameInput"],M=["fieldsContainer"];function P(a,f){1&a&&(t.TgZ(0,"span",6),t._uU(1,"Remaining"),t.qZA())}function S(a,f){if(1&a){const o=t.EpF();t.TgZ(0,"span",11),t.NdJ("click",function(){t.CHM(o);const i=t.oxw().index,b=t.oxw(2);return t.KtG(b.openBudgetItem(i))}),t.TgZ(1,"ion-label"),t._uU(2),t.qZA(),t.TgZ(3,"ion-note",12),t._uU(4),t.ALo(5,"currency"),t.qZA()()}if(2&a){const o=t.oxw().$implicit,d=t.oxw(2);t.xp6(2),t.Oqu(o.text),t.xp6(2),t.Oqu(t.lcZ(5,2,d.getSubcategoryRemainingAmount(o)))}}function N(a,f){if(1&a){const o=t.EpF();t.TgZ(0,"span",13)(1,"ion-input",14,15),t.NdJ("ngModelChange",function(i){t.CHM(o);const b=t.oxw().$implicit;return t.KtG(b.text=i)})("ionFocus",function(){t.CHM(o);const i=t.oxw(3);return t.KtG(i.stopTimeout())})("ionBlur",function(){t.CHM(o);const i=t.oxw(3);return t.KtG(i.shouldWeSaveOrRemove())})("keyup.enter",function(){t.CHM(o);const i=t.oxw(3);return t.KtG(i.triggerIonBlur())}),t.qZA(),t.TgZ(3,"ion-note",12),t._uU(4),t.ALo(5,"currency"),t.qZA()()}if(2&a){const o=t.oxw().$implicit,d=t.oxw(2);t.xp6(1),t.Q6J("ngModel",o.text),t.xp6(3),t.Oqu(t.lcZ(5,2,d.getSubcategoryRemainingAmount(o)))}}function A(a,f){if(1&a&&(t.TgZ(0,"ion-item",8),t.YNc(1,S,6,4,"span",9),t.YNc(2,N,6,4,"span",10),t.qZA()),2&a){const o=f.$implicit;t.Q6J("button",!o.isEditing),t.xp6(1),t.Q6J("ngIf",!o.isEditing),t.xp6(1),t.Q6J("ngIf",o.isEditing)}}function E(a,f){if(1&a&&(t.TgZ(0,"span"),t.YNc(1,A,3,3,"ion-item",7),t.qZA()),2&a){const o=t.oxw();t.xp6(1),t.Q6J("ngForOf",o.subcategories)}}function I(a,f){if(1&a){const o=t.EpF();t.TgZ(0,"ion-item",17),t.NdJ("click",function(){const b=t.CHM(o).index,n=t.oxw(2);return t.KtG(n.selectSubCategory(b))}),t.TgZ(1,"ion-label",18),t._uU(2),t.qZA()()}if(2&a){const o=f.$implicit;t.xp6(2),t.Oqu(o.text)}}function h(a,f){if(1&a&&(t.TgZ(0,"span"),t.YNc(1,I,3,1,"ion-item",16),t.qZA()),2&a){const o=t.oxw();t.xp6(1),t.Q6J("ngForOf",o.subcategories)}}function y(a,f){if(1&a){const o=t.EpF();t.TgZ(0,"ion-item")(1,"ion-label",19),t.NdJ("click",function(){t.CHM(o);const i=t.oxw();return t.KtG(i.addNewSub())}),t._UZ(2,"ion-icon",20),t._uU(3," Add New Category "),t.qZA()()}}const s=function(a){return{"padding-right":a}};let m=(()=>{class a{constructor(){this.isChecklist=!1,this.isUserReorderingCategories=!1,this.addNewSubEvent=new t.vpe,this.requestSaveOfSubs=new t.vpe,this.subcategorySelected=new t.vpe,this.transactions=[]}ngOnInit(){this.checkDOMChange()}addNewSub(){this.addNewSubEvent.emit()}triggerIonBlur(){this.shouldWeSaveOrRemove()}checkDOMChange(){this.checker=setTimeout(()=>{const o=document.getElementsByClassName("new-sub");o.length>0&&o[0].childNodes[0].setFocus(),this.checkDOMChange()},100)}getSubcategoryRemainingAmount(o){return this.category.id?"income"===this.category.id?o.actual_amount+-1*o.planned_amount:o.planned_amount-o.actual_amount:0}stopTimeout(){clearTimeout(this.checker)}shouldWeSaveOrRemove(){this.subcategories.find(d=>d.isEditing)&&this.requestSaveOfSubs.emit()}openBudgetItem(o){var d=this;return(0,p.Z)(function*(){d.subcategorySelected.emit({sub:d.subcategories[o],cat:d.category})})()}selectSubCategory(o){this.subcategorySelected.emit(this.subcategories[o])}}return a.\u0275fac=function(o){return new(o||a)},a.\u0275cmp=t.Xpm({type:a,selectors:[["app-category"]],viewQuery:function(o,d){if(1&o&&(t.Gf(g,5),t.Gf(M,5)),2&o){let i;t.iGM(i=t.CRH())&&(d.nameInput=i.first),t.iGM(i=t.CRH())&&(d.fieldsContainer=i.first)}},inputs:{category:"category",subcategories:"subcategories",isChecklist:"isChecklist",chosenDate:"chosenDate",isUserReorderingCategories:"isUserReorderingCategories"},outputs:{addNewSubEvent:"addNewSubEvent",requestSaveOfSubs:"requestSaveOfSubs",subcategorySelected:"subcategorySelected"},decls:11,vars:9,consts:[[3,"ngStyle","id"],["id","subtitle"],["id","title"],["id","category",4,"ngIf"],["lines","none"],[4,"ngIf"],["id","category"],["class","target","detail","false",3,"button",4,"ngFor","ngForOf"],["detail","false",1,"target",3,"button"],["class","saved-sub",3,"click",4,"ngIf"],["class","new-sub",4,"ngIf"],[1,"saved-sub",3,"click"],[2,"text-align","end"],[1,"new-sub"],["placeholder","Name",3,"ngModel","ngModelChange","ionFocus","ionBlur","keyup.enter"],["nameInput",""],["class","target","button","",3,"click",4,"ngFor","ngForOf"],["button","",1,"target",3,"click"],["labelPlacement","start"],[1,"add-new",2,"cursor","pointer",3,"click"],["name","add"]],template:function(o,d){1&o&&(t.TgZ(0,"ion-card",0)(1,"ion-card-header")(2,"ion-card-subtitle",1)(3,"span",2),t._uU(4),t.qZA(),t.YNc(5,P,2,0,"span",3),t.qZA()(),t.TgZ(6,"ion-card-content")(7,"ion-list",4),t.YNc(8,E,2,1,"span",5),t.YNc(9,h,2,1,"span",5),t.YNc(10,y,4,0,"ion-item",5),t.qZA()()()),2&o&&(t.MGl("id","",d.category.id,"-card"),t.Q6J("ngStyle",t.VKq(7,s,d.isUserReorderingCategories?"34px":"0")),t.xp6(4),t.Oqu(d.category.id),t.xp6(1),t.Q6J("ngIf",!d.isChecklist),t.xp6(3),t.Q6J("ngIf",!d.isChecklist),t.xp6(1),t.Q6J("ngIf",d.isChecklist),t.xp6(1),t.Q6J("ngIf",!d.isChecklist))},dependencies:[e.sg,e.O5,e.PC,T.JJ,T.On,_.PM,_.FN,_.Zi,_.tO,_.gu,_.pK,_.Ie,_.Q$,_.q_,_.uN,_.j9,e.H9],styles:["ion-card[_ngcontent-%COMP%]{margin:0 0 28px}.add-new[_ngcontent-%COMP%]{font-size:small;opacity:.6;display:flex;flex-direction:row;align-items:center;justify-content:center}.new-sub[_ngcontent-%COMP%], .saved-sub[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;width:100%}.saved-sub[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{width:100%}#subtitle[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-between}"]}),a})()},3554:(x,v,r)=>{r.d(v,{e:()=>_});var p=r(6814),t=r(95),e=r(5548),T=r(6689);let _=(()=>{class g{}return g.\u0275fac=function(P){return new(P||g)},g.\u0275mod=T.oAB({type:g}),g.\u0275inj=T.cJS({imports:[p.ez,t.u5,e.Pc]}),g})()},98:(x,v,r)=>{r.d(v,{m:()=>I});var p=r(5861),t=r(5548),e=r(6689),T=r(6635),_=r(6814),g=r(95),M=r(1695);function P(h,y){if(1&h){const s=e.EpF();e.TgZ(0,"ion-datetime",12),e.NdJ("ionChange",function(a){e.CHM(s);const f=e.oxw();return e.KtG(f.dateChanged(a))}),e.qZA()}2&h&&e.Q6J("preferWheel",!0)}function S(h,y){if(1&h&&(e.TgZ(0,"p"),e._uU(1),e.qZA()),2&h){const s=e.oxw();e.xp6(1),e.Oqu(s.selectedSub)}}const N=function(){return[]};function A(h,y){if(1&h){const s=e.EpF();e.TgZ(0,"span")(1,"app-category",14),e.NdJ("subcategorySelected",function(a){e.CHM(s);const f=e.oxw(2);return e.KtG(f.subcategorySelected(a))}),e.qZA()()}if(2&h){const s=y.$implicit;let m;e.xp6(1),e.Q6J("category",s)("isChecklist",!0)("subcategories",null!==(m=s.subcategories)&&void 0!==m?m:e.DdM(3,N))}}function E(h,y){if(1&h){const s=e.EpF();e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-title"),e._uU(3,"Pick a Category"),e.qZA(),e.TgZ(4,"ion-buttons",1)(5,"ion-button",2),e.NdJ("click",function(){e.CHM(s),e.oxw();const a=e.MAs(43);return e.KtG(a.dismiss())}),e._uU(6,"Close"),e.qZA()()()(),e.TgZ(7,"ion-content"),e.YNc(8,A,2,4,"span",13),e.qZA()}if(2&h){const s=e.oxw();e.xp6(8),e.Q6J("ngForOf",s.categories)}}let I=(()=>{class h{constructor(s,m){this.modalCtrl=s,this.transactionPublisher=m}ngAfterViewInit(){var s=this;return(0,p.Z)(function*(){const m=s.transaction.date.getTimezoneOffset(),a=new Date(s.transaction.date.getTime()-60*m*1e3);s.ionDatetime.value=a.toISOString()})()}save(){var s=this;return(0,p.Z)(function*(){s.transactionPublisher.publishEvent({from:"manual",addedTransactions:[],modifiedTransactions:[s.transaction],removedTransactions:[]}),s.modalCtrl.dismiss()})()}subcategorySelected(s){this.modalCtrl.dismiss(),this.transaction.subcategoryId=s.id,console.log(this.transaction)}dateChanged(s){this.transaction.date=new Date(s.detail.value)}getAmount(){return this.transaction.amount>=0?this.transaction.amount:-this.transaction.amount}}return h.\u0275fac=function(s){return new(s||h)(e.Y36(t.IN),e.Y36(T.u))},h.\u0275cmp=e.Xpm({type:h,selectors:[["app-transaction-sorter"]],viewQuery:function(s,m){if(1&s&&e.Gf(t.x4,5),2&s){let a;e.iGM(a=e.CRH())&&(m.ionDatetime=a.first)}},decls:45,vars:8,consts:[["color","primary"],["slot","start"],[3,"click"],["slot","end"],["slot","end","datetime","datetime"],["placeholder","Name","slot","end","type","text",3,"ngModel","ngModelChange"],[3,"keepContentsMounted"],["lines","none"],["button","","id","open-modal"],[4,"ngIf"],["trigger","open-modal",3,"presentingElement"],["modal",""],["id","datetime","presentation","date",3,"preferWheel","ionChange"],[4,"ngFor","ngForOf"],[3,"category","isChecklist","subcategories","subcategorySelected"]],template:function(s,m){1&s&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),e.NdJ("click",function(){return m.modalCtrl.dismiss()}),e._uU(4,"Cancel"),e.qZA()(),e.TgZ(5,"ion-title"),e._uU(6,"Update Transaction"),e.qZA(),e.TgZ(7,"ion-buttons",3)(8,"ion-button",2),e.NdJ("click",function(){return m.save()}),e._uU(9,"Save"),e.qZA()()()(),e.TgZ(10,"ion-content")(11,"ion-card")(12,"ion-card-content")(13,"ion-list")(14,"ion-item")(15,"ion-label"),e._uU(16,"Date"),e.qZA(),e._UZ(17,"ion-datetime-button",4),e.qZA(),e.TgZ(18,"ion-item")(19,"ion-label"),e._uU(20,"Amount"),e.qZA(),e.TgZ(21,"p"),e._uU(22),e.ALo(23,"currency"),e.qZA()(),e.TgZ(24,"ion-item")(25,"ion-label"),e._uU(26,"Transaction"),e.qZA(),e.TgZ(27,"ion-input",5),e.NdJ("ngModelChange",function(f){return m.transaction.name=f}),e.qZA()(),e.TgZ(28,"ion-item")(29,"ion-label"),e._uU(30,"Merchant"),e.qZA(),e.TgZ(31,"ion-input",5),e.NdJ("ngModelChange",function(f){return m.transaction.merchant_name=f}),e.qZA()()(),e.TgZ(32,"ion-modal",6),e.YNc(33,P,1,1,"ng-template"),e.qZA()()(),e.TgZ(34,"ion-card")(35,"ion-card-content")(36,"ion-list",7)(37,"ion-item",8)(38,"ion-label"),e._uU(39,"Budget Category"),e.qZA(),e._UZ(40,"br"),e.YNc(41,S,2,1,"p",9),e.qZA()()()(),e.TgZ(42,"ion-modal",10,11),e.YNc(44,E,9,1,"ng-template"),e.qZA()()),2&s&&(e.xp6(22),e.Oqu(e.lcZ(23,6,m.getAmount())),e.xp6(5),e.Q6J("ngModel",m.transaction.name),e.xp6(4),e.Q6J("ngModel",m.transaction.merchant_name),e.xp6(1),e.Q6J("keepContentsMounted",!0),e.xp6(9),e.Q6J("ngIf",m.transaction.subcategoryId),e.xp6(1),e.Q6J("presentingElement",m.presentingElement))},dependencies:[_.sg,_.O5,g.JJ,g.On,t.YG,t.Sm,t.PM,t.FN,t.W2,t.x4,t.Mj,t.Gu,t.pK,t.Ie,t.Q$,t.q_,t.wd,t.sr,t.ki,t.QI,t.j9,M.m,_.H9],styles:["#segment[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}#segment[_ngcontent-%COMP%]   ion-segment[_ngcontent-%COMP%]{width:90%;margin-top:25px}ion-toolbar[_ngcontent-%COMP%]   ion-title[_ngcontent-%COMP%]{color:#fff}ion-toolbar[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{color:#fff}ion-input[_ngcontent-%COMP%]{text-align:end}ion-datetime-button[_ngcontent-%COMP%]::part(native){background:#fff;padding-right:5px}"]}),h})()},1269:(x,v,r)=>{r.d(v,{O:()=>e});var p=r(6689),t=r(9862);let e=(()=>{class T{constructor(g){this.http=g}post(g,M){return this.http.post(g,M,{headers:this.getHeaders()})}getHeaders(){return{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}}}return T.\u0275fac=function(g){return new(g||T)(p.LFG(t.eN))},T.\u0275prov=p.Yz7({token:T,factory:T.\u0275fac,providedIn:"root"}),T})()},3990:(x,v,r)=>{r.d(v,{O:()=>d});var p=r(5861),t=r(6306),e=r(6973);function T(i,b){const n="object"==typeof b;return new Promise((l,c)=>{let C,u=!1;i.subscribe({next:Z=>{C=Z,u=!0},error:c,complete:()=>{u?l(C):n?l(b.defaultValue):c(new e.K)}})})}var _=r(553);const g=_.N.useFunctionsEmulator&&!_.N.production?"http://localhost:5001/balanced-budget-90f1f/us-central1/":"https://us-central1-balanced-budget-90f1f.cloudfunctions.net/",M=g+"getTransactionData",P=g+"createPlaidLinkToken",S=g+"exchangePublicToken";function A(i){const b=i.datetime?new Date(i.datetime):new Date(i.date);return{id:i.transaction_id,amount:i.amount,subcategoryId:"",date:b,merchant_name:i.merchant_name,name:i.name,pending:i.pending}}var E=r(6689),I=r(1269),h=r(4092),y=r(182),s=r(15);let m=(()=>{class i extends h.q{constructor(){super(y.lN)}get(n,l){var c=()=>super._get,u=this;return(0,p.Z)(function*(){const C=yield c().call(u,i.makeCollectionRef(n),l);return u.convertTimestampToDate(C)})()}getAll(){var n=()=>super._getAll,l=this;return(0,p.Z)(function*(){const c=yield n().call(l);return c.docs&&(c.docs=c.docs.map(u=>l.convertTimestampToDate(u))),c})()}getAllFromParent(n){var l=()=>super._getAllFromParent,c=this;return(0,p.Z)(function*(){const u=yield l().call(c,i.makeCollectionRef(n));return u.docs&&(u.docs=u.docs.map(C=>c.convertTimestampToDate(C))),u})()}getByQuery(n){var l=()=>super._getByQuery,c=this;return(0,p.Z)(function*(){const u=yield l().call(c,n);return u.docs&&(u.docs=u.docs.map(C=>c.convertTimestampToDate(C))),u})()}add(n,l,c){var u=()=>super._add,C=this;return(0,p.Z)(function*(){return u().call(C,i.makeCollectionRef(n),l,c)})()}update(n,l,c){var u=()=>super._update,C=this;return(0,p.Z)(function*(){return u().call(C,i.makeCollectionRef(n),l,c)})()}delete(n,l,c=!1){var u=()=>super._delete,C=this;return(0,p.Z)(function*(){return u().call(C,i.makeCollectionRef(n),l,c)})()}static makeCollectionRef(n){return(0,s.hJ)((0,s.ad)(),y.YP,n,y.lN)}convertTimestampToDate(n){if(!n)return n;const l=n.last_transaction_retrieval;return l&&(n.last_transaction_retrieval=l.toDate()),n}}return i.\u0275fac=function(n){return new(n||i)},i.\u0275prov=E.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var a=r(7195),f=r(6635),o=r(5548);let d=(()=>{class i{constructor(n,l,c,u,C){this.http=n,this.linkedAccountsRepository=l,this.userRepository=c,this.transactionPublisher=u,this.loadingController=C}linkPlaidToUser(){var n=this;return(0,p.Z)(function*(){const l=yield n.loadingController.create();yield l.present(),n.http.post(P,{user_id:n.userRepository.getCurrentUserId()}).pipe((0,t.K)(c=>(console.log(c),l.dismiss(),c))).subscribe(c=>{console.log(c);const u=n.createPlaidHandler(c.link_token);l.dismiss(),u.open()})})()}syncPlaidTransactions(){var n=this;return(0,p.Z)(function*(){const l=n.userRepository.getCurrentUserId();if(!l)throw new Error("User is not logged in");const c=(yield n.linkedAccountsRepository.getAllFromParent(l)).docs;if(0===c.length)return;const u=[];for(let O of c)(yield n.shouldSyncTransactions(O))&&u.push(T(n.http.post(M,{userId:l,linkedAccount:O,linkedAccountId:O.id})));const C=yield Promise.all(u);let Z=[],D=[],U=[];for(let O=0;O<C.length;O++){const R=C[O];Z=Z.concat(R.added),D=D.concat(R.removed),U=U.concat(R.modified)}n.plaidTransactionSyncHandler(Z,D,U,!0)})()}createPlaidHandler(n){return Plaid.create({token:n,onSuccess:this.plaidHandlerOnSuccessCallback.bind(this),onExit:this.plaidHandlerOnExitCallback.bind(this),onLoad:this.plaidHandlerOnLoadCallback.bind(this),onEvent:this.plaidHandlerOnEventCallback.bind(this),receivedRedirectUri:null})}plaidHandlerOnSuccessCallback(n,l){this.http.post(S,{publicToken:n,institutionName:l.institution.name,userId:this.userRepository.getCurrentUserId()}).subscribe(c=>{console.log(c);const{added:u,removed:C,modified:Z}=c;this.plaidTransactionSyncHandler(u,C,Z,!0)})}plaidHandlerOnExitCallback(n,l){return(0,p.Z)(function*(){console.log(n)})()}plaidHandlerOnLoadCallback(){return(0,p.Z)(function*(){})()}plaidHandlerOnEventCallback(n,l){return(0,p.Z)(function*(){})()}plaidTransactionSyncHandler(n,l,c,u=!0){var C=this;return(0,p.Z)(function*(){const O={from:"plaid",addedTransactions:n.map(A),removedTransactions:l.map(A),modifiedTransactions:c.map(A)};return u&&C.transactionPublisher.publishEvent(O),O})()}shouldSyncTransactions(n){return(0,p.Z)(function*(){if(!n.last_transaction_retrieval)return!0;const c=n.last_transaction_retrieval;return(new Date).getTime()-c.getTime()>3e5})()}}return i.\u0275fac=function(n){return new(n||i)(E.LFG(I.O),E.LFG(m),E.LFG(a.E),E.LFG(f.u),E.LFG(o.HT))},i.\u0275prov=E.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},6635:(x,v,r)=>{r.d(v,{u:()=>t});var p=r(6689);let t=(()=>{class e{constructor(){this.subscribers=new Set}publishEvent(_){console.log("Publishing event",_),this.subscribers.forEach(g=>{g.onTransactionEvent(_)})}subscribe(_){this.subscribers.add(_)}unsubscribe(_){this.subscribers.delete(_)}}return e.\u0275fac=function(_){return new(_||e)},e.\u0275prov=p.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()}}]);