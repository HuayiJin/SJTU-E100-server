#!/usr/bin/env python3
from chardet import detect
fn = 'test.csv'
with open(fn, 'rb') as f:
    s = f.read()
coding = detect(s)['encoding']
print('coding: {}'.format(coding))
format(s.decode(coding).rstrip())
newf = 'b.csv'
with open(newf, 'wb') as f:
    f.write(s.decode(coding).encode('utf8'))
print('done!')
format(newf)