import PageLayout from '../components/PageLayout'

export default function Terms() {
  return (
    <PageLayout 
      title="Terms of Service" 
      subtitle="Last updated: June 1, 2023"
    >
      <div className="card space-y-6">
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Acceptance of Terms</h3>
          <p className="text-surface-700 dark:text-surface-300">
            By accessing or using DropVault's services, you agree to be bound by these Terms of Service. 
            If you do not agree with any part of these terms, you may not use our services.
          </p>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Account Registration</h3>
          <p className="text-surface-700 dark:text-surface-300">
            To use DropVault, you must create an account. You are responsible for maintaining the confidentiality 
            of your account credentials and for all activities that occur under your account. You must provide 
            accurate and complete information when creating your account and keep this information up to date.
          </p>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">User Conduct</h3>
          <p className="text-surface-700 dark:text-surface-300">
            You agree not to use DropVault to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Upload, store, or share any content that violates any applicable law or regulation</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Distribute malware, viruses, or any other malicious code</li>
            <li>Engage in any activity that could harm our services or interfere with other users</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Service Limitations</h3>
          <div className="space-y-2">
            <h4 className="font-medium">Storage Limits</h4>
            <p className="text-surface-700 dark:text-surface-300">
              Free accounts are limited to 5GB of storage. Premium accounts have higher limits as specified 
              in your subscription plan.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">File Size Limits</h4>
            <p className="text-surface-700 dark:text-surface-300">
              Individual files may not exceed 2GB for free accounts and 10GB for premium accounts.
            </p>
          </div>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Intellectual Property</h3>
          <p className="text-surface-700 dark:text-surface-300">
            DropVault and its original content, features, and functionality are owned by DropVault, Inc. and 
            are protected by international copyright, trademark, patent, trade secret, and other intellectual 
            property laws.
          </p>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Termination</h3>
          <p className="text-surface-700 dark:text-surface-300">
            We may terminate or suspend your account without prior notice if you violate these Terms of Service. 
            Upon termination, your right to use DropVault will immediately cease. You may also terminate your 
            account at any time by contacting us.
          </p>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Limitation of Liability</h3>
          <p className="text-surface-700 dark:text-surface-300">
            In no event shall DropVault, its directors, employees, partners, agents, suppliers, or affiliates 
            be liable for any indirect, incidental, special, consequential, or punitive damages, including 
            without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Changes to Terms</h3>
          <p className="text-surface-700 dark:text-surface-300">
            We reserve the right to modify these Terms of Service at any time. We will provide notice of any 
            significant changes by posting the new Terms of Service on this page and updating the "Last updated" 
            date.
          </p>
        </section>
      </div>
    </PageLayout>
  )
}