param([string]$Command)

$projectDir = "C:\Users\ranki\Downloads\kunjahomestay"
Set-Location $projectDir

$ npmScript = "& 'C:\Program Files\nodejs\npm.ps1' exec 'npx' prisma"
$result = Invoke-Expression "$npmScript $Command 2>&1"
Write-Output $result