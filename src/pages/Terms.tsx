
import { memo } from "react";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Terms of Service (hereinafter referred to as the "Agreement") defines the terms of use of the platform http://ftsoa.art (hereinafter referred to as the "Platform"), which is designed for the listing and sale of digital art in NFT format.</p>
                <p>1.2. Using the Platform signifies full acceptance of this Agreement.</p>
                <p>1.3. The Platform Administration reserves the right to amend the Agreement at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. Platform Services */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Platform Services</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. The Platform provides users with the ability to list, sell, and purchase digital art in NFT format.</p>
                <p>2.2. The Platform is not a party to transactions between users and is not responsible for the quality, legality, or subsequent use of NFTs.</p>
                <p>2.3. The Platform charges a commission for services, as specified in the relevant sections of the Platform.</p>
              </div>
            </section>

            {/* 3. Registration and User Accounts */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Registration and User Accounts</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. To access all Platform features, users must register and complete the verification process (KYC/AML).</p>
                <p>3.2. The user is responsible for the security of their account credentials and agrees not to share them with third parties.</p>
                <p>3.3. The Platform reserves the right to block or delete a user account in case of violation of the terms of this Agreement.</p>
              </div>
            </section>

            {/* 4. User Rights and Obligations */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. User Rights and Obligations</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. Users agree not to post content that violates the rights of third parties, applicable laws, or moral and ethical standards.</p>
                <p>4.2. Users agree not to use the Platform for illegal activities, including money laundering and fraud.</p>
                <p>4.3. Creators guarantee that they hold all necessary rights to the content they upload.</p>
              </div>
            </section>

            {/* 5. Limitation of Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. The Platform is not responsible for losses incurred as a result of transactions between users.</p>
                <p>5.2. The Platform is not responsible for the storage, transfer, or loss of NFTs.</p>
                <p>5.3. The Platform does not guarantee uninterrupted operation or data security.</p>
              </div>
            </section>

            {/* 6. Dispute Resolution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Dispute Resolution</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. All disputes between users and the Platform shall be resolved through negotiations.</p>
                <p>6.2. If a dispute cannot be resolved amicably, it shall be subject to legal proceedings in accordance with the laws of the Kingdom of Cambodia.</p>
              </div>
            </section>

            {/* 7. Final Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Final Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. This Agreement takes effect from the moment the user accepts it.</p>
                <p>7.2. If any provision of the Agreement is found to be invalid, the remaining provisions shall remain in full force and effect.</p>
                <p>7.3. All notifications and communications shall be conducted through the official communication channels of the Platform.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Terms);
