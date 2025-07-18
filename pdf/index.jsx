/* eslint-disable prettier/prettier */
import { Modal } from 'react-bootstrap';
import { CURRENCY } from '../../../../../../constants/currency';
import {
  ToStandardNumberFormat,
  decimalAdjust,
} from '../../../../../../components/Shared/Custom/utilities';
import formatDate from '../../../../../../utils/formatDate';
import { Row, Col } from 'react-bootstrap';
import AppButton from '../../../../../../components/AppButton/AppButton';
import { SpinningLoader } from '../../../../../../components/ProspernaLoader/SpinningLoader';
import _ from 'lodash';
import prospernaLogo from '../../../../../../assets/images/logo.png';
import { useTranslation } from 'react-i18next';
//import moment from 'moment';
import { usePdfGenerator } from './components/usePdfGenerator';
import {
  getInvoiceTitle,
  getPaymentMethod,
} from './components/invoiceUtils.jsx';

const InvoicesView = ({
  invoiceToViewTrigger,
  setInvoiceToViewTrigger,
  singleDetails,
  isFetching,
  singleInvoiceDetails,
  isAdmin,
}) => {
  const discount =
    singleDetails?.discount === 'N/A' ? 0 : parseFloat(singleDetails?.discount);
  const promoCodeName =
    singleDetails?.subscription_plan_info?.promo_code?.promo_code_name || '';
  const discountDuration = singleDetails?.discount_duration;

  const promoCodeType =
    singleDetails?.subscription_plan_info?.promo_code?.promo_code_type ===
    'percent'
      ? `${singleDetails?.subscription_plan_info?.promo_code?.promo_code_value}% OFF`
      : `${CURRENCY} ${singleDetails?.subscription_plan_info?.promo_code?.promo_code_value}`;

  const promoCodeDiscount =
    singleDetails?.subscription_plan_info?.promo_code?.promo_code_type ===
    'percent'
      ? `-${singleDetails?.subscription_plan_info?.promo_code?.promo_code_value}%`
      : `-${CURRENCY} ${singleDetails?.subscription_plan_info?.promo_code?.promo_code_value}`;

  const recurringSubscription = singleInvoiceDetails?.recurring_subscription;
  const planSubscription = singleInvoiceDetails?.plan_subscription;

  const terms = (() => {
    if (
      planSubscription?.[0]?.addons?.name &&
      !planSubscription?.[0]?.addons?.name.includes('Pay 12 months')
    ) {
      return `${_.capitalize(
        singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
          ? 'MONTHLY'
          : singleDetails?.subscription_plan_info?.billing_type,
      )} + ${planSubscription[0]?.addons?.name}`;
    } else if (
      recurringSubscription?.[0]?.addons?.name &&
      !recurringSubscription?.[0]?.addons?.name.includes('Pay 12 months')
    ) {
      return `${_.capitalize(
        singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
          ? 'MONTHLY'
          : singleDetails?.subscription_plan_info?.billing_type,
      )} + ${recurringSubscription[0]?.addons?.name}`;
    } else if (
      singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
        ? 'MONTHLY'
        : singleDetails?.subscription_plan_info?.billing_type === 'YEARLY' ||
            singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
          ? 'MONTHLY'
          : singleDetails?.subscription_plan_info?.billing_type === 'ANNUAL'
    ) {
      return `${_.capitalize(
        singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
          ? 'MONTHLY'
          : singleDetails?.subscription_plan_info?.billing_type,
      )} + 1 month free`;
    } else {
      return _.capitalize(
        singleDetails?.subscription_plan_info?.billing_type == 'MONTH'
          ? 'MONTHLY'
          : singleDetails?.subscription_plan_info?.billing_type,
      );
    }
  })();

  const { convertInvoiceToPdf } = usePdfGenerator();

  const convertToPdf = async () => {
    await convertInvoiceToPdf({ singleDetails });
  };

  const { t } = useTranslation();

  return (
    <Modal
      className="invoice-wrap"
      show={invoiceToViewTrigger}
      onHide={() => setInvoiceToViewTrigger(false)}
      restoreFocus={false}
      size="xl"
      centered
    >
      <Modal.Header
        className="border-0"
        onHide={() => setInvoiceToViewTrigger(false)}
        closeButton
      ></Modal.Header>
      <Modal.Body className="p-4 pt-0">
        {isFetching ? (
          <div className="d-flex justify-content-center align-items-center table-loading">
            <SpinningLoader />
          </div>
        ) : (
          <>
            <div id="htmlContent">
              <div className="d-md-flex justify-content-between mb-3">
                <div>
                  <img
                    src={prospernaLogo}
                    height="50"
                    width="auto"
                    alt="logo"
                    className="mb-1"
                    style={{
                      maxWidth: '350px',
                      height: '50px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <p className="text-xs">
                    {/* DIV wrap pdfgeneration compatibility - mac safari */}
                    <div>
                      <b>Prosperna Philippines, Inc.</b>
                    </div>
                    <div>Unit 603 Civic Prime Building, 2105 Civic Drive</div>
                    <div>Alabang Filinvest Corporate City</div>
                    <div>City of Muntinlupa, Philippines 1781</div>
                  </p>
                </div>
                <div className="text-end">
                  <h5 className="title">INVOICE ID</h5>
                  <div>{singleDetails?.id}</div>
                  <div
                    className={`status ${singleDetails?.status?.toLowerCase()}-invoice badge `}
                  >
                    {singleDetails?.status}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="row">
                  <div className="col-lg-3 mb-3">
                    <div className="fw-bold text-sm text-black">Bill to</div>
                    <div className="fw-bold text-sm text-black">
                      {singleDetails?.merchant_info?.store_name}
                    </div>
                    {isAdmin ? (
                      <p className="text-xs mb-0">
                        {singleDetails?.merchant_info?.full_name}
                      </p>
                    ) : null}
                    <div className="text-xs">
                      {/* DIV wrap pdfgeneration compatibility - mac safari */}
                      {/* split lines into divs preserve any line breaks */}
                      {singleDetails?.merchant_info?.address?.full &&
                        singleDetails.merchant_info.address.full
                          .split(/\r?\n/)
                          .map((line, idx) => <div key={idx}>{line}</div>)}
                    </div>
                  </div>
                  <div className="col-lg-2 text-xs mb-3">
                    <div className="fw-bold text-sm text-black">
                      Payment Method
                    </div>
                    <div>{getPaymentMethod(singleDetails)}</div>
                  </div>
                  <div className="col-lg-7">
                    <div className="table-responsive">
                      <table className="table w-100 table-wrap table-bordered table-invoice-modal">
                        <tbody>
                          <tr>
                            <td className="fw-bold bg-primary-light text-black">
                              Invoice Date
                            </td>
                            <td>{formatDate(singleDetails?.createdAt)}</td>
                            <td className="fw-bold bg-primary-light text-black">
                              Due Date
                            </td>
                            <td>
                              {formatDate(singleDetails?.invoice_due_date)}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold bg-primary-light text-black">
                              Terms
                            </td>
                            <td>{terms}</td>
                            <td className="fw-bold bg-primary-light text-black">
                              Discount
                            </td>
                            {discount &&
                            singleDetails?.subscription_plan_info?.promo_code &&
                            discountDuration !== 'N/A' ? (
                              <td>
                                {promoCodeName} | {promoCodeType}
                              </td>
                            ) : (
                              <td></td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <table className="table w-100 table-wrap table-bordered table-invoice-modal">
                  <thead>
                    <tr>
                      <th className="bg-primary-light text-black">
                        Description
                      </th>
                      <th className="bg-primary-light text-black">Quantity</th>
                      <th className="bg-primary-light text-black">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{getInvoiceTitle(singleDetails)}</td>
                      <td>
                        {singleDetails?.invoice_items?.length
                          ? singleDetails?.invoice_items[0]?.quantity
                          : 0}
                      </td>
                      <td>
                        {CURRENCY}{' '}
                        {singleDetails?.invoice_items?.length
                          ? ToStandardNumberFormat(
                              singleDetails.invoice_items[0]?.net_unit_amount ??
                                0,
                            )
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-4">
                <Row className="justify-content-between">
                  <Col lg="6" className="mb-4 px-0 text-sm">
                    <p>
                      <small>
                        {discount && singleDetails?.is_charged_min
                          ? t(
                              'Note: Due to Payment Gateway requirements, a minimum amount is charged instead of the discounted price covered by the active promo code cycle.',
                            )
                          : ''}
                      </small>
                    </p>
                  </Col>
                  <Col lg="4">
                    <div className="d-flex justify-content-between mb-3 text-sm">
                      <div>Subtotal: </div>
                      <div>
                        {CURRENCY}{' '}
                        {ToStandardNumberFormat(
                          singleDetails?.sub_total?.amount ||
                            singleDetails?.subtotal?.amount ||
                            0,
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between  text-sm">
                      <div>
                        Discount: {discount ? `(${promoCodeDiscount})` : ''}
                      </div>
                      <div>
                        ({CURRENCY} {decimalAdjust('round', discount, -2)})
                      </div>
                    </div>
                    <hr className="border border-top w-100" />
                    <div className="d-flex justify-content-between fw-bold text-black">
                      <div>GRAND TOTAL</div>
                      <div>
                        {CURRENCY}{' '}
                        {ToStandardNumberFormat(singleDetails?.total)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="px-4">
              <Row className="justify-content-end">
                <Col lg="4">
                  <div className="d-flex gap-3 mt-4 mb-4 justify-content-end">
                    <AppButton
                      type="button"
                      variant="cancel "
                      onClick={() => setInvoiceToViewTrigger(false)}
                    >
                      Cancel
                    </AppButton>
                    <AppButton loadingLabel="Saving" onClick={convertToPdf}>
                      Download
                    </AppButton>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InvoicesView;
