/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddNewTemplateForm } from './useAddNewTemplateForm';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import FormTextField from '../../../components/BootstrapFormik/FormTextField';
import MyNotification from '../../../components/Shared/Custom/notification';
import './pageBuilder.scss';
import { Col, Row } from 'react-bootstrap';
import { PageBuilderAPI } from '../../../api/BusinessProfile/PageBuilder';
import { useSelector } from 'react-redux';
import SpecificPages from './components/SpecificPages';
import './templateBuilder.scss';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { ModalWarningIcon } from '../../../components/Shared/Custom/svg';

export const AddNewTemplateForm = ({
  modalAddNewTemplateTrigger,
  setModalAddNewTemplateTrigger,
  isQuickEdit,
  data,
}) => {
  const { schema, fields, initialValues } = useAddNewTemplateForm(data);
  const [templateURL, setTemplateURL] = useState('blank');

  const { data: dataAvailablePages } = PageBuilderAPI.useGetAvailablePages({});

  /**
   * @desc ran when form is submitted successfully
   * @param {object} formValues - form fields specified in the schema with its updated values
   * @param {object} actions - formik actions (methods and properties you can use like actions.resetForm())
   */

  const [showBuilder, setShowBuilder] = useState(false);

  const storeAccount = useSelector((state) => state.account.storeDetails);

  const addNewTemplate = PageBuilderAPI.useAddNewTemplate({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewTemplateTrigger(false);
      !showBuilder &&
        (storeAccount?.customSubDomain?.includes('prodev')
          ? window.open(
              `http://prodev.prosperna.ph/builder/template/${templateURL}`,
              '_blank',
            )
          : storeAccount?.customSubDomain?.includes('prostage')
            ? window.open(
                `http://prostage.prosperna.ph/builder/template/${templateURL}`,
                '_blank',
              )
            : window.open(
                `http://p1.prosperna.com/builder/template/${templateURL}`,
                '_blank',
              ));
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const updateTemplate = PageBuilderAPI.useUpdateTemplate({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewTemplateTrigger(false);
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const onSubmitForm = (formValues, actions) => {
    const params = {
      template_name: formValues.template_name,
      template_type: formValues.template_type,
      page_applied: formValues.page_applied,
      selected_pages:
        formValues.page_applied === 'all_pages'
          ? true
          : formValues.page_applied === 'specific_pages'
            ? formValues.selected_pages
            : [],
      ...(data.id && { id: data.id }),
    };

    if (isQuickEdit) {
      updateTemplate.mutate(params);
    } else {
      addNewTemplate.mutate(params);
    }
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(formValues, actions) => onSubmitForm(formValues, actions)}
      enableReinitialize
    >
      <>
        <Modal
          show={modalAddNewTemplateTrigger}
          onHide={() => {
            setModalAddNewTemplateTrigger(false);
          }}
          backdrop="static"
          centered
          size="sm"
        >
          <FormBody
            fields={fields}
            setModalAddNewTemplateTrigger={setModalAddNewTemplateTrigger}
            setShowBuilder={setShowBuilder}
            isQuickEdit={isQuickEdit}
            setTemplateURL={setTemplateURL}
            customSubDomain={storeAccount?.customSubDomain}
            dataAvailablePages={dataAvailablePages}
            data={data}
          />
        </Modal>
      </>
    </Formik>
  );
};

const FormBody = ({
  fields,
  setModalAddNewTemplateTrigger,
  setShowBuilder,
  isQuickEdit,
  setTemplateURL,
  // customSubDomain,
  dataAvailablePages,
  data,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    setFieldValue,
    values,
    errors,
    isSubmitting,
    resetForm,
  } = useFormikContext();

  useEffect(() => {
    if (isSubmitting) {
      // errors from formik are objects (e.g. { generated_source: 'Required*', link_name: 'Required*', ...})
      let requiredFieldLabels = Object.entries(errors)
        // Filter only errors with 'Required*' message
        .filter(
          // eslint-disable-next-line no-unused-vars
          ([_, errorMessage]) => errorMessage.toLowerCase() === 'required*',
        );

      let requiredErrorMessage = 'Please complete all the required fields.';

      // if there are no errors
      if (requiredFieldLabels?.length === 0) {
        return;
      } else {
        MyNotification(false, '', requiredErrorMessage);
      }
    }
  }, [errors, isSubmitting]);

  const onCancelModal = () => {
    setModalAddNewTemplateTrigger(false);
    resetForm();
  };
  // const onSaveModal = () => {
  //   setShowBuilder(true);
  // };
  const onCreateModal = () => {
    setShowBuilder(false);
    setTemplateURL(values?.template_name?.replace(/\s/g, '-')?.toLowerCase());
  };

  const [showApplyToAllPagesModal, setShowApplyToAllPagesModal] =
    useState(false);

  const handleApplyToAllPagesModal = () => {
    setShowApplyToAllPagesModal(!showApplyToAllPagesModal);
  };

  const handleConfirmApplyToAllPagesModal = () => {
    setShowApplyToAllPagesModal(!showApplyToAllPagesModal);
    setSelectedRadioValue('all_pages');
    setFieldValue(fields.page_applied.id, 'all_pages');
  };

  const [selectedRadioValue, setSelectedRadioValue] = useState(
    fields.page_applied.value,
  );

  //on first load of modal
  useEffect(() => {
    resetForm();
    if (data?.selected_pages?.length === 0) {
      setSelectedRadioValue('');
      setFieldValue(fields.page_applied.id, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    setSelectedRadioValue(event.target.value);
    setFieldValue(fields.page_applied.id, event.target.value);
  };

  return (
    <FormikForm onSubmit={handleSubmit}>
      {!showApplyToAllPagesModal && (
        <>
          <Modal.Header closeButton className="border-0 pb-3">
            <Modal.Title className="mb-0">
              {isQuickEdit ? 'Edit Template' : 'Add New Template'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="new-page-modal">
            <Row>
              <Col sm={12}>
                <FormTextField
                  type={fields.template_name.type}
                  controlId={fields.template_name.id}
                  label={t(fields.template_name.label)}
                  name={fields.template_name.id}
                  required={fields.template_name.required}
                  placeholder={fields.template_name.placeholder}
                  underInputContent={t(
                    values?.template_name?.length > 0
                      ? values?.template_name?.length + '/50'
                      : 0 + '/50',
                  )}
                  maxLength={50}
                  className="mb-0 text-black"
                />
                <FormTextField
                  type={fields.template_type.type}
                  controlId={fields.template_type.id}
                  label={t(fields.template_type.label)}
                  name={fields.template_type.id}
                  required={fields.template_type.required}
                  placeholder={fields.template_type.placeholder}
                  value={fields.template_type.value}
                  className="mb-3 text-black"
                  disabled
                />
                <label className="text-black mb-2 form-label">Apply To</label>
                <div className="mb-3">
                  <Form.Check
                    type={fields.page_applied.type}
                    value="all_pages"
                    name={fields.page_applied.id}
                    label="All Pages"
                    className="mb-2"
                    onChange={() => {
                      setShowApplyToAllPagesModal(true);
                    }}
                    checked={selectedRadioValue === 'all_pages'}
                  />
                  <Form.Check
                    type={fields.page_applied.type}
                    value="specific_pages"
                    name={fields.page_applied.id}
                    label="Specific Pages"
                    className="mb-2"
                    onChange={handleRadioChange}
                    checked={selectedRadioValue === 'specific_pages'}
                    disabled={
                      isQuickEdit
                        ? dataAvailablePages?.length === 0 &&
                          data?.selected_pages?.length === 0
                        : dataAvailablePages?.length === 0
                    }
                  />
                  <Form.Check
                    type={fields.page_applied.type}
                    value=""
                    name={fields.page_applied.id}
                    label="None"
                    onChange={handleRadioChange}
                    checked={selectedRadioValue === ''}
                  />
                </div>

                {selectedRadioValue === 'specific_pages' && (
                  <div>
                    <h5 className="mb-3">Select Pages</h5>
                    <div
                      className={`selected-pages rounded px-2 ${
                        selectedRadioValue === 'specific_pages' ? 'border' : ''
                      }`}
                    >
                      {data?.selected_pages?.map((pages, index) => {
                        return (
                          <div key={index}>
                            <SpecificPages
                              id={pages.id}
                              label={pages.page_name}
                              slug={pages.slug}
                              fields={fields}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          </div>
                        );
                      })}
                      {dataAvailablePages?.map((pages, index) => {
                        return (
                          <div key={index}>
                            <SpecificPages
                              id={pages.id}
                              label={pages.page_name}
                              slug={pages.slug}
                              fields={fields}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-cancel" onClick={onCancelModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={onCreateModal}>
              {isQuickEdit ? 'Save' : 'Create Template'}
            </Button>
          </Modal.Footer>
        </>
      )}
      <ConfirmationDialog
        showConfirmation={showApplyToAllPagesModal}
        handleHideConfirmation={() => handleApplyToAllPagesModal()}
        handleConfirm={() => handleConfirmApplyToAllPagesModal()}
        backdrop="static"
        centered
        confirmName="Confirm"
        size="sm"
        id="unpublishTemplateModal"
        footerClassName="justify-content-center"
      >
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-column">
            <div className="text-center">
              <ModalWarningIcon />
            </div>
            <p className="text-center my-3 text-black fw-bold text-2xl">
              {t('Apply To All Pages')}
            </p>
            <p className="text-center">
              {t('You are about to apply this footer to all of your pages.')}
            </p>
            <p className="text-center">
              {t(
                'Applying this will automatically replace the current footer template applied to every page.',
              )}
            </p>
            <p className="text-center">{t('Would you like to proceed?')}</p>
          </div>
        </div>
      </ConfirmationDialog>
    </FormikForm>
  );
};
