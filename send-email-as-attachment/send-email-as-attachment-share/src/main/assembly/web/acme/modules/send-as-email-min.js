if(typeof ACME=="undefined"||!ACME){var ACME={}}if(typeof ACME.module=="undefined"||!ACME.module){ACME.module={}}(function(){var h=YAHOO.util.Dom,k=YAHOO.util.Event,d=YAHOO.util.Element,b=YAHOO.Bubbling,c=YAHOO.util.KeyListener;nodeRef="";ACME.module.DoclibSendAsEmail=function(o){var n=Alfresco.util.ComponentManager.get(this.id);if(n!==null){throw new Error("An instance of ACME.module.DoclibSendAsEmail already exists.")}ACME.module.DoclibSendAsEmail.superclass.constructor.call(this,"ACME.module.DoclibSendAsEmail",o,["menu","button","container","connection","selector","json","datatable","paginator","datasource"]);return this};YAHOO.extend(ACME.module.DoclibSendAsEmail,Alfresco.component.Base,{members:[],options:{siteId:"",siteTitle:"",containerId:"documentLibrary",containerType:"cm:folder",rootNode:"alfresco://company/home",userHome:"alfresco://user/home",path:"",pathNodeRef:null,width:"40em",files:null,templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/send-as-email",dataWebScript:"send-as-email"},setOptions:function e(o){var n={};this.modules.actions=new Alfresco.module.DoclibActions();return ACME.module.DoclibSendAsEmail.superclass.setOptions.call(this,YAHOO.lang.merge(n,o))},showDialog:function m(){if(!this.containerDiv){Alfresco.util.Ajax.request({url:this.options.templateUrl,dataObj:{htmlid:this.id},successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:this.options.templateFailMessage,execScripts:true})}else{this._beforeShowDialog()}},onOK:function g(D,A){this.widgets.escapeListener.disable();this.widgets.dialog.hide();var p,G=[],F,B,y;if(YAHOO.lang.isArray(this.options.files)){p=this.options.files}else{p=[this.options.files]}for(B=0,y=p.length;B<y;B++){G.push(p[B].node.nodeRef)}var E=h.get(this.id+"-prop_sendasemail_to");var n=E.value;var x=h.get(this.id+"-prop_sendasemail_cc");var w=x.value;var r=h.get(this.id+"-prop_sendasemail_subject");var q=r.value;var C=h.get(this.id+"-prop_sendasemail_message");var u=C.value;var s=function t(I){var H;this.widgets.dialog.hide();YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("actions.acme.send-as-email.message.success",this.options.files.displayName)})};var v=function o(H){this.widgets.dialog.hide();Alfresco.util.PopupManager.displayMessage({text:this.msg("actions.acme.send-as-email.message.failure",this.options.files.displayName)})};var z=this.options.dataWebScript;this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},callback:{fn:s,scope:this}},failure:{callback:{fn:v,scope:this}},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"slingshot/acme/",name:z,params:{nodeRef:nodeRef.uri}},wait:{message:this.msg("message.please-wait")},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:G,parentId:this.options.parentId,nodeRef:this.options.files.node.nodeRef,from:Alfresco.constants.USERNAME,to:n,cc:w,subject:q,message:u}}})},onCancel:function l(n,o){this.widgets.escapeListener.disable();this.widgets.dialog.hide()},onTemplateLoaded:function j(n){var p=this;this.containerDiv=document.createElement("div");this.containerDiv.setAttribute("style","display:none");this.containerDiv.innerHTML=n.serverResponse.responseText;var o=h.getFirstChild(this.containerDiv);this.widgets.dialog=Alfresco.util.createYUIPanel(o,{width:this.options.width});this.widgets.okButton=Alfresco.util.createYUIButton(this,"ok",this.onOK);this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel",this.onCancel);this._beforeShowDialog()},_updateSelectedNode:function i(n){Alfresco.logger.debug("DLHC__updateSelectedNode");this.selectedNode=n},_beforeShowDialog:function a(){this._showDialog()},_showDialog:function f(){var n=h.get(this.id+"-title");if(this.options.title){n.innerHTML=this.options.title}else{if(YAHOO.lang.isArray(this.options.files)){n.innerHTML=this.msg("acme.send-as-email.title.multi",this.options.files.length)}else{n.innerHTML=this.msg("acme.send-as-email.title.single",'<span class="light">'+this.options.files.displayName+"</span>")}}if(!this.widgets.escapeListener){this.widgets.escapeListener=new c(document,{keys:c.KEY.ESCAPE},{fn:function(p,o){this.onCancel()},scope:this,correctScope:true})}this.widgets.escapeListener.enable();this.widgets.dialog.show()}})})();