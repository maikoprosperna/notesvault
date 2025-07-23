/* eslint-disable */
import { useEffect, useState } from 'react';
// import { AdminRewardsPromoCodes } from "../../../../api";
import { useTranslation } from 'react-i18next';
import { useAddNewPageForm } from './useAddNewPageForm';
// import { useCreatePromoCodeForm } from "./useCreatePromoCodeForm";
import { Formik, Form as FormikForm, Field, useFormikContext } from 'formik';
import { Button, Modal, Spinner } from 'react-bootstrap';
import FormTextField from '../../../components/BootstrapFormik/FormTextField';
import MyNotification from '../../../components/Shared/Custom/notification';
import './pageBuilder.scss';
// import { ErrorMessage } from "formik";
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import MetaTags from './components/MetaTags';
import { PageBuilderAPI } from '../../../api/BusinessProfile/PageBuilder';
import { useSelector } from 'react-redux';
// import fashionByYou from "../../../assets/images/fashion-by-you.png";
// import modernhome from "../../../assets/images/modernhomelanding.png";
import blank from '../../../assets/images/blank.png';
// import BetaBadge from "../../../components/BetaBadge";
import { StoreSettings } from '../../../api/StoreSettings';
import ModernHomeTheme from '../../../assets/files/themes/modern-home.json';
import ThemeCard from './components/ThemeCard';
import { createSlug } from '../../../utils';
import { useTrackingEvent } from '../../../hooks/useTrackingEvent';
import GenerateSEOForm from './components/GenerateSEOForm';

