import { formatGHS } from "./money";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

type OrderEmail = {
  reference: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  total: number;
  status: string;
  user?: { email: string; emailNotifications?: boolean } | null;
  items: Array<{ name: string; quantity: number; price: number }>;
};

const statusCopy: Record<string, string> = {
  PENDING: "We have received your order and are waiting for payment confirmation.",
  PAID: "Payment has been confirmed. Your order is now ready for processing.",
  PROCESSING: "Our team is preparing your order.",
  SHIPPED: "Your order has been dispatched and is on its way.",
  DELIVERED: "Your order has been delivered. Thank you for shopping with Nana B.",
  CANCELLED: "Your order has been cancelled. Please contact us if you need assistance.",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] || character);
}

function emailFrame(title: string, content: string) {
  return `
    <div style="margin:0;background:#f4f6fa;padding:32px 16px;font-family:Arial,sans-serif;color:#101828">
      <div style="max-width:620px;margin:auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e4e7ec">
        <div style="background:#08255f;padding:24px 28px;color:#fff">
          <div style="font-size:12px;letter-spacing:2px;color:#bac8e8">NANA B ENTERPRISES</div>
          <h1 style="margin:8px 0 0;font-size:24px">${title}</h1>
        </div>
        <div style="padding:28px">${content}</div>
        <div style="padding:18px 28px;background:#f8fafc;color:#667085;font-size:12px">
          Need help? Call or WhatsApp 0244 018 530.
        </div>
      </div>
    </div>`;
}

export function emailNotificationsConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function ownerEmailAddress() {
  return process.env.OWNER_EMAIL || "nanabooakye1@gmail.com";
}

export async function sendEmail(message: EmailMessage) {
  if (!emailNotificationsConfigured() || !message.to) {
    console.info(`[email skipped] ${message.subject}`);
    return { sent: false, reason: "Email service is not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
      }),
    });

    if (!response.ok) {
      console.error("[email failed]", response.status, await response.text());
      return { sent: false, reason: "Email provider rejected the message" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email failed]", error);
    return { sent: false, reason: "Email provider could not be reached" };
  }
}

export async function notifyOwnerOfOrder(order: OrderEmail) {
  const itemRows = order.items
    .map((item) => `<li style="margin:8px 0">${item.quantity} x ${escapeHtml(item.name)} - ${formatGHS(item.price * item.quantity)}</li>`)
    .join("");

  return sendEmail({
    to: ownerEmailAddress(),
    subject: `New Nana B order ${order.reference}`,
    html: emailFrame("A new order has arrived", `
      <p><strong>${escapeHtml(order.fullName)}</strong> placed an order worth <strong>${formatGHS(order.total)}</strong>.</p>
      <ul style="padding-left:20px">${itemRows}</ul>
      <p><strong>Phone:</strong> ${escapeHtml(order.phone)}<br/>
      <strong>Delivery:</strong> ${escapeHtml(order.address)}, ${escapeHtml(order.city)}</p>
      <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/orders" style="background:#123d91;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:bold">Open admin orders</a></p>
    `),
  });
}

export async function notifyCustomerOfStatus(order: OrderEmail) {
  if (!order.user?.email) return { sent: false, reason: "Customer email is unavailable" };
  if (order.user.emailNotifications === false) return { sent: false, reason: "Customer disabled order emails" };

  return sendEmail({
    to: order.user.email,
    subject: `Order ${order.reference}: ${order.status.toLowerCase()}`,
    html: emailFrame(`Your order is ${order.status.toLowerCase()}`, `
      <p>Hello ${escapeHtml(order.fullName)},</p>
      <p>${statusCopy[order.status] || "The status of your order has changed."}</p>
      <div style="margin:22px 0;padding:16px;border-radius:12px;background:#eef3ff">
        <strong>Order:</strong> ${escapeHtml(order.reference)}<br/>
        <strong>Total:</strong> ${formatGHS(order.total)}
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/account/orders" style="color:#123d91;font-weight:bold">View your orders</a></p>
    `),
  });
}
