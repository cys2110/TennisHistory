from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import json
import time

players_file = 'players.csv'
new_players_file = 'new-players.csv'
all_players = []
new_players = []

with open(players_file, mode='r', encoding='utf-8-sig') as player_file:
    players_data = csv.reader(player_file, delimiter=',')
    for player in players_data:
        all_players.append(','.join(player))

filename = 'test.json'
driver = webdriver.Chrome()
driver.get("https://www.atptour.com/en/scores/archive/bournemouth/347/1968/draws?matchtype=singles")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

buttons = driver.find_elements(By.CLASS_NAME, 'button')
matches = []

for index, button in enumerate(buttons):
    if button.text != 'Previous' and button.text != '':
        button.click()
        time.sleep(1)

        round = driver.find_element(By.CLASS_NAME, f"draw-round-{index}")
        round_header = round.find_element(By.CLASS_NAME, 'draw-header')

        matches_list = round.find_elements(By.CLASS_NAME, 'draw-item')
        match_no = 0

        for match in matches_list:
            match_no += 1

            # Players info
            players = match.find_elements(By.CLASS_NAME, 'name')
            ps = []
            for player in players:
                player_link = player.find_element(By.TAG_NAME, 'a')
                href = player_link.get_attribute('href')
                link = (href.replace("https://www.atptour.com/en/players/", '').replace("/overview", '')).split('/')
                ps.append(link[1])

                if index == 1 and link[1] not in all_players:
                    new_players.append(link[1])

            match_info = {
                'id': f"3471968 {button.text} {match_no}",
                'match_no': len(matches) + 1,
                'round': round_header.text,
                'p1': {
                    'id': ps[0]
                },
                'p2': {
                    'id': ps[1]
                }
            }

            # Scores
            scores = match.find_elements(By.CLASS_NAME, 'scores')
            p2_scores = []

            p1 = scores[0].find_elements(By.CLASS_NAME, 'score-item')
            for index, p in enumerate(p1):
                if p.text != '':
                    match_info['p1'][f"s{index + 1}"] = int(p.text)


            p2 = scores[1].find_elements(By.CLASS_NAME, 'score-item')
            for index, p in enumerate(p2):
                if p.text != '':
                    match_info['p2'][f"s{index + 1}"] = int(p.text)

            matches.append(match_info)

driver.quit()

with open(new_players_file, 'a', newline='') as csvfile:
    playerwriter = csv.writer(csvfile)
    if len(new_players) == 1:
        playerwriter.writerow(new_players)
    else:
        for player in new_players:
            playerwriter.writerow([player])

json_object = json.dumps(matches, indent=4)

with open(filename, 'w') as jsonfile:
    jsonfile.write(json_object)