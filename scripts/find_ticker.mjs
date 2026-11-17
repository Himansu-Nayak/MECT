async function test() {
  const res = await fetch("https://mect.org.in/");
  const html = await res.text();
  console.log("Length:", html.length);
  
  const matches = [...html.matchAll(/(.{0,100}(?:Regd\. Public Charitable Trust|Divine Vision|Statutory Notice).{0,100})/g)];
  for (const m of matches) {
    console.log("MATCH:", m[1].replace(/[\n\r]+/g, " "));
  }
}
test();
