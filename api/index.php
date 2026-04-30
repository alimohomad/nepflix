<?php
// Simple API endpoint for Nepflix
// Returns URL in parameter format: url=https://anything.com

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: text/plain');

// You can store the current target in a file, database, or hardcode it
$targetFile = __DIR__ . '/target.txt';

// Default target
$defaultTarget = 'https://graph.vshield.pro';

// Read current target from file
if (file_exists($targetFile)) {
    $currentTarget = trim(file_get_contents($targetFile));
    if (empty($currentTarget) || !filter_var($currentTarget, FILTER_VALIDATE_URL)) {
        $currentTarget = $defaultTarget;
    }
} else {
    $currentTarget = $defaultTarget;
}

// Return in parameter format
echo "url=" . urlencode($currentTarget);
?>
