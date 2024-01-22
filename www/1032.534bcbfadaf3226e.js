"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1032],{1032:(M,p,i)=>{i.r(p),i.d(p,{CreateAccountPageModule:()=>T});var d=i(6814),g=i(95),s=i(5548),u=i(2607),l=i(5861),r=i(6825),e=i(6689),f=i(3251),h=i(1776),m=i(2481),v=i(7195),y=i(1823),x=i(7760);function C(o,c){if(1&o){const t=e.EpF();e.TgZ(0,"div",4)(1,"div",5),e._UZ(2,"lottie-player",6),e.qZA(),e.TgZ(3,"div",7)(4,"div",8),e._UZ(5,"app-form-item",9),e.qZA(),e.TgZ(6,"div",10),e._UZ(7,"app-form-item",11),e.qZA(),e.TgZ(8,"div",12),e._UZ(9,"app-form-item",13),e.qZA(),e.TgZ(10,"div",14)(11,"app-login-button",15),e.NdJ("buttonClick",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.signUp())}),e.qZA()()(),e.TgZ(12,"div",16),e.NdJ("mousedown",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.loginFocused=!0)})("mouseup",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.loginFocused=!1)})("click",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.navigateToLogin())}),e.TgZ(13,"span",17),e._uU(14,"Back to Login"),e.qZA()()()}if(2&o){const t=e.oxw();e.Q6J("@createForm",void 0),e.xp6(5),e.Q6J("model",t.user),e.xp6(2),e.Q6J("model",t.user),e.xp6(2),e.Q6J("model",t.user),e.xp6(4),e.Q6J("@login",t.loginFocused?"focused":"blurred")}}function w(o,c){if(1&o){const t=e.EpF();e.TgZ(0,"div",18)(1,"div",5)(2,"h1",19),e._uU(3," \u{1f6e1}\ufe0f Your Secure Backup Phrase "),e.qZA()(),e.TgZ(4,"div",20)(5,"p"),e._uU(6," \u{1f512} "),e.TgZ(7,"strong"),e._uU(8,"Why this is important:"),e.qZA(),e._uU(9," Your backup phrase is the master key to your financial data and bank transaction encryptions. It's like a secret spell to safeguard your treasures! "),e.qZA(),e.TgZ(10,"p"),e._uU(11," \u{1f4dd} Write down these magic words and keep them in a safe place, like a locked drawer or a personal safe. You'll need them to recover your data, ensuring your financial information stays private and secure! "),e.qZA()(),e.TgZ(12,"div",21)(13,"div",22),e._uU(14),e.qZA(),e.TgZ(15,"div",23)(16,"ion-button",24),e.NdJ("click",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.copyPhrase())}),e._UZ(17,"ion-icon",25),e.qZA()()(),e.TgZ(18,"div",26)(19,"app-login-button",27),e.NdJ("buttonClick",function(){e.CHM(t);const a=e.oxw();return e.KtG(a.doneShowingPhrase())}),e.qZA()()()}if(2&o){const t=e.oxw();e.Q6J("@showPhrase",void 0),e.xp6(14),e.hij(" ",t.backupPhrase," ")}}const P=[{path:"",component:(()=>{class o{constructor(t,n,a,_,Z,S,k){this.alertService=t,this.router=n,this.route=a,this.authService=_,this.cryptoService=Z,this.userRepository=S,this.loaderCtrl=k,this.loginFocused=!1,this.state="create",this.user={name:void 0,email:void 0,password:void 0}}ngOnInit(){}signUp(){var t=this;return(0,l.Z)(function*(){const n=yield t.loaderCtrl.create();n.present();try{t.verifyUserValues()}catch(a){return n.dismiss(),void t.alertService.createAndShowToast(a.message)}try{t.createAccountUser=yield t.authService.createAccount(t.user.email,t.user.password,{name:t.user.name})}catch(a){n.dismiss(),t.alertService.createAndShowToast(a.message)}try{if(!t.cryptoService.surrogateKey)throw new Error("Something went wrong")}catch{return n.dismiss(),void t.panic()}n.dismiss(),t.showPhrase()})()}navigateToLogin(){var t=this;return(0,l.Z)(function*(){t.router.navigate(["../login"],{relativeTo:t.route})})()}showPhrase(){var t=this;return(0,l.Z)(function*(){t.backupPhrase=t.cryptoService.generateBackupPhrase().toLowerCase(),t.state="showphrase"})()}doneShowingPhrase(){var t=this;return(0,l.Z)(function*(){yield t.saveUserPhrase(),t.router.navigate([""])})()}copyPhrase(){var t=this;return(0,l.Z)(function*(){if(t.backupPhrase)try{yield navigator.clipboard.writeText(t.backupPhrase),t.alertService.createAndShowToast("Copied to clipboard")}catch(n){t.alertService.createAndShowToast(n.message)}else t.panic()})()}saveUserPhrase(){var t=this;return(0,l.Z)(function*(){if(t.backupPhrase&&t.cryptoService.surrogateKey&&t.createAccountUser)try{const{surrogateKey:n,salt:a}=yield t.cryptoService.getKDFSurrogateAndSaltFromSurrogateKey(t.backupPhrase,t.cryptoService.surrogateKey);yield t.userRepository.update(t.createAccountUser.id,{encryption_data:{surrogate_key_backup_phrase:n,backup_phrase_kdf_salt:a}})}catch(n){t.alertService.createAndShowToast(n.message)}else t.panic()})()}verifyUserValues(){if(!this.user.name||!this.user.email||!this.user.password)throw new Error("Please fill all the fields")}panic(){this.alertService.createAndShowToast("Something went wrong"),this.authService.logout(),this.router.navigateByUrl("login")}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(f.c),e.Y36(u.F0),e.Y36(u.gz),e.Y36(h.e),e.Y36(m.$),e.Y36(v.E),e.Y36(s.HT))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-create-account"]],decls:5,vars:5,consts:[[3,"translucent"],[3,"fullscreen","ngClass"],["id","form-container",4,"ngIf"],["style","text-align: center",4,"ngIf"],["id","form-container"],[1,"title-container"],["slot","end","autoplay","","loop","","src","https://lottie.host/dd7fc8ea-f12a-48ba-a12d-0ba33de0db3f/8ufu7Oo8sJ.json"],[1,"login-input-container"],[1,"fullname-container"],["label","Full Name","iconName","person-outline","property","name","type","text","placeholder","Type your full name",3,"model"],[1,"username-container"],["label","Email","iconName","mail-outline","property","email","type","email","placeholder","Type your email",3,"model"],[1,"password-container"],["label","Password","iconName","lock-closed-outline","property","password","type","password","placeholder","Type your password",3,"model"],[1,"login-button-container"],["text","LET'S GET BUDGETING",3,"buttonClick"],[1,"login-text-container",3,"mousedown","mouseup","click"],["expand","block",1,"signup-button"],[2,"text-align","center"],[1,"login-title",2,"font-family","'Courier New', Courier, monospace","color","#000"],["id","phrase-instructions",2,"background-color","#e8f0fe","padding","10px","border-radius","10px","font-family","'Arial', sans-serif","box-shadow","0 4px 8px rgba(0, 0, 0, 0.1)","font-size","17px"],["id","phrase-container",2,"background-color","#fff","padding","12px","margin-top","20px","border-radius","10px","box-shadow","0 4px 8px rgba(0, 0, 0, 0.1)"],[1,"phrase",2,"font-family","'Courier New', Courier, monospace","color","#000","font-size","20px"],["id","copy-button-container"],["fill","clear",3,"click"],["name","copy-outline","slot","icon-only",2,"font-size","20px"],[2,"width","80%","margin","10px auto 0 auto"],["text","I'VE WRITTEN THEM DOWN",3,"buttonClick"]],template:function(t,n){1&t&&(e.TgZ(0,"ion-header",0),e._UZ(1,"ion-toolbar"),e.qZA(),e.TgZ(2,"ion-content",1),e.YNc(3,C,15,5,"div",2),e.YNc(4,w,20,2,"div",3),e.qZA()),2&t&&(e.Q6J("translucent",!0),e.xp6(2),e.Q6J("fullscreen",!0)("ngClass","create"==n.state?"centered":""),e.xp6(1),e.Q6J("ngIf","create"==n.state),e.xp6(1),e.Q6J("ngIf","showphrase"==n.state))},dependencies:[d.mk,d.O5,s.YG,s.W2,s.Gu,s.gu,s.sr,y.T,x.J],styles:["ion-content[_ngcontent-%COMP%]{--background: #ffffff;font-family:Rockwell}.centered[_ngcontent-%COMP%]{position:absolute;top:35%;transform:translateY(-25%)}.title-container[_ngcontent-%COMP%]{width:100%;text-align:center;display:flex;flex-direction:row;justify-content:center}.title-container[_ngcontent-%COMP%]   .login-title[_ngcontent-%COMP%]{font-size:30px}.login-input-container[_ngcontent-%COMP%]{width:90%;margin:0 auto}.fullname-container[_ngcontent-%COMP%], .username-container[_ngcontent-%COMP%]{margin-top:20px;margin-bottom:30px}.login-button-container[_ngcontent-%COMP%]{width:100%;margin-top:20px}ion-header[_ngcontent-%COMP%]{--background: white;border:none;--border-color: white}ion-toolbar[_ngcontent-%COMP%]{--background: white;border:none;--border-color: white}.login-text-container[_ngcontent-%COMP%]{width:100%;text-align:center;color:#666;margin-top:20px}#phrase-container[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;justify-content:center;width:100%;margin-left:auto;margin-right:auto}.phrase[_ngcontent-%COMP%]{font-family:Rockwell;font-size:30px;color:#7f7f7f;-webkit-user-select:text;user-select:text}#phrase-instructions[_ngcontent-%COMP%]{font-family:Rockwell;font-size:22px;color:#7f7f7f;width:90%;margin:10px auto 0}lottie-player[_ngcontent-%COMP%]{width:200px;text-align:center}"],data:{animation:[(0,r.X$)("login",[(0,r.SB)("focused",(0,r.oB)({color:"#00eabb"})),(0,r.SB)("blurred",(0,r.oB)({color:"#666"})),(0,r.eR)("focused <=> blurred",[(0,r.jt)("0.1s")])]),(0,r.X$)("createForm",[(0,r.eR)(":leave",[(0,r.oB)({position:"fixed",width:"100%"}),(0,r.jt)("0.3s ease-in",(0,r.oB)({transform:"translateX(-100%)"}))])]),(0,r.X$)("showPhrase",[(0,r.eR)(":leave",[(0,r.jt)("0.3s ease-in",(0,r.oB)({transform:"translateX(0%)"}))]),(0,r.eR)(":enter",[(0,r.oB)({transform:"translateX(100%)"}),(0,r.jt)("0.3s 0.1s ease-out",(0,r.oB)({transform:"translateX(0%)"}))])])]}}),o})()}];let A=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[u.Bz.forChild(P),u.Bz]}),o})();var b=i(822);let T=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[d.ez,g.u5,s.Pc,A,b.K]}),o})()}}]);