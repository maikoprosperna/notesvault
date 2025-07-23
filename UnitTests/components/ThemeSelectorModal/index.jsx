import React, { useEffect } from 'react';
import { Modal, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PageBuilderAPI } from '../../../../../api/BusinessProfile/PageBuilder';
import { Spinner } from 'react-bootstrap';
import AppButton from '../../../../../components/AppButton/AppButton';
import ThemeCard from '../ThemeCard';
import { useSearchParams } from 'react-router-dom';
import { LabelWithHelper } from '../../../../../components/Shared/Custom/utilities';

const ThemeSelectorModal = ({
  showModal,
  setShowModal,
  selectedTheme,
  setSelectedTheme,
  applyToAllStandardPages,
  setApplyToAllStandardPages,
  setModalAddNewPageTrigger,
}) => {
  const { t } = useTranslation();
  const { data: themeData, isFetching: isFetchedThemeData } =
    PageBuilderAPI.useGetPageThemeList({
      isActivated: showModal,
    });

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  useEffect(() => {
    if (key) {
      setSelectedTheme(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, themeData?.themes]);

  const ThemeLoading = () => {
    return (
      <div className="text-center">
        <Spinner className="text-primary" size="lg" />
      </div>
    );
  };
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTheme('');
    setApplyToAllStandardPages(false);
  };
  return (
    <Modal
      show={showModal}
      onHide={() => handleModalClose()}
      size="xl"
      className="add-page-modal"
    >
      <Modal.Header closeButton={() => setShowModal(false)}>
        <Modal.Title className="mb-0 fw-semibold text-md text-black">
          {t(`Add New Page`)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <h5 className="text-md fw-semibold text-black">
          {t(`Select a Theme`)}
        </h5>
        <div className="border p-3 rounded pb-0 mb-4">
          {isFetchedThemeData ? (
            <ThemeLoading />
          ) : (
            <React.Fragment>
              <div
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  if (e.target.value === 'blank') {
                    setApplyToAllStandardPages(false);
                  }
                }}
              >
                <Row>
                  {themeData?.themes?.map((theme, index) => {
                    return (
                      <Col lg={4} key={index}>
                        <ThemeCard data={theme} selectedTheme={selectedTheme} />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="d-flex justify-content-end align-items-center ">
          <LabelWithHelper
            className="text-dark-gray fw-semibold mb-0 me-2"
            popContent={`Standard pages include the Maintenance Page, Error Page, Thank you Page, Checkout Page, Cart Page, Products Page, Single Product Page, and Blog Page.`}
          >
            <span>Apply theme to all Standard Pages</span>
          </LabelWithHelper>
          <div onChange={(e) => setApplyToAllStandardPages(e.target.checked)}>
            <Form.Check
              type="switch"
              name="applyToAllStandardPages"
              id="applyToAllStandardPages"
              checked={applyToAllStandardPages}
              disabled={!selectedTheme || selectedTheme === 'blank'}
            />
          </div>
        </div>
        <div className=" mt-4">
          <hr className="m-0 border-top border-1 h-auto" />
        </div>
      </Modal.Body>

      <Modal.Footer className="mb-2">
        <AppButton
          className="btn btn-cancel me-2 fw-600"
          onClick={() => handleModalClose()}
        >
          {t(`Cancel`)}
        </AppButton>

        <AppButton
          type="submit"
          variant="primary"
          disabled={!selectedTheme}
          className="fw-600"
          onClick={() => {
            setModalAddNewPageTrigger(true);
            setShowModal(false);
          }}
        >
          {t(`Proceed`)}
        </AppButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ThemeSelectorModal;
