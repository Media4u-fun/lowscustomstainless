"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const sendReply = action({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    sourceType: v.string(),
    sourceId: v.string(),
  },
  handler: async (ctx, { to, subject, body, sourceType, sourceId }) => {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #333;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);padding:32px 40px;border-bottom:2px solid #C8A951;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:2px;text-transform:uppercase;">LOW'S CUSTOM STAINLESS</div>
                    <div style="font-size:11px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">33 Years. Zero Compromises.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <div style="color:#ccc;font-size:15px;line-height:1.7;white-space:pre-wrap;">${body}</div>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;padding:24px 40px;border-top:1px solid #222;">
              <div style="color:#666;font-size:12px;text-align:center;">Low's Custom Stainless - Commercial Fabrication & Installation</div>
              <div style="color:#666;font-size:12px;text-align:center;margin-top:4px;">scott@lowscustomstainless.com</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "Low's Custom Stainless <scott@lowscustomstainless.com>",
      to,
      subject,
      html,
    });

    await ctx.runMutation(api.emailRepliesHelpers.insertLog, {
      to,
      subject,
      body,
      sourceType,
      sourceId,
      sentAt: Date.now(),
    });
  },
});
