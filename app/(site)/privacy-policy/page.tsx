import { Metadata } from "next";
import { Markdown } from "@/components/ui/markdown";
import { generateSeoMetadata } from "@/lib/config/seo";

const privacyContent = `# Privacy Policy

*Last updated: ${new Date().toLocaleDateString()}*

## Template Usage and Privacy

This website template was developed by **Monsoft Solutions, LLC** ([https://monsoftsolutions.com](https://monsoftsolutions.com)) and is provided free of charge for both personal and commercial use.

## Information We Collect

### Template Usage
When you use this website template, you may collect various types of information from your visitors:

- **Personal Information**: Information you choose to collect through contact forms, newsletter signups, or other interactive features
- **Analytics Data**: Information about how visitors interact with your website
- **Technical Information**: Browser type, device information, IP addresses, and other technical data

### Template Modifications
This template is free to modify and customize according to your needs. Any data collection practices are entirely dependent on how you implement and customize the template.

## How Information is Used

The purpose and use of any collected information depends entirely on your implementation of this template:

- To provide and maintain your website service
- To communicate with visitors and customers
- To improve your website and user experience
- To comply with legal obligations

## Data Security

As the implementer of this template, you are responsible for:

- Implementing appropriate security measures for any data you collect
- Ensuring compliance with applicable privacy laws (GDPR, CCPA, etc.)
- Regularly updating security practices and dependencies

## Template Distribution and Modification

This template is distributed under a free-to-use license:

- ✅ **Free to use** for personal and commercial projects
- ✅ **Free to modify** and customize as needed
- ✅ **No attribution required** (though appreciated)
- ✅ **No usage restrictions** on the template itself

## Third-Party Services

This template may include integrations with third-party services such as:

- Analytics providers (Google Analytics, etc.)
- Content delivery networks
- Social media platforms
- Contact form services

Each third-party service has its own privacy policy that you should review and ensure compliance with.

## Template Updates

- **No Automatic Updates**: This template does not automatically update or collect usage data
- **Version Control**: All updates are manual and under your control
- **Backward Compatibility**: Updates aim to maintain backward compatibility when possible

## Your Responsibilities

As the user of this template, you are responsible for:

1. **Legal Compliance**: Ensuring your use complies with applicable laws
2. **Privacy Notices**: Creating appropriate privacy notices for your specific use case
3. **Data Protection**: Implementing proper data protection measures
4. **User Consent**: Obtaining necessary user consents as required by law

## Template Support

For questions about this template:

- **Developer**: Monsoft Solutions, LLC
- **Website**: [https://monsoftsolutions.com](https://monsoftsolutions.com)
- **Support**: Available through the developer's website

## Disclaimer

This template is provided "as is" without any warranties. The template developer is not responsible for:

- How you implement or modify the template
- Data collection practices you implement
- Legal compliance of your specific implementation
- Any damages arising from template usage

## Changes to This Privacy Policy

This privacy policy template may be updated to reflect:

- Changes in privacy law requirements
- Template feature updates
- Best practice improvements

## Contact Information

For questions about this template's privacy aspects, contact:

**Monsoft Solutions, LLC**  
Website: [https://monsoftsolutions.com](https://monsoftsolutions.com)

---

*This privacy policy template is provided as a starting point. You should customize it to reflect your specific data collection and usage practices, and ensure compliance with applicable laws in your jurisdiction.*
`;

export const metadata: Metadata = generateSeoMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for the free website template developed by Monsoft Solutions, LLC. Learn about template usage, modifications, and your responsibilities.",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container py-16">
        <div className="mx-auto max-w-4xl">
          <Markdown content={privacyContent} className="prose-lg" />
        </div>
      </div>
    </div>
  );
}
