import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How can I track my order status?",
    answer:
      "Visit the Orders page from your profile to view the status of every purchase. Each order shows progress from pending payment to delivery, and you can open the order details for tracking updates, delivery information, and payment status.",
  },
  {
    question: "Can I update my shipping address after checkout?",
    answer:
      "If your order has not yet been processed, contact support immediately with your order number and the new address. Once an order enters the shipping process, changes may not be possible, so always confirm address details before placing an order.",
  },
  {
    question: "What should I do if my order is late or incorrect?",
    answer:
      "Open the order detail page and check the latest status first. If the order is delayed, contact support with the order number. If the item is wrong or damaged, request a return or refund through the Return Policy flow.",
  },
  {
    question: "What is an affiliate?",
    answer:
      "An affiliate is a Sell Rush user who shares product links with their network. Affiliates earn a commission when customers purchase through those unique referral links, helping sellers reach more buyers while rewarding marketers.",
  },
  {
    question: "How do affiliate commissions work?",
    answer:
      "Affiliates earn commissions when customers purchase through their unique share links. Commissions are released after order verification, delivery confirmation, and the refund verification period to ensure the sale is valid.",
  },
  {
    question: "How do I add a new shipping address?",
    answer:
      "Go to your profile and select Add Address. Fill in the street, city, state, country, and optional zip code. You can also set one address as your default for faster checkout.",
  },
  {
    question: "What happens when I set a default address?",
    answer:
      "Your default address is prefilled during checkout to speed up order placement. You can still edit the shipping details at checkout or choose a different address when placing an order.",
  },
  {
    question: "How do I remove an old address?",
    answer:
      "Open your profile addresses list, select the address you want to remove, and choose delete. If the deleted address was default, set another saved address as default for future orders.",
  },
  {
    question: "Can I use different addresses for different orders?",
    answer:
      "Yes. During checkout, enter a new shipping address or choose a saved address. Each order can be shipped to a different location if needed.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Sell Rush accepts secure online payment methods supported by our payment partner. Payment options may include card payments and other local payment methods, depending on your location.",
  },
  {
    question: "How do I know my payment was successful?",
    answer:
      "After payment, you will be redirected to the order confirmation page and receive a confirmation email. The order status will also update in your Orders page to reflect successful payment.",
  },
  {
    question: "How long does refund processing take?",
    answer:
      "Approved refunds typically take 5–10 business days depending on your payment provider. We will notify you once the refund is complete and the amount has been returned to your account.",
  },
  {
    question: "Which items are not refundable?",
    answer:
      "Some products may be non-refundable, such as personal or hygiene items, digital goods, or customized products. The product listing and seller policy will indicate whether an item is eligible for returns.",
  },
  {
    question: "How do I change my profile information?",
    answer:
      "Go to your profile page and use the edit form to update your name, email, phone number, and other account details. Save changes before leaving the page.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "Visit the Contact Support page for email and phone contact details. You can reach support for order issues, account questions, affiliate concerns, and shipping inquiries.",
  },
  {
    question: "How do I start selling on Sell Rush?",
    answer:
      "Create a seller account, add your products, and list them with accurate descriptions, images, and prices. Use the seller dashboard to manage inventory, orders, and customer messages.",
  },
  {
    question: "How do I start affiliate marketing on Sell Rush?",
    answer:
      "Sign up for an affiliate account, browse products, and use your unique referral links to share products across social media, messaging apps, and online communities.",
  },
  {
    question: "What should I do if I suspect fraud?",
    answer:
      "Report suspicious activity to support immediately. Do not share your account login details, and avoid responding to unsolicited messages asking for payment outside the platform.",
  },
  {
    question: "Can I cancel an order after it is placed?",
    answer:
      "Orders can only be canceled before processing begins. Contact support as soon as possible if you need to cancel, and we will check whether the order can still be stopped.",
  },
  {
    question: "How do I update my password?",
    answer:
      "Visit your account settings or profile page to change your password. Use a strong password and avoid reusing credentials from other websites.",
  },
  {
    question: "Where can I find my affiliate earnings?",
    answer:
      "Your affiliate earnings are visible in the affiliate dashboard. The dashboard shows total earnings, pending payouts, and completed commission history.",
  },
];

export default function HelpCenter() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Help Center</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Find answers to common questions about orders, shipping, returns,
            and the Sell Rush platform.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-100 px-6 py-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Contact Sell Rush Support
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-5 space-y-5 text-slate-700">
                <p>
                  We are always ready to assist you with orders, returns,
                  affiliate inquiries, and general help.
                </p>
                <div>
                  <p className="font-semibold text-slate-900">
                    Customer Support
                  </p>
                  <p className="mt-1">support@sellrush.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Business Inquiries
                  </p>
                  <p className="mt-1">business@sellrush.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Affiliate Support
                  </p>
                  <p className="mt-1">affiliates@sellrush.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Phone Support</p>
                  <p className="mt-1">+234 916 278 5798</p>
                  <p>+234 813 839 2800</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Office Hours</p>
                  <p className="mt-1">Monday – Saturday</p>
                  <p>8:00 AM – 6:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Headquarters</p>
                  <p className="mt-1">Abuja, Nigeria</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Social Media</p>
                  <p className="mt-1">Instagram: @sellrush</p>
                  <p>Facebook: Sell Rush</p>
                  <p>Twitter/X: @sellrushapp</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <Card key={faq.question} className="overflow-hidden">
                  <CardHeader className="bg-slate-100 px-6 py-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <div className="flex flex-col gap-4">
                      <p className="text-slate-700">
                        {isOpen ? faq.answer : "Tap show to read the answer."}
                      </p>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveIndex(isOpen ? null : index)}
                        >
                          {isOpen ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
