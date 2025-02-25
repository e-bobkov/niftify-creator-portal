
import { memo } from "react";

const Refund = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Refund and Transaction Cancellation Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Refund and Transaction Cancellation Policy (hereinafter referred to as the "Policy") governs the conditions for refunds and transaction cancellations on the platform http://ftsoa.art (hereinafter referred to as the "Platform").</p>
                <p>1.2. By using the Platform, the user accepts these terms and agrees that the sale of digital assets in NFT format is final and irreversible.</p>
                <p>1.3. The Platform reserves the right to amend this Policy at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. Transaction Cancellation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Transaction Cancellation</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. Transactions conducted on the Platform are final and cannot be canceled unless otherwise required by law or the specific terms of a transaction.</p>
                <p>2.2. Users are responsible for verifying all information before making a purchase, including the NFT description and transaction terms.</p>
                <p>2.3. In exceptional cases, a transaction may be canceled at the Platform's discretion if a violation of the Terms of Use is detected or in the event of a technical failure.</p>
              </div>
            </section>

            {/* 3. Refund Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Refund Policy</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. All NFT purchases on the Platform are final and non-refundable.</p>
                <p>3.2. A refund is possible only in the event of a technical error that resulted in an incorrect deduction of funds or if the NFT was not delivered to the buyer due to a system failure.</p>
                <p>3.3. Refund requests are reviewed on a case-by-case basis. To submit a request, the user must contact customer support with a description of the issue and supporting documentation.</p>
                <p>3.4. The decision on the refund is made by the Platform administration and is final.</p>
              </div>
            </section>

            {/* 4. Exceptions and Special Cases */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Exceptions and Special Cases</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. Refunds will not be issued if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The user changes their mind after completing the transaction;</li>
                  <li>The NFT has already been transferred to the buyer on the blockchain;</li>
                  <li>The user has violated the Terms of Service or License Agreement.</li>
                </ul>
                <p>4.2. If fraudulent activities or security violations are detected, the user's account may be blocked without a refund.</p>
              </div>
            </section>

            {/* 5. Dispute Resolution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Dispute Resolution</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. In case of disputes related to transactions, users must contact the Platform's support service.</p>
                <p>5.2. If a dispute cannot be resolved amicably, it will be subject to legal proceedings in accordance with the laws of the Kingdom of Cambodia.</p>
              </div>
            </section>

            {/* 6. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. Requests for refunds and transaction cancellations can be submitted to the support service via email at contact@ftsoa.art or through the feedback form.</p>
                <p>6.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Refund);
