import React from 'react';

const TermsAndConditions = () => {
  const sections = [
    {
      title: '1. Overview',
      content:
        'Welcome to SMUTV, your trusted media partner. By accessing or contributing to our platform, you agree to the following terms. These conditions foster a collaborative, secure, and respectful environment for our global community of creators and writers.',
    },
    {
        title: '2. Content Submission',
        content: (
          <p className="text-gray-700 dark:text-gray-300">
            Contributors retain ownership of their original work but grant SMUTV a worldwide, perpetual, royalty-free license to use, edit, distribute, and promote submissions across all channels. Content must not infringe upon intellectual property rights and must meet our{' '}
            <a
              href="/editorial-standard"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              editorial standards
            </a>.
          </p>
        ),
      },
      
    {
      title: '3. Creator & Writer Responsibilities',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Produce original, engaging, and informative content aligned with SMUTV’s values.</li>
          <li>Uphold accuracy and verify all facts before submission.</li>
          <li>Avoid defamatory, harmful, or misleading material.</li>
          <li>Participate in constructive feedback and maintain professionalism in communications.</li>
        </ul>
      ),
    },
    {
      title: '4. Monetization & Payments',
      content:
        'Creators may be eligible for monetization based on audience reach, engagement, and content quality. Revenue-sharing models are transparent and subject to periodic review. Payments are issued monthly through secure channels, subject to verification and minimum thresholds.',
    },
    {
      title: '5. Termination & Violations',
      content:
        'We reserve the right to remove any content or suspend contributors who violate our policies. Repeated violations may result in permanent bans. Contributors will be notified of infractions and provided the opportunity to appeal.',
    },
    {
      title: '6. Confidentiality & Data Use',
      content:
        'Contributor information will be kept confidential and used solely for administrative purposes, unless otherwise agreed. We uphold GDPR and international privacy standards to protect your data.',
    },
    {
      title: '7. Contact & Support',
      content: (
        <>
          For inquiries or support, contact us at{' '}
          <a
            href="mailto:support@smutv.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            support@smutv.com
          </a>
          {' '}or visit our Help Center.
        </>
      ),
    },
    {
      title: '8. Legal Jurisdiction',
      content:
        'These terms are governed by the laws of the jurisdiction where SMUTV operates. Disputes will be resolved through arbitration before pursuing legal remedies. Continued use of the platform constitutes agreement to these terms.',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 text-gray-800 dark:text-gray-100 pt-5 pb-5 px-6 py-20 sm:px-8 lg:px-16 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">Terms & Conditions</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          These terms are designed to ensure a transparent and collaborative experience for all creators and contributors on SMUTV.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-lg p-8 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TermsAndConditions;
