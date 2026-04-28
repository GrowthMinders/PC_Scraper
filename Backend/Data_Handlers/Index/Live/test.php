<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5501");
header("Content-Type: application/json");

// ---- EXE PATH ----
// Use forward slashes or escaped backslashes; forward slashes are safer in PHP strings
$exePath = "C:/xampp/htdocs/Scraper/Driver_Executers/gpumonitor_client.exe";

if (!file_exists($exePath)) {
    echo json_encode(["error" => "EXE not found at path: " . $exePath]);
    exit;
}

// ---- RUN EXE ----
// shell_exec captures the entire output as a single string, which is better for JSON
$rawOutput = shell_exec('"' . $exePath . '" 2>&1');

if ($rawOutput === null) {
    echo json_encode(["error" => "Failed to execute EXE"]);
    exit;
}

// ---- CLEAN & EXTRACT ----
// Find the first '{' and the last '}' to strip any potential warnings or debug text
$start = strpos($rawOutput, '{');
$end = strrpos($rawOutput, '}');

if ($start === false || $end === false) {
    echo json_encode([
        "error" => "No valid JSON structure found",
        "raw_output" => $rawOutput
    ]);
    exit;
}

$jsonString = substr($rawOutput, $start, ($end - $start) + 1);

// ---- DECODE ----
$data = json_decode($jsonString, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "error" => "JSON decode failed",
        "msg" => json_last_error_msg(),
        "cleaned_string" => $jsonString
    ]);
    exit;
}

// ---- RETURN DATA ----
// Return the 'gpus' array as requested
echo json_encode($data["gpus"] ?? []);
exit;
?>
