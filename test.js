import https from 'https';

https.get('https://ko-fi.com/widgets/widget_2.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 1000)));
});
