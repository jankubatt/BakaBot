# Importing libraries
import hashlib, time, discord, asyncio, requests
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup

# setting the URL you want to monitor
url = Request('https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F',
              headers={'User-Agent': 'Mozilla/5.0'})

url = requests.post("https://spsul.bakalari.cz/Login", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9,cs;q=0.8",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://spsul.bakalari.cz/login?ReturnUrl=/Timetable/Public/Actual/Class/2F",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "username=jankubat&password=4Ajs0E8M&returnUrl=%2FTimetable%2FPublic%2FActual%2FClass%2F2F&login=",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})



soup = BeautifulSoup(url.text, "lxml")
print(soup)

print(url.history)

response = url
currentHash = hashlib.sha224(response).hexdigest()
client = discord.Client()

async def my_background_task():
    await client.wait_until_ready()
    channel = client.get_channel(id=845595321953550337) # replace with channel_id 888015751846441020 
    while not client.is_closed():
            try:
                time.sleep(1)
                response = urlopen(url).read()
                currentHash = hashlib.sha224(response).hexdigest()
                time.sleep(3)
                response = urlopen(url).read()
                newHash = hashlib.sha224(response).hexdigest()
                if newHash != currentHash:
                    await channel.send("Na bakaláře mrdnuli supl píčo. Běž se podívat co skipneš zmrde.")
                    response = urlopen(url).read()
                    currentHash = hashlib.sha224(response).hexdigest()
                    time.sleep(3)
                else:
                    print("nic")
                    
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


 

    