export const AddNewPageForm = ({
  modalAddNewPageTrigger,
  setModalAddNewPageTrigger,
  isQuickEdit,
  isPageNameEditable,
  data,
  selectedTheme,
  applyToAllStandardPages,
}) => {
  const { track } = useTrackingEvent();
  const { schema, fields, initialValues } = useAddNewPageForm(data);
  const [themePicker, setThemePicker] = useState('blank');
  const [showSEOForm, setShowSEOForm] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('');
  const [formAction, setFormAction] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const storeAccount = useSelector((state) => state.account.storeDetails);

  const addNewPage = PageBuilderAPI.useAddNewPage({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewPageTrigger(false);
      !showBuilder &&
        (storeAccount?.customSubDomain?.includes('prodev')
          ? window.open(
              `http://prodev.prosperna.ph/builder/${themePicker}`,
              '_blank',
            )
          : storeAccount?.customSubDomain?.includes('prostage')
            ? window.open(
                `http://prostage.prosperna.ph/builder/${themePicker}`,
                '_blank',
              )
            : window.open(
                `http://p1.prosperna.com/builder/${themePicker}`,
                '_blank',
              ));

      formAction.resetForm();
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  const updatePage = PageBuilderAPI.useUpdatePage({
    onSuccess: (data) => {
      MyNotification(true, '', data.message);
      setModalAddNewPageTrigger(false);
      formAction.resetForm();
    },
    onError: (error) => {
      MyNotification(false, '', error);
    },
  });

  // const UpdateDesignSettingsDispatch = StoreSettings.useUpdateDesignSettingsDispatch({
  //     onSuccess: (data) => {
  //         // savingCallback();
  //         MyNotification(true, "Design Settings", data);
  //     },
  //     onError: (error) => {
  //         MyNotification(false, "Design Settings", error.errors);
  //     },
  // });

  const { data: layoutsData, isFetching: layoutsDataIsFetching } =
    PageBuilderAPI.useGetLayoutPerTheme({
      theme: selectedTheme,
    });

  const onSubmitForm = (formValues, actions) => {
    // const params = {
    //     page_name: formValues.page_name,
    //     seo_google_meta_title: formValues.google_meta_title ?? "",
    //     seo_google_meta_description: formValues.google_meta_description ?? "",
    //     seo_google_meta_image_item_id: formValues.google_meta_image ?? "",
    //     seo_facebook_meta_title: formValues.facebook_meta_title ?? "",
    //     seo_facebook_meta_description: formValues.facebook_meta_description ?? "",
    //     seo_facebook_meta_image_item_id: formValues.facebook_meta_image ?? "",
    //     seo_twitter_meta_title_: formValues.twitter_meta_title ?? "",
    //     "seo[twitter][meta_description]": formValues.twitter_meta_description ?? "",
    //     "seo[twitter][meta_image_item_id]": formValues.twitter_meta_image ?? "",

    //     fb_seo_image: formValues.facebook_meta_image ?? "",
    //     google_seo_image: formValues.google_meta_image ?? "",
    //     twitter_seo_image: formValues.twitter_meta_image ?? "",
    //     theme: selectedTheme,
    //     layout_key: selectedLayout,
    //     apply_theme_to_all_std_pages: applyToAllStandardPages,
    //     ...(data.id && { id: data.id }),
    // };

    const params = {
      page_name: formValues.page_name,
      seo: {
        google: {
          meta_title: formValues.google_meta_title ?? '',
          meta_description: formValues.google_meta_description ?? '',
          meta_image_item_id: formValues.google_meta_image ?? '',
        },
        twitter: {
          meta_title: formValues.twitter_meta_description ?? '',
          meta_description: formValues.twitter_meta_description ?? '',
          meta_image_item_id: formValues.twitter_meta_image ?? '',
        },
        facebook: {
          meta_title: formValues.facebook_meta_title ?? '',
          meta_description: formValues.facebook_meta_description ?? '',
          meta_image_item_id: formValues.facebook_meta_image ?? '',
        },
      },
      fb_seo_image: formValues.facebook_meta_image ?? '',
      google_seo_image: formValues.google_meta_image ?? '',
      twitter_seo_image: formValues.twitter_meta_image ?? '',
      theme: selectedTheme,
      layout_key: selectedLayout,
      apply_theme_to_all_std_pages: applyToAllStandardPages.toString(),
      ...(data.id && { id: data.id }),
    };

    // if (formValues.theme_selection === "modernhome") {
    //     UpdateDesignSettingsDispatch.mutate(ModernHomeTheme);
    // }
    if (isQuickEdit) {
      updatePage.mutate(params);
    } else {
      addNewPage.mutate(params);
    }
    setFormAction(actions);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(formValues, actions) => onSubmitForm(formValues, actions)}
      enableReinitialize
    >
      {({ resetForm, values, setFieldValue }) => (
        <>
          <Modal
            show={modalAddNewPageTrigger}
            onHide={() => {
              resetForm();
              setModalAddNewPageTrigger(false);
            }}
            size={isQuickEdit ? 'md' : 'xl'}
          >
            <FormBody
              fields={fields}
              setModalAddNewPageTrigger={setModalAddNewPageTrigger}
              setShowBuilder={setShowBuilder}
              isQuickEdit={isQuickEdit}
              isPageNameEditable={isPageNameEditable}
              setThemePicker={setThemePicker}
              customSubDomain={storeAccount?.customSubDomain}
              customDomain={storeAccount?.customDomain}
              layoutsData={layoutsData}
              layoutsDataIsFetching={layoutsDataIsFetching}
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
              selectedTheme={selectedTheme}
              resetForm={resetForm}
              track={track}
              redirectToCustomDomain={storeAccount?.redirectToCustomDomain}
              setShowSEOForm={setShowSEOForm}
            />
          </Modal>

          <GenerateSEOForm
            show={showSEOForm}
            onCancel={() => {
              setShowSEOForm(false);
              setModalAddNewPageTrigger(true);
            }}
            onGenerate={(generatedOption, applyTo) => {
              // Get list of platforms to apply to
              const platforms =
                applyTo === 'all'
                  ? ['google', 'facebook', 'twitter']
                  : [applyTo];

              // Apply meta tags to selected platforms
              platforms.forEach((platform) => {
                setFieldValue(
                  `${platform}_meta_title`,
                  generatedOption.meta_title,
                );
                setFieldValue(
                  `${platform}_meta_description`,
                  generatedOption.meta_description,
                );
              });

              setShowSEOForm(false);
              setModalAddNewPageTrigger(true);

              const message =
                applyTo === 'all'
                  ? 'Meta tags applied to all platforms successfully!'
                  : `Meta tags applied to ${applyTo} successfully!`;

              MyNotification(true, '', message, {
                position: 'top-left',
                duration: 3,
              });
            }}
            pageName={values.page_name}
          />
        </>
      )}
    </Formik>
  );
};

const FormBody = ({
  fields,
  setModalAddNewPageTrigger,
  setShowBuilder,
  isQuickEdit,
  isPageNameEditable,
  setThemePicker,
  customSubDomain,
  layoutsData,
  layoutsDataIsFetching,
  selectedLayout,
  setSelectedLayout,
  selectedTheme,
  resetForm,
  track,
  redirectToCustomDomain,
  customDomain,
  setShowSEOForm,
}) => {
  const { t } = useTranslation();

  const { handleSubmit, setFieldValue, values, errors, isSubmitting } =
    useFormikContext();

  const handleThemeSelection = (event) => {
    setFieldValue(fields.theme_selection.id, '');
  };

  useEffect(() => {
    if (isSubmitting) {
      // errors from formik are objects (e.g. { generated_source: 'Required*', link_name: 'Required*', ...})
      let requiredFieldLabels = Object.entries(errors)
        // Filter only errors with 'Required*' message
        .filter(
          ([_, errorMessage]) => errorMessage.toLowerCase() === 'required*',
        );

      let requiredErrorMessage = 'Please complete all the required fields.';

      // if there are no errors
      if (requiredFieldLabels.length === 0) {
        return;
      } else {
        MyNotification(false, '', requiredErrorMessage);
      }
    }
  }, [errors, isSubmitting]);

  const [activeTab, setActiveTab] = useState('google');
  const SEOTabs = [
    { id: 'google', title: 'Google' },
    { id: 'facebook', title: 'Facebook' },
    { id: 'twitter', title: 'Twitter' },
  ];

  const onCancelModal = () => {
    setModalAddNewPageTrigger(false);
    resetForm();
  };
  const onSaveModal = () => {
    setShowBuilder(true);
    track('P1: Save New Page');
  };
  const onCreateModal = () => {
    setShowBuilder(false);
    setThemePicker(createSlug(values?.page_name));
  };

  const removeUnderscore = (str) => {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const customDomainUrl = redirectToCustomDomain
    ? customDomain
    : customSubDomain;

  return (
    <FormikForm onSubmit={handleSubmit}>
      <Modal.Header closeButton className="pb-0">
        <Modal.Title>{isQuickEdit ? 'Quick Edit' : 'Add New Page'}</Modal.Title>
        {/*
                <div style={{marginBottom: "10px"}}>
                   <BetaBadge/> 
                </div>
                */}
      </Modal.Header>
      <Modal.Body className="new-page-modal">
        {!isQuickEdit && (
          <Row>
            <Col>
              <label className="text-black mb-2 form-label text-md fw-semibold capitalize">
                Theme - {removeUnderscore(selectedTheme)}
              </label>
            </Col>
          </Row>
        )}
        <Row>
          <Col sm={isQuickEdit ? 12 : 6}>
            <FormTextField
              type={fields.page_name.type}
              controlId={fields.page_name.id}
              label={t(fields.page_name.label)}
              name={fields.page_name.id}
              required={fields.page_name.required}
              placeholder={fields.page_name.placeholder}
              underInputContent={t(
                values?.page_name?.length > 0
                  ? values?.page_name?.length + '/50'
                  : 0 + '/50',
              )}
              maxLength={50}
              className="mb-0 text-black"
              disabled={!isPageNameEditable && isQuickEdit}
            />
            <FormTextField
              type={fields.page_slug.type}
              controlId={fields.page_slug.id}
              label={t(fields.page_slug.label)}
              popContent={`The slug is the part of a URL that identifies a particular page on a website, in a human-friendly form.`}
              name={fields.page_slug.id}
              required={fields.page_slug.required}
              placeholder={fields.page_slug.placeholder}
              value={
                values?.page_name?.length > 0
                  ? customDomainUrl + '/' + createSlug(values?.page_name)
                  : ''
              }
              className="mb-3 text-black"
              disabled
            />
            <Card className="rounded-md shadow-none">
              <Tab.Container
                id="marketplace-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
              >
                <Card.Body className="pt-0 px-2">
                  <Row className="border-bottom border-black-50">
                    <Nav defaultActiveKey={activeTab} as="ul">
                      {SEOTabs.map((tab) => (
                        <Nav.Item key={tab.id} as="li">
                          <Nav.Link
                            className={`fw-semibold px-3 py-2
                                            ${
                                              activeTab === tab.id
                                                ? 'text-primary border-bottom border-primary border-3 '
                                                : 'text-black'
                                            }`}
                            eventKey={tab.id}
                          >
                            {t(tab.title)}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </Row>
                </Card.Body>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="google">
                      <MetaTags
                        fields={fields}
                        attr="google"
                        onGenerateFormOpen={() => {
                          setModalAddNewPageTrigger(false);
                          setShowSEOForm(true);
                        }}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="facebook">
                      <MetaTags
                        fields={fields}
                        attr="facebook"
                        onGenerateFormOpen={() => {
                          setModalAddNewPageTrigger(false);
                          setShowSEOForm(true);
                        }}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="twitter">
                      <MetaTags
                        fields={fields}
                        attr="twitter"
                        onGenerateFormOpen={() => {
                          setModalAddNewPageTrigger(false);
                          setShowSEOForm(true);
                        }}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Tab.Container>
            </Card>
          </Col>
          {!isQuickEdit && (
            <>
              <Col sm={6}>
                <div className="mb-3 d-flex flex-column h-100">
                  <label className="text-black mb-2 form-label text-md fw-semibold">
                    Choose a Layout
                  </label>
                  <Row
                    className="border rounded px-2"
                    onChange={(e) => setSelectedLayout(e.target.value)}
                  >
                    {layoutsDataIsFetching ? (
                      <div className="d-flex justify-content-center w-100 py-5">
                        <Spinner size="lg" color="primary" />
                      </div>
                    ) : (
                      <>
                        {layoutsData?.layouts?.map((layout, index) => {
                          return (
                            <Col xs={6} className="px-1 py-2" key={index}>
                              <ThemeCard
                                data={layout}
                                selectedTheme={selectedLayout}
                              />
                            </Col>
                          );
                        })}
                      </>
                    )}
                    {!layoutsData?.layouts?.length && (
                      <Col xs={6} className="px-1 py-2">
                        <label className="cursor-pointer">
                          <Card
                            className={`border my-card card-h-100 shadow-none ${
                              values.theme_selection === 'blank'
                                ? 'border-primary'
                                : ''
                            }`}
                          >
                            <Field
                              type="radio"
                              name={fields.theme_selection.id}
                              id="blank_theme"
                              value="blank"
                              className="me-1 theme-picker"
                              onClick={handleThemeSelection}
                            />
                            <div className="d-flex justify-content-center align-items-center p-0 bg-primary-light rounded">
                              <Card.Img
                                variant="top"
                                className="img-fluid"
                                src={blank}
                              />
                            </div>
                            <Card.Body className="p-2">
                              <p className="text-left text-sm text-black fw-semi-bold">
                                Blank
                              </p>
                            </Card.Body>
                          </Card>
                        </label>
                      </Col>
                    )}

                    {/* <Col xs={6} className="px-1 py-2">
                                            <label className="cursor-pointer">
                                                <Card
                                                    className={`border my-card card-h-100 shadow-none ${
                                                        values.theme_selection === "blank"
                                                            ? "border-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <Field
                                                        type="radio"
                                                        name={fields.theme_selection.id}
                                                        id="blank_theme"
                                                        value="blank"
                                                        className="me-1 theme-picker"
                                                        onClick={handleThemeSelection}
                                                    />
                                                    <div className="d-flex justify-content-center align-items-center p-0 bg-primary-light rounded">
                                                        <Card.Img
                                                            variant="top"
                                                            className="img-fluid"
                                                            src={blank}
                                                        />
                                                    </div>
                                                    <Card.Body className="p-2">
                                                        <p className="text-left text-sm text-black fw-semi-bold">
                                                            Blank
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </label>
                                        </Col>
                                        <Col xs={6} className="px-1 py-2">
                                            <label className="cursor-pointer">
                                                <Card
                                                    className={`border my-card card-h-100 ${
                                                        values.theme_selection === "fashion_by_you"
                                                            ? "border-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <Field
                                                        type="radio"
                                                        name={fields.theme_selection.id}
                                                        id="fashion_by_you_theme"
                                                        value="fashion_by_you"
                                                        className="me-1 theme-picker"
                                                        onClick={handleThemeSelection}
                                                    />
                                                    <div className="d-flex justify-content-center align-items-center p-0 bg-primary-light rounded">
                                                        <Card.Img
                                                            variant="top"
                                                            className="img-fluid"
                                                            src={fashionByYou}
                                                        />
                                                    </div>
                                                    <Card.Body className="p-2">
                                                        <p className="text-left text-sm text-black fw-semi-bold">
                                                            Fashion By You
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </label>
                                        </Col>
                                        <Col xs={6} className="px-1 py-2">
                                            <label className="cursor-pointer">
                                                <Card
                                                    className={`border my-card card-h-100 ${
                                                        values.theme_selection === "modernhome"
                                                            ? "border-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    <Field
                                                        type="radio"
                                                        name={fields.theme_selection.id}
                                                        id="modernhome"
                                                        value="modernhome"
                                                        className="me-1 theme-picker"
                                                        onClick={handleThemeSelection}
                                                    />
                                                    <div className="d-flex justify-content-center align-items-center p-0 bg-primary-light rounded">
                                                        <Card.Img
                                                            variant="top"
                                                            className="img-fluid"
                                                            src={modernhome}
                                                        />
                                                    </div>
                                                    <Card.Body className="p-2">
                                                        <p className="text-left text-sm text-black fw-semi-bold">
                                                            Modern Home Co.
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </label>
                                        </Col> */}
                  </Row>
                </div>
              </Col>
            </>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-cancel" onClick={onCancelModal}>
          Cancel
        </Button>
        {isQuickEdit ? (
          ''
        ) : (
          <Button type="submit" className="btn btn-save" onClick={onSaveModal}>
            Save Draft
          </Button>
        )}
        <Button type="submit" variant="primary" onClick={onCreateModal}>
          {isQuickEdit ? 'Save' : 'Create Page'}
        </Button>
      </Modal.Footer>
    </FormikForm>
  );
};
