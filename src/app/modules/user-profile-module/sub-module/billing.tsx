import React from "react";
import { billingcss } from "app/modules/user-profile-module/style";
import { InvoiceTable } from "app/modules/user-profile-module/component/table";

export default function Billing() {
  return (
    <div css={billingcss}>
      <h4>Billing</h4>
      <div>
        <p>Dataxplorer Plan</p>
        <p>Pro</p>
      </div>

      <div>
        <button>RENEW PLAN</button>
        <button>UPGRADE PLAN</button>
        <button>CANCEL PLAN</button>
      </div>

      <div>
        <p>Payment method</p>

        <div>
          <p>icon</p>
          <p>ING (Direct Debit) ••3076</p>
        </div>
      </div>

      <div>
        <button>Change payment method</button>
      </div>
      <div>
        <p>Billing info</p>
        <div>
          <p>Boerhaavelaan 7,</p>
          <p>2500 DL Den Haag, The Netherlands</p>
        </div>
      </div>
      <div>
        <button>Change billing info</button>
      </div>
      <div
        css={`
          height: 48px;
        `}
      />
      <InvoiceTable />
    </div>
  );
}
