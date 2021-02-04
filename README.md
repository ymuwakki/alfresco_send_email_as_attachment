# alfresco_send_email_as_attachment
This extension to Alfresco adds a new function in Alfresco share to send an email as an attachment. It contains 2 extensions. One to Alfresco content server and one to Alfresco share.

See https://github.com/Alfresco/alfresco-sdk/blob/master/docs/working-with-generated-projects/working-with-aio.md for instructions on how to build and run the application.

The extensions to Alfresco content server include the following main files:

src/main/java/com/acme/sendAsEmailAction/SendAsEmailActionExecuter.java
src/main/resources/alfresco/extension/templates/webscripts/acme/send-as-email.post.desc.xml
src/main/resources/alfresco/extension/templates/webscripts/acme/send-as-email.post.js
src/main/resources/alfresco/extension/templates/webscripts/acme/send-as-email.post.json.ftl
src/main/resources/alfresco/module/send-email-as-attachment-platform/context/bootstrap-context.xml	Spring file to load custom content model
src/main/resources/alfresco/module/send-email-as-attachment-platform/context/action-context.xml	Spring file to load custom actions (send as email)
src/main/resources/alfresco/module/send-email-as-attachment-platform/module-context.xml	Spring file to combine all custom context files for loading

And in Share the files were added:

src/main/assembly/web/acme/actions/send-as-email-action.js
src/main/assembly/web/acme/modules/send-as-email.js
src/main/resources/alfresco/module/send-email-as-attachment-share/messages/acme.properties
src/main/resources/alfresco/module/send-email-as-attachment-share/messages/acme_en_US.properties
src/main/resources/alfresco/web-extension/send-email-as-attachment-share-slingshot-application-context.xml
src/main/resources/alfresco/web-extension/site-data/extensions/acme-actions.xml
src/main/resources/alfresco/web-extension/site-webscripts/acme/send-as-email.get.desc.xml
src/main/resources/alfresco/web-extension/site-webscripts/acme/send-as-email.get.html.ftl
src/main/resources/alfresco/web-extension/site-webscripts/acme/send-as-email.get.properties
src/main/resources/META-INF/resources/components/documentlibrary/actions/msg-16.png

Also the following pom.xml files were updated to use AMP installation vs jar.  Share requires the AMP.

./pom.xml
./send-email-as-attachment-share/pom.xml
./send-email-as-attachment-share-docker/pom.xml

The code uses a fake SMTP server:
docker run -d --name fakesmtp -p 2525:25 -v /tmp/fakemail:/var/mail digiplant/fake-smtp

And the ./send-email-as-attachment-platform-docker/src/main/docker/alfresco-global.properties was updated to include:

# outbound email to localhost
mail.host=localhost
mail.port=2525
mail.from.default=alfresco@localhost.com
mail.encoding=UTF-8
