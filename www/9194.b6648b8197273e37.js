"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9194],{9194:(tn,h,a)=>{a.r(h),a.d(h,{Tab3PageModule:()=>H});var c=a(5548),p=a(6814),Z=a(95),v=a(3554),m=a(4798),l=a(5861),A=a(7826),n=a(6689),y=a(8452),T=a(1914),k=a(1743);function b(i,r){if(1&i&&(n.TgZ(0,"ion-card-header")(1,"ion-card-title"),n._uU(2,"Linked Accounts"),n.qZA(),n.TgZ(3,"ion-card-subtitle"),n._uU(4),n.qZA()()),2&i){const t=n.oxw();n.xp6(4),n.hij(" ",t.linkedAccounts.length," Linked Accounts ")}}function C(i,r){1&i&&n._UZ(0,"ion-icon",14)}function P(i,r){1&i&&n._UZ(0,"ion-icon",15)}function x(i,r){1&i&&n._UZ(0,"ion-icon",16)}function w(i,r){1&i&&(n.TgZ(0,"p"),n._uU(1," Linked "),n.qZA())}function N(i,r){1&i&&(n.TgZ(0,"p"),n._uU(1," Almost Expired "),n.qZA())}function M(i,r){1&i&&(n.TgZ(0,"p"),n._uU(1," Needs Relink "),n.qZA())}function L(i,r){if(1&i){const t=n.EpF();n.TgZ(0,"ion-item-option",17),n.NdJ("click",function(){n.CHM(t);const o=n.oxw().$implicit,s=n.oxw(2);return n.KtG(s.handleLinkedAccountAction(o))}),n._uU(1," Relink "),n.qZA()}}function U(i,r){if(1&i){const t=n.EpF();n.TgZ(0,"ion-item-sliding")(1,"ion-item",7),n.NdJ("click",function(){const s=n.CHM(t).$implicit,u=n.oxw(2);return n.KtG(u.handleLinkedAccountAction(s))}),n.YNc(2,C,1,0,"ion-icon",8),n.YNc(3,P,1,0,"ion-icon",9),n.YNc(4,x,1,0,"ion-icon",10),n.TgZ(5,"ion-label")(6,"h2"),n._uU(7),n.qZA(),n.YNc(8,w,2,0,"p",3),n.YNc(9,N,2,0,"p",3),n.YNc(10,M,2,0,"p",3),n.qZA()(),n.TgZ(11,"ion-item-options",11),n.YNc(12,L,2,0,"ion-item-option",12),n.TgZ(13,"ion-item-option",13),n.NdJ("click",function(){const s=n.CHM(t).$implicit,u=n.oxw(2);return n.KtG(u.removeLinkedAccount(s))}),n._uU(14," Delete "),n.qZA()()()}if(2&i){const t=r.$implicit;n.xp6(1),n.Q6J("button",t.link_status&&"NONE"!=t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(3),n.Oqu(t.institution_name),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(2),n.Q6J("ngIf",t.link_status&&"NONE"!=t.link_status.required_action)}}function O(i,r){if(1&i&&(n.TgZ(0,"ion-list"),n.YNc(1,U,15,9,"ion-item-sliding",6),n.qZA()),2&i){const t=n.oxw();n.xp6(1),n.Q6J("ngForOf",t.linkedAccounts)}}let I=(()=>{class i{constructor(t,e,o,s){this.modalController=t,this.linkedAccountsRepository=e,this.plaidService=o,this.finicityService=s,this.linkedAccounts=[],this.loading=!0}ngOnInit(){var t=this;if(!this.user)throw new Error("ViewLinkedAccountsComponent: user is undefined");this.linkedAccountsRepository.getAllFromParent(this.user.id).then(function(){var e=(0,l.Z)(function*(o){t.loading=!1,t.linkedAccounts=o.docs,console.log(t.linkedAccounts);for(let s=0;s<t.linkedAccounts.length;s++)if(t.linkedAccounts[s].isFinicity){let u=yield t.finicityService.getInstitutionById(t.linkedAccounts[s].institutionId);t.linkedAccounts[s].institution_name=u.name}});return function(o){return e.apply(this,arguments)}}())}removeLinkedAccount(t){var e=this;return(0,l.Z)(function*(){e.plaidService.removePlaidLinkedAccount(t),e.linkedAccounts=e.linkedAccounts.filter(o=>o.id!==t.id)})()}handleLinkedAccountAction(t){var e=this;return(0,l.Z)(function*(){if(t.link_status)switch(t.link_status.required_action){case"RELINK":case"NOTIFY_PENDING_EXPIRATION":e.relinkLinkedAccount(t);break;case"NONE":break;default:throw new Error("ViewLinkedAccountsComponent: unknown required_action")}})()}link(){var t=this;return(0,l.Z)(function*(){t.modalController.dismiss(1)})()}onRelinkSuccessCallback(t){var e=this;return(0,l.Z)(function*(){const o=e.linkedAccounts.find(s=>s.id===t);o&&o.link_status&&(o.link_status={required_action:"NONE",last_webhook:o.link_status.last_webhook})})()}relinkLinkedAccount(t){var e=this;return(0,l.Z)(function*(){e.plaidService.relinkPlaidLinkedAccount(t,e.onRelinkSuccessCallback.bind(e))})()}}return i.\u0275fac=function(t){return new(t||i)(n.Y36(c.IN),n.Y36(y.q),n.Y36(T.O),n.Y36(k.v))},i.\u0275cmp=n.Xpm({type:i,selectors:[["app-view-linked-accounts"]],decls:15,vars:2,consts:[["color","primary"],["slot","start"],[3,"click"],[4,"ngIf"],["color","primary","fill","clear",3,"click"],["name","add"],[4,"ngFor","ngForOf"],["lines","full",3,"button","click"],["name","checkmark-circle-outline","style","color: var(--ion-color-success)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-warning)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-danger)","slot","start",4,"ngIf"],["side","end"],["color","primary",3,"click",4,"ngIf"],["color","danger",3,"click"],["name","checkmark-circle-outline","slot","start",2,"color","var(--ion-color-success)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-warning)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-danger)"],["color","primary",3,"click"]],template:function(t,e){1&t&&(n.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),n.NdJ("click",function(){return e.modalController.dismiss()}),n._uU(4,"Close"),n.qZA()(),n.TgZ(5,"ion-title"),n._uU(6,"Linked Accounts"),n.qZA()()(),n.TgZ(7,"ion-content")(8,"ion-card"),n.YNc(9,b,5,1,"ion-card-header",3),n.TgZ(10,"ion-card-content"),n.YNc(11,O,2,1,"ion-list",3),n.qZA(),n.TgZ(12,"ion-button",4),n.NdJ("click",function(){return e.link()}),n._UZ(13,"ion-icon",5),n._uU(14," Link Account "),n.qZA()()()),2&t&&(n.xp6(9),n.Q6J("ngIf",!e.loading),n.xp6(2),n.Q6J("ngIf",!e.loading&&e.linkedAccounts.length>0))},dependencies:[p.sg,p.O5,c.YG,c.Sm,c.PM,c.FN,c.Zi,c.tO,c.Dq,c.W2,c.Gu,c.gu,c.Ie,c.u8,c.IK,c.td,c.Q$,c.q_,c.wd,c.sr]}),i})();var f=a(6863);let J=(()=>{class i{constructor(t){this.modalCtrl=t,this.flags={plaid:{enabled:!1},finicity:{enabled:!1}}}ngOnInit(){(0,f.PL)((0,f.hJ)((0,f.ad)(),"flags")).then(t=>{console.log(t.docs),t.docs.forEach(e=>{this.flags[e.id]={enabled:e.data().enabled},console.log(this.flags)})})}}return i.\u0275fac=function(t){return new(t||i)(n.Y36(c.IN))},i.\u0275cmp=n.Xpm({type:i,selectors:[["app-account-picker"]],decls:36,vars:2,consts:[["color","primary"],["slot","start"],[3,"click"],[2,"display","flex","flex-direction","column","align-content","center","align-items","center","justify-content","center","flex-wrap","nowrap","height","100%"],[2,"text-align","center"],["lines","none"],["button","",3,"disabled","click"],["height","48","viewBox","0 0 126 48","xmlns","http://www.w3.org/2000/svg",1,"css-1sgqwt5"],["fill","#111","fill-rule","evenodd"],["d","M66.248 16.268c-1.057-.889-2.861-1.333-5.413-1.333h-5.756v17.788h4.304v-5.575h1.928c2.34 0 4.056-.515 5.148-1.546 1.23-1.155 1.849-2.693 1.849-4.613 0-1.991-.687-3.565-2.06-4.721m-5.044 6.855h-1.821V18.96h1.636c1.99 0 2.985.698 2.985 2.094 0 1.378-.934 2.068-2.8 2.068M75.673 14.934h-4.488v17.788h9.69v-4.026h-5.202zM89.668 14.934l-7.05 17.788h4.832l.924-2.586H94.5l.845 2.586h4.886l-7-17.788zm-.053 11.601l1.849-6.08 1.82 6.08z"],["d","M102.473 32.722h4.489V14.934h-4.489zM124.39 18.268a7.376 7.376 0 00-2.14-2.053c-1.355-.854-3.204-1.28-5.545-1.28h-5.914v17.787h6.918c2.5 0 4.506-.817 6.02-2.453 1.514-1.635 2.27-3.805 2.27-6.508 0-2.15-.537-3.981-1.61-5.493m-7.182 10.427h-1.927v-9.734h1.954c1.373 0 2.428.43 3.168 1.287.74.857 1.11 2.073 1.11 3.647 0 3.2-1.435 4.8-4.305 4.8M18.637 0L4.09 3.81.081 18.439l5.014 5.148L0 28.65l3.773 14.693 14.484 4.047 5.096-5.064 5.014 5.147 14.547-3.81 4.008-14.63-5.013-5.146 5.095-5.063L43.231 4.13 28.745.083l-5.094 5.063zM9.71 6.624l7.663-2.008 3.351 3.44-4.887 4.856zm16.822 1.478l3.405-3.383 7.63 2.132-6.227 6.187zM4.672 17.238l2.111-7.705 6.125 6.288-4.886 4.856zm29.547-1.243l6.227-6.189 1.986 7.74-3.404 3.384zm-15.502-.127l4.887-4.856 4.807 4.936-4.886 4.856zm-7.814 7.765l4.886-4.856 4.81 4.936-4.888 4.856zm15.503.127l4.886-4.856L36.1 23.84l-4.887 4.856zM4.57 29.927l3.406-3.385 4.807 4.937-6.225 6.186zm14.021 1.598l4.887-4.856 4.808 4.936-4.886 4.856zm15.502.128l4.887-4.856 3.351 3.439-2.11 7.705zm-24.656 8.97l6.226-6.189 4.81 4.936-3.406 3.385zm16.843-1.206l4.886-4.856 6.126 6.289-7.662 2.007z"],["xmlns","http://www.w3.org/2000/svg",0,"xmlns","xlink","http://www.w3.org/1999/xlink","width","65px","height","41px","viewBox","0 0 65 41","version","1.1"],["id","Page-1","stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],["id","Home-Page","transform","translate(-128.000000, -75.000000)","fill-rule","nonzero"],["id","Group-2","transform","translate(124.000000, 71.000000)"],["id","mc_symbol","transform","translate(4.000000, 4.000000)"],["id","Rectangle","fill","#F26522","x","23.359375","y","4.35","width","18.28125","height","32"],["d","M24.828025,20.3125 C24.828025,13.8328429 27.8281407,8.06197752 32.5,4.34314434 C29.0829927,1.62287109 24.7720496,0 20.0859875,0 C8.99282795,0 0,9.09432967 0,20.3125 C0,31.5306703 8.99282795,40.625 20.0859875,40.625 C24.7720496,40.625 29.0829927,39.0021289 32.5,36.2818557 C27.8281407,32.5621777 24.828025,26.7921571 24.828025,20.3125 Z","id","Path","fill","#E52423"],["d","M63.2108758,34.53125 L63.2108758,33.6887058 L63.36728,33.6887058 L63.36728,33.5167136 L62.96875,33.5167136 L62.96875,33.6887058 L63.1251542,33.6887058 L63.1251542,34.53125 L63.2108758,34.53125 Z M63.984375,34.53125 L63.984375,33.515625 L63.8620589,33.515625 L63.7216961,34.2144795 L63.5813333,33.515625 L63.4590172,33.515625 L63.4590172,34.53125 L63.54524,34.53125 L63.54524,33.7649049 L63.6770808,34.4256598 L63.7663114,34.4256598 L63.8981521,33.7638163 L63.8981521,34.53125 L63.984375,34.53125 Z","id","Shape","fill","#F99F1C"],["d","M65,20.3125 C65,31.5306703 56.0071721,40.625 44.9140125,40.625 C40.2279504,40.625 35.9170073,39.0021289 32.5,36.2818557 C37.1718593,32.5621777 40.171975,26.7921571 40.171975,20.3125 C40.171975,13.8328429 37.1718593,8.06197752 32.5,4.34314434 C35.9170073,1.62287109 40.2279504,0 44.9140125,0 C56.0071721,0 65,9.09432967 65,20.3125 Z","id","Path","fill","#F99F1C"],[1,"label"]],template:function(t,e){1&t&&(n.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),n.NdJ("click",function(){return e.modalCtrl.dismiss()}),n._uU(4,"Close"),n.qZA()(),n.TgZ(5,"ion-title"),n._uU(6,"Link Account"),n.qZA()()(),n.TgZ(7,"div",3)(8,"ion-card")(9,"ion-card-header")(10,"ion-card-subtitle"),n._uU(11,"Choose a Way to Sync Your Accounts"),n.qZA()(),n.TgZ(12,"ion-card-content")(13,"p",4),n._uU(14," Sometimes a users bank is not supported by every single system. So we at WiseWallets decided to support multiple sync partners so no matter what bank you have, you'll be supported! "),n.qZA(),n._UZ(15,"br"),n.TgZ(16,"ion-list",5)(17,"ion-item",6),n.NdJ("click",function(){return e.modalCtrl.dismiss(1)}),n.O4$(),n.TgZ(18,"svg",7)(19,"g",8),n._UZ(20,"path",9)(21,"path",10),n.qZA()()(),n.kcU(),n.TgZ(22,"ion-item",6),n.NdJ("click",function(){return e.modalCtrl.dismiss(2)}),n.O4$(),n.TgZ(23,"svg",11)(24,"title"),n._uU(25,"mc_symbol"),n.qZA(),n.TgZ(26,"g",12)(27,"g",13)(28,"g",14)(29,"g",15),n._UZ(30,"rect",16)(31,"path",17)(32,"path",18)(33,"path",19),n.qZA()()()()(),n.kcU(),n.TgZ(34,"span",20),n._uU(35,"Finicity"),n.qZA()()()()()()),2&t&&(n.xp6(17),n.Q6J("disabled",!e.flags.plaid.enabled),n.xp6(5),n.Q6J("disabled",!e.flags.finicity.enabled))},dependencies:[c.YG,c.Sm,c.PM,c.FN,c.Zi,c.tO,c.Gu,c.Ie,c.q_,c.wd,c.sr],styles:[".label[_ngcontent-%COMP%]{margin-left:10px;font-size:21px;font-weight:700}"]}),i})();const g=(0,a(2726).fo)("LocalNotifications",{web:()=>a.e(3850).then(a.bind(a,3850)).then(i=>new i.LocalNotificationsWeb)});var S=a(3076),Y=a(36),D=a(1776),F=a(3251),Q=a(7195);function R(i,r){if(1&i&&(n.TgZ(0,"p",23),n._uU(1),n.qZA()),2&i){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[0].raw.price,"/month ")}}function E(i,r){if(1&i&&(n.TgZ(0,"p",23),n._uU(1),n.qZA()),2&i){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[0].offers[1].pricingPhases[0].price,"/month ")}}function z(i,r){if(1&i&&(n.TgZ(0,"p",23),n._uU(1),n.qZA()),2&i){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[1].raw.price,"/year ")}}function V(i,r){if(1&i&&(n.TgZ(0,"p",23),n._uU(1),n.qZA()),2&i){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[1].offers[1].pricingPhases[0].price,"/month ")}}function G(i,r){if(1&i){const t=n.EpF();n.TgZ(0,"ion-card")(1,"ion-card-content")(2,"div",12)(3,"header"),n._UZ(4,"lottie-player",13),n.qZA(),n.TgZ(5,"section",14)(6,"h2"),n._uU(7,"Why Go Pro?"),n.qZA(),n.TgZ(8,"ul")(9,"li"),n._uU(10,"\u{1f680} Automatic Transaction Imports"),n.qZA(),n.TgZ(11,"li"),n._uU(12,"\u{1f552} Save Time with No More Manual Entries"),n.qZA(),n.TgZ(13,"li"),n._uU(14,"\u23f0 Schedule daily reminders to budget"),n.qZA(),n.TgZ(15,"li"),n._uU(16,"\u{1f3a8} Change the app's overall theme"),n.qZA()()(),n.TgZ(17,"section",15)(18,"h2"),n._uU(19,"Choose Your Plan"),n.qZA(),n.TgZ(20,"span",16)(21,"div",17)(22,"h3"),n._uU(23,"Monthly Plan"),n.qZA(),n.YNc(24,R,2,1,"p",18),n.YNc(25,E,2,1,"p",18),n.TgZ(26,"p"),n._uU(27,"After 7-day Free Trial"),n.qZA(),n.TgZ(28,"button",19),n.NdJ("click",function(){n.CHM(t);const o=n.oxw();return n.KtG(o.purchase("premium_sub"))}),n._uU(29,"Go Monthly"),n.qZA()(),n.TgZ(30,"div",20)(31,"h3"),n._uU(32,"Yearly Plan"),n.qZA(),n.YNc(33,z,2,1,"p",18),n.YNc(34,V,2,1,"p",18),n.TgZ(35,"p"),n._uU(36,"After 7-day Free Trial"),n.qZA(),n.TgZ(37,"button",19),n.NdJ("click",function(){n.CHM(t);const o=n.oxw();return n.KtG(o.purchase("premium_yearly"))}),n._uU(38,"Go Yearly"),n.qZA()()(),n.TgZ(39,"div")(40,"p")(41,"a",21),n._uU(42,"Privacy Policy"),n.qZA()(),n.TgZ(43,"p")(44,"a",22),n._uU(45,"Terms & Conditions"),n.qZA()()()()()()()}if(2&i){const t=n.oxw();n.xp6(24),n.Q6J("ngIf",t.platform.is("ios")&&t.inapp.products.length>0),n.xp6(1),n.Q6J("ngIf",!t.platform.is("ios")&&t.inapp.products.length>0),n.xp6(8),n.Q6J("ngIf",t.platform.is("ios")&&t.inapp.products.length>0),n.xp6(1),n.Q6J("ngIf",!t.platform.is("ios")&&t.inapp.products.length>0)}}function j(i,r){if(1&i){const t=n.EpF();n.TgZ(0,"ion-item",11),n.NdJ("click",function(){n.CHM(t);const o=n.oxw();return n.KtG(o.viewLinkedAccounts())}),n.TgZ(1,"ion-label"),n._uU(2,"View Linked Accounts"),n.qZA()()}}const B=[{path:"",component:(()=>{class i{constructor(t,e,o,s,u,d,_,W,$,X,nn){this.modalController=t,this.userService=e,this.inapp=o,this.authService=s,this.router=u,this.alertService=d,this.plaidService=_,this.alertCtrl=W,this.userRepository=$,this.finicityService=X,this.platform=nn,this.budgetReminders=[!1,!1,!1,!1,!1,!1,!1]}ngOnInit(){this.getUserData(),this.cancelUpcomingNotifications()}getUserData(){var t=this;return(0,l.Z)(function*(){const e=yield t.authService.getCurrentAuthUser();!e||!e.uid||(t.user=yield t.userRepository.get(e.uid),t.user.budgetReminders&&(t.budgetReminders=t.user.budgetReminders))})()}link(){var t=this;return(0,l.Z)(function*(){const e=yield t.modalController.create({component:J});e.present();const{data:o}=yield e.onDidDismiss();1===o?t.plaidService.linkPlaidToUser():2===o&&t.finicityService.linkFinicityToUser()})()}signOut(){var t=this;return(0,l.Z)(function*(){(yield t.authService.logout())?t.router.navigateByUrl("login"):t.alertService.createAndShowToast("There was an error logging out")})()}purchase(t){this.inapp.startPurchase(t)}goToThemes(){this.router.navigateByUrl("tabs/tab3/themes")}deleteAccount(){var t=this;return(0,l.Z)(function*(){var o;(yield t.alertCtrl.create({header:"Are you sure you want to delete your account?",buttons:[{text:"Yes",role:"destructive",handler:(o=(0,l.Z)(function*(){const s=yield t.authService.getCurrentAuthUser();(0,A.h8)(s).then(()=>window.location.reload())}),function(){return o.apply(this,arguments)})},{text:"No",handler:function(){var o=(0,l.Z)(function*(){});return function(){return o.apply(this,arguments)}}()}]})).present()})()}viewLinkedAccounts(){var t=this;return(0,l.Z)(function*(){const e=yield t.userRepository.getCurrentFirestoreUser();if(!e)throw new Error("Tab3: user is undefined");const o=yield t.modalController.create({component:I,componentProps:{user:e}});o.present();const{data:s}=yield o.onDidDismiss();s&&t.link()})()}cancelUpcomingNotifications(){var t=this;return(0,l.Z)(function*(){if(!t.userService.isPremium){const e=yield g.getPending();e.notifications.length>0&&(yield g.cancel(e))}})()}addNotificationDay(t){var e=this;return(0,l.Z)(function*(){e.userService.isPremium&&(e.budgetReminders[t]=!e.budgetReminders[t],e.userRepository.update(e.user.id,{budgetReminders:e.budgetReminders}),e.scheduleNotifications())})()}scheduleNotifications(){var t=this;return(0,l.Z)(function*(){let e=[];const o=new Date;for(let d=0;d<t.budgetReminders.length;d++)if(t.budgetReminders[d]){let _=new Date;_.setDate(o.getDate()+(d-o.getDay()+7)%7),_.setHours(18,0,0,0),_.getDay()===o.getDay()&&o.getHours()>=18&&_.setDate(_.getDate()+7),e.push({id:d,title:"Time to Budget!",body:"Open up your app to sort your transactions!",schedule:{at:_}})}let s={notifications:e};const u=yield g.getPending();u.notifications.length>0&&(yield g.cancel({notifications:u.notifications}));try{yield g.schedule(s),t.alertService.createAndShowToast("Budget reminders have been updated!")}catch(d){console.error("Error scheduling notifications:",d),t.alertService.createAndShowToast("Error updating reminders. Please try again.")}})()}dayIsActive(t){return this.budgetReminders[t]}}return i.\u0275fac=function(t){return new(t||i)(n.Y36(c.IN),n.Y36(S.K),n.Y36(Y.y),n.Y36(D.e),n.Y36(m.F0),n.Y36(F.c),n.Y36(T.O),n.Y36(c.Br),n.Y36(Q.E),n.Y36(k.v),n.Y36(c.t4))},i.\u0275cmp=n.Xpm({type:i,selectors:[["app-tab3"]],decls:47,vars:14,consts:[[3,"translucent"],[3,"fullscreen"],["collapse","condense"],["size","large"],[4,"ngIf"],["button","",3,"disabled","click"],["button","",3,"click",4,"ngIf"],[2,"margin-top","8px",3,"ngClass"],[2,"color","black","margin-left","18px"],[1,"notifications-row"],[1,"day",3,"ngClass","click"],["button","",3,"click"],[1,"container"],["slot","end","autoplay","","loop","","src","https://lottie.host/1a9b80ea-1cb9-4b02-929a-0a9d8e7fcee2/bdrGIZRYXV.json"],[1,"benefits"],[1,"pricing"],[1,"row"],["id","monthly",1,"plan"],["class","price",4,"ngIf"],[3,"click"],["id","yearly",1,"plan"],["href","https://elcodev.com/privacy-policy"],["href","https://elcodev.com/terms-conditions"],[1,"price"]],template:function(t,e){1&t&&(n.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),n._uU(3," Accounts "),n.qZA()()(),n.TgZ(4,"ion-content",1)(5,"ion-header",2)(6,"ion-toolbar")(7,"ion-title",3),n._uU(8,"Accounts"),n.qZA()()(),n.YNc(9,G,46,4,"ion-card",4),n.TgZ(10,"ion-card")(11,"ion-card-content")(12,"ion-list")(13,"ion-item",5),n.NdJ("click",function(){return e.link()}),n.TgZ(14,"ion-label"),n._uU(15,"Link Account"),n.qZA()(),n.YNc(16,j,3,0,"ion-item",6),n.TgZ(17,"ion-item",5),n.NdJ("click",function(){return e.goToThemes()}),n.TgZ(18,"ion-label"),n._uU(19,"Change App Theme"),n.qZA()(),n.TgZ(20,"div",7)(21,"ion-label",8),n._uU(22,"Budget Reminders"),n.qZA(),n.TgZ(23,"span",9)(24,"span",10),n.NdJ("click",function(){return e.addNotificationDay(0)}),n._uU(25,"S"),n.qZA(),n.TgZ(26,"span",10),n.NdJ("click",function(){return e.addNotificationDay(1)}),n._uU(27,"M"),n.qZA(),n.TgZ(28,"span",10),n.NdJ("click",function(){return e.addNotificationDay(2)}),n._uU(29,"T"),n.qZA(),n.TgZ(30,"span",10),n.NdJ("click",function(){return e.addNotificationDay(3)}),n._uU(31,"W"),n.qZA(),n.TgZ(32,"span",10),n.NdJ("click",function(){return e.addNotificationDay(4)}),n._uU(33,"T"),n.qZA(),n.TgZ(34,"span",10),n.NdJ("click",function(){return e.addNotificationDay(5)}),n._uU(35,"F"),n.qZA(),n.TgZ(36,"span",10),n.NdJ("click",function(){return e.addNotificationDay(6)}),n._uU(37,"S"),n.qZA()()()()()(),n.TgZ(38,"ion-card")(39,"ion-card-content")(40,"ion-list")(41,"ion-item",11),n.NdJ("click",function(){return e.deleteAccount()}),n.TgZ(42,"ion-label"),n._uU(43,"Delete Account"),n.qZA()(),n.TgZ(44,"ion-item",11),n.NdJ("click",function(){return e.signOut()}),n.TgZ(45,"ion-label"),n._uU(46,"Sign Out"),n.qZA()()()()()()),2&t&&(n.Q6J("translucent",!0),n.xp6(4),n.Q6J("fullscreen",!0),n.xp6(5),n.Q6J("ngIf",!e.userService.isPremium),n.xp6(4),n.Q6J("disabled",!e.userService.isPremium),n.xp6(3),n.Q6J("ngIf",e.userService.isPremium),n.xp6(1),n.Q6J("disabled",!e.userService.isPremium),n.xp6(3),n.Q6J("ngClass",e.userService.isPremium?"budget-active":"budget-inactive"),n.xp6(4),n.Q6J("ngClass",e.dayIsActive(0)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(1)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(2)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(3)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(4)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(5)?"active":"inactive"),n.xp6(2),n.Q6J("ngClass",e.dayIsActive(6)?"active":"inactive"))},dependencies:[c.PM,c.FN,c.W2,c.Gu,c.Ie,c.Q$,c.q_,c.wd,c.sr,p.mk,p.O5],styles:["ion-title[_ngcontent-%COMP%]{background:#f3f3f3}ion-toolbar[_ngcontent-%COMP%]{padding:0!important}.container[_ngcontent-%COMP%]{max-width:800px;margin:20px auto;padding:20px;border-radius:8px}header[_ngcontent-%COMP%]{text-align:center;display:flex;flex-direction:row;justify-content:center}header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#00eabb}.benefits[_ngcontent-%COMP%]{margin:20px 0}.benefits[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .pricing[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;color:#2980b9}.benefits[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none;padding:0}.benefits[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:10px 0;font-size:18px}.pricing[_ngcontent-%COMP%]{text-align:center}.pricing[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;flex-wrap:nowrap}.plan[_ngcontent-%COMP%]{display:flex;min-width:50%;max-width:50%;margin:10px;padding:20px;background:#f9f9f9;border:1px solid #ddd;border-radius:8px;flex-direction:column;flex-wrap:nowrap;align-items:center;justify-content:center}.plan[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#2980b9}.price[_ngcontent-%COMP%]{font-size:20px;color:#000}button[_ngcontent-%COMP%]{width:100%;padding:10px;border:none;border-radius:5px;background-color:#00eabb;color:#fff;font-size:18px;cursor:pointer;margin-top:10px}button[_ngcontent-%COMP%]:hover{background-color:#00cea5}lottie-player[_ngcontent-%COMP%]{width:225px;margin-top:-90px;text-align:center}.budget-inactive[_ngcontent-%COMP%]{background-color:#f3f3f3}.budget-inactive[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{color:gray!important}.budget-inactive[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{color:gray!important}.notifications-row[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-evenly;align-items:center;margin-top:25px}.notifications-row[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%]{background-color:var(--ion-color-primary);color:var(--ion-color-primary-contrast)}.notifications-row[_ngcontent-%COMP%]   .inactive[_ngcontent-%COMP%]{background-color:#f3f3f3;color:#000}.notifications-row[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{width:33px;height:33px;display:block;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:100%;font-weight:700}"]}),i})()},{path:"themes",loadChildren:()=>a.e(6344).then(a.bind(a,6344)).then(i=>i.ThemesPageModule)}];let K=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=n.oAB({type:i}),i.\u0275inj=n.cJS({imports:[m.Bz.forChild(B),m.Bz]}),i})(),H=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=n.oAB({type:i}),i.\u0275inj=n.cJS({imports:[c.Pc,p.ez,Z.u5,v.e,K]}),i})()}}]);