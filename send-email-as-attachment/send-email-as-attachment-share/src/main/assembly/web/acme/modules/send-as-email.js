if (typeof ACME == "undefined" || !ACME) {
    var ACME = {};
}

if (typeof ACME.module == "undefined" || !ACME.module) {
    ACME.module = {};
}


/**
 * hold-copy module
 *
 *
 *
 * @namespace ACME.module
 * @class ACME.module.DoclibSendAsEmail
 */
(function() {

	var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Element = YAHOO.util.Element,
    Bubbling = YAHOO.Bubbling,
    KeyListener = YAHOO.util.KeyListener
    nodeRef = "";

    /**
     * CreateSite constructor.
     *
     * @param htmlId {string} A unique id for this component
     * @return {Alfresco.CreateSite} The new DocumentList instance
     * @constructor
     */
    ACME.module.DoclibSendAsEmail = function(containerId) {
        var instance = Alfresco.util.ComponentManager.get(this.id);
        if (instance !== null) {
            throw new Error("An instance of ACME.module.DoclibSendAsEmail already exists.");
        }

        ACME.module.DoclibSendAsEmail.superclass.constructor.call(this, "ACME.module.DoclibSendAsEmail", containerId, ["menu", "button", "container", "connection", "selector", "json", "datatable", "paginator", "datasource"]);
        return this;
    };

    YAHOO.extend(ACME.module.DoclibSendAsEmail, Alfresco.component.Base, {
        members : [],

        options : {
            /**
             * Current siteId for site view mode.
             *
             * @property siteId
             * @type string
             */
            siteId : "",

            /**
             * Current site's title for site view mode.
             *
             * @property siteTitle
             * @type string
             */
            siteTitle : "",

            /**
             * ContainerId representing root container in site view mode
             *
             * @property containerId
             * @type string
             * @default "documentLibrary"
             */
            containerId : "documentLibrary",

            /**
             * ContainerType representing root container in site view mode
             *
             * @property containerType
             * @type string
             * @default "cm:folder"
             */
            containerType : "cm:folder",

            /**
             * Root node representing root container in repository view mode
             *
             * @property rootNode
             * @type string
             * @default "alfresco://company/home"
             */
            rootNode : "alfresco://company/home",

            /**
             * NodeRef representing root container in user home view mode
             *
             * @property userHome
             * @type string
             * @default "alfresco://user/home"
             */
            userHome : "alfresco://user/home",

            /**
             * Initial path to expand on module load
             *
             * @property path
             * @type string
             * @default ""
             */
            path : "",

            /**
             * Initial node to expand on module load.
             *
             * If given this module will make a call to repo and find the path for the node and figure
             * out if its inside a site or not. If inside a site the site view mode  will be used, otherwise
             * it will switch to repo mode.
             *
             * @property pathNodeRef
             * @type string
             * @default ""
             */
            pathNodeRef : null,

            /**
             * Width for the dialog
             *
             * @property width
             * @type integer
             * @default 40em
             */
            width : "40em",

            /**
             * Files to action
             *
             * @property files
             * @type object
             * @default null
             */
            files : null,

            /**
             * Template URL
             *
             * @property templateUrl
             * @type string
             * @default Alfresco.constants.URL_SERVICECONTEXT + "modules/documentlibrary/send-as-email"
             */
            templateUrl : Alfresco.constants.URL_SERVICECONTEXT + "modules/documentlibrary/send-as-email",

            /**
             * WebScript name
             *
             * @property dataWebScript
             * @type string
             * @default "send-as-email"
             */
            dataWebScript : "send-as-email"
        },

        /**
         * Set multiple initialization options at once.
         *
         * @method setOptions
         * @override
         * @param obj {object} Object literal specifying a set of options
         * @return {Alfresco.module.DoclibMoveTo} returns 'this' for method chaining
         */
        setOptions : function DLHC_setOptions(obj) {
            var myOptions = {};
            // Actions module
            this.modules.actions = new Alfresco.module.DoclibActions();
            return ACME.module.DoclibSendAsEmail.superclass.setOptions.call(this, YAHOO.lang.merge(myOptions, obj));
        },

        /**
         * Main entry point
         * @method showDialog
         */
        showDialog : function DLHC_showDialog() {
            if (!this.containerDiv) {
                // Load the UI template from the server
                Alfresco.util.Ajax.request({
                    url : this.options.templateUrl,
                    dataObj : {
                        htmlid : this.id
                    },
                    successCallback : {
                        fn : this.onTemplateLoaded,
                        scope : this
                    },
                    failureMessage : this.options.templateFailMessage,
                    execScripts : true
                });
            } else {
                // Show the dialog
                this._beforeShowDialog();
            }
        },

        /**
         * YUI WIDGET EVENT HANDLERS
         * Handlers for standard events fired from YUI widgets, e.g. "click"
         */

        /**
         * Dialog OK button event handler
         *
         * @method onOK
         * @param e {object} DomEvent
         * @param p_obj {object} Object passed back from addListener method
         */
        onOK : function DLHC_onOK(e, p_obj) {        	
            // Close dialog and fire event so other components may use the selected folder
            this.widgets.escapeListener.disable();
            this.widgets.dialog.hide();
            
            var files, multipleFiles = [], params, i, j;

            // Single/multi files into array of nodeRefs
            if (YAHOO.lang.isArray(this.options.files)) {
                files = this.options.files;
            } else {
                files = [this.options.files];
            }
            for ( i = 0, j = files.length; i < j; i++) {
                multipleFiles.push(files[i].node.nodeRef);
            }

            // Get To
            var toEl = Dom.get(this.id + "-prop_sendasemail_to");
            var to = toEl.value;
            var ccEl = Dom.get(this.id + "-prop_sendasemail_cc");
            var cc = ccEl.value;
            var subjectEl = Dom.get(this.id + "-prop_sendasemail_subject");
            var subject = subjectEl.value;
            var messageEl = Dom.get(this.id + "-prop_sendasemail_message");
            var message = messageEl.value;
            
            
            // Success callback function
            var fnSuccess = function DLHC__onOK_success(p_data) {
                var result;

                this.widgets.dialog.hide();

                // Did the operation succeed?
//                if (!p_data.json || !p_data.json.success) {
//                    Alfresco.util.PopupManager.displayMessage({
//                        text : this.msg("actions.acme.send-as-email.failure", "darren")
//                    });
//                    return;
//                }

                YAHOO.Bubbling.fire("metadataRefresh");
                
                Alfresco.util.PopupManager.displayMessage({
                		text : this.msg("actions.acme.send-as-email.message.success", this.options.files.displayName)
                	});
            };

            // Failure callback function
            var fnFailure = function DLCMT__onOK_failure(p_data) {
                this.widgets.dialog.hide();

                Alfresco.util.PopupManager.displayMessage({
                    text : this.msg("actions.acme.send-as-email.message.failure", this.options.files.displayName)
                });
            };

            // Construct webscript URI based on current viewMode
            var webscriptName = this.options.dataWebScript;

            // Construct the data object for the genericAction call
            this.modules.actions.genericAction({
                success : {
                	event: {
                		name: "metadataRefresh"
                	},
                    callback : {
                        fn : fnSuccess,
                        scope : this
                    }
                },
                failure : {
                    callback : {
                        fn : fnFailure,
                        scope : this
                    }
                },
                webscript : {
                    method : Alfresco.util.Ajax.POST,
                    stem : Alfresco.constants.PROXY_URI + "slingshot/acme/",
                    name : webscriptName,
                    params : {
                        "nodeRef" : nodeRef.uri
                    }
                },
                wait : {
                    message : this.msg("message.please-wait")
                },
                config : {
                    requestContentType : Alfresco.util.Ajax.JSON,
                    dataObj : {
                        nodeRefs : multipleFiles,
                        parentId : this.options.parentId,
                        "nodeRef" : this.options.files.node.nodeRef,
                        "from" : Alfresco.constants.USERNAME,
                        "to": to, 
                        "cc": cc,
                        "subject": subject,
                        "message" : message
                    }
                }
            });

            //this.widgets.okButton.set("disabled", true);
            //this.widgets.cancelButton.set("disabled", true);
        },
        /**
         * Dialog Cancel button event handler
         *
         * @method onCancel
         * @param e
         *            {object} DomEvent
         * @param p_obj
         *            {object} Object passed back from addListener method
         */
        onCancel : function DLHC_onCancel(e, p_obj) {
            this.widgets.escapeListener.disable();
            this.widgets.dialog.hide();
        },

        /**
         * Event callback when dialog template has been loaded
         *
         * @method onTemplateLoaded
         * @param response {object} Server response from load template XHR request
         */
        onTemplateLoaded : function DLHC_onTemplateLoaded(response) {
            // Reference to self - used in inline functions
            var me = this;

            // Inject the template from the XHR request into a new DIV element
            this.containerDiv = document.createElement("div");
            this.containerDiv.setAttribute("style", "display:none");
            this.containerDiv.innerHTML = response.serverResponse.responseText;

            // The panel is created from the HTML returned in the XHR request, not the container
            var dialogDiv = Dom.getFirstChild(this.containerDiv);

            // Create and render the YUI dialog
            this.widgets.dialog = Alfresco.util.createYUIPanel(dialogDiv, {
                width : this.options.width
            });

            // OK button
            this.widgets.okButton = Alfresco.util.createYUIButton(this, "ok", this.onOK);

            // Cancel button
            this.widgets.cancelButton = Alfresco.util.createYUIButton(this, "cancel", this.onCancel);


            this._beforeShowDialog();
        },

        /**
         * Updates the currently selected node.
         * @method _updateSelectedNode
         * @param node {object} New node to set as currently selected one
         * @private
         */
        _updateSelectedNode : function DLHC__updateSelectedNode(node) {
            Alfresco.logger.debug("DLHC__updateSelectedNode");
            this.selectedNode = node;
        },

        /**
         * Internal function called before show dialog function so additional information may be loaded
         * before _showDialog (which might be overriden) is called.
         *
         * @method _beforeShowDialog
         */
        _beforeShowDialog : function DLHC__beforeShowDialog() {
            this._showDialog();
        },

        /**
         * Internal show dialog function
         * @method _showDialog
         */
        _showDialog : function DLHC__showDialog() {
            // Enable buttons
            //this.widgets.okButton.set("disabled", false);
            //this.widgets.cancelButton.set("disabled", false);

            // Dialog title
            var titleDiv = Dom.get(this.id + "-title");
            if (this.options.title) {
                titleDiv.innerHTML = this.options.title;
            } else {
                if (YAHOO.lang.isArray(this.options.files)) {
                    titleDiv.innerHTML = this.msg("acme.send-as-email.title.multi", this.options.files.length);
                } else {
                    titleDiv.innerHTML = this.msg("acme.send-as-email.title.single", '<span class="light">' + this.options.files.displayName + '</span>');
                }
            }

            // Register the ESC key to close the dialog
            if (!this.widgets.escapeListener) {
                this.widgets.escapeListener = new KeyListener(document, {
                    keys : KeyListener.KEY.ESCAPE
                }, {
                    fn : function(id, keyEvent) {
                        this.onCancel();
                    },
                    scope : this,
                    correctScope : true
                });
            }

            // Show the dialog
            this.widgets.escapeListener.enable();
            this.widgets.dialog.show();
        }
    });
})();
