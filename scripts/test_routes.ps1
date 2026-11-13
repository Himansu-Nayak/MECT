$routes = @(
  '/', '/about', '/programmes', '/donate', '/contact', '/governance', 
  '/statutory-disclosures', '/reports', '/impact', '/csr-partnerships', 
  '/faq', '/privacy', '/terms', '/accessibility', '/volunteer', 
  '/scholarships', '/scholarships/apply', '/scholarships/track', 
  '/portal/login', '/portal/welcome', '/admin/login'
)
$results = @()
foreach ($r in $routes) {
  try {
    $res = Invoke-WebRequest -Uri ("https://mect.org.in" + $r) -UseBasicParsing -TimeoutSec 10
    $results += [PSCustomObject]@{ Route = $r; Status = [int]$res.StatusCode }
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    $results += [PSCustomObject]@{ Route = $r; Status = $code }
  }
}
$results | Format-Table -AutoSize
