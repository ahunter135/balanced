"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5242],{5242:(be,Z,d)=>{d.r(Z),d.d(Z,{Tab1PageModule:()=>ye});var l=d(5548),p=d(6814),m=d(95),q=d(3554),A=d(2607),u=d(5861),M=d(6044),J=d(98);function w(i,c){return i.index>c.index?1:i.index<c.index?-1:0}function P(i,c){const t=new Date(i.date);return new Date(c.date).getTime()-t.getTime()}var e=d(6689),f=d(182),g=d(15),S=d(4092),b=d(9137);let C=(()=>{class i extends S.q{constructor(){super(f.fx)}get(t,n,o){var r=()=>super._get,a=this;return(0,u.Z)(function*(){return r().call(a,i.makeCollectionRef(t,n),o)})()}getAll(){var t=()=>super._getAll,n=this;return(0,u.Z)(function*(){return t().call(n)})()}getAllFromParent(t,n){var o=()=>super._getAllFromParent,r=this;return(0,u.Z)(function*(){return o().call(r,i.makeCollectionRef(t,n))})()}getByQuery(t){var n=()=>super._getByQuery,o=this;return(0,u.Z)(function*(){return n().call(o,t)})()}add(t,n,o,r){var a=()=>super._add,s=this;return(0,u.Z)(function*(){return o=s.cloneAndRemoveProperties(o),a().call(s,i.makeCollectionRef(t,n),o,r)})()}update(t,n,o,r){var a=()=>super._update,s=this;return(0,u.Z)(function*(){return r=s.cloneAndRemoveProperties(r),a().call(s,i.makeCollectionRef(t,n),o,r)})()}delete(t,n,o,r=!1){var a=()=>super._delete,s=this;return(0,u.Z)(function*(){return a().call(s,i.makeCollectionRef(t,n),o,r)})()}static makeCollectionRef(t,n){return(0,g.hJ)((0,g.ad)(),f.YP,t,f.HO,n,f.fx)}cloneAndRemoveProperties(t){return(0,b.w)(t)||((t=structuredClone(t))[b.O]=!0),null!=t.isEditing&&delete t.isEditing,null!=t.actual_amount&&delete t.actual_amount,t}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var N=d(3251),O=d(8647);const D=function(){return{prefix:"$ ",thousands:",",decimal:".",align:"center"}};function E(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"ion-item",7)(1,"div",8)(2,"ion-label"),e._uU(3),e.ALo(4,"currency"),e.qZA(),e.TgZ(5,"ion-label"),e._uU(6,"Received of"),e.qZA(),e.TgZ(7,"input",9),e.NdJ("ngModelChange",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.planned_amount=o)})("blur",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.saveNewAmount())}),e.qZA()()()}if(2&i){const t=e.oxw();e.xp6(3),e.hij("",e.lcZ(4,3,-1*t.subcategory.actual_amount)," "),e.xp6(4),e.Q6J("ngModel",t.planned_amount)("options",e.DdM(5,D))}}function Y(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"ion-item",7)(1,"div",8)(2,"ion-label"),e._uU(3),e.ALo(4,"currency"),e.qZA(),e.TgZ(5,"ion-label"),e._uU(6,"Spent of"),e.qZA(),e.TgZ(7,"input",9),e.NdJ("ngModelChange",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.planned_amount=o)})("blur",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.saveNewAmount())}),e.qZA()()()}if(2&i){const t=e.oxw();e.xp6(3),e.Oqu(e.lcZ(4,3,t.subcategory.actual_amount)),e.xp6(4),e.Q6J("ngModel",t.planned_amount)("options",e.DdM(5,D))}}function B(i,c){if(1&i&&(e.TgZ(0,"ion-item")(1,"ion-label"),e._uU(2),e.ALo(3,"date"),e.qZA(),e.TgZ(4,"ion-note",10),e._uU(5),e.ALo(6,"currency"),e.qZA()()),2&i){const t=c.$implicit;e.xp6(2),e.AsE("",e.xi3(3,3,t.date,"MMM. d")," - ",t.name,""),e.xp6(3),e.Oqu(e.lcZ(6,6,-1*t.amount))}}let Q=(()=>{class i{constructor(t,n,o){this.modalCtrl=t,this.subCategoryRepository=n,this.alertService=o}ngOnInit(){this.subcategoryEditName=this.subcategory.text,this.planned_amount="income"===this.category.id?-1*this.subcategory.planned_amount:this.subcategory.planned_amount,this.transactions=this.transactions.filter(t=>t.subcategoryId===this.subcategory.id),this.transactions.sort(P)}saveNewAmount(){var t=this;return(0,u.Z)(function*(){if(!t.user||!t.user.id||void 0===t.category.id)return;let n=t.planned_amount;"income"==t.category.id&&(n=-1*t.planned_amount),t.subCategoryRepository.update(t.user.id,t.category.id,t.subcategory.id,{planned_amount:n}),t.subcategory.planned_amount=n})()}saveNewName(){var t=this;return(0,u.Z)(function*(){if(t.user&&t.user.id&&void 0!==t.category.id){if(null==t.subcategoryEditName||""==t.subcategoryEditName)return t.alertService.createAndShowToast("Please enter a valid name"),void(t.subcategoryEditName=t.subcategory.text);t.subCategoryRepository.update(t.user.id,t.category.id,t.subcategory.id,{text:t.subcategoryEditName}),t.subcategory.text=t.subcategoryEditName}})()}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(l.IN),e.Y36(C),e.Y36(N.c))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-view-sub-category"]],decls:21,vars:5,consts:[["color","primary"],["slot","start"],[3,"click"],["id","category-header"],["placeholder","Enter a name",3,"ngModel","maxlength","ngModelChange","ionBlur"],["lines","none","class","header",4,"ngIf"],[4,"ngFor","ngForOf"],["lines","none",1,"header"],[1,"amount-container"],["placeholder","$0.00","type","decimal","currencyMask","",1,"ngx-currency-input",3,"ngModel","options","ngModelChange","blur"],["slot","end"]],template:function(t,n){1&t&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),e.NdJ("click",function(){return n.modalCtrl.dismiss()}),e._uU(4,"Close"),e.qZA()(),e.TgZ(5,"ion-title"),e._uU(6,"Subcategory Info"),e.qZA()()(),e.TgZ(7,"ion-content")(8,"ion-card")(9,"ion-card-content")(10,"div",3)(11,"ion-input",4),e.NdJ("ngModelChange",function(r){return n.subcategoryEditName=r})("ionBlur",function(){return n.saveNewName()}),e.qZA()(),e.YNc(12,E,8,6,"ion-item",5),e.YNc(13,Y,8,6,"ion-item",5),e.qZA()(),e.TgZ(14,"ion-card")(15,"ion-card-header")(16,"ion-card-subtitle"),e._uU(17,"Transactions"),e.qZA()(),e.TgZ(18,"ion-card-content")(19,"ion-list"),e.YNc(20,B,7,8,"ion-item",6),e.qZA()()()()),2&t&&(e.xp6(11),e.Q6J("ngModel",n.subcategoryEditName)("maxlength",40),e.xp6(1),e.Q6J("ngIf","income"==n.category.id),e.xp6(1),e.Q6J("ngIf","income"!=n.category.id),e.xp6(7),e.Q6J("ngForOf",n.transactions))},dependencies:[p.sg,p.O5,m.Fj,m.JJ,m.nD,m.On,l.YG,l.Sm,l.PM,l.FN,l.Zi,l.tO,l.W2,l.Gu,l.pK,l.Ie,l.Q$,l.q_,l.uN,l.wd,l.sr,l.j9,O.xv,p.H9,p.uU],styles:[".header[_ngcontent-%COMP%]{text-align:center;display:flex;flex-direction:row;align-items:center;justify-content:start;width:100%}.header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{border:none;text-align:start;background-color:#fff}.header[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border:none}#category-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;justify-content:space-between;width:92%;margin:0 auto 10px}#category-header[_ngcontent-%COMP%]   ion-input[_ngcontent-%COMP%]{text-align:center;font-size:28px;--placeholder-color: #333}ion-item[_ngcontent-%COMP%]{--inner-padding-end: 0;--inner-padding-start: 0}.amount-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;text-align:center;font-size:20px}.amount-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:inline-block;--width: min-content;--max-width: min-content;border-bottom:1px solid #666}.amount-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-bottom:1px solid var(--ion-color-primary)}"]}),i})();function y(i){return i||(i=new Date),{month:i.getMonth(),year:i.getFullYear()}}function V(i,c,t){return(0,g.IO)(C.makeCollectionRef(i,c),(0,g.xD)((0,g.ar)("date.month","==",t.month),(0,g.ar)("date.year","==",t.year)))}const T=[{text:"January",value:0,selected:!1},{text:"February",value:1,selected:!1},{text:"March",value:2,selected:!1},{text:"April",value:3,selected:!1},{text:"May",value:4,selected:!1},{text:"June",value:5,selected:!1},{text:"July",value:6,selected:!1},{text:"August",value:7,selected:!1},{text:"September",value:8,selected:!1},{text:"October",value:9,selected:!1},{text:"November",value:10,selected:!1},{text:"December",value:11,selected:!1}],x=function z(){const i=(new Date).getFullYear(),t=i+2,n=[];for(let o=i-2;o<=t;o++)n.push({text:o.toString(),value:o,selected:!1});return n}();var v=d(6635),k=d(1695);function H(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"ion-datetime",13),e.NdJ("ionChange",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.dateChanged(o))}),e.qZA()}2&i&&e.Q6J("preferWheel",!0)}function K(i,c){if(1&i&&(e.TgZ(0,"p"),e._uU(1),e.qZA()),2&i){const t=e.oxw();e.xp6(1),e.Oqu(t.selectedSub.text)}}const L=function(){return[]};function $(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"span")(1,"app-category",16),e.NdJ("subcategorySelected",function(o){const a=e.CHM(t).$implicit,s=e.oxw(2);return e.KtG(s.subcategorySelected(o,a))}),e.qZA()()}if(2&i){const t=c.$implicit;e.xp6(1),e.Q6J("category",t)("isChecklist",!0)("subcategories",t.subcategories||e.DdM(3,L))}}function W(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-title"),e._uU(3,"Pick a Category"),e.qZA(),e.TgZ(4,"ion-buttons",1)(5,"ion-button",2),e.NdJ("click",function(){e.CHM(t),e.oxw();const o=e.MAs(41);return e.KtG(o.dismiss())}),e._uU(6,"Close"),e.qZA()()()(),e.TgZ(7,"ion-content")(8,"div",14),e.YNc(9,$,2,4,"span",15),e.qZA()()}if(2&i){const t=e.oxw();e.xp6(9),e.Q6J("ngForOf",t.categories)}}const X=function(){return{prefix:"$ ",thousands:",",decimal:"."}};let ee=(()=>{class i{constructor(t,n,o){this.modalCtrl=t,this.alertService=n,this.transactionPublisher=o,this.newTransaction={date:new Date,id:(0,M.D)(),amount:0,subcategoryId:"",name:"",merchant_name:"",pending:!1},this.newTransactionForm=new m.cw({amount:new m.NI(this.newTransaction.amount)}),this.setupModal()}ngOnInit(){}setupModal(){var t=this;return(0,u.Z)(function*(){t.presentingElement=yield t.modalCtrl.getTop()})()}add(){var t=this;return(0,u.Z)(function*(){if(!t.newTransaction.amount||0==t.newTransaction.amount)return void t.alertService.createAndShowToast("Please enter an amount");let n=Object.assign({},t.newTransaction);"income"==t.selectedCat.id&&(n.amount=-1*n.amount);try{t.transactionPublisher.publishEvent({from:"manual",addedTransactions:[n],removedTransactions:[],modifiedTransactions:[],other:{subcategoryId:t.selectedSub.id,categoryId:t.selectedCat.id}})}catch(o){console.log(o)}t.modalCtrl.dismiss()})()}dateChanged(t){this.newTransaction.date=new Date(t.detail.value),console.log(this.newTransaction.date)}subcategorySelected(t,n){this.modalCtrl.dismiss(),console.log(t),this.selectedSub=t,this.selectedCat=n,this.newTransaction.subcategoryId=t.id,this.newTransaction.pending=!1}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(l.IN),e.Y36(N.c),e.Y36(v.u))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-add-transaction"]],inputs:{categories:"categories",user:"user"},decls:43,vars:8,consts:[["color","primary"],["slot","start"],[3,"click"],["slot","end"],["slot","end","datetime","datetime"],["slot","end","placeholder","$0.00","type","decimal","currencyMask","",1,"ngx-currency-input",3,"ngModel","options","ngModelChange"],["placeholder","Name","slot","end","type","text",3,"ngModel","ngModelChange"],[3,"keepContentsMounted"],["lines","none"],["button","","id","open-modal"],[4,"ngIf"],["trigger","open-modal",3,"presentingElement"],["modal",""],["id","datetime","presentation","date",3,"preferWheel","ionChange"],[2,"width","90%","margin","28px auto 0 auto"],[4,"ngFor","ngForOf"],[3,"category","isChecklist","subcategories","subcategorySelected"]],template:function(t,n){1&t&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),e.NdJ("click",function(){return n.modalCtrl.dismiss()}),e._uU(4,"Cancel"),e.qZA()(),e.TgZ(5,"ion-title"),e._uU(6,"Add Transaction"),e.qZA(),e.TgZ(7,"ion-buttons",3)(8,"ion-button",2),e.NdJ("click",function(){return n.add()}),e._uU(9,"Add"),e.qZA()()()(),e.TgZ(10,"ion-content")(11,"ion-card")(12,"ion-card-content")(13,"ion-list")(14,"ion-item")(15,"ion-label"),e._uU(16,"Date"),e.qZA(),e._UZ(17,"ion-datetime-button",4),e.qZA(),e.TgZ(18,"ion-item")(19,"ion-label"),e._uU(20,"Amount"),e.qZA(),e.TgZ(21,"input",5),e.NdJ("ngModelChange",function(r){return n.newTransaction.amount=r}),e.qZA()(),e.TgZ(22,"ion-item")(23,"ion-label"),e._uU(24,"Transaction"),e.qZA(),e.TgZ(25,"ion-input",6),e.NdJ("ngModelChange",function(r){return n.newTransaction.name=r}),e.qZA()(),e.TgZ(26,"ion-item")(27,"ion-label"),e._uU(28,"Merchant"),e.qZA(),e.TgZ(29,"ion-input",6),e.NdJ("ngModelChange",function(r){return n.newTransaction.merchant_name=r}),e.qZA()()(),e.TgZ(30,"ion-modal",7),e.YNc(31,H,1,1,"ng-template"),e.qZA()()(),e.TgZ(32,"ion-card")(33,"ion-card-content")(34,"ion-list",8)(35,"ion-item",9)(36,"ion-label"),e._uU(37,"Budget Category"),e.qZA(),e._UZ(38,"br"),e.YNc(39,K,2,1,"p",10),e.qZA()()()(),e.TgZ(40,"ion-modal",11,12),e.YNc(42,W,10,1,"ng-template"),e.qZA()()),2&t&&(e.xp6(21),e.Q6J("ngModel",n.newTransaction.amount)("options",e.DdM(7,X)),e.xp6(4),e.Q6J("ngModel",n.newTransaction.name),e.xp6(4),e.Q6J("ngModel",n.newTransaction.merchant_name),e.xp6(1),e.Q6J("keepContentsMounted",!0),e.xp6(9),e.Q6J("ngIf",n.newTransaction.subcategoryId),e.xp6(1),e.Q6J("presentingElement",n.presentingElement))},dependencies:[p.sg,p.O5,m.Fj,m.JJ,m.On,l.YG,l.Sm,l.PM,l.FN,l.W2,l.x4,l.Mj,l.Gu,l.pK,l.Ie,l.Q$,l.q_,l.wd,l.sr,l.ki,l.QI,l.j9,O.xv,k.m],styles:["#segment[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}#segment[_ngcontent-%COMP%]   ion-segment[_ngcontent-%COMP%]{width:90%;margin-top:25px}ion-toolbar[_ngcontent-%COMP%]   ion-title[_ngcontent-%COMP%]{color:#fff}ion-toolbar[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{color:#fff}ion-input[_ngcontent-%COMP%]{text-align:end}ion-datetime-button[_ngcontent-%COMP%]::part(native){background:#fff;padding-right:5px}"]}),i})();class F{constructor(){this.map=new Map}get(c){return this.map.get(this.transformKey(c))}set(c,t){this.map.set(this.transformKey(c),t)}has(c){return this.map.has(this.transformKey(c))}delete(c){return this.map.delete(this.transformKey(c))}transformKey(c){return JSON.stringify(c)}}var I=d(7195),te=d(7616),U=d(610),ne=d(2481);let R=(()=>{class i extends S.q{constructor(t){super(f.hc),this.cryptoService=t}get(t,n){var o=()=>super._get,r=this;return(0,u.Z)(function*(){let a=yield o().call(r,i.makeCollectionRef(t),n);return a=r.convertTimestampToDate(a),a=yield r.prepareTransactionForClient(a),a})()}getAll(){var t=()=>super._getAll,n=this;return(0,u.Z)(function*(){const o=yield t().call(n);if(o.docs){o.docs=o.docs.map(r=>n.convertTimestampToDate(r));for(let r=0;r<o.docs.length;r++)o.docs[r]=yield n.prepareTransactionForClient(o.docs[r])}return o})()}getAllFromParent(t){var n=()=>super._getAllFromParent,o=this;return(0,u.Z)(function*(){const r=yield n().call(o,i.makeCollectionRef(t));if(r.docs){r.docs=r.docs.map(a=>o.convertTimestampToDate(a));for(let a=0;a<r.docs.length;a++)r.docs[a]=yield o.prepareTransactionForClient(r.docs[a])}return r})()}getByQuery(t){var n=()=>super._getByQuery,o=this;return(0,u.Z)(function*(){const r=yield n().call(o,t);if(r.docs){r.docs=r.docs.map(a=>o.convertTimestampToDate(a));for(let a=0;a<r.docs.length;a++)r.docs[a]=yield o.prepareTransactionForClient(r.docs[a])}return r})()}add(t,n,o){var r=()=>super._add,a=this;return(0,u.Z)(function*(){const s=yield a.prepareTransactionForFirestore(n);return s&&r().call(a,i.makeCollectionRef(t),s,o)})()}update(t,n,o){var r=()=>super._update,a=this;return(0,u.Z)(function*(){const s=yield a.prepareTransactionForFirestore(o);return!!s&&r().call(a,i.makeCollectionRef(t),n,s)})()}delete(t,n,o=!1){var r=()=>super._delete,a=this;return(0,u.Z)(function*(){return r().call(a,i.makeCollectionRef(t),n,o)})()}static makeCollectionRef(t){return(0,g.hJ)((0,g.ad)(),f.YP,t,f.hc)}prepareTransactionForFirestore(t){var n=this;return(0,u.Z)(function*(){if(!t)return t;let o=structuredClone(t);o[b.O]=!0;let r={};U.s4.forEach(s=>{r[s]=t[s],delete o[s]});const a=yield n.cryptoService.encryptObject(r);return o.encrypted_string=a,o})()}prepareTransactionForClient(t){var n=this;return(0,u.Z)(function*(){if(!t)return t;let o=structuredClone(t);const r=o.encrypted_string;delete o.encrypted_string;const a=yield n.cryptoService.decryptObject(r);return U.s4.forEach(s=>{o[s]=a[s]}),o})()}convertTimestampToDate(t){return t?(t.date=t.date.toDate(),t):t}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(ne.$))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var re=d(3990);let ie=(()=>{class i{constructor(t,n,o,r){this.plaidService=t,this.transactionRepository=n,this.userRepository=o,this.transactionPublisher=r,this.transactionPublisher.subscribe(this)}getTransactions(t,n=!0,o=null,r=null){var a=this;return(0,u.Z)(function*(){const s=a.userRepository.getCurrentUserId();if(!s)throw new Error("User is not logged in");let h=[];const _=function oe(i,c,t,n,o=null){let r=[];return c||r.push((0,g.ar)("pending","==",!1)),t&&r.push((0,g.ar)("date",">=",t)),n&&r.push((0,g.ar)("date","<=",n)),o&&r.push((0,g.ar)("subcategoryId","==",o)),(0,g.IO)(R.makeCollectionRef(i),(0,g.xD)(...r))}(s,t,o,r);return h=(yield a.transactionRepository.getByQuery(_)).docs,n&&a.plaidService.syncPlaidTransactions(),h})()}onTransactionEvent(t){var n=this;return(0,u.Z)(function*(){t.addedTransactions.forEach(function(){var o=(0,u.Z)(function*(r){n.transactionRepository.add(n.userRepository.getCurrentUserId(),r,r.id)});return function(r){return o.apply(this,arguments)}}()),t.removedTransactions.forEach(function(){var o=(0,u.Z)(function*(r){n.transactionRepository.delete(n.userRepository.getCurrentUserId(),r.id,!0)});return function(r){return o.apply(this,arguments)}}()),t.modifiedTransactions.forEach(function(){var o=(0,u.Z)(function*(r){n.transactionRepository.update(n.userRepository.getCurrentUserId(),r.id,r)});return function(r){return o.apply(this,arguments)}}())})()}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(re.O),e.LFG(R),e.LFG(I.E),e.LFG(v.u))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var ae=d(3076);let se=(()=>{class i{constructor(){this.requestDateChange=new e.vpe,this.addTransactionButtonClicked=new e.vpe,this.refreshButtonClicked=new e.vpe}ngOnInit(){}addTransaction(){var t=this;return(0,u.Z)(function*(){t.addTransactionButtonClicked.emit()})()}refresh(){this.refreshButtonClicked.emit()}dateClicked(){this.requestDateChange.emit()}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-header"]],inputs:{chosenMonth:"chosenMonth",chosenYear:"chosenYear"},outputs:{requestDateChange:"requestDateChange",addTransactionButtonClicked:"addTransactionButtonClicked",refreshButtonClicked:"refreshButtonClicked"},decls:14,vars:2,consts:[["id","top-toolbar","color","primary"],["id","month-picker",3,"click"],[1,"month"],[1,"year"],["name","chevron-down","slot","icon-only"],["slot","end"],[3,"click"],["name","refresh","slot","icon-only"],["name","add","slot","icon-only"]],template:function(t,n){1&t&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"div",1),e.NdJ("click",function(){return n.dateClicked()}),e.TgZ(3,"span",2),e._uU(4),e.qZA(),e.TgZ(5,"span",3),e._uU(6),e.qZA(),e.TgZ(7,"span"),e._UZ(8,"ion-icon",4),e.qZA()(),e.TgZ(9,"ion-buttons",5)(10,"ion-button",6),e.NdJ("click",function(){return n.refresh()}),e._UZ(11,"ion-icon",7),e.qZA(),e.TgZ(12,"ion-button",6),e.NdJ("click",function(){return n.addTransaction()}),e._UZ(13,"ion-icon",8),e.qZA()()()()),2&t&&(e.xp6(4),e.Oqu(n.chosenMonth),e.xp6(2),e.Oqu(n.chosenYear))},dependencies:[l.YG,l.Sm,l.Gu,l.gu,l.sr],styles:["#top-toolbar[_ngcontent-%COMP%]{height:135px}#top-toolbar[_ngcontent-%COMP%]   #month-picker[_ngcontent-%COMP%]{margin:15px}#top-toolbar[_ngcontent-%COMP%]   #month-picker[_ngcontent-%COMP%]   .month[_ngcontent-%COMP%]{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:40px;color:var(--ion-color-primary-contrast)}#top-toolbar[_ngcontent-%COMP%]   #month-picker[_ngcontent-%COMP%]   .year[_ngcontent-%COMP%]{font-size:30px;color:var(--ion-color-primary-contrast);padding-left:10px;font-weight:300}#top-toolbar[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:var(--ion-color-primary-contrast)}#bottom-toolbar[_ngcontent-%COMP%]   ion-segment[_ngcontent-%COMP%]{width:90%}"]}),i})();const ce=function(){return[]};function le(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"ion-item",16)(1,"app-category",17),e.NdJ("addNewSubEvent",function(){const r=e.CHM(t).$implicit,a=e.oxw();return e.KtG(a.addNewSub(r))})("requestSaveOfSubs",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.saveAllSubs())})("subcategorySelected",function(o){e.CHM(t);const r=e.oxw();return e.KtG(r.subcategorySelected(o))}),e.qZA(),e._UZ(2,"ion-reorder",18),e.qZA()}if(2&i){const t=c.$implicit,n=e.oxw();e.MGl("id","",t.id,"-ion-item"),e.xp6(1),e.Q6J("category",t)("subcategories",t.subcategories||e.DdM(6,ce))("chosenDate",n.chosenDate)("isUserReorderingCategories",n.isUserReorderingCategories),e.xp6(1),e.MGl("id","",t.id,"-reorder")}}function ue(i,c){1&i&&(e.TgZ(0,"span"),e._UZ(1,"ion-icon",23),e.qZA())}function de(i,c){if(1&i&&(e.TgZ(0,"span",24),e._uU(1),e.qZA()),2&i){const t=e.oxw(2);e.xp6(1),e.hij(" ",t.unsortedTransactions.length," ")}}function ge(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"div",19),e.NdJ("click",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.revealUnsortedTransactions())}),e.TgZ(1,"div",20),e.YNc(2,ue,2,0,"span",21),e.YNc(3,de,2,1,"span",22),e.qZA()()}if(2&i){const t=e.oxw();e.xp6(2),e.Q6J("ngIf",t.isCardContainerVisible),e.xp6(1),e.Q6J("ngIf",!t.isCardContainerVisible)}}function pe(i,c){if(1&i){const t=e.EpF();e.TgZ(0,"div",25),e.NdJ("click",function(){const r=e.CHM(t).$implicit,a=e.oxw();return e.KtG(a.openTransactionSorter(r))}),e.TgZ(1,"div",26),e._uU(2),e.ALo(3,"date"),e.qZA(),e.TgZ(4,"span",27),e._uU(5),e.ALo(6,"currency"),e.qZA(),e.TgZ(7,"div",28),e._uU(8),e.qZA()()}if(2&i){const t=c.$implicit;e.xp6(2),e.Oqu(e.xi3(3,3,t.date,"MMM. d")),e.xp6(3),e.Oqu(e.lcZ(6,6,-1*t.amount)),e.xp6(3),e.Oqu(t.merchant_name||t.name)}}const me=function(i){return{"slide-up":i}},he=[{path:"",component:(()=>{class i{constructor(t,n,o,r,a,s,h,_){this.userRepository=t,this.pickerCtrl=n,this.modalCtrl=o,this.categoryRepository=r,this.subcategoryRepository=a,this.transactionService=s,this.transactionPublisher=h,this.userService=_,this.unsortedTransactions=[],this.institutionName="",this.isCardContainerVisible=!1,this.plannedIncome=0,this.leftToBudget=0,this.remainingToSpend=0,this.isUserReorderingCategories=!1,this.chosenDateNumber=y(),this.transactions=new F,this.categories=new F}ngOnInit(){var t=this;return(0,u.Z)(function*(){t.transactionPublisher.subscribe(t),t.userSubscription=t.userRepository.currentFirestoreUser.subscribe(n=>{t.user=n,n&&t.loadMonthData()})})()}ngOnDestroy(){var t=this;return(0,u.Z)(function*(){var n;t.transactionPublisher.unsubscribe(t),null===(n=t.userSubscription)||void 0===n||n.unsubscribe()})()}get chosenDate(){return this._chosenDate}get chosenDateNumber(){return this._chosenDateNumber}set chosenDateNumber(t){this._chosenDateNumber=t,this._chosenDate=function G(i){return i||(i=new Date),i instanceof Date||(i=new Date(i.year,i.month,1)),{month:i.toLocaleString("default",{month:"long"}),year:i.getFullYear().toString()}}(t)}get startAndEndOfMonth(){return function j(i){return i||(i=new Date),i instanceof Date||(i=new Date(i.year,i.month,1)),{start:new Date(i.getFullYear(),i.getMonth(),1),end:new Date(i.getFullYear(),i.getMonth()+1,0,23,59,59,999)}}(this.chosenDateNumber)}get transactionsLength(){const t=this.transactions.get(this.chosenDateNumber);return t?t.length:0}get transactionsArray(){return this.transactions.get(this.chosenDateNumber)||[]}get categoriesLength(){const t=this.categories.get(this.chosenDateNumber);return t?t.length:0}get categoriesArray(){return this.categories.get(this.chosenDateNumber)||[]}loadMonthData(){var t=this;return(0,u.Z)(function*(){const n=[];n.push(t.grabTransactionsForSelectedMonth()),n.push(t.grabUserCategoriesForSelectedMonth()),Promise.all(n).then(o=>{const r=o[0],a=o[1];r.sort(P),a.sort(w),t.transactions.set(t.chosenDateNumber,r),t.unsortedTransactions=r.filter(s=>!s.subcategoryId||""==s.subcategoryId),t.categories.set(t.chosenDateNumber,a),t.calculatePlannedAndBudget(a)})})()}grabUserCategoriesForSelectedMonth(){var t=this;return(0,u.Z)(function*(){if(!t.user)return[];const n=yield t.categoryRepository.getAllFromParent(t.user.id),o=n.docs,r=[];for(let a=0;a<o.length;a++)r.push(t.subcategoryRepository.getByQuery(V(t.user.id,n.docs[a].id,t.chosenDateNumber)).then(s=>{o[a].subcategories=0==s.size?[]:s.docs,o[a].subcategories.sort(w)}));return yield Promise.all(r),o})()}grabTransactionsForSelectedMonth(){var t=this;return(0,u.Z)(function*(){if(!t.user)return[];if(!t.userService.isPremium)return[];const{start:n,end:o}=t.startAndEndOfMonth;return t.transactionService.getTransactions(!0,!0,n,o)})()}updateSubcategoryActualAmounts(){const t=this.transactions.get(this.chosenDateNumber);if(!t)return!1;const n=this.categories.get(this.chosenDateNumber);if(!n)return!1;let o=new Map;for(let r=0;r<t.length;r++){const a=t[r];o.has(a.subcategoryId)?o.set(a.subcategoryId,o.get(a.subcategoryId)+a.amount):o.set(a.subcategoryId,a.amount)}for(let r=0;r<n.length;r++)for(let a=0;a<n[r].subcategories.length;a++){const s=n[r].subcategories[a];s.actual_amount=o.has(s.id)?o.get(s.id):0}return!0}calculatePlannedAndBudget(t){this.updateSubcategoryActualAmounts();let n=0,o=0,r=0;for(let a=0;a<t.length;a++)if("income"==t[a].id)for(let s=0;s<t[a].subcategories.length;s++)n+=t[a].subcategories[s].planned_amount;else for(let s=0;s<t[a].subcategories.length;s++)o+=t[a].subcategories[s].planned_amount,r+=t[a].subcategories[s].actual_amount;this.plannedIncome=n,this.leftToBudget=-1*this.plannedIncome-o,this.leftToBudget<=-0&&this.leftToBudget>-.01&&(this.leftToBudget=0),this.remainingToSpend=-1*this.plannedIncome-r}addNewSub(t){const n={text:"",index:t.subcategories.length,planned_amount:0,date:{month:this.chosenDateNumber.month,year:this.chosenDateNumber.year},actual_amount:0,id:(0,M.D)(),isEditing:!0};t.subcategories.push(n)}saveAllSubs(){var t=this;return(0,u.Z)(function*(){if(0==t.categoriesLength||!t.user)return;const n=[];for(let o=0;o<t.categoriesLength;o++){let r=t.categoriesArray[o];if(r&&r.subcategories)for(let a=0;a<r.subcategories.length;a++){let s=r.subcategories[a];if(s&&s.isEditing){if(0==s.text.length){r.subcategories.splice(a,1);continue}s.isEditing=!1,n.push(t.subcategoryRepository.add(t.user.id,t.categoriesArray[o].id,t.categoriesArray[o].subcategories[a],t.categoriesArray[o].subcategories[a].id))}}}})()}addTransaction(){var t=this;return(0,u.Z)(function*(){(yield t.modalCtrl.create({component:ee,componentProps:{categories:t.categoriesArray,user:t.user}})).present()})()}requestDateChange(){var t=this;return(0,u.Z)(function*(){let n=[];for(let r=0;r<T.length;r++)if(T[r].text==t.chosenDate.month){n[0]=r;break}for(let r=0;r<x.length;r++)x[r].text==t.chosenDate.year&&(n[1]=r);const o=yield t.pickerCtrl.create({columns:[{name:"month",options:T},{name:"year",options:x}],buttons:[{text:"Cancel",role:"cancel"},{text:"Confirm",handler:r=>{t.chosenDateNumber={month:r.month.value,year:r.year.value},t.loadMonthData()}}]});o.columns[0].selectedIndex=n[0],o.columns[1].selectedIndex=n[1],yield o.present()})()}revealUnsortedTransactions(){this.isCardContainerVisible=!this.isCardContainerVisible}openTransactionSorter(t){var n=this;return(0,u.Z)(function*(){(yield n.modalCtrl.create({component:J.m,componentProps:{transaction:t,user:n.user,categories:n.categoriesArray},initialBreakpoint:.6,breakpoints:[0,.6,.8,1]})).present()})()}subcategorySelected(t){var n=this;return(0,u.Z)(function*(){const o=yield n.modalCtrl.create({component:Q,componentProps:{subcategory:t.sub,category:t.cat,transactions:n.transactionsArray,user:n.user},initialBreakpoint:.6,breakpoints:[0,.6,.8,1]});o.onDidDismiss().then(()=>{n.calculatePlannedAndBudget(n.categoriesArray)}),o.present()})()}formatCurrency(t,n="USD",o="en-US"){return new Intl.NumberFormat(o,{style:"currency",currency:n}).format(t)}onTransactionEvent(t){var n=this;return(0,u.Z)(function*(){const{addedTransactions:o,removedTransactions:r,modifiedTransactions:a}=t,s=[];s.push(n.handleAddedTransactions(o)),s.push(n.handleRemovedTransactions(r)),s.push(n.handleModifiedTransactions(a)),Promise.all(s).then(h=>{n.calculatePlannedAndBudget(n.categoriesArray),n.unsortedTransactions=n.transactionsArray.filter(_=>!_.subcategoryId||""==_.subcategoryId)})})()}handleAddedTransactions(t){var n=this;return(0,u.Z)(function*(){if(t&&0!=t.length)for(let o=0;o<t.length;o++){const r=t[o],a=y(r.date);n.transactions.has(a)&&n.transactions.get(a).push(r)}})()}handleRemovedTransactions(t){var n=this;return(0,u.Z)(function*(){for(let o=0;o<t.length;o++){const r=t[o],a=y(r.date);if(n.transactions.has(a)){const s=n.transactions.get(a);s.splice(s.indexOf(r),1)}}})()}handleModifiedTransactions(t){var n=this;return(0,u.Z)(function*(){for(let o=0;o<t.length;o++){const r=t[o],a=y(r.date);if(n.transactions.has(a)){const s=n.transactions.get(a),h=s.indexOf(r);h>=0&&(s[h]=r)}}})()}toggleReorder(){this.isUserReorderingCategories?this.hideReorderButton():this.showReorderButton()}showReorderButton(){const t=document.getElementsByClassName("reorder-button");if(0!=t.length){this.isUserReorderingCategories=!0;for(let n=0;n<t.length;n++){const o=t[n],r=document.getElementById(o.id.replace("-reorder","")+"-card");r&&(o.style.left=r.clientWidth-50+"px",o.style.opacity="1")}}}hideReorderButton(){const t=document.getElementsByClassName("reorder-button");if(0!=t.length){for(let n=0;n<t.length;n++)t[n].style.opacity="0";this.isUserReorderingCategories=!1}}doneReorderItems(t){var n=this;return(0,u.Z)(function*(){if(null==t.detail.from||null==t.detail.to)return void t.detail.complete();if(t.detail.from==t.detail.to)return void t.detail.complete();const o=new Map;n.categoriesArray.forEach((a,s)=>{o.set(a.id,s)});const r=n.categoriesArray[t.detail.from];n.categoriesArray.splice(t.detail.from,1),n.categoriesArray.splice(t.detail.to,0,r),n.categoriesArray.forEach((a,s)=>{o.get(a.id)!=s&&n.categoryRepository.update(n.user.id,a.id,{index:s})}),t.detail.complete()})()}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(I.E),e.Y36(l.up),e.Y36(l.IN),e.Y36(te.r),e.Y36(C),e.Y36(ie),e.Y36(v.u),e.Y36(ae.K))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-tab1"]],decls:24,vars:17,consts:[[3,"chosenMonth","chosenYear","requestDateChange","addTransactionButtonClicked","refreshButtonClicked"],[1,"ion-content-scroll-host",3,"fullscreen"],["id","budget-remaining-container"],[3,"ngClass"],["id","planned-income-container"],["id","planned-income"],[1,"title"],["id","options-container"],[1,"option",3,"click"],[1,"svg",3,"src"],[3,"disabled","ionItemReorder"],["class","category-item-container","lines","none",3,"id",4,"ngFor","ngForOf"],["id","app-draggable-container",3,"click",4,"ngIf"],[1,"card-container",3,"ngClass"],["id","scrollable-container"],["id","card",3,"click",4,"ngFor","ngForOf"],["lines","none",1,"category-item-container",3,"id"],[2,"width","100%",3,"category","subcategories","chosenDate","isUserReorderingCategories","addNewSubEvent","requestSaveOfSubs","subcategorySelected"],[1,"reorder-button",3,"id"],["id","app-draggable-container",3,"click"],["id","transaction-counter"],[4,"ngIf"],["class","counter-number",4,"ngIf"],["name","close",2,"color","white","font-size","30px"],[1,"counter-number"],["id","card",3,"click"],["id","date"],["id","amount"],["id","name"]],template:function(t,n){1&t&&(e.TgZ(0,"app-header",0),e.NdJ("requestDateChange",function(){return n.requestDateChange()})("addTransactionButtonClicked",function(){return n.addTransaction()})("refreshButtonClicked",function(){return n.loadMonthData()}),e.qZA(),e.TgZ(1,"ion-content",1)(2,"div",2)(3,"span")(4,"span",3),e._uU(5),e.qZA(),e._uU(6),e.qZA()(),e.TgZ(7,"div",4)(8,"span",5)(9,"span",6),e._uU(10,"Remaining to Spend"),e.qZA(),e.TgZ(11,"strong"),e._uU(12),e.ALo(13,"currency"),e.qZA()()(),e.TgZ(14,"div",7)(15,"div",8),e.NdJ("click",function(){return n.toggleReorder()}),e._UZ(16,"img",9),e.qZA()(),e.TgZ(17,"div")(18,"ion-reorder-group",10),e.NdJ("ionItemReorder",function(r){return n.doneReorderItems(r)}),e.YNc(19,le,3,7,"ion-item",11),e.qZA()(),e.YNc(20,ge,4,2,"div",12),e.TgZ(21,"div",13)(22,"div",14),e.YNc(23,pe,9,8,"div",15),e.qZA()()()),2&t&&(e.Q6J("chosenMonth",n.chosenDate.month)("chosenYear",n.chosenDate.year),e.xp6(1),e.Q6J("fullscreen",!0),e.xp6(3),e.Q6J("ngClass",n.leftToBudget<0?"over-budget":"on-budget"),e.xp6(1),e.hij(" ",n.formatCurrency(n.leftToBudget)," "),e.xp6(1),e.hij(" ",n.leftToBudget<0?"over budget":"left to budget"," "),e.xp6(6),e.Oqu(e.lcZ(13,13,n.remainingToSpend)),e.xp6(4),e.s9C("src",n.isUserReorderingCategories?"assets/svg/sort-active.svg":"assets/svg/sort-inactive.svg",e.LSH),e.xp6(2),e.Q6J("disabled",!n.isUserReorderingCategories),e.xp6(1),e.Q6J("ngForOf",n.categoriesArray),e.xp6(1),e.Q6J("ngIf",n.unsortedTransactions.length>0),e.xp6(1),e.Q6J("ngClass",e.VKq(15,me,n.isCardContainerVisible)),e.xp6(2),e.Q6J("ngForOf",n.unsortedTransactions))},dependencies:[l.W2,l.gu,l.Ie,l.Nh,l.oz,p.mk,p.sg,p.O5,se,k.m,p.H9,p.uU],styles:["#budget-remaining-container{width:100%;height:44px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 2px 10px #0000001a;position:sticky;top:0;background-color:#fff;z-index:100}#budget-remaining-container .over-budget{font-weight:700;color:red}#budget-remaining-container .on-budget{font-weight:700;color:#000}.category-reorder-container,.category-item-container{--width: 100%;--background: transparent}#planned-income-container{display:block;margin:auto auto 10px;width:92%;box-shadow:0 2px 10px #0000001a}#planned-income-container #planned-income{background-color:#fff;margin-top:10px;width:100%;height:120px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:23px;border-radius:8px}#planned-income-container #planned-income .title{color:#464646;font-size:18px}#app-draggable-container{position:fixed;bottom:18px;left:50%;z-index:99;transform:translate(-50%)}#app-draggable-container #transaction-counter{display:flex;align-items:center;justify-content:center;height:50px;width:50px;border-radius:50%;background-color:var(--ion-color-primary)}#app-draggable-container .counter-number{font-size:24px;color:#fff;font-weight:500}ion-refresher.refresher-active{z-index:1}.card-container{position:fixed;bottom:70px;left:0;width:100%;height:100px;background-color:transparent;transition:transform .3s ease-out,opacity .1s ease-out;transform:translateY(200px);overflow-x:auto;white-space:nowrap;opacity:0;z-index:99}#scrollable-container{display:flex;flex-direction:row;justify-content:space-between;align-items:center;z-index:98;width:-moz-fit-content;width:fit-content;margin:0 auto}#card{flex:0 0 auto;height:90px;width:100px;background:white;text-align:center;border:1px solid var(--ion-color-primary);box-shadow:0 2px 10px #0000001a;border-radius:5px;margin:0 5px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}#card #date{font-size:12px}#card #name{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:start;font-size:12px;padding-left:5px;padding-right:5px}#card #amount{font-weight:700;font-size:16px}.card-container.slide-up{transform:translateY(0);opacity:1}#options-container{display:flex;flex-direction:row;justify-content:flex-end;align-items:center;width:92%;margin:0 auto;padding:0 10px}ion-reorder{position:absolute;z-index:99;opacity:0}\n"],encapsulation:2}),i})()}];let fe=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[A.Bz.forChild(he),A.Bz]}),i})();var _e=d(822);let ye=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[l.Pc,p.ez,m.u5,q.e,fe,_e.K]}),i})()}}]);