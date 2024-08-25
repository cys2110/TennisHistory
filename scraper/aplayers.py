from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv

players_file = 'players.csv'
players = []
new_players = []

tid = 560
year = 1968

with open(players_file, mode='r', encoding='utf-8-sig') as csvfile:
    players_data = list(csv.reader(csvfile, delimiter=','))
    for p in players_data[1:]:
        players.append(','.join(p))

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/draws?matchtype=singles")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

button = driver.find_element(By.CLASS_NAME, 'button-round-1')
button.click()
time.sleep(1)

round = driver.find_element(By.XPATH, '/html/body/div[3]/div/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[3]/div/div[5]/div/div[1]/div[2]')
players_list = round.find_elements(By.CLASS_NAME, 'name')

for player in players_list:
    try:
        links = player.find_elements(By.TAG_NAME, 'a')
        for link in links:
            href = link.get_attribute('href')

            id = (href.replace("https://www.atptour.com/en/players/", '').replace("/overview", '')).split('/')[1]

            if id not in players:
                new_players.append(id)
    except:
        continue

print(new_players)