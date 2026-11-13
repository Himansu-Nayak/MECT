$authTests = @(
  @{ Path = '/api/v1/admin/donations'; Desc = 'Backend Admin API' },
  @{ Path = '/api/v1/portal/donations'; Desc = 'Backend Donor Portal API' },
  @{ Path = '/admin'; Desc = 'Admin Dashboard Frontend Route' },
  @{ Path = '/portal/dashboard'; Desc = 'Donor Dashboard Frontend Route' }
)
$results = @()
foreach ($t in $authTests) {
  try {
    $res = Invoke-WebRequest -Uri ('https://mect.org.in' + $t.Path) -UseBasicParsing -MaximumRedirection 0
    $results += [PSCustomObject]@{ Desc = $t.Desc; Path = $t.Path; Status = [int]$res.StatusCode; Redirect = $res.Headers['Location'] }
  } catch {
    $r = $_.Exception.Response
    $st = if ($r) { [int]$r.StatusCode } else { 0 }
    $loc = if ($r -and $r.Headers['Location']) { $r.Headers['Location'] } else { 'None' }
    $results += [PSCustomObject]@{ Desc = $t.Desc; Path = $t.Path; Status = $st; Redirect = $loc }
  }
}
$results | Format-Table -AutoSize
