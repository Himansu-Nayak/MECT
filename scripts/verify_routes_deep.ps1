$routes = @(
  @{ Path = '/'; Expected = 'Mahaveer Educational & Charitable Trust'; Type = 'Public Homepage' },
  @{ Path = '/about'; Expected = 'Trustees'; Type = 'About Page' },
  @{ Path = '/programmes'; Expected = 'Programmes'; Type = 'Programmes Directory' },
  @{ Path = '/donate'; Expected = 'Donate'; Type = 'Donation Engine' },
  @{ Path = '/contact'; Expected = 'Contact'; Type = 'Contact Page' },
  @{ Path = '/governance'; Expected = 'Governance'; Type = 'Governance Framework' },
  @{ Path = '/statutory-disclosures'; Expected = '12A'; Type = 'Statutory Disclosures' },
  @{ Path = '/reports'; Expected = 'Reports'; Type = 'Annual Reports' },
  @{ Path = '/impact'; Expected = 'Impact'; Type = 'Impact Metrics' },
  @{ Path = '/csr-partnerships'; Expected = 'CSR'; Type = 'CSR Collaboration' },
  @{ Path = '/faq'; Expected = 'Frequently Asked Questions'; Type = 'FAQ' },
  @{ Path = '/privacy'; Expected = 'Privacy Policy'; Type = 'Privacy Policy' },
  @{ Path = '/terms'; Expected = 'Terms of Use'; Type = 'Terms of Use' },
  @{ Path = '/accessibility'; Expected = 'Accessibility'; Type = 'Accessibility Statement' },
  @{ Path = '/volunteer'; Expected = 'Volunteer'; Type = 'Volunteer Application' },
  @{ Path = '/scholarships'; Expected = 'Scholarship'; Type = 'Scholarships Portal' },
  @{ Path = '/scholarships/apply'; Expected = 'Application'; Type = 'Scholarship Intake' },
  @{ Path = '/scholarships/track'; Expected = 'Track'; Type = 'Scholarship Tracker' },
  @{ Path = '/portal/login'; Expected = 'Sign In'; Type = 'Donor Portal Login' },
  @{ Path = '/portal/welcome'; Expected = 'Welcome'; Type = 'Donor Welcome' },
  @{ Path = '/admin/login'; Expected = 'Admin'; Type = 'Admin Sign-in' }
)

$results = @()

foreach ($r in $routes) {
  $url = "https://mect.org.in" + $r.Path
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10 -MaximumRedirection 0
    $sw.Stop()
    $content = $res.Content
    $hasExpected = if ($content -match $r.Expected) { "YES" } else { "NO" }
    $titleMatch = if ($content -match '<title>(.*?)</title>') { $matches[1] } else { "N/A" }
    
    $results += [PSCustomObject]@{
      Path = $r.Path
      Status = [int]$res.StatusCode
      ContentType = $res.Headers["Content-Type"]
      LatencyMs = $sw.ElapsedMilliseconds
      ExpectedContent = $hasExpected
      PageTitle = $titleMatch
      Redirect = "None"
    }
  } catch {
    $sw.Stop()
    $resp = $_.Exception.Response
    $statusCode = if ($resp) { [int]$resp.StatusCode } else { 0 }
    $location = if ($resp -and $resp.Headers["Location"]) { $resp.Headers["Location"] } else { "None" }
    $contentType = if ($resp -and $resp.Headers["Content-Type"]) { $resp.Headers["Content-Type"] } else { "N/A" }
    
    $results += [PSCustomObject]@{
      Path = $r.Path
      Status = $statusCode
      ContentType = $contentType
      LatencyMs = $sw.ElapsedMilliseconds
      ExpectedContent = "N/A"
      PageTitle = "N/A"
      Redirect = $location
    }
  }
}

$results | Format-Table -AutoSize
