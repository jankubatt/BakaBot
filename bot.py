# Importing libraries
import time, discord, asyncio
import webbrowser, pyautogui, time, os
from PIL import Image

client = discord.Client()


async def my_background_task():
    await client.wait_until_ready()
    channel = client.get_channel(id=845595321953550337) # replace with channel_id 888015751846441020 
    while not client.is_closed():
            try:
                color = (112, 230, 23)
                found = False
                webbrowser.open("https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F")
                time.sleep(5)
                print("Checking login button")
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
                            
                print("done")
                time.sleep(5)

                myScreenshot = pyautogui.screenshot(region=(250, 230, 1130, 740))
                myScreenshot.save(r'C:/Users/Honza/Projects/BalinBot/screenshot.png')

                time.sleep(1)

                img1 = Image.open('C:/Users/Honza/Projects/BalinBot/screenshot.png')
                img2 = Image.open('C:/Users/Honza/Projects/BalinBot/screenshot_old.png')

                if list(img1.getdata()) == list(img2.getdata()):
                    print("Identical")
                else:
                    print("Different")
                    await channel.send("Na bakaláře mrdnuli supl píčo. Běž se podívat co skipneš zmrde.")
                #time.sleep(15)
                os.remove("C:/Users/Honza/Projects/BalinBot/screenshot_old.png")
                time.sleep(1)
                os.rename("C:/Users/Honza/Projects/BalinBot/screenshot.png", "C:/Users/Honza/Projects/BalinBot/screenshot_old.png")
                #time.sleep()   

            except Exception as e:
                print(e)

            await asyncio.sleep(1)

@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)

client.loop.create_task(my_background_task())

client.run('NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.Tna0DF1G-pd440v1Ho42QYllRVg')


 

    