import { requireAuth } from "@/lib/auth-server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, BookOpen, MessageCircle, Mail, Search, ExternalLink } from "lucide-react";

export default async function HelpPage() {
  // Server-side authentication check - cannot be bypassed
  await requireAuth();

  // Calculate stats for sidebar
  const totalKits = 0; // We could fetch this if needed
  const publicKits = 0;

  const faqs = [
    {
      question: "How do I create my first media kit?",
      answer: "Click the 'Create Kit' button on your dashboard, enter a name and optional brand color, then start uploading your assets."
    },
    {
      question: "What file types can I upload?",
      answer: "You can upload images (PNG, JPG, GIF), documents (PDF), and other common file formats. Each asset can be up to 10MB."
    },
    {
      question: "How do I share my media kit publicly?",
      answer: "In your kit editor, click the 'Share' button to get an embed code or public URL that you can share with anyone."
    },
    {
      question: "Can I reorder my assets?",
      answer: "Yes! Simply drag and drop assets within each category (logos, images, documents) to reorder them."
    },
    {
      question: "How do I download all assets at once?",
      answer: "On your public embed page, click the 'Download All' button to get a zip file containing all your assets."
    }
  ];

  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Kittie",
      icon: BookOpen,
      articles: [
        "Creating your first media kit",
        "Uploading and organizing assets",
        "Sharing your media kit"
      ]
    },
    {
      title: "Asset Management",
      description: "Tips for managing your brand assets",
      icon: HelpCircle,
      articles: [
        "Supported file types",
        "Organizing assets by category",
        "Reordering and editing assets"
      ]
    },
    {
      title: "Sharing & Embedding",
      description: "Share your media kits with the world",
      icon: ExternalLink,
      articles: [
        "Public embed pages",
        "Customizing embed appearance",
        "Download options"
      ]
    }
  ];

  return (
    <DashboardLayout totalKits={totalKits} publicKits={publicKits}>
      <div className="h-full bg-white">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Documentation</h1>
            <p className="text-gray-600">
              Find answers to common questions and learn how to use Kittie
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search help articles..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Help Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {helpSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-purple-600" />
                      <span>{section.title}</span>
                    </CardTitle>
                    <p className="text-gray-600">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.articles.map((article, articleIndex) => (
                        <li key={articleIndex} className="text-sm text-gray-600 hover:text-purple-600 cursor-pointer">
                          • {article}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span>Still need help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-gray-600 mb-4">
                    Get in touch with our support team for personalized help.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      support@kittie.com
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Live Chat
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book a Call</h3>
                  <p className="text-gray-600 mb-4">
                    Schedule a 15-minute call to get personalized guidance.
                  </p>
                  <Button className="w-full">
                    Schedule Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
