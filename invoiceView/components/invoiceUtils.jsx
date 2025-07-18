import { capitalizeAndRemoveDashes } from '../../../../../../../utils';

export function getInvoiceTitle(singleDetails) {
  const isAddon = singleDetails?.subscription_plan_info?.app_key;
  const planType = capitalizeAndRemoveDashes(
    singleDetails?.subscription_plan_info?.plan_type,
  );
  const billingType = capitalizeAndRemoveDashes(
    singleDetails?.subscription_plan_info?.billing_type,
  );
  if (isAddon) {
    return (
      <p>
        {singleDetails?.addon_name}{' '}
        {planType !== 'Base' && `(${planType} Tier) `}
        Add-on Subscription Payment - {billingType}{' '}
        {singleDetails?.is_prorated ? (
          <span className="fst-italic">(Prorated)</span>
        ) : (
          ''
        )}
      </p>
    );
  }
  return (
    <p>
      {planType} Subscription Plan - {billingType}
    </p>
  );
}

export function getPaymentMethod(singleDetails) {
  const paymentMethod = singleDetails?.payment_methods?.[0];
  if (paymentMethod?.type === 'E-WALLET') {
    return 'E-WALLET: GCash';
  }
  return paymentMethod?.type;
}
