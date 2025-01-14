import React from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/modules/common/page-loader";
import { billingcss } from "app/modules/user-profile-module/style";
import { InvoiceTable } from "app/modules/user-profile-module/component/table";
import { APPLICATION_JSON } from "app/state/api";

export default function Billing() {
  const { user } = useAuth0();
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<null | {
    method: string;
    number: string;
  }>(null);
  const [billingInfo, setBillingInfo] = React.useState<null | {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  }>(null);
  const [invoices, setInvoices] = React.useState<
    { id: string; name: string; url: string; hostedUrl: string; date: string }[]
  >([]);
  const [currentPlan, setCurrentPlan] = React.useState("");
  const [planMessage, setPlanMessage] = React.useState("");

  const token = useStoreState((state) => state.AuthToken.value);

  const getStripePaymentMethod = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/payment-method/${user?.sub}`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPaymentMethod(response.data.data);
    setLoading(false);
  };

  const getStripeBillingInfo = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/${user?.sub}/billing`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBillingInfo(response.data.data);
    setLoading(false);
  };

  const changePaymentMethod = async () => {
    setLoading(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/stripe/portal-session`,
      {
        userId: user?.sub,
        flowDataType: "payment_method_update",
        returnUrl: `${window.location.origin}/user-management/billing`,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.data) {
      window.location.href = response.data.data;
      setLoading(false);
    }
  };

  const getGenericPortal = async () => {
    if (!isOnPaidPlan) {
      history.push("/pricing");
    }
    setLoading(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/stripe/portal-session`,
      {
        userId: user?.sub,
        returnUrl: `${window.location.origin}/user-management/billing`,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.data) {
      window.location.href = response.data.data;
      setLoading(false);
    }
  };

  const getStripeInvoices = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/invoices/${user?.sub}`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setInvoices(response.data.data);
    setLoading(false);
  };

  const getCurrentSubscriptionPlan = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/stripe/subscription/${user?.sub}`, {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCurrentPlan(response.data.data.plan);
        setPlanMessage(response.data.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isOnPaidPlan = React.useMemo(() => {
    return currentPlan !== "Free" && currentPlan !== "";
  }, [currentPlan]);

  React.useEffect(() => {
    getStripePaymentMethod();
    getStripeBillingInfo();
    getStripeInvoices();
    getCurrentSubscriptionPlan();
  }, []);

  return (
    <React.Fragment>
      {loading && <PageLoader />}
      <div css={billingcss}>
        <h4>Billing</h4>
        <div>
          <p>Dataxplorer Plan</p>
          <p>
            {currentPlan}
            {planMessage ? ` (${planMessage})` : ""}
          </p>
        </div>
        <div>
          <button disabled={!isOnPaidPlan} onClick={getGenericPortal}>
            RENEW PLAN
          </button>
          <button onClick={getGenericPortal}>UPGRADE PLAN</button>
          <button disabled={!isOnPaidPlan} onClick={getGenericPortal}>
            CANCEL PLAN
          </button>
        </div>
        <div>
          <p>Payment method</p>
          <div>
            <p
              css={`
                text-transform: uppercase;
              `}
            >
              {isOnPaidPlan
                ? `${paymentMethod?.method} ••${paymentMethod?.number}`
                : "-"}
            </p>
          </div>
        </div>
        <div>
          <button disabled={!isOnPaidPlan} onClick={changePaymentMethod}>
            CHANGE PAYMENT METHOD
          </button>
        </div>
        <div>
          <p>Billing info</p>
          <div>
            {isOnPaidPlan ? (
              <React.Fragment>
                <p>
                  {billingInfo?.line1},
                  {billingInfo?.line2 ? (
                    <React.Fragment>
                      <br />
                      <p>{billingInfo?.line2},</p>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                </p>
                <p>
                  {billingInfo?.postal_code} {billingInfo?.city}{" "}
                  {billingInfo?.state}, {billingInfo?.country}
                </p>
              </React.Fragment>
            ) : (
              "-"
            )}
          </div>
        </div>
        <div>
          <button disabled={!isOnPaidPlan} onClick={getGenericPortal}>
            CHANGE BILLING INFO
          </button>
        </div>
        <div
          css={`
            height: 48px;
          `}
        />
        <InvoiceTable tableData={invoices} />
      </div>
    </React.Fragment>
  );
}
