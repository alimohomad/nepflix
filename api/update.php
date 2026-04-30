<?php
// Admin endpoint to update the target URL
// Usage: update.php?url=https://newsite.com&key=your-secret-key

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$secretKey = 'your-secret-key-here'; // Change this!
$targetFile = __DIR__ . '/target.txt';

// Get parameters
$newUrl = $_GET['url'] ?? '';
$apiKey = $_GET['key'] ?? '';

// Validate API key
if ($apiKey !== $secretKey) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized', 'success' => false]);
    exit;
}

// Validate URL
if (empty($newUrl) || !filter_var($newUrl, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL', 'success' => false]);
    exit;
}

// Save to file
if (file_put_contents($targetFile, $newUrl) !== false) {
    echo json_encode([
        'success' => true,
        'url' => $newUrl,
        'updatedAt' => date('c')
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save', 'success' => false]);
}
?>
