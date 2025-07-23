import { Row, Col, Figure } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from 'formik';
// import FileUploader from '../../../../../../../components/FileUploader';
import {
  DeleteOutlineOutlined,
  InsertPhotoOutlined,
} from '@mui/icons-material';
import { MediaLibraryModal } from '../../../../../../../components/MediaLibraryModal/MediaLibraryModal';
import UploadImage from '../../../../../../../components/MediaLibraryModal/UploadImage';

const StoreBrandingUpload = ({
  previewSrc,
  handleFileUpload,
  extendedElements,
  figureClassName,
  title,
  isRequired,
  handleDelete,
  errorMessage,
  showMediaLibraryModal,
  setShowMediaLibraryModal,
  includeIco = false,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="mb-3">
      <Col md={6} className="mb-3">
        <p className="fw-bold text-sm text-dark-gray">
          {t(`${title}`)} {isRequired && <span className="text-danger">*</span>}
        </p>
        {/* <FileUploader
                    maxUpload={1}
                    showPreview={false}
                    onFileUpload={handleFileUpload}
                    accept="image/png, image/jpg, image/jpeg"
                    multiple={false}
                    extendedElements={extendedElements}
                /> */}
        <UploadImage
          fullWidth={true}
          clickFunction={() => setShowMediaLibraryModal(true)}
          AdditionalInfo={
            <div className="mt-1 text-xs text-center fw-normal">
              {extendedElements}
            </div>
          }
        />
        <MediaLibraryModal
          showMediaLibraryModal={showMediaLibraryModal}
          setShowMediaLibraryModal={setShowMediaLibraryModal}
          mediaType="image"
          selectCallback={(items) => {
            handleFileUpload(items);
            //setShowMediaLibraryModal(false);
          }}
          multipleSelect={false}
          resetAfterSelect={true}
          includeIco={includeIco}
        />
        {errorMessage && (
          <ErrorMessage
            name={errorMessage}
            component="small"
            className="text-danger"
          />
        )}
      </Col>
      <Col md={6}>
        <div className={`${figureClassName}`}>
          <p className="fw-bold text-sm text-dark-gray">{t('Preview')}</p>
          <div>
            {previewSrc ? (
              <Row>
                <Col sm={11}>
                  <Figure>
                    <Figure.Image alt="Store Logo" src={previewSrc} />
                  </Figure>
                </Col>
                <Col sm={1} className={'px-0'}>
                  <div className="d-flex flex-column justify-content-end h-100">
                    {handleDelete && (
                      <div
                        className="cursor-pointer mb-3"
                        onClick={handleDelete}
                      >
                        <DeleteOutlineOutlined />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            ) : (
              <div
                className={`bg-grey d-flex justify-content-center align-items-center rounded-3 default-preview`}
              >
                <InsertPhotoOutlined sx={{ fontSize: 50 }} />
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default StoreBrandingUpload;
