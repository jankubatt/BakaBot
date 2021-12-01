import webbrowser, pyautogui, time, os
from PIL import Image
color = (112, 230, 23)
found = False

webbrowser.open("https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F")
time.sleep(5)

s = pyautogui.screenshot()
for x in range(s.width):
    if found == True:
        break
    for y in range(s.height):
        if s.getpixel((x, y)) == color:
            pyautogui.click(x, y)
            pyautogui.moveTo(0,0)
            found = True
            break
            

time.sleep(5)

myScreenshot = pyautogui.screenshot(region=(250, 230, 1130, 740))
myScreenshot.save(r'C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot.png')

img1 = Image.open('C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot.png')
img2 = Image.open('C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot_old.png')

if list(img1.getdata()) == list(img2.getdata()):
    print("Identical")
else:
    print("Different")

os.remove("C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot_old.png")
os.rename("C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot.png", "C:/Users/Honza/Projects/BalinBot/PythonBrikule/screenshot_old.png")