"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4934],{4934:(H,g,s)=>{s.r(g),s.d(g,{Tab3PageModule:()=>G});var o=s(5548),d=s(6814),h=s(95),k=s(3554),_=s(4798),a=s(5861),T=s(7826),n=s(6689),A=s(8452),m=s(1914),f=s(1743);function Z(e,r){if(1&e&&(n.TgZ(0,"ion-card-header")(1,"ion-card-title"),n._uU(2,"Linked Accounts"),n.qZA(),n.TgZ(3,"ion-card-subtitle"),n._uU(4),n.qZA()()),2&e){const t=n.oxw();n.xp6(4),n.hij(" ",t.linkedAccounts.length," Linked Accounts ")}}function v(e,r){1&e&&n._UZ(0,"ion-icon",14)}function C(e,r){1&e&&n._UZ(0,"ion-icon",15)}function x(e,r){1&e&&n._UZ(0,"ion-icon",16)}function b(e,r){1&e&&(n.TgZ(0,"p"),n._uU(1," Linked "),n.qZA())}function y(e,r){1&e&&(n.TgZ(0,"p"),n._uU(1," Almost Expired "),n.qZA())}function P(e,r){1&e&&(n.TgZ(0,"p"),n._uU(1," Needs Relink "),n.qZA())}function w(e,r){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item-option",17),n.NdJ("click",function(){n.CHM(t);const c=n.oxw().$implicit,l=n.oxw(2);return n.KtG(l.handleLinkedAccountAction(c))}),n._uU(1," Relink "),n.qZA()}}function L(e,r){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item-sliding")(1,"ion-item",7),n.NdJ("click",function(){const l=n.CHM(t).$implicit,u=n.oxw(2);return n.KtG(u.handleLinkedAccountAction(l))}),n.YNc(2,v,1,0,"ion-icon",8),n.YNc(3,C,1,0,"ion-icon",9),n.YNc(4,x,1,0,"ion-icon",10),n.TgZ(5,"ion-label")(6,"h2"),n._uU(7),n.qZA(),n.YNc(8,b,2,0,"p",3),n.YNc(9,y,2,0,"p",3),n.YNc(10,P,2,0,"p",3),n.qZA()(),n.TgZ(11,"ion-item-options",11),n.YNc(12,w,2,0,"ion-item-option",12),n.TgZ(13,"ion-item-option",13),n.NdJ("click",function(){const l=n.CHM(t).$implicit,u=n.oxw(2);return n.KtG(u.removeLinkedAccount(l))}),n._uU(14," Delete "),n.qZA()()()}if(2&e){const t=r.$implicit;n.xp6(1),n.Q6J("button",t.link_status&&"NONE"!=t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(3),n.Oqu(t.institution_name),n.xp6(1),n.Q6J("ngIf",!t.link_status||"NONE"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"NOTIFY_PENDING_EXPIRATION"==t.link_status.required_action),n.xp6(1),n.Q6J("ngIf",t.link_status&&"RELINK"==t.link_status.required_action),n.xp6(2),n.Q6J("ngIf",t.link_status&&"NONE"!=t.link_status.required_action)}}function N(e,r){if(1&e&&(n.TgZ(0,"ion-list"),n.YNc(1,L,15,9,"ion-item-sliding",6),n.qZA()),2&e){const t=n.oxw();n.xp6(1),n.Q6J("ngForOf",t.linkedAccounts)}}let M=(()=>{class e{constructor(t,i,c,l){this.modalController=t,this.linkedAccountsRepository=i,this.plaidService=c,this.finicityService=l,this.linkedAccounts=[],this.loading=!0}ngOnInit(){var t=this;if(!this.user)throw new Error("ViewLinkedAccountsComponent: user is undefined");this.linkedAccountsRepository.getAllFromParent(this.user.id).then(function(){var i=(0,a.Z)(function*(c){t.loading=!1,t.linkedAccounts=c.docs,console.log(t.linkedAccounts);for(let l=0;l<t.linkedAccounts.length;l++)if(t.linkedAccounts[l].isFinicity){let u=yield t.finicityService.getInstitutionById(t.linkedAccounts[l].institutionId);t.linkedAccounts[l].institution_name=u.name}});return function(c){return i.apply(this,arguments)}}())}removeLinkedAccount(t){var i=this;return(0,a.Z)(function*(){i.plaidService.removePlaidLinkedAccount(t),i.linkedAccounts=i.linkedAccounts.filter(c=>c.id!==t.id)})()}handleLinkedAccountAction(t){var i=this;return(0,a.Z)(function*(){if(t.link_status)switch(t.link_status.required_action){case"RELINK":case"NOTIFY_PENDING_EXPIRATION":i.relinkLinkedAccount(t);break;case"NONE":break;default:throw new Error("ViewLinkedAccountsComponent: unknown required_action")}})()}link(){var t=this;return(0,a.Z)(function*(){t.modalController.dismiss(1)})()}onRelinkSuccessCallback(t){var i=this;return(0,a.Z)(function*(){const c=i.linkedAccounts.find(l=>l.id===t);c&&c.link_status&&(c.link_status={required_action:"NONE",last_webhook:c.link_status.last_webhook})})()}relinkLinkedAccount(t){var i=this;return(0,a.Z)(function*(){i.plaidService.relinkPlaidLinkedAccount(t,i.onRelinkSuccessCallback.bind(i))})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(o.IN),n.Y36(A.q),n.Y36(m.O),n.Y36(f.v))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-view-linked-accounts"]],decls:15,vars:2,consts:[["color","primary"],["slot","start"],[3,"click"],[4,"ngIf"],["color","primary","fill","clear",3,"click"],["name","add"],[4,"ngFor","ngForOf"],["lines","full",3,"button","click"],["name","checkmark-circle-outline","style","color: var(--ion-color-success)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-warning)","slot","start",4,"ngIf"],["name","alert-circle-outline","style","color: var(--ion-color-danger)","slot","start",4,"ngIf"],["side","end"],["color","primary",3,"click",4,"ngIf"],["color","danger",3,"click"],["name","checkmark-circle-outline","slot","start",2,"color","var(--ion-color-success)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-warning)"],["name","alert-circle-outline","slot","start",2,"color","var(--ion-color-danger)"],["color","primary",3,"click"]],template:function(t,i){1&t&&(n.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),n.NdJ("click",function(){return i.modalController.dismiss()}),n._uU(4,"Close"),n.qZA()(),n.TgZ(5,"ion-title"),n._uU(6,"Linked Accounts"),n.qZA()()(),n.TgZ(7,"ion-content")(8,"ion-card"),n.YNc(9,Z,5,1,"ion-card-header",3),n.TgZ(10,"ion-card-content"),n.YNc(11,N,2,1,"ion-list",3),n.qZA(),n.TgZ(12,"ion-button",4),n.NdJ("click",function(){return i.link()}),n._UZ(13,"ion-icon",5),n._uU(14," Link Account "),n.qZA()()()),2&t&&(n.xp6(9),n.Q6J("ngIf",!i.loading),n.xp6(2),n.Q6J("ngIf",!i.loading&&i.linkedAccounts.length>0))},dependencies:[d.sg,d.O5,o.YG,o.Sm,o.PM,o.FN,o.Zi,o.tO,o.Dq,o.W2,o.Gu,o.gu,o.Ie,o.u8,o.IK,o.td,o.Q$,o.q_,o.wd,o.sr]}),e})();var p=s(6863);let O=(()=>{class e{constructor(t){this.modalCtrl=t,this.flags={plaid:{enabled:!1},finicity:{enabled:!1}}}ngOnInit(){(0,p.PL)((0,p.hJ)((0,p.ad)(),"flags")).then(t=>{console.log(t.docs),t.docs.forEach(i=>{this.flags[i.id]={enabled:i.data().enabled},console.log(this.flags)})})}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(o.IN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-account-picker"]],decls:36,vars:2,consts:[["color","primary"],["slot","start"],[3,"click"],[2,"display","flex","flex-direction","column","align-content","center","align-items","center","justify-content","center","flex-wrap","nowrap","height","100%"],[2,"text-align","center"],["lines","none"],["button","",3,"disabled","click"],["height","48","viewBox","0 0 126 48","xmlns","http://www.w3.org/2000/svg",1,"css-1sgqwt5"],["fill","#111","fill-rule","evenodd"],["d","M66.248 16.268c-1.057-.889-2.861-1.333-5.413-1.333h-5.756v17.788h4.304v-5.575h1.928c2.34 0 4.056-.515 5.148-1.546 1.23-1.155 1.849-2.693 1.849-4.613 0-1.991-.687-3.565-2.06-4.721m-5.044 6.855h-1.821V18.96h1.636c1.99 0 2.985.698 2.985 2.094 0 1.378-.934 2.068-2.8 2.068M75.673 14.934h-4.488v17.788h9.69v-4.026h-5.202zM89.668 14.934l-7.05 17.788h4.832l.924-2.586H94.5l.845 2.586h4.886l-7-17.788zm-.053 11.601l1.849-6.08 1.82 6.08z"],["d","M102.473 32.722h4.489V14.934h-4.489zM124.39 18.268a7.376 7.376 0 00-2.14-2.053c-1.355-.854-3.204-1.28-5.545-1.28h-5.914v17.787h6.918c2.5 0 4.506-.817 6.02-2.453 1.514-1.635 2.27-3.805 2.27-6.508 0-2.15-.537-3.981-1.61-5.493m-7.182 10.427h-1.927v-9.734h1.954c1.373 0 2.428.43 3.168 1.287.74.857 1.11 2.073 1.11 3.647 0 3.2-1.435 4.8-4.305 4.8M18.637 0L4.09 3.81.081 18.439l5.014 5.148L0 28.65l3.773 14.693 14.484 4.047 5.096-5.064 5.014 5.147 14.547-3.81 4.008-14.63-5.013-5.146 5.095-5.063L43.231 4.13 28.745.083l-5.094 5.063zM9.71 6.624l7.663-2.008 3.351 3.44-4.887 4.856zm16.822 1.478l3.405-3.383 7.63 2.132-6.227 6.187zM4.672 17.238l2.111-7.705 6.125 6.288-4.886 4.856zm29.547-1.243l6.227-6.189 1.986 7.74-3.404 3.384zm-15.502-.127l4.887-4.856 4.807 4.936-4.886 4.856zm-7.814 7.765l4.886-4.856 4.81 4.936-4.888 4.856zm15.503.127l4.886-4.856L36.1 23.84l-4.887 4.856zM4.57 29.927l3.406-3.385 4.807 4.937-6.225 6.186zm14.021 1.598l4.887-4.856 4.808 4.936-4.886 4.856zm15.502.128l4.887-4.856 3.351 3.439-2.11 7.705zm-24.656 8.97l6.226-6.189 4.81 4.936-3.406 3.385zm16.843-1.206l4.886-4.856 6.126 6.289-7.662 2.007z"],["xmlns","http://www.w3.org/2000/svg",0,"xmlns","xlink","http://www.w3.org/1999/xlink","width","65px","height","41px","viewBox","0 0 65 41","version","1.1"],["id","Page-1","stroke","none","stroke-width","1","fill","none","fill-rule","evenodd"],["id","Home-Page","transform","translate(-128.000000, -75.000000)","fill-rule","nonzero"],["id","Group-2","transform","translate(124.000000, 71.000000)"],["id","mc_symbol","transform","translate(4.000000, 4.000000)"],["id","Rectangle","fill","#F26522","x","23.359375","y","4.35","width","18.28125","height","32"],["d","M24.828025,20.3125 C24.828025,13.8328429 27.8281407,8.06197752 32.5,4.34314434 C29.0829927,1.62287109 24.7720496,0 20.0859875,0 C8.99282795,0 0,9.09432967 0,20.3125 C0,31.5306703 8.99282795,40.625 20.0859875,40.625 C24.7720496,40.625 29.0829927,39.0021289 32.5,36.2818557 C27.8281407,32.5621777 24.828025,26.7921571 24.828025,20.3125 Z","id","Path","fill","#E52423"],["d","M63.2108758,34.53125 L63.2108758,33.6887058 L63.36728,33.6887058 L63.36728,33.5167136 L62.96875,33.5167136 L62.96875,33.6887058 L63.1251542,33.6887058 L63.1251542,34.53125 L63.2108758,34.53125 Z M63.984375,34.53125 L63.984375,33.515625 L63.8620589,33.515625 L63.7216961,34.2144795 L63.5813333,33.515625 L63.4590172,33.515625 L63.4590172,34.53125 L63.54524,34.53125 L63.54524,33.7649049 L63.6770808,34.4256598 L63.7663114,34.4256598 L63.8981521,33.7638163 L63.8981521,34.53125 L63.984375,34.53125 Z","id","Shape","fill","#F99F1C"],["d","M65,20.3125 C65,31.5306703 56.0071721,40.625 44.9140125,40.625 C40.2279504,40.625 35.9170073,39.0021289 32.5,36.2818557 C37.1718593,32.5621777 40.171975,26.7921571 40.171975,20.3125 C40.171975,13.8328429 37.1718593,8.06197752 32.5,4.34314434 C35.9170073,1.62287109 40.2279504,0 44.9140125,0 C56.0071721,0 65,9.09432967 65,20.3125 Z","id","Path","fill","#F99F1C"],[1,"label"]],template:function(t,i){1&t&&(n.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1)(3,"ion-button",2),n.NdJ("click",function(){return i.modalCtrl.dismiss()}),n._uU(4,"Close"),n.qZA()(),n.TgZ(5,"ion-title"),n._uU(6,"Link Account"),n.qZA()()(),n.TgZ(7,"div",3)(8,"ion-card")(9,"ion-card-header")(10,"ion-card-subtitle"),n._uU(11,"Choose a Way to Sync Your Accounts"),n.qZA()(),n.TgZ(12,"ion-card-content")(13,"p",4),n._uU(14," Sometimes a users bank is not supported by every single system. So we at WiseWallets decided to support multiple sync partners so no matter what bank you have, you'll be supported! "),n.qZA(),n._UZ(15,"br"),n.TgZ(16,"ion-list",5)(17,"ion-item",6),n.NdJ("click",function(){return i.modalCtrl.dismiss(1)}),n.O4$(),n.TgZ(18,"svg",7)(19,"g",8),n._UZ(20,"path",9)(21,"path",10),n.qZA()()(),n.kcU(),n.TgZ(22,"ion-item",6),n.NdJ("click",function(){return i.modalCtrl.dismiss(2)}),n.O4$(),n.TgZ(23,"svg",11)(24,"title"),n._uU(25,"mc_symbol"),n.qZA(),n.TgZ(26,"g",12)(27,"g",13)(28,"g",14)(29,"g",15),n._UZ(30,"rect",16)(31,"path",17)(32,"path",18)(33,"path",19),n.qZA()()()()(),n.kcU(),n.TgZ(34,"span",20),n._uU(35,"Finicity"),n.qZA()()()()()()),2&t&&(n.xp6(17),n.Q6J("disabled",!i.flags.plaid.enabled),n.xp6(5),n.Q6J("disabled",!i.flags.finicity.enabled))},dependencies:[o.YG,o.Sm,o.PM,o.FN,o.Zi,o.tO,o.Gu,o.Ie,o.q_,o.wd,o.sr],styles:[".label[_ngcontent-%COMP%]{margin-left:10px;font-size:21px;font-weight:700}"]}),e})();var U=s(3076),I=s(36),q=s(1776),Y=s(3251),J=s(7195);function F(e,r){if(1&e&&(n.TgZ(0,"p",19),n._uU(1),n.qZA()),2&e){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[0].raw.price,"/month ")}}function S(e,r){if(1&e&&(n.TgZ(0,"p",19),n._uU(1),n.qZA()),2&e){const t=n.oxw(2);n.xp6(1),n.hij(" ",t.inapp.products[1].raw.price,"/year ")}}function E(e,r){if(1&e){const t=n.EpF();n.TgZ(0,"ion-card")(1,"ion-card-content")(2,"div",8)(3,"header"),n._UZ(4,"lottie-player",9),n.qZA(),n.TgZ(5,"section",10)(6,"h2"),n._uU(7,"Why Go Pro?"),n.qZA(),n.TgZ(8,"ul")(9,"li"),n._uU(10,"\u{1f680} Automatic Transaction Imports"),n.qZA(),n.TgZ(11,"li"),n._uU(12,"\u{1f552} Save Time with No More Manual Entries"),n.qZA(),n.TgZ(13,"li"),n._uU(14,"\u{1f3a8} Change the app's overall theme"),n.qZA()()(),n.TgZ(15,"section",11)(16,"h2"),n._uU(17,"Choose Your Plan"),n.qZA(),n.TgZ(18,"span",12)(19,"div",13)(20,"h3"),n._uU(21,"Monthly Plan"),n.qZA(),n.YNc(22,F,2,1,"p",14),n.TgZ(23,"p"),n._uU(24,"After 7-day Free Trial"),n.qZA(),n.TgZ(25,"button",15),n.NdJ("click",function(){n.CHM(t);const c=n.oxw();return n.KtG(c.purchase("premium_sub"))}),n._uU(26,"Go Monthly"),n.qZA()(),n.TgZ(27,"div",16)(28,"h3"),n._uU(29,"Yearly Plan"),n.qZA(),n.YNc(30,S,2,1,"p",14),n.TgZ(31,"p"),n._uU(32,"After 7-day Free Trial"),n.qZA(),n.TgZ(33,"button",15),n.NdJ("click",function(){n.CHM(t);const c=n.oxw();return n.KtG(c.purchase("premium_yearly"))}),n._uU(34,"Go Yearly"),n.qZA()()(),n.TgZ(35,"div")(36,"p")(37,"a",17),n._uU(38,"Privacy Policy"),n.qZA()(),n.TgZ(39,"p")(40,"a",18),n._uU(41,"Terms & Conditions"),n.qZA()()()()()()()}if(2&e){const t=n.oxw();n.xp6(22),n.Q6J("ngIf",t.inapp.products.length>0),n.xp6(8),n.Q6J("ngIf",t.inapp.products.length>0)}}function z(e,r){if(1&e){const t=n.EpF();n.TgZ(0,"ion-item",7),n.NdJ("click",function(){n.CHM(t);const c=n.oxw();return n.KtG(c.viewLinkedAccounts())}),n.TgZ(1,"ion-label"),n._uU(2,"View Linked Accounts"),n.qZA()()}}const V=[{path:"",component:(()=>{class e{constructor(t,i,c,l,u,D,R,K,j,B){this.modalController=t,this.userService=i,this.inapp=c,this.authService=l,this.router=u,this.alertService=D,this.plaidService=R,this.alertCtrl=K,this.userRepository=j,this.finicityService=B}ngOnInit(){}link(){var t=this;return(0,a.Z)(function*(){const i=yield t.modalController.create({component:O});i.present();const{data:c}=yield i.onDidDismiss();1===c?t.plaidService.linkPlaidToUser():2===c&&t.finicityService.linkFinicityToUser()})()}signOut(){var t=this;return(0,a.Z)(function*(){(yield t.authService.logout())?t.router.navigateByUrl("login"):t.alertService.createAndShowToast("There was an error logging out")})()}purchase(t){this.inapp.startPurchase(t)}goToThemes(){this.router.navigateByUrl("tabs/tab3/themes")}deleteAccount(){var t=this;return(0,a.Z)(function*(){var c;(yield t.alertCtrl.create({header:"Are you sure you want to delete your account?",buttons:[{text:"Yes",role:"destructive",handler:(c=(0,a.Z)(function*(){const l=yield t.authService.getCurrentAuthUser();(0,T.h8)(l).then(()=>window.location.reload())}),function(){return c.apply(this,arguments)})},{text:"No",handler:function(){var c=(0,a.Z)(function*(){});return function(){return c.apply(this,arguments)}}()}]})).present()})()}viewLinkedAccounts(){var t=this;return(0,a.Z)(function*(){const i=yield t.userRepository.getCurrentFirestoreUser();if(!i)throw new Error("Tab3: user is undefined");const c=yield t.modalController.create({component:M,componentProps:{user:i}});c.present();const{data:l}=yield c.onDidDismiss();l&&t.link()})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(o.IN),n.Y36(U.K),n.Y36(I.y),n.Y36(q.e),n.Y36(_.F0),n.Y36(Y.c),n.Y36(m.O),n.Y36(o.Br),n.Y36(J.E),n.Y36(f.v))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-tab3"]],decls:26,vars:6,consts:[[3,"translucent"],[3,"fullscreen"],["collapse","condense"],["size","large"],[4,"ngIf"],["button","",3,"disabled","click"],["button","",3,"click",4,"ngIf"],["button","",3,"click"],[1,"container"],["slot","end","autoplay","","loop","","src","https://lottie.host/1a9b80ea-1cb9-4b02-929a-0a9d8e7fcee2/bdrGIZRYXV.json"],[1,"benefits"],[1,"pricing"],[1,"row"],["id","monthly",1,"plan"],["class","price",4,"ngIf"],[3,"click"],["id","yearly",1,"plan"],["href","https://elcodev.com/privacy-policy"],["href","https://elcodev.com/terms-conditions"],[1,"price"]],template:function(t,i){1&t&&(n.TgZ(0,"ion-header",0)(1,"ion-toolbar")(2,"ion-title"),n._uU(3," Accounts "),n.qZA()()(),n.TgZ(4,"ion-content",1)(5,"ion-header",2)(6,"ion-toolbar")(7,"ion-title",3),n._uU(8,"Accounts"),n.qZA()()(),n.YNc(9,E,42,2,"ion-card",4),n.TgZ(10,"ion-card")(11,"ion-card-content")(12,"ion-list")(13,"ion-item",5),n.NdJ("click",function(){return i.link()}),n.TgZ(14,"ion-label"),n._uU(15,"Link Account"),n.qZA()(),n.YNc(16,z,3,0,"ion-item",6),n.TgZ(17,"ion-item",5),n.NdJ("click",function(){return i.goToThemes()}),n.TgZ(18,"ion-label"),n._uU(19,"Change App Theme"),n.qZA()(),n.TgZ(20,"ion-item",7),n.NdJ("click",function(){return i.deleteAccount()}),n.TgZ(21,"ion-label"),n._uU(22,"Delete Account"),n.qZA()(),n.TgZ(23,"ion-item",7),n.NdJ("click",function(){return i.signOut()}),n.TgZ(24,"ion-label"),n._uU(25,"Sign Out"),n.qZA()()()()()()),2&t&&(n.Q6J("translucent",!0),n.xp6(4),n.Q6J("fullscreen",!0),n.xp6(5),n.Q6J("ngIf",!i.userService.isPremium),n.xp6(4),n.Q6J("disabled",!i.userService.isPremium),n.xp6(3),n.Q6J("ngIf",i.userService.isPremium),n.xp6(1),n.Q6J("disabled",!i.userService.isPremium))},dependencies:[o.PM,o.FN,o.W2,o.Gu,o.Ie,o.Q$,o.q_,o.wd,o.sr,d.O5],styles:["ion-title[_ngcontent-%COMP%]{background:#f3f3f3}ion-toolbar[_ngcontent-%COMP%]{padding:0!important}.container[_ngcontent-%COMP%]{max-width:800px;margin:20px auto;padding:20px;border-radius:8px}header[_ngcontent-%COMP%]{text-align:center;display:flex;flex-direction:row;justify-content:center}header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#00eabb}.benefits[_ngcontent-%COMP%]{margin:20px 0}.benefits[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .pricing[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;color:#2980b9}.benefits[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none;padding:0}.benefits[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:10px 0;font-size:18px}.pricing[_ngcontent-%COMP%]{text-align:center}.pricing[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;flex-wrap:nowrap}.plan[_ngcontent-%COMP%]{display:flex;min-width:50%;max-width:50%;margin:10px;padding:20px;background:#f9f9f9;border:1px solid #ddd;border-radius:8px;flex-direction:column;flex-wrap:nowrap;align-items:center;justify-content:center}.plan[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#2980b9}.price[_ngcontent-%COMP%]{font-size:20px;color:#000}button[_ngcontent-%COMP%]{width:100%;padding:10px;border:none;border-radius:5px;background-color:#00eabb;color:#fff;font-size:18px;cursor:pointer;margin-top:10px}button[_ngcontent-%COMP%]:hover{background-color:#00cea5}lottie-player[_ngcontent-%COMP%]{width:225px;margin-top:-90px;text-align:center}"]}),e})()},{path:"themes",loadChildren:()=>s.e(6344).then(s.bind(s,6344)).then(e=>e.ThemesPageModule)}];let Q=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[_.Bz.forChild(V),_.Bz]}),e})(),G=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[o.Pc,d.ez,h.u5,k.e,Q]}),e})()}}]);