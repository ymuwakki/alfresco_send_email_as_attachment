<div id="${args.htmlid}-dialog" class="send-as-email">
 <div id="${args.htmlid}-title" class="hd"></div>
 <div class="bd">
  <div class="form-container">
   <form id="${args.htmlid}-form" method="post" accept-charset="utf-8" 
         enctype="application/json">
    <input id="${args.htmlid}-form-destination" 
       name="alf_destination" type="hidden" value="" />
    <div id="${args.htmlid}-form-fields" class="form-fields">
     <div class="set">
      <div class="form-field">
       <label for="${args.htmlid}-prop_sendasemail_to" class="">
        ${msg('actions.acme.send-as-email.to')}
       </label>
       <input id="${args.htmlid}-prop_sendasemail_to" type="text" tabindex="1" 
           name="prop_sendasemail_to" 
           title="${msg('actions.acme.send-as-email.to')}:" maxlength="255"/>
      </div>
      <div>     
      <label for="${args.htmlid}-prop_sendasemail_cc" class="">
        ${msg('actions.acme.send-as-email.cc')}
       </label>
       <input id="${args.htmlid}-prop_sendasemail_cc" type="text" tabindex="2" 
           name="prop_sendasemail_cc" 
           title="${msg('actions.acme.send-as-email.cc')}:" maxlength="255"/>
      </div>
      <div>
      <label for="${args.htmlid}-prop_sendasemail_subject" class="">
        ${msg('actions.acme.send-as-email.subject')}
       </label>
       <input id="${args.htmlid}-prop_sendasemail_subject" type="text" tabindex="3" 
           name="prop_sendasemail_subject" 
           title="${msg('actions.acme.send-as-email.subject')}:" maxlength="255"/>
      </div>
      <div>
      <label for="${args.htmlid}-prop_sendasemail_message" class="">
        ${msg('actions.acme.send-as-email.message')}
       </label>
       <textarea id="${args.htmlid}-prop_sendasemail_message" tabindex="4" 
           name="prop_sendasemail_message" 
           title="${msg('actions.acme.send-as-email.message')}:" rows="10" cols="80">
       </textarea>
      </div>               
     </div>
    </div>
    <div id="${args.htmlid}-form-buttons" class="form-buttons">
     <input id="${args.htmlid}-ok" type="submit" value="Ok" />&nbsp;
     <input id="${args.htmlid}-cancel" type="button" value="Cancel" />
    </div>                           
   </form>
  </div>
 </div>
</div>
