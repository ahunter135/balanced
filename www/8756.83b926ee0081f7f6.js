"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8756],{8756:(c,s,i)=>{i.r(s),i.d(s,{HapticsWeb:()=>u});var r=i(5861),o=i(2726),n=i(3549);class u extends o.Uw{constructor(){super(...arguments),this.selectionStarted=!1}impact(t){var e=this;return(0,r.Z)(function*(){const a=e.patternForImpact(null==t?void 0:t.style);e.vibrateWithPattern(a)})()}notification(t){var e=this;return(0,r.Z)(function*(){const a=e.patternForNotification(null==t?void 0:t.type);e.vibrateWithPattern(a)})()}vibrate(t){var e=this;return(0,r.Z)(function*(){e.vibrateWithPattern([(null==t?void 0:t.duration)||300])})()}selectionStart(){var t=this;return(0,r.Z)(function*(){t.selectionStarted=!0})()}selectionChanged(){var t=this;return(0,r.Z)(function*(){t.selectionStarted&&t.vibrateWithPattern([70])})()}selectionEnd(){var t=this;return(0,r.Z)(function*(){t.selectionStarted=!1})()}patternForImpact(t=n.y$.Heavy){return t===n.y$.Medium?[43]:t===n.y$.Light?[20]:[61]}patternForNotification(t=n.k$.Success){return t===n.k$.Warning?[30,40,30,50,60]:t===n.k$.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(t){if(!navigator.vibrate)throw this.unavailable("Browser does not support the vibrate API");navigator.vibrate(t)}}}}]);