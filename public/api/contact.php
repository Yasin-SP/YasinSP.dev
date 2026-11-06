<?php
// Contact form handler for the cPanel host.
// Delivery: Bale messenger bot (works inside Iran) + email, and every valid message is
// also appended to a log file outside public_html so nothing is ever lost.
// Settings (bot token, chat id, emails) live in api/config.php, which updates never overwrite.

$cfg = is_file(__DIR__ . '/config.php') ? (require __DIR__ . '/config.php') : [];
define('TO_EMAIL', $cfg['to_email'] ?? 'yasinsp.dev@gmail.com');
define('FROM_EMAIL', $cfg['from_email'] ?? 'no-reply@yasinsp.dev');
define('BALE_TOKEN', $cfg['bale_token'] ?? '');
define('BALE_CHAT_ID', $cfg['bale_chat_id'] ?? '');
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 5;                        // messages per IP...
const RATE_WINDOW = 600;                     // ...per 10 minutes

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean($value, int $max, bool $multiline = false): string {
    if (!is_string($value)) return '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $v = str_replace(["\r\n", "\r"], "\n", trim($v));
    $v = $multiline ? preg_replace(['/[ \t]+/', '/\n{3,}/'], [' ', "\n\n"], $v) : preg_replace('/\s+/u', ' ', $v);
    return mb_substr((string) $v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['ok' => false, 'error' => 'method_not_allowed']);

// Same-origin only
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://yasinsp.dev', 'https://www.yasinsp.dev'], true)) {
    respond(403, ['ok' => false, 'error' => 'forbidden']);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) respond(413, ['ok' => false, 'error' => 'payload_too_large']);
$in = json_decode($raw, true);
if (!is_array($in)) respond(400, ['ok' => false, 'error' => 'invalid_request']);

// Bots that fill the hidden field get a quiet success.
if (!empty($in['honeypot']) && is_string($in['honeypot']) && trim($in['honeypot']) !== '') respond(200, ['ok' => true]);

$categories = ['website', 'collaboration', 'employment', 'consultation', 'other'];
$methodsAllowed = ['email', 'phone', 'telegram', 'whatsapp', 'other'];
$errors = [];

$category = strtolower(clean($in['category'] ?? '', 32));
$name = clean($in['name'] ?? '', 80);
$message = clean($in['message'] ?? '', 2000, true);
$projectType = clean($in['projectType'] ?? '', 80);
$budget = clean($in['budget'] ?? '', 80);
$timeline = clean($in['timeline'] ?? '', 80);
$company = clean($in['company'] ?? '', 120);
$role = clean($in['role'] ?? '', 120);
$website = clean($in['website'] ?? '', 240);

if (!in_array($category, $categories, true)) $errors['category'] = 'invalid';
if (mb_strlen($name) < 2) $errors['name'] = 'too_short';
if (mb_strlen($message) < 10) $errors['message'] = 'too_short';

$methods = [];
foreach ((is_array($in['contactMethods'] ?? null) ? $in['contactMethods'] : []) as $m) {
    $m = strtolower(clean($m, 20));
    if (in_array($m, $methodsAllowed, true)) $methods[$m] = true;
}
$methods = array_keys($methods);
if (!$methods) $errors['contactMethods'] = 'invalid';

$details = is_array($in['contactDetails'] ?? null) ? $in['contactDetails'] : [];
$contacts = [];
foreach ($methods as $m) {
    $c = clean($details[$m] ?? '', 160);
    $contacts[$m] = $c;
    $ok = mb_strlen($c) >= 3;
    if ($ok && $m === 'email') $ok = (bool) filter_var($c, FILTER_VALIDATE_EMAIL);
    elseif ($ok && ($m === 'phone' || $m === 'whatsapp')) $ok = (bool) preg_match('/^\+?[0-9]{7,15}$/', preg_replace('/[\s().-]/', '', $c));
    elseif ($ok && $m === 'telegram') $ok = (bool) preg_match('/^@[a-zA-Z0-9_]{5,32}$/', $c);
    elseif ($ok && $m === 'other') $ok = mb_strlen($c) >= 4;
    if (!$ok) $errors["contact.$m"] = 'invalid';
}

