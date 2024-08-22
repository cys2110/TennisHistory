from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import json
import time

players_file = 'new-players.csv'
players = []
player = ''
new_file = 'add-players.csv'
all_players_file = 'players.csv'

with open(players_file, mode='r', encoding='utf-8-sig') as player_file:
    players_data = list(csv.reader(player_file, delimiter=','))
    player = ','.join(players_data[-1])
    for p in players_data:
        players.append(','.join(p))

driver = webdriver.Chrome()
driver.get(f"https://www.atptour.com/en/players/x/{player}/overview")
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'atp_layout-container')))
stats = driver.find_element(By.XPATH, '/html/body/div[3]/div/div/div[1]/div[2]/div[2]/div[2]')

# Name
name_element = driver.find_element(By.XPATH, '/html/body/div[3]/div/div/div[1]/div[1]/span')
full_name = name_element.text.title().split(' ')

# CH
ch_element = stats.find_element(By.CLASS_NAME, 'stat')
ch_details = ch_element.text.split('\nCareer High Rank (')

# WL
wins_element = stats.find_element(By.CLASS_NAME, 'wins')
wl = wins_element.text.replace('\nW-L', '').split(' - ')

# Titles
titles_element = stats.find_element(By.CLASS_NAME, 'titles')
titles = int(titles_element.text.replace('\nTitles', ''))

# PM
pm_element = stats.find_element(By.CLASS_NAME, 'prize_money')
pm = int(pm_element.text.replace('$', '').replace('\nPrize Money Singles & Doubles Combined', '').replace(',', ''))

player_info = {
    'first_name': full_name[0],
    'last_name': full_name[1],
    'career_high': int(ch_details[0]),
    'ch_date': ch_details[1].replace(')', '').replace('.', '-'),
    'wins': int(wl[0]),
    'loss': int(wl[1]),
    'titles': titles,
    'pm_USD': pm
}

# # Personal details
details_element = driver.find_element(By.CLASS_NAME, 'pd_content')
details = details_element.find_elements(By.TAG_NAME, 'li')

for detail in details:
    item = detail.find_elements(By.TAG_NAME, 'span')
    if item[0].text == 'DOB':
        if item[1].text == '':
            player_info['dob'] = item[1].text
        else:
            player_info['dob'] = item[1].text.replace('.', '-')
    elif item[0].text == 'Country':
        player_info['country'] = item[1].text
    elif item[0].text == 'Height':
        if item[1].text == '(cm)':
            player_info['height_cm'] = ''
        else:
            height = item[1].text.split('(')
            player_info['height_cm'] = int(height[1].replace('cm)', ''))
    elif item[0].text == 'Turned pro':
        if item[1].text == '':
            player_info['turned_pro'] = item[1].text
        else:
            player_info['turned_pro'] = int(item[1].text)
    elif item[0].text == 'Coach':
        if item[1].text == '':
            player_info['coaches'] = item[1].text
        else:
            player_info['coaches'] = item[1].text.replace(',', ';')
    elif item[0].text == 'Plays':
        array = item[1].text.split(',')
        if array[0] == 'Left-Handed':
            player_info['rh'] = False
        elif array[0] == 'Right-Handed':
            player_info['rh'] = True
        else:
            player_info['rh'] = ''
        if array[1] == 'Unknown Backhand':
            player_info['bh1'] = ''
        elif array[1] == ' Two-Handed Backhand':
            player_info['bh1'] = False
        else:
            player_info['bh1'] = True
        print(array[1])

fieldnames = ["first_name","last_name","career_high","ch_date","wins","loss","titles","pm_USD","dob","height_cm","turned_pro","country","rh","bh1","coaches"]

with open(new_file, 'a', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    csvfile.seek(0, 2)
    if csvfile.tell() == 0:
        writer.writeheader()

    writer.writerow(player_info)

players = players[:-1]

with open(players_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    for p in players:
        writer.writerow([p])

with open(all_players_file, 'a', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow([player])