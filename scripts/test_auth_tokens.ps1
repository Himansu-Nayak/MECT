# Test 1: Unauthenticated Admin API
$res1 = try { Invoke-WebRequest -Uri "https://mect.org.in/api/v1/admin/donations" -UseBasicParsing } catch { $_.Exception.Response }
$status1 = if ($res1) { [int]$res1.StatusCode } else { 0 }
Write-Host "1. Unauthenticated /api/v1/admin/donations: $status1"

# Test 2: Unauthenticated Portal API
$res2 = try { Invoke-WebRequest -Uri "https://mect.org.in/api/v1/portal/dashboard" -UseBasicParsing } catch { $_.Exception.Response }
$status2 = if ($res2) { [int]$res2.StatusCode } else { 0 }
Write-Host "2. Unauthenticated /api/v1/portal/dashboard: $status2"

# Test 3: Invalid JWT to Admin API
$fakeJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZha2UgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
$headers3 = @{ Authorization = "Bearer $fakeJwt" }
$res3 = try { Invoke-WebRequest -Uri "https://mect.org.in/api/v1/admin/donations" -Headers $headers3 -UseBasicParsing } catch { $_.Exception.Response }
$status3 = if ($res3) { [int]$res3.StatusCode } else { 0 }
Write-Host "3. Invalid JWT to /api/v1/admin/donations: $status3"

# Test 4: Expired JWT (issued in 2020)
$expiredJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU3Nzg0NjQwMCwiaWF0IjoxNTc3NzYwMDAwfQ.invalid_sig"
$headers4 = @{ Authorization = "Bearer $expiredJwt" }
$res4 = try { Invoke-WebRequest -Uri "https://mect.org.in/api/v1/admin/donations" -Headers $headers4 -UseBasicParsing } catch { $_.Exception.Response }
$status4 = if ($res4) { [int]$res4.StatusCode } else { 0 }
Write-Host "4. Expired JWT to /api/v1/admin/donations: $status4"