if ($website !== '' && !preg_match('#^https?://#i', $website)) $errors['website'] = 'invalid_url';
if ($category === 'website') {
    if ($projectType === '') $errors['projectType'] = 'required';
    if ($timeline === '') $errors['timeline'] = 'required';
} elseif ($category === 'collaboration' || $category === 'employment') {
    if (mb_strlen($company) < 2) $errors['company'] = 'too_short';
    if ($role === '') $errors['role'] = 'required';
} elseif ($category === 'consultation' && $projectType === '') {
    $errors['projectType'] = 'required';
}

$started = (float) ($in['formStartedAt'] ?? 0);
$nowMs = microtime(true) * 1000;
if ($started <= 0 || $started > $nowMs + 300000 || $nowMs - $started < 1200 || $nowMs - $started > 86400000) $errors['form'] = 'invalid_timing';

if ($errors) respond(400, ['ok' => false, 'error' => 'invalid_request', 'fields' => $errors]);

// Rate limit per IP (file based; no database needed)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/yasinsp-contact-' . hash('sha256', $ip);
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(array_map('intval', file($rateFile, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > time() - RATE_WINDOW);
}
if (count($hits) >= RATE_LIMIT) respond(429, ['ok' => false, 'error' => 'too_many_requests']);
$hits[] = time();
@file_put_contents($rateFile, implode("\n", $hits));

$labels = ['website' => 'طراحی سایت', 'collaboration' => 'همکاری پروژه‌ای', 'employment' => 'پیشنهاد شغلی', 'consultation' => 'مشاوره', 'other' => 'سایر'];
$methodLabels = ['email' => 'ایمیل', 'phone' => 'تلفن', 'telegram' => 'تلگرام', 'whatsapp' => 'واتساپ', 'other' => 'راه ارتباطی دیگر'];

$lines = ["دسته: {$labels[$category]}", "نام: $name"];
foreach ($contacts as $m => $c) $lines[] = "{$methodLabels[$m]}: $c";
foreach (['projectType' => 'نوع پروژه', 'budget' => 'بودجه', 'timeline' => 'زمان‌بندی', 'company' => 'شرکت', 'role' => 'نقش', 'website' => 'وب‌سایت'] as $k => $label) {
    if (${$k} !== '') $lines[] = "$label: " . ${$k};
}
$lines[] = '';
$lines[] = $message;
$body = implode("\n", $lines);

// Reply-To is the visitor's email when they gave one
$replyTo = $contacts['email'] ?? '';
$headers = "From: yasinsp.dev <" . FROM_EMAIL . ">\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
if ($replyTo !== '') $headers .= "Reply-To: " . str_replace(["\r", "\n"], '', $replyTo) . "\r\n";
$subject = '=?UTF-8?B?' . base64_encode("پیام جدید از سایت: {$labels[$category]} — $name") . '?=';

$mailed = TO_EMAIL !== '' && @mail(TO_EMAIL, $subject, $body, $headers, '-f' . FROM_EMAIL);

// Bale bot (same Bot API shape as Telegram, hosted inside Iran)
$baled = false;
if (BALE_TOKEN !== '' && BALE_CHAT_ID !== '' && function_exists('curl_init')) {
    $ch = curl_init('https://tapi.bale.ai/bot' . BALE_TOKEN . '/sendMessage');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode(['chat_id' => BALE_CHAT_ID, 'text' => "📩 پیام جدید از yasinsp.dev\n\n" . $body], JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 8,
    ]);
    $res = curl_exec($ch);
    $baled = $res !== false && (json_decode($res, true)['ok'] ?? false) === true;
    curl_close($ch);
}

// Backup copy outside public_html so nothing is lost if mail is filtered
$logDir = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__);
$logged = @file_put_contents($logDir . '/contact-messages.log', '[' . date('c') . "] $ip\n$body\n----------------------------------------\n", FILE_APPEND | LOCK_EX) !== false;

if (!$mailed && !$baled && !$logged) respond(502, ['ok' => false, 'error' => 'delivery_unavailable']);
respond(200, ['ok' => true]);
