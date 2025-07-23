import { useState } from 'react';
import { Col, Row, Figure, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from 'formik';
import FormTextField from '../../../../components/BootstrapFormik/FormTextField';
import { useFormikContext } from 'formik';
import { MediaLibraryModal } from '../../../../components/MediaLibraryModal/MediaLibraryModal';
import UploadImage from '../../../../components/MediaLibraryModal/UploadImage';
import { validateImage } from '../../../../utils/images';
// import aiIconWhite from '/images/customs/ai-icon-white.png';

const MetaTags = ({ fields, attr }) => {
  const { t } = useTranslation();
  const [metaImage, setMetaImage] = useState('');
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);

  const { values, setFieldValue, errors, touched } = useFormikContext();

  // const handleFileUpload = async (file) => {
  //   try {
  //     const metaImageMaxFileSize = 5 * 1024 * 1024;
  //     const pass = await checkFile(file[0], metaImageMaxFileSize, 600, 315);
  //     const image = await resizeFile(file[0], {
  //       maxWidth: 600,
  //       maxHeight: 315,
  //     });
  //     if (pass) {
  //       setFieldValue(`${attr}_meta_image`, image);
  //       // Create URL for the image
  //       const objectUrl = URL.createObjectURL(image);
  //       setMetaImage(objectUrl);
  //     }
  //   } catch (error) {
  //     MyNotification(false, '', error.message);
  //   }
  // };

  return (
    <>
      <Form.Group className="mb-3">
        <div className="meta-title-wrapper">
          {/* <div className="header">
            <Form.Label>Meta Title</Form.Label>
            <Button className="ai-generate-btn" onClick={onGenerateFormOpen}>
                            <div className="d-flex align-items-center gap-1">
                                <img
                                    src={aiIconWhite}
                                    alt="ai-icon-white"
                                    width="20"
                                    height="20"
                                    className="img-fluid "
                                />
                                {t("Generate with AI")}
                            </div>
                        </Button>
          </div> */}
          <FormTextField
            type={fields[`${attr}_meta_title`].type}
            controlId={fields[`${attr}_meta_title`].id}
            value={values[`${attr}_meta_title`]}
            label={t(fields[`${attr}_meta_title`].label)}
            onChange={(e) =>
              setFieldValue(`${attr}_meta_title`, e.target.value)
            }
            popContent={`The meta title, also known as a title tag, is HTML code that specifies the title of a webpage. It's displayed on search engine results pages (SERPs) and in browser tabs, giving users and search engines a brief summary of the page's content. Optimizing meta titles is crucial for SEO, as they influence click-through rates and ranking signals.`}
            isInvalid={
              !!errors[`${attr}_meta_title`] && touched[`${attr}_meta_title`]
            }
          />
        </div>
      </Form.Group>
      <FormTextField
        type={fields[`${attr}_meta_description`].type}
        controlId={fields[`${attr}_meta_description`].id}
        label={t(fields[`${attr}_meta_description`].label)}
        popContent={`The meta description generally informs and interests users with a short, relevant summary of what a particular page is about. It is like a marketing pitch that convinces the user that the page is exactly what they're looking for.`}
        name={fields[`${attr}_meta_description`].id}
        required={fields[`${attr}_meta_description`].required}
        placeholder={fields[`${attr}_meta_description`].placeholder}
        underInputContent={t(
          values[`${attr}_meta_description`]?.length > 0
            ? values[`${attr}_meta_description`]?.length +
                '/' +
                (attr === 'twitter' ? '50' : '150')
            : 0 + '/' + (attr === 'twitter' ? '50' : '150'),
        )}
        maxLength={attr === 'twitter' ? 50 : 150}
        className="mb-0 text-black"
      />

      <hr className="border-bottom border-1 m-0 my-4" />

      <Row>
        <Col lg={6}>
          <div>
            <div>
              <p className="text-sm text-black">{t('Meta Image')}</p>
              <div className="d-flex align-items-center gap-3">
                <UploadImage
                  fullWidth={true}
                  clickFunction={() => setShowMediaLibraryModal(true)}
                  AdditionalInfo={
                    <div className="mt-1 text-xxs text-center fw-normal">
                      <p className="m-0 ">{t('Max Size: 10 MB')}</p>
                      <p className="m-0 ">
                        {t('Min Resolution: 600px x 315px')}
                      </p>
                      <p className="m-0 ">{t('Type: .jpg, .png, or .webp')}</p>
                    </div>
                  }
                />
              </div>
              <ErrorMessage
                name="store_logo"
                component="small"
                className="text-danger"
              />
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="logo-preview-wrap">
            <p className="text-sm text-black mt-sm-0 mt-2">{t('Preview')}</p>
            <div>
              {metaImage || fields[`${attr}_meta_image`].value ? (
                <Figure className="meta-image d-flex">
                  <Figure.Image
                    alt="Meta Image"
                    src={metaImage || fields[`${attr}_meta_image`].value}
                  />
                </Figure>
              ) : (
                <div className="meta-image-preview border bg-grey d-flex justify-content-center align-items-center">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M33.5833 4.48307V33.6497H4.41667V4.48307H33.5833ZM33.5833 0.316406H4.41667C2.125 0.316406 0.25 2.19141 0.25 4.48307V33.6497C0.25 35.9414 2.125 37.8164 4.41667 37.8164H33.5833C35.875 37.8164 37.75 35.9414 37.75 33.6497V4.48307C37.75 2.19141 35.875 0.316406 33.5833 0.316406ZM23.4583 18.7747L17.2083 26.8372L12.75 21.4414L6.5 29.4831H31.5L23.4583 18.7747Z"
                      fill="#7C7B7B"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {showMediaLibraryModal && (
        <MediaLibraryModal
          showMediaLibraryModal={showMediaLibraryModal}
          setShowMediaLibraryModal={setShowMediaLibraryModal}
          mediaType="image"
          selectCallback={(items) => {
            const firstImage = items[0];
            const imageURL = firstImage?.attributes?.source?.file_location;
            const imageID = firstImage?.id;

            const imageWidth = firstImage?.attributes?.source?.width;
            const imageHeight = firstImage?.attributes?.source?.height;
            const imageSize = firstImage?.attributes?.source?.file_size;
            const imageHeightDimensions = '315';
            const imageWidthDimensions = '600';
            const isImagePass = validateImage(
              imageHeight,
              imageWidth,
              imageSize,
              imageHeightDimensions,
              imageWidthDimensions,
              10,
            );

            if (isImagePass) {
              setMetaImage(imageURL);
              setFieldValue(`${attr}_meta_image`, imageID);
              setShowMediaLibraryModal(false);
            }
          }}
          multipleSelect={false}
          resetAfterSelect={true}
        />
      )}
    </>
  );
};

export default MetaTags;
