import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
//import ProspernaLogo from "../../../../../assets/images/logo-dark.svg";
import Facebook from "../../../../../assets/images/social/facebook.png";
import Twitter from "../../../../../assets/images/social/Twitter.png";
import Instagram from "../../../../../assets/images/social/instagram.png";
import LinkedIn from "../../../../../assets/images/social/linkedin.png";
//import Youtube from "../../../../../assets/images/social/Youtube.png";
import Quill from 'react-quill';
import { EmailTemplates } from '../../../../../api/Email';
import MyNotification from '../../../../../components/Shared/Custom/notification';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import "react-quill/dist/quill.snow.css";

const BlockEmbed = Quill.Quill.import('blots/block/embed');

const socialMedia = [Facebook, Twitter, LinkedIn, Instagram];

class HeaderBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.innerHTML = value;
        node.setAttribute('contenteditable', 'false');
        return node;
    }

    static value(node) {
        return node.innerHTML;
    }
}

HeaderBlot.blotName = 'headerBlot';
HeaderBlot.tagName = 'div';
HeaderBlot.className = 'non-editable-header';

Quill.Quill.register(HeaderBlot);
class FooterBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.innerHTML = value;
        node.setAttribute('contenteditable', 'false');
        return node;
    }

    static value(node) {
        return node.innerHTML;
    }
}

FooterBlot.blotName = 'footerBlot';
FooterBlot.tagName = 'div';
FooterBlot.className = 'non-editable-footer';

Quill.Quill.register(FooterBlot);

const socialMediaHTML = socialMedia.map(
    (social, index) => `<img key=${index} src=${social} alt="social" height="25" class="" />`
  ).join('');

const EditEmailTemplate = ({
    htmlString, 
    setHtmlString, 
    selectedStoreLogoStyle, 
    storeLogo, 
    storeName, 
    storeAddress, 
    keyProp,
    showEdit,
    emailSubject,
    setIsEdited,
    handleActionClick,
    emailName,
}) => {
    const { t } = useTranslation();
    const quillRef = useRef(null); // Ref for Quill editor
    const [isBlotsInserted, setIsBlotsInserted] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isOpenLivePreview, setIsOpenLivePreview] = useState(false);
    const [livePreview, setLivePreview] = useState('');
    const [newHtmlString, setNewHtmlString] = useState(htmlString);

    const headerHTML = `
        <div class="row bg-header py-2">
            <div class="col d-flex align-items-center justify-content-center">
                <figure class="border d-flex justify-content-center align-items-center store-logo-preview overflow-hidden ${
                    selectedStoreLogoStyle === "Rounded" ? "logo-rounded" : selectedStoreLogoStyle === "Circle" ? "logo-circle" : ""
                }">
                    <img style="height: 50px; width: 50px;" alt="Store Logo" src="${storeLogo}" class="mb-0" />
                </figure>
                <h3 class="text-lg ms-2">${storeName || ''}</h3>
            </div>
        </div>
    `;

    const footerHTML = `
    <div class="my-0 row bg-light py-2">
        <div class="d-flex justify-content-center gap-3 col-12 py-1">
            ${socialMediaHTML}
        </div>
        <div class="d-flex justify-content-center col-12 mt-2  py-1">
            <p>${storeAddress}</p>
        </div>
    </div>
    `;

    useEffect(() => {
        if (quillRef.current && !isBlotsInserted) {
            const quill = quillRef.current.getEditor();
    
            quill.setText(''); 
    
            quill.insertEmbed(0, 'headerBlot', headerHTML);

            if (newHtmlString) {
                quill.clipboard.dangerouslyPasteHTML(1, htmlString);
            }
            quill.insertEmbed(quill.getLength(), 'footerBlot', footerHTML);
            
            setIsBlotsInserted(true); 
        }
    }, [isBlotsInserted, quillRef, newHtmlString]);

    const handleChange = (content) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        setLivePreview(content);
    
        const nonEditableHeader = tempDiv.querySelector('.non-editable-header');
        const nonEditableFooter = tempDiv.querySelector('.non-editable-footer');
    
        if (nonEditableHeader) {
            nonEditableHeader.remove();
        }
        
        if (nonEditableFooter) {
            nonEditableFooter.remove();
        }
    
        const updatedContent = tempDiv.innerHTML;
    
        //console.log("Edited content (without header/footer): ", updatedContent);
    
        setEditedContent(updatedContent); // Update state with the new content
        setNewHtmlString(content);
    };

    useEffect(() => {
        // Compare new and old HTML strings
        if (editedContent !== htmlString) {
            setIsEdited(true); // Set edited state if they are different
        } else {
            setIsEdited(false); // Reset if they are the same
        }
    }, [editedContent, htmlString]);

    // Use the mutation for saving email content with success and error handling
    const saveEmailContentMutation = EmailTemplates.useSaveEmailContent({
        onSuccess: (response) => {
            MyNotification(true, "", t(response.message)); // Show success notification
        },
        onError: (error) => {
            MyNotification(false, "", t(error.message)); // Show error notification
        },
    });


    // Inside your component
    const [inputValue, setInputValue] = useState(emailSubject);

    const handleSave = async () => {
        try {
            await saveEmailContentMutation.mutateAsync({
                key: keyProp,
                html_string: editedContent, // Use the state variable here
                subject: inputValue,
            });
            // Optionally handle success, e.g., show a success message
        } catch (error) {
            // Handle error, e.g., show an error message
            console.error("Error saving email content:", error);
        }
    };

    return (
        <div className="edit-email-template">
            <div className="gap-2 flex-column d-flex">
                <input
                    type="text"
                    value={inputValue}
                    className="form-control"
                    onChange={(e) => setInputValue(e.target.value)} // Handle changes
                />
                {/*<p className=" d-inline-block mb-1 text-black fw-bold text-sm">
                    {t(fields.custom_message_body.label)}
                </p>*/}
                {keyProp}
                <ReactQuill
                    ref={quillRef}
                    value={newHtmlString || ""}
                    onChange={handleChange}
                    modules={{ 
                        toolbar: [
                            [{ 'font': [] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'align': [] }],
                            ['link', 'image', 'video'],
                            ['blockquote', 'code-block'],
                            ['clean'],
                        ],
                    }}
                />
                <Row className="my-3 gap-2 d-flex justify-space-between">
                    <Col className="my-3 gap-2 d-flex justify-content-start">
                    {showEdit ? (
                        <Button variant="light" className="fw-semibold px-4" onClick={() => handleActionClick('reset', keyProp, emailName)}>
                            {t("Reset")}
                        </Button>
                        ) : (
                            null
                        )
                    }
                    </Col>
                    <Col className="my-3 gap-2 d-flex justify-content-end">
                        <Button variant="light" className="fw-semibold px-4" onClick={() => setIsOpenLivePreview(true)}>
                            {t("Preview")}
                        </Button>
                        <Button className="fw-semibold px-4" onClick={handleSave}>
                            {t("Save")}
                        </Button>
                    </Col>
                </Row>
                <Modal
                    show={isOpenLivePreview}
                    size="lg"
                    centered
                    onHide={() => setIsOpenLivePreview(false)}
                >
                    <Modal.Header className="m-0 p-1 bg-primary rounded-0">
                    </Modal.Header>
                    <Modal.Body className="pb-0">
                        <div className="d-flex flex-column" dangerouslySetInnerHTML={{ __html: livePreview }} />
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default EditEmailTemplate;