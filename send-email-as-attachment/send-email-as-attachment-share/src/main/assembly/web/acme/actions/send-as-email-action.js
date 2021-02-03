(function() {
    /**
     * @author Yasser Muwakki
     * 
     * Method loads and executes SendAsEmal Module
     */
    YAHOO.Bubbling.fire("registerAction", {
        actionName : "onActionSendAsEmail",
        fn : function ACME_onActionSendAsEmail(record) {
        	// Check mode is an allowed one
            this.modules.sendAsEmail = new ACME.module.DoclibSendAsEmail(this.id + "-send-as-email");

            this.modules.sendAsEmail.setOptions({
                siteId : this.options.siteId,
                containerId : this.options.containerId,
                path : this.currentPath,
                files : record,
                rootNode : this.options.rootNode,
                parentId : this.getParentNodeRef(record)
            }).showDialog();
        }
    });
})();
