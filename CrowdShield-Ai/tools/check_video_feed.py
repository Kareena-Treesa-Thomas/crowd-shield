import urllib.request, time, sys, os

url = 'http://127.0.0.1:5050/video_feed'
print('checking', url)
try:
    r = urllib.request.urlopen(url, timeout=10)
except Exception as e:
    print('error opening stream', e)
    sys.exit(2)

print('Content-Type:', r.getheader('Content-Type'))
buf = b''
start = time.time()
while time.time() - start < 10:
    chunk = r.read(4096)
    if not chunk:
        break
    buf += chunk
    i = buf.find(b'\xff\xd8')
    if i != -1:
        j = buf.find(b'\xff\xd9', i+2)
        if j != -1:
            img = buf[i:j+2]
            out = os.path.join(os.path.dirname(__file__), 'frame.jpg')
            with open(out, 'wb') as f:
                f.write(img)
            print('saved', out, 'size', len(img))
            sys.exit(0)

print('no frame found, read bytes', len(buf))
sys.exit(1)
