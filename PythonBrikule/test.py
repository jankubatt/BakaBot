import webbrowser, pyautogui, time
import sys
from skimage.transform import resize
import skimage.measure
import scipy
from PIL import Image

#webbrowser.open("https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F")

#time.sleep(3)

#myScreenshot = pyautogui.screenshot(region=(250, 230, 1130, 740))
#myScreenshot.save(r'screenshot2.png')

img_a = Image.open('C:/Users/Honza/Projects/PythonBrikule/screenshot.png')
img_b = Image.open('C:/Users/Honza/Projects/PythonBrikule/screenshot2.png')

# get two images - resize both to 1024 x 1024
img_a = resize(scipy.imread(sys.argv[1]), (2**10, 2**10))
img_b = resize(scipy.imread(sys.argv[2]), (2**10, 2**10))

# score: {-1:1} measure of the structural similarity between the images
score, diff = skimage.compare_ssim(img_a, img_b, full=True)
print(score)