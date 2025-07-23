import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import aiIconWhite from '/images/customs/ai-icon-white.png';
import aiIconBlue from '/images/customs/ai-icon-blue.png';
import { AINa } from '../../../../api/AINa/ProductMeta';
import MyNotification from '../../../../components/Shared/Custom/notification';

const GenerateSEOForm = ({ pageName, onCancel, onGenerate, show }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    page_name: pageName || '',
    brand: '',
    target_audience: '',
    main_keyword: '',
    supporting_keywords: '',
    product_special: '',
    tone: 'Professional',
    number_of_options: 2,
    previous_meta_descriptions: [],
    previous_meta_titles: [],
  });
  const [generatedOptions, setGeneratedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [previousMetaDescriptions, setPreviousMetaDescriptions] = useState([]);
  const [previousMetaTitles, setPreviousMetaTitles] = useState([]);
  const [applyTo, setApplyTo] = useState('all');

  const {
    generateMetaAsync,
    isGenerating,
    reset: resetGeneration,
  } = AINa.useGenerateProductMeta();

  // Reset form data when modal opens
  useEffect(() => {
    if (show) {
      setFormData({
        page_name: pageName || '',
        brand: '',
        target_audience: '',
        main_keyword: '',
        supporting_keywords: '',
        product_special: '',
        tone: 'Professional',
        number_of_options: 2,
        previous_meta_descriptions: [],
        previous_meta_titles: [],
      });
      setGeneratedOptions([]);
      setSelectedOption(null);
      setPreviousMetaDescriptions([]);
      setPreviousMetaTitles([]);
    }
  }, [show, pageName]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateNewMetaTags = async () => {
    resetGeneration();

    // If no option is selected regenerate both options
    if (!selectedOption) {
      const input = {
        product_title: formData.page_name,
        brand: formData.brand,
        target_audience: formData.target_audience,
        primary_keyword: formData.main_keyword,
        secondary_keywords: formData.supporting_keywords,
        benefits_and_selling_propositions: formData.product_special,
        tone: formData.tone,
        number_of_options: 2,
        previous_meta_descriptions: previousMetaDescriptions,
        previous_meta_titles: previousMetaTitles,
      };

      try {
        const result = await generateMetaAsync(input);
        if (!result || !result.options || !result.options.length) {
          MyNotification(
            false,
            '',
            'No meta tag options were generated. Please try again.',
            {
              position: 'top-left',
              duration: 3,
            },
          );
          return;
        }

        const transformedOptions = result.options.map((opt, index) => ({
          id: index + 1,
          ...opt,
        }));

        setGeneratedOptions(transformedOptions);
        setSelectedOption(null);
        return;
      } catch (error) {
        console.error('Error generating meta tags:', error);
        MyNotification(
          false,
          '',
          `Error generating meta tags: ${error.message}`,
          {
            position: 'top-left',
            duration: 3,
          },
        );
        return;
      }
    }

    // If an option is selected regenerate only that option
    const selectedOptionData = generatedOptions.find(
      (opt) => opt.id === selectedOption,
    );
    const unselectedOptionData = generatedOptions.find(
      (opt) => opt.id !== selectedOption,
    );

    if (!selectedOptionData || !unselectedOptionData) return;

    const input = {
      product_title: formData.page_name,
      brand: formData.brand,
      target_audience: formData.target_audience,
      primary_keyword: formData.main_keyword,
      secondary_keywords: formData.supporting_keywords,
      benefits_and_selling_propositions: formData.product_special,
      tone: formData.tone,
      previous_meta_descriptions: previousMetaDescriptions,
      previous_meta_titles: previousMetaTitles,
      number_of_options: 1,
      regenerate_option: selectedOption === 1 ? 'A' : 'B',
    };

    try {
      const result = await generateMetaAsync(input);
      if (!result || !result.options || !result.options.length) {
        MyNotification(
          false,
          '',
          'No meta tag options were generated. Please try again.',
          {
            position: 'top-left',
            duration: 3,
          },
        );
        return;
      }

      // Create new options array with both the regenerated and retained options
      const newOptions = [
        selectedOption === 1
          ? {
              id: 1,
              meta_title: result.options[0].meta_title,
              meta_description: result.options[0].meta_description,
            }
          : unselectedOptionData,
        selectedOption === 2
          ? {
              id: 2,
              meta_title: result.options[0].meta_title,
              meta_description: result.options[0].meta_description,
            }
          : unselectedOptionData,
      ];

      setGeneratedOptions(newOptions);
    } catch (error) {
      console.error('Error regenerating meta tag:', error);
      MyNotification(
        false,
        '',
        `Error regenerating meta tag: ${error.message}`,
        {
          position: 'top-left',
          duration: 3,
        },
      );
    }
  };

  const handleGenerateMetaTags = async () => {
    resetGeneration();

    if (
      !formData.target_audience ||
      !formData.main_keyword ||
      !formData.brand ||
      !formData.product_special
    ) {
      MyNotification(false, '', 'Please fill in all required fields', {
        position: 'top-left',
        duration: 3,
      });
      return;
    }

    const input = {
      product_title: formData.page_name,
      brand: formData.brand,
      target_audience: formData.target_audience,
      primary_keyword: formData.main_keyword,
      secondary_keywords: formData.supporting_keywords,
      benefits_and_selling_propositions: formData.product_special,
      tone: formData.tone,
      number_of_options: 2,
      previous_meta_descriptions: previousMetaDescriptions,
      previous_meta_titles: previousMetaTitles,
    };

    try {
      const result = await generateMetaAsync(input);
      if (!result || !result.options || !result.options.length) {
        MyNotification(
          false,
          '',
          'No meta tag options were generated. Please try again.',
          {
            position: 'top-left',
            duration: 3,
          },
        );
        return;
      }

      const transformedOptions = result.options.map((opt, index) => ({
        id: index + 1,
        ...opt,
      }));

      setGeneratedOptions(transformedOptions);
      setSelectedOption(null);
    } catch (error) {
      console.error('Error generating meta tags:', error);
      MyNotification(
        false,
        '',
        `Error generating meta tags: ${error.message}`,
        {
          position: 'top-left',
          duration: 3,
        },
      );
    }
  };

  const handleApply = () => {
    if (!selectedOption) return;

    const option = generatedOptions.find((opt) => opt.id === selectedOption);
    if (option) {
      onGenerate(option, applyTo);
    }
  };

  return (
    <Modal show={show} onHide={onCancel} size="lg">
      <Modal.Header closeButton className="pb-0">
        <Modal.Title className="d-flex align-items-center">
          <button
            className="btn btn-link text-decoration-none p-0 me-2"
            onClick={onCancel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                fill="currentColor"
              />
            </svg>
          </button>
          Generate SEO Meta Tags
          <img
            src={aiIconWhite}
            alt="ai-icon"
            width="24"
            height="24"
            className="ms-2"
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="mb-2 text-black text-sm">
                  {t('Page Name')}{' '}
                  <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.page_name}
                  onChange={(e) =>
                    handleInputChange('page_name', e.target.value)
                  }
                  className="form-control px-2"
                  maxLength={100}
                  required
                />
                <Form.Text className="text-end d-block">
                  {formData.page_name.length}/100
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="mb-2 text-black text-sm">
                  {t('Brand')} <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder={t('Enter your brand name')}
                  className="form-control px-2"
                  maxLength={50}
                />
                <Form.Text className="text-end d-block">
                  {formData.brand.length}/50
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3">
            <Form.Group>
              <Form.Label className="mb-1 text-black text-sm">
                {t('Who is the target audience?')}{' '}
                <span className="text-danger fw-bold h5">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={t(
                  'ex. Young affluent adults between the ages of 24 to 30 who reside in San Francisco.',
                )}
                maxLength={150}
                value={formData.target_audience}
                onChange={(e) =>
                  handleInputChange('target_audience', e.target.value)
                }
                className="form-control px-2"
              />
              <Form.Text className="text-end d-block">
                {formData.target_audience.length}/150
              </Form.Text>
            </Form.Group>
          </div>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="mb-1 text-black text-sm">
                  {t('What main keywords should be included?')}{' '}
                  <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('Add up to 3 main keywords.')}
                  value={formData.main_keyword}
                  onChange={(e) =>
                    handleInputChange('main_keyword', e.target.value)
                  }
                  className="form-control px-2"
                  maxLength={100}
                />
                <Form.Text className="text-end d-block">
                  {formData.main_keyword.length}/100
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="mb-1 text-black text-sm">
                  {t('What supporting keywords should be included?')}{' '}
                  <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('Use tab or comma to separate keywords.')}
                  value={formData.supporting_keywords}
                  onChange={(e) =>
                    handleInputChange('supporting_keywords', e.target.value)
                  }
                  className="form-control px-2"
                  maxLength={150}
                />
                <Form.Text className="text-end d-block">
                  {formData.supporting_keywords.length}/150
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="mb-1 text-black text-sm">
                  {t(
                    `Describe the value proposition(s) of the message that you're trying to communicate.`,
                  )}{' '}
                  <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.product_special}
                  placeholder={t('Add a minimum of 3 value propositions.')}
                  onChange={(e) =>
                    handleInputChange('product_special', e.target.value)
                  }
                  className="form-control px-2"
                  maxLength={200}
                  required
                />
                <Form.Text className="text-end d-block">
                  {formData.product_special.length}/200
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mt-3">
              <Form.Group>
                <Form.Label className="mb-1 text-black text-sm">
                  Select the tone of voice.
                  <span className="text-danger fw-bold h5">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="form-select px-2"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Formal">Formal</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {generatedOptions.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-2">{t('SEO Meta Tags Suggestions')}</h5>
              <p className="text-muted small mb-4">
                {t('Please select one to proceed.')}
              </p>
              <Row>
                {generatedOptions.map((option, index) => (
                  <Col xs={12} md={6} key={option.id} className="mb-3">
                    <div className="text-center mb-2">
                      <h6 className="mb-0 text-md">
                        Option {index === 0 ? 'A' : 'B'}
                      </h6>
                    </div>
                    <div
                      className={`card option-card cursor-pointer h-100 ${
                        selectedOption === option.id ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                      style={{
                        transition: 'all 0.3s ease',
                        border:
                          selectedOption === option.id
                            ? '2px solid #0d6efd'
                            : '1px solid #dee2e6',
                        cursor: 'pointer',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: '300px',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOption !== option.id) {
                          e.currentTarget.style.boxShadow =
                            '0 0 0 3px rgba(13, 110, 253, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOption !== option.id) {
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div
                        className="pt-1"
                        style={{ backgroundColor: '#3871E0' }}
                      ></div>
                      <div className="card-header bg-white border-bottom-0 pt-3 px-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="mb-0 fw-bold text-primary text-md">
                            {formData.page_name}
                          </h6>
                          <Badge
                            bg="light"
                            className="d-flex align-items-center"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'rgba(13, 110, 253, 0.1)',
                              color: '#0d6efd',
                              border: '1px solid #0d6efd',
                            }}
                          >
                            <img
                              src={aiIconBlue}
                              alt="ai-icon-blue"
                              width="15"
                              height="15"
                              className="img-fluid me-1"
                            />
                            AI Generated
                          </Badge>
                        </div>
                      </div>
                      <div className="card-body pt-2">
                        <div className="mb-3">
                          <h6 className="card-subtitle mb-2">Meta Title</h6>
                          <div className="card-text text-dark p-2 bg-light rounded">
                            {option.meta_title}
                          </div>
                        </div>
                        <div>
                          <h6 className="card-subtitle mb-2">
                            Meta Description
                          </h6>
                          <div className="card-text text-dark p-2 bg-light rounded">
                            {option.meta_description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        {generatedOptions.length > 0 ? (
          <>
            <Button
              className="ai-generate-btn d-flex align-items-center"
              onClick={handleGenerateNewMetaTags}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {t('Generating...')}
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={aiIconWhite}
                    alt="ai-icon"
                    width="20"
                    height="20"
                    className=""
                  />
                  Generate New
                </div>
              )}
            </Button>
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                size="sm"
                value={applyTo}
                onChange={(e) => setApplyTo(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">Apply to All</option>
                <option value="google">Apply to Google</option>
                <option value="facebook">Apply to Facebook</option>
                <option value="twitter">Apply to Twitter</option>
              </Form.Select>
              <Button
                variant="primary"
                onClick={handleApply}
                disabled={!selectedOption}
              >
                Apply
              </Button>
            </div>
          </>
        ) : (
          <Button
            className="ai-generate-btn d-flex align-items-center"
            onClick={handleGenerateMetaTags}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {t('Generating...')}
              </>
            ) : (
              <div className="d-flex align-items-center gap-1">
                <img
                  src={aiIconWhite}
                  alt="ai-icon"
                  width="20"
                  height="20"
                  className="image-fluid"
                />
                Generate Meta Tags
              </div>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GenerateSEOForm;
