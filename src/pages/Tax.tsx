
import { memo } from "react";

const Tax = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Tax Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Tax Policy (hereinafter referred to as the "Policy") regulates tax-related aspects associated with the use of the platform http://ftsoa.art (hereinafter referred to as the "Platform").</p>
                <p>1.2. By using the Platform, users agree to comply with this Policy and independently fulfill their tax obligations.</p>
                <p>1.3. The Platform reserves the right to amend this Policy at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. User Responsibility for Taxation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. User Responsibility for Taxation</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. Users are fully responsible for calculating, reporting, and paying all applicable taxes in their jurisdiction related to their use of the Platform.</p>
                <p>2.2. The Platform does not act as a tax agent and does not withhold taxes on users' income.</p>
                <p>2.3. Users are responsible for consulting tax professionals or relevant authorities regarding taxation matters.</p>
              </div>
            </section>

            {/* 3. Taxation of Transactions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Taxation of Transactions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. Income earned by users from selling NFTs or other digital assets on the Platform may be subject to taxation depending on the laws of their country.</p>
                <p>3.2. Buyers and sellers must consider potential tax obligations, including VAT, income tax, and capital gains tax.</p>
                <p>3.3. If required by tax authorities, users must provide all necessary information regarding their transactions.</p>
              </div>
            </section>

            {/* 4. International Taxation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. International Taxation</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. Users operating in different jurisdictions must consider the specifics of international taxation.</p>
                <p>4.2. The Platform is not responsible for users' tax obligations arising from international transactions.</p>
                <p>4.3. Users should contact their local tax authorities if clarification on taxation is needed.</p>
              </div>
            </section>

            {/* 5. Requests from Tax Authorities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Requests from Tax Authorities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. If the Platform receives official requests from tax authorities, it may provide access to the requested data in compliance with legal requirements.</p>
                <p>5.2. Users acknowledge that tax authorities may require reporting of income earned through the Platform.</p>
              </div>
            </section>

            {/* 6. Dispute Resolution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Dispute Resolution</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. In the event of tax disputes between a user and tax authorities, the Platform is not a party to the conflict.</p>
                <p>6.2. Users bear full responsibility for resolving their tax matters.</p>
              </div>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. Users may direct all taxation-related inquiries to the Platform's support team via email at contact@ftsoa.art or through the feedback form.</p>
                <p>7.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Tax);
