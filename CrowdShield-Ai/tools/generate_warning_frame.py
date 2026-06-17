import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from detect import draw_status_bar
import numpy as np
import cv2

out = os.path.join(os.path.dirname(__file__), 'warning_frame.jpg')
img = np.zeros((480,640,3), dtype=np.uint8) + 60
img = draw_status_bar(img, 'Main Gate', 11, 'WARNING')
cv2.imwrite(out, img)
print('saved', out)
