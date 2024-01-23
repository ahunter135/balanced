"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8204],{8204:(C,p,a)=>{a.r(p),a.d(p,{Tab2PageModule:()=>M});var i=a(5548),d=a(6814),g=a(95),f=a(3554),T=a(2607),u=a(5861),l=a(6863),h=a(98),t=a(6689),v=a(1269),Z=a(7195),P=a(7087);function b(e,s){if(1&e&&(t.TgZ(0,"ion-select-option",7),t._uU(1),t.qZA()),2&e){const n=s.$implicit;t.Q6J("value",n),t.xp6(1),t.Oqu(n.name)}}function I(e,s){if(1&e){const n=t.EpF();t.TgZ(0,"ion-card",2),t.NdJ("click",function(){const c=t.CHM(n).index,m=t.oxw();return t.KtG(m.openTransactionSorter(c))}),t.TgZ(1,"ion-card-header")(2,"ion-card-subtitle"),t._uU(3),t.qZA()(),t.TgZ(4,"ion-card-content"),t._uU(5),t.ALo(6,"currency"),t._UZ(7,"br"),t._uU(8),t.qZA()()}if(2&e){const n=s.$implicit;t.xp6(3),t.hij(" ",n.name," "),t.xp6(2),t.hij(" ",t.lcZ(6,3,n.amount),""),t.xp6(3),t.hij("",n.date," ")}}const y=[{path:"",component:(()=>{class e{constructor(n,o,r,c){this.http=n,this.modalCtrl=o,this.userRepository=r,this.plaidService=c,this.user={},this.transactions=[],this.institutions=[],this.institutionName=""}ngOnInit(){this.getInstitutions()}retrieveTransactions(){var n=this;return(0,u.Z)(function*(){n.http.post("https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getTransactionData",{accessToken:n.selectedInstitute.access_token}).subscribe(o=>{console.log(o),n.transactions=o.added,n.sortTransactions(),n.user.last_transaction_retrieval=(new Date).toISOString(),(0,l.r7)((0,l.JU)((0,l.ad)(),"users/",n.userRepository.getCurrentUserId(),"linked_accounts",n.selectedInstitute.id),{last_transaction_retrieval:(new Date).toISOString()})})})()}sortTransactions(){var n=this;return(0,u.Z)(function*(){n.transactions.sort((o,r)=>{const c=new Date(o.date);return new Date(r.date).getTime()-c.getTime()})})()}openTransactionSorter(n){var o=this;return(0,u.Z)(function*(){(yield o.modalCtrl.create({component:h.m,componentProps:{transaction:o.transactions[n]},initialBreakpoint:.6,breakpoints:[0,.6,.8,1]})).present()})()}link(){var n=this;return(0,u.Z)(function*(){n.plaidService.linkPlaidToUser()})()}getInstitutions(){var n=this;return(0,u.Z)(function*(){const o=yield(0,l.PL)((0,l.hJ)((0,l.ad)(),"users",n.userRepository.getCurrentUserId(),"linked_accounts"));o.empty||(o.forEach(r=>{n.institutions.push(r.data())}),n.selectedInstitute=n.institutions[0],n.selectedInstitute&&n.retrieveTransactions())})()}}return e.\u0275fac=function(n){return new(n||e)(t.Y36(v.O),t.Y36(i.IN),t.Y36(Z.E),t.Y36(P.O))},e.\u0275cmp=t.Xpm({type:e,selectors:[["app-tab2"]],decls:13,vars:5,consts:[[3,"translucent"],["slot","end"],[3,"click"],[3,"fullscreen"],["label","Institution","label-placement","floating",3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[3,"click",4,"ngFor","ngForOf"],[3,"value"]],template:function(n,o){1&n&&(t.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),t._uU(3," Tab 2 "),t.qZA(),t.TgZ(4,"ion-buttons",1)(5,"ion-button",2),t.NdJ("click",function(){return o.link()}),t._uU(6,"Link"),t.qZA()()()(),t.TgZ(7,"ion-content",3)(8,"ion-item")(9,"ion-select",4),t.NdJ("ngModelChange",function(c){return o.selectedInstitute=c}),t.YNc(10,b,2,2,"ion-select-option",5),t.qZA()(),t.TgZ(11,"ion-list"),t.YNc(12,I,9,5,"ion-card",6),t.qZA()()),2&n&&(t.Q6J("translucent",!0),t.xp6(7),t.Q6J("fullscreen",!0),t.xp6(2),t.Q6J("ngModel",o.selectedInstitute),t.xp6(1),t.Q6J("ngForOf",o.institutions),t.xp6(2),t.Q6J("ngForOf",o.transactions))},dependencies:[i.YG,i.Sm,i.PM,i.FN,i.Zi,i.tO,i.W2,i.Gu,i.Ie,i.q_,i.t9,i.n0,i.wd,i.sr,i.QI,d.sg,g.JJ,g.On,d.H9]}),e})()}];let J=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[T.Bz.forChild(y),T.Bz]}),e})(),M=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[i.Pc,d.ez,g.u5,f.e,J]}),e})()}}]);