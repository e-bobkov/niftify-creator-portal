
import { memo } from "react";

const AMLKYC = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">AML & KYC Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This AML/KYC Policy has been developed to prevent the use of the platform http://ftsoa.art (hereinafter referred to as the "Platform") for illegal purposes, including money laundering, terrorist financing, and fraud.</p>
                <p>1.2. The Platform operates in compliance with international standards and legislation on anti-money laundering and counter-terrorism financing.</p>
                <p>1.3. By using the Platform, the user fully agrees to the terms of this Policy.</p>
              </div>
            </section>

            {/* 2. Customer Identification (KYC) */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Customer Identification (KYC)</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. All users of the Platform are required to complete the Know Your Customer (KYC) identification process before conducting financial transactions.</p>
                <p>2.2. As part of the KYC process, the Platform may request the following information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name;</li>
                  <li>Date of birth;</li>
                  <li>Nationality;</li>
                  <li>Passport or other government-issued identification document;</li>
                  <li>Residential address;</li>
                  <li>Proof of source of funds (if required).</li>
                </ul>
                <p>2.3. The Platform reserves the right to deny services or suspend account access if the user refuses to provide the requested information.</p>
              </div>
            </section>

            {/* 3. Transaction Monitoring */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Transaction Monitoring</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. The Platform monitors user transactions to identify suspicious activity.</p>
                <p>3.2. If suspicious transactions are detected, the Platform reserves the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request additional information from the user;</li>
                  <li>Suspend or block the user's account;</li>
                  <li>Report the transaction to competent authorities as required by law.</li>
                </ul>
                <p>3.3. Criteria for suspicious transactions include, but are not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unusual transaction volumes or frequency;</li>
                  <li>Transactions involving high-risk jurisdictions;</li>
                  <li>Use of anonymous payment instruments.</li>
                </ul>
              </div>
            </section>

            {/* 4. Prohibition of Using the Platform for Illegal Purposes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Prohibition of Using the Platform for Illegal Purposes</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. Users are prohibited from using the Platform for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Money laundering and financing illegal activities;</li>
                  <li>Circumventing sanctions restrictions;</li>
                  <li>Engaging in fraudulent schemes.</li>
                </ul>
                <p>4.2. If such actions are detected, the Platform reserves the right to irreversibly block the user's account and report the incident to law enforcement authorities.</p>
              </div>
            </section>

            {/* 5. Data Storage and Protection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Data Storage and Protection</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. All data collected under the KYC process is stored in secure systems in compliance with legal requirements.</p>
                <p>5.2. Access to user data is restricted to authorized personnel who adhere to strict confidentiality standards.</p>
                <p>5.3. The Platform does not share user data with third parties except as required by law.</p>
              </div>
            </section>

            {/* 6. Policy Updates and Revisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Policy Updates and Revisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. The Platform reserves the right to amend this Policy at any time.</p>
                <p>6.2. Continued use of the Platform after modifications to this Policy constitutes acceptance of the updated terms.</p>
              </div>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. For any inquiries related to AML/KYC, users can contact customer support via email at contact@ftsoa.art or through the feedback form.</p>
                <p>7.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(AMLKYC);
