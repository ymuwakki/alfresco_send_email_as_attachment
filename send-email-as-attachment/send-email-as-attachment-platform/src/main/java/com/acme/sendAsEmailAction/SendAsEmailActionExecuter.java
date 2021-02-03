/**
 * Copyright (C) 2015 Alfresco Software Limited.
 * <p/>
 * This file is part of the Alfresco SDK Samples project.
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.acme.sendAsEmailAction;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.action.ParameterDefinitionImpl;
import org.alfresco.repo.action.executer.ActionExecuterAbstractBase;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.action.Action;
import org.alfresco.service.cmr.action.ParameterDefinition;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.namespace.QName;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.activation.DataHandler;
import javax.activation.MimetypesFileTypeMap;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.*;

/**
 * Alfresco Repository Action that can send emails with file attachments.
 *
 * see http://docs.alfresco.com/5.2/references/dev-extension-points-actions.html
 * @author martin.bergljung@alfresco.com
 */
public class SendAsEmailActionExecuter extends ActionExecuterAbstractBase {
    private static Log logger = LogFactory.getLog(SendAsEmailActionExecuter.class);
    
    Properties properties;
    private String mailhost = "";
    private String mailport = "25";

    public static final String NAME = "send-as-email";
    public static final String PARAM_EMAIL_TO_NAME = "to";
    public static final String PARAM_EMAIL_CC_NAME = "cc";
    public static final String PARAM_EMAIL_FROM_NAME = "from";
    public static final String PARAM_EMAIL_SUBJECT_NAME = "subject";
    public static final String PARAM_EMAIL_BODY_NAME = "body_text";
    
    private static final String MAIL_HOST = "mail.host";
    private static final String MAIL_PORT = "mail.port";

    /**
     * The Alfresco Service Registry that gives access to all public content services in Alfresco.
     */
    private ServiceRegistry serviceRegistry;

    public void setServiceRegistry(ServiceRegistry serviceRegistry) {
        this.serviceRegistry = serviceRegistry;
    }

    public String getMailhost() {
		return this.mailhost;
	}

	public void setMailhost(String mailhost) {
		this.mailhost = mailhost;
    }
    
    public String getMailport() {
		return this.mailport;
    }
    
    public void setMailport(String mailport) {
		this.mailport = mailport;
    }

	@Override
    protected void addParameterDefinitions(List<ParameterDefinition> paramList) {
        for (String s : new String[]{PARAM_EMAIL_TO_NAME, PARAM_EMAIL_SUBJECT_NAME, PARAM_EMAIL_BODY_NAME}) {
            paramList.add(new ParameterDefinitionImpl(s, DataTypeDefinition.TEXT, true, getParamDisplayLabel(s)));
        }
    }

