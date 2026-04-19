function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildReminderEmailHtml(params: {
  recipientName: string;
  taskTitle: string;
  startDate: string;
  latestUpdate: string | null;
}): string {
  const recipientName = escapeHtml(params.recipientName);
  const taskTitle = escapeHtml(params.taskTitle);
  const startDate = escapeHtml(params.startDate);
  const latestUpdate = escapeHtml(params.latestUpdate ?? "لا يوجد تحديث مسجّل");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تذكير بمهمة</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
    body, table, td, p, a, span { font-family: 'Tajawal', 'Arial', sans-serif !important; }
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      direction: rtl;
      color: #1d1d1f;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    .wrapper {
      width: 100%;
      background: transparent;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: transparent;
      border-radius: 12px;
    }
    .content {
      padding: 48px;
    }
    .brand {
      font-size: 14px;
      font-weight: 700;
      color: #0071e3;
    }
    .divider {
      border-top: 1px solid #d2d2d7;
      height: 1px;
      line-height: 1px;
      font-size: 0;
    }
    .text {
      font-size: 16px;
      line-height: 1.9;
      color: #1d1d1f;
    }
    .greeting {
      font-weight: 700;
    }
    .details-box {
      background-color: #f5f5f7;
      border-radius: 8px;
    }
    .details-cell {
      padding: 24px;
    }
    .task-title {
      color: #0071e3;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.7;
    }
    .detail-label {
      font-weight: 500;
      color: #1d1d1f;
    }
    .footer {
      font-size: 12px;
      line-height: 1.8;
      color: #6e6e73;
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" class="wrapper">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" class="container">
          <tr>
            <td class="content">
              <table role="presentation" width="100%">
                <tr>
                  <td class="brand">متتبع المهام</td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="divider"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="text" style="padding-top: 28px;">
                    <div class="greeting">الأخ/ ${recipientName}</div>
                    <div>السلام عليكم ورحمة الله وبركاته</div>
                  </td>
                </tr>
                <tr>
                  <td class="text" style="padding-top: 24px;">تذكير بخصوص المهمة التالية:</td>
                </tr>
                <tr>
                  <td style="padding-top: 18px;">
                    <table role="presentation" width="100%" class="details-box">
                      <tr>
                        <td class="details-cell">
                          <div class="task-title">${taskTitle}</div>
                          <div class="text" style="padding-top: 14px;">
                            <span class="detail-label">تاريخ البداية:</span>
                            <span>${startDate}</span>
                          </div>
                          <div class="text" style="padding-top: 8px;">
                            <span class="detail-label">آخر تحديث:</span>
                            <span>${latestUpdate}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="text" style="padding-top: 24px;">نأمل منكم التحديث.</td>
                </tr>
                <tr>
                  <td class="text" style="padding-top: 20px;">تحياتي،</td>
                </tr>
                <tr>
                  <td class="footer" style="padding-top: 28px;">تم إرسال هذا التذكير من نظام متتبع المهام.</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
