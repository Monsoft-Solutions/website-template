import { Metadata } from "next";
import { Markdown } from "@/components/ui/markdown";
import { generateSeoMetadata } from "@/lib/config/seo";

const termsContent = `# Terms of Service

*Last updated: ${new Date().toLocaleDateString()}*

## Template License and Usage

This website template was developed by **Monsoft Solutions, LLC** ([https://monsoftsolutions.com](https://monsoftsolutions.com)) and is provided under the following terms.

## License Grant

By using this template, you are granted a **free, non-exclusive, worldwide license** to:

- ✅ **Use** the template for personal and commercial projects
- ✅ **Modify** the template code and design as needed
- ✅ **Distribute** websites built with this template
- ✅ **Sell** services or products using websites built with this template

## Template Permissions

### What You Can Do
- Use the template for unlimited personal projects
- Use the template for unlimited commercial projects
- Modify, customize, and extend the template functionality
- Remove or modify any template branding or credits
- Use the template as a base for client work
- Create multiple websites using this template

### What You Cannot Do
- **Redistribute the template** as a template or boilerplate
- **Sell or license** the template itself as a product
- **Claim ownership** of the original template code
- **Hold the developer liable** for any issues arising from template usage

## Template Quality and Support

### "As Is" Basis
This template is provided **"as is"** without warranties of any kind, including but not limited to:

- Merchantability or fitness for a particular purpose
- Error-free operation or uninterrupted service
- Compatibility with all systems or browsers
- Security against all potential vulnerabilities

### Support Limitations
- **No guaranteed support**: Support is provided on a best-effort basis
- **Community support**: Primary support through community channels
- **Developer contact**: Available through [https://monsoftsolutions.com](https://monsoftsolutions.com)
- **No SLA**: No service level agreements or guaranteed response times

## User Responsibilities

### Implementation
You are responsible for:

1. **Proper implementation** of the template for your use case
2. **Security measures** for your website and any data you collect
3. **Legal compliance** in your jurisdiction and industry
4. **Regular updates** to dependencies and security patches
5. **Backup and recovery** of your website and data

### Content and Compliance
- Ensure all content you add complies with applicable laws
- Implement appropriate privacy policies and terms for your specific use
- Obtain necessary licenses for any third-party content you add
- Comply with accessibility standards as required

## Intellectual Property

### Template Components
- **Original code**: Owned by Monsoft Solutions, LLC
- **Third-party libraries**: Subject to their respective licenses
- **Design elements**: Available for use as part of this template
- **Documentation**: Provided under the same license terms

### Your Content
- You retain all rights to content you create using this template
- You are responsible for ensuring you have rights to any content you add
- The template developer has no claim to your implementation or content

## Limitation of Liability

### Developer Liability
Monsoft Solutions, LLC and its developers shall not be liable for:

- **Direct damages** resulting from template usage
- **Indirect or consequential damages** including lost profits
- **Data loss or corruption** from template implementation
- **Security breaches** in your implementation
- **Downtime or service interruptions** of your website

### Maximum Liability
The maximum liability of the template developer shall not exceed the amount paid for the template (which is $0 for this free template).

## Third-Party Services

### Integrations
This template may include or support integrations with:

- Analytics services (Google Analytics, etc.)
- Content delivery networks
- Social media platforms
- Email services
- Payment processors

### Third-Party Terms
- Each service has its own terms and conditions
- You are responsible for compliance with third-party terms
- The template developer is not responsible for third-party service changes

## Updates and Modifications

### Template Updates
- Updates are provided on a voluntary basis
- No guarantee of backward compatibility
- You are responsible for testing updates before deployment
- Previous versions remain available for your use

### Modification Rights
- You may modify the template without restriction
- Modified versions are your responsibility to maintain
- No obligation to share modifications with the community

## Termination

### License Termination
This license remains in effect until:

- You choose to stop using the template
- You materially breach these terms
- Legal requirements necessitate termination

### Effect of Termination
- You may continue using existing implementations
- No obligation to remove existing websites built with the template
- Cannot create new implementations after termination

## Governing Law

These terms are governed by the laws of the jurisdiction where Monsoft Solutions, LLC is established, without regard to conflict of law principles.

## Contact Information

For questions about these terms:

**Monsoft Solutions, LLC**  
Website: [https://monsoftsolutions.com](https://monsoftsolutions.com)

## Changes to Terms

These terms may be updated to reflect:

- Changes in applicable law
- Template feature updates
- Community feedback and best practices

Continued use of the template after changes constitutes acceptance of updated terms.

---

*By using this template, you acknowledge that you have read, understood, and agree to be bound by these terms of service.*
`;

export const metadata: Metadata = generateSeoMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for the free website template developed by Monsoft Solutions, LLC. Learn about usage rights, permissions, and responsibilities.",
});

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container py-16">
        <div className="mx-auto max-w-4xl">
          <Markdown content={termsContent} className="prose-lg" />
        </div>
      </div>
    </div>
  );
}