    @Override
    protected void executeImpl(Action action, NodeRef actionedUponNodeRef) {
        if (serviceRegistry.getNodeService().exists(actionedUponNodeRef) == true) {
            // Get the email properties entered via Share Form
            String to = (String) action.getParameterValue(PARAM_EMAIL_TO_NAME);
            String cc = (String) action.getParameterValue(PARAM_EMAIL_CC_NAME);
            String from = (String) action.getParameterValue(PARAM_EMAIL_FROM_NAME);
            String subject = (String) action.getParameterValue(PARAM_EMAIL_SUBJECT_NAME);
            String body = (String) action.getParameterValue(PARAM_EMAIL_BODY_NAME);

            // Get document filename
            Serializable filename = serviceRegistry.getNodeService().getProperty(
                    actionedUponNodeRef, ContentModel.PROP_NAME);
            if (filename == null) {
                throw new AlfrescoRuntimeException("Document filename is null");
            }
            String documentName = (String) filename;

            try {
            	// Get mail server details from global properties
                //String mailhost = properties.getProperty(MAIL_HOST);
                //String mailport = properties.getProperty(MAIL_PORT);
                   
                // Create mail session
                Properties mailServerProperties = new Properties();
                mailServerProperties.put("mail.smtp.host", getMailhost());
                mailServerProperties.put("mail.smtp.port", getMailport());
                Session session = Session.getDefaultInstance(mailServerProperties, null);
                session.setDebug(false);

                // Define message
                Message message = new MimeMessage(session);
                
                // need to look up from as this is a username
                NodeRef userNodeRef = serviceRegistry.getPersonService().getPerson(from);
                String userEmail = "noreply@acme";
                if (userNodeRef != null) {
                	userEmail = (String)serviceRegistry.getNodeService().getProperty(userNodeRef, ContentModel.PROP_EMAIL);
                }
                
                logger.debug("mailhost <" + getMailhost() + "> mailport <" + getMailhost() + ">");
                logger.debug("userEmail <" + userEmail + "> to <" + to + "> cc < " + cc + "> subject <" + subject + ">");
                logger.debug("Mail Session Properties: " + session.getProperties().toString());
    							
                message.setFrom(new InternetAddress(userEmail));

                if (to != null && to.contains(",") ) {
                	message.addRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
                } else if (to != null && !to.trim().isEmpty()){
                	message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
                }
                if (cc != null && cc.contains(",")) {
                	message.addRecipients(Message.RecipientType.CC, InternetAddress.parse(cc));
                } else if (cc != null && !cc.trim().isEmpty()) {
                	message.addRecipient(Message.RecipientType.CC, new InternetAddress(cc));
                }
                message.setSubject(subject);

                // Create the message part with body text
                BodyPart messageBodyPart = new MimeBodyPart();
                messageBodyPart.setText(body);
                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(messageBodyPart);

                // Create the Attachment part
                //
                //  Get the document content bytes
                byte[] documentData = getDocumentContentBytes(actionedUponNodeRef, documentName);
                if (documentData == null) {
                    throw new AlfrescoRuntimeException("Document content is null");
                }
                //  Attach document
                messageBodyPart = new MimeBodyPart();
                messageBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(
                        documentData, new MimetypesFileTypeMap().getContentType(documentName))));
                messageBodyPart.setFileName(documentName);
                multipart.addBodyPart(messageBodyPart);

                // Put parts in message
                message.setContent(multipart);
                // Send mail
                Transport.send(message);

                // Set status on node as "sent via email"
                Map<QName, Serializable> properties = new HashMap<QName, Serializable>();
                properties.put(ContentModel.PROP_ORIGINATOR, from);
                properties.put(ContentModel.PROP_ADDRESSEE, to);
                properties.put(ContentModel.PROP_ADDRESSEES, cc);
                properties.put(ContentModel.PROP_SUBJECT, subject);
                properties.put(ContentModel.PROP_SENTDATE, new Date());
                serviceRegistry.getNodeService().addAspect(actionedUponNodeRef, ContentModel.ASPECT_EMAILED, properties);
            } catch (MessagingException me) {
                me.printStackTrace();
                throw new AlfrescoRuntimeException("Could not send email: " + me.getMessage());
            }
        }
    }

    /**
     * Get the content bytes for the document with passed in node reference.
     *
     * @param documentRef      the node reference for the document we want the content bytes for
     * @param documentFilename document filename for logging
     * @return a byte array containing the document content or null if not found
     */
    private byte[] getDocumentContentBytes(NodeRef documentRef, String documentFilename) {
        // Get a content reader
        ContentReader contentReader = serviceRegistry.getContentService().getReader(
                documentRef, ContentModel.PROP_CONTENT);
        if (contentReader == null) {
            logger.error("Content reader was null [filename=" + documentFilename + "][docNodeRef=" + documentRef + "]");

            return null;
        }

        // Get the document content bytes
        InputStream is = contentReader.getContentInputStream();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] documentData = null;

        try {
            byte[] buf = new byte[1024];
            int len = 0;
            while ((len = is.read(buf)) > 0) {
                bos.write(buf, 0, len);
            }
            documentData = bos.toByteArray();
        } catch (IOException ioe) {
            logger.error("Content could not be read: " + ioe.getMessage() +
                    " [filename=" + documentFilename + "][docNodeRef=" + documentRef + "]");
            return null;
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (Throwable e) {
                    logger.error("Could not close doc content input stream: " + e.getMessage() +
                            " [filename=" + documentFilename + "][docNodeRef=" + documentRef + "]");
                }
            }
        }

        return documentData;
    }
}
