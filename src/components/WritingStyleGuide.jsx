import React from 'react';

const WritingStyleGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">SMUTV Writing Style Guide</h1>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">1. Purpose of the Style Guide</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
          This style guide ensures that all content submitted to SMUTV is clear, consistent, professional, and aligns with our brand values. It applies to all creators and writers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">2. Tone and Voice</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
          SMUTV aims to create a voice that resonates with a diverse, global audience while staying approachable, respectful, and informative. Here are the key characteristics of our tone:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Conversational yet professional:</strong> Write in a way that is friendly, clear, and easy to understand, while maintaining professionalism.</li>
          <li><strong>Engaging:</strong> Engage the reader with an active, dynamic voice.</li>
          <li><strong>Respectful:</strong> Content should always be considerate and free of offensive language or bias.</li>
          <li><strong>Inclusive:</strong> Be mindful of language that promotes diversity and inclusion.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">3. Writing Style</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Clarity:</strong> Always prioritize clear, concise communication. Avoid jargon unless it's necessary and well-explained.</li>
          <li><strong>Sentence structure:</strong> Use simple, direct sentences. Keep sentences under 20 words when possible.</li>
          <li><strong>Paragraphs:</strong> Break up long text into smaller paragraphs (3-4 sentences max) for readability.</li>
          <li><strong>Headings and Subheadings:</strong> Use them consistently to break down content into digestible sections.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">4. Grammar and Punctuation</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Use active voice:</strong> Prefer active voice over passive voice whenever possible.</li>
          <li><strong>Oxford Comma:</strong> Always use the Oxford comma in lists.</li>
          <li><strong>Tense:</strong> Keep content consistent. Generally, we prefer present tense for general statements and future tense for upcoming events.</li>
          <li><strong>Spelling:</strong> Use American English spelling (e.g., "organize" instead of "organise").</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">5. Content Guidelines</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Originality:</strong> All content must be original and free of plagiarism. Properly attribute sources when necessary.</li>
          <li><strong>Accuracy:</strong> Double-check all facts before submitting. Cite credible sources for statistical or factual information.</li>
          <li><strong>Neutrality:</strong> Maintain objectivity, especially in news articles. Avoid taking sides unless you're writing opinion pieces.</li>
          <li><strong>Inclusion of Sources:</strong> Link to relevant sources, research, and references to enhance the credibility of the content.</li>
          <li><strong>Visual Content:</strong> Always use images, graphics, and videos that enhance the article and are relevant to the topic.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">6. Formatting Standards</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Headings:</strong>
            <ul className="list-inside pl-4 text-gray-700 dark:text-gray-300 mt-2">
              <li>H1 for article titles (only one per article).</li>
              <li>H2 for section titles.</li>
              <li>H3 for subsection titles.</li>
            </ul>
          </li>
          <li><strong>Bullet points:</strong> Use bullet points for lists, with the first word capitalized.</li>
          <li><strong>Links:</strong> Hyperlink relevant phrases, not just "click here." Example: <a href="/termsAndConditions" className="text-blue-500 hover:underline">For more information, visit our Terms and Conditions.</a></li>
          <li><strong>Font and Size:</strong> Use the designated brand fonts in the correct sizes. Generally, keep body text at 14px for readability.</li>
          <li><strong>Images:</strong> Ensure all images are high resolution, properly credited, and appropriately sized.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">7. Prohibited Content</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Hate Speech and Offensive Language:</strong> Content that promotes discrimination, hate speech, or offensive language will not be tolerated.</li>
          <li><strong>Misinformation:</strong> Fake news, unfounded claims, and unverifiable information are strictly prohibited.</li>
          <li><strong>Sensitive Content:</strong> Always label content that discusses sensitive topics like health issues or tragedies. Offer disclaimers where appropriate.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">8. SEO and Keywords</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Keywords:</strong> Use relevant keywords naturally throughout the text without overstuffing. Include keywords in the title, subheadings, and body text where relevant.</li>
          <li><strong>Meta Descriptions:</strong> Always include a meta description that is clear, concise, and includes the main keyword.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">9. Legal Considerations</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Intellectual Property:</strong> Ensure all content respects intellectual property laws. Do not infringe on copyrights or trademarks.</li>
          <li><strong>Confidentiality:</strong> Do not disclose private, confidential, or personal information without permission.</li>
          <li><strong>Terms and Conditions:</strong> Writers must adhere to SMUTV’s <a href="/termsAndConditions" className="text-blue-500 hover:underline">Terms and Conditions</a>.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">10. Editing and Review</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li><strong>Proofreading:</strong> Always proofread content for spelling, grammar, and punctuation errors. Use tools like Grammarly or Hemingway for assistance.</li>
          <li><strong>Feedback:</strong> Be open to constructive criticism. Revisions and edits are part of the process to maintain quality.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-300">11. Submission Requirements</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mt-4 space-y-3">
          <li>Submit content in Google Docs, Word format, or directly to the SMUTV platform.</li>
          <li>Include a brief summary or introduction to each article (1-2 sentences).</li>
          <li>Provide any necessary links or references used in the article.</li>
          <li>All images and media must be submitted alongside the content with proper attribution.</li>
        </ul>
      </section>
    </div>
  );
};

export default WritingStyleGuide;
