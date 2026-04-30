<?php
// Live Visitor Tracking API
// Tracks active visitors on nepflix.eu.cc in real-time

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');

$dataFile = __DIR__ . '/visitors.json';
$timeout = 30; // Consider visitor offline after 30 seconds of inactivity

// Initialize data file if not exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['visitors' => []]));
}

// Read current visitors
$data = json_decode(file_get_contents($dataFile), true);
if (!isset($data['visitors'])) {
    $data = ['visitors' => []];
}

$currentTime = time();
$action = $_GET['action'] ?? 'ping';

// Clean up inactive visitors (older than timeout)
$data['visitors'] = array_filter($data['visitors'], function($visitor) use ($currentTime, $timeout) {
    return ($currentTime - $visitor['lastSeen']) < $timeout;
});

if ($action === 'ping') {
    // Visitor heartbeat - update or add visitor
    $visitorId = $_GET['id'] ?? uniqid('visitor_', true);
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    
    // Update existing or add new visitor
    $found = false;
    foreach ($data['visitors'] as &$visitor) {
        if ($visitor['id'] === $visitorId) {
            $visitor['lastSeen'] = $currentTime;
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        $data['visitors'][] = [
            'id' => $visitorId,
            'ip' => $ip,
            'userAgent' => substr($userAgent, 0, 100),
            'firstSeen' => $currentTime,
            'lastSeen' => $currentTime
        ];
    }
    
    // Save updated data
    file_put_contents($dataFile, json_encode($data));
    
    // Return visitor count and ID
    echo json_encode([
        'success' => true,
        'visitorId' => $visitorId,
        'activeVisitors' => count($data['visitors']),
        'timestamp' => $currentTime
    ]);
    
} elseif ($action === 'count') {
    // Just return current visitor count
    echo json_encode([
        'success' => true,
        'activeVisitors' => count($data['visitors']),
        'timestamp' => $currentTime
    ]);
    
} elseif ($action === 'list') {
    // Return detailed visitor list (admin only)
    $apiKey = $_GET['key'] ?? '';
    $secretKey = 'your-secret-key-here'; // Change this!
    
    if ($apiKey !== $secretKey) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'success' => false]);
        exit;
    }
    
    // Return full visitor details
    $visitors = array_map(function($v) use ($currentTime) {
        return [
            'id' => substr($v['id'], 0, 16) . '...',
            'ip' => $v['ip'],
            'duration' => $currentTime - $v['firstSeen'],
            'lastActive' => $currentTime - $v['lastSeen']
        ];
    }, $data['visitors']);
    
    echo json_encode([
        'success' => true,
        'activeVisitors' => count($data['visitors']),
        'visitors' => $visitors,
        'timestamp' => $currentTime
    ]);
    
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action', 'success' => false]);
}
?>
