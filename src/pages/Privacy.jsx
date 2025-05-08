import PageLayout from '../components/PageLayout'

export default function Privacy() {
  return (
    <PageLayout 
      title="Privacy Policy" 
      subtitle="Last updated: June 1, 2023"
    >
      <div className="card space-y-6">
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Introduction</h3>
          <p className="text-surface-700 dark:text-surface-300">
            At DropVault, we take your privacy seriously. This Privacy Policy describes how we collect, use, 
            and share information about you when you use our services. By using DropVault, you agree to the 
            collection and use of information in accordance with this policy.
          </p>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Information We Collect</h3>
          <div className="space-y-2">
            <h4 className="font-medium">Personal Information</h4>
            <p className="text-surface-700 dark:text-surface-300">
              When you register for an account, we collect your name, email address, and password. We may also 
              collect your payment information if you upgrade to a premium plan.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Usage Information</h4>
            <p className="text-surface-700 dark:text-surface-300">
              We collect information about how you use our service, including the files you upload, 
              download, and share. We also collect information about your device, such as your IP address, 
              browser type, and operating system.
            </p>
          </div>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">How We Use Your Information</h3>
          <p className="text-surface-700 dark:text-surface-300">
            We use your information to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">How We Share Your Information</h3>
          <p className="text-surface-700 dark:text-surface-300">
            We may share your information with:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Service providers who perform services on our behalf</li>
            <li>Other users when you choose to share files with them</li>
            <li>Law enforcement or other third parties when required by law</li>
            <li>Other parties in connection with a company transaction, such as a merger or sale of assets</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Your Rights and Choices</h3>
          <p className="text-surface-700 dark:text-surface-300">
            You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Access, correct, or delete your personal information</li>
            <li>Object to the processing of your personal information</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="text-surface-700 dark:text-surface-300">
            If you have any questions or concerns about our Privacy Policy, please contact us at 
            <a href="mailto:privacy@dropvault.com" className="text-primary hover:text-primary-dark dark:hover:text-primary-light ml-1">privacy@dropvault.com</a>.
          </p>
        </section>
      </div>
    </PageLayout>
  )
}