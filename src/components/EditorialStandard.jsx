import React from 'react';

const EditorialStandard = () => {
  const standards = [
    {
      title: '1. Accuracy & Credibility',
      description:
        'All content published on SMUTV must be fact-checked and backed by credible sources. Writers are expected to cite references where necessary and avoid the dissemination of false or misleading information.',
    },
    {
      title: '2. Originality & Plagiarism Policy',
      description:
        'Submitted content must be original. Plagiarism of any kind is strictly prohibited and will result in immediate removal of the content and possible suspension of the writer.',
    },
    {
      title: '3. Neutrality & Objectivity',
      description:
        'Writers should maintain an objective tone, especially in news and factual reporting. Bias and promotional tones must be avoided unless in clearly labeled opinion pieces.',
    },
    {
      title: '4. Inclusivity & Respectful Language',
      description:
        'We value diversity. Content must avoid discriminatory language or any form of hate speech. Respectful, inclusive language should always be used.',
    },
    
    {
      title: '5. Style & Formatting',
      description:(
        <p className="text-gray-700 dark:text-gray-300">
        'Follow SMUTV’s writing style guide: clear headlines, proper paragraph structure, bullet points for clarity, and concise sentences. Consistent tone and formatting improve readability.  
        <a 
        href='/writing-style-guide'
        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Style & Formatting
        </a>
        </p>
      ),
    },
    {
      title: '6. Visual Media Standards',
      description: 
        'Images, videos, and other media used must be high quality, relevant, and properly credited. Copyrighted materials must have explicit permissions or fall under fair use.',
       
    },
    {
      title: '7. Updates & Revisions',
      description:
        'Content may be updated post-publication to correct errors or reflect new developments. Contributors must remain available for follow-ups when necessary.',
    },
    {
      title: '8. Ethical Considerations',
      description:
        'Writers should avoid conflicts of interest and maintain integrity in sourcing and storytelling. Sensitive topics must be handled with care and empathy.',
    },
  ];

  return (
    <section className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 px-6 py-16 sm:px-8 lg:px-12 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Editorial Standards</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Guidelines every contributor must follow to ensure consistent, ethical, and high-quality content.
        </p>
      </div>

      <div className="space-y-10">
        {standards.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-zinc-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">{item.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditorialStandard;
