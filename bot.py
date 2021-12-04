# Importing libraries
import time, discord, asyncio, webbrowser, pyautogui, time, os
from PIL import Image
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.abspath("bot.py"))

client = discord.Client()

async def my_background_task():
    await client.wait_until_ready()
    channel = client.get_channel(id=845595321953550337) # replace with channel_id 888015751846441020 
    while not client.is_closed():
            webbrowser.open("https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F")
            pyautogui.moveTo(684, 505)

            time.sleep(20)
            
            pyautogui.click()
            pyautogui.moveTo(10,10)
            
            time.sleep(10)
            
            myScreenshot = pyautogui.screenshot(region=(150, 150, 900  , 600))
            screenPath = ROOT_DIR + "/screenshot.png"
            myScreenshot.save(screenPath)

            time.sleep(1)

            img1 = Image.open(ROOT_DIR + '/screenshot.png')
            img2 = Image.open(ROOT_DIR + '/screenshot_old.png')

            time.sleep(1)

            if list(img1.getdata()) == list(img2.getdata()):
                print("Identical")
                os.remove(ROOT_DIR + "/screenshot_old.png")
                time.sleep(1)
                os.rename(ROOT_DIR + "/screenshot.png", ROOT_DIR + "/screenshot_old.png")
            else:
                print("Different")
                await channel.send("Na bakaláře mrdnuli supl píčo. Běž se podívat co skipneš zmrde.")
                now = str(datetime.now().time())
                os.rename(ROOT_DIR + "/screenshot.png", ROOT_DIR + "/screenshot_taken_" + now + ".png")
                os.rename(ROOT_DIR + "/screenshot_old.png", ROOT_DIR + "/screenshot_taken_" + now + "_old.png")

            time.sleep(1)
            pyautogui.keyDown('ctrl')
            time.sleep(1)
            pyautogui.press('w')
            time.sleep(1)
            pyautogui.keyUp('ctrl')
            await asyncio.sleep(60)

@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)

client.loop.create_task(my_background_task())

client.run('NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.nFkBhL-FMMD-IpQ9Zw6JaRGyA4k')


 

    
