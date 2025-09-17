<?php
switch ($_SERVER['REQUEST_METHOD']) {
    case "OPTIONS": // Preflight request for CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;

    case "POST":
        header("Access-Control-Allow-Origin: *");

        // Get raw JSON input
        $json = file_get_contents("php://input");
        $params = json_decode($json);

        // Sanitize & validate inputs
        $email       = filter_var($params->email ?? '', FILTER_VALIDATE_EMAIL);
        $name        = trim(strip_tags($params->name ?? ''));
        $userMessage = trim(strip_tags($params->message ?? ''));
        $agree       = $params->agree ?? false;

        if (!$email || !$name || !$userMessage || !$agree) {
            http_response_code(400);
            echo "Invalid input";
            exit;
        }

        // Recipient & subject
        $recipient = "mail@tobiasdreifke.com";  
        $subject   = "Contact Form Submission from {$name} <{$email}>";

        // Plain text version (safe fallback)
        $plainText = "From: {$name} <{$email}>\n\n" . $userMessage;

        // HTML version (formatted)
        $htmlText  = "
        <html>
          <body>
            <p><strong>From:</strong> {$name} &lt;{$email}&gt;</p>
            <p>" . nl2br($userMessage) . "</p>
          </body>
        </html>";

        // Boundary for multipart message
        $boundary = md5(uniqid(time()));

        // Headers
        $headers   = [];
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "From: noreply@tobiasdreifke.com"; 
        $headers[] = "Reply-To: {$email}";
        $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

        // Body with both plain text + HTML
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
        $body .= $plainText . "\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
        $body .= $htmlText . "\r\n";
        $body .= "--{$boundary}--";

        // Send the email
        if (mail($recipient, $subject, $body, implode("\r\n", $headers))) {
            echo "OK";
        } else {
            http_response_code(500);
            echo "Error sending mail";
        }
        break;

    default:
        header("Allow: POST", true, 405);
        exit;
}